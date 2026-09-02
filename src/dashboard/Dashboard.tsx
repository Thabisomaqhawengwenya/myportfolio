import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { DashboardLogin } from './components/DashboardLogin';
import { OverviewPage } from './pages/OverviewPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { CalendarPage } from './pages/CalendarPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AICompanion } from './components/AICompanion';

interface Project {
  id: string;
  category: 'personal' | 'business' | 'education' | 'utility' | 'gift';
  title: string;
  description: string;
  tags: string[];
  image?: string;
  isEmganwiniImage?: boolean;
  placeholder?: {
    badge: string;
    title: string;
    copy: string;
    mediaClass: 'media-five' | 'media-six';
  };
  liveDemoUrl?: string;
  githubUrl?: string;
  order?: number;
}

export const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'calendar' | 'analytics' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Firebase Auth states
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Theme states with localStorage persistence
  const [dashboardTheme, setDashboardTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem('dashboard-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      const portfolioTheme = localStorage.getItem('portfolio-theme');
      return portfolioTheme === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = () => {
    const nextTheme = dashboardTheme === 'dark' ? 'light' : 'dark';
    setDashboardTheme(nextTheme);
    localStorage.setItem('dashboard-theme', nextTheme);
  };

  // Profile states with localStorage persistence
  const [profileName, setProfileName] = useState(() => localStorage.getItem('donezo_profile_name') || 'Maqhawe T');
  const [profileEmail, setProfileEmail] = useState(() => localStorage.getItem('donezo_profile_email') || 'thabisongwenya39@gmail.com');
  const [profileRole, setProfileRole] = useState(() => localStorage.getItem('donezo_profile_role') || 'Software Engineer');
  const [profileInitials, setProfileInitials] = useState(() => localStorage.getItem('donezo_profile_initials') || 'MT');

  // Listen to Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setProfileEmail(currentUser.email || '');
        const name = currentUser.displayName || currentUser.email?.split('@')[0] || 'Admin';
        setProfileName(name);
        // Extract initials
        const initials = name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        setProfileInitials(initials || 'AD');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = profileName.split(' ')[0];
    if (hour < 12) return `Good Morning, ${firstName}`;
    if (hour < 18) return `Good Afternoon, ${firstName}`;
    return `Good Evening, ${firstName}`;
  };

  // Load projects from Cloud Firestore
  useEffect(() => {
    if (!user) return;
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const list: Project[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Project);
        });

        if (list.length > 0) {
          list.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
          setProjects(list);
          setLoading(false);
        } else {
          // Fallback to local JSON if Firestore is empty
          const res = await fetch('/data/projects.json');
          if (res.ok) {
            const localData: Project[] = await res.json();
            localData.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
            setProjects(localData);
            
            // Auto-populate Firestore with local JSON so the database isn't empty
            for (let i = 0; i < localData.length; i++) {
              const proj = { ...localData[i], order: localData[i].order ?? i };
              await setDoc(doc(db, 'projects', proj.id), proj);
            }
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching projects from Firestore, falling back to local JSON:', err);
        const res = await fetch('/data/projects.json');
        if (res.ok) {
          const localData: Project[] = await res.json();
          localData.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
          setProjects(localData);
        }
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  // Save projects to Cloud Firestore
  const handleSaveProjects = async (updatedProjects: Project[]) => {
    // Ensure sequential order property
    const formattedProjects = updatedProjects.map((p, idx) => ({
      ...p,
      order: p.order ?? idx,
    }));

    setProjects(formattedProjects);
    setSaveStatus('saving');

    try {
      // 1. Get existing project IDs from Firestore
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const existingIds = new Set<string>();
      querySnapshot.forEach((docSnap) => {
        existingIds.add(docSnap.id);
      });

      // 2. Save/Upsert all projects in the updated list
      for (const project of formattedProjects) {
        const docRef = doc(db, 'projects', project.id);
        await setDoc(docRef, project, { merge: true });
        existingIds.delete(project.id);
      }

      // 3. Delete any projects that are no longer in the updated list
      for (const idToDelete of existingIds) {
        const docRef = doc(db, 'projects', idToDelete);
        await deleteDoc(docRef);
      }
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Error saving projects to Firestore:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleBackToPortfolio = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleBackToPortfolio();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (authLoading || (user && loading)) {
    return (
      <StyledLoader className={dashboardTheme === 'dark' ? 'dark-theme' : ''}>
        <div className="spinner"></div>
        <p>{authLoading ? 'Authenticating Admin...' : 'Loading Admin Dashboard...'}</p>
      </StyledLoader>
    );
  }

  if (!user) {
    return (
      <DashboardLogin theme={dashboardTheme} onBack={handleBackToPortfolio} />
    );
  }

  return (
    <StyledDashboard className={dashboardTheme === 'dark' ? 'dark-theme' : ''}>
      {/* Sidebar Panel */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-icon">
            <img
              src={dashboardTheme === 'light' ? '/images/p.logo.dark.png' : '/images/p.logo.light.png'}
              alt="Logo"
              className="dashboard-logo-img"
            />
          </div>
          <span className="logo-text">Yarry_06</span>
        </div>

        <div className="menu-group">
          <p className="menu-title">Menu</p>
          <button
            className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="item-icon">
              <Icon
                icon="lucide:layout-dashboard"
                width={20}
                height={20}
                style={{ color: activeTab === 'dashboard' ? '#1A73E8' : '#555555' }}
              />
            </span>{' '}
            Dashboard
          </button>
          <button
            className={`menu-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <span className="item-icon">
              <Icon
                icon="lucide:folder-open"
                width={20}
                height={20}
                style={{ color: activeTab === 'projects' ? '#1A73E8' : '#555555' }}
              />
            </span>{' '}
            Projects
            <span className="count-badge">{projects.length}</span>
          </button>
          <button
            className={`menu-item ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <span className="item-icon">
              <Icon
                icon="lucide:calendar"
                width={20}
                height={20}
                style={{ color: activeTab === 'calendar' ? '#1A73E8' : '#555555' }}
              />
            </span>{' '}
            Calendar
          </button>
          <button
            className={`menu-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <span className="item-icon">
              <Icon
                icon="lucide:bar-chart-3"
                width={20}
                height={20}
                style={{ color: activeTab === 'analytics' ? '#1A73E8' : '#555555' }}
              />
            </span>{' '}
            Analytics
          </button>
        </div>

        <div className="menu-group">
          <p className="menu-title">General</p>
          <button
            className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="item-icon">
              <Icon
                icon="lucide:settings"
                width={20}
                height={20}
                style={{ color: activeTab === 'settings' ? '#1A73E8' : '#555555' }}
              />
            </span>{' '}
            Settings
          </button>
          <button className="menu-item disabled">
            <span className="item-icon">
              <Icon
                icon="lucide:help-circle"
                width={20}
                height={20}
                style={{ color: '#555555' }}
              />
            </span>{' '}
            Help
          </button>
          <button className="menu-item logout-btn" onClick={handleLogout}>
            <span className="item-icon">
              <Icon
                icon="lucide:log-out"
                width={20}
                height={20}
                style={{ color: '#cf2c2c' }}
              />
            </span>{' '}
            Sign Out
          </button>
        </div>

      </aside>

      {/* Main Panel Content */}
      <div className="main-content-area">
        {/* Top Header */}
        <header className="main-header">
          <div className="search-bar">
            <span className="search-icon">
              <Icon
                icon="lucide:search"
                width={18}
                height={18}
                style={{ color: '#888888' }}
              />
            </span>
            <input
              type="text"
              placeholder="Search project, tags or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="shortcut-badge">⌘F</span>
          </div>

          <div className="header-actions">
            {saveStatus === 'saving' && <span className="status-indicator saving">Saving changes...</span>}
            {saveStatus === 'saved' && <span className="status-indicator saved">Changes saved on disk!</span>}
            {saveStatus === 'error' && <span className="status-indicator error">Save failed!</span>}
            
            <button 
              className="icon-action-btn theme-toggle-btn" 
              onClick={toggleTheme} 
              aria-label="Toggle dark/light mode"
              style={{ marginRight: '0.25rem' }}
            >
              <Icon
                icon={dashboardTheme === 'dark' ? "lucide:sun" : "lucide:moon"}
                width={20}
                height={20}
                style={{ color: dashboardTheme === 'dark' ? '#ffffff' : '#111111' }}
              />
            </button>
            <button className="icon-action-btn" aria-label="Mail notification">
              <Icon
                icon="lucide:mail"
                width={20}
                height={20}
                style={{ color: '#111111' }}
              />
            </button>
            <button className="icon-action-btn" aria-label="Alert notification">
              <Icon
                icon="lucide:bell"
                width={20}
                height={20}
                style={{ color: '#111111' }}
              />
            </button>
             <div className="user-profile" onClick={() => setActiveTab('settings')} style={{ cursor: 'pointer' }}>
               <div className="profile-pic">{profileInitials}</div>
               <div className="profile-info">
                 <h4>{profileName}</h4>
                 <p>{profileEmail}</p>
               </div>
             </div>
          </div>
        </header>

        {/* Dashboard Pages */}
        <main className="dashboard-body">
          <div className="dashboard-header-text">
            {activeTab === 'dashboard' && (
              <>
                 <h1>{getGreeting()}</h1>
                <p>Plan, prioritize, and accomplish your tasks with ease.</p>
              </>
            )}
            {activeTab === 'projects' && (
              <>
                <h1>Manage Projects</h1>
                <p>Add, edit, or delete items in your portfolio.</p>
              </>
            )}
            {activeTab === 'calendar' && (
              <>
                <h1>Milestones Calendar</h1>
                <p>Track project deadlines and schedule task notes.</p>
              </>
            )}
             {activeTab === 'analytics' && (
               <>
                 <h1>Visitor Analytics</h1>
                 <p>Monitor visitor traffic and portfolio engagement stats.</p>
               </>
             )}
             {activeTab === 'settings' && (
               <>
                 <h1>Admin Settings</h1>
                 <p>Manage your profile, system preferences and external portfolio links.</p>
               </>
             )}
          </div>

          {activeTab === 'dashboard' && (
            <OverviewPage
              projects={projects}
              onNavigateToTab={setActiveTab}
            />
          )}
           {activeTab === 'projects' && (
             <ProjectsPage
               projects={projects}
               onSaveProjects={handleSaveProjects}
               searchQuery={searchQuery}
             />
           )}
           {activeTab === 'calendar' && <CalendarPage />}
           {activeTab === 'analytics' && <AnalyticsPage />}
           {activeTab === 'settings' && (
             <SettingsPage
               profileName={profileName}
               profileEmail={profileEmail}
               profileRole={profileRole}
               onProfileUpdate={(name, email, role) => {
                 setProfileName(name);
                 setProfileEmail(email);
                 setProfileRole(role);
                 setProfileInitials(localStorage.getItem('donezo_profile_initials') || 'MT');
               }}
               onBackToPortfolio={handleBackToPortfolio}
             />
           )}
        </main>
      </div>

      {/* Floating Bottom Nav Bar for Mobile */}
      <nav className="mobile-bottom-nav">
        <button
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          aria-label="Dashboard"
        >
          <Icon
            icon="lucide:layout-dashboard"
            width={22}
            height={22}
            style={{ color: activeTab === 'dashboard' ? '#ffffff' : '#888888' }}
          />
          {activeTab === 'dashboard' && <span className="nav-text">Dashboard</span>}
        </button>
        <button
          className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
          aria-label="Projects"
        >
          <Icon
            icon="lucide:folder-open"
            width={22}
            height={22}
            style={{ color: activeTab === 'projects' ? '#ffffff' : '#888888' }}
          />
          {activeTab === 'projects' && <span className="nav-text">Projects</span>}
        </button>
        <button
          className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
          aria-label="Calendar"
        >
          <Icon
            icon="lucide:calendar"
            width={22}
            height={22}
            style={{ color: activeTab === 'calendar' ? '#ffffff' : '#888888' }}
          />
          {activeTab === 'calendar' && <span className="nav-text">Calendar</span>}
        </button>
        <button
          className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
          aria-label="Analytics"
        >
          <Icon
            icon="lucide:bar-chart-3"
            width={22}
            height={22}
            style={{ color: activeTab === 'analytics' ? '#ffffff' : '#888888' }}
          />
          {activeTab === 'analytics' && <span className="nav-text">Analytics</span>}
        </button>
      </nav>
      <AICompanion projects={projects} onSaveProjects={handleSaveProjects} />
    </StyledDashboard>
  );
};

const StyledLoader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f3f6fc;
  color: #333;
  transition: all 0.3s ease;

  &.dark-theme {
    background: #090d16;
    color: #f8fafc;
    
    .spinner {
      border-color: #1e293b;
      border-top-color: #38bdf8;
    }
  }

  .spinner {
    width: 3rem;
    height: 3rem;
    border: 4px solid #ddd;
    border-top: 4px solid #1A73E8;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  p {
    margin-top: 1rem;
    font-weight: 600;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const StyledDashboard = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  background: #f3f6fc;
  color: #333;
  transition: background 0.3s ease, color 0.3s ease;

  &.dark-theme {
    --bg-primary: #090d16;
    --bg-secondary: #0f172a;
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --border-color: #1e293b;
    --card-border: #1e293b;
    --input-bg: #1e293b;
    --input-border: #334155;
    --input-text: #f8fafc;
    --hover-bg: #1e293b;
    --active-menu-bg: #1e293b;
    --active-menu-text: #38bdf8;
    --badge-bg: #1e293b;
    --icon-color: #94a3b8;

    background: var(--bg-primary) !important;
    color: var(--text-primary) !important;

    /* Sidebar and Header Overrides */
    .sidebar {
      background: var(--bg-secondary) !important;
      border-right-color: var(--border-color) !important;

      .logo-text {
        color: var(--text-primary) !important;
      }
      .logo-icon {
        background: #1e293b !important;
      }
      .menu-title {
        color: #64748b !important;
      }
      .menu-item {
        color: var(--text-secondary) !important;

        &:hover {
          background: var(--hover-bg) !important;
          color: var(--text-primary) !important;
        }

        &.active {
          background: var(--active-menu-bg) !important;
          color: var(--active-menu-text) !important;
        }
      }
    }

    .main-header {
      background: var(--bg-secondary) !important;
      border-bottom-color: var(--border-color) !important;

      .icon-action-btn {
        background: var(--bg-secondary) !important;
        border-color: var(--border-color) !important;
        
        svg {
          color: var(--text-primary) !important;
        }

        &:hover {
          background: var(--hover-bg) !important;
        }
      }

      .user-profile {
        border-left-color: var(--border-color) !important;
        
        .profile-pic {
          background: #1e293b !important;
          color: #38bdf8 !important;
        }
        
        .profile-info {
          h4 {
            color: var(--text-primary) !important;
          }
          p {
            color: var(--text-secondary) !important;
          }
        }
      }
    }

    .search-bar {
      background: var(--input-bg) !important;
      border-color: var(--input-border) !important;

      input {
        color: var(--input-text) !important;

        &::placeholder {
          color: #64748b !important;
        }
      }
      
      .shortcut-badge {
        background: var(--bg-primary) !important;
        border-color: var(--border-color) !important;
        color: var(--text-secondary) !important;
      }
    }

    /* Subtitle and header overrides across pages */
    h1, h2, h3, h4, h5, h6,
    .dashboard-header-text h1,
    .dashboard-header-text p {
      color: var(--text-primary) !important;
    }
    
    .subtitle, .stat-subtext, .stat-sub, .reminder-time, .tracker-tag, .panel-tag {
      color: var(--text-secondary) !important;
    }

    /* Card Panels & Containers Overrides in Pages */
    .stat-card,
    .dashboard-panel,
    .grid-card,
    .form-panel,
    .projects-list-panel,
    .calendar-main,
    .calendar-side,
    .settings-card,
    .modal-content {
      background: var(--bg-secondary) !important;
      border-color: var(--border-color) !important;
      color: var(--text-primary) !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;

      /* Overview card statistics */
      .stat-value {
        color: var(--text-primary) !important;
      }
    }

    /* Projects Page Specific Overrides */
    .header-subtitle, .reorder-tip {
      color: var(--text-secondary) !important;
    }

    .category-pill {
      background: var(--bg-secondary) !important;
      border-color: var(--border-color) !important;
      color: var(--text-secondary) !important;

      &:hover {
        background: var(--hover-bg) !important;
        color: var(--text-primary) !important;
      }

      &.active {
        background: #1A73E8 !important;
        border-color: #1A73E8 !important;
        color: #ffffff !important;
      }

      .count-tag {
        background: var(--input-bg) !important;
        color: var(--text-secondary) !important;
      }
    }

    .table-header {
      border-bottom-color: var(--border-color) !important;
      color: var(--text-secondary) !important;
    }

    .table-row {
      background: var(--bg-secondary) !important;
      border-color: var(--border-color) !important;
      
      &:hover {
        background: var(--hover-bg) !important;
        border-color: #334155 !important;
      }

      &.is-drag-over {
        background: #1e293b !important;
        border-color: #38bdf8 !important;
        box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.3) !important;
      }

      .order-number {
        background: #1e293b !important;
        color: #38bdf8 !important;
        border-color: #334155 !important;
      }

      .drag-handle {
        color: var(--text-secondary) !important;
        &:hover {
          background: var(--hover-bg) !important;
          color: var(--text-primary) !important;
        }
      }

      .arrow-btn {
        background: #1e293b !important;
        border-color: #334155 !important;
        color: var(--text-secondary) !important;

        &:hover:not(:disabled) {
          background: #1A73E8 !important;
          border-color: #1A73E8 !important;
          color: #ffffff !important;
        }
      }

      .table-info h4 {
        color: var(--text-primary) !important;
      }
      .table-info p {
        color: var(--text-secondary) !important;
      }
      .table-category, .table-tags {
        color: var(--text-secondary) !important;
      }
      .tag-pill {
        background: #1e293b !important;
        color: #38bdf8 !important;
        border: 1px solid #334155 !important;
      }
      .action-btn {
        background: #1e293b !important;
        border-color: #334155 !important;
        color: var(--text-primary) !important;
        
        &:hover {
          background: #334155 !important;
        }
      }
    }
    
    .form-group {
      label {
        color: var(--text-secondary) !important;
      }
      input, select, textarea {
        background: var(--input-bg) !important;
        border-color: var(--input-border) !important;
        color: var(--input-text) !important;
        outline: none;
        
        &:focus {
          border-color: #38bdf8 !important;
        }
      }
    }
    
    /* Calendar Page Specific Overrides */
    .day-cell {
      border-right-color: var(--border-color) !important;
      border-bottom-color: var(--border-color) !important;
      background: var(--bg-secondary) !important;
      
      &.other-month {
        background: #090d16 !important;
        opacity: 0.4;
      }
      
      &.today {
        background: #1e293b !important;
        .day-number {
          background: #38bdf8 !important;
          color: #000000 !important;
        }
      }
      
      .day-number {
        color: var(--text-primary) !important;
      }
    }
    
    .days-header-grid {
      border-bottom-color: var(--border-color) !important;
      .day-header {
        color: var(--text-secondary) !important;
      }
    }
    
    .calendar-header {
      .month-title {
        color: var(--text-primary) !important;
      }
      .nav-btn {
        background: #1e293b !important;
        border-color: #334155 !important;
        color: var(--text-primary) !important;
        
        &:hover {
          background: #334155 !important;
        }
      }
    }
    
    .upcoming-card {
      background: #1e293b !important;
      border-color: #334155 !important;
      h4 {
        color: var(--text-primary) !important;
      }
      .event-description {
        color: var(--text-secondary) !important;
      }
    }

    /* Analytics Page Specific Overrides */
    .traffic-chart {
      background: #090d16 !important;
      border-color: var(--border-color) !important;
    }
    
    .bar-wrapper {
      background: #1e293b !important;
    }
    
    .table-header-row {
      border-bottom-color: var(--border-color) !important;
      color: var(--text-secondary) !important;
    }
    
    .table-body-row {
      border-bottom-color: var(--border-color) !important;
      color: var(--text-secondary) !important;
      
      .ref-name, .path-name {
        color: var(--text-primary) !important;
      }
    }
    
    .progress-bar-wrapper {
      background: #1e293b !important;
    }

    .device-bar {
      background: #1e293b !important;
    }
    .device-legend {
      color: var(--text-secondary) !important;
    }

    /* Settings Page Specific Overrides */
    .settings-card {
      h3 {
        color: var(--text-primary) !important;
      }
      .profile-details p {
        color: var(--text-secondary) !important;
      }
    }
  }

  font-family: 'Inter', system-ui, -apple-system, sans-serif;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  /* Sidebar panel styling */
  .sidebar {
    background: #fff;
    border-right: 1px solid #eaeaea;
    padding: 1.75rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;

    @media (max-width: 1024px) {
      display: none; /* simple hidden behavior for mobile responsiveness */
    }
  }

  .logo-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .logo-icon {
      font-size: 1.5rem;
      background: #eff6ff;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 10px;
      display: inline-grid;
      place-items: center;
    }

    .dashboard-logo-img {
      width: 1.6rem;
      height: auto;
      display: block;
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0b1e30;
    }
  }

  .menu-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    .menu-title {
      font-size: 0.74rem;
      font-weight: 700;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0 0 0.5rem 0.5rem;
    }
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.7rem 0.85rem;
    border: 0;
    background: transparent;
    color: #555;
    font-size: 0.9rem;
    font-weight: 600;
    border-radius: 10px;
    cursor: pointer;
    text-align: left;
    transition: all 180ms ease;

    .item-icon {
      font-size: 1rem;
      opacity: 0.8;
    }

    .count-badge {
      margin-left: auto;
      background: #1A73E8;
      color: #fff;
      font-size: 0.72rem;
      padding: 0.1rem 0.4rem;
      border-radius: 6px;
    }

    &:hover {
      background: #f7f9f7;
      color: #0b1e30;
    }

    &.active {
      background: #eff6ff;
      color: #1A73E8;
    }

    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      &:hover {
        background: transparent;
        color: #555;
      }
    }

    &.logout-btn {
      color: #cf2c2c;
      &:hover {
        background: #fef2f2;
      }
    }
  }

  /* Main content layout */
  .main-content-area {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow-y: auto;

    @media (max-width: 1024px) {
      padding-bottom: 5.5rem;
    }
  }

  .main-header {
    background: #fff;
    border-bottom: 1px solid #eaeaea;
    padding: 0.9rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;

    @media (max-width: 560px) {
      padding: 0.9rem 1rem;
    }
  }

  .search-bar {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: #f7f9f7;
    border: 1px solid #e2e8e3;
    border-radius: 12px;
    padding: 0.55rem 0.85rem;
    width: 320px;

    @media (max-width: 760px) {
      width: auto;
      flex: 1;
    }

    .search-icon {
      font-size: 0.85rem;
      opacity: 0.6;
    }

    input {
      border: 0;
      background: transparent;
      outline: 0;
      font-size: 0.86rem;
      width: 100%;
      color: #111;

      &::placeholder {
        color: #888;
      }
    }

    .shortcut-badge {
      font-size: 0.72rem;
      color: #999;
      background: #fff;
      border: 1px solid #ddd;
      padding: 0.1rem 0.35rem;
      border-radius: 4px;

      @media (max-width: 560px) {
        display: none;
      }
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;

    .status-indicator {
      font-size: 0.76rem;
      font-weight: 600;
      padding: 0.25rem 0.6rem;
      border-radius: 4px;

      &.saving {
        background: #fef3c7;
        color: #d97706;
      }
      &.saved {
        background: #dcfce7;
        color: #15803d;
      }
      &.error {
        background: #fee2e2;
        color: #b91c1c;
      }
    }

    .icon-action-btn {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      border: 1px solid #eee;
      background: #fff;
      display: grid;
      place-items: center;
      cursor: pointer;
      font-size: 0.95rem;

      &:hover {
        background: #f9f9f9;
        border-color: #ddd;
      }

      @media (max-width: 560px) {
        display: none;
      }
    }
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding-left: 0.5rem;
    border-left: 1px solid #eaeaea;

    .profile-pic {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: #eff6ff;
      color: #1A73E8;
      font-weight: 700;
      font-size: 0.94rem;
      display: grid;
      place-items: center;
    }

    .profile-info {
      text-align: left;
      h4 {
        margin: 0;
        font-size: 0.88rem;
        font-weight: 600;
        color: #111;
      }
      p {
        margin: 0;
        font-size: 0.74rem;
        color: #777;
      }

      @media (max-width: 560px) {
        display: none;
      }
    }
  }

  .dashboard-body {
    padding: 2rem;
    flex: 1;

    @media (max-width: 560px) {
      padding: 1rem;
    }

    .dashboard-header-text {
      margin-bottom: 1.5rem;
      text-align: left;

      h1 {
        font-size: clamp(1.5rem, 3.5vw, 2.1rem);
        font-weight: 700;
        color: #0b1e30;
        margin: 0;
        animation: slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      p {
        margin: 0.25rem 0 0;
        color: #666;
        font-size: 0.9rem;
        animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        animation-delay: 50ms;
      }
    }
  }

  /* Mobile Bottom Navigation Bar */
  .mobile-bottom-nav {
    display: none;
    position: fixed;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    background: #08172c;
    border-radius: 99px;
    padding: 0.5rem 0.75rem;
    gap: 0.5rem;
    z-index: 1000;
    box-shadow: 0 10px 25px rgba(0,0,0,0.35);
    align-items: center;
    border: 1px solid rgba(255,255,255,0.08);
    width: max-content;
    max-width: 92vw;

    @media (max-width: 1024px) {
      display: flex;
    }
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.5rem 0.85rem;
    border-radius: 99px;
    border: 0;
    background: transparent;
    color: #888;
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 700;
    transition: all 200ms ease;

    .nav-text {
      color: #fff;
    }

    &.active {
      background: #1A73E8;
      color: #fff;
      box-shadow: 0 4px 10px rgba(26,115,232,0.3);
    }
  }
`;

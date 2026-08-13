import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { OverviewPage } from './pages/OverviewPage';
import { ProjectsPage } from './pages/ProjectsPage';

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
}

export const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Load projects from projects.json
  useEffect(() => {
    fetch('/data/projects.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load projects');
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
        setLoading(false);
      });
  }, []);

  // Save projects using the Vite dev server mock backend
  const handleSaveProjects = async (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    setSaveStatus('saving');

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProjects, null, 2),
      });

      if (!response.ok) throw new Error('Failed to save to server');
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Error saving projects:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      alert('Failed to save changes to file. (Local saving only works when running npm run dev)');
    }
  };

  const handleBackToPortfolio = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
  };

  if (loading) {
    return (
      <StyledLoader>
        <div className="spinner"></div>
        <p>Loading Admin Dashboard...</p>
      </StyledLoader>
    );
  }

  return (
    <StyledDashboard>
      {/* Sidebar Panel */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-icon">
            <lord-icon
              src="https://cdn.lordicon.com/lupuorrc.json"
              trigger="loop"
              colors="primary:#1A73E8,secondary:#4291f7"
              style={{ width: '30px', height: '30px' }}
            ></lord-icon>
          </div>
          <span className="logo-text">Donezo</span>
        </div>

        <div className="menu-group">
          <p className="menu-title">Menu</p>
          <button
            className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="item-icon">
              <lord-icon
                src="https://cdn.lordicon.com/gqdnbnwt.json"
                trigger="hover"
                colors="primary:#555555,secondary:#1A73E8"
                style={{ width: '20px', height: '20px' }}
              ></lord-icon>
            </span>{' '}
            Dashboard
          </button>
          <button
            className={`menu-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <span className="item-icon">
              <lord-icon
                src="https://cdn.lordicon.com/fkdzyuuo.json"
                trigger="hover"
                colors="primary:#555555,secondary:#1A73E8"
                style={{ width: '20px', height: '20px' }}
              ></lord-icon>
            </span>{' '}
            Projects
            <span className="count-badge">{projects.length}</span>
          </button>
          <button className="menu-item disabled">
            <span className="item-icon">
              <lord-icon
                src="https://cdn.lordicon.com/wmltstbg.json"
                trigger="hover"
                colors="primary:#555555,secondary:#1A73E8"
                style={{ width: '20px', height: '20px' }}
              ></lord-icon>
            </span>{' '}
            Calendar
          </button>
          <button className="menu-item disabled">
            <span className="item-icon">
              <lord-icon
                src="https://cdn.lordicon.com/qhviklyq.json"
                trigger="hover"
                colors="primary:#555555,secondary:#1A73E8"
                style={{ width: '20px', height: '20px' }}
              ></lord-icon>
            </span>{' '}
            Analytics
          </button>
          <button className="menu-item disabled">
            <span className="item-icon">
              <lord-icon
                src="https://cdn.lordicon.com/ljvnaqwh.json"
                trigger="hover"
                colors="primary:#555555,secondary:#1A73E8"
                style={{ width: '20px', height: '20px' }}
              ></lord-icon>
            </span>{' '}
            Team
          </button>
        </div>

        <div className="menu-group">
          <p className="menu-title">General</p>
          <button className="menu-item disabled">
            <span className="item-icon">
              <lord-icon
                src="https://cdn.lordicon.com/lecpriep.json"
                trigger="hover"
                colors="primary:#555555,secondary:#1A73E8"
                style={{ width: '20px', height: '20px' }}
              ></lord-icon>
            </span>{' '}
            Settings
          </button>
          <button className="menu-item disabled">
            <span className="item-icon">
              <lord-icon
                src="https://cdn.lordicon.com/cnyeuzcu.json"
                trigger="hover"
                colors="primary:#555555,secondary:#1A73E8"
                style={{ width: '20px', height: '20px' }}
              ></lord-icon>
            </span>{' '}
            Help
          </button>
          <button className="menu-item logout-btn" onClick={handleBackToPortfolio}>
            <span className="item-icon">
              <lord-icon
                src="https://cdn.lordicon.com/hcuxorce.json"
                trigger="hover"
                colors="primary:#cf2c2c,secondary:#cf2c2c"
                style={{ width: '20px', height: '20px' }}
              ></lord-icon>
            </span>{' '}
            Back to Portfolio
          </button>
        </div>

        <div className="sidebar-app-promo">
          <div className="promo-icon">
            <lord-icon
              src="https://cdn.lordicon.com/kxhnpvqy.json"
              trigger="loop"
              colors="primary:#ffffff,secondary:#4291f7"
              style={{ width: '38px', height: '38px' }}
            ></lord-icon>
          </div>
          <h4>Download our App</h4>
          <p>Get easy in another way</p>
          <button className="download-btn">Download</button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="main-content-area">
        {/* Top Header */}
        <header className="main-header">
          <div className="search-bar">
            <span className="search-icon">
              <lord-icon
                src="https://cdn.lordicon.com/msoeawqm.json"
                trigger="hover"
                colors="primary:#888888,secondary:#1A73E8"
                style={{ width: '18px', height: '18px' }}
              ></lord-icon>
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
            
            <button className="icon-action-btn" aria-label="Mail notification">
              <lord-icon
                src="https://cdn.lordicon.com/nzxtwhfd.json"
                trigger="hover"
                colors="primary:#111111,secondary:#1A73E8"
                style={{ width: '20px', height: '20px' }}
              ></lord-icon>
            </button>
            <button className="icon-action-btn" aria-label="Alert notification">
              <lord-icon
                src="https://cdn.lordicon.com/vspoxosx.json"
                trigger="hover"
                colors="primary:#111111,secondary:#1A73E8"
                style={{ width: '20px', height: '20px' }}
              ></lord-icon>
            </button>
            <div className="user-profile">
              <div className="profile-pic">MT</div>
              <div className="profile-info">
                <h4>Maqhawe T</h4>
                <p>maqhawe@donezo.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Pages */}
        <main className="dashboard-body">
          <div className="dashboard-header-text">
            <h1>Dashboard</h1>
            <p>Plan, prioritize, and accomplish your tasks with ease.</p>
          </div>

          {activeTab === 'dashboard' ? (
            <OverviewPage
              projects={projects}
              onNavigateToProjects={() => setActiveTab('projects')}
            />
          ) : (
            <ProjectsPage
              projects={projects}
              onSaveProjects={handleSaveProjects}
              searchQuery={searchQuery}
            />
          )}
        </main>
      </div>
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

  .sidebar-app-promo {
    margin-top: auto;
    background: #08172c;
    background-image: radial-gradient(circle at 100% 100%, #1A73E8 0%, transparent 60%);
    border-radius: 1.25rem;
    padding: 1.25rem;
    color: #fff;
    text-align: center;
    position: relative;
    overflow: hidden;

    .promo-icon {
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
    }

    h4 {
      margin: 0;
      font-size: 0.94rem;
      font-weight: 700;
    }

    p {
      margin: 0.25rem 0 0.85rem;
      font-size: 0.76rem;
      color: rgba(255,255,255,0.7);
    }

    .download-btn {
      background: #1A73E8;
      color: #fff;
      border: 0;
      width: 100%;
      padding: 0.5rem 0;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;

      &:hover {
        background: #1557B0;
      }
    }
  }

  /* Main content layout */
  .main-content-area {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow-y: auto;
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
      width: 200px;
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
      }

      p {
        margin: 0.25rem 0 0;
        color: #666;
        font-size: 0.9rem;
      }
    }
  }
`;

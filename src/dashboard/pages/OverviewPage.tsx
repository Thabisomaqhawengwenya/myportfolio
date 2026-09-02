import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import type { ContactMessage } from './MessagesPage';

interface Project {
  id: string;
  category: 'personal' | 'business' | 'education' | 'utility' | 'gift';
  title: string;
  description: string;
  tags: string[];
  image?: string;
  liveDemoUrl?: string;
  githubUrl?: string;
  order?: number;
}

interface OverviewPageProps {
  projects: Project[];
  messages?: ContactMessage[];
  cvDownloadsCount?: number;
  skillsCount?: number;
  testimonialsCount?: number;
  postsCount?: number;
  onNavigateToTab?: (tab: 'dashboard' | 'projects' | 'skills' | 'testimonials' | 'blog' | 'messages' | 'calendar' | 'analytics' | 'cv' | 'settings') => void;
}

interface PingStatus {
  status: 'idle' | 'checking' | 'online' | 'offline';
  latency?: number;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  projects,
  messages = [],
  cvDownloadsCount = 0,
  skillsCount = 0,
  testimonialsCount = 0,
  postsCount = 0,
  onNavigateToTab,
}) => {
  // Time Tracker state
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Health check ping states
  const [pingStatuses, setPingStatuses] = useState<Record<string, PingStatus>>({});
  const [isPingingAll, setIsPingingAll] = useState(false);

  useEffect(() => {
    let interval: number | null = null;
    if (isRunning) {
      interval = window.setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0'),
    ].join(':');
  };

  const deployedProjects = projects.filter((p) => p.liveDemoUrl && p.liveDemoUrl.trim() !== '');
  const unreadMessagesCount = messages.filter((m) => !m.read).length;
  const recentMessages = messages.slice(0, 3);

  // Ping a single project demo URL
  const pingUrl = async (id: string, url: string) => {
    setPingStatuses((prev) => ({
      ...prev,
      [id]: { status: 'checking' },
    }));

    const start = performance.now();
    try {
      // Using mode: 'no-cors' to ping without triggering strict cross-origin CORS blocks
      await fetch(url, { mode: 'no-cors', cache: 'no-cache' });
      const latency = Math.round(performance.now() - start);
      setPingStatuses((prev) => ({
        ...prev,
        [id]: { status: 'online', latency },
      }));
    } catch {
      setPingStatuses((prev) => ({
        ...prev,
        [id]: { status: 'offline' },
      }));
    }
  };

  // Ping all live project demos in parallel
  const handlePingAll = async () => {
    setIsPingingAll(true);
    const promises = deployedProjects.map((p) => pingUrl(p.id, p.liveDemoUrl!));
    await Promise.allSettled(promises);
    setIsPingingAll(false);
  };

  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return 'Recent';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recent';
    }
  };

  return (
    <StyledOverview>
      {/* Top Stat Cards Grid */}
      <div className="stats-grid">
        <div
          className="stat-card stat-card-featured clickable"
          onClick={() => onNavigateToTab?.('projects')}
          title="Click to view all projects"
        >
          <div className="stat-header">
            <span>Total Projects</span>
            <span className="arrow-icon">
              <Icon icon="lucide:folder-open" width={16} height={16} style={{ color: '#1A73E8' }} />
            </span>
          </div>
          <div className="stat-value">{projects.length}</div>
          <div className="stat-subtext">{deployedProjects.length} live deployed demos</div>
        </div>

        <div
          className="stat-card clickable"
          onClick={() => onNavigateToTab?.('skills')}
          title="Click to view tech stack manager"
        >
          <div className="stat-header">
            <span>Tech Stack</span>
            <span className="arrow-icon">
              <Icon icon="lucide:cpu" width={16} height={16} style={{ color: '#f59e0b' }} />
            </span>
          </div>
          <div className="stat-value">{skillsCount}</div>
          <div className="stat-subtext">3 animated marquee rows</div>
        </div>

        <div
          className="stat-card clickable"
          onClick={() => onNavigateToTab?.('testimonials')}
          title="Click to view client testimonials"
        >
          <div className="stat-header">
            <span>Testimonials</span>
            <span className="arrow-icon">
              <Icon icon="lucide:message-square-quote" width={16} height={16} style={{ color: '#10b981' }} />
            </span>
          </div>
          <div className="stat-value">{testimonialsCount}</div>
          <div className="stat-subtext">Client endorsements</div>
        </div>

        <div
          className="stat-card clickable"
          onClick={() => onNavigateToTab?.('blog')}
          title="Click to view articles and case studies"
        >
          <div className="stat-header">
            <span>Blog Articles</span>
            <span className="arrow-icon">
              <Icon icon="lucide:book-open" width={16} height={16} style={{ color: '#ec4899' }} />
            </span>
          </div>
          <div className="stat-value">{postsCount}</div>
          <div className="stat-subtext">Case studies & tutorials</div>
        </div>

        <div
          className="stat-card clickable"
          onClick={() => onNavigateToTab?.('messages')}
          title="Click to view inquiries inbox"
        >
          <div className="stat-header">
            <span>Inquiries</span>
            <span className="arrow-icon">
              <Icon icon="lucide:mail" width={16} height={16} style={{ color: '#0284c7' }} />
            </span>
          </div>
          <div className="stat-value">{messages.length}</div>
          <div className="stat-subtext">
            {unreadMessagesCount > 0 ? (
              <span className="pill-unread">{unreadMessagesCount} unread inquiries</span>
            ) : (
              'All messages answered'
            )}
          </div>
        </div>

        <div
          className="stat-card clickable"
          onClick={() => onNavigateToTab?.('cv')}
          title="Click to manage and upload CV"
        >
          <div className="stat-header">
            <span>CV Downloads</span>
            <span className="arrow-icon">
              <Icon icon="lucide:file-text" width={16} height={16} style={{ color: '#8b5cf6' }} />
            </span>
          </div>
          <div className="stat-value">{cvDownloadsCount}</div>
          <div className="stat-subtext">Recruiters & visitors</div>
        </div>
      </div>

      {/* Main Two Column Section */}
      <div className="dashboard-grid">
        <div className="grid-left-col">
          {/* Quick Reminders Card */}
          <div className="dashboard-panel reminder-panel">
            <div className="panel-tag">Quick Action</div>
            <h3>Manage & Reorder Projects</h3>
            <p className="reminder-time">Customize the display order of your portfolio projects.</p>
            <button className="reminder-action" onClick={() => onNavigateToTab?.('projects')}>
              <Icon icon="lucide:arrow-right" width={18} height={18} style={{ color: '#1A73E8' }} />
              Open Projects Page
            </button>
          </div>

          {/* Recent Messages Feed */}
          <div className="dashboard-panel inquiries-panel">
            <div className="panel-header">
              <div className="title-with-badge">
                <h3>Recent Inquiries</h3>
                {unreadMessagesCount > 0 && (
                  <span className="unread-count-pill">{unreadMessagesCount} New</span>
                )}
              </div>
              <button className="panel-btn" onClick={() => onNavigateToTab?.('messages')}>
                View Inbox
              </button>
            </div>

            {recentMessages.length === 0 ? (
              <div className="empty-stream">
                <Icon icon="lucide:inbox" width={32} height={32} style={{ color: '#888', opacity: 0.6 }} />
                <p>No messages received yet.</p>
              </div>
            ) : (
              <div className="messages-stream">
                {recentMessages.map((msg) => {
                  const initials = msg.name
                    ? msg.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : 'IN';

                  return (
                    <div
                      key={msg.id}
                      className={`stream-item ${!msg.read ? 'is-unread' : ''}`}
                      onClick={() => onNavigateToTab?.('messages')}
                    >
                      <div className="stream-avatar">{initials}</div>
                      <div className="stream-content">
                        <div className="stream-meta">
                          <span className="sender-name">{msg.name || 'Anonymous'}</span>
                          <span className="stream-time">{formatRelativeTime(msg.timestamp)}</span>
                        </div>
                        <div className="stream-subject">{msg.subject || 'Portfolio Inquiry'}</div>
                        <div className="stream-snippet">{msg.message}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="grid-right-col">
          {/* Time Tracker Widget */}
          <div className="dashboard-panel tracker-panel">
            <div className="tracker-tag">Session Timer</div>
            <div className="tracker-time">{formatTime(time)}</div>
            <div className="tracker-controls">
              {isRunning ? (
                <button
                  className="control-btn"
                  onClick={() => setIsRunning(false)}
                  aria-label="Pause timer"
                  title="Pause timer"
                >
                  <Icon icon="lucide:pause" width={20} height={20} />
                </button>
              ) : (
                <button
                  className="control-btn"
                  onClick={() => setIsRunning(true)}
                  aria-label="Start timer"
                  title="Start timer"
                >
                  <Icon icon="lucide:play" width={20} height={20} />
                </button>
              )}
              <button
                className="control-btn control-btn-stop"
                onClick={() => {
                  setIsRunning(false);
                  setTime(0);
                }}
                aria-label="Reset timer"
                title="Reset timer"
              >
                <Icon icon="lucide:rotate-ccw" width={18} height={18} />
              </button>
            </div>
          </div>

          {/* Quick Portfolio Stats */}
          <div className="dashboard-panel overview-summary-panel">
            <div className="panel-header">
              <h3>Portfolio Snapshot</h3>
            </div>
            <div className="summary-list">
              <div className="summary-row">
                <span className="summary-label">
                  <Icon icon="lucide:briefcase" width={16} height={16} style={{ color: '#3b82f6' }} />
                  Business Projects
                </span>
                <span className="summary-val">
                  {projects.filter((p) => p.category === 'business').length}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">
                  <Icon icon="lucide:user" width={16} height={16} style={{ color: '#10b981' }} />
                  Personal Projects
                </span>
                <span className="summary-val">
                  {projects.filter((p) => p.category === 'personal').length}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">
                  <Icon icon="lucide:code" width={16} height={16} style={{ color: '#8b5cf6' }} />
                  Utilities & Tools
                </span>
                <span className="summary-val">
                  {projects.filter((p) => ['utility', 'education', 'gift'].includes(p.category)).length}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">
                  <Icon icon="lucide:cpu" width={16} height={16} style={{ color: '#f59e0b' }} />
                  Active Tech Skills
                </span>
                <span className="summary-val">{skillsCount}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">
                  <Icon icon="lucide:book-open" width={16} height={16} style={{ color: '#ec4899' }} />
                  Published Articles
                </span>
                <span className="summary-val">{postsCount}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">
                  <Icon icon="lucide:message-square-quote" width={16} height={16} style={{ color: '#14b8a6' }} />
                  Client Reviews
                </span>
                <span className="summary-val">{testimonialsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Deployments & Health Monitor Section */}
      <div className="dashboard-panel health-monitor-panel">
        <div className="panel-header health-header">
          <div>
            <h3>Live Deployments & Demo Health Monitor</h3>
            <p className="health-subtitle">
              Verify uptime and responsiveness for your client showcase links.
            </p>
          </div>
          <button
            className={`ping-all-btn ${isPingingAll ? 'is-loading' : ''}`}
            onClick={handlePingAll}
            disabled={isPingingAll || deployedProjects.length === 0}
          >
            <Icon
              icon={isPingingAll ? 'lucide:loader-2' : 'lucide:activity'}
              width={16}
              height={16}
              className={isPingingAll ? 'spin-icon' : ''}
            />
            {isPingingAll ? 'Pinging All...' : 'Ping All Demos'}
          </button>
        </div>

        <div className="health-grid">
          {deployedProjects.map((p) => {
            const pingInfo = pingStatuses[p.id] || { status: 'idle' };

            return (
              <div key={p.id} className="health-card">
                <div className="health-card-top">
                  <div className="project-title-area">
                    <h4>{p.title}</h4>
                    <span className="category-tag">{p.category}</span>
                  </div>
                  <div className="health-status-badge">
                    {pingInfo.status === 'idle' && (
                      <span className="status-pill status-idle">
                        <span className="status-dot dot-idle" />
                        Ready
                      </span>
                    )}
                    {pingInfo.status === 'checking' && (
                      <span className="status-pill status-checking">
                        <span className="status-dot dot-checking" />
                        Checking...
                      </span>
                    )}
                    {pingInfo.status === 'online' && (
                      <span className="status-pill status-online">
                        <span className="status-dot dot-online" />
                        Online {pingInfo.latency ? `(${pingInfo.latency}ms)` : ''}
                      </span>
                    )}
                    {pingInfo.status === 'offline' && (
                      <span className="status-pill status-offline">
                        <span className="status-dot dot-offline" />
                        Offline
                      </span>
                    )}
                  </div>
                </div>

                <div className="url-preview" title={p.liveDemoUrl}>
                  {p.liveDemoUrl}
                </div>

                <div className="health-card-actions">
                  <button
                    className="health-action-btn ping-btn"
                    onClick={() => pingUrl(p.id, p.liveDemoUrl!)}
                    disabled={pingInfo.status === 'checking'}
                    title="Ping single project"
                  >
                    <Icon icon="lucide:refresh-cw" width={14} height={14} />
                    Ping
                  </button>
                  <a
                    href={p.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="health-action-btn demo-btn"
                    title="Launch live demo in new tab"
                  >
                    <Icon icon="lucide:external-link" width={14} height={14} />
                    Demo
                  </a>
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="health-action-btn github-btn"
                      title="View GitHub Repository"
                    >
                      <Icon icon="lucide:github" width={14} height={14} />
                      Code
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </StyledOverview>
  );
};

const StyledOverview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .clickable {
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1rem;

    @media (max-width: 1400px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 480px) {
      grid-template-columns: repeat(1, 1fr);
      gap: 0.75rem;
    }
  }

  .stat-card {
    background: #fff;
    color: #1a1a1a;
    border-radius: 1.25rem;
    padding: 1.5rem;
    border: 1px solid #eaeaea;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);

    @media (max-width: 560px) {
      padding: 1rem;
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #666;
      font-size: 0.88rem;
      font-weight: 500;
    }

    .arrow-icon {
      background: #f7f7f7;
      width: 1.75rem;
      height: 1.75rem;
      display: inline-grid;
      place-items: center;
      border-radius: 50%;
      font-size: 0.8rem;
      color: #111;
    }

    .stat-value {
      font-size: 2.2rem;
      font-weight: 700;
      margin: 0.75rem 0 0.35rem;
      color: #0b1e30;

      @media (max-width: 560px) {
        font-size: 1.65rem;
        margin: 0.4rem 0 0.2rem;
      }
    }

    .stat-subtext {
      font-size: 0.78rem;
      color: #888;
    }

    .pill-unread {
      background: #fee2e2;
      color: #b91c1c;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      font-weight: 600;
    }

    &.stat-card-featured {
      background: #1A73E8;
      color: #fff;
      border-color: #1A73E8;

      .stat-header {
        color: rgba(255, 255, 255, 0.7);
      }
      .arrow-icon {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }
      .stat-value {
        color: #fff;
      }
      .stat-subtext {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 1.5rem;

    @media (max-width: 960px) {
      grid-template-columns: 1fr;
    }
  }

  .grid-left-col,
  .grid-right-col {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .dashboard-panel {
    background: #fff;
    border-radius: 1.25rem;
    padding: 1.5rem;
    border: 1px solid #eaeaea;
    color: #111;

    h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #0b1e30;
    }
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.2rem;

    .title-with-badge {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .unread-count-pill {
      background: #ef4444;
      color: #fff;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
    }

    .panel-btn {
      background: transparent;
      border: 1px solid #ddd;
      padding: 0.35rem 0.75rem;
      border-radius: 99px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      color: #444;
      transition: all 0.15s ease;

      &:hover {
        background: #f9f9f9;
        border-color: #1A73E8;
        color: #1A73E8;
      }
    }
  }

  /* Reminder Panel */
  .reminder-panel {
    background: #0f172a;
    color: #fff;
    border-color: #0f172a;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: -40px;
      right: -40px;
      width: 140px;
      height: 140px;
      background: rgba(26, 115, 232, 0.25);
      border-radius: 50%;
      filter: blur(30px);
    }

    .panel-tag {
      font-size: 0.74rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #38bdf8;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    h3 {
      color: #fff;
      font-size: 1.25rem;
      margin-bottom: 0.4rem;
    }

    .reminder-time {
      font-size: 0.88rem;
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 1.25rem;
    }

    .reminder-action {
      background: #fff;
      color: #1A73E8;
      border: 0;
      padding: 0.65rem 1.25rem;
      border-radius: 99px;
      font-size: 0.86rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: background 0.15s ease;

      &:hover {
        background: #f1f5f9;
      }
    }
  }

  /* Recent Inquiries Panel */
  .inquiries-panel {
    .empty-stream {
      text-align: center;
      padding: 2rem 1rem;
      color: #888;
      p {
        margin-top: 0.5rem;
        font-size: 0.88rem;
      }
    }

    .messages-stream {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .stream-item {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      padding: 0.85rem;
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
      }

      &.is-unread {
        background: #eff6ff;
        border-color: #bfdbfe;
      }
    }

    .stream-avatar {
      width: 2.2rem;
      height: 2.2rem;
      border-radius: 50%;
      background: #1A73E8;
      color: #fff;
      font-weight: 700;
      font-size: 0.82rem;
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }

    .stream-content {
      flex: 1;
      min-width: 0;

      .stream-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.15rem;

        .sender-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: #0b1e30;
        }

        .stream-time {
          font-size: 0.72rem;
          color: #888;
        }
      }

      .stream-subject {
        font-size: 0.8rem;
        font-weight: 500;
        color: #1A73E8;
        margin-bottom: 0.2rem;
      }

      .stream-snippet {
        font-size: 0.78rem;
        color: #64748b;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  /* Time Tracker Panel */
  .tracker-panel {
    background: #08172c;
    color: #fff;
    border-color: #08172c;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.75rem;
    background-image: radial-gradient(circle at 100% 100%, #1A73E8 0%, transparent 60%);

    .tracker-tag {
      font-size: 0.78rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 0.6rem;
    }

    .tracker-time {
      font-size: 2.5rem;
      font-weight: 700;
      font-family: monospace;
      color: #fff;
      letter-spacing: 0.05em;
      margin-bottom: 1.2rem;
    }

    .tracker-controls {
      display: flex;
      gap: 1rem;
    }

    .control-btn {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 50%;
      border: 0;
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      font-size: 1.1rem;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: background-color 200ms ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }

    .control-btn-stop {
      background: #ef4444;
      color: #fff;

      &:hover {
        background: #dc2626;
      }
    }
  }

  /* Portfolio Summary Panel */
  .overview-summary-panel {
    .summary-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.6rem 0.8rem;
      background: #f8fafc;
      border-radius: 8px;
    }

    .summary-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.84rem;
      color: #475569;
      font-weight: 500;
    }

    .summary-val {
      font-size: 0.94rem;
      font-weight: 700;
      color: #0f172a;
    }
  }

  /* Health Monitor Panel */
  .health-monitor-panel {
    .health-header {
      align-items: flex-start;
      margin-bottom: 1.5rem;

      .health-subtitle {
        margin: 0.25rem 0 0;
        font-size: 0.82rem;
        color: #64748b;
      }
    }

    .ping-all-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #1A73E8;
      color: #fff;
      border: 0;
      padding: 0.55rem 1.1rem;
      border-radius: 99px;
      font-size: 0.84rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover:not(:disabled) {
        background: #1557b0;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .spin-icon {
        animation: spin 1s linear infinite;
      }
    }

    .health-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .health-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      transition: border-color 0.15s ease;

      &:hover {
        border-color: #cbd5e1;
      }

      .health-card-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .project-title-area {
        h4 {
          margin: 0 0 0.2rem;
          font-size: 0.94rem;
          font-weight: 600;
          color: #0f172a;
        }

        .category-tag {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          font-weight: 600;
        }
      }

      .health-status-badge {
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.74rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
        }

        .status-idle {
          background: #f1f5f9;
          color: #64748b;
          .dot-idle {
            background: #94a3b8;
          }
        }

        .status-checking {
          background: #fef3c7;
          color: #d97706;
          .dot-checking {
            background: #f59e0b;
            animation: pulse 1s infinite;
          }
        }

        .status-online {
          background: #dcfce7;
          color: #15803d;
          .dot-online {
            background: #22c55e;
            box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
          }
        }

        .status-offline {
          background: #fee2e2;
          color: #b91c1c;
          .dot-offline {
            background: #ef4444;
          }
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
      }

      .url-preview {
        font-size: 0.74rem;
        font-family: monospace;
        color: #64748b;
        background: #fff;
        padding: 0.35rem 0.6rem;
        border-radius: 6px;
        border: 1px solid #edf2f7;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .health-card-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: auto;
      }

      .health-action-btn {
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.35rem;
        font-size: 0.76rem;
        font-weight: 600;
        padding: 0.4rem 0.6rem;
        border-radius: 8px;
        border: 1px solid #cbd5e1;
        background: #fff;
        color: #334155;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.15s ease;

        &:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        &.demo-btn {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #1d4ed8;

          &:hover {
            background: #dbeafe;
          }
        }

        &.github-btn {
          flex: 0 0 auto;
        }
      }
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

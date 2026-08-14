import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';

interface Project {
  id: string;
  category: 'personal' | 'business' | 'education' | 'utility' | 'gift';
  title: string;
  description: string;
  tags: string[];
  image?: string;
  liveDemoUrl?: string;
  githubUrl?: string;
}

interface OverviewPageProps {
  projects: Project[];
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ projects }) => {
  // Time Tracker state
  const [time, setTime] = useState(0); // Start at 00:00:00 (0 seconds)
  const [isRunning, setIsRunning] = useState(false);

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

  // Group counts
  const total = projects.length;
  const business = projects.filter((p) => p.category === 'business').length;
  const personal = projects.filter((p) => p.category === 'personal').length;
  const education = projects.filter((p) => p.category === 'education').length;
  const utility = projects.filter((p) => p.category === 'utility').length;
  const gift = projects.filter((p) => p.category === 'gift').length;

  const otherCount = education + utility + gift;

  // Let's create an overview with styled elements
  return (
    <StyledOverview>
      <div className="stats-grid">
        <div className="stat-card stat-card-featured">
          <div className="stat-header">
            <span>Total Projects</span>
            <span className="arrow-icon">
              <Icon
                icon="lucide:arrow-up-right"
                width={16}
                height={16}
                style={{ color: '#ffffff' }}
              />
            </span>
          </div>
          <div className="stat-value">{total}</div>
          <div className="stat-subtext">5+ Increased from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Business Projects</span>
            <span className="arrow-icon">
              <Icon
                icon="lucide:arrow-up-right"
                width={16}
                height={16}
                style={{ color: '#111111' }}
              />
            </span>
          </div>
          <div className="stat-value">{business}</div>
          <div className="stat-subtext">Premium retail & brand sites</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Personal Brand</span>
            <span className="arrow-icon">
              <Icon
                icon="lucide:arrow-up-right"
                width={16}
                height={16}
                style={{ color: '#111111' }}
              />
            </span>
          </div>
          <div className="stat-value">{personal}</div>
          <div className="stat-subtext">Demos, portfolios, sandboxes</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Utility & Others</span>
            <span className="arrow-icon">
              <Icon
                icon="lucide:arrow-up-right"
                width={16}
                height={16}
                style={{ color: '#111111' }}
              />
            </span>
          </div>
          <div className="stat-value">{otherCount}</div>
          <div className="stat-subtext">Gifts, tools, CLI scripts</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="grid-left-col">
          {/* Project Analytics Chart */}
          <div className="dashboard-panel chart-panel">
            <h3>Project Analytics</h3>
            <div className="bar-chart">
              <div className="bar-container">
                <div className="bar striped" style={{ height: '50%' }}></div>
                <span className="bar-label">S</span>
              </div>
              <div className="bar-container">
                <div className="bar filled" style={{ height: '78%' }}></div>
                <span className="bar-label">M</span>
              </div>
              <div className="bar-container">
                <div className="bar light" style={{ height: '62%' }} data-percentage="74%"></div>
                <span className="bar-label">T</span>
              </div>
              <div className="bar-container">
                <div className="bar filled-dark" style={{ height: '90%' }}></div>
                <span className="bar-label">W</span>
              </div>
              <div className="bar-container">
                <div className="bar striped" style={{ height: '45%' }}></div>
                <span className="bar-label">T</span>
              </div>
              <div className="bar-container">
                <div className="bar striped" style={{ height: '35%' }}></div>
                <span className="bar-label">F</span>
              </div>
              <div className="bar-container">
                <div className="bar striped" style={{ height: '55%' }}></div>
                <span className="bar-label">S</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-right-col">
          {/* Reminders Card */}
          <div className="dashboard-panel reminder-panel">
            <div className="panel-tag">Reminders</div>
            <h3>Deploy Portfolio V2</h3>
            <p className="reminder-time">Time : 02.00 pm - 04.00 pm</p>
            <button className="reminder-action">
              <Icon
                icon="lucide:play"
                width={18}
                height={18}
                style={{ color: '#1A73E8', marginRight: '6px' }}
              />
              Start Action
            </button>
          </div>

          {/* Project Progress Gauge */}
          <div className="dashboard-panel progress-panel">
            <h3>Project Progress</h3>
            <div className="gauge-container">
              <svg viewBox="0 0 100 50" className="gauge-svg">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#eceff1"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="var(--accent-green)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="125.6"
                  strokeDashoffset="74" /* 41% complete */
                />
              </svg>
              <div className="gauge-center">
                <span className="gauge-percentage">41%</span>
                <span className="gauge-label">Project Ended</span>
              </div>
            </div>
            <div className="gauge-legend">
              <div>
                <span className="legend-dot dot-completed"></span> Completed
              </div>
              <div>
                <span className="legend-dot dot-progress"></span> In Progress
              </div>
              <div>
                <span className="legend-dot dot-pending"></span> Pending
              </div>
            </div>
          </div>

          {/* Time Tracker Card */}
          <div className="dashboard-panel tracker-panel">
            <div className="tracker-tag">Time Tracker</div>
            <div className="tracker-time">{formatTime(time)}</div>
            <div className="tracker-controls">
              {isRunning ? (
                <button className="control-btn" onClick={() => setIsRunning(false)} aria-label="Pause timer">
                  ⏸
                </button>
              ) : (
                <button className="control-btn" onClick={() => setIsRunning(true)} aria-label="Start timer">
                  ▶
                </button>
              )}
              <button className="control-btn control-btn-stop" onClick={() => { setIsRunning(false); setTime(0); }} aria-label="Reset timer">
                ■
              </button>
            </div>
          </div>
        </div>
      </div>
    </StyledOverview>
  );
};

const StyledOverview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 560px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }
  }

  .stat-card {
    background: #fff;
    color: #1a1a1a;
    border-radius: 1.25rem;
    padding: 1.5rem;
    border: 1px solid #eaeaea;
    box-shadow: 0 4px 12px rgba(0,0,0,0.02);

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

    &.stat-card-featured {
      background: #1A73E8;
      color: #fff;
      border-color: #1A73E8;

      .stat-header {
        color: rgba(255,255,255,0.7);
      }
      .arrow-icon {
        background: rgba(255,255,255,0.1);
        color: #fff;
      }
      .stat-value {
        color: #fff;
      }
      .stat-subtext {
        color: rgba(255,255,255,0.6);
        background: rgba(255,255,255,0.08);
        display: inline-block;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
      }
    }
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
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
      margin: 0 0 1.2rem;
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

    h3 {
      margin-bottom: 0;
    }

    .panel-btn {
      background: transparent;
      border: 1px solid #ddd;
      padding: 0.4rem 0.8rem;
      border-radius: 99px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      color: #444;

      &:hover {
        background: #f9f9f9;
        border-color: #ccc;
      }
    }
  }

  /* Bar Chart styling */
  .chart-panel {
    .bar-chart {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 180px;
      padding: 1rem 0.5rem 0.2rem;
    }

    .bar-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 10%;
      height: 100%;
      justify-content: flex-end;
    }

    .bar {
      width: 100%;
      border-radius: 12px;
      position: relative;

      &.filled {
        background: #1A73E8;
      }
      &.filled-dark {
        background: #0c2a50;
      }
      &.light {
        background: #4291f7;

        &::after {
          content: attr(data-percentage);
          position: absolute;
          top: -24px;
          left: 50%;
          transform: translateX(-50%);
          background: #f0fdf4;
          color: #1A73E8;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.15rem 0.35rem;
          border-radius: 4px;
          border: 1px solid #dcfce7;
        }
      }
      &.striped {
        background: repeating-linear-gradient(
          45deg,
          #dbeafe,
          #dbeafe 4px,
          #eff6ff 4px,
          #eff6ff 8px
        );
        border: 1px solid #bfdbfe;
      }
    }

    .bar-label {
      margin-top: 0.6rem;
      font-size: 0.76rem;
      color: #888;
      font-weight: 500;
    }
  }

  /* Collaborators styling */
  .collaborators-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .collab-item {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding-bottom: 0.85rem;
      border-bottom: 1px solid #f4f4f4;

      &:last-child {
        border-bottom: 0;
        padding-bottom: 0;
      }
    }

    .avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: #eff6ff;
      color: #1A73E8;
      font-weight: 700;
      font-size: 0.9rem;
      display: inline-grid;
      place-items: center;
    }

    .collab-info {
      flex: 1;

      h4 {
        margin: 0;
        font-size: 0.94rem;
        font-weight: 600;
        color: #111;
      }

      p {
        margin: 0.15rem 0 0;
        font-size: 0.78rem;
        color: #777;

        span {
          font-weight: 600;
          color: #333;
        }
      }
    }

    .status-tag {
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 600;

      &.status-completed {
        background: #f0fdf4;
        color: #15803d;
      }
      &.status-progress {
        background: #fffbeb;
        color: #b45309;
      }
    }

    .view-all-collabs {
      margin-top: 0.5rem;
      font-size: 0.84rem;
      font-weight: 600;
      color: #1A73E8;
      cursor: pointer;
      align-self: flex-start;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  /* Reminder Panel styling */
  .reminder-panel {
    background: #1A73E8;
    color: #fff;
    border-color: #1A73E8;

    .panel-tag {
      font-size: 0.74rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.7);
      margin-bottom: 0.4rem;
    }

    h3 {
      font-size: 1.35rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.4rem;
    }

    .reminder-time {
      font-size: 0.88rem;
      color: rgba(255,255,255,0.8);
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

      &:hover {
        background: #f5f5f5;
      }
    }
  }

  /* Progress Gauge */
  .progress-panel {
    .gauge-container {
      position: relative;
      width: 180px;
      margin: 0 auto;
    }

    .gauge-svg {
      width: 100%;
      transform: scaleX(-1); /* Orient left-to-right fill */
    }

    .gauge-center {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
    }

    .gauge-percentage {
      display: block;
      font-size: 1.8rem;
      font-weight: 700;
      color: #111;
      line-height: 1.1;
    }

    .gauge-label {
      font-size: 0.72rem;
      color: #888;
    }

    .gauge-legend {
      display: flex;
      justify-content: center;
      gap: 1.25rem;
      margin-top: 1.5rem;
      font-size: 0.8rem;
      color: #666;

      & > div {
        display: flex;
        align-items: center;
        gap: 0.35rem;
      }
    }

    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;

      &.dot-completed {
        background: #1A73E8;
      }
      &.dot-progress {
        background: #4291f7;
      }
      &.dot-pending {
        background: #dbeafe;
        border: 1px solid #bfdbfe;
      }
    }
  }

  /* Time Tracker panel */
  .tracker-panel {
    background: #08172c;
    color: #fff;
    border-color: #08172c;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.75rem;

    /* Green background abstract structure */
    background-image: radial-gradient(circle at 100% 100%, #1A73E8 0%, transparent 60%);

    .tracker-tag {
      font-size: 0.78rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.6);
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
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      border: 0;
      background: rgba(255,255,255,0.1);
      color: #fff;
      font-size: 1.1rem;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: background-color 200ms ease;

      &:hover {
        background: rgba(255,255,255,0.2);
      }
    }

    .control-btn-stop {
      background: #cf2c2c;
      color: #fff;

      &:hover {
        background: #b52222;
      }
    }
  }

  --accent-green: #1A73E8;
`;

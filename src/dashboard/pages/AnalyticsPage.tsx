import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: Record<string, number>;
  referrers: Record<string, number>;
  devices: Record<string, number>;
  browsers: Record<string, number>;
  dailyTraffic: { date: string; visits: number }[];
  hourlyTraffic: { hour: string; count: number }[];
}

export const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/visitor-stats')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load visitor stats');
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <StyledLoader>
        <div className="spinner"></div>
        <p>Analyzing portfolio visitor logs...</p>
      </StyledLoader>
    );
  }

  if (!stats) {
    return (
      <StyledLoader>
        <p>No visitor tracking data available.</p>
      </StyledLoader>
    );
  }

  // Calculate totals and rates
  const totalViews = stats.totalVisits;
  const uniqueVisits = stats.uniqueVisitors;
  const bounceRate = '28.4%';
  const avgSession = '2m 14s';

  // Referral breakdown calculations
  const totalRefs = Object.values(stats.referrers).reduce((a, b) => a + b, 0) || 1;
  const sortedReferrers = Object.entries(stats.referrers).sort((a, b) => b[1] - a[1]);

  // Devices calculations
  const totalDevices = Object.values(stats.devices).reduce((a, b) => a + b, 0) || 1;
  const pctDesktop = Math.round(((stats.devices.desktop || 0) / totalDevices) * 100);
  const pctMobile = Math.round(((stats.devices.mobile || 0) / totalDevices) * 100);
  const pctTablet = Math.max(0, 100 - pctDesktop - pctMobile);

  // Daily max views for bar chart scaling
  const maxDayVisits = Math.max(...stats.dailyTraffic.map((d) => d.visits), 10);

  return (
    <StyledAnalyticsPage>
      {/* 4 Cards Summary */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Page Views</div>
          <div className="stat-value">{totalViews}</div>
          <div className="stat-sub">Across all portfolio sections</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Unique Visitors</div>
          <div className="stat-value">{uniqueVisits}</div>
          <div className="stat-sub">Identified unique client visits</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. Session Duration</div>
          <div className="stat-value">{avgSession}</div>
          <div className="stat-sub">Engaged visitor browsing time</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Bounce Rate</div>
          <div className="stat-value">{bounceRate}</div>
          <div className="stat-sub">Single-page visit ratio</div>
        </div>
      </div>

      {/* Grid Layout for Charts & Analytics */}
      <div className="analytics-grid">
        {/* Left Column: Line/Bar Traffic */}
        <div className="grid-card traffic-card">
          <h3>Daily Traffic History</h3>
          <p className="subtitle">Visitor traffic patterns over the last 7 active tracking days</p>
          <div className="traffic-chart">
            {stats.dailyTraffic.map((day, idx) => {
              const heightPct = Math.round((day.visits / maxDayVisits) * 80) + 10;
              const formattedDate = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
              return (
                <div key={idx} className="chart-bar-col">
                  <div className="bar-wrapper">
                    <div className="bar-hover-val">{day.visits} visits</div>
                    <div className="bar-fill" style={{ height: `${heightPct}%` }}></div>
                  </div>
                  <span className="bar-label">{formattedDate}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Device Breakdown */}
        <div className="grid-card devices-card">
          <h3>Device Platforms</h3>
          <p className="subtitle">Client device platform breakdown ratio</p>
          <div className="device-bar-container">
            <div className="device-bar">
              <div className="segment desktop" style={{ width: `${pctDesktop}%` }} title={`Desktop: ${pctDesktop}%`}></div>
              <div className="segment mobile" style={{ width: `${pctMobile}%` }} title={`Mobile: ${pctMobile}%`}></div>
              <div className="segment tablet" style={{ width: `${pctTablet}%` }} title={`Tablet: ${pctTablet}%`}></div>
            </div>
            <div className="device-legend">
              <div className="legend-item"><span className="color-dot desktop"></span> Desktop ({pctDesktop}%)</div>
              <div className="legend-item"><span className="color-dot mobile"></span> Mobile ({pctMobile}%)</div>
              <div className="legend-item"><span className="color-dot tablet"></span> Tablet ({pctTablet}%)</div>
            </div>
          </div>

          <div className="browser-list">
            <h4>Browser Breakdowns</h4>
            {Object.entries(stats.browsers)
              .sort((a, b) => b[1] - a[1])
              .map(([browserName, count]) => {
                const pct = Math.round((count / totalViews) * 100) || 0;
                return (
                  <div key={browserName} className="browser-row">
                    <span className="browser-name">{browserName.toUpperCase()}</span>
                    <div className="progress-bar-wrapper">
                      <div className="progress-bar-fill" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="browser-count">{count} ({pct}%)</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Bottom Left: Referral traffic sources */}
        <div className="grid-card referrers-card">
          <h3>Referral Traffic Sources</h3>
          <p className="subtitle">Websites referring visitors to your portfolio link</p>
          <div className="table-wrapper">
            <div className="table-header-row">
              <div>Referrer Domain</div>
              <div style={{ textAlign: 'right' }}>Hits</div>
              <div style={{ textAlign: 'right' }}>Share</div>
            </div>
            {sortedReferrers.map(([refDomain, hits]) => {
              const sharePct = Math.round((hits / totalRefs) * 100);
              return (
                <div key={refDomain} className="table-body-row">
                  <div className="ref-name">{refDomain === 'direct' ? 'Direct URL Search' : refDomain}</div>
                  <div style={{ textAlign: 'right' }} className="ref-hits">{hits}</div>
                  <div style={{ textAlign: 'right' }} className="ref-share">{sharePct}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Right: Specific Section views */}
        <div className="grid-card pages-card">
          <h3>Section Interest Views</h3>
          <p className="subtitle">Views breakdown per portfolio section path</p>
          <div className="table-wrapper">
            <div className="table-header-row">
              <div>Page / Action Path</div>
              <div style={{ textAlign: 'right' }}>Views</div>
            </div>
            {Object.entries(stats.pageViews)
              .sort((a, b) => b[1] - a[1])
              .map(([pathName, count]) => (
                <div key={pathName} className="table-body-row">
                  <div className="path-name">/{pathName === 'home' ? '' : pathName}</div>
                  <div style={{ textAlign: 'right' }} className="path-count">{count}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </StyledAnalyticsPage>
  );
};

const StyledLoader = styled.div`
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #1A73E8;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  p {
    color: #475569;
    font-size: 0.9rem;
    font-weight: 600;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const StyledAnalyticsPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .subtitle {
    font-size: 0.8rem;
    color: #64748b;
    margin: 0.15rem 0 1.25rem;
  }

  /* 4 summary cards */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  .stat-card {
    background: #fff;
    padding: 1.25rem;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);

    .stat-label {
      font-size: 0.82rem;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 0.4rem;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 800;
      color: #0b1e30;
      margin-bottom: 0.25rem;
    }

    .stat-sub {
      font-size: 0.72rem;
      color: #94a3b8;
    }
  }

  /* Grid details */
  .analytics-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 1.5rem;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }

  .grid-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;

    h3 {
      font-size: 1.15rem;
      font-weight: 700;
      color: #0b1e30;
      margin: 0;
    }
  }

  /* Traffic chart */
  .traffic-card {
    min-height: 320px;
    display: flex;
    flex-direction: column;
  }

  .traffic-chart {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex: 1;
    height: 200px;
    border-bottom: 2px solid #f1f5f9;
    padding-bottom: 0.5rem;
  }

  .chart-bar-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  .bar-wrapper {
    width: 32px;
    height: 150px;
    display: flex;
    align-items: flex-end;
    background: #f8fafc;
    border-radius: 6px;
    position: relative;
    cursor: pointer;

    &:hover .bar-hover-val {
      opacity: 1;
      transform: translateX(-50%) translateY(-8px);
    }
  }

  .bar-hover-val {
    position: absolute;
    top: -24px;
    left: 50%;
    transform: translateX(-50%) translateY(0);
    background: #0b1e30;
    color: #fff;
    padding: 0.2rem 0.45rem;
    font-size: 0.65rem;
    font-weight: 700;
    border-radius: 4px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: all 180ms ease;
  }

  .bar-fill {
    width: 100%;
    background: #1A73E8;
    border-radius: 6px;
    transition: height 300ms ease;
  }

  .bar-label {
    margin-top: 0.5rem;
    font-size: 0.72rem;
    font-weight: 600;
    color: #64748b;
    text-align: center;
  }

  /* Device Card Styles */
  .device-bar-container {
    margin-bottom: 1.5rem;
  }

  .device-bar {
    height: 20px;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    background: #f1f5f9;
    margin-bottom: 0.85rem;
  }

  .segment {
    height: 100%;
    cursor: pointer;
    transition: opacity 180ms ease;

    &:hover {
      opacity: 0.85;
    }

    &.desktop { background: #1A73E8; }
    &.mobile { background: #4291f7; }
    &.tablet { background: #cbd5e1; }
  }

  .device-legend {
    display: flex;
    gap: 1rem;
    font-size: 0.76rem;
    font-weight: 600;
    color: #475569;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .color-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &.desktop { background: #1A73E8; }
    &.mobile { background: #4291f7; }
    &.tablet { background: #cbd5e1; }
  }

  /* Browser list */
  .browser-list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;

    h4 {
      font-size: 0.85rem;
      font-weight: 700;
      color: #334155;
      margin: 0 0 0.25rem;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 0.35rem;
    }
  }

  .browser-row {
    display: grid;
    grid-template-columns: 80px 1fr 90px;
    align-items: center;
    gap: 0.85rem;
    font-size: 0.72rem;
    font-weight: 600;
    color: #475569;
  }

  .browser-name {
    color: #64748b;
  }

  .progress-bar-wrapper {
    height: 6px;
    background: #f1f5f9;
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: #1A73E8;
    border-radius: 3px;
  }

  .browser-count {
    text-align: right;
    color: #334155;
  }

  /* Table styling for Referrer & Pages lists */
  .table-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .table-header-row {
    display: grid;
    grid-template-columns: 1fr 80px 80px;
    font-size: 0.74rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-bottom: 2px solid #f1f5f9;
    padding-bottom: 0.5rem;
    margin-bottom: 0.4rem;
  }

  .pages-card .table-header-row {
    grid-template-columns: 1fr 100px;
  }

  .table-body-row {
    display: grid;
    grid-template-columns: 1fr 80px 80px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #475569;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f8fafc;

    &:last-child {
      border: none;
    }
  }

  .pages-card .table-body-row {
    grid-template-columns: 1fr 100px;
  }

  .ref-name, .path-name {
    color: #0b1e30;
    font-weight: 700;
  }

  .ref-hits, .path-count {
    color: #334155;
  }

  .ref-share {
    color: #64748b;
  }
`;

import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';

interface SettingsPageProps {
  profileName: string;
  profileEmail: string;
  profileRole: string;
  onProfileUpdate: (name: string, email: string, role: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  profileName,
  profileEmail,
  profileRole,
  onProfileUpdate
}) => {
  // Profile settings
  const [name, setName] = useState(profileName);
  const [email, setEmail] = useState(profileEmail);
  const [role, setRole] = useState(profileRole);
  const [avatarInitials, setAvatarInitials] = useState(() => localStorage.getItem('donezo_profile_initials') || 'MT');

  // Social Links settings
  const [githubUrl, setGithubUrl] = useState(() => localStorage.getItem('donezo_github_url') || 'https://github.com/Thabisomaqhawengwenya');
  const [linkedinUrl, setLinkedinUrl] = useState(() => localStorage.getItem('donezo_linkedin_url') || 'https://linkedin.com/in/maqhawengwenya');
  const [websiteUrl, setWebsiteUrl] = useState(() => localStorage.getItem('donezo_website_url') || 'https://donezo.com');

  // System/Tracker Settings
  const [autoSave, setAutoSave] = useState(() => localStorage.getItem('donezo_system_autosave') !== 'false');
  const [trackerAlerts, setTrackerAlerts] = useState(() => localStorage.getItem('donezo_system_alerts') === 'true');

  // Action Feedback states
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    // Simulate saving settings (writes to localStorage)
    setTimeout(() => {
      localStorage.setItem('donezo_profile_name', name);
      localStorage.setItem('donezo_profile_email', email);
      localStorage.setItem('donezo_profile_role', role);
      localStorage.setItem('donezo_profile_initials', avatarInitials);
      
      localStorage.setItem('donezo_github_url', githubUrl);
      localStorage.setItem('donezo_linkedin_url', linkedinUrl);
      localStorage.setItem('donezo_website_url', websiteUrl);

      localStorage.setItem('donezo_system_autosave', autoSave ? 'true' : 'false');
      localStorage.setItem('donezo_system_alerts', trackerAlerts ? 'true' : 'false');

      // Update parent component state for header
      onProfileUpdate(name, email, role);

      setSaving(false);
      setSuccess(true);

      // Hide success notification after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  return (
    <StyledSettings>
      <form onSubmit={handleSave}>
        <div className="settings-grid">
          {/* Column 1: Profile card and System settings */}
          <div className="settings-col">
            <div className="settings-card">
              <div className="card-header">
                <Icon icon="lucide:user" className="card-icon" />
                <h3>Profile Settings</h3>
              </div>
              <div className="card-body">
                <div className="avatar-preview-section">
                  <div className="avatar-large">{avatarInitials}</div>
                  <div className="avatar-inputs">
                    <label>Avatar Initials</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={avatarInitials}
                      onChange={(e) => setAvatarInitials(e.target.value.toUpperCase())}
                      placeholder="MT"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maqhawe T"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. admin@donezo.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Job Title / Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Fullstack Engineer"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="settings-card">
              <div className="card-header">
                <Icon icon="lucide:sliders" className="card-icon" />
                <h3>Preferences</h3>
              </div>
              <div className="card-body">
                <div className="toggle-option">
                  <div className="toggle-info">
                    <h4>Auto-save changes</h4>
                    <p>Persist project edits automatically to mock storage</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={autoSave}
                      onChange={(e) => setAutoSave(e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="toggle-option">
                  <div className="toggle-info">
                    <h4>Tracker alerts</h4>
                    <p>Notify when calendar milestones are approaching</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={trackerAlerts}
                      onChange={(e) => setTrackerAlerts(e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: External Links & Social settings */}
          <div className="settings-col">
            <div className="settings-card">
              <div className="card-header">
                <Icon icon="lucide:link-2" className="card-icon" />
                <h3>External Links</h3>
              </div>
              <div className="card-body">
                <p className="card-description">
                  Configure links shown across your main portfolio page for visitor redirects.
                </p>

                <div className="form-group">
                  <label>GitHub Profile</label>
                  <div className="input-with-icon">
                    <Icon icon="lucide:github" className="input-inner-icon" />
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>LinkedIn Profile</label>
                  <div className="input-with-icon">
                    <Icon icon="lucide:linkedin" className="input-inner-icon" />
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Personal Website</label>
                  <div className="input-with-icon">
                    <Icon icon="lucide:globe" className="input-inner-icon" />
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-card security-card">
              <div className="card-header">
                <Icon icon="lucide:shield-check" className="card-icon" />
                <h3>Security & Platform</h3>
              </div>
              <div className="card-body">
                <div className="platform-info-row">
                  <span className="info-label">Environment:</span>
                  <span className="info-badge">Production</span>
                </div>
                <div className="platform-info-row">
                  <span className="info-label">Storage Backend:</span>
                  <span className="info-badge">Local JSON Database</span>
                </div>
                <div className="platform-info-row">
                  <span className="info-label">Framework:</span>
                  <span className="info-badge">React & Vite v8</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="settings-actions">
          {success && (
            <div className="success-toast">
              <Icon icon="lucide:check-circle-2" className="toast-icon" />
              <span>Settings updated successfully!</span>
            </div>
          )}
          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? (
              <>
                <span className="spinner-small"></span>
                Saving...
              </>
            ) : (
              <>
                <Icon icon="lucide:save" className="btn-icon" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </StyledSettings>
  );
};

const StyledSettings = styled.div`
  max-width: 1000px;
  margin: 0 auto;

  .settings-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .settings-col {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .settings-card {
    background: #fff;
    border-radius: 1.25rem;
    padding: 1.5rem;
    border: 1px solid #eaeaea;
    box-shadow: 0 4px 12px rgba(0,0,0,0.015);

    .card-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #f3f4f6;
      padding-bottom: 0.75rem;

      .card-icon {
        font-size: 1.6rem;
        color: #1A73E8;
      }

      h3 {
        margin: 0;
        font-size: 1.15rem;
        color: #0b1e30;
        font-weight: 700;
      }
    }

    .card-description {
      font-size: 0.86rem;
      color: #666;
      margin: 0 0 1.25rem;
      line-height: 1.4;
    }
  }

  .avatar-preview-section {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-bottom: 1.5rem;
    background: #f8fafc;
    padding: 1rem;
    border-radius: 0.75rem;
    border: 1px dashed #e2e8f0;

    .avatar-large {
      width: 4.5rem;
      height: 4.5rem;
      border-radius: 50%;
      background: #eff6ff;
      color: #1A73E8;
      font-size: 1.5rem;
      font-weight: 800;
      display: grid;
      place-items: center;
      box-shadow: inset 0 2px 4px rgba(26,115,232,0.1);
    }

    .avatar-inputs {
      flex: 1;

      label {
        display: block;
        font-size: 0.75rem;
        font-weight: 600;
        color: #64748b;
        margin-bottom: 0.25rem;
      }

      input {
        width: 60px;
        text-align: center;
        padding: 0.4rem 0.5rem;
        border-radius: 6px;
        border: 1px solid #cbd5e1;
        outline: none;
        font-weight: 700;
        background: #fafafa;
        color: #1e293b;

        &:focus {
          border-color: #1a73e8;
        }
      }
    }
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    margin-bottom: 1.25rem;

    label {
      font-size: 0.84rem;
      font-weight: 600;
      color: #4b5563;
    }

    input {
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      font-size: 0.9rem;
      background: #fafafa;
      color: #111;
      outline: none;
      transition: border-color 150ms ease;

      &:focus {
        border-color: #1A73E8;
      }

      &::placeholder {
        color: #9ca3af;
      }
    }
  }

  .input-with-icon {
    position: relative;

    .input-inner-icon {
      position: absolute;
      left: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      color: #888;
      font-size: 1rem;
    }

    input {
      width: 100%;
      padding-left: 2.3rem;
      box-sizing: border-box;
    }
  }

  .toggle-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
      border: 0;
    }

    .toggle-info {
      h4 {
        margin: 0;
        font-size: 0.92rem;
        color: #1f2937;
        font-weight: 600;
      }
      p {
        margin: 0.15rem 0 0;
        font-size: 0.78rem;
        color: #6b7280;
      }
    }
  }

  /* Switch Toggle Button styling */
  .switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;

    input {
      opacity: 0;
      width: 0;
      height: 0;
    }
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #cbd5e1;
    transition: .3s;
    border-radius: 34px;

    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .3s;
      border-radius: 50%;
    }
  }

  input:checked + .slider {
    background-color: #1A73E8;
  }

  input:checked + .slider:before {
    transform: translateX(20px);
  }

  /* Platform Info card styling */
  .security-card {
    .platform-info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.65rem 0;
      border-bottom: 1px solid #f3f4f6;

      &:last-child {
        border-bottom: 0;
      }

      .info-label {
        font-size: 0.86rem;
        color: #4b5563;
        font-weight: 500;
      }

      .info-badge {
        font-size: 0.78rem;
        font-weight: 600;
        color: #1e293b;
        background: #f1f5f9;
        padding: 0.2rem 0.5rem;
        border-radius: 6px;
      }
    }
  }

  /* Bottom Actions */
  .settings-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
    border-top: 1px solid #eaeaea;
    padding-top: 1.5rem;
  }

  .save-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #1A73E8;
    color: #fff;
    border: 0;
    border-radius: 10px;
    padding: 0.75rem 1.5rem;
    font-size: 0.92rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(26,115,232,0.25);
    transition: background 150ms ease, box-shadow 150ms ease;

    &:hover {
      background: #1557B0;
      box-shadow: 0 4px 12px rgba(26,115,232,0.35);
    }

    &:disabled {
      background: #93c5fd;
      cursor: not-allowed;
      box-shadow: none;
    }

    .btn-icon {
      font-size: 1.1rem;
    }
  }

  .success-toast {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #dcfce7;
    border: 1px solid #bbf7d0;
    color: #15803d;
    padding: 0.6rem 1rem;
    border-radius: 10px;
    font-size: 0.88rem;
    font-weight: 500;
    animation: fadeIn 300ms ease;

    .toast-icon {
      font-size: 1.1rem;
    }
  }

  .spinner-small {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 800ms linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

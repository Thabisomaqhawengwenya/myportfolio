import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { doc, onSnapshot, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';

interface CVConfig {
  url: string;
  fileName: string;
  fileSize?: string;
  updatedAt?: string;
  enabled?: boolean;
}

interface CVPageProps {
  cvDownloadsCount?: number;
}

interface DownloadEvent {
  id: string;
  timestamp: string;
  userAgent?: string;
}

export const CVPage: React.FC<CVPageProps> = ({ cvDownloadsCount = 0 }) => {
  const [cvConfig, setCvConfig] = useState<CVConfig>({
    url: '/Maqhawe_CV.pdf',
    fileName: 'Maqhawe_CV.pdf',
    fileSize: '185 KB',
    updatedAt: new Date().toISOString(),
    enabled: true,
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [recentDownloads, setRecentDownloads] = useState<DownloadEvent[]>([]);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fetch CV configuration & download events from Firestore
  useEffect(() => {
    // Real-time listener for CV config in Firestore
    const unsubCv = onSnapshot(
      doc(db, 'settings', 'cv'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as CVConfig;
          setCvConfig({
            url: data.url || '/Maqhawe_CV.pdf',
            fileName: data.fileName || 'Maqhawe_CV.pdf',
            fileSize: data.fileSize || '185 KB',
            updatedAt: data.updatedAt || new Date().toISOString(),
            enabled: data.enabled !== false,
          });
          setCustomUrlInput(data.url || '');
        }
        setLoading(false);
      },
      (err) => {
        console.warn('CV config snapshot error:', err);
        setLoading(false);
      }
    );

    // Fetch recent download telemetry events
    const fetchTelemetry = async () => {
      try {
        const eventsSnap = await getDocs(collection(db, 'events'));
        const dlEvents: DownloadEvent[] = [];
        eventsSnap.forEach((snap) => {
          const d = snap.data();
          if (d.type === 'cv_download') {
            dlEvents.push({
              id: snap.id,
              timestamp: d.timestamp || new Date().toISOString(),
              userAgent: d.userAgent || 'Web Browser',
            });
          }
        });
        dlEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setRecentDownloads(dlEvents.slice(0, 5));
      } catch (err) {
        console.warn('Telemetry fetch warning:', err);
      }
    };

    fetchTelemetry();

    return () => unsubCv();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Please select a valid PDF document (.pdf)', 'error');
      return;
    }

    // Check size limit: 15MB
    if (file.size > 15 * 1024 * 1024) {
      showToast('PDF file size is too large (maximum 15MB allowed)', 'error');
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    const formatBytes = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formattedSize = formatBytes(file.size);
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageRef = ref(storage, `cv/${Date.now()}_${sanitizedFileName}`);

    try {
      // 1. Upload to Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        async (error) => {
          console.warn('Firebase Storage upload warning, falling back to local base64/URL:', error);
          // Fallback if Firebase storage bucket rules block write
          const reader = new FileReader();
          reader.onload = async (e) => {
            const dataUrl = e.target?.result as string;
            const updated: CVConfig = {
              url: dataUrl || '/Maqhawe_CV.pdf',
              fileName: file.name,
              fileSize: formattedSize,
              updatedAt: new Date().toISOString(),
              enabled: cvConfig.enabled,
            };
            setCvConfig(updated);
            await setDoc(doc(db, 'settings', 'cv'), updated, { merge: true });
            setUploading(false);
            showToast('CV uploaded and updated successfully!');
          };
          reader.readAsDataURL(file);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          const updated: CVConfig = {
            url: downloadUrl,
            fileName: file.name,
            fileSize: formattedSize,
            updatedAt: new Date().toISOString(),
            enabled: cvConfig.enabled,
          };
          setCvConfig(updated);
          setCustomUrlInput(downloadUrl);
          await setDoc(doc(db, 'settings', 'cv'), updated, { merge: true });
          setUploading(false);
          showToast('New CV uploaded and saved live to Firestore & Storage!');
        }
      );
    } catch (err) {
      console.error('Upload failed:', err);
      setUploading(false);
      showToast('Failed to upload CV file. Please try again.', 'error');
    }
  };

  const handleCustomUrlSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;

    try {
      const updated: CVConfig = {
        ...cvConfig,
        url: customUrlInput.trim(),
        updatedAt: new Date().toISOString(),
      };
      setCvConfig(updated);
      await setDoc(doc(db, 'settings', 'cv'), updated, { merge: true });
      showToast('Custom CV link saved and updated live!');
    } catch (err) {
      console.error('Failed to save CV link:', err);
      showToast('Failed to save custom CV URL.', 'error');
    }
  };

  const handleToggleSectionEnabled = async (enabled: boolean) => {
    try {
      const updated = { ...cvConfig, enabled };
      setCvConfig(updated);
      await setDoc(doc(db, 'settings', 'cv'), { enabled }, { merge: true });
      showToast(enabled ? 'Public CV download enabled' : 'Public CV download hidden');
    } catch (err) {
      console.error('Failed to toggle CV visibility:', err);
    }
  };

  const handleCopyLink = () => {
    const fullUrl = cvConfig.url.startsWith('http')
      ? cvConfig.url
      : `${window.location.origin}${cvConfig.url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('CV link copied to clipboard!');
  };

  const formatDate = (iso?: string) => {
    if (!iso) return 'Recent';
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <StyledCVPage>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`toast-banner toast-${toastMessage.type}`}>
          <Icon
            icon={toastMessage.type === 'success' ? 'lucide:check-circle-2' : 'lucide:alert-circle'}
            width={18}
            height={18}
          />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header Card & Actions */}
      <div className="cv-top-bar">
        <div className="top-bar-left">
          <div className="doc-icon-wrap">
            <Icon icon="lucide:file-text" width={26} height={26} />
          </div>
          <div>
            <h3>{cvConfig.fileName}</h3>
            <p className="doc-meta">
              <span>Last updated: {formatDate(cvConfig.updatedAt)}</span>
              <span className="dot">•</span>
              <span>Size: {cvConfig.fileSize}</span>
            </p>
          </div>
        </div>

        <div className="top-bar-actions">
          <button className="action-btn btn-secondary" onClick={handleCopyLink} title="Copy public CV link">
            <Icon icon={copied ? 'lucide:check' : 'lucide:copy'} width={16} height={16} />
            <span>{copied ? 'Copied Link' : 'Copy Link'}</span>
          </button>

          <a
            href={cvConfig.url}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn btn-secondary"
            title="Open CV in full window tab"
          >
            <Icon icon="lucide:external-link" width={16} height={16} />
            <span>Open Full Tab</span>
          </a>

          <a
            href={cvConfig.url}
            download={cvConfig.fileName}
            className="action-btn btn-primary"
            title="Download active CV"
          >
            <Icon icon="lucide:download" width={16} height={16} />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="cv-stats-row">
        <div className="stat-card">
          <div className="stat-header">
            <span>Total CV Downloads</span>
            <span className="icon-wrap color-blue">
              <Icon icon="lucide:arrow-down-circle" width={17} height={17} />
            </span>
          </div>
          <div className="stat-number">{cvDownloadsCount}</div>
          <div className="stat-desc">Tracked across recruiters & visitors</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Public Status</span>
            <span className={`icon-wrap ${cvConfig.enabled ? 'color-green' : 'color-gray'}`}>
              <Icon icon={cvConfig.enabled ? 'lucide:eye' : 'lucide:eye-off'} width={17} height={17} />
            </span>
          </div>
          <div className="stat-number" style={{ fontSize: '1.25rem', marginTop: '0.4rem' }}>
            {cvConfig.enabled ? 'Live on Portfolio' : 'Download Hidden'}
          </div>
          <div className="stat-desc">
            <button
              className="quick-toggle-link"
              onClick={() => handleToggleSectionEnabled(!cvConfig.enabled)}
            >
              {cvConfig.enabled ? 'Click to hide button' : 'Click to enable button'}
            </button>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>File Format</span>
            <span className="icon-wrap color-purple">
              <Icon icon="lucide:file-badge" width={17} height={17} />
            </span>
          </div>
          <div className="stat-number">PDF</div>
          <div className="stat-desc">Universal Adobe standard</div>
        </div>
      </div>

      {/* Main Two-Column Layout: Left Viewer + Right Uploader */}
      <div className="cv-main-grid">
        {/* Left Column: Live PDF Embed / Preview */}
        <div className="viewer-panel">
          <div className="panel-header">
            <div className="header-title-row">
              <Icon icon="lucide:file-search" width={18} height={18} style={{ color: '#1A73E8' }} />
              <h4>Live Document Preview</h4>
            </div>
            <button
              className="refresh-btn"
              onClick={() => {
                if (iframeRef.current) {
                  iframeRef.current.src = `${cvConfig.url}?t=${Date.now()}`;
                }
              }}
              title="Refresh Preview"
            >
              <Icon icon="lucide:rotate-cw" width={14} height={14} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="iframe-container">
            {loading ? (
              <div className="preview-loader">
                <Icon icon="lucide:loader-2" className="spin-icon" width={32} height={32} />
                <p>Loading document preview...</p>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                src={cvConfig.url}
                title="CV Document Preview"
                className="cv-iframe"
              />
            )}
          </div>
        </div>

        {/* Right Column: Upload Dropzone & Controls */}
        <div className="upload-sidebar-col">
          {/* Upload Dropzone Card */}
          <div className="sidebar-card upload-card">
            <div className="card-title">
              <Icon icon="lucide:upload-cloud" width={18} height={18} style={{ color: '#1A73E8' }} />
              <h4>Upload New CV Version</h4>
            </div>
            <p className="card-desc">
              Upload a new `.pdf` file. This will immediately update the download link on your live portfolio.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,application/pdf"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            <div
              className={`dropzone ${uploading ? 'is-uploading' : ''}`}
              onClick={() => !uploading && fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
            >
              <div className="dropzone-icon">
                <Icon
                  icon={uploading ? 'lucide:loader-2' : 'lucide:file-up'}
                  width={34}
                  height={34}
                  className={uploading ? 'spin-icon' : ''}
                />
              </div>
              <div className="dropzone-text">
                {uploading ? (
                  <>
                    <p className="primary-text">Uploading CV ({uploadProgress}%)...</p>
                    <div className="upload-progress-bar">
                      <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="primary-text">Click to browse or drag & drop</p>
                    <p className="secondary-text">PDF document up to 15MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Custom Hosted URL Card */}
          <div className="sidebar-card link-card">
            <div className="card-title">
              <Icon icon="lucide:link" width={18} height={18} style={{ color: '#6366f1' }} />
              <h4>Direct URL / Hosted Link</h4>
            </div>
            <p className="card-desc">
              Or specify a direct URL (e.g. Google Drive, Cloud Storage, or public hosted link):
            </p>
            <form onSubmit={handleCustomUrlSave} className="url-form">
              <input
                type="url"
                required
                placeholder="https://... or /Maqhawe_CV.pdf"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
              />
              <button type="submit" className="btn-save-url">
                <Icon icon="lucide:save" width={15} height={15} />
                Save Link
              </button>
            </form>
          </div>

          {/* Recent Download Telemetry */}
          <div className="sidebar-card telemetry-card">
            <div className="card-title">
              <Icon icon="lucide:activity" width={18} height={18} style={{ color: '#10b981' }} />
              <h4>Recent Download Activity</h4>
            </div>

            {recentDownloads.length === 0 ? (
              <p className="empty-telemetry">No download events logged yet.</p>
            ) : (
              <div className="telemetry-list">
                {recentDownloads.map((ev) => (
                  <div key={ev.id} className="telemetry-item">
                    <div className="telemetry-icon">
                      <Icon icon="lucide:download" width={13} height={13} />
                    </div>
                    <div className="telemetry-details">
                      <span className="telemetry-time">{formatDate(ev.timestamp)}</span>
                      <span className="telemetry-ua" title={ev.userAgent}>
                        {ev.userAgent?.includes('Mac')
                          ? 'macOS Visitor'
                          : ev.userAgent?.includes('Windows')
                          ? 'Windows Visitor'
                          : ev.userAgent?.includes('Android')
                          ? 'Android Visitor'
                          : ev.userAgent?.includes('iPhone')
                          ? 'iPhone Visitor'
                          : 'Web Visitor'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </StyledCVPage>
  );
};

const StyledCVPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .toast-banner {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.75rem 1.25rem;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    animation: slideDown 0.25s ease;

    &.toast-success {
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #bbf7d0;
    }

    &.toast-error {
      background: #fee2e2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Top Bar */
  .cv-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    border: 1px solid #eaeaea;
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }

    .top-bar-left {
      display: flex;
      align-items: center;
      gap: 1rem;

      .doc-icon-wrap {
        width: 3rem;
        height: 3rem;
        border-radius: 12px;
        background: #eff6ff;
        color: #1A73E8;
        display: grid;
        place-items: center;
        flex-shrink: 0;
      }

      h3 {
        margin: 0;
        font-size: 1.15rem;
        font-weight: 700;
        color: #0f172a;
      }

      .doc-meta {
        margin: 0.2rem 0 0 0;
        font-size: 0.82rem;
        color: #64748b;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        flex-wrap: wrap;

        .dot {
          opacity: 0.5;
        }
      }
    }

    .top-bar-actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-wrap: wrap;

      .action-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.55rem 1rem;
        border-radius: 9px;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.15s ease;

        &.btn-primary {
          background: #1A73E8;
          color: #ffffff;
          border: 1px solid #1A73E8;
          box-shadow: 0 2px 8px rgba(26, 115, 232, 0.25);

          &:hover {
            background: #1557b0;
          }
        }

        &.btn-secondary {
          background: #f8fafc;
          color: #334155;
          border: 1px solid #cbd5e1;

          &:hover {
            background: #f1f5f9;
            color: #0f172a;
          }
        }
      }
    }
  }

  /* Stats Row */
  .cv-stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .stat-card {
      background: #ffffff;
      border: 1px solid #eaeaea;
      border-radius: 14px;
      padding: 1.25rem;

      .stat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.85rem;
        color: #64748b;
        font-weight: 600;

        .icon-wrap {
          width: 2rem;
          height: 2rem;
          border-radius: 8px;
          display: grid;
          place-items: center;

          &.color-blue {
            background: #eff6ff;
            color: #1A73E8;
          }
          &.color-green {
            background: #dcfce7;
            color: #16a34a;
          }
          &.color-gray {
            background: #f1f5f9;
            color: #64748b;
          }
          &.color-purple {
            background: #f3e8ff;
            color: #9333ea;
          }
        }
      }

      .stat-number {
        font-size: 1.75rem;
        font-weight: 800;
        color: #0f172a;
        margin: 0.35rem 0 0.15rem 0;
      }

      .stat-desc {
        font-size: 0.78rem;
        color: #64748b;

        .quick-toggle-link {
          background: none;
          border: none;
          padding: 0;
          color: #1A73E8;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }
  }

  /* Main Two-Column Grid */
  .cv-main-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 1.25rem;
    align-items: start;

    @media (max-width: 1080px) {
      grid-template-columns: 1fr;
    }
  }

  /* Left Column: PDF Viewer */
  .viewer-panel {
    background: #ffffff;
    border: 1px solid #eaeaea;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #eaeaea;

      .header-title-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        h4 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
        }
      }

      .refresh-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        color: #475569;
        font-size: 0.78rem;
        font-weight: 600;
        padding: 0.35rem 0.75rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s ease;

        &:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
      }
    }

    .iframe-container {
      position: relative;
      width: 100%;
      height: 720px;
      background: #f1f5f9;

      @media (max-width: 640px) {
        height: 500px;
      }

      .preview-loader {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.75rem;
        color: #64748b;
        font-size: 0.9rem;
      }

      .cv-iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
    }
  }

  /* Right Column: Upload Cards */
  .upload-sidebar-col {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    .sidebar-card {
      background: #ffffff;
      border: 1px solid #eaeaea;
      border-radius: 16px;
      padding: 1.25rem;

      .card-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.35rem;

        h4 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
        }
      }

      .card-desc {
        font-size: 0.82rem;
        color: #64748b;
        margin: 0 0 1rem 0;
        line-height: 1.4;
      }
    }

    /* Dropzone */
    .dropzone {
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      padding: 1.75rem 1.25rem;
      text-align: center;
      cursor: pointer;
      background: #f8fafc;
      transition: all 0.2s ease;

      &:hover {
        border-color: #1A73E8;
        background: #eff6ff;
      }

      &.is-uploading {
        pointer-events: none;
        border-color: #1A73E8;
      }

      .dropzone-icon {
        color: #1A73E8;
        margin-bottom: 0.5rem;
      }

      .primary-text {
        font-size: 0.88rem;
        font-weight: 700;
        color: #0f172a;
        margin: 0 0 0.2rem 0;
      }

      .secondary-text {
        font-size: 0.75rem;
        color: #64748b;
        margin: 0;
      }

      .upload-progress-bar {
        width: 100%;
        height: 6px;
        background: #e2e8f0;
        border-radius: 99px;
        margin-top: 0.75rem;
        overflow: hidden;

        .upload-progress-fill {
          height: 100%;
          background: #1A73E8;
          transition: width 0.2s ease;
        }
      }
    }

    /* URL Form */
    .url-form {
      display: flex;
      gap: 0.5rem;

      input {
        flex: 1;
        padding: 0.6rem 0.85rem;
        border-radius: 8px;
        border: 1px solid #cbd5e1;
        font-size: 0.85rem;
        color: #0f172a;
        outline: none;

        &:focus {
          border-color: #1A73E8;
        }
      }

      .btn-save-url {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        background: #4f46e5;
        color: #ffffff;
        border: none;
        padding: 0.6rem 0.9rem;
        border-radius: 8px;
        font-size: 0.82rem;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;

        &:hover {
          background: #4338ca;
        }
      }
    }

    /* Telemetry Stream */
    .telemetry-list {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;

      .telemetry-item {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        padding: 0.5rem 0.75rem;
        background: #f8fafc;
        border: 1px solid #f1f5f9;
        border-radius: 8px;

        .telemetry-icon {
          color: #10b981;
          display: grid;
          place-items: center;
        }

        .telemetry-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex: 1;

          .telemetry-time {
            font-size: 0.78rem;
            color: #64748b;
          }

          .telemetry-ua {
            font-size: 0.76rem;
            font-weight: 600;
            color: #1e293b;
          }
        }
      }
    }

    .empty-telemetry {
      font-size: 0.82rem;
      color: #94a3b8;
      font-style: italic;
      margin: 0;
    }
  }

  .spin-icon {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

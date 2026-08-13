import React, { useState, useRef } from 'react';
import styled from 'styled-components';

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

interface ProjectsPageProps {
  projects: Project[];
  onSaveProjects: (updatedProjects: Project[]) => void;
  searchQuery: string;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, onSaveProjects, searchQuery }) => {
  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form inputs
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'personal' | 'business' | 'education' | 'utility' | 'gift'>('business');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [usePlaceholder, setUsePlaceholder] = useState(false);
  const [placeholderBadge, setPlaceholderBadge] = useState('');
  const [placeholderTitle, setPlaceholderTitle] = useState('');
  const [placeholderCopy, setPlaceholderCopy] = useState('');
  const [placeholderMediaClass, setPlaceholderMediaClass] = useState<'media-five' | 'media-six'>('media-five');

  // File upload state
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter projects by search query
  const filtered = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setCategory(project.category);
    setDescription(project.description);
    setTagsInput(project.tags.join(', '));
    setLiveDemoUrl(project.liveDemoUrl || '');
    setGithubUrl(project.githubUrl || '');
    setImageUrl(project.image || '');

    if (project.placeholder) {
      setUsePlaceholder(true);
      setPlaceholderBadge(project.placeholder.badge);
      setPlaceholderTitle(project.placeholder.title);
      setPlaceholderCopy(project.placeholder.copy);
      setPlaceholderMediaClass(project.placeholder.mediaClass);
    } else {
      setUsePlaceholder(false);
      setPlaceholderBadge('');
      setPlaceholderTitle('');
      setPlaceholderCopy('');
      setPlaceholderMediaClass('media-five');
    }

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updated = projects.filter((p) => p.id !== id);
      onSaveProjects(updated);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setTitle('');
    setCategory('business');
    setDescription('');
    setTagsInput('');
    setLiveDemoUrl('');
    setGithubUrl('');
    setImageUrl('');
    setUsePlaceholder(false);
    setPlaceholderBadge('');
    setPlaceholderTitle('');
    setPlaceholderCopy('');
    setPlaceholderMediaClass('media-five');
    setShowForm(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    // Sanitize filename
    const ext = file.name.split('.').pop() || 'png';
    const cleanName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9]/g, '_')}.${ext}`;

    setUploading(true);
    try {
      const response = await fetch(`/api/upload?name=${cleanName}`, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      setImageUrl(data.url);
    } catch (err) {
      alert('Error uploading file. Make sure you are running in local dev mode.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Project Title and Description/Bio are required.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const projectData: Project = {
      id: editingId || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: title.trim(),
      category,
      description: description.trim(),
      tags,
      liveDemoUrl: liveDemoUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
    };

    if (usePlaceholder) {
      projectData.placeholder = {
        badge: placeholderBadge.trim() || 'Project',
        title: placeholderTitle.trim() || title,
        copy: placeholderCopy.trim() || category,
        mediaClass: placeholderMediaClass,
      };
    } else {
      projectData.image = imageUrl.trim() || undefined;
    }

    let updated: Project[];
    if (editingId) {
      updated = projects.map((p) => (p.id === editingId ? projectData : p));
    } else {
      // Check for duplicate ID
      if (projects.some((p) => p.id === projectData.id)) {
        projectData.id = `${projectData.id}-${Date.now().toString().slice(-4)}`;
      }
      updated = [...projects, projectData];
    }

    onSaveProjects(updated);
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <StyledProjectsPage>
      <div className="section-header">
        <h2>Portfolio Projects</h2>
        {!showForm && (
          <button className="add-btn" onClick={handleAddNew}>
            + Add Project
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-panel">
          <h3>{editingId ? 'Edit Project' : 'Add New Project'}</h3>
          <form onSubmit={handleFormSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Project Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Island Child Apparel"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                >
                  <option value="business">Business</option>
                  <option value="personal">Personal</option>
                  <option value="education">Education</option>
                  <option value="utility">Utility</option>
                  <option value="gift">Gift</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Bio / Description *</label>
                <textarea
                  rows={3}
                  placeholder="Explain what the project does..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Languages & Frameworks Used (comma separated) *</label>
                <input
                  type="text"
                  placeholder="e.g. React.js, Vite, styled-components"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Live Demo Link</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>GitHub Repository Link</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
              </div>

              <div className="form-group checkbox-group full-width">
                <input
                  type="checkbox"
                  id="usePlaceholder"
                  checked={usePlaceholder}
                  onChange={(e) => setUsePlaceholder(e.target.checked)}
                />
                <label htmlFor="usePlaceholder">Use custom badge/text placeholder (No Image)</label>
              </div>

              {usePlaceholder ? (
                <>
                  <div className="form-group">
                    <label>Placeholder Badge</label>
                    <input
                      type="text"
                      placeholder="e.g. Utility"
                      value={placeholderBadge}
                      onChange={(e) => setPlaceholderBadge(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Placeholder Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Age"
                      value={placeholderTitle}
                      onChange={(e) => setPlaceholderTitle(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Placeholder Subtext / Copy</label>
                    <input
                      type="text"
                      placeholder="e.g. Calculator"
                      value={placeholderCopy}
                      onChange={(e) => setPlaceholderCopy(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Placeholder Style Class</label>
                    <select
                      value={placeholderMediaClass}
                      onChange={(e) => setPlaceholderMediaClass(e.target.value as any)}
                    >
                      <option value="media-five">Diagonal Waves (Light)</option>
                      <option value="media-six">Sharp Peaks (Dark)</option>
                    </select>
                  </div>
                </>
              ) : (
                <div className="form-group full-width upload-section">
                  <label>Project Image URL or File Upload</label>
                  <div className="upload-row">
                    <input
                      type="text"
                      placeholder="/images/project-image.webp or http://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      accept="image/*"
                    />
                    <button
                      type="button"
                      className="upload-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : '📁 Upload Local'}
                    </button>
                  </div>
                  {imageUrl && (
                    <div className="image-preview">
                      <img src={imageUrl} alt="Uploaded preview" />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                Save Project
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Grid List */}
      <div className="projects-list-panel">
        <div className="panel-title">
          <h3>All Portfolio Items ({filtered.length})</h3>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">No projects found matching the query.</div>
        ) : (
          <div className="projects-table">
            <div className="table-header">
              <div>Preview</div>
              <div>Title & Description</div>
              <div>Category</div>
              <div>Languages</div>
              <div style={{ textAlign: 'right' }}>Actions</div>
            </div>

            {filtered.map((project) => (
              <div key={project.id} className="table-row">
                <div className="table-preview">
                  {project.image ? (
                    <img src={project.image} alt={project.title} />
                  ) : (
                    <div className="table-placeholder-box">
                      {project.placeholder?.badge || 'Txt'}
                    </div>
                  )}
                </div>

                <div className="table-info">
                  <h4>{project.title}</h4>
                  <p>{project.description.slice(0, 100)}...</p>
                  <div className="links">
                    {project.liveDemoUrl && (
                      <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                        Demo 🔗
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        GitHub 🛠
                      </a>
                    )}
                  </div>
                </div>

                <div className="table-category">
                  <span className={`category-tag cat-${project.category}`}>
                    {project.category}
                  </span>
                </div>

                <div className="table-tags">
                  {project.tags.map((t, i) => (
                    <span key={i} className="tag-pill">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="table-actions">
                  <button className="action-btn edit-action" onClick={() => handleEdit(project)}>
                    Edit
                  </button>
                  <button
                    className="action-btn delete-action"
                    onClick={() => handleDelete(project.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StyledProjectsPage>
  );
};

const StyledProjectsPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      font-size: 1.6rem;
      font-weight: 700;
      color: #0b1a10;
      margin: 0;
    }

    .add-btn {
      background: #0d4626;
      color: #fff;
      border: 0;
      padding: 0.65rem 1.25rem;
      border-radius: 99px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(13, 70, 38, 0.2);

      &:hover {
        background: #09331b;
      }
    }
  }

  .form-panel {
    background: #fff;
    border-radius: 1.25rem;
    padding: 1.5rem;
    border: 1px solid #eaeaea;
    color: #111;

    h3 {
      margin: 0 0 1.25rem;
      font-size: 1.2rem;
      color: #0b1a10;
      font-weight: 600;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;

      @media (max-width: 760px) {
        grid-template-columns: 1fr;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;

      &.full-width {
        grid-column: span 2;

        @media (max-width: 760px) {
          grid-column: span 1;
        }
      }

      label {
        font-size: 0.84rem;
        font-weight: 600;
        color: #444;
      }

      input[type='text'],
      input[type='url'],
      select,
      textarea {
        padding: 0.75rem 1rem;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        font-size: 0.92rem;
        background: #fafafa;
        color: #111;

        &:focus {
          border-color: #0d4626;
          outline: 0;
          background: #fff;
        }
      }
    }

    .checkbox-group {
      flex-direction: row;
      align-items: center;
      gap: 0.6rem;
      padding: 0.5rem 0;

      label {
        cursor: pointer;
        user-select: none;
      }

      input[type='checkbox'] {
        width: 1.15rem;
        height: 1.15rem;
        cursor: pointer;
      }
    }

    .upload-section {
      .upload-row {
        display: flex;
        gap: 0.75rem;

        input {
          flex: 1;
        }
      }

      .upload-btn {
        background: #f0f3f1;
        color: #0d4626;
        border: 1px solid #d4dfc4;
        padding: 0 1.2rem;
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 0.88rem;
        cursor: pointer;

        &:hover {
          background: #e1e9e3;
        }

        &:disabled {
          opacity: 0.6;
        }
      }

      .image-preview {
        margin-top: 0.85rem;
        max-width: 240px;
        border-radius: 8px;
        border: 1px solid #ddd;
        overflow: hidden;

        img {
          width: 100%;
          display: block;
        }
      }
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
      border-top: 1px solid #f0f0f0;
      padding-top: 1.25rem;

      button {
        padding: 0.65rem 1.35rem;
        border-radius: 99px;
        font-size: 0.88rem;
        font-weight: 600;
        cursor: pointer;
      }

      .save-btn {
        background: #0d4626;
        color: #fff;
        border: 0;

        &:hover {
          background: #09331b;
        }
      }

      .cancel-btn {
        background: #f7f7f7;
        color: #333;
        border: 1px solid #ddd;

        &:hover {
          background: #eee;
        }
      }
    }
  }

  .projects-list-panel {
    background: #fff;
    border-radius: 1.25rem;
    padding: 1.5rem;
    border: 1px solid #eaeaea;
    color: #111;

    .panel-title {
      margin-bottom: 1.2rem;
      h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
      }
    }

    .empty-state {
      padding: 3rem;
      text-align: center;
      color: #777;
      font-size: 0.94rem;
    }

    .projects-table {
      display: flex;
      flex-direction: column;
    }

    .table-header,
    .table-row {
      display: grid;
      grid-template-columns: 80px 2.2fr 1fr 1.5fr 140px;
      gap: 1.25rem;
      align-items: center;
      padding: 0.85rem 0.5rem;
      font-size: 0.88rem;

      @media (max-width: 900px) {
        grid-template-columns: 80px 1.8fr 1fr 100px;
        .table-tags {
          display: none;
        }
      }
      @media (max-width: 600px) {
        grid-template-columns: 1fr auto;
        .table-preview,
        .table-category {
          display: none;
        }
      }
    }

    .table-header {
      border-bottom: 2px solid #f0f0f0;
      font-weight: 700;
      color: #666;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .table-row {
      border-bottom: 1px solid #f4f4f4;

      &:last-child {
        border-bottom: 0;
      }
    }

    .table-preview {
      width: 70px;
      height: 48px;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid #eee;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .table-placeholder-box {
        width: 100%;
        height: 100%;
        background: #f0f3f1;
        color: #0d4626;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.72rem;
        text-transform: uppercase;
      }
    }

    .table-info {
      h4 {
        margin: 0;
        font-size: 0.96rem;
        font-weight: 600;
        color: #111;
      }
      p {
        margin: 0.15rem 0 0.4rem;
        font-size: 0.82rem;
        color: #666;
        line-height: 1.35;
      }
      .links {
        display: flex;
        gap: 0.85rem;
        a {
          font-size: 0.78rem;
          font-weight: 600;
          color: #0d4626;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .category-tag {
      display: inline-block;
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;

      &.cat-business {
        background: #eaf6ee;
        color: #166534;
      }
      &.cat-personal {
        background: #eff6ff;
        color: #1e40af;
      }
      &.cat-education {
        background: #fdf2f8;
        color: #9d174d;
      }
      &.cat-utility {
        background: #fef3c7;
        color: #92400e;
      }
      &.cat-gift {
        background: #f5f3ff;
        color: #5b21b6;
      }
    }

    .tag-pill {
      display: inline-block;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      font-size: 0.74rem;
      background: #f3f4f6;
      color: #4b5563;
      border: 1px solid #e5e7eb;
      margin: 0.15rem;
    }

    .table-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;

      .action-btn {
        padding: 0.35rem 0.7rem;
        border-radius: 4px;
        font-size: 0.78rem;
        font-weight: 600;
        cursor: pointer;
      }

      .edit-action {
        background: transparent;
        border: 1px solid #ddd;
        color: #444;

        &:hover {
          background: #f9f9f9;
          border-color: #ccc;
        }
      }

      .delete-action {
        background: #fee2e2;
        border: 1px solid #fca5a5;
        color: #991b1b;

        &:hover {
          background: #fecaca;
        }
      }
    }
  }
`;

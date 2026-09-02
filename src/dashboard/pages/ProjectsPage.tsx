import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';

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

interface ProjectsPageProps {
  projects: Project[];
  onSaveProjects: (updatedProjects: Project[]) => void;
  searchQuery: string;
}

type FilterCategory = 'all' | 'business' | 'personal' | 'education' | 'utility' | 'gift';

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, onSaveProjects, searchQuery }) => {
  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');

  // Drag and drop state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

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

  // Filter projects by category and search query
  const displayedProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const categories: { key: FilterCategory; label: string }[] = [
    { key: 'all', label: 'All Projects' },
    { key: 'business', label: 'Business' },
    { key: 'personal', label: 'Personal' },
    { key: 'education', label: 'Education' },
    { key: 'utility', label: 'Utility' },
    { key: 'gift', label: 'Gift' },
  ];

  const getCategoryCount = (cat: FilterCategory) => {
    if (cat === 'all') return projects.length;
    return projects.filter((p) => p.category === cat).length;
  };

  // Reordering handlers
  const handleMove = (projectId: string, direction: 'up' | 'down') => {
    const viewIndex = displayedProjects.findIndex((p) => p.id === projectId);
    if (viewIndex === -1) return;

    const targetViewIndex = direction === 'up' ? viewIndex - 1 : viewIndex + 1;
    if (targetViewIndex < 0 || targetViewIndex >= displayedProjects.length) return;

    const targetProjectId = displayedProjects[targetViewIndex].id;

    const fullIndexA = projects.findIndex((p) => p.id === projectId);
    const fullIndexB = projects.findIndex((p) => p.id === targetProjectId);
    if (fullIndexA === -1 || fullIndexB === -1) return;

    const newProjects = [...projects];
    const itemA = newProjects[fullIndexA];
    const itemB = newProjects[fullIndexB];

    newProjects[fullIndexA] = itemB;
    newProjects[fullIndexB] = itemA;

    const updated = newProjects.map((p, i) => ({ ...p, order: i }));
    onSaveProjects(updated);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverId !== id) {
      setDragOverId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const fromIndex = projects.findIndex((p) => p.id === draggedId);
    const toIndex = projects.findIndex((p) => p.id === targetId);

    if (fromIndex === -1 || toIndex === -1) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const newProjects = [...projects];
    const [draggedItem] = newProjects.splice(fromIndex, 1);
    newProjects.splice(toIndex, 0, draggedItem);

    const updated = newProjects.map((p, i) => ({ ...p, order: i }));
    onSaveProjects(updated);
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

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
    document.querySelector('.main-content-area')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updated = projects.filter((p) => p.id !== id).map((p, i) => ({ ...p, order: i }));
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
    document.querySelector('.main-content-area')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

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

    const existingProject = editingId ? projects.find((p) => p.id === editingId) : undefined;

    const projectData: Project = {
      id: editingId || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: title.trim(),
      category,
      description: description.trim(),
      tags,
      liveDemoUrl: liveDemoUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      order: existingProject?.order ?? projects.length,
    };

    projectData.image = imageUrl.trim() || undefined;

    if (usePlaceholder) {
      projectData.placeholder = {
        badge: placeholderBadge.trim() || 'Project',
        title: placeholderTitle.trim() || title,
        copy: placeholderCopy.trim() || category,
        mediaClass: placeholderMediaClass,
      };
    }

    let updated: Project[];
    if (editingId) {
      updated = projects.map((p) => (p.id === editingId ? projectData : p));
    } else {
      if (projects.some((p) => p.id === projectData.id)) {
        projectData.id = `${projectData.id}-${Date.now().toString().slice(-4)}`;
      }
      updated = [...projects, projectData];
    }

    onSaveProjects(updated.map((p, i) => ({ ...p, order: i })));
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <StyledProjectsPage>
      <div className="section-header">
        <div className="header-titles">
          <h2>Portfolio Projects</h2>
          <p className="header-subtitle">
            Arrange the order of your projects below using the up/down arrows or drag-and-drop.
          </p>
        </div>
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
                  onChange={(e) => setCategory(e.target.value as 'personal' | 'business' | 'education' | 'utility' | 'gift')}
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
                    {uploading ? (
                      'Uploading...'
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Icon
                          icon="lucide:upload"
                          width={16}
                          height={16}
                          style={{ color: '#1A73E8' }}
                        />
                        Upload Local
                      </span>
                    )}
                  </button>
                </div>
                {imageUrl && (
                  <div className="image-preview">
                    <img src={imageUrl} alt="Uploaded preview" />
                  </div>
                )}
              </div>

              <div className="form-group checkbox-group full-width">
                <input
                  type="checkbox"
                  id="usePlaceholder"
                  checked={usePlaceholder}
                  onChange={(e) => setUsePlaceholder(e.target.checked)}
                />
                <label htmlFor="usePlaceholder">Use custom badge/text placeholder (Optional)</label>
              </div>

              {usePlaceholder && (
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
                      onChange={(e) => setPlaceholderMediaClass(e.target.value as 'media-five' | 'media-six')}
                    >
                      <option value="media-five">Diagonal Waves (Light)</option>
                      <option value="media-six">Sharp Peaks (Dark)</option>
                    </select>
                  </div>
                </>
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

      {/* Projects Category Filter & Reordering Controls */}
      <div className="category-filter-bar">
        {categories.map(({ key, label }) => {
          const count = getCategoryCount(key);
          const isActive = selectedCategory === key;
          return (
            <button
              key={key}
              className={`category-pill ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedCategory(key)}
            >
              <span>{label}</span>
              <span className="count-tag">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Projects List Panel */}
      <div className="projects-list-panel">
        <div className="panel-title-row">
          <div className="panel-title">
            <h3>Portfolio Items ({displayedProjects.length})</h3>
            <span className="reorder-tip">
              <Icon icon="lucide:arrow-up-down" width={14} height={14} />
              Use the arrows or drag rows to arrange how items appear on your live site
            </span>
          </div>
        </div>

        {displayedProjects.length === 0 ? (
          <div className="empty-state">No projects found matching the selected filter.</div>
        ) : (
          <div className="projects-table">
            <div className="table-header">
              <div style={{ textAlign: 'center' }}>Order</div>
              <div>Preview</div>
              <div>Title &amp; Description</div>
              <div>Category</div>
              <div>Languages</div>
              <div style={{ textAlign: 'right' }}>Actions</div>
            </div>

            {displayedProjects.map((project, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === displayedProjects.length - 1;
              const isDragging = draggedId === project.id;
              const isDragOver = dragOverId === project.id;

              return (
                <div
                  key={project.id}
                  className={`table-row ${isDragging ? 'is-dragging' : ''} ${isDragOver ? 'is-drag-over' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, project.id)}
                  onDragOver={(e) => handleDragOver(e, project.id)}
                  onDrop={(e) => handleDrop(e, project.id)}
                  onDragEnd={handleDragEnd}
                >
                  {/* Order & Reorder Controls */}
                  <div className="order-cell">
                    <div className="drag-handle" title="Drag to reorder">
                      <Icon icon="lucide:grip-vertical" width={16} height={16} />
                    </div>
                    <span className="order-number">#{idx + 1}</span>
                    <div className="reorder-arrows">
                      <button
                        type="button"
                        className="arrow-btn"
                        onClick={() => handleMove(project.id, 'up')}
                        disabled={isFirst}
                        title="Move Up"
                      >
                        <Icon icon="lucide:chevron-up" width={15} height={15} />
                      </button>
                      <button
                        type="button"
                        className="arrow-btn"
                        onClick={() => handleMove(project.id, 'down')}
                        disabled={isLast}
                        title="Move Down"
                      >
                        <Icon icon="lucide:chevron-down" width={15} height={15} />
                      </button>
                    </div>
                  </div>

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
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          Demo
                          <Icon icon="lucide:external-link" width={14} height={14} style={{ color: '#1A73E8' }} />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          GitHub
                          <Icon icon="lucide:github" width={14} height={14} style={{ color: '#1A73E8' }} />
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
                    <button
                      className="action-btn edit-action"
                      onClick={() => handleEdit(project)}
                      title="Edit Project"
                    >
                      <Icon
                        icon="lucide:pencil"
                        width={18}
                        height={18}
                        style={{ color: '#1A73E8' }}
                      />
                    </button>
                    <button
                      className="action-btn delete-action"
                      onClick={() => handleDelete(project.id)}
                      title="Delete Project"
                    >
                      <Icon
                        icon="lucide:trash-2"
                        width={18}
                        height={18}
                        style={{ color: '#b91c1c' }}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
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
    flex-wrap: wrap;
    gap: 1rem;

    .header-titles {
      h2 {
        font-size: 1.6rem;
        font-weight: 700;
        color: #0b1e30;
        margin: 0;
      }

      .header-subtitle {
        margin: 0.35rem 0 0;
        font-size: 0.9rem;
        color: #64748b;
      }
    }

    .add-btn {
      background: #1A73E8;
      color: #fff;
      border: 0;
      padding: 0.65rem 1.25rem;
      border-radius: 99px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(26, 115, 232, 0.25);
      transition: background 180ms ease, transform 180ms ease;

      &:hover {
        background: #1557B0;
        transform: translateY(-1px);
      }
    }
  }

  .category-filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    padding-bottom: 0.25rem;

    .category-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.55rem 1rem;
      border-radius: 99px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #475569;
      font-size: 0.86rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 180ms ease;

      &:hover {
        border-color: #cbd5e1;
        background: #f8fafc;
        color: #0f172a;
      }

      &.active {
        background: #1A73E8;
        border-color: #1A73E8;
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(26, 115, 232, 0.25);

        .count-tag {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }
      }

      .count-tag {
        display: inline-grid;
        place-items: center;
        min-width: 1.35rem;
        height: 1.35rem;
        padding: 0 0.35rem;
        border-radius: 999px;
        background: #f1f5f9;
        color: #64748b;
        font-size: 0.75rem;
        font-weight: 700;
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
      color: #0b1e30;
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
        width: 100%;
        box-sizing: border-box;
        padding: 0.75rem 1rem;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        font-size: 0.92rem;
        background: #fafafa;
        color: #111;

        &:focus {
          border-color: #1A73E8;
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
        align-items: stretch;

        @media (max-width: 480px) {
          flex-direction: column;
          gap: 0.5rem;
        }

        input {
          flex: 1;
          min-width: 0;
        }
      }

      .upload-btn {
        background: #f0f3f1;
        color: #1A73E8;
        border: 1px solid #bfdbfe;
        padding: 0 1.2rem;
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 0.88rem;
        cursor: pointer;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;

        @media (max-width: 480px) {
          padding: 0.65rem 1rem;
          width: 100%;
          height: auto;
        }

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
        background: #1A73E8;
        color: #fff;
        border: 0;

        &:hover {
          background: #1557B0;
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

    .panel-title-row {
      margin-bottom: 1.2rem;
    }

    .panel-title {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      h3 {
        margin: 0;
        font-size: 1.15rem;
        font-weight: 700;
        color: #0f172a;
      }

      .reorder-tip {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.8rem;
        color: #64748b;
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
      gap: 0.35rem;
    }

    .table-header,
    .table-row {
      display: grid;
      grid-template-columns: 110px 80px 2.2fr 1fr 1.5fr 110px;
      gap: 1.15rem;
      align-items: center;
      padding: 0.75rem 0.65rem;
      font-size: 0.88rem;

      @media (max-width: 1024px) {
        grid-template-columns: 100px 70px 1.8fr 1fr 90px;
        .table-tags {
          display: none;
        }
      }
      @media (max-width: 640px) {
        grid-template-columns: 85px 1fr auto;
        .table-preview,
        .table-category {
          display: none;
        }
      }
    }

    .table-header {
      border-bottom: 2px solid #f0f0f0;
      font-weight: 700;
      color: #64748b;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .table-row {
      border-radius: 0.75rem;
      border: 1px solid #f1f5f9;
      background: #ffffff;
      transition: all 180ms ease;

      &:hover {
        background: #f8fafc;
        border-color: #cbd5e1;
      }

      &.is-dragging {
        opacity: 0.45;
        border-style: dashed;
        border-color: #1A73E8;
      }

      &.is-drag-over {
        border-color: #1A73E8;
        background: #eff6ff;
        box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
      }
    }

    .order-cell {
      display: flex;
      align-items: center;
      gap: 0.4rem;

      .drag-handle {
        color: #94a3b8;
        cursor: grab;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.2rem;
        border-radius: 4px;

        &:hover {
          color: #475569;
          background: #f1f5f9;
        }

        &:active {
          cursor: grabbing;
        }
      }

      .order-number {
        font-weight: 700;
        font-size: 0.82rem;
        color: #1A73E8;
        background: #eff6ff;
        padding: 0.15rem 0.45rem;
        border-radius: 6px;
        border: 1px solid #dbeafe;
      }

      .reorder-arrows {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;

        .arrow-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.25rem;
          height: 1.1rem;
          padding: 0;
          border: 1px solid #e2e8f0;
          border-radius: 3px;
          background: #f8fafc;
          color: #475569;
          cursor: pointer;
          transition: all 140ms ease;

          &:hover:not(:disabled) {
            background: #1A73E8;
            border-color: #1A73E8;
            color: #ffffff;
          }

          &:disabled {
            opacity: 0.35;
            cursor: not-allowed;
          }
        }
      }
    }

    .table-preview {
      width: 70px;
      height: 48px;
      border-radius: 6px;
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
        color: #1A73E8;
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
          color: #1A73E8;
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
        display: inline-grid;
        place-items: center;
        width: 2.2rem;
        height: 2.2rem;
        padding: 0;
        border-radius: 50%;
        cursor: pointer;
        transition: transform 180ms ease, background-color 180ms ease;

        svg {
          pointer-events: none;
        }

        &:hover {
          transform: scale(1.08);
        }
      }

      .edit-action {
        background: #f0f7ff;
        border: 1px solid #c2e0ff;

        &:hover {
          background: #e0edff;
          border-color: #99ccff;
        }
      }

      .delete-action {
        background: #fee2e2;
        border: 1px solid #fca5a5;

        &:hover {
          background: #fecaca;
        }
      }
    }
  }
`;

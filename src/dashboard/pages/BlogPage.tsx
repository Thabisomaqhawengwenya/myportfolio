import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import type { BlogPost } from '../../data/blog';

interface BlogPageProps {
  posts: BlogPost[];
  onSavePosts: (posts: BlogPost[]) => void;
  searchQuery?: string;
  sectionEnabled?: boolean;
  onToggleSectionEnabled?: (enabled: boolean) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  posts,
  onSavePosts,
  searchQuery = '',
  sectionEnabled = true,
  onToggleSectionEnabled,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'published' | 'drafts' | 'featured'>('all');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState<BlogPost['category']>('Engineering');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formReadTime, setFormReadTime] = useState(5);
  const [formPublished, setFormPublished] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formDate, setFormDate] = useState('');

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormTitle(val);
    if (modalMode === 'create') {
      setFormSlug(generateSlug(val));
    }
  };

  const handleOpenAddModal = () => {
    setEditingPost(null);
    setFormTitle('');
    setFormSlug('');
    setFormCategory('Engineering');
    setFormExcerpt('');
    setFormContent(`## Introduction\n\nWrite the introduction to your article or project case study here...\n\n### Technical Architecture\n\nExplain your decisions, performance optimizations, and code patterns.\n\n### Key Takeaways\n- Focus on modular design\n- Always optimize for 60 FPS`);
    setFormCoverImage('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80');
    setFormTags('React, TypeScript, Engineering');
    setFormReadTime(5);
    setFormPublished(true);
    setFormFeatured(false);
    setFormDate(new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    setModalMode('create');
  };

  const handleOpenEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormSlug(post.slug);
    setFormCategory(post.category);
    setFormExcerpt(post.excerpt);
    setFormContent(post.content);
    setFormCoverImage(post.coverImage || '');
    setFormTags(post.tags ? post.tags.join(', ') : '');
    setFormReadTime(post.readTimeMinutes || 5);
    setFormPublished(post.published !== false);
    setFormFeatured(Boolean(post.featured));
    setFormDate(post.publishedAt || '');
    setModalMode('edit');
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEditingPost(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const parsedTags = formTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (modalMode === 'create') {
      const newPost: BlogPost = {
        id: `blog-${Date.now()}`,
        slug: formSlug.trim() || generateSlug(formTitle),
        title: formTitle.trim(),
        excerpt: formExcerpt.trim(),
        content: formContent.trim(),
        category: formCategory,
        coverImage: formCoverImage.trim() || undefined,
        tags: parsedTags,
        readTimeMinutes: Number(formReadTime) || 5,
        publishedAt: formDate.trim() || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        published: formPublished,
        featured: formFeatured,
        author: {
          name: 'Maqhawe T Ngwenya',
          role: 'Full Stack & 3D Web Engineer',
        },
        order: posts.length,
      };
      onSavePosts([...posts, newPost]);
    } else if (modalMode === 'edit' && editingPost) {
      const updated = posts.map((p) =>
        p.id === editingPost.id
          ? {
              ...p,
              slug: formSlug.trim() || generateSlug(formTitle),
              title: formTitle.trim(),
              excerpt: formExcerpt.trim(),
              content: formContent.trim(),
              category: formCategory,
              coverImage: formCoverImage.trim() || undefined,
              tags: parsedTags,
              readTimeMinutes: Number(formReadTime) || 5,
              publishedAt: formDate.trim() || p.publishedAt,
              published: formPublished,
              featured: formFeatured,
            }
          : p
      );
      onSavePosts(updated);
    }
    handleCloseModal();
  };

  const handleTogglePublished = (id: string, currentPublished?: boolean) => {
    const updated = posts.map((p) =>
      p.id === id ? { ...p, published: currentPublished === false ? true : false } : p
    );
    onSavePosts(updated);
  };

  const handleToggleFeatured = (id: string, currentFeatured?: boolean) => {
    const updated = posts.map((p) =>
      p.id === id ? { ...p, featured: !currentFeatured } : p
    );
    onSavePosts(updated);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this article?')) {
      const remaining = posts.filter((p) => p.id !== id);
      onSavePosts(remaining);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= posts.length) return;

    const list = [...posts];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const updated = list.map((item, idx) => ({ ...item, order: idx }));
    onSavePosts(updated);
  };

  const filteredPosts = posts.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    if (activeFilter === 'published') return matchesSearch && item.published !== false;
    if (activeFilter === 'drafts') return matchesSearch && item.published === false;
    if (activeFilter === 'featured') return matchesSearch && item.featured === true;
    return matchesSearch;
  });

  const publishedCount = posts.filter((p) => p.published !== false).length;
  const draftsCount = posts.filter((p) => p.published === false).length;
  const featuredCount = posts.filter((p) => p.featured).length;

  return (
    <StyledBlogPage>
      {/* Header Row */}
      <div className="page-header-row">
        <div>
          <h2>Developer Blog & Case Studies</h2>
          <p className="page-subtitle">
            Publish technical breakdowns, architectural case studies, and engineering tutorials.
          </p>
        </div>
        <button className="add-btn" onClick={handleOpenAddModal}>
          <Icon icon="lucide:pen-tool" width={18} height={18} />
          Write Article
        </button>
      </div>

      {/* Global Section Visibility Switch Banner */}
      <div className={`section-toggle-banner ${sectionEnabled ? 'is-enabled' : 'is-disabled'}`}>
        <div className="banner-left">
          <div className="toggle-icon-wrap">
            <Icon icon={sectionEnabled ? 'lucide:book-open' : 'lucide:book-x'} width={22} height={22} />
          </div>
          <div>
            <div className="banner-title-row">
              <h4>Public Portfolio Articles & Case Studies Section</h4>
              <span className={`status-pill ${sectionEnabled ? 'status-active' : 'status-paused'}`}>
                {sectionEnabled ? '● Live on Portfolio' : '○ Section Hidden / Disabled'}
              </span>
            </div>
            <p className="banner-desc">
              {sectionEnabled
                ? 'The Articles & Blog section is currently live and readable on your public homepage.'
                : 'The Articles & Blog section is completely hidden from your public portfolio.'}
            </p>
          </div>
        </div>
        {onToggleSectionEnabled && (
          <button
            className={`toggle-switch-btn ${sectionEnabled ? 'btn-active' : 'btn-paused'}`}
            onClick={() => onToggleSectionEnabled(!sectionEnabled)}
          >
            <Icon icon={sectionEnabled ? 'lucide:eye' : 'lucide:eye-off'} width={16} height={16} />
            {sectionEnabled ? 'Hide Section on Portfolio' : 'Enable Section on Portfolio'}
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs-row">
        <button
          className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Articles <span className="count-badge">{posts.length}</span>
        </button>
        <button
          className={`filter-pill ${activeFilter === 'published' ? 'active' : ''}`}
          onClick={() => setActiveFilter('published')}
        >
          Published Live <span className="count-badge">{publishedCount}</span>
        </button>
        <button
          className={`filter-pill ${activeFilter === 'drafts' ? 'active' : ''}`}
          onClick={() => setActiveFilter('drafts')}
        >
          Drafts <span className="count-badge">{draftsCount}</span>
        </button>
        <button
          className={`filter-pill ${activeFilter === 'featured' ? 'active' : ''}`}
          onClick={() => setActiveFilter('featured')}
        >
          Featured Posts <span className="count-badge">{featuredCount}</span>
        </button>
      </div>

      {/* Articles Grid */}
      <div className="blog-posts-grid">
        {filteredPosts.length === 0 ? (
          <div className="empty-card">
            <Icon icon="lucide:book-open" width={44} height={44} style={{ color: '#888', opacity: 0.5 }} />
            <h3>No articles found</h3>
            <p>Write your first technical case study or adjust your filter selection.</p>
            <button className="add-btn" onClick={handleOpenAddModal} style={{ marginTop: '1rem' }}>
              Write Article
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const index = posts.findIndex((p) => p.id === post.id);

            return (
              <div
                key={post.id}
                className={`blog-admin-card ${post.published === false ? 'is-draft-card' : ''}`}
              >
                {post.coverImage && (
                  <div className="card-cover-preview">
                    <img src={post.coverImage} alt={post.title} />
                    <span className="category-tag">{post.category}</span>
                    {post.featured && <span className="featured-tag">Featured</span>}
                  </div>
                )}

                <div className="card-main-content">
                  <div className="top-meta-bar">
                    <span className="order-tag">#{index + 1}</span>
                    <span className="read-time-tag">
                      <Icon icon="lucide:clock" width={12} height={12} />
                      {post.readTimeMinutes}m read
                    </span>
                    <span className={`status-pill ${post.published !== false ? 'pill-live' : 'pill-draft'}`}>
                      {post.published !== false ? 'Live' : 'Draft'}
                    </span>
                  </div>

                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-excerpt">{post.excerpt}</p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="tags-row">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag-pill">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="card-footer-actions">
                    <div className="order-arrows">
                      <button
                        className="arrow-btn"
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        className="arrow-btn"
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === posts.length - 1}
                        title="Move Down"
                      >
                        ▼
                      </button>
                    </div>

                    <div className="action-buttons-group">
                      <button
                        className={`action-btn ${post.published !== false ? 'active-vis' : ''}`}
                        onClick={() => handleTogglePublished(post.id, post.published)}
                        title={post.published !== false ? 'Unpublish to Draft' : 'Publish Live'}
                      >
                        <Icon icon={post.published !== false ? 'lucide:eye' : 'lucide:eye-off'} width={16} height={16} />
                      </button>

                      <button
                        className={`action-btn ${post.featured ? 'active-star' : ''}`}
                        onClick={() => handleToggleFeatured(post.id, post.featured)}
                        title={post.featured ? 'Remove from Featured' : 'Mark as Featured'}
                      >
                        <Icon icon="lucide:star" width={16} height={16} />
                      </button>

                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleOpenEditModal(post)}
                        title="Edit Article"
                      >
                        <Icon icon="lucide:edit-3" width={16} height={16} />
                      </button>

                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(post.id)}
                        title="Delete Article"
                      >
                        <Icon icon="lucide:trash-2" width={16} height={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Article Modal */}
      {modalMode && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-dialog-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalMode === 'create' ? 'Write New Article / Case Study' : 'Edit Article'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>
                <Icon icon="lucide:x" width={20} height={20} />
              </button>
            </div>

            <form onSubmit={handleSaveForm}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Article Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Architecting a Real-Time UFO 3D Scene in Three.js"
                    value={formTitle}
                    onChange={handleTitleChange}
                  />
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as BlogPost['category'])}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Architecture">Architecture</option>
                      <option value="Case Study">Case Study</option>
                      <option value="Tutorial">Tutorial</option>
                      <option value="Career">Career</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Read Time (Minutes)</label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={formReadTime}
                      onChange={(e) => setFormReadTime(Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Published Date</label>
                    <input
                      type="text"
                      placeholder="e.g. February 2026"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Cover Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formCoverImage}
                    onChange={(e) => setFormCoverImage(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Article Excerpt / Summary (Appears on cards) *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Brief 1-2 sentence overview of the article..."
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Article Content (Markdown format supported) *</label>
                  <textarea
                    rows={8}
                    required
                    className="content-editor-area"
                    placeholder="Write article in markdown format (# Heading, ## Subheading, ```code blocks```)..."
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Tags (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Three.js, WebGL, React, Performance"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                  />
                </div>

                <div className="checkboxes-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formPublished}
                      onChange={(e) => setFormPublished(e.target.checked)}
                    />
                    <span>Publish live on public portfolio</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                    />
                    <span>Highlight as Featured Case Study</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {modalMode === 'create' ? 'Publish Article' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StyledBlogPage>
  );
};

const StyledBlogPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .page-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      margin: 0 0 0.25rem;
      font-size: 1.35rem;
      font-weight: 700;
      color: #0b1e30;
    }

    .page-subtitle {
      margin: 0;
      font-size: 0.84rem;
      color: #64748b;
    }

    .add-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      background: #1A73E8;
      color: #fff;
      border: 0;
      padding: 0.65rem 1.25rem;
      border-radius: 99px;
      font-size: 0.86rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;

      &:hover {
        background: #1557b0;
      }
    }
  }

  .section-toggle-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    border-radius: 12px;
    border: 1px solid;
    transition: all 0.2s ease;
    gap: 1rem;

    @media (max-width: 640px) {
      flex-direction: column;
      align-items: flex-start;
    }

    &.is-enabled {
      background: #f0fdf4;
      border-color: #bbf7d0;
      .toggle-icon-wrap {
        background: #dcfce7;
        color: #16a34a;
      }
    }

    &.is-disabled {
      background: #f8fafc;
      border-color: #e2e8f0;
      .toggle-icon-wrap {
        background: #e2e8f0;
        color: #64748b;
      }
    }

    .banner-left {
      display: flex;
      align-items: center;
      gap: 1rem;

      .toggle-icon-wrap {
        width: 2.75rem;
        height: 2.75rem;
        border-radius: 10px;
        display: grid;
        place-items: center;
        flex-shrink: 0;
      }

      .banner-title-row {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        margin-bottom: 0.2rem;

        h4 {
          margin: 0;
          font-size: 0.96rem;
          font-weight: 700;
          color: #0f172a;
        }

        .status-pill {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 99px;

          &.status-active {
            background: #dcfce7;
            color: #15803d;
          }

          &.status-paused {
            background: #f1f5f9;
            color: #64748b;
          }
        }
      }

      .banner-desc {
        margin: 0;
        font-size: 0.82rem;
        color: #64748b;
      }
    }

    .toggle-switch-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.55rem 1.1rem;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;

      &.btn-active {
        background: #fff;
        border: 1px solid #cbd5e1;
        color: #b91c1c;

        &:hover {
          background: #fee2e2;
          border-color: #fca5a5;
        }
      }

      &.btn-paused {
        background: #16a34a;
        border: 1px solid #16a34a;
        color: #fff;

        &:hover {
          background: #15803d;
        }
      }
    }
  }

  .filter-tabs-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;

    .filter-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      background: #fff;
      border: 1px solid #e2e8f0;
      padding: 0.45rem 0.9rem;
      border-radius: 99px;
      font-size: 0.82rem;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: #f8fafc;
        color: #0f172a;
      }

      &.active {
        background: #1A73E8;
        border-color: #1A73E8;
        color: #fff;

        .count-badge {
          background: rgba(255, 255, 255, 0.25);
          color: #fff;
        }
      }

      .count-badge {
        background: #f1f5f9;
        color: #64748b;
        font-size: 0.72rem;
        padding: 0.1rem 0.45rem;
        border-radius: 99px;
      }
    }
  }

  .blog-posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.5rem;
  }

  .empty-card {
    grid-column: 1 / -1;
    background: #fff;
    border: 1px dashed #cbd5e1;
    border-radius: 12px;
    padding: 3rem 1.5rem;
    text-align: center;
    color: #64748b;

    h3 {
      margin: 0.75rem 0 0.25rem;
      font-size: 1.1rem;
      color: #0f172a;
    }

    p {
      margin: 0;
      font-size: 0.85rem;
    }
  }

  .blog-admin-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.15s ease;

    &:hover {
      border-color: #cbd5e1;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
    }

    &.is-draft-card {
      opacity: 0.7;
      background: #f8fafc;
    }

    .card-cover-preview {
      position: relative;
      height: 150px;
      width: 100%;
      background: #0f172a;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .category-tag {
        position: absolute;
        top: 0.65rem;
        left: 0.65rem;
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(4px);
        color: #38bdf8;
        font-size: 0.7rem;
        font-weight: 700;
        padding: 0.15rem 0.5rem;
        border-radius: 99px;
      }

      .featured-tag {
        position: absolute;
        top: 0.65rem;
        right: 0.65rem;
        background: #f59e0b;
        color: #fff;
        font-size: 0.68rem;
        font-weight: 700;
        padding: 0.15rem 0.45rem;
        border-radius: 99px;
      }
    }

    .card-main-content {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      .top-meta-bar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.65rem;

        .order-tag {
          font-size: 0.7rem;
          font-weight: 700;
          color: #94a3b8;
          background: #f1f5f9;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }

        .read-time-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.72rem;
          color: #64748b;
        }

        .status-pill {
          margin-left: auto;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;

          &.pill-live {
            background: #dcfce7;
            color: #15803d;
          }

          &.pill-draft {
            background: #f1f5f9;
            color: #64748b;
          }
        }
      }

      .post-title {
        margin: 0 0 0.5rem;
        font-size: 1.02rem;
        font-weight: 700;
        color: #0f172a;
        line-height: 1.35;
      }

      .post-excerpt {
        margin: 0 0 1rem;
        font-size: 0.82rem;
        color: #64748b;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .tags-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        margin-bottom: 1rem;

        .tag-pill {
          font-size: 0.7rem;
          color: #64748b;
          background: #f1f5f9;
          padding: 0.1rem 0.45rem;
          border-radius: 99px;
        }
      }

      .card-footer-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 0.85rem;
        border-top: 1px solid #f1f5f9;
        margin-top: auto;

        .order-arrows {
          display: flex;
          gap: 2px;

          .arrow-btn {
            width: 1.3rem;
            height: 1.3rem;
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 3px;
            font-size: 0.55rem;
            color: #64748b;
            cursor: pointer;
            display: grid;
            place-items: center;

            &:hover:not(:disabled) {
              background: #1A73E8;
              color: #fff;
              border-color: #1A73E8;
            }

            &:disabled {
              opacity: 0.3;
              cursor: not-allowed;
            }
          }
        }

        .action-buttons-group {
          display: flex;
          align-items: center;
          gap: 0.3rem;

          .action-btn {
            width: 1.85rem;
            height: 1.85rem;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            background: #f8fafc;
            color: #64748b;
            cursor: pointer;
            display: grid;
            place-items: center;
            transition: all 0.15s ease;

            &:hover {
              background: #f1f5f9;
              color: #0f172a;
            }

            &.active-vis {
              color: #1A73E8;
              background: #eff6ff;
              border-color: #bfdbfe;
            }

            &.active-star {
              color: #f59e0b;
              background: #fef3c7;
              border-color: #fde68a;
            }

            &.delete-btn:hover {
              background: #fee2e2;
              border-color: #fecaca;
              color: #ef4444;
            }
          }
        }
      }
    }
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(4px);
    display: grid;
    place-items: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal-dialog-large {
    background: #fff;
    border-radius: 16px;
    width: 100%;
    max-width: 720px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;

    h3 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
    }

    .close-btn {
      background: transparent;
      border: 0;
      color: #64748b;
      cursor: pointer;
      &:hover {
        color: #0f172a;
      }
    }
  }

  .modal-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
  }

  .form-row-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #475569;
    }

    input, textarea, select {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 0.55rem 0.75rem;
      font-size: 0.86rem;
      outline: none;
      font-family: inherit;
      background: #fff;

      &:focus {
        border-color: #1A73E8;
      }
    }

    .content-editor-area {
      font-family: 'Fira Code', monospace;
      font-size: 0.84rem;
      line-height: 1.5;
    }
  }

  .checkboxes-row {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-top: 0.25rem;

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.84rem;
      color: #334155;
      font-weight: 500;
      cursor: pointer;

      input {
        width: 1rem;
        height: 1rem;
        cursor: pointer;
      }
    }
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;

    .btn-cancel {
      background: #fff;
      border: 1px solid #cbd5e1;
      padding: 0.55rem 1.1rem;
      border-radius: 8px;
      font-size: 0.84rem;
      font-weight: 600;
      color: #475569;
      cursor: pointer;

      &:hover {
        background: #f1f5f9;
      }
    }

    .btn-save {
      background: #1A73E8;
      border: 0;
      padding: 0.55rem 1.25rem;
      border-radius: 8px;
      font-size: 0.84rem;
      font-weight: 600;
      color: #fff;
      cursor: pointer;

      &:hover {
        background: #1557b0;
      }
    }
  }
`;

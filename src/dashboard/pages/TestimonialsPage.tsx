import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import type { Testimonial } from '../../data/testimonials';

interface TestimonialsPageProps {
  testimonials: Testimonial[];
  onSaveTestimonials: (testimonials: Testimonial[]) => void;
  searchQuery?: string;
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({
  testimonials,
  onSaveTestimonials,
  searchQuery = '',
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'visible' | 'featured' | 'hidden'>('all');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formVisible, setFormVisible] = useState(true);
  const [formDate, setFormDate] = useState('');

  const filteredTestimonials = testimonials.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.company && item.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'visible') return matchesSearch && item.visible !== false;
    if (activeFilter === 'featured') return matchesSearch && item.featured === true;
    if (activeFilter === 'hidden') return matchesSearch && item.visible === false;
    return matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingTestimonial(null);
    setFormName('');
    setFormRole('');
    setFormCompany('');
    setFormAvatar('');
    setFormContent('');
    setFormRating(5);
    setFormFeatured(false);
    setFormVisible(true);
    setFormDate(
      new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    );
    setModalMode('create');
  };

  const handleOpenEditModal = (item: Testimonial) => {
    setEditingTestimonial(item);
    setFormName(item.name);
    setFormRole(item.role);
    setFormCompany(item.company || '');
    setFormAvatar(item.avatar || '');
    setFormContent(item.content);
    setFormRating(item.rating || 5);
    setFormFeatured(Boolean(item.featured));
    setFormVisible(item.visible !== false);
    setFormDate(item.date || '');
    setModalMode('edit');
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEditingTestimonial(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formContent.trim()) return;

    if (modalMode === 'create') {
      const newItem: Testimonial = {
        id: `test-${Date.now()}`,
        name: formName.trim(),
        role: formRole.trim(),
        company: formCompany.trim() || undefined,
        avatar: formAvatar.trim() || undefined,
        content: formContent.trim(),
        rating: formRating,
        featured: formFeatured,
        visible: formVisible,
        date: formDate.trim() || undefined,
        order: testimonials.length,
      };
      onSaveTestimonials([...testimonials, newItem]);
    } else if (modalMode === 'edit' && editingTestimonial) {
      const updated = testimonials.map((t) =>
        t.id === editingTestimonial.id
          ? {
              ...t,
              name: formName.trim(),
              role: formRole.trim(),
              company: formCompany.trim() || undefined,
              avatar: formAvatar.trim() || undefined,
              content: formContent.trim(),
              rating: formRating,
              featured: formFeatured,
              visible: formVisible,
              date: formDate.trim() || undefined,
            }
          : t
      );
      onSaveTestimonials(updated);
    }
    handleCloseModal();
  };

  const handleToggleVisibility = (id: string, currentVisible?: boolean) => {
    const isNowVisible = currentVisible === false;
    const updated = testimonials.map((t) =>
      t.id === id ? { ...t, visible: isNowVisible } : t
    );
    onSaveTestimonials(updated);
  };

  const handleToggleFeatured = (id: string, currentFeatured?: boolean) => {
    const updated = testimonials.map((t) =>
      t.id === id ? { ...t, featured: !currentFeatured } : t
    );
    onSaveTestimonials(updated);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this recommendation?')) {
      const remaining = testimonials.filter((t) => t.id !== id);
      onSaveTestimonials(remaining);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;

    const list = [...testimonials];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    const updated = list.map((item, idx) => ({ ...item, order: idx }));
    onSaveTestimonials(updated);
  };

  const visibleCount = testimonials.filter((t) => t.visible !== false).length;
  const featuredCount = testimonials.filter((t) => t.featured).length;
  const hiddenCount = testimonials.filter((t) => t.visible === false).length;

  return (
    <StyledTestimonialsPage>
      {/* Header Row */}
      <div className="page-header-row">
        <div>
          <h2>Client Testimonials & Recommendations</h2>
          <p className="page-subtitle">
            Manage feedback from clients, mentors, and collaborators shown on your portfolio.
          </p>
        </div>
        <button className="add-btn" onClick={handleOpenAddModal}>
          <Icon icon="lucide:plus" width={18} height={18} />
          Add Testimonial
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs-row">
        <button
          className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Feedback <span className="count-badge">{testimonials.length}</span>
        </button>
        <button
          className={`filter-pill ${activeFilter === 'visible' ? 'active' : ''}`}
          onClick={() => setActiveFilter('visible')}
        >
          Published on Site <span className="count-badge">{visibleCount}</span>
        </button>
        <button
          className={`filter-pill ${activeFilter === 'featured' ? 'active' : ''}`}
          onClick={() => setActiveFilter('featured')}
        >
          Featured Stars <span className="count-badge">{featuredCount}</span>
        </button>
        <button
          className={`filter-pill ${activeFilter === 'hidden' ? 'active' : ''}`}
          onClick={() => setActiveFilter('hidden')}
        >
          Hidden / Drafts <span className="count-badge">{hiddenCount}</span>
        </button>
      </div>

      {/* Testimonials List */}
      <div className="testimonials-grid">
        {filteredTestimonials.length === 0 ? (
          <div className="empty-card">
            <Icon icon="lucide:message-square-quote" width={44} height={44} style={{ color: '#888', opacity: 0.5 }} />
            <h3>No testimonials found</h3>
            <p>Try switching filter tabs or add a new testimonial.</p>
            <button className="add-btn" onClick={handleOpenAddModal} style={{ marginTop: '1rem' }}>
              Add Testimonial
            </button>
          </div>
        ) : (
          filteredTestimonials.map((item) => {
            const index = testimonials.findIndex((t) => t.id === item.id);
            const initials = item.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={item.id}
                className={`testimonial-admin-card ${item.visible === false ? 'is-hidden-card' : ''}`}
              >
                <div className="card-top-bar">
                  <div className="order-badge">#{index + 1}</div>
                  <div className="stars-display">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon
                        key={i}
                        icon="lucide:star"
                        width={15}
                        height={15}
                        style={{
                          color: i < item.rating ? '#f59e0b' : '#cbd5e1',
                          fill: i < item.rating ? '#f59e0b' : 'transparent',
                        }}
                      />
                    ))}
                  </div>

                  <div className="card-status-badges">
                    {item.featured && <span className="badge-featured">Featured</span>}
                    {item.visible === false ? (
                      <span className="badge-hidden">Hidden</span>
                    ) : (
                      <span className="badge-live">Live</span>
                    )}
                  </div>
                </div>

                <p className="card-quote">"{item.content}"</p>

                <div className="client-footer">
                  <div className="client-left">
                    {item.avatar ? (
                      <img src={item.avatar} alt={item.name} className="client-avatar" />
                    ) : (
                      <div className="client-avatar-fallback">{initials}</div>
                    )}
                    <div className="client-meta">
                      <h4>{item.name}</h4>
                      <p>
                        {item.role}
                        {item.company ? ` • ${item.company}` : ''}
                      </p>
                      {item.date && <span className="client-date">{item.date}</span>}
                    </div>
                  </div>

                  <div className="card-actions">
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
                        disabled={index === testimonials.length - 1}
                        title="Move Down"
                      >
                        ▼
                      </button>
                    </div>

                    <button
                      className={`action-btn ${item.visible !== false ? 'active-vis' : ''}`}
                      onClick={() => handleToggleVisibility(item.id, item.visible)}
                      title={item.visible !== false ? 'Hide from portfolio' : 'Publish to portfolio'}
                    >
                      <Icon icon={item.visible !== false ? 'lucide:eye' : 'lucide:eye-off'} width={16} height={16} />
                    </button>

                    <button
                      className={`action-btn ${item.featured ? 'active-star' : ''}`}
                      onClick={() => handleToggleFeatured(item.id, item.featured)}
                      title={item.featured ? 'Unfeature' : 'Mark as featured'}
                    >
                      <Icon icon="lucide:star" width={16} height={16} />
                    </button>

                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleOpenEditModal(item)}
                      title="Edit review"
                    >
                      <Icon icon="lucide:edit-3" width={16} height={16} />
                    </button>

                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(item.id)}
                      title="Delete review"
                    >
                      <Icon icon="lucide:trash-2" width={16} height={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Testimonial Modal */}
      {modalMode && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalMode === 'create' ? 'Add Testimonial' : 'Edit Testimonial'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>
                <Icon icon="lucide:x" width={20} height={20} />
              </button>
            </div>

            <form onSubmit={handleSaveForm}>
              <div className="modal-body">
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Client / Author Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sipho Ndlovu"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Job Title / Role *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Creative Director"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Company / Project Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Island Child Apparel"
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Date / Period</label>
                    <input
                      type="text"
                      placeholder="e.g. February 2026"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Star Rating</label>
                  <div className="stars-input-row">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        className="star-pick-btn"
                        onClick={() => setFormRating(star)}
                      >
                        <Icon
                          icon="lucide:star"
                          width={22}
                          height={22}
                          style={{
                            color: star <= formRating ? '#f59e0b' : '#cbd5e1',
                            fill: star <= formRating ? '#f59e0b' : 'transparent',
                          }}
                        />
                      </button>
                    ))}
                    <span className="rating-num-label">{formRating} of 5 Stars</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Testimonial / Review Text *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter what the client or mentor said about your work..."
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Avatar Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={formAvatar}
                    onChange={(e) => setFormAvatar(e.target.value)}
                  />
                </div>

                <div className="checkboxes-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formVisible}
                      onChange={(e) => setFormVisible(e.target.checked)}
                    />
                    <span>Publish live on public portfolio</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                    />
                    <span>Highlight as Featured Review</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {modalMode === 'create' ? 'Add Testimonial' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StyledTestimonialsPage>
  );
};

const StyledTestimonialsPage = styled.div`
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

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.25rem;
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

  .testimonial-admin-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.15s ease;

    &:hover {
      border-color: #cbd5e1;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
    }

    &.is-hidden-card {
      opacity: 0.65;
      background: #f8fafc;
    }

    .card-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.85rem;

      .order-badge {
        font-size: 0.72rem;
        font-weight: 700;
        color: #94a3b8;
        background: #f1f5f9;
        padding: 0.15rem 0.45rem;
        border-radius: 4px;
      }

      .stars-display {
        display: flex;
        gap: 0.2rem;
      }

      .card-status-badges {
        display: flex;
        gap: 0.35rem;

        .badge-featured {
          background: #fef3c7;
          color: #d97706;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }

        .badge-live {
          background: #dcfce7;
          color: #15803d;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }

        .badge-hidden {
          background: #f1f5f9;
          color: #64748b;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }
      }
    }

    .card-quote {
      font-size: 0.88rem;
      color: #334155;
      line-height: 1.55;
      margin: 0 0 1.25rem;
      font-style: italic;
    }

    .client-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.85rem;
      border-top: 1px solid #f1f5f9;
      gap: 0.5rem;

      .client-left {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        min-width: 0;

        .client-avatar {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          object-fit: cover;
        }

        .client-avatar-fallback {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          background: #eff6ff;
          color: #1A73E8;
          font-weight: 700;
          font-size: 0.82rem;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .client-meta {
          min-width: 0;

          h4 {
            margin: 0;
            font-size: 0.88rem;
            font-weight: 600;
            color: #0f172a;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          p {
            margin: 0.1rem 0 0;
            font-size: 0.74rem;
            color: #64748b;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .client-date {
            font-size: 0.68rem;
            color: #94a3b8;
          }
        }
      }

      .card-actions {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        flex-shrink: 0;

        .order-arrows {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-right: 0.15rem;

          .arrow-btn {
            width: 1.3rem;
            height: 1rem;
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

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: grid;
    place-items: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal-dialog {
    background: #fff;
    border-radius: 16px;
    width: 100%;
    max-width: 520px;
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
  }

  .form-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
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

    input, textarea {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 0.55rem 0.75rem;
      font-size: 0.86rem;
      outline: none;
      font-family: inherit;

      &:focus {
        border-color: #1A73E8;
      }
    }
  }

  .stars-input-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;

    .star-pick-btn {
      background: transparent;
      border: 0;
      cursor: pointer;
      padding: 0.1rem;
      display: grid;
      place-items: center;
      transition: transform 0.1s ease;

      &:hover {
        transform: scale(1.15);
      }
    }

    .rating-num-label {
      font-size: 0.82rem;
      font-weight: 600;
      color: #64748b;
      margin-left: 0.5rem;
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

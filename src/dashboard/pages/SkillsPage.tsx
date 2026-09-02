import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { type TechItem, popularPresets } from '../../data/skills';

interface SkillsPageProps {
  skills: TechItem[];
  onSaveSkills: (skills: TechItem[]) => void;
  searchQuery?: string;
}

export const SkillsPage: React.FC<SkillsPageProps> = ({
  skills,
  onSaveSkills,
  searchQuery = '',
}) => {
  const [activeRowFilter, setActiveRowFilter] = useState<'all' | 1 | 2 | 3>('all');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingSkill, setEditingSkill] = useState<TechItem | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formIcon, setFormIcon] = useState('vscode-icons:file-type-reactjs');
  const [formColor, setFormColor] = useState('#61DAFB');
  const [formRow, setFormRow] = useState<1 | 2 | 3>(1);
  const [formCategory, setFormCategory] = useState<TechItem['category']>('frontend');

  const filteredSkills = skills.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.icon.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRow = activeRowFilter === 'all' || item.row === activeRowFilter;
    return matchesSearch && matchesRow;
  });

  const handleOpenAddModal = () => {
    setEditingSkill(null);
    setFormName('');
    setFormIcon('vscode-icons:file-type-reactjs');
    setFormColor('#61DAFB');
    setFormRow(1);
    setFormCategory('frontend');
    setModalMode('create');
  };

  const handleOpenEditModal = (skill: TechItem) => {
    setEditingSkill(skill);
    setFormName(skill.name);
    setFormIcon(skill.icon);
    setFormColor(skill.color);
    setFormRow(skill.row || 1);
    setFormCategory(skill.category || 'frontend');
    setModalMode('edit');
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEditingSkill(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (modalMode === 'create') {
      const newSkill: TechItem = {
        id: `tech-${Date.now()}`,
        name: formName.trim(),
        icon: formIcon.trim() || 'carbon:code',
        color: formColor,
        row: formRow,
        category: formCategory,
        order: skills.length,
      };
      onSaveSkills([...skills, newSkill]);
    } else if (modalMode === 'edit' && editingSkill) {
      const updated = skills.map((item) =>
        item.id === editingSkill.id
          ? {
              ...item,
              name: formName.trim(),
              icon: formIcon.trim() || 'carbon:code',
              color: formColor,
              row: formRow,
              category: formCategory,
            }
          : item
      );
      onSaveSkills(updated);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this skill from your tech stack?')) {
      const remaining = skills.filter((item) => item.id !== id);
      onSaveSkills(remaining);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= skills.length) return;

    const newSkills = [...skills];
    const temp = newSkills[index];
    newSkills[index] = newSkills[targetIndex];
    newSkills[targetIndex] = temp;

    const updated = newSkills.map((item, idx) => ({
      ...item,
      order: idx,
    }));
    onSaveSkills(updated);
  };

  const handleAddPreset = (preset: (typeof popularPresets)[0]) => {
    const existing = skills.find(
      (s) => s.name.toLowerCase() === preset.name.toLowerCase()
    );
    if (existing) {
      alert(`${preset.name} is already in your tech stack!`);
      return;
    }

    const newSkill: TechItem = {
      // eslint-disable-next-line react-hooks/purity
      id: `tech-${Date.now()}`,
      ...preset,
      order: skills.length,
    };
    onSaveSkills([...skills, newSkill]);
  };

  const row1Count = skills.filter((s) => s.row === 1).length;
  const row2Count = skills.filter((s) => s.row === 2).length;
  const row3Count = skills.filter((s) => s.row === 3).length;

  const colorPresets = [
    '#61DAFB', // React Blue
    '#3178C6', // TypeScript Blue
    '#F7DF1E', // JS Yellow
    '#E34F26', // HTML Orange
    '#1572B6', // CSS Blue
    '#38BDF8', // Tailwind Sky
    '#3ECF8E', // Supabase Green
    '#339933', // Node Green
    '#FFCA28', // Firebase Amber
    '#F24E1E', // Figma Red
    '#ffffff', // Clean White
    '#10B981', // Emerald
    '#8B5CF6', // Purple
    '#EC4899', // Pink
  ];

  return (
    <StyledSkillsPage>
      {/* Header & Controls Row */}
      <div className="skills-header-row">
        <div>
          <h2>Tech Stack & Skills Manager</h2>
          <p className="skills-subtitle">
            Configure the dynamic marquee rows and technologies showcased on your portfolio.
          </p>
        </div>
        <button className="add-skill-btn" onClick={handleOpenAddModal}>
          <Icon icon="lucide:plus" width={18} height={18} />
          Add New Skill
        </button>
      </div>

      {/* Popular Presets Shelf */}
      <div className="presets-section">
        <div className="presets-title">
          <Icon icon="lucide:sparkles" width={16} height={16} style={{ color: '#f59e0b' }} />
          <span>Quick Add Popular Tech:</span>
        </div>
        <div className="presets-pills-list">
          {popularPresets.map((preset) => {
            const isAlreadyAdded = skills.some(
              (s) => s.name.toLowerCase() === preset.name.toLowerCase()
            );

            return (
              <button
                key={preset.name}
                className={`preset-pill ${isAlreadyAdded ? 'is-added' : ''}`}
                onClick={() => !isAlreadyAdded && handleAddPreset(preset)}
                disabled={isAlreadyAdded}
                title={isAlreadyAdded ? 'Already added' : `Click to add ${preset.name}`}
              >
                <Icon icon={preset.icon} width={16} height={16} style={{ color: preset.color }} />
                <span>{preset.name}</span>
                {isAlreadyAdded ? (
                  <Icon icon="lucide:check" width={12} height={12} style={{ color: '#10b981' }} />
                ) : (
                  <Icon icon="lucide:plus" width={12} height={12} style={{ opacity: 0.6 }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs-row">
        <div className="row-pills">
          <button
            className={`filter-pill ${activeRowFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveRowFilter('all')}
          >
            All Skills <span className="count-badge">{skills.length}</span>
          </button>
          <button
            className={`filter-pill ${activeRowFilter === 1 ? 'active' : ''}`}
            onClick={() => setActiveRowFilter(1)}
          >
            Row 1 (Frontend & Core) <span className="count-badge">{row1Count}</span>
          </button>
          <button
            className={`filter-pill ${activeRowFilter === 2 ? 'active' : ''}`}
            onClick={() => setActiveRowFilter(2)}
          >
            Row 2 (Tools & Backend) <span className="count-badge">{row2Count}</span>
          </button>
          <button
            className={`filter-pill ${activeRowFilter === 3 ? 'active' : ''}`}
            onClick={() => setActiveRowFilter(3)}
          >
            Row 3 (APIs & Learning) <span className="count-badge">{row3Count}</span>
          </button>
        </div>
      </div>

      {/* Skills Grid/List */}
      <div className="skills-grid">
        {filteredSkills.length === 0 ? (
          <div className="empty-skills-card">
            <Icon icon="lucide:cpu" width={44} height={44} style={{ color: '#888', opacity: 0.5 }} />
            <h3>No skills found</h3>
            <p>Try clearing your search or add a new skill to this row.</p>
            <button className="add-skill-btn" onClick={handleOpenAddModal} style={{ marginTop: '1rem' }}>
              Add Skill
            </button>
          </div>
        ) : (
          filteredSkills.map((item) => {
            const index = skills.findIndex((s) => s.id === item.id);

            return (
              <div key={item.id} className="skill-card">
                <div className="skill-card-left">
                  <div className="order-tag">#{index + 1}</div>
                  <div className="icon-preview-box" style={{ borderColor: item.color }}>
                    <Icon icon={item.icon} width={28} height={28} style={{ color: item.color }} />
                  </div>
                  <div className="skill-info">
                    <div className="skill-name-row">
                      <h4>{item.name}</h4>
                      <span className="row-badge">Row {item.row || 1}</span>
                    </div>
                    <div className="skill-meta-row">
                      <span className="category-tag">{item.category || 'general'}</span>
                      <span className="icon-code">{item.icon}</span>
                    </div>
                  </div>
                </div>

                <div className="skill-card-right">
                  <div className="arrow-controls">
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
                      disabled={index === skills.length - 1}
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>

                  <button
                    className="action-icon-btn edit-btn"
                    onClick={() => handleOpenEditModal(item)}
                    title="Edit Skill"
                  >
                    <Icon icon="lucide:edit-3" width={16} height={16} />
                  </button>
                  <button
                    className="action-icon-btn delete-btn"
                    onClick={() => handleDelete(item.id)}
                    title="Delete Skill"
                  >
                    <Icon icon="lucide:trash-2" width={16} height={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Skill Modal */}
      {modalMode && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalMode === 'create' ? 'Add New Skill' : 'Edit Skill'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>
                <Icon icon="lucide:x" width={20} height={20} />
              </button>
            </div>

            <form onSubmit={handleSaveForm}>
              <div className="modal-body">
                {/* Live Pill Preview */}
                <div className="live-preview-box">
                  <span className="preview-label">Live Preview on Marquee:</span>
                  <div
                    className="preview-pill"
                    style={{
                      border: `1px solid ${formColor}44`,
                      background: 'rgba(255,255,255,0.05)',
                    }}
                  >
                    <Icon icon={formIcon || 'carbon:code'} width={22} height={22} style={{ color: formColor }} />
                    <span style={{ color: formColor, fontWeight: 600, fontSize: '0.85rem' }}>
                      {formName || 'Skill Name'}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Skill / Technology Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js, Tailwind CSS, Python"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Iconify Icon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. vscode-icons:file-type-reactjs, skill-icons:nextjs-dark"
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                  />
                  <small className="field-hint">
                    Supports any icon from <a href="https://icon-sets.iconify.design" target="_blank" rel="noopener noreferrer">Iconify Icon Sets</a>
                  </small>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Marquee Row</label>
                    <select
                      value={formRow}
                      onChange={(e) => setFormRow(Number(e.target.value) as 1 | 2 | 3)}
                    >
                      <option value={1}>Row 1 — Frontend & Core</option>
                      <option value={2}>Row 2 — Tools & Backend</option>
                      <option value={3}>Row 3 — APIs & Emerging</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as TechItem['category'])}
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="tools">Tools & DevOps</option>
                      <option value="design">Design / UI/UX</option>
                      <option value="learning">Learning</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Accent Color</label>
                  <div className="color-picker-row">
                    <input
                      type="color"
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                      className="color-input"
                    />
                    <input
                      type="text"
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                      className="color-text-input"
                    />
                  </div>
                  <div className="color-swatches">
                    {colorPresets.map((c) => (
                      <button
                        type="button"
                        key={c}
                        className="color-swatch"
                        style={{ background: c }}
                        onClick={() => setFormColor(c)}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {modalMode === 'create' ? 'Add Skill' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StyledSkillsPage>
  );
};

const StyledSkillsPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .skills-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      margin: 0 0 0.25rem;
      font-size: 1.35rem;
      font-weight: 700;
      color: #0b1e30;
    }

    .skills-subtitle {
      margin: 0;
      font-size: 0.84rem;
      color: #64748b;
    }

    .add-skill-btn {
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

  /* Popular Presets Shelf */
  .presets-section {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;

    .presets-title {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8rem;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .presets-pills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .preset-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 0.35rem 0.75rem;
      border-radius: 99px;
      font-size: 0.78rem;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover:not(:disabled) {
        background: #eff6ff;
        border-color: #bfdbfe;
        color: #1d4ed8;
      }

      &.is-added {
        opacity: 0.6;
        cursor: not-allowed;
        background: #f1f5f9;
      }
    }
  }

  /* Filter Tabs */
  .filter-tabs-row {
    .row-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

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

  /* Skills Grid */
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1rem;
  }

  .empty-skills-card {
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

  .skill-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.15s ease;

    &:hover {
      border-color: #cbd5e1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    }

    .skill-card-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 0;
    }

    .order-tag {
      font-size: 0.72rem;
      font-weight: 700;
      color: #94a3b8;
      background: #f1f5f9;
      padding: 0.2rem 0.45rem;
      border-radius: 6px;
    }

    .icon-preview-box {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }

    .skill-info {
      min-width: 0;

      .skill-name-row {
        display: flex;
        align-items: center;
        gap: 0.45rem;

        h4 {
          margin: 0;
          font-size: 0.94rem;
          font-weight: 600;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .row-badge {
          font-size: 0.68rem;
          font-weight: 700;
          background: #eff6ff;
          color: #1d4ed8;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }
      }

      .skill-meta-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.2rem;

        .category-tag {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          font-weight: 600;
        }

        .icon-code {
          font-size: 0.68rem;
          font-family: monospace;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 140px;
        }
      }
    }

    .skill-card-right {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      flex-shrink: 0;
    }

    .arrow-controls {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-right: 0.2rem;
    }

    .arrow-btn {
      width: 1.4rem;
      height: 1.1rem;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      font-size: 0.6rem;
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

    .action-icon-btn {
      width: 2rem;
      height: 2rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      color: #64748b;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: all 0.15s ease;

      &.edit-btn:hover {
        background: #eff6ff;
        border-color: #bfdbfe;
        color: #1A73E8;
      }

      &.delete-btn:hover {
        background: #fee2e2;
        border-color: #fecaca;
        color: #ef4444;
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
    max-width: 480px;
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

  .live-preview-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    .preview-label {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      font-weight: 600;
    }

    .preview-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1.25rem;
      border-radius: 99px;
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

    input, select {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 0.55rem 0.75rem;
      font-size: 0.86rem;
      outline: none;

      &:focus {
        border-color: #1A73E8;
      }
    }

    .field-hint {
      font-size: 0.72rem;
      color: #64748b;

      a {
        color: #1A73E8;
        text-decoration: underline;
      }
    }
  }

  .form-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .color-picker-row {
    display: flex;
    gap: 0.5rem;

    .color-input {
      width: 2.75rem;
      height: 2.3rem;
      padding: 0.2rem;
      border-radius: 6px;
      cursor: pointer;
    }

    .color-text-input {
      flex: 1;
      font-family: monospace;
    }
  }

  .color-swatches {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.25rem;

    .color-swatch {
      width: 1.4rem;
      height: 1.4rem;
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.15);
      cursor: pointer;
      transition: transform 0.1s ease;

      &:hover {
        transform: scale(1.15);
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

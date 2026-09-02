import React from 'react';
import styled from 'styled-components';
import { Dialog } from '@mui/material';

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

interface ProjectModalProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, open, onClose }) => {
  if (!project) return null;

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      scroll="body"
    >
      <ModalPanel id={`modal-${project.id}`}>
        <button
          className="modal-close"
          type="button"
          aria-label="Close project details"
          onClick={onClose}
        >
          &times;
        </button>
        <p className="modal-kicker">Project Details</p>

        {project.image ? (
          <div
            className={`modal-project-image ${
              project.isEmganwiniImage ? 'modal-project-image-emganwini' : ''
            } ${project.id === 'car-website-modrino' || project.id === 'student-register' ? 'modal-project-image-contained' : ''}`}
          >
            <img
              src={project.image}
              alt={`Screenshot of ${project.title} project`}
              width="600"
              height="340"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : (
          project.placeholder && (
            <div className="modal-project-image modal-project-image-placeholder" aria-hidden="true">
              <span className="project-media-badge">{project.placeholder.badge}</span>
              <span className="project-media-title">{project.placeholder.title}</span>
              <span className="project-media-copy">{project.placeholder.copy}</span>
            </div>
          )
        )}

        <h3 id={`modal-${project.id}-title`}>{project.title}</h3>
        <p>{project.description}</p>

        <div className="modal-actions">
          {project.liveDemoUrl && (
            <a
              className="modal-action-btn"
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              className="modal-action-btn modal-action-btn-secondary"
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repo
            </a>
          )}
        </div>
      </ModalPanel>
    </StyledDialog>
  );
};

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background: var(--panel-strong);
    border: 1px solid rgba(0, 0, 244, 0.36);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow), 0 0 34px rgba(0, 0, 244, 0.16);
    color: var(--text);
  }
`;

const ModalPanel = styled.div`
  position: relative;
  padding: 1.5rem;

  .modal-close {
    position: absolute;
    top: 0.85rem;
    right: 0.85rem;
    width: 2.35rem;
    height: 2.35rem;
    border: 1px solid rgba(0, 0, 244, 0.45);
    border-radius: 50%;
    background: rgba(0, 0, 244, 0.12);
    color: #fff;
    font-size: 1.2rem;
    line-height: 1;
    cursor: pointer;
    transition:
      transform var(--transition),
      box-shadow var(--transition),
      background-color var(--transition);

    &:hover,
    &:focus-visible {
      transform: scale(1.04);
      background: rgba(0, 0, 244, 0.24);
      box-shadow: 0 0 18px rgba(0, 0, 244, 0.25);
    }
  }

  .modal-kicker {
    margin: 0 0 0.55rem;
    color: var(--modal-kicker);
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  h3 {
    margin: 0;
    font-size: 1.35rem;
    color: var(--heading);
  }

  p {
    margin: 0.75rem 0 0;
    color: var(--muted);
    font-size: 0.94rem;
  }

  .modal-project-image {
    margin: 0.9rem 0 1rem;
    border: 1px solid rgba(0, 0, 244, 0.28);
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--modal-media-bg);
    box-shadow: 0 0 22px rgba(0, 0, 244, 0.1);

    img {
      display: block;
      width: 100%;
      height: auto;
    }
  }

  .modal-project-image-contained {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.7rem;

    img {
      width: auto;
      max-width: 100%;
      max-height: 300px;
      border-radius: calc(var(--radius-md) - 6px);
    }
  }

  .modal-project-image-emganwini {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.85rem;
    background: #eee6d6;

    img {
      width: 100%;
      max-height: 180px;
      object-fit: contain;
    }
  }

  .modal-project-image-placeholder {
    position: relative;
    min-height: 220px;
    background: var(--project-media-bg);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    &::before,
    &::after {
      content: '';
      position: absolute;
    }

    &::before {
      inset: auto -10% -8% -10%;
      height: 65%;
      background: rgba(0, 0, 244, 0.9);
      clip-path: polygon(
        0 100%,
        0 77%,
        15% 63%,
        29% 78%,
        42% 56%,
        58% 72%,
        71% 48%,
        85% 70%,
        100% 62%,
        100% 100%
      );
    }

    &::after {
      top: 18px;
      right: 18px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba(214, 225, 239, 0.15);
      box-shadow:
        0 0 28px rgba(0, 0, 244, 0.6),
        0 0 56px rgba(0, 0, 244, 0.3);
    }

    .project-media-badge {
      position: absolute;
      top: 18px;
      left: 18px;
      z-index: 1;
      padding: 0.35rem 0.72rem;
      border: 1px solid rgba(214, 225, 239, 0.18);
      border-radius: 999px;
      background: rgba(4, 7, 18, 0.46);
      color: var(--text);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .project-media-title {
      position: relative;
      z-index: 1;
      margin: 0 18px 0.3rem;
      color: #f6f8fb;
      font-size: clamp(1.5rem, 2vw, 2rem);
      font-weight: 800;
      letter-spacing: 0.02em;
    }

    .project-media-copy {
      position: relative;
      z-index: 1;
      margin: 0 18px 18px;
      color: rgba(214, 225, 239, 0.84);
      font-size: 0.88rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
  }

  .modal-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
    margin-top: 1.15rem;
  }

  .modal-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 9.75rem;
    padding: 0.78rem 1.15rem;
    border: 1px solid rgba(0, 0, 244, 0.82);
    border-radius: 999px;
    background: rgba(0, 0, 244, 0.14);
    color: var(--modal-action-text);
    font-size: 0.9rem;
    font-weight: 600;
    transition:
      transform var(--transition),
      box-shadow var(--transition),
      background-color var(--transition),
      border-color var(--transition);

    &:hover,
    &:focus-visible {
      transform: translateY(-2px);
      background: rgba(0, 0, 244, 0.24);
      box-shadow: 0 0 22px rgba(0, 0, 244, 0.24);
    }
  }

  .modal-action-btn-secondary {
    background: transparent;
  }

  @media (max-width: 760px) {
    padding: 1.2rem;
  }
`;

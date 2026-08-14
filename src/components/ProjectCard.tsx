import React from 'react';
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

interface ProjectCardProps {
  project: Project;
  onOpenDetails: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenDetails }) => {
  return (
    <StyledCard className="project-card reveal is-visible">
      {project.image ? (
        <div
          className={`project-media ${project.isEmganwiniImage ? 'project-media-image-emganwini' : 'project-media-image'}`}
        >
          <img
            src={project.image}
            alt={`Preview of ${project.title} project`}
            width="600"
            height="340"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : (
        project.placeholder && (
          <div
            className={`project-media project-media-placeholder ${project.placeholder.mediaClass}`}
            aria-hidden="true"
          >
            <span className="project-media-badge">{project.placeholder.badge}</span>
            <span className="project-media-title">{project.placeholder.title}</span>
            <span className="project-media-copy">{project.placeholder.copy}</span>
          </div>
        )
      )}
      <div className="project-body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <ul className="project-tags">
          {project.tags.map((tag, idx) => (
            <li key={idx}>{tag}</li>
          ))}
        </ul>
        <button
          className="project-link"
          type="button"
          aria-haspopup="dialog"
          onClick={() => onOpenDetails(project)}
        >
          View Project
        </button>
      </div>
    </StyledCard>
  );
};

const StyledCard = styled.article`
  overflow: hidden;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 1.7rem;
  box-shadow: var(--shadow);
  transition:
    transform var(--transition),
    border-color var(--transition),
    box-shadow var(--transition);

  &:hover,
  &:focus-within {
    transform: translateY(-5px);
    border-color: rgba(0, 0, 244, 0.8);
    box-shadow:
      0 26px 50px rgba(0, 0, 0, 0.52),
      0 0 32px rgba(0, 0, 244, 0.22);
  }

  .project-media {
    position: relative;
    height: 220px;
    background: var(--project-media-bg);
    border-bottom: 1px solid var(--line);
    overflow: hidden;

    @media (max-width: 1024px) {
      height: 140px;
    }

    @media (max-width: 600px) {
      height: 110px;
    }
  }

  .project-media-image {
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 320ms ease;
    }
  }

  &:hover .project-media-image img,
  &:focus-within .project-media-image img {
    transform: scale(1.035);
  }

  .project-media-image-emganwini {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.8rem;
    background: #eee6d6;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  /* Placeholder layouts styling */
  .project-media-placeholder {
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
    }

    &::after {
      top: 18px;
      right: 18px;
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: rgba(214, 225, 239, 0.15);
      box-shadow:
        0 0 28px rgba(0, 0, 244, 0.6),
        0 0 56px rgba(0, 0, 244, 0.3);

      @media (max-width: 768px) {
        top: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
      }
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

      @media (max-width: 768px) {
        top: 10px;
        left: 10px;
        font-size: 0.6rem;
        padding: 0.2rem 0.45rem;
      }
    }

    .project-media-title {
      position: relative;
      z-index: 1;
      margin: 0 18px 0.3rem;
      color: #f6f8fb;
      font-size: clamp(1.5rem, 2vw, 2rem);
      font-weight: 800;
      letter-spacing: 0.02em;

      @media (max-width: 768px) {
        margin: 0 10px 0.1rem;
        font-size: 1rem;
      }
    }

    .project-media-copy {
      position: relative;
      z-index: 1;
      margin: 0 18px 18px;
      color: rgba(214, 225, 239, 0.84);
      font-size: 0.88rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;

      @media (max-width: 768px) {
        margin: 0 10px 10px;
        font-size: 0.68rem;
      }
    }
  }

  .media-five::after {
    width: 60px;
    height: 60px;
  }

  .media-six::before {
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

  .media-five::before {
    clip-path: polygon(
      0 100%,
      0 74%,
      18% 62%,
      32% 70%,
      51% 46%,
      68% 72%,
      83% 60%,
      100% 80%,
      100% 100%
    );
  }

  .project-body {
    padding: 1.15rem 1.15rem 1.25rem;

    @media (max-width: 768px) {
      padding: 0.75rem 0.75rem 0.85rem;
    }

    h3 {
      margin: 0;
      font-size: 1.15rem;
      color: var(--heading);

      @media (max-width: 768px) {
        font-size: 0.95rem;
      }
    }

    p {
      margin: 0.7rem 0 0;
      color: var(--muted);
      font-size: 0.92rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;

      @media (max-width: 768px) {
        margin: 0.4rem 0 0;
        font-size: 0.78rem;
        -webkit-line-clamp: 2;
      }
    }
  }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0;
    margin: 0.85rem 0 0;
    list-style: none;

    @media (max-width: 768px) {
      margin: 0.5rem 0 0;
      gap: 0.3rem;
    }

    li {
      padding: 0.42rem 0.62rem;
      border-radius: 999px;
      background: rgba(0, 0, 244, 0.18);
      border: 1px solid rgba(0, 0, 244, 0.55);
      color: var(--project-tag-text);
      font-size: 0.76rem;

      @media (max-width: 768px) {
        padding: 0.18rem 0.4rem;
        font-size: 0.62rem;
      }
    }
  }

  .project-link {
    display: inline-flex;
    align-items: center;
    margin-top: 0.9rem;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--project-link-color);
    font-size: 0.84rem;
    font-weight: 600;
    cursor: pointer;

    @media (max-width: 768px) {
      margin-top: 0.6rem;
      font-size: 0.76rem;
    }

    &::after {
      content: '->';
      margin-left: 0.35rem;
      transition: transform var(--transition);
    }

    &:hover::after,
    &:focus-visible::after {
      transform: translateX(4px);
    }
  }
`;

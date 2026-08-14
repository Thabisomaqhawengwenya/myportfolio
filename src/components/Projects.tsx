import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';

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

type Category = 'personal' | 'business' | 'education' | 'utility' | 'gift';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('business');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch('/data/projects.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
      })
      .then((data) => {
        setProjects(data);
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
      });
  }, []);

  const categories: { key: Category; label: string }[] = [
    { key: 'business', label: 'Business' },
    { key: 'personal', label: 'Personal' },
    { key: 'education', label: 'Education' },
    { key: 'utility', label: 'Utility' },
    { key: 'gift', label: 'Gift' },
  ];

  const getCategoryCount = (cat: Category) => {
    return projects.filter((p) => p.category === cat).length;
  };

  const filteredProjects = projects.filter((p) => p.category === activeCategory);

  const handleOpenDetails = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  return (
    <StyledProjects className="section projects-section" id="projects">
      <div className="container section-header section-header-center projects-header reveal is-visible">
        <h2>Work &amp; Projects</h2>
        <p>
          Exploring creativity through code, personal experiments, business ideas, education-focused experiences,
          and practical tools.
        </p>
      </div>

      <div className="container projects-filter-bar reveal is-visible" aria-label="Project categories">
        {categories.map(({ key, label }) => {
          const count = getCategoryCount(key);
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              className={`project-filter ${isActive ? 'is-active' : ''}`}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveCategory(key)}
            >
              <span>{label}</span>
              <span className="project-filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="container projects-grid">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpenDetails={handleOpenDetails}
          />
        ))}
      </div>

      <ProjectModal
        project={selectedProject}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </StyledProjects>
  );
};

const StyledProjects = styled.section`
  padding-bottom: 0.5rem;

  .section-header {
    margin-bottom: 1.35rem;

    h2 {
      margin: 0;
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 700;
      text-shadow: 0 0 18px rgba(0, 0, 244, 0.18);
    }

    p {
      max-width: 680px;
      margin: 0.75rem auto 0;
      color: var(--muted);
      font-size: 0.94rem;
    }
  }

  .section-header-center {
    text-align: center;
  }

  .projects-header {
    max-width: 860px;

    h2 {
      font-size: clamp(2.6rem, 5vw, 4.15rem);
      line-height: 1.02;
    }

    p {
      max-width: 760px;
      margin-top: 1rem;
      font-size: clamp(1rem, 1.65vw, 1.18rem);
    }
  }

  .projects-filter-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
    margin-bottom: 2.35rem;
  }

  .project-filter {
    display: inline-flex;
    align-items: center;
    gap: 0.9rem;
    min-width: 11.25rem;
    padding: 0.95rem 1.35rem;
    border: 1px solid transparent;
    border-radius: 1.35rem;
    background: var(--project-filter-bg);
    color: var(--project-filter-text);
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      transform var(--transition),
      background-color var(--transition),
      border-color var(--transition),
      color var(--transition),
      box-shadow var(--transition);

    &:hover,
    &:focus-visible {
      transform: translateY(-2px);
      border-color: rgba(0, 0, 244, 0.42);
      box-shadow: 0 0 22px rgba(0, 0, 244, 0.14);
    }

    &.is-active {
      background: var(--project-filter-active-bg);
      color: var(--project-filter-active-text);
    }
  }

  .project-filter-count {
    display: inline-grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: var(--project-filter-count-bg);
    color: inherit;
    font-size: 0.88rem;
  }

  .project-filter.is-active .project-filter-count {
    background: var(--project-filter-active-count-bg);
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.35rem;
  }

  @media (max-width: 960px) {
    .projects-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 760px) {
    .projects-grid {
      grid-template-columns: 1fr;
    }
  }
`;

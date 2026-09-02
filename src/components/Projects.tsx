import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { defaultProjectCategories, type ProjectCategory, type Project } from '../data/projectCategories';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_project_categories');
      return saved ? JSON.parse(saved) : defaultProjectCategories;
    } catch {
      return defaultProjectCategories;
    }
  });
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('portfolio_project_categories');
      const list = saved ? JSON.parse(saved) : defaultProjectCategories;
      return list[0]?.id || 'business';
    } catch {
      return 'business';
    }
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const list: Project[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Project);
        });

        if (list.length > 0) {
          list.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
          setProjects(list);
        } else {
          // Fallback to local JSON if Firestore is empty
          const res = await fetch('/data/projects.json');
          if (res.ok) {
            const localData: Project[] = await res.json();
            localData.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
            setProjects(localData);
          }
        }
      } catch (err) {
        console.error('Error fetching projects from Firestore, falling back to local JSON:', err);
        const res = await fetch('/data/projects.json');
        if (res.ok) {
          const localData: Project[] = await res.json();
          localData.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
          setProjects(localData);
        }
      }
    };

    const loadCategories = async () => {
      try {
        const catSnap = await getDoc(doc(db, 'settings', 'project_categories'));
        if (catSnap.exists()) {
          const data = catSnap.data();
          if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
            setCategories(data.categories);
            localStorage.setItem('portfolio_project_categories', JSON.stringify(data.categories));
          }
        }
      } catch (err) {
        console.warn('Error loading categories from Firestore:', err);
      }
    };

    loadProjects();
    loadCategories();

    // Listen to real-time changes from Firestore
    const unsubCategories = onSnapshot(
      doc(db, 'settings', 'project_categories'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
            setCategories(data.categories);
            localStorage.setItem('portfolio_project_categories', JSON.stringify(data.categories));
          }
        }
      },
      (err) => console.warn('Categories snapshot warning:', err)
    );

    // Listen to window event for instant local dashboard sync
    const handleCategoriesChanged = (e: CustomEvent<ProjectCategory[]>) => {
      if (e.detail && Array.isArray(e.detail) && e.detail.length > 0) {
        setCategories(e.detail);
      }
    };
    window.addEventListener('portfolio_categories_changed', handleCategoriesChanged as EventListener);

    return () => {
      unsubCategories();
      window.removeEventListener('portfolio_categories_changed', handleCategoriesChanged as EventListener);
    };
  }, []);

  // Compute active category with fallback
  const currentCategory = categories.some((c) => c.id === activeCategory)
    ? activeCategory
    : (categories[0]?.id || 'business');

  const getCategoryCount = (catId: string) => {
    return projects.filter((p) => p.category === catId).length;
  };

  const filteredProjects = projects.filter((p) => p.category === currentCategory);

  const handleOpenDetails = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  return (
    <StyledProjects className="section projects-section" id="projects">
      <div className="container section-header section-header-center projects-header reveal">
        <h2>Work &amp; Projects</h2>
        <p>
          Exploring creativity through code, personal experiments, business ideas, education-focused experiences,
          and practical tools.
        </p>
      </div>

      <div className="container projects-filter-bar reveal" aria-label="Project categories">
        {categories.map((cat) => {
          const count = getCategoryCount(cat.id);
          const isActive = currentCategory === cat.id;
          return (
            <button
              key={cat.id}
              className={`project-filter ${isActive ? 'is-active' : ''}`}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span>{cat.label}</span>
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
    gap: 0.85rem;
    min-width: 10.5rem;
    padding: 0.8rem 1.35rem;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-full);
    background: var(--project-filter-bg);
    color: var(--project-filter-text);
    box-shadow: var(--shadow-sm);
    font-size: 0.92rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition);

    &:hover,
    &:focus-visible {
      transform: translateY(-2px);
      border-color: var(--accent);
      color: var(--accent);
      box-shadow: var(--shadow-md);
    }

    &.is-active {
      background: var(--project-filter-active-bg);
      border-color: var(--project-filter-active-bg);
      color: var(--project-filter-active-text);
      box-shadow: 0 4px 14px rgba(26, 115, 232, 0.35);

      &:hover {
        color: #ffffff;
      }
    }
  }

  .project-filter-count {
    display: inline-grid;
    place-items: center;
    width: 1.85rem;
    height: 1.85rem;
    border-radius: 50%;
    background: var(--project-filter-count-bg);
    color: inherit;
    font-size: 0.82rem;
    font-weight: 700;
  }

  .project-filter.is-active .project-filter-count {
    background: var(--project-filter-active-count-bg);
    color: #ffffff;
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.35rem;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }

    @media (max-width: 480px) {
      gap: 0.75rem;
    }
  }
`;

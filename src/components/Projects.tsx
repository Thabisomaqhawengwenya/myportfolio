import React, { useState } from 'react';
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

const projectsData: Project[] = [
  {
    id: 'my-first-website',
    category: 'personal',
    title: 'My First Website',
    description: 'My First Website is an early web project that explores a classic landing-page layout with a strong hero section, clear menu structure, and simple visual storytelling using HTML, CSS, and JavaScript.',
    tags: ['HTML', 'CSS', 'JS'],
    image: '/images/firstwebsite.png',
    liveDemoUrl: 'https://thabisomaqhawengwenya-netizen.github.io/myfirstwebsite/',
    githubUrl: 'https://github.com/thabisomaqhawengwenya-netizen/myfirstwebsite.git',
  },
  {
    id: 'brainwave-io',
    category: 'business',
    title: 'Brainwave.io',
    description: 'Brainwave.io is a clean marketing website built around a bold hero section, simple navigation, and a modern business-focused layout designed to present services clearly and guide visitors toward action.',
    tags: ['Landing Page', 'HTML', 'JavaScript', 'CSS'],
    image: '/images/brainwave.png',
    liveDemoUrl: 'https://thabisomaqhawengwenya-netizen.github.io/brainwave.io/',
    githubUrl: 'https://github.com/thabisomaqhawengwenya-netizen/brainwave.io.git',
  },
  {
    id: 'shark-web',
    category: 'personal',
    title: 'Shark.web',
    description: 'Shark.web is a visually immersive website built around shark-themed content, strong hero imagery, and a clean structure that introduces visitors to the site through an engaging marine-inspired design.',
    tags: ['Landing Page', 'HTML', 'JS', 'CSS'],
    image: '/images/shark.web.png',
    liveDemoUrl: 'https://thabisomaqhawengwenya-netizen.github.io/sharks.web/',
    githubUrl: 'https://github.com/thabisomaqhawengwenya-netizen/sharks.web.git',
  },
  {
    id: 'tutorme',
    category: 'education',
    title: 'tutorMe',
    description: 'tutorMe is a Figma-built education platform concept focused on helping users discover tutoring support through a clean interface, simple navigation, and an approachable learning-centered presentation.',
    tags: ['Figma', 'UI Design', 'Education'],
    image: '/images/tutorme.png',
    liveDemoUrl: 'https://static-real-57469152.figma.site',
  },
  {
    id: 'weather-dashboard',
    category: 'utility',
    title: 'Weather app',
    description: 'Weather app is a weather dashboard project built to help users search cities quickly, view forecast details, and interact with a clean interface designed for clarity and ease of use.',
    tags: ['Weather', 'API', 'JavaScript'],
    image: '/images/weatherapp.png',
    liveDemoUrl: 'https://thabisomaqhawengwenya-netizen.github.io/Weather-Dashboard-App-/',
    githubUrl: 'https://github.com/thabisomaqhawengwenya-netizen/Weather-Dashboard-App-.git',
  },
  {
    id: 'age-calculator',
    category: 'utility',
    title: 'Age calculator',
    description: 'Age calculator is a utility project created to help users quickly calculate age through a clean interface, simple inputs, and a clear result-focused experience.',
    tags: ['Utility', 'JavaScript', 'Calculator'],
    placeholder: {
      badge: 'Utility',
      title: 'Age',
      copy: 'Calculator',
      mediaClass: 'media-six',
    },
    githubUrl: 'https://github.com/thabisomaqhawengwenya-netizen/age_calculator.git',
  },
  {
    id: 'pop-up-notification',
    category: 'utility',
    title: 'pop up notification',
    description: 'pop up notification is a Python utility project built to trigger simple notifications through a clear, lightweight setup focused on quick feedback and practical use.',
    tags: ['Utility', 'Python', 'Notification'],
    placeholder: {
      badge: 'Utility',
      title: 'Pop Up',
      copy: 'Notification',
      mediaClass: 'media-five',
    },
    githubUrl: 'https://github.com/thabisomaqhawengwenya-netizen/project_4-website.git',
  },
  {
    id: 'calculator',
    category: 'utility',
    title: 'calculator',
    description: 'calculator is a Python utility project created to perform everyday calculations through a simple, direct, and easy-to-use setup focused on fast results.',
    tags: ['Utility', 'Python', 'Calculator'],
    placeholder: {
      badge: 'Utility',
      title: 'Python',
      copy: 'Calculator',
      mediaClass: 'media-six',
    },
    githubUrl: 'https://github.com/thabisomaqhawengwenya-netizen/calculator.git',
  },
  {
    id: 'student-register',
    category: 'gift',
    title: 'Student Register',
    description: 'Student Register is a student-focused tool built to present registration information clearly through a simple, practical, and easy-to-use interface.',
    tags: ['Students', 'Register', 'JavaScript'],
    image: '/images/student-register.jpeg',
    liveDemoUrl: 'https://thabisomaqhawengwenya-netizen.github.io/students_register/',
    githubUrl: 'https://github.com/thabisomaqhawengwenya-netizen/students_register.git',
  },
  {
    id: 'emganwini-main-sda-church',
    category: 'gift',
    title: 'Emganwini Main SDA church',
    description: 'Emganwini Main SDA church is a gift website project created to give the church a welcoming digital presence with simple navigation, clear structure, and an accessible community-facing layout.',
    tags: ['Church', 'Gift', 'Website'],
    image: '/images/emganwini-main-sda-church.png',
    isEmganwiniImage: true,
    liveDemoUrl: 'https://thabisomaqhawengwenya-netizen.github.io/emganwinimain-website/',
  },
  {
    id: 'car-website-modrino',
    category: 'business',
    title: 'car Website(Modrino)',
    description: 'car Website(Modrino) is a polished car landing page with bold presentation, clear navigation, and a confident business-focused layout built to showcase vehicles beautifully.',
    tags: ['Cars', 'Business', 'JavaScript'],
    image: '/images/modrino.png',
    liveDemoUrl: 'https://thabisomaqhawengwenya-netizen.github.io/Car.website-Modrino-/',
    githubUrl: 'https://github.com/thabisomaqhawengwenya-netizen/Car.website-Modrino-.git',
  },
];

type Category = 'personal' | 'business' | 'education' | 'utility' | 'gift';

export const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('personal');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const categories: { key: Category; label: string }[] = [
    { key: 'personal', label: 'Personal' },
    { key: 'business', label: 'Business' },
    { key: 'education', label: 'Education' },
    { key: 'utility', label: 'Utility' },
    { key: 'gift', label: 'Gift' },
  ];

  const getCategoryCount = (cat: Category) => {
    return projectsData.filter((p) => p.category === cat).length;
  };

  const filteredProjects = projectsData.filter((p) => p.category === activeCategory);

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
    grid-template-columns: repeat(3, minmax(0, 1fr));
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

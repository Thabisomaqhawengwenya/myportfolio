export type ProjectStatus = 'completed' | 'in-progress' | 'case-study';
export type ProjectCategory = 'frontend' | 'fullstack' | 'design' | 'clone';

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  problem: string;
  solution: string;
  challenges: string;
  lessons: string;
  tags: string[];
  category: ProjectCategory;
  status: ProjectStatus;
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
  featured?: boolean;
}

export const projectsData: Project[] = [
  {
    id: 'personal-portfolio',
    title: 'Personal Portfolio V2',
    shortDescription: 'A production-quality portfolio built with React, TypeScript, Vite, and Three.js.',
    description:
      'A fully redesigned developer portfolio featuring an interactive 3D UFO scene, dark/light theming, scroll animations, and a clean component architecture. Built to demonstrate production-ready frontend development skills.',
    problem:
      'The original portfolio was too minimal — it lacked the visual credibility and content depth needed to communicate real engineering capability to recruiters.',
    solution:
      'Rebuilt from scratch using a structured component architecture, a complete CSS design-system with custom properties, Three.js for the interactive 3D hero scene, and a data-driven project showcase.',
    challenges:
      'Integrating a Three.js WebGL scene with React lifecycle management without memory leaks, and building a theme system that works as two fully independent designs rather than a simple color inversion.',
    lessons:
      'Deep understanding of Three.js scene setup, React ref patterns, and how design tokens scale across themes.',
    tags: ['React', 'TypeScript', 'Vite', 'Three.js', 'styled-components'],
    category: 'frontend',
    status: 'completed',
    image: '/images/portfolio profile.png',
    featured: true,
  },
  {
    id: 'church-website',
    title: 'Emganwini Main SDA Church',
    shortDescription: 'A gift project giving a local church its first professional web presence.',
    description:
      'Designed and developed a complete website for a local church community — welcoming layout, clear navigation, event information, and accessible design for visitors of all technical backgrounds.',
    problem:
      'The church had no digital presence. Community members and visitors had no way to find service times, contact information, or get a sense of the community online.',
    solution:
      'Built a clean, accessible website with a warm design language, clear content hierarchy, and mobile-first responsive layout that works on any device.',
    challenges:
      'Designing for a non-technical audience meant prioritizing clarity over complexity. Every layout decision had to serve discoverability.',
    lessons:
      'How to translate a real client brief into design decisions. The importance of content hierarchy and accessibility in community-facing sites.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    category: 'frontend',
    status: 'in-progress',
    image: '/images/emganwini-main-sda-church.png',
    isEmganwiniImage: true,
    liveDemoUrl: 'https://thabisomaqhawengwenya-netizen.github.io/emganwinimain-website/',
    featured: true,
  },
  {
    id: 'tutorme',
    title: 'TutorMe — UX/UI Case Study',
    shortDescription: 'A Figma-designed education platform concept focused on learning discoverability.',
    description:
      'A complete UI/UX design for an education platform that helps students find tutoring support. Covers user flows, component design, and a clean interface built in Figma from research to high-fidelity prototype.',
    problem:
      'Students struggle to find quality tutoring that matches their learning style and schedule. Existing platforms feel cluttered and transactional.',
    solution:
      'Designed a clean, student-centered platform with intuitive subject discovery, tutor profiles, and a booking flow that reduces friction at every step.',
    challenges:
      'Translating user needs into a coherent visual system without any code — pure design thinking, component architecture, and information hierarchy.',
    lessons:
      'How to design information architecture before touching visual style. The value of a proper component library in Figma.',
    tags: ['Figma', 'UI/UX Design', 'Prototyping', 'Design Systems'],
    category: 'design',
    status: 'case-study',
    image: '/images/tutorme.png',
    liveDemoUrl: 'https://static-real-57469152.figma.site',
    featured: true,
  },
  {
    id: 'brainwave-io',
    title: 'Brainwave.io — Business Landing Page',
    shortDescription: 'A modern marketing website with a bold hero and conversion-focused layout.',
    description:
      'A marketing website designed to present a business service clearly and guide visitors toward action. Features a bold hero section, clean navigation, and a structured layout that communicates value quickly.',
    problem:
      'Business landing pages often fail to communicate their value proposition within the first 5 seconds. Most are visually cluttered or lack a clear call to action.',
    solution:
      'Built a focused single-page site with a strong hero, logical section flow, and a CTA structure that guides visitors naturally down the page.',
    challenges:
      'Creating visual hierarchy purely with typography, spacing, and color without relying on heavy imagery or complex animations.',
    lessons:
      'How spacing and typographic scale alone can create a professional, credible impression. The importance of above-the-fold clarity.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Landing Page'],
    category: 'frontend',
    status: 'completed',
    image: '/images/brainwave.png',
    liveDemoUrl: 'https://thabisomaqhawengwenya-netizen.github.io/brainwave.io/',
    githubUrl: 'https://github.com/thabisomaqhawengwenya-netizen/brainwave.io.git',
  },
  {
    id: 'weather-app',
    title: 'Weather Dashboard',
    shortDescription: 'A real-time city weather app consuming a live API with a clean data-focused UI.',
    description:
      'A weather dashboard that allows users to search any city and view current conditions and a forecast. Demonstrates real-world API integration, async JavaScript, and clean data presentation.',
    problem:
      'Learning API integration requires a project complex enough to deal with async data, error states, and dynamic UI updates — not just a static layout.',
    solution:
      'Built a city search weather app with live API calls, loading states, error handling, and a clean interface that makes weather data easy to scan.',
    challenges:
      'Handling API rate limits, managing async state without a framework, and designing a UI that gracefully handles empty, loading, and error states.',
    lessons:
      'Async JavaScript patterns, fetch API, error boundary thinking, and how to design UI states beyond just the "happy path".',
    tags: ['JavaScript', 'REST API', 'Async/Await', 'HTML', 'CSS'],
    category: 'frontend',
    status: 'completed',
    image: '/images/weatherapp.png',
    liveDemoUrl: 'https://thabisomaqhawengwenya-netizen.github.io/Weather-Dashboard-App-/',
    githubUrl: 'https://github.com/thabisomaqhawengwenya-netizen/Weather-Dashboard-App-.git',
  },
  {
    id: 'modrino',
    title: 'Modrino — Car Website',
    shortDescription: 'A polished automotive landing page with confident, product-first design.',
    description:
      'A business-focused car dealership landing page with bold vehicle presentation, clear navigation, and a layout built to put the product first and guide visitors toward enquiry.',
    problem:
      'Automotive websites often overwhelm visitors with too much information. The challenge was to create a confident, clean presentation that builds trust quickly.',
    solution:
      'Designed a focused landing page with strong hero imagery, minimal navigation, and a clear visual hierarchy that communicates quality before the visitor reads a word.',
    challenges:
      'Balancing visual boldness with content restraint — making the page feel premium without over-designing it.',
    lessons:
      'How commercially-oriented design differs from portfolio or utility design. Product-first layout thinking.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    category: 'frontend',
    status: 'completed',
    image: '/images/modrino.png',
    liveDemoUrl: 'https://thabisomaqhawengwenya-netizen.github.io/Car.website-Modrino-/',
    githubUrl: 'https://github.com/thabisomaqhawengwenya-netizen/Car.website-Modrino-.git',
  },
  {
    id: 'elohims-legacy',
    title: "Elohim's Legacy Website",
    shortDescription: "A minimalist clothing e-commerce website designed for an intentional wardrobe.",
    description:
      "A curated rotation of tees, hoodies, and layers designed to sit quietly and stay relevant. Built with a minimal clothing store aesthetic, featuring collections, shop filter features, and smooth user flow.",
    problem:
      "E-commerce websites often compromise aesthetics for utility, creating cluttered experiences that distract from the products themselves.",
    solution:
      "Built a highly aesthetic, minimal clothing website using styled-components, custom layouts, and a curated product catalog to present an editorial uniform brand.",
    challenges:
      "Achieving a balanced editorial layout with high readability, smooth transitions, and responsive grid layouts.",
    lessons:
      "Gained deep knowledge on combining styled-components theme variables, minimalist UI layouts, and asset optimizations for e-commerce design.",
    tags: ['React.js', 'Vite', 'styled-components', 'Iconify'],
    category: 'frontend',
    status: 'completed',
    image: '/images/elohims-legacy.webp',
    liveDemoUrl: 'https://el-topaz.vercel.app/',
    githubUrl: 'https://github.com/Thabisomaqhawengwenya/el.git',
  },
];

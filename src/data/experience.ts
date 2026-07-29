export interface TimelineItem {
  id: string;
  role: string;
  org: string;
  period: string;
  description: string;
  tags: string[];
  type: 'education' | 'project' | 'certification';
}

export const experienceData: TimelineItem[] = [
  {
    id: 'uncommon',
    role: 'Software Development Student',
    org: 'Uncommon.org',
    period: '2026 – Present',
    description:
      'Studying software development with a focus on modern web technologies, clean code practices, and building production-quality applications. Working on real-world projects that span frontend development, UI design, and full-stack fundamentals.',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
    type: 'education',
  },
  {
    id: 'freecodecamp',
    role: 'Responsive Web Design Certification',
    org: 'freeCodeCamp',
    period: '2026',
    description:
      'Completed the Responsive Web Design certification, covering HTML5 semantics, CSS3 layout systems, flexbox, CSS Grid, accessibility best practices, and building responsive layouts that work across all screen sizes.',
    tags: ['HTML5', 'CSS3', 'Responsive Design', 'Accessibility'],
    type: 'certification',
  },
  {
    id: 'product-design',
    role: 'Product Design Crash Course',
    org: 'Self-directed',
    period: '2026',
    description:
      'Completed a product design crash course covering UI/UX fundamentals, design systems, Figma workflows, component design, and user-centered design principles applied to real interface projects.',
    tags: ['UI/UX', 'Figma', 'Design Systems', 'Prototyping'],
    type: 'certification',
  },
  {
    id: 'digital-marketing',
    role: 'Digital Marketing Crash Course',
    org: 'Self-directed',
    period: '2026',
    description:
      'Completed a digital marketing course covering SEO fundamentals, content strategy, social media presence, and online branding — skills that inform how I think about the web products I build.',
    tags: ['SEO', 'Content Strategy', 'Branding'],
    type: 'certification',
  },
  {
    id: 'projects',
    role: 'Freelance & Personal Projects',
    org: 'Independent',
    period: '2025 – Present',
    description:
      'Started coding in 2025 and quickly moved into building real projects — including a local church website, a Toyota Zimbabwe website clone, a personal portfolio, and multiple frontend applications. Gained hands-on experience with Git workflows, API integration, responsive design, and debugging.',
    tags: ['React', 'JavaScript', 'Git', 'Vite', 'Figma'],
    type: 'project',
  },
];

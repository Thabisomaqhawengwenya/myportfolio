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
    id: 'uncommon-student',
    role: 'Student',
    org: 'Uncommon.org',
    period: '2025 – 2026',
    description:
      'Completed training in UX/UI Design, Digital Marketing, and Software Engineering. Specialized in frontend development using HTML, CSS, JavaScript, React, and Vite. Gained hands-on experience with Node.js and backend development using Firebase and Supabase. Applied Git and GitHub for version control and collaborative development. Strengthened debugging, problem-solving, and responsive web development skills.',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Vite', 'Node.js', 'Firebase', 'Supabase', 'Git', 'GitHub', 'UI/UX'],
    type: 'education',
  },
  {
    id: 'scratch-instructor',
    role: 'Scratch Coding Instructor (Volunteer)',
    org: 'Teaching at local schools',
    period: '2025 – Present',
    description:
      'Taught Scratch programming concepts to groups of learners. Assisted students in building interactive games and animations. Simplified programming concepts for beginners through practical demonstrations.',
    tags: ['Scratch', 'Teaching', 'Mentorship', 'Game Development'],
    type: 'project',
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

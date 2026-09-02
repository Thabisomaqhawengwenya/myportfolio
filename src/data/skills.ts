export interface Skill {
  name: string;
  level: 'learning' | 'familiar' | 'proficient' | 'confident';
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: Skill[];
}

export interface TechItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  row: 1 | 2 | 3;
  category: 'frontend' | 'backend' | 'tools' | 'learning' | 'design' | 'other';
  order?: number;
}

export const defaultTechItems: TechItem[] = [
  // Row 1 — Frontend & Core Languages
  { id: 'tech-1', name: 'HTML5', icon: 'vscode-icons:file-type-html', color: '#E34F26', row: 1, category: 'frontend', order: 0 },
  { id: 'tech-2', name: 'CSS3', icon: 'vscode-icons:file-type-css', color: '#1572B6', row: 1, category: 'frontend', order: 1 },
  { id: 'tech-3', name: 'JavaScript', icon: 'vscode-icons:file-type-js-official', color: '#F7DF1E', row: 1, category: 'frontend', order: 2 },
  { id: 'tech-4', name: 'React', icon: 'vscode-icons:file-type-reactjs', color: '#61DAFB', row: 1, category: 'frontend', order: 3 },
  { id: 'tech-5', name: 'Vite', icon: 'vscode-icons:file-type-vite', color: '#646CFF', row: 1, category: 'frontend', order: 4 },
  { id: 'tech-6', name: 'TypeScript', icon: 'vscode-icons:file-type-typescript-official', color: '#3178C6', row: 1, category: 'frontend', order: 5 },

  // Row 2 — Design & Development Tools
  { id: 'tech-7', name: 'Figma', icon: 'vscode-icons:file-type-figma', color: '#F24E1E', row: 2, category: 'design', order: 6 },
  { id: 'tech-8', name: 'Git', icon: 'vscode-icons:file-type-git', color: '#F05032', row: 2, category: 'tools', order: 7 },
  { id: 'tech-9', name: 'GitHub', icon: 'skill-icons:github-dark', color: '#ffffff', row: 2, category: 'tools', order: 8 },
  { id: 'tech-10', name: 'VS Code', icon: 'vscode-icons:file-type-vscode', color: '#007ACC', row: 2, category: 'tools', order: 9 },
  { id: 'tech-11', name: 'Node.js', icon: 'vscode-icons:file-type-node', color: '#339933', row: 2, category: 'backend', order: 10 },
  { id: 'tech-12', name: 'Firebase', icon: 'vscode-icons:file-type-firebase', color: '#FFCA28', row: 2, category: 'tools', order: 11 },

  // Row 3 — APIs & Emerging Tech
  { id: 'tech-13', name: 'Supabase', icon: 'skill-icons:supabase-dark', color: '#3ECF8E', row: 3, category: 'backend', order: 12 },
  { id: 'tech-14', name: 'Python', icon: 'vscode-icons:file-type-python', color: '#3776AB', row: 3, category: 'backend', order: 13 },
  { id: 'tech-15', name: 'REST APIs', icon: 'carbon:api', color: '#1A73E8', row: 3, category: 'backend', order: 14 },
  { id: 'tech-16', name: 'UI/UX', icon: 'carbon:pen-fountain', color: '#FF7262', row: 3, category: 'design', order: 15 },
  { id: 'tech-17', name: 'Responsive', icon: 'carbon:devices', color: '#10B981', row: 3, category: 'frontend', order: 16 },
];

export const popularPresets: Omit<TechItem, 'id' | 'order'>[] = [
  // Modern Frontend & Frameworks
  { name: 'Next.js', icon: 'skill-icons:nextjs-dark', color: '#ffffff', row: 1, category: 'frontend' },
  { name: 'Tailwind CSS', icon: 'vscode-icons:file-type-tailwind', color: '#38BDF8', row: 1, category: 'frontend' },
  { name: 'Three.js', icon: 'skill-icons:threejs-dark', color: '#ffffff', row: 1, category: 'frontend' },
  { name: 'Vue.js', icon: 'vscode-icons:file-type-vue', color: '#4FC08D', row: 1, category: 'frontend' },
  { name: 'Redux', icon: 'vscode-icons:file-type-redux', color: '#764ABC', row: 1, category: 'frontend' },
  { name: 'Sass / SCSS', icon: 'vscode-icons:file-type-sass', color: '#CC6699', row: 1, category: 'frontend' },
  { name: 'Astro', icon: 'vscode-icons:file-type-astro', color: '#FF5D01', row: 1, category: 'frontend' },
  { name: 'Svelte', icon: 'vscode-icons:file-type-svelte', color: '#FF3E00', row: 1, category: 'frontend' },
  { name: 'Bootstrap', icon: 'skill-icons:bootstrap', color: '#7952B3', row: 1, category: 'frontend' },
  { name: 'Angular', icon: 'vscode-icons:file-type-angular', color: '#DD0031', row: 1, category: 'frontend' },
  { name: 'Remix', icon: 'skill-icons:remix-dark', color: '#ffffff', row: 1, category: 'frontend' },
  { name: 'Zustand', icon: 'carbon:chip', color: '#764ABC', row: 1, category: 'frontend' },

  // Backend, Databases & APIs
  { name: 'PostgreSQL', icon: 'vscode-icons:file-type-pgsql', color: '#336791', row: 2, category: 'backend' },
  { name: 'MongoDB', icon: 'vscode-icons:file-type-mongo', color: '#47A248', row: 2, category: 'backend' },
  { name: 'GraphQL', icon: 'vscode-icons:file-type-graphql', color: '#E10098', row: 3, category: 'backend' },
  { name: 'Prisma', icon: 'vscode-icons:file-type-prisma', color: '#2D3748', row: 2, category: 'backend' },
  { name: 'Redis', icon: 'vscode-icons:file-type-redis', color: '#DC382D', row: 2, category: 'backend' },
  { name: 'Express.js', icon: 'skill-icons:expressjs-dark', color: '#ffffff', row: 2, category: 'backend' },
  { name: 'NestJS', icon: 'vscode-icons:file-type-nestjs', color: '#E0234E', row: 2, category: 'backend' },
  { name: 'FastAPI', icon: 'skill-icons:fastapi', color: '#009688', row: 3, category: 'backend' },
  { name: 'Django', icon: 'vscode-icons:file-type-django', color: '#092E20', row: 2, category: 'backend' },
  { name: 'Go (Golang)', icon: 'vscode-icons:file-type-go', color: '#00ADD8', row: 3, category: 'backend' },
  { name: 'Rust', icon: 'vscode-icons:file-type-rust', color: '#DEA584', row: 3, category: 'backend' },
  { name: 'MySQL', icon: 'vscode-icons:file-type-mysql', color: '#4479A1', row: 2, category: 'backend' },
  { name: 'SQLite', icon: 'vscode-icons:file-type-sqlite', color: '#003B57', row: 2, category: 'backend' },
  { name: 'Flask', icon: 'skill-icons:flask-dark', color: '#ffffff', row: 3, category: 'backend' },

  // Cloud, DevOps & Tools
  { name: 'Docker', icon: 'vscode-icons:file-type-docker2', color: '#2496ED', row: 2, category: 'tools' },
  { name: 'AWS', icon: 'skill-icons:aws-dark', color: '#FF9900', row: 2, category: 'tools' },
  { name: 'Kubernetes', icon: 'vscode-icons:file-type-k8s', color: '#326CE5', row: 2, category: 'tools' },
  { name: 'Linux', icon: 'skill-icons:linux-dark', color: '#FCC624', row: 2, category: 'tools' },
  { name: 'Nginx', icon: 'vscode-icons:file-type-nginx', color: '#009639', row: 2, category: 'tools' },
  { name: 'Postman', icon: 'vscode-icons:file-type-postman', color: '#FF6C37', row: 2, category: 'tools' },
  { name: 'Vercel', icon: 'skill-icons:vercel-dark', color: '#ffffff', row: 2, category: 'tools' },
  { name: 'Google Cloud', icon: 'skill-icons:gcp-dark', color: '#4285F4', row: 2, category: 'tools' },
  { name: 'Cloudflare', icon: 'skill-icons:cloudflare-dark', color: '#F38020', row: 2, category: 'tools' },
  { name: 'Jest', icon: 'vscode-icons:file-type-jest', color: '#C21325', row: 2, category: 'tools' },
  { name: 'Cypress', icon: 'skill-icons:cypress-dark', color: '#69D3A7', row: 2, category: 'tools' },

  // Mobile & Cross-Platform
  { name: 'Flutter', icon: 'vscode-icons:file-type-flutter', color: '#02569B', row: 3, category: 'learning' },
  { name: 'React Native', icon: 'vscode-icons:file-type-reactjs', color: '#61DAFB', row: 3, category: 'learning' },
  { name: 'Swift', icon: 'vscode-icons:file-type-swift', color: '#FA7343', row: 3, category: 'learning' },
  { name: 'Kotlin', icon: 'vscode-icons:file-type-kotlin', color: '#7F52FF', row: 3, category: 'learning' },
  { name: 'Electron', icon: 'vscode-icons:file-type-electron', color: '#47848F', row: 3, category: 'learning' },

  // Design & Product
  { name: 'Adobe XD', icon: 'vscode-icons:file-type-adobe-xd', color: '#FF61F6', row: 3, category: 'design' },
  { name: 'Canva', icon: 'skill-icons:canva-dark', color: '#00C4CC', row: 3, category: 'design' },
  { name: 'Storybook', icon: 'vscode-icons:file-type-storybook', color: '#FF4785', row: 3, category: 'design' },
];

export const skillsData: SkillCategory[] = [
  {
    id: 'tech-stack',
    label: 'Tech Stack',
    skills: [
      { name: 'HTML5/CSS/JQuery', level: 'confident' },
      { name: 'JavaScript/TypeScript', level: 'confident' },
      { name: 'Python', level: 'familiar' },
      { name: 'Node.js/Express', level: 'proficient' },
    ],
  },
  {
    id: 'frameworks',
    label: 'Frameworks & Libraries',
    skills: [
      { name: 'React.js', level: 'confident' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    skills: [
      { name: 'Git & GitHub', level: 'confident' },
      { name: 'VS Code', level: 'confident' },
      { name: 'Figma', level: 'proficient' },
    ],
  },
  {
    id: 'skills',
    label: 'Skills',
    skills: [
      { name: 'Strong Communication', level: 'confident' },
      { name: 'Team Collaboration', level: 'confident' },
      { name: 'Problem Solving', level: 'confident' },
      { name: 'Adaptability', level: 'confident' },
      { name: 'Creativity', level: 'confident' },
      { name: 'UX/UI Product Design', level: 'confident' },
      { name: 'Responsive Web Design', level: 'confident' },
      { name: 'Continuous Learning', level: 'confident' },
    ],
  },
];

export const levelLabel: Record<Skill['level'], string> = {
  learning: 'Learning',
  familiar: 'Familiar',
  proficient: 'Proficient',
  confident: 'Confident',
};

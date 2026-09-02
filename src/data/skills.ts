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
  { name: 'Next.js', icon: 'skill-icons:nextjs-dark', color: '#ffffff', row: 1, category: 'frontend' },
  { name: 'Tailwind CSS', icon: 'vscode-icons:file-type-tailwind', color: '#38BDF8', row: 1, category: 'frontend' },
  { name: 'Three.js', icon: 'skill-icons:threejs-dark', color: '#ffffff', row: 1, category: 'frontend' },
  { name: 'PostgreSQL', icon: 'vscode-icons:file-type-pgsql', color: '#336791', row: 2, category: 'backend' },
  { name: 'MongoDB', icon: 'vscode-icons:file-type-mongo', color: '#47A248', row: 2, category: 'backend' },
  { name: 'GraphQL', icon: 'vscode-icons:file-type-graphql', color: '#E10098', row: 3, category: 'backend' },
  { name: 'Docker', icon: 'vscode-icons:file-type-docker2', color: '#2496ED', row: 2, category: 'tools' },
  { name: 'AWS', icon: 'skill-icons:aws-dark', color: '#FF9900', row: 2, category: 'tools' },
  { name: 'Redux', icon: 'vscode-icons:file-type-redux', color: '#764ABC', row: 1, category: 'frontend' },
  { name: 'Vue.js', icon: 'vscode-icons:file-type-vue', color: '#4FC08D', row: 1, category: 'frontend' },
  { name: 'Flutter', icon: 'vscode-icons:file-type-flutter', color: '#02569B', row: 3, category: 'learning' },
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

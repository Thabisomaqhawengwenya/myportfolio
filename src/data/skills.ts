export interface Skill {
  name: string;
  level: 'learning' | 'familiar' | 'proficient' | 'confident';
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: Skill[];
}

export const skillsData: SkillCategory[] = [
  {
    id: 'languages',
    label: 'Languages',
    skills: [
      { name: 'HTML5',           level: 'confident'  },
      { name: 'CSS3',            level: 'confident'  },
      { name: 'JavaScript',      level: 'confident'  },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'React.js',             level: 'proficient' },
      { name: 'Responsive Design',    level: 'confident'  },
      { name: 'Vite',                 level: 'proficient' },
      { name: 'styled-components',    level: 'proficient' },
    ],
  },
  {
    id: 'design',
    label: 'Design & Tools',
    skills: [
      { name: 'Figma',       level: 'proficient' },
      { name: 'UI/UX Design',level: 'familiar'   },
      { name: 'Git & GitHub',level: 'proficient' },
    ],
  },
  {
    id: 'learning',
    label: 'Currently Learning',
    skills: [
      { name: 'Node.js',             level: 'learning' },
      { name: 'Firebase',            level: 'learning' },
      { name: 'Supabase',            level: 'learning' },
      { name: 'REST APIs',           level: 'learning' },
      { name: 'Full-Stack Dev',      level: 'learning' },
    ],
  },
];

export const levelLabel: Record<Skill['level'], string> = {
  learning:   'Learning',
  familiar:   'Familiar',
  proficient: 'Proficient',
  confident:  'Confident',
};

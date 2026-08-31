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
    id: 'tech-stack',
    label: 'Tech Stack',
    skills: [
      { name: 'HTML5/CSS/JQuery',     level: 'confident'  },
      { name: 'JavaScript/TypeScript', level: 'confident'  },
      { name: 'Python',               level: 'familiar'   },
      { name: 'Node.js/Express',      level: 'proficient' },
    ],
  },
  {
    id: 'frameworks',
    label: 'Frameworks & Libraries',
    skills: [
      { name: 'React.js',             level: 'confident'  },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    skills: [
      { name: 'Git & GitHub',         level: 'confident'  },
      { name: 'VS Code',              level: 'confident'  },
      { name: 'Figma',                level: 'proficient' },
    ],
  },
  {
    id: 'skills',
    label: 'Skills',
    skills: [
      { name: 'Strong Communication', level: 'confident'  },
      { name: 'Team Collaboration',   level: 'confident'  },
      { name: 'Problem Solving',      level: 'confident'  },
      { name: 'Adaptability',         level: 'confident'  },
      { name: 'Creativity',           level: 'confident'  },
      { name: 'UX/UI Product Design', level: 'confident'  },
      { name: 'Responsive Web Design',level: 'confident'  },
      { name: 'Continuous Learning',  level: 'confident'  },
    ],
  },
];

export const levelLabel: Record<Skill['level'], string> = {
  learning:   'Learning',
  familiar:   'Familiar',
  proficient: 'Proficient',
  confident:  'Confident',
};

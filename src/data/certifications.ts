export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
  credentialUrl?: string;
  status: 'earned' | 'in-progress';
}

export const certificationsData: Certification[] = [
  {
    id: 'fcc-rwd',
    title: 'Responsive Web Design',
    issuer: 'freeCodeCamp',
    year: '2026',
    description:
      'Covers HTML5, CSS3, Flexbox, CSS Grid, responsive layouts, and web accessibility. Includes 5 certification projects built from scratch.',
    credentialUrl: 'https://www.freecodecamp.org',
    status: 'earned',
  },
  {
    id: 'product-design',
    title: 'Product Design Crash Course',
    issuer: 'Self-directed',
    year: '2026',
    description:
      'UI/UX fundamentals, Figma workflows, component design, and user-centered design principles.',
    status: 'earned',
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Crash Course',
    issuer: 'Self-directed',
    year: '2026',
    description:
      'SEO fundamentals, content strategy, online branding, and social media presence for web products.',
    status: 'earned',
  },
];

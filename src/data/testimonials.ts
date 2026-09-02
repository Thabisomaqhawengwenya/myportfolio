export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  content: string;
  rating: number; // 1 to 5
  featured?: boolean;
  visible?: boolean;
  date?: string;
  order?: number;
}

export const defaultTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Sipho Ndlovu',
    role: 'Creative Director',
    company: 'Island Child Apparel',
    content:
      'Maqhawe delivered an exceptional e-commerce experience for our clothing brand. His attention to modern UI/UX design, fluid animations, and mobile responsiveness exceeded our expectations. Highly recommended!',
    rating: 5,
    featured: true,
    visible: true,
    date: 'February 2026',
    order: 0,
  },
  {
    id: 'test-2',
    name: 'Brian Moyo',
    role: 'Lead Architect',
    company: 'Toyota Zimbabwe Concept',
    content:
      'Working with Maqhawe was seamless. He translated our complex showroom requirements into a lightning-fast web application with pristine design quality and clean architecture.',
    rating: 5,
    featured: true,
    visible: true,
    date: 'January 2026',
    order: 1,
  },
  {
    id: 'test-3',
    name: 'Tariro Mutasa',
    role: 'Senior Tech Mentor',
    company: 'Code & Youth Initiative',
    content:
      'A brilliant engineer with natural mentoring skills. Maqhawe has a rare combination of technical precision in React/TypeScript and the patience to guide and empower younger developers.',
    rating: 5,
    featured: true,
    visible: true,
    date: 'November 2025',
    order: 2,
  },
  {
    id: 'test-4',
    name: 'Kudzai Dube',
    role: 'Product Lead',
    company: 'El Topaz Logistics',
    content:
      'Delivered our transport management frontend on time with impressive responsiveness and clean state handling. An absolute pleasure to collaborate with.',
    rating: 5,
    featured: false,
    visible: true,
    date: 'December 2025',
    order: 3,
  },
];

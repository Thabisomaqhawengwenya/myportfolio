export interface ProjectCategory {
  id: string;
  label: string;
  order?: number;
}

export const defaultProjectCategories: ProjectCategory[] = [
  { id: 'business', label: 'Business', order: 0 },
  { id: 'personal', label: 'Personal', order: 1 },
  { id: 'education', label: 'Education', order: 2 },
  { id: 'utility', label: 'Utility', order: 3 },
  { id: 'gift', label: 'Gift', order: 4 },
];

export interface Project {
  id: string;
  category: string;
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
  order?: number;
}

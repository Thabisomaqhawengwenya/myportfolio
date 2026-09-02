export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Engineering' | 'Architecture' | 'Tutorial' | 'Career' | 'Case Study';
  coverImage?: string;
  tags: string[];
  readTimeMinutes: number;
  publishedAt: string;
  published: boolean;
  featured?: boolean;
  author?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  order?: number;
}

export const defaultBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'architecting-3d-ufo-hero-threejs-react',
    title: 'Architecting an Interactive 3D UFO Hero Scene with Three.js & React',
    excerpt:
      'A deep dive into combining WebGL particle physics, procedural lighting, and React performance optimization for engaging portfolio hero banners.',
    category: 'Engineering',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    tags: ['Three.js', 'WebGL', 'React', 'TypeScript', 'Performance'],
    readTimeMinutes: 6,
    publishedAt: 'February 2026',
    published: true,
    featured: true,
    author: {
      name: 'Maqhawe T Ngwenya',
      role: 'Full Stack & 3D Web Engineer',
    },
    order: 0,
    content: `## Introduction

Creating an immersive first impression is vital for modern portfolios. In this case study, I break down the technical decisions behind designing an interactive 3D UFO flying scene with real-time responsive particle dynamics.

### 1. The Rendering Loop & Frame Budgets
Rather than re-rendering on every React state update, the 3D scene encapsulates its animation loop inside a canvas ref with requestAnimationFrame. This ensures consistent 60 FPS rendering without triggering React reconciliation cycles.

\`\`\`typescript
const animate = () => {
  requestAnimationFrame(animate);
  ufoMesh.rotation.y += 0.008;
  particles.rotation.y -= 0.002;
  renderer.render(scene, camera);
};
\`\`\`

### 2. Geometry & Shader Shading
We utilized custom metallic materials with dynamic point lights orbiting the craft. The light color reacts subtly to cursor movement, delivering a tactile, futuristic visual weight.

### 3. Mobile Performance & Low-Power Fallback
On low-power devices and mobile viewports, particle counts dynamically scale from 2,000 to 500, preserving battery health and eliminating stutter.

### Key Takeaways
- Always detach heavy WebGL loops from standard component states.
- Scale vertex counts dynamically based on device pixel ratios.
- Blend 3D canvases seamlessly into background gradients for clean aesthetics.`,
  },
  {
    id: 'blog-2',
    slug: 'building-high-conversion-ecommerce-apparel',
    title: 'Building islandchild.co.zw: Fast E-Commerce Architecture for Fashion Brands',
    excerpt:
      'How we engineered a responsive online storefront with sub-second page loads, automated inventory management, and intuitive WhatsApp checkout flows.',
    category: 'Case Study',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    tags: ['E-Commerce', 'UI/UX', 'Next.js', 'Tailwind', 'Conversion'],
    readTimeMinutes: 5,
    publishedAt: 'January 2026',
    published: true,
    featured: true,
    author: {
      name: 'Maqhawe T Ngwenya',
      role: 'Full Stack & 3D Web Engineer',
    },
    order: 1,
    content: `## The Challenge

Island Child Apparel needed a modern digital storefront to expand beyond physical boutique sales. The primary objectives were lightning-fast mobile catalog browsing and a frictionless checkout process adapted to regional purchasing habits.

### Technical Architecture
- **Catalog Navigation:** Instant category filtering using client-side pre-indexed state.
- **Image Optimization:** Responsive WebP thumbnails with progressive blur-up placeholders.
- **One-Click Order Routing:** Integrated direct WhatsApp Order Cart generator allowing buyers to dispatch cart summaries with item SKUs directly to sales managers.

### Impact & Results
- **98+ Lighthouse Performance Score** across mobile and desktop devices.
- **45% increase** in catalog browsing session duration.
- **Zero drop-off** caused by complex checkout screens.`,
  },
  {
    id: 'blog-3',
    slug: 'scaling-firestore-rules-and-admin-dashboards',
    title: 'Hardening Cloud Firestore Security Rules for Single-Page Admin Dashboards',
    excerpt:
      'Best practices for securing multi-tenant collections, message inboxes, and realtime analytics without sacrificing frontend agility.',
    category: 'Architecture',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    tags: ['Firebase', 'Security', 'Firestore', 'Backend', 'DevOps'],
    readTimeMinutes: 4,
    publishedAt: 'December 2025',
    published: true,
    featured: false,
    author: {
      name: 'Maqhawe T Ngwenya',
      role: 'Full Stack & 3D Web Engineer',
    },
    order: 2,
    content: `## Securing Serverless Frontend Dashboards

When connecting modern React Single Page Applications directly to Cloud Firestore, security rules become your primary firewall against unauthorized access and malicious writes.

### 1. Strict Token-Based Admin Checks
Instead of allowing arbitrary write operations, write permissions are scoped strictly to verified administrator emails.

\`\`\`firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null && 
                    (request.auth.token.email == "admin@example.com");
    }
  }
}
\`\`\`

### 2. Public Append-Only Ingestion for Contact Inquiries
For public contact forms, we enforce create-only privileges for unauthenticated visitors, while restricting reading and deleting strictly to authorized admin sessions.

### Summary
With granular declarative rules, Firestore eliminates the need for heavyweight intermediary proxy servers while maintaining bank-grade data security.`,
  },
];

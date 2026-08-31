import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Icon } from '@iconify/react';

interface TechItem {
  name: string;
  icon: string;
  color: string;
}

// Row 1 — core languages & frontend
const row1: TechItem[] = [
  { name: 'HTML5',       icon: 'vscode-icons:file-type-html',       color: '#E34F26' },
  { name: 'CSS3',        icon: 'vscode-icons:file-type-css',        color: '#1572B6' },
  { name: 'JavaScript',  icon: 'vscode-icons:file-type-js-official',color: '#F7DF1E' },
  { name: 'React',       icon: 'vscode-icons:file-type-reactjs',    color: '#61DAFB' },
  { name: 'Vite',        icon: 'vscode-icons:file-type-vite',       color: '#646CFF' },
  { name: 'TypeScript',  icon: 'vscode-icons:file-type-typescript-official', color: '#3178C6' },
  { name: 'HTML5',       icon: 'vscode-icons:file-type-html',       color: '#E34F26' },
  { name: 'CSS3',        icon: 'vscode-icons:file-type-css',        color: '#1572B6' },
  { name: 'JavaScript',  icon: 'vscode-icons:file-type-js-official',color: '#F7DF1E' },
  { name: 'React',       icon: 'vscode-icons:file-type-reactjs',    color: '#61DAFB' },
  { name: 'Vite',        icon: 'vscode-icons:file-type-vite',       color: '#646CFF' },
  { name: 'TypeScript',  icon: 'vscode-icons:file-type-typescript-official', color: '#3178C6' },
];

// Row 2 — design & tools (scrolls opposite direction)
const row2: TechItem[] = [
  { name: 'Figma',       icon: 'vscode-icons:file-type-figma',      color: '#F24E1E' },
  { name: 'Git',         icon: 'vscode-icons:file-type-git',        color: '#F05032' },
  { name: 'GitHub',      icon: 'skill-icons:github-dark',           color: '#ffffff' },
  { name: 'VS Code',     icon: 'vscode-icons:file-type-vscode',     color: '#007ACC' },
  { name: 'Node.js',     icon: 'vscode-icons:file-type-node',       color: '#339933' },
  { name: 'Firebase',    icon: 'vscode-icons:file-type-firebase',   color: '#FFCA28' },
  { name: 'Figma',       icon: 'vscode-icons:file-type-figma',      color: '#F24E1E' },
  { name: 'Git',         icon: 'vscode-icons:file-type-git',        color: '#F05032' },
  { name: 'GitHub',      icon: 'skill-icons:github-dark',           color: '#ffffff' },
  { name: 'VS Code',     icon: 'vscode-icons:file-type-vscode',     color: '#007ACC' },
  { name: 'Node.js',     icon: 'vscode-icons:file-type-node',       color: '#339933' },
  { name: 'Firebase',    icon: 'vscode-icons:file-type-firebase',   color: '#FFCA28' },
];

// Row 3 — currently learning
const row3: TechItem[] = [
  { name: 'Supabase',    icon: 'skill-icons:supabase-dark',         color: '#3ECF8E' },
  { name: 'Python',      icon: 'vscode-icons:file-type-python',     color: '#3776AB' },
  { name: 'REST APIs',   icon: 'carbon:api',                        color: '#1A73E8' },
  { name: 'UI/UX',       icon: 'carbon:pen-fountain',               color: '#FF7262' },
  { name: 'Responsive',  icon: 'carbon:devices',                    color: '#10B981' },
  { name: 'Supabase',    icon: 'skill-icons:supabase-dark',         color: '#3ECF8E' },
  { name: 'Python',      icon: 'vscode-icons:file-type-python',     color: '#3776AB' },
  { name: 'REST APIs',   icon: 'carbon:api',                        color: '#1A73E8' },
  { name: 'UI/UX',       icon: 'carbon:pen-fountain',               color: '#FF7262' },
  { name: 'Responsive',  icon: 'carbon:devices',                    color: '#10B981' },
];

export const Skills: React.FC = () => {
  return (
    <StyledSkills id="skills">
      <div className="container skills-header reveal">
        <p className="skills-kicker">What I work with</p>
        <h2>My <span className="accent">Tech Stack</span></h2>
      </div>

      {/* ── Marquee rows ── */}
      <div className="marquee-wrapper">
        {/* Row 1 — left to right */}
        <div className="marquee-track">
          <div className="marquee-inner marquee-ltr" aria-hidden="true">
            {[...row1, ...row1].map((item, i) => (
              <TechPill key={i} item={item} />
            ))}
          </div>
        </div>

        {/* Row 2 — right to left */}
        <div className="marquee-track">
          <div className="marquee-inner marquee-rtl" aria-hidden="true">
            {[...row2, ...row2].map((item, i) => (
              <TechPill key={i} item={item} />
            ))}
          </div>
        </div>

        {/* Row 3 — left to right, slower */}
        <div className="marquee-track">
          <div className="marquee-inner marquee-ltr marquee-slow" aria-hidden="true">
            {[...row3, ...row3].map((item, i) => (
              <TechPill key={i} item={item} />
            ))}
          </div>
        </div>
      </div>
    </StyledSkills>
  );
};

const TechPill: React.FC<{ item: TechItem }> = ({ item }) => (
  <span className="tech-pill">
    <Icon icon={item.icon} width={22} height={22} style={{ color: item.color, flexShrink: 0 }} />
    <span className="tech-name" style={{ color: item.color }}>{item.name}</span>
  </span>
);

/* ── Animations ──────────────────────────────────────────────────── */
const scrollLTR = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`;

const scrollRTL = keyframes`
  from { transform: translateX(-50%); }
  to   { transform: translateX(0); }
`;

const StyledSkills = styled.section`
  padding: 40px 0;
  overflow: hidden;

  /* ── Header ─────────────────────────────────────── */
  .skills-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .skills-kicker {
    margin: 0 0 0.4rem;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  h2 {
    margin: 0;
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    color: var(--heading);
  }

  .accent {
    color: var(--accent);
  }

  /* ── Marquee ─────────────────────────────────────── */
  .marquee-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .marquee-track {
    overflow: hidden;
    /* Fade edges */
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 8%,
      black 92%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 8%,
      black 92%,
      transparent 100%
    );
  }

  .marquee-inner {
    display: flex;
    gap: 0.75rem;
    width: max-content;
    will-change: transform;
  }

  .marquee-ltr {
    animation: ${scrollLTR} 28s linear infinite;
  }

  .marquee-rtl {
    animation: ${scrollRTL} 32s linear infinite;
  }

  .marquee-slow {
    animation-duration: 40s;
  }

  .marquee-track:hover .marquee-inner {
    animation-play-state: paused;
  }

  /* ── Pills ───────────────────────────────────────── */
  .tech-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
    white-space: nowrap;
    cursor: default;
    transition:
      border-color var(--transition),
      background-color var(--transition);

    &:hover {
      background: var(--surface);
      border-color: var(--border-strong);
    }
  }

  .tech-name {
    font-size: 0.85rem;
    font-weight: 600;
    font-family: var(--font-body);
  }

  /* ── Reduced motion ──────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .marquee-inner {
      animation: none !important;
    }

    .marquee-track {
      overflow-x: auto;
    }
  }
`;

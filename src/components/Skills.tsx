import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Icon } from '@iconify/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { defaultTechItems, type TechItem } from '../data/skills';

export const Skills: React.FC = () => {
  const [items, setItems] = useState<TechItem[]>(defaultTechItems);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'skills'));
        const list: TechItem[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as TechItem);
        });
        if (list.length > 0) {
          list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
          setItems(list);
        }
      } catch (err) {
        console.warn('Using default tech items fallback:', err);
      }
    };
    fetchSkills();
  }, []);

  const row1 = items.filter((i) => (i.row ?? 1) === 1);
  const row2 = items.filter((i) => i.row === 2);
  const row3 = items.filter((i) => i.row === 3);

  // If a row has only a few items, repeat to ensure a smooth endless marquee
  const fillRow = (rowItems: TechItem[]) => {
    if (rowItems.length === 0) return [];
    let list = [...rowItems];
    while (list.length < 8) {
      list = [...list, ...rowItems];
    }
    return [...list, ...list];
  };

  const finalRow1 = fillRow(row1.length > 0 ? row1 : defaultTechItems.filter((i) => i.row === 1));
  const finalRow2 = fillRow(row2.length > 0 ? row2 : defaultTechItems.filter((i) => i.row === 2));
  const finalRow3 = fillRow(row3.length > 0 ? row3 : defaultTechItems.filter((i) => i.row === 3));

  return (
    <StyledSkills id="skills">
      <div className="container skills-header reveal">
        <p className="skills-kicker">What I work with</p>
        <h2>My <span className="accent">Tech Stack</span></h2>
      </div>

      {/* ── Marquee rows ── */}
      <div className="marquee-wrapper">
        {/* Row 1 — left to right */}
        {finalRow1.length > 0 && (
          <div className="marquee-track">
            <div className="marquee-inner marquee-ltr" aria-hidden="true">
              {finalRow1.map((item, i) => (
                <TechPill key={`${item.id || item.name}-${i}`} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Row 2 — right to left */}
        {finalRow2.length > 0 && (
          <div className="marquee-track">
            <div className="marquee-inner marquee-rtl" aria-hidden="true">
              {finalRow2.map((item, i) => (
                <TechPill key={`${item.id || item.name}-${i}`} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Row 3 — left to right, slower */}
        {finalRow3.length > 0 && (
          <div className="marquee-track">
            <div className="marquee-inner marquee-ltr marquee-slow" aria-hidden="true">
              {finalRow3.map((item, i) => (
                <TechPill key={`${item.id || item.name}-${i}`} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </StyledSkills>
  );
};

const TechPill: React.FC<{ item: TechItem }> = ({ item }) => (
  <span className="tech-pill">
    <Icon icon={item.icon} width={20} height={20} style={{ flexShrink: 0 }} />
    <span className="tech-name">{item.name}</span>
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
    gap: 0.55rem;
    padding: 0.45rem 0.95rem;
    background: var(--surface);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-full);
    white-space: nowrap;
    box-shadow: var(--shadow-sm);
    cursor: default;
    transition: all var(--transition);

    &:hover {
      background: var(--surface-raised);
      border-color: var(--accent);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
  }

  .tech-name {
    font-size: 0.86rem;
    font-weight: 600;
    font-family: var(--font-body);
    color: var(--text-primary);
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

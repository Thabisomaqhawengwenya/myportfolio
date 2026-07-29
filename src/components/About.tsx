import React from 'react';
import styled from 'styled-components';

export const About: React.FC = () => {
  return (
    <StyledAbout className="section" id="about">
      <div className="container about-grid">

        {/* ── Left: image ── */}
        <div className="about-image-wrap" aria-hidden="true">
          <img
            src="/images/workspace.webp"
            alt="Developer workspace"
            className="about-image"
            width="600"
            height="480"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* ── Right: copy ── */}
        <div className="about-copy reveal is-visible">
          <p className="about-kicker">
            <span className="kicker-arrow">›</span> About me
          </p>
          <h2>Who Am I</h2>

          <p className="about-body">
            I am a student developer focused on building websites and applications that feel
            modern, clean, and reliable. I enjoy turning ideas into practical projects that
            balance clear structure with thoughtful design and continuous improvement. From
            building interfaces to developing core logic, I focus on clarity, usability, and
            the small details that make a project feel intentional.
          </p>

          <a
            className="btn btn-primary about-cv-btn"
            href="/Maqhawe_CV.pdf"
            download="Maqhawe_CV.pdf"
          >
            Download CV
          </a>
        </div>

      </div>
    </StyledAbout>
  );
};

const StyledAbout = styled.section`
  padding: 80px 0;

  .about-grid {
    display: grid;
    grid-template-columns: 0.85fr 1.15fr;
    gap: 4rem;
    align-items: center;
  }

  /* ── Image column ──────────────────────────────────── */
  .about-image-wrap {
    position: relative;
    min-height: 480px;
    overflow: hidden;
    border-radius: var(--radius-lg);
  }

  .about-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }

  /* ── Copy column ───────────────────────────────────── */
  .about-copy {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.25rem;
  }

  .about-kicker {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--accent);
    text-transform: none;
  }

  .kicker-arrow {
    font-size: 1rem;
    line-height: 1;
    color: var(--accent);
  }

  h2 {
    margin: 0;
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 700;
    color: var(--heading);
    line-height: 1.1;
  }

  .about-body {
    margin: 0;
    font-size: 1rem;
    line-height: 1.75;
    color: var(--text-muted);
  }

  /* ── Skills pill grid ──────────────────────────────── */
  .about-skills {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;

    li {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.45rem 0.85rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-secondary);
      transition: border-color var(--transition), color var(--transition);

      &::before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--accent);
        flex-shrink: 0;
      }

      &:hover {
        border-color: var(--accent);
        color: var(--text-primary);
      }
    }
  }

  /* ── CV button ─────────────────────────────────────── */
  .about-cv-btn {
    align-self: flex-start;
    margin-top: 0.25rem;
    padding: 0.65rem 1.5rem;
    background: var(--accent);
    color: #fff;
    border: 1px solid var(--accent);
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    transition:
      background-color var(--transition),
      box-shadow var(--transition),
      transform var(--transition);

    &:hover,
    &:focus-visible {
      background: var(--accent-hover);
      border-color: var(--accent-hover);
      box-shadow: 0 4px 14px rgba(26, 115, 232, 0.35);
      transform: translateY(-1px);
    }
  }

  /* ── Responsive ────────────────────────────────────── */
  @media (max-width: 860px) {
    .about-grid {
      grid-template-columns: 1fr;
    }

    .about-image-wrap {
      min-height: 320px;
    }
  }

  @media (max-width: 560px) {
    .about-copy {
      padding: 2rem 1.5rem;
    }

    .about-skills {
      grid-template-columns: repeat(2, 1fr);
    }

    .about-image-wrap {
      min-height: 260px;
    }
  }
`;

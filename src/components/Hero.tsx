import React, { lazy, Suspense } from 'react';
import styled from 'styled-components';

// Lazy-load Three.js — it's ~700KB and not needed for first paint
const UfoCanvas = lazy(() =>
  import('./UfoCanvas').then((m) => ({ default: m.UfoCanvas }))
);

export const Hero: React.FC = () => {
  const handleGetInTouch = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <StyledHero className="hero section" id="home" aria-labelledby="hero-title">
      <div className="container hero-layout">
        <div className="hero-copy reveal is-visible">
          <p className="hero-kicker">creative developer portfolio</p>
          <h2 className="hero-title-top">
            <span className="hero-title-muted">Hey!,</span>
            <span className="hero-title-accent">I am</span>
          </h2>
          <h1 id="hero-title" className="hero-main-title">MAQHAWE</h1>
          <p className="hero-role">Full-Stack Developer</p>
          <p className="hero-description">
            I craft beautiful, functional digital experiences that bring ideas to life. Specializing in modern web
            development with clean code, strong UI decisions, and a polished presentation style.
          </p>

          <div className="hero-actions">
            <a className="btn btn-primary" href="#contact" onClick={handleGetInTouch}>
              Get In Touch
            </a>
          </div>
        </div>

        <div className="hero-visual hero-ufo-visual reveal is-visible" aria-hidden="true">
          <Suspense fallback={<div className="ufo-placeholder" aria-hidden="true" />}>
            <UfoCanvas />
          </Suspense>
        </div>
      </div>

      <div className="hero-glow hero-glow-left" aria-hidden="true" />
      <div className="hero-glow hero-glow-right" aria-hidden="true" />
    </StyledHero>
  );
};

const StyledHero = styled.section`
  position: relative;
  padding: 2rem 0 1.75rem;
  overflow: hidden;

  .hero-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
    align-items: center;
    gap: clamp(2rem, 5vw, 4rem);
  }

  .hero-copy {
    position: relative;
    max-width: 760px;
    z-index: 1;
  }

  .hero-kicker {
    margin: 0 0 0.8rem;
    color: var(--brand-color);
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .hero-title-top {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    align-items: baseline;
    margin: 0;
    max-width: 11ch;
    font-size: clamp(2.5rem, 4.8vw, 4.4rem);
    font-weight: 800;
    line-height: 1.05;
    text-shadow:
      0 0 10px rgba(255, 255, 255, 0.05),
      0 0 26px rgba(0, 0, 244, 0.28);
  }

  .hero-main-title {
    margin: 0.2rem 0 0;
    max-width: 11ch;
    font-size: clamp(3.2rem, 6vw, 5.8rem);
    font-weight: 800;
    line-height: 1.05;
    color: var(--heading);
    display: flex;
    align-items: center;
    text-shadow:
      0 0 10px rgba(255, 255, 255, 0.05),
      0 0 26px rgba(0, 0, 244, 0.28);
  }

  .hero-title-muted {
    color: var(--heading-muted);
  }

  .hero-title-accent {
    color: var(--hero-accent);
    text-shadow: 0 0 22px var(--hero-accent-glow);
  }

  .hero-role {
    margin: 1rem 0 0;
    font-size: clamp(1.45rem, 3.2vw, 2.2rem);
    font-weight: 700;
    text-shadow: 0 0 18px rgba(0, 0, 244, 0.24);
  }

  .hero-description {
    max-width: 720px;
    margin: 1.25rem 0 0;
    color: var(--muted);
    font-size: clamp(1rem, 1.55vw, 1.08rem);
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.95rem;
    margin-top: 2rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 10.5rem;
    padding: 0.8rem 1.35rem;
    border-radius: 999px;
    border: 1px solid transparent;
    font-size: 0.94rem;
    font-weight: 600;
    transition:
      transform var(--transition),
      box-shadow var(--transition),
      background-color var(--transition),
      border-color var(--transition);
  }

  .btn:hover,
  .btn:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  }

  .btn-primary {
    background: var(--accent);
    color: #fff;
    box-shadow: none;
  }

  .btn-secondary {
    border-color: var(--border-strong);
    background: transparent;
    color: var(--button-secondary-text);
    box-shadow: none;
  }

  .btn-primary:hover,
  .btn-primary:focus-visible {
    background: var(--accent-hover);
    box-shadow: 0 4px 18px rgba(26, 115, 232, 0.40);
  }

  .btn-secondary:hover,
  .btn-secondary:focus-visible {
    border-color: var(--accent);
    color: var(--accent);
    box-shadow: none;
  }

  .hero-glow {
    position: absolute;
    width: 16rem;
    height: 16rem;
    border-radius: 50%;
    background: var(--accent-strong);
    filter: blur(72px);
    pointer-events: none;
    animation: pulseGlow 7s ease-in-out infinite alternate;
  }

  .hero-glow-left {
    left: 6%;
    top: 2rem;
  }

  .hero-glow-right {
    right: 6%;
    top: 3rem;
  }

  .hero-visual {
    position: relative;
    display: grid;
    place-items: center;
    min-height: clamp(380px, 42vw, 620px);
    align-self: stretch;
  }

  /* Shown while Three.js chunk is loading */
  .ufo-placeholder {
    width: 100%;
    height: 100%;
    min-height: clamp(380px, 42vw, 620px);
  }

  @media (max-width: 960px) {
    .hero-layout {
      grid-template-columns: 1fr;
    }

    .hero {
      padding-top: 5rem;
    }

    .hero-copy {
      max-width: 100%;
    }

    .hero-title-top,
    .hero-main-title,
    .hero-description {
      max-width: 100%;
    }

    .hero-visual {
      order: -1;
      min-height: 360px;
    }
  }

  @media (max-width: 760px) {
    .hero {
      padding-top: 4.7rem;
    }

    .hero-copy {
      text-align: center;
    }

    .hero-title-top,
    .hero-main-title {
      margin-inline: auto;
    }

    .hero-title-top {
      justify-content: center;
    }

    .hero-description {
      margin-inline: auto;
    }

    .hero-actions {
      justify-content: center;
    }
  }

  @media (max-width: 560px) {
    .hero-actions .btn {
      width: 100%;
    }
  }
`;

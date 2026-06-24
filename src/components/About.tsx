import React from 'react';
import styled from 'styled-components';

export const About: React.FC = () => {
  return (
    <StyledAbout className="section" id="about">
      <div className="container section-header reveal is-visible">
        <h2>About Me</h2>
      </div>

      <div className="container about-grid">
        <div className="about-copy reveal is-visible">
          <p>
            I am a student developer focused on building websites and applications that feel modern, clean, and
            reliable. I enjoy turning ideas into practical projects that balance clear structure with thoughtful
            design and continuous improvement.
          </p>
          <p>
            From building interfaces to developing core logic, I focus on clarity, usability, and the small
            details that make a project feel intentional. I aim to create work that looks clean and performs
            reliably across different devices and environments.
          </p>
        </div>

        <div className="about-visual reveal is-visible" aria-hidden="true">
          <div className="about-artwork">
            <img className="about-image about-image-coder" src="/images/about-coder.png" alt="" />
          </div>
        </div>
      </div>
    </StyledAbout>
  );
};

const StyledAbout = styled.section`
  .section-header {
    margin-bottom: 1.35rem;

    h2 {
      margin: 0;
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 700;
      text-shadow: 0 0 18px rgba(0, 0, 244, 0.18);
    }
  }

  .about-grid {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 2rem;
    align-items: center;
  }

  .about-copy p {
    margin: 0 0 1rem;
    color: var(--muted);
    font-size: 0.95rem;
  }

  .about-visual {
    position: relative;
    min-height: 420px;
  }

  .about-artwork {
    position: relative;
    width: 100%;
    min-height: 400px;
  }

  .about-image {
    position: absolute;
    display: block;
    object-fit: cover;
    border: 1px solid rgba(0, 0, 244, 0.22);
    box-shadow:
      var(--shadow),
      0 0 42px rgba(0, 0, 244, 0.18);
    transition:
      transform var(--transition),
      box-shadow var(--transition);

    &:hover {
      transform: translateY(-4px) scale(1.01);
      box-shadow:
        var(--shadow),
        0 0 56px rgba(0, 0, 244, 0.24);
    }
  }

  .about-image-coder {
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 28px;
    transform: none;
    z-index: 2;
    object-position: center;
  }

  @media (max-width: 960px) {
    .about-grid {
      grid-template-columns: 1fr;
    }

    .about-visual {
      min-height: 360px;
    }

    .about-artwork {
      min-height: 340px;
    }
  }

  @media (max-width: 560px) {
    .about-visual {
      min-height: 300px;
    }

    .about-artwork {
      min-height: 280px;
    }
  }
`;

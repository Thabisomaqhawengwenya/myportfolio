import React from 'react';
import styled from 'styled-components';

export const Skills: React.FC = () => {
  return (
    <StyledSkills className="section" id="skills">
      <div className="container section-header reveal is-visible">
        <h2>Skills &amp; Technologies</h2>
      </div>

      <div className="container skills-grid">
        <article className="skill-card reveal is-visible">
          <h3>Frontend</h3>
          <ul className="skill-list">
            <li>HTML5</li>
            <li>CSS3</li>
            <li>JavaScript</li>
            <li>Responsive UI</li>
          </ul>
        </article>

        <article className="skill-card reveal is-visible">
          <h3>Backend</h3>
          <ul className="skill-list">
            <li>Node.js</li>
            <li>Express</li>
            <li>REST APIs</li>
            <li>Database Design</li>
          </ul>
        </article>

        <article className="skill-card reveal is-visible">
          <h3>Developer</h3>
          <ul className="skill-list">
            <li>Git &amp; GitHub</li>
            <li>Deployment</li>
            <li>Debugging</li>
            <li>Problem Solving</li>
          </ul>
        </article>
      </div>
    </StyledSkills>
  );
};

const StyledSkills = styled.section`
  .section-header {
    margin-bottom: 1.35rem;

    h2 {
      margin: 0;
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 700;
      text-shadow: 0 0 18px rgba(0, 0, 244, 0.18);
    }
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }

  .skill-card {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    padding: 1rem;
    box-shadow: var(--shadow);
    transition:
      transform var(--transition),
      border-color var(--transition),
      box-shadow var(--transition);

    &:hover,
    &:focus-within {
      transform: translateY(-4px);
      border-color: rgba(0, 0, 244, 0.55);
      box-shadow:
        var(--shadow),
        0 0 26px rgba(0, 0, 244, 0.18);
    }

    h3 {
      margin: 0 0 0.85rem;
      color: var(--card-heading);
      font-size: 1rem;
    }
  }

  .skill-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.55rem;
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      padding: 0.5rem 0.65rem;
      border: 1px solid rgba(0, 0, 244, 0.6);
      border-radius: 999px;
      background: rgba(0, 0, 244, 0.16);
      color: var(--pill-text);
      font-size: 0.84rem;
      text-align: center;
    }
  }

  @media (max-width: 960px) {
    .skills-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 760px) {
    .skills-grid {
      grid-template-columns: 1fr;
    }
  }
`;

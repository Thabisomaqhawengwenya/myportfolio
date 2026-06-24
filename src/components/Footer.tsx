import React from 'react';
import styled from 'styled-components';

export const Footer: React.FC = () => {
  return (
    <StyledFooter className="site-footer">
      <div className="container footer-shell reveal is-visible">
        <p className="footer-note">@ 2026 Maqhawe, all rights are preserved</p>

        <div className="footer-links" aria-label="Footer links">
          <a href="https://wa.me/263787755074" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a href="https://github.com/" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="mailto:thabisomaqhawengwenya@gmail.com">Email</a>
          <a href="https://www.linkedin.com/in/maqhawe-ngwenya" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </StyledFooter>
  );
};

const StyledFooter = styled.footer`
  padding: 0 0 2rem;

  .footer-shell {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-top: 1.35rem;
    border-top: 1px solid var(--line);
  }

  .footer-note {
    margin: 0;
    color: var(--muted);
    font-size: 0.92rem;
  }

  .footer-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;

    a {
      padding: 0.6rem 0.95rem;
      border: 1px solid rgba(0, 0, 244, 0.42);
      border-radius: 999px;
      background: rgba(0, 0, 244, 0.12);
      color: var(--footer-link-text);
      font-size: 0.85rem;
      transition:
        transform var(--transition),
        background-color var(--transition),
        box-shadow var(--transition);

      &:hover,
      &:focus-visible {
        transform: translateY(-2px);
        background: rgba(0, 0, 244, 0.24);
        box-shadow:
          0 0 18px rgba(0, 0, 244, 0.26),
          0 0 32px rgba(0, 0, 244, 0.12);
      }
    }
  }

  @media (max-width: 960px) {
    .footer-shell {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (max-width: 560px) {
    .footer-links {
      width: 100%;

      a {
        flex: 1 1 calc(50% - 0.75rem);
        text-align: center;
      }
    }
  }
`;

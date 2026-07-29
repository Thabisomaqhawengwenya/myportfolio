import React from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';

export const Footer: React.FC = () => {
  return (
    <StyledFooter className="site-footer">
      <div className="container footer-shell reveal is-visible">
        <p className="footer-note">© 2026 Maqhawe. All rights reserved.</p>

        <div className="footer-links" aria-label="Social links">
          <a
            href="https://wa.me/263787755074"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <Icon icon="logos:whatsapp-icon" width={36} height={36} />
          </a>
          <a
            href="https://github.com/Thabisomaqhawengwenya"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <Icon icon="skill-icons:github-dark" width={36} height={36} />
          </a>
          <a
            href="mailto:thabisomaqhawengwenya@gmail.com"
            aria-label="Email"
          >
            <Icon icon="logos:google-gmail" width={36} height={36} />
          </a>
          <a
            href="https://www.linkedin.com/in/maqhawe-ngwenya"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <Icon icon="logos:linkedin-icon" width={36} height={36} />
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
    font-size: 0.88rem;
  }

  .footer-links {
    display: flex;
    gap: 0.5rem;

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.2rem;
      height: 2.2rem;
      border: none;
      border-radius: 50%;
      background: transparent;
      transition:
        transform var(--transition),
        opacity var(--transition);

      &:hover,
      &:focus-visible {
        transform: translateY(-2px);
        opacity: 0.8;
      }
    }
  }

  @media (max-width: 560px) {
    .footer-shell {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }
`;

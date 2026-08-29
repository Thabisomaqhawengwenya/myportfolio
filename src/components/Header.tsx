import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface HeaderProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('main section[id], header[id]');
    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          threshold: 0.45,
          rootMargin: '-12% 0px -48% 0px',
        }
      );

      sections.forEach((section) => sectionObserver.observe(section));
      return () => {
        sections.forEach((section) => sectionObserver.unobserve(section));
      };
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <StyledHeader className={`site-header ${scrolled || mobileMenuOpen ? 'is-scrolled' : ''}`}>
      <div className="container nav-bar">
        <a className="brand" href="#home" onClick={(e) => handleLinkClick(e, 'home')}>
          <img
            src={theme === 'light' ? '/images/p.logo.dark.png' : '/images/p.logo.light.png'}
            alt="Maqhawe"
            className="brand-logo"
          />
        </a>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="site-nav"
          aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span />
          <span />
        </button>

        <nav
          className={`site-nav ${mobileMenuOpen ? 'is-open' : ''}`}
          id="site-nav"
          aria-label="Primary navigation"
        >
          <a
            href="#home"
            className={activeSection === 'home' ? 'is-active' : ''}
            onClick={(e) => handleLinkClick(e, 'home')}
          >
            Home
          </a>
          <a
            href="#about"
            className={activeSection === 'about' ? 'is-active' : ''}
            onClick={(e) => handleLinkClick(e, 'about')}
          >
            About
          </a>
          <a
            href="#projects"
            className={activeSection === 'projects' ? 'is-active' : ''}
            onClick={(e) => handleLinkClick(e, 'projects')}
          >
            Projects
          </a>
          <a
            href="#contact"
            className={activeSection === 'contact' ? 'is-active' : ''}
            onClick={(e) => handleLinkClick(e, 'contact')}
          >
            Contact
          </a>

          <button
            className="theme-toggle"
            id="theme-toggle"
            type="button"
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            aria-pressed={theme === 'light'}
            onClick={toggleTheme}
          >
            <span className="theme-toggle-label theme-toggle-label-light">Light</span>
            <span className="theme-toggle-track" aria-hidden="true">
              <span className="theme-toggle-thumb" />
              <span className="theme-toggle-dot theme-toggle-dot-one" />
              <span className="theme-toggle-dot theme-toggle-dot-two" />
            </span>
            <span className="theme-toggle-label theme-toggle-label-dark">Dark</span>
          </button>
        </nav>
      </div>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-bottom: 1px solid transparent;
  transition:
    background-color 300ms ease,
    border-color 300ms ease,
    box-shadow 300ms ease;

  &.is-scrolled {
    background: var(--header-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--line);
    box-shadow: 0 1px 24px rgba(0,0,0,0.18);
  }

  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.15rem 0;
  }

  .brand {
    display: flex;
    align-items: center;
  }

  .brand-logo {
    height: 36px;
    width: auto;
    display: block;
    transition: transform var(--transition);
  }

  .brand:hover .brand-logo {
    transform: scale(1.04);
  }

  .site-nav {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    a {
      color: var(--muted);
      font-size: 0.9rem;
      transition: color var(--transition);

      &:hover,
      &:focus-visible,
      &.is-active {
        color: var(--nav-active);
      }
    }
  }

  .theme-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 0.25rem;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    flex-shrink: 0;
  }

  .theme-toggle-label {
    font-size: 0.8rem;
    font-weight: 600;
    transition: color var(--transition), opacity var(--transition);
  }

  .theme-toggle-track {
    position: relative;
    width: 3.7rem;
    height: 2rem;
    border-radius: 999px;
    background: var(--toggle-track-bg);
    box-shadow: var(--toggle-track-shadow);
  }

  .theme-toggle-thumb {
    position: absolute;
    top: 0.22rem;
    left: 0.22rem;
    width: 1.56rem;
    height: 1.56rem;
    border-radius: 50%;
    background: var(--toggle-thumb-bg);
    box-shadow: var(--toggle-thumb-shadow);
    transition:
      transform 260ms ease,
      background-color var(--transition);
  }

  .theme-toggle-dot {
    position: absolute;
    right: 0.92rem;
    border-radius: 50%;
    background: var(--toggle-dot-bg);
    transition: transform 260ms ease, opacity var(--transition);
  }

  .theme-toggle-dot-one {
    top: 0.45rem;
    width: 0.34rem;
    height: 0.34rem;
  }

  .theme-toggle-dot-two {
    top: 0.9rem;
    right: 1.34rem;
    width: 0.16rem;
    height: 0.16rem;
  }

  .theme-toggle[aria-pressed="true"] .theme-toggle-label-light,
  .theme-toggle[aria-pressed="false"] .theme-toggle-label-dark {
    color: var(--toggle-label-active);
  }

  .theme-toggle[aria-pressed="true"] .theme-toggle-label-dark,
  .theme-toggle[aria-pressed="false"] .theme-toggle-label-light {
    color: var(--toggle-label-inactive);
  }

  .theme-toggle[aria-pressed="false"] .theme-toggle-thumb {
    transform: translateX(1.7rem);
  }

  .theme-toggle[aria-pressed="false"] .theme-toggle-dot {
    transform: translateX(-1.56rem);
  }

  .nav-toggle {
    display: none;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 0.35rem;
    width: 2.8rem;
    height: 2.8rem;
    border: 1px solid var(--line);
    border-radius: 50%;
    background: var(--panel);
    cursor: pointer;

    span {
      width: 1rem;
      height: 2px;
      background: var(--nav-toggle-bar);
      transition: transform var(--transition), opacity var(--transition);
    }

    &[aria-expanded="true"] span:first-child {
      transform: translateY(4px) rotate(45deg);
    }

    &[aria-expanded="true"] span:last-child {
      transform: translateY(-4px) rotate(-45deg);
    }
  }

  @media (max-width: 760px) {
    .nav-toggle {
      display: inline-flex;
    }

    .site-nav {
      position: absolute;
      top: calc(100% + 0.55rem);
      right: 1rem;
      left: 1rem;
      display: grid;
      gap: 0.2rem;
      padding: 0.6rem;
      background: var(--header-mobile-bg);
      border: 1px solid var(--line);
      border-radius: 18px;
      box-shadow: var(--shadow);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-6px);
      pointer-events: none;
      transition:
        opacity var(--transition),
        visibility var(--transition),
        transform var(--transition);

      &.is-open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
        pointer-events: auto;
      }
    }

    .theme-toggle {
      justify-content: center;
      margin: 0.35rem 0 0;
      padding-top: 0.35rem;
    }
  }
`;

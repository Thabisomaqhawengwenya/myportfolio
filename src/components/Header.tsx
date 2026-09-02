import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ThemeSwitch } from './ThemeSwitch';

interface HeaderProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
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

          <ThemeSwitch theme={theme} setTheme={setTheme} />
        </nav>
      </div>

      <div className="scroll-progress-container" aria-hidden="true">
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
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

    .theme-switch-wrapper {
      margin-left: 0.35rem;
      flex-shrink: 0;
    }
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
      gap: 0.4rem;
      padding: 0.8rem;
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

      .theme-switch-wrapper {
        margin: 0.5rem auto 0.2rem;
      }
    }
  }

  .scroll-progress-container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: transparent;
    overflow: hidden;
  }

  .scroll-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--accent) 0%, var(--hero-accent) 100%);
    width: 0%;
    transition: width 80ms ease-out;
  }
`;

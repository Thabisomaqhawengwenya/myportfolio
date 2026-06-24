import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 420);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <StyledButton
      className={`back-to-top ${visible ? 'is-visible' : ''}`}
      type="button"
      aria-label="Back to top"
      onClick={scrollToTop}
    >
      Top
    </StyledButton>
  );
};

const StyledButton = styled.button`
  position: fixed;
  z-index: 30;
  right: 1.25rem;
  bottom: 1.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border: 1px solid rgba(0, 0, 244, 0.85);
  border-radius: 50%;
  background: var(--back-to-top-bg);
  color: var(--back-to-top-text);
  box-shadow:
    0 0 18px rgba(0, 0, 244, 0.22),
    0 0 36px rgba(0, 0, 244, 0.14);
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition:
    opacity var(--transition),
    visibility var(--transition),
    transform var(--transition);

  &.is-visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

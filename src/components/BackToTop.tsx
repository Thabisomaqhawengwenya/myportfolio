import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';

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
      title="Back to top"
    >
      <Icon icon="lucide:arrow-up" width={20} height={20} />
    </StyledButton>
  );
};

const StyledButton = styled.button`
  position: fixed;
  z-index: 30;
  right: 1.5rem;
  bottom: 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.85rem;
  height: 2.85rem;
  border: 1px solid var(--border-strong);
  border-radius: 50%;
  background: var(--back-to-top-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--back-to-top-text);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transform: translateY(12px);
  transition: all var(--transition);

  &:hover {
    transform: translateY(-2px);
    border-color: var(--accent);
    color: var(--accent);
    box-shadow: var(--shadow-lg);
  }

  &.is-visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING EXPERIENCE...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 4000ms total / 100 steps = 40ms per step
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 25) {
      setStatusText('INITIALIZING EXPERIENCE...');
    } else if (progress < 50) {
      setStatusText('LOADING CREATIVE ASSETS...');
    } else if (progress < 75) {
      setStatusText('ASSEMBLING 3D ENVIRONMENT...');
    } else if (progress < 100) {
      setStatusText('OPTIMIZING PERFORMANCE...');
    } else {
      setStatusText('WELCOME!');
      
      // Start exit animation after reaching 100%
      const fadeTimeout = setTimeout(() => {
        setIsFadingOut(true);
      }, 300);

      // Call onComplete after exit animation finishes (800ms transition)
      const completeTimeout = setTimeout(() => {
        onComplete();
      }, 1100);

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(completeTimeout);
      };
    }
  }, [progress, onComplete]);

  return (
    <LoaderContainer className={isFadingOut ? 'fade-out' : ''}>
      <LoaderGlow />
      <LoaderContent>
        <LogoText>MAQHAWE</LogoText>
        
        <ProgressCircleWrapper>
          <ProgressCircleSvg viewBox="0 0 100 100">
            <circle className="bg-circle" cx="50" cy="50" r="45" />
            <circle
              className="fg-circle"
              cx="50"
              cy="50"
              r="45"
              style={{
                strokeDashoffset: 282.7 - (282.7 * progress) / 100,
              }}
            />
          </ProgressCircleSvg>
          <ProgressNumber>{progress}%</ProgressNumber>
        </ProgressCircleWrapper>

        <StatusText>{statusText}</StatusText>
        
        <ProgressBarContainer>
          <ProgressBarFill style={{ width: `${progress}%` }} />
        </ProgressBarContainer>
      </LoaderContent>
    </LoaderContainer>
  );
};

// Keyframes
const pulse = keyframes`
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.75;
    transform: scale(1.1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const textFloat = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;

// Styled Components
const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #070b13;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  overflow: hidden;
  transition: opacity 800ms cubic-bezier(0.77, 0, 0.175, 1), transform 800ms cubic-bezier(0.77, 0, 0.175, 1);
  opacity: 1;

  &.fade-out {
    opacity: 0;
    transform: translateY(-40px);
    pointer-events: none;
  }
`;

const LoaderGlow = styled.div`
  position: absolute;
  width: 50vw;
  height: 50vw;
  max-width: 600px;
  max-height: 600px;
  background: radial-gradient(circle, rgba(26, 115, 232, 0.15) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: ${pulse} 4s ease-in-out infinite;
`;

const LoaderContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
`;

const LogoText = styled.h1`
  font-family: var(--font-heading);
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 800;
  letter-spacing: 0.35em;
  color: #f8fafc;
  text-shadow: 0 0 24px rgba(26, 115, 232, 0.55);
  margin-bottom: 2.5rem;
  animation: ${textFloat} 5s ease-in-out infinite;
  background: linear-gradient(90deg, #f8fafc 0%, #cbd5e1 50%, #f8fafc 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmer} 6s linear infinite, ${textFloat} 5s ease-in-out infinite;
`;

const ProgressCircleWrapper = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  margin-bottom: 2rem;
`;

const ProgressCircleSvg = styled.svg`
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);

  circle {
    fill: none;
    stroke-width: 4px;
  }

  .bg-circle {
    stroke: rgba(255, 255, 255, 0.03);
  }

  .fg-circle {
    stroke: #1a73e8;
    stroke-linecap: round;
    stroke-dasharray: 282.7; /* 2 * PI * r (r=45) */
    transition: stroke-dashoffset 40ms linear;
    filter: drop-shadow(0 0 8px rgba(26, 115, 232, 0.6));
  }
`;

const ProgressNumber = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: -0.02em;
`;

const StatusText = styled.p`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  height: 1.2rem;
  transition: color 0.3s ease;
`;

const ProgressBarContainer = styled.div`
  width: 260px;
  height: 3px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #1a73e8, #57dcff);
  border-radius: 4px;
  transition: width 40ms linear;
  box-shadow: 0 0 8px rgba(87, 220, 255, 0.5);
`;

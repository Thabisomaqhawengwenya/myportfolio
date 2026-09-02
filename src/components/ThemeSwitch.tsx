import React from 'react';
import styled from 'styled-components';

interface ThemeSwitchProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ theme, setTheme }) => {
  const isLight = theme === 'light';

  const handleToggle = () => {
    setTheme(isLight ? 'dark' : 'light');
  };

  return (
    <StyledWrapper className="theme-switch-wrapper" title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
      <div className="wrapper">
        <input
          type="checkbox"
          name="theme-checkbox"
          id="theme-checkbox"
          className="switch"
          checked={isLight}
          onChange={handleToggle}
          aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
        />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 86px;
  height: 36px;
  position: relative;

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scale(0.64);
    transform-origin: center center;
  }

  .switch {
    position: relative;
    width: 130px;
    height: 50px;
    margin: 0px;
    appearance: none;
    -webkit-appearance: none;
    background-color: rgb(4, 52, 73);
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 25px;
    transition: background-color 0.7s ease-in-out;
    outline: none;
    cursor: pointer;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
  }

  .switch:checked {
    background-color: rgb(0, 195, 255);
    background-size: cover;
    transition: background-color 0.7s ease-in-out;
  }

  .switch:after {
    content: '';
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background-color: #fff;
    position: absolute;
    left: 2px;
    top: 2px;
    transform: translateX(0px);
    animation: off 0.7s forwards cubic-bezier(0.8, 0.5, 0.2, 1.4);
    box-shadow: inset 5px -5px 4px rgba(53, 53, 53, 0.3);
  }

  @keyframes off {
    0% {
      transform: translateX(80px);
      width: 46px;
    }

    50% {
      width: 75px;
      border-radius: 25px;
    }

    100% {
      transform: translateX(0px);
      width: 46px;
    }
  }

  .switch:checked:after {
    animation: on 0.7s forwards cubic-bezier(0.8, 0.5, 0.2, 1.4);
    box-shadow: inset -5px -5px 4px rgba(53, 53, 53, 0.3);
  }

  @keyframes on {
    0% {
      transform: translateX(0px);
      width: 46px;
    }

    50% {
      width: 75px;
      border-radius: 25px;
    }

    100% {
      transform: translateX(80px);
      width: 46px;
    }
  }

  .switch:checked:before {
    content: '';
    width: 15px;
    height: 15px;
    border-radius: 50%;
    position: absolute;
    left: 15px;
    top: 5px;
    transform-origin: 53px 10px;
    background-color: transparent;
    box-shadow: 5px -1px 0px #fff;
    filter: blur(0px);
    animation: sun 0.7s forwards ease;
  }

  @keyframes sun {
    0% {
      transform: rotate(170deg);
      background-color: transparent;
      box-shadow: 5px -1px 0px #fff;
      filter: blur(0px);
    }

    50% {
      background-color: transparent;
      box-shadow: 5px -1px 0px #fff;
      filter: blur(0px);
    }

    90% {
      background-color: #f5daaa;
      box-shadow:
        0px 0px 10px #f5deb4,
        0px 0px 20px #f5deb4,
        0px 0px 30px #f5deb4,
        inset 0px 0px 2px #efd3a3;
      filter: blur(1px);
    }

    100% {
      transform: rotate(0deg);
      background-color: #f5daaa;
      box-shadow:
        0px 0px 10px #f5deb4,
        0px 0px 20px #f5deb4,
        0px 0px 30px #f5deb4,
        inset 0px 0px 2px #efd3a3;
      filter: blur(1px);
    }
  }

  .switch:before {
    content: '';
    width: 15px;
    height: 15px;
    border-radius: 50%;
    position: absolute;
    left: 15px;
    top: 5px;
    filter: blur(1px);
    background-color: #f5daaa;
    box-shadow:
      0px 0px 10px #f5deb4,
      0px 0px 20px #f5deb4,
      0px 0px 30px #f5deb4,
      inset 0px 0px 2px #efd3a3;
    transform-origin: 53px 10px;
    animation: moon 0.7s forwards ease;
  }

  @keyframes moon {
    0% {
      transform: rotate(0deg);
      filter: blur(1px);
    }

    50% {
      filter: blur(1px);
    }

    90% {
      background-color: transparent;
      box-shadow: 5px -1px 0px #fff;
      filter: blur(0px);
    }

    100% {
      transform: rotate(170deg);
      background-color: transparent;
      box-shadow: 5px -1px 0px #fff;
      filter: blur(0px);
    }
  }
`;

export default ThemeSwitch;

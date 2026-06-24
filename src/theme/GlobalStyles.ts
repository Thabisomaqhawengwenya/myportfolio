import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    color-scheme: dark;
    --bg: #020409;
    --bg-elevated: #070b12;
    --panel: #0b1018;
    --panel-strong: #0f1520;
    --panel-soft: #0c121b;
    --text: #f5f7fb;
    --muted: #9aa4b3;
    --accent: #0000f4;
    --accent-soft: rgba(0, 0, 244, 0.32);
    --accent-strong: rgba(0, 0, 244, 0.7);
    --accent-glow-sm: 0 0 16px rgba(0, 0, 244, 0.42);
    --accent-glow-md: 0 0 32px rgba(0, 0, 244, 0.55);
    --accent-glow-lg: 0 0 54px rgba(0, 0, 244, 0.68);
    --line: rgba(255, 255, 255, 0.09);
    --line-strong: rgba(255, 255, 255, 0.15);
    --shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
    --radius-lg: 22px;
    --radius-md: 16px;
    --radius-sm: 12px;
    --container: min(1120px, calc(100% - 2rem));
    --transition: 240ms ease;
    --font-body: "Poppins", "Segoe UI", sans-serif;
    --page-glow-one: rgba(0, 0, 244, 0.22);
    --page-glow-two: rgba(0, 0, 244, 0.12);
    --background-video-opacity: 0.92;
    --background-video-filter: brightness(0.58) saturate(1.08) contrast(1.08);
    --background-video-overlay:
      radial-gradient(circle at top left, rgba(0, 0, 244, 0.18), transparent 30rem),
      radial-gradient(circle at bottom right, rgba(0, 0, 244, 0.12), transparent 28rem),
      rgba(2, 4, 9, 0.42);
    --frame-glow: rgba(0, 0, 244, 0.24);
    --header-bg: rgba(2, 4, 9, 0.84);
    --header-mobile-bg: rgba(7, 11, 18, 0.98);
    --brand-color: #8ea0be;
    --nav-active: #ffffff;
    --nav-toggle-bar: #ffffff;
    --heading: #ffffff;
    --heading-muted: #c6cfdd;
    --hero-accent: #57dcff;
    --hero-accent-glow: rgba(87, 220, 255, 0.34);
    --button-secondary-text: #d7deea;
    --card-heading: #dce4f0;
    --pill-text: #c6d2e2;
    --timeline-line: rgba(255, 255, 255, 0.1);
    --project-media-bg: #0a1019;
    --project-tag-text: #ccd7e7;
    --project-link-color: #e7edf7;
    --project-filter-bg: #232f45;
    --project-filter-text: #eef4ff;
    --project-filter-active-bg: #f4f6fb;
    --project-filter-active-text: #13233d;
    --project-filter-count-bg: rgba(255, 255, 255, 0.12);
    --project-filter-active-count-bg: rgba(24, 36, 60, 0.14);
    --input-bg: #050810;
    --input-text: #ffffff;
    --input-placeholder: #7f8a9a;
    --input-focus-border: #405372;
    --form-status-success: #9fd6ff;
    --form-status-error: #ffb0b0;
    --contact-list-text: #d7deea;
    --footer-link-text: #dfe6f5;
    --modal-backdrop: rgba(2, 4, 9, 0.78);
    --modal-kicker: #99a9d7;
    --modal-media-bg: #050913;
    --modal-list-text: #dfe6f5;
    --modal-action-text: #eef3fb;
    --back-to-top-bg: rgba(7, 11, 18, 0.94);
    --back-to-top-text: #ffffff;
    --focus-outline: #0000f4;
    --toggle-label-active: #edf3ff;
    --toggle-label-inactive: #7f8a9a;
    --toggle-track-bg: rgba(114, 148, 255, 0.92);
    --toggle-track-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.14),
      0 10px 26px rgba(0, 0, 244, 0.2);
    --toggle-thumb-bg: #ffffff;
    --toggle-thumb-shadow: 0 6px 18px rgba(15, 25, 46, 0.18);
    --toggle-dot-bg: rgba(255, 255, 255, 0.88);
  }

  :root[data-theme="light"] {
    color-scheme: light;
    --bg: #eef3ff;
    --bg-elevated: #f7faff;
    --panel: #ffffff;
    --panel-strong: #ffffff;
    --panel-soft: #f2f6ff;
    --text: #16243d;
    --muted: #66758d;
    --line: rgba(22, 36, 61, 0.12);
    --line-strong: rgba(22, 36, 61, 0.18);
    --shadow: 0 22px 50px rgba(16, 32, 61, 0.12);
    --page-glow-one: rgba(93, 143, 255, 0.18);
    --page-glow-two: rgba(87, 220, 255, 0.14);
    --background-video-opacity: 0.28;
    --background-video-filter: brightness(1.14) saturate(0.88) contrast(0.94);
    --background-video-overlay:
      radial-gradient(circle at top left, rgba(93, 143, 255, 0.12), transparent 30rem),
      radial-gradient(circle at bottom right, rgba(87, 220, 255, 0.1), transparent 28rem),
      rgba(243, 247, 255, 0.78);
    --frame-glow: rgba(93, 143, 255, 0.17);
    --header-bg: rgba(246, 249, 255, 0.86);
    --header-mobile-bg: rgba(250, 252, 255, 0.98);
    --brand-color: #30476d;
    --nav-active: #1d2e4a;
    --nav-toggle-bar: #1d2e4a;
    --heading: #14243f;
    --heading-muted: #4a6084;
    --hero-accent: #5f8eff;
    --hero-accent-glow: rgba(95, 142, 255, 0.28);
    --button-secondary-text: #24375c;
    --card-heading: #213454;
    --pill-text: #2e4265;
    --timeline-line: rgba(22, 36, 61, 0.16);
    --project-media-bg: #e7edf6;
    --project-tag-text: #30446a;
    --project-link-color: #1f3152;
    --project-filter-bg: #dfe7f6;
    --project-filter-text: #26395c;
    --project-filter-active-bg: #1f3152;
    --project-filter-active-text: #f4f7ff;
    --project-filter-count-bg: rgba(31, 49, 82, 0.12);
    --project-filter-active-count-bg: rgba(255, 255, 255, 0.18);
    --input-bg: #f8fbff;
    --input-text: #15233c;
    --input-placeholder: #7a88a1;
    --input-focus-border: #6d84d7;
    --form-status-success: #2459c3;
    --form-status-error: #b84d4d;
    --contact-list-text: #31476b;
    --footer-link-text: #203355;
    --modal-backdrop: rgba(236, 242, 255, 0.82);
    --modal-kicker: #7082a7;
    --modal-media-bg: #f2f6ff;
    --modal-list-text: #2c4062;
    --modal-action-text: #203355;
    --back-to-top-bg: rgba(255, 255, 255, 0.94);
    --back-to-top-text: #223355;
    --focus-outline: #4e77ff;
    --toggle-label-active: #26395c;
    --toggle-label-inactive: #b5c0d7;
    --toggle-track-bg: rgba(116, 157, 255, 0.88);
    --toggle-track-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.36),
      0 10px 24px rgba(93, 143, 255, 0.2);
    --toggle-thumb-bg: #ffffff;
    --toggle-thumb-shadow: 0 8px 18px rgba(48, 71, 109, 0.16);
    --toggle-dot-bg: rgba(255, 255, 255, 0.92);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    min-height: 100vh;
    font-family: var(--font-body);
    color: var(--text);
    background:
      radial-gradient(circle at top left, var(--page-glow-one), transparent 26rem),
      radial-gradient(circle at top right, var(--page-glow-two), transparent 28rem),
      var(--bg);
    line-height: 1.6;
    overflow-x: hidden;
    transition:
      background-color var(--transition),
      color var(--transition);
  }

  body.modal-open {
    overflow: hidden;
  }

  [hidden] {
    display: none !important;
  }

  .background-video-shell {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .background-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: var(--background-video-opacity);
    filter: var(--background-video-filter);
  }

  .background-video-overlay {
    position: absolute;
    inset: 0;
    background: var(--background-video-overlay);
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  textarea {
    font: inherit;
  }

  button,
  a,
  input,
  textarea {
    -webkit-tap-highlight-color: transparent;
  }

  .skip-link,
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .skip-link:focus {
    position: fixed;
    top: 1rem;
    left: 1rem;
    width: auto;
    height: auto;
    margin: 0;
    clip: auto;
    padding: 0.9rem 1.15rem;
    background: var(--accent);
    color: #fff;
    border-radius: 999px;
    z-index: 100;
  }

  .site-frame {
    position: relative;
    z-index: 1;
    max-width: 1180px;
    min-height: 100vh;
    margin: 0 auto;
    border-left: 1px solid var(--line);
    border-right: 1px solid var(--line);
  }

  .site-frame::before,
  .site-frame::after {
    content: "";
    position: fixed;
    width: 12rem;
    height: 12rem;
    border-radius: 50%;
    background: var(--frame-glow);
    filter: blur(58px);
    z-index: -1;
    pointer-events: none;
  }

  .site-frame::before {
    top: 4rem;
    left: max(1rem, calc(50% - 660px));
  }

  .site-frame::after {
    right: max(1rem, calc(50% - 660px));
    bottom: 8rem;
  }

  .container {
    width: var(--container);
    margin: 0 auto;
  }

  .section {
    padding: 2.5rem 0 0;
  }

  @keyframes pulseGlow {
    from {
      transform: scale(0.98);
      opacity: 0.72;
    }

    to {
      transform: scale(1.06);
      opacity: 1;
    }
  }

  a:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--focus-outline);
    outline-offset: 3px;
  }

  @media (max-width: 560px) {
    .container {
      width: min(100% - 1.1rem, 100%);
    }

    .site-frame {
      border-left: 0;
      border-right: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }

    .background-video {
      display: none;
    }

    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* ── Dark theme (default) ─────────────────────────────────────── */
  :root {
    color-scheme: dark;

    /* Surfaces */
    --bg:             #0B0F19;
    --bg-elevated:    #0F1420;
    --surface:        #111827;
    --surface-raised: #1A2233;
    --panel:          #111827;
    --panel-strong:   #1A2233;
    --panel-soft:     #131c2e;

    /* Borders */
    --border:         rgba(255,255,255,0.08);
    --border-strong:  rgba(255,255,255,0.14);
    --border-accent:  rgba(26,115,232,0.40);
    --line:           rgba(255,255,255,0.08);
    --line-strong:    rgba(255,255,255,0.14);

    /* Text */
    --text:           #F8FAFC;
    --text-primary:   #F8FAFC;
    --text-secondary: #CBD5E1;
    --text-muted:     #94A3B8;
    --text-disabled:  #475569;
    --heading:        #F8FAFC;
    --heading-muted:  #94A3B8;
    --muted:          #94A3B8;

    /* Accent — Blue */
    --accent:         #1A73E8;
    --accent-hover:   #1557B0;
    --accent-soft:    rgba(26,115,232,0.12);
    --accent-subtle:  rgba(26,115,232,0.12);
    --accent-strong:  rgba(26,115,232,0.70);
    --accent-ring:    rgba(26,115,232,0.32);
    --accent-glow-sm: 0 0 16px rgba(26,115,232,0.42);
    --accent-glow-md: 0 0 32px rgba(26,115,232,0.55);
    --accent-glow-lg: 0 0 54px rgba(26,115,232,0.68);

    /* Status */
    --success:        #10B981;
    --success-subtle: rgba(16,185,129,0.12);
    --warning:        #F59E0B;
    --warning-subtle: rgba(245,158,11,0.12);
    --danger:         #EF4444;
    --danger-subtle:  rgba(239,68,68,0.12);

    /* Shadows */
    --shadow-sm:  0 1px 3px rgba(0,0,0,0.4);
    --shadow-md:  0 4px 16px rgba(0,0,0,0.45);
    --shadow-lg:  0 12px 40px rgba(0,0,0,0.52);
    --shadow:     0 4px 16px rgba(0,0,0,0.45);

    /* Radii */
    --radius-xs:   4px;
    --radius-sm:   8px;
    --radius-md:   12px;
    --radius-lg:   16px;
    --radius-xl:   24px;
    --radius-full: 9999px;

    /* Motion */
    --transition-fast: 120ms ease;
    --transition:      200ms ease;
    --transition-slow: 320ms ease;

    /* Layout */
    --container:     min(1120px, calc(100% - 3rem));
    --container-sm:  min(800px,  calc(100% - 3rem));
    --header-height: 64px;

    /* Fonts */
    --font-heading: 'Space Grotesk', 'Segoe UI', system-ui, sans-serif;
    --font-body:    'Inter', 'Segoe UI', system-ui, sans-serif;

    /* Header */
    --header-bg:        rgba(11,15,25,0.88);
    --header-mobile-bg: rgba(11,15,25,0.98);
    --brand-color:      #94A3B8;
    --nav-active:       #F8FAFC;
    --nav-link:         #94A3B8;
    --nav-link-active:  #F8FAFC;
    --nav-toggle-bar:   #F8FAFC;

    /* Badge variants */
    --badge-default-bg:              rgba(255,255,255,0.06);
    --badge-default-text:            #CBD5E1;
    --badge-accent-bg:               rgba(26,115,232,0.12);
    --badge-accent-text:             #7BAEF4;
    --badge-success-bg:              rgba(16,185,129,0.12);
    --badge-success-text:            #6EE7B7;
    --badge-warning-bg:              rgba(245,158,11,0.12);
    --badge-warning-text:            #FCD34D;

    /* Inputs */
    --input-bg:           #111827;
    --input-border:       rgba(255,255,255,0.14);
    --input-text:         #F8FAFC;
    --input-placeholder:  #475569;
    --input-focus-border: #1A73E8;
    --input-focus-ring:   rgba(26,115,232,0.32);

    /* Misc tokens */
    --card-heading:                  #F8FAFC;
    --pill-text:                     #CBD5E1;
    --project-media-bg:              #0D1525;
    --project-tag-text:              #CBD5E1;
    --project-link-color:            #F8FAFC;
    --project-filter-bg:             #1A2233;
    --project-filter-text:           #F8FAFC;
    --project-filter-active-bg:      #1A73E8;
    --project-filter-active-text:    #ffffff;
    --project-filter-count-bg:       rgba(255,255,255,0.08);
    --project-filter-active-count-bg:rgba(255,255,255,0.18);
    --form-status-success:           #93C5FD;
    --form-status-error:             #FCA5A5;
    --contact-list-text:             #CBD5E1;
    --footer-link-text:              #CBD5E1;
    --modal-backdrop:                rgba(7,11,18,0.85);
    --modal-kicker:                  #94A3B8;
    --modal-media-bg:                #0D1525;
    --modal-list-text:               #CBD5E1;
    --modal-action-text:             #F8FAFC;
    --back-to-top-bg:                rgba(26,34,51,0.94);
    --back-to-top-text:              #F8FAFC;
    --button-secondary-text:         #CBD5E1;
    --timeline-line:                 rgba(255,255,255,0.10);
    --focus-outline:                 #1A73E8;

    /* UFO / hero scene tokens */
    --hero-accent:      #57DCFF;
    --hero-accent-glow: rgba(87,220,255,0.28);
    --page-glow-one:    rgba(26,115,232,0.10);
    --page-glow-two:    rgba(26,115,232,0.06);
    --frame-glow:       rgba(26,115,232,0.14);

    /* Background video */
    --background-video-opacity: 0.90;
    --background-video-filter:  brightness(0.48) saturate(1.0) contrast(1.05);
    --background-video-overlay:
      radial-gradient(circle at top left,  rgba(26,115,232,0.10), transparent 28rem),
      radial-gradient(circle at bottom right, rgba(26,115,232,0.06), transparent 26rem),
      rgba(11,15,25,0.52);

    /* Theme toggle */
    --toggle-track-bg:      rgba(26,115,232,0.88);
    --toggle-track-shadow:
      inset 0 0 0 1px rgba(255,255,255,0.08),
      0 4px 12px rgba(26,115,232,0.2);
    --toggle-thumb-bg:      #ffffff;
    --toggle-thumb-shadow:  0 2px 8px rgba(0,0,0,0.3);
    --toggle-dot-bg:        rgba(255,255,255,0.90);
    --toggle-label-active:  #F8FAFC;
    --toggle-label-inactive: #475569;
  }

  /* ── Light theme ──────────────────────────────────────────────── */
  :root[data-theme="light"] {
    color-scheme: light;

    --bg:             #F8FAFC;
    --bg-elevated:    #FFFFFF;
    --surface:        #FFFFFF;
    --surface-raised: #F1F5F9;
    --panel:          #FFFFFF;
    --panel-strong:   #F8FAFC;
    --panel-soft:     #F1F5F9;

    --border:         rgba(15, 23, 42, 0.08);
    --border-strong:  rgba(15, 23, 42, 0.14);
    --border-accent:  rgba(26, 115, 232, 0.40);
    --line:           rgba(15, 23, 42, 0.08);
    --line-strong:    rgba(15, 23, 42, 0.14);

    --text:           #0F172A;
    --text-primary:   #0F172A;
    --text-secondary: #334155;
    --text-muted:     #64748B;
    --text-disabled:  #94A3B8;
    --heading:        #0F172A;
    --heading-muted:  #475569;
    --muted:          #64748B;

    --accent:         #1A73E8;
    --accent-hover:   #1557B0;
    --accent-soft:    rgba(26, 115, 232, 0.08);
    --accent-subtle:  rgba(26, 115, 232, 0.06);
    --accent-strong:  rgba(26, 115, 232, 0.70);
    --accent-ring:    rgba(26, 115, 232, 0.20);
    --accent-glow-sm: 0 0 16px rgba(26, 115, 232, 0.20);
    --accent-glow-md: 0 0 32px rgba(26, 115, 232, 0.28);
    --accent-glow-lg: 0 0 54px rgba(26, 115, 232, 0.38);

    --success:        #059669;
    --success-subtle: rgba(5, 150, 105, 0.08);
    --warning:        #D97706;
    --warning-subtle: rgba(217, 119, 6, 0.08);
    --danger:         #DC2626;
    --danger-subtle:  rgba(220, 38, 38, 0.08);

    --shadow-sm:  0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04);
    --shadow-md:  0 4px 16px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -2px rgba(15, 23, 42, 0.04);
    --shadow-lg:  0 16px 36px -4px rgba(15, 23, 42, 0.10), 0 6px 16px -4px rgba(15, 23, 42, 0.05);
    --shadow:     0 4px 20px -2px rgba(15, 23, 42, 0.08);

    --header-bg:        rgba(248, 250, 252, 0.88);
    --header-mobile-bg: rgba(248, 250, 252, 0.98);
    --brand-color:      #475569;
    --nav-active:       #0F172A;
    --nav-link:         #475569;
    --nav-link-active:  #0F172A;
    --nav-toggle-bar:   #0F172A;

    --badge-default-bg:              #F1F5F9;
    --badge-default-text:            #334155;
    --badge-accent-bg:               rgba(26, 115, 232, 0.08);
    --badge-accent-text:             #1A73E8;
    --badge-success-bg:              rgba(5, 150, 105, 0.08);
    --badge-success-text:            #047857;
    --badge-warning-bg:              rgba(217, 119, 6, 0.08);
    --badge-warning-text:            #92400E;

    --input-bg:           #FFFFFF;
    --input-border:       rgba(15, 23, 42, 0.15);
    --input-text:         #0F172A;
    --input-placeholder:  #94A3B8;
    --input-focus-border: #1A73E8;
    --input-focus-ring:   rgba(26, 115, 232, 0.18);

    --card-heading:                  #0F172A;
    --pill-text:                     #334155;
    --project-media-bg:              #F1F5F9;
    --project-tag-text:              #334155;
    --project-link-color:            #1A73E8;
    --project-filter-bg:             #FFFFFF;
    --project-filter-text:           #475569;
    --project-filter-active-bg:      #1A73E8;
    --project-filter-active-text:    #FFFFFF;
    --project-filter-count-bg:       #F1F5F9;
    --project-filter-active-count-bg:rgba(255, 255, 255, 0.25);
    --form-status-success:           #1A73E8;
    --form-status-error:             #DC2626;
    --contact-list-text:             #334155;
    --footer-link-text:              #475569;
    --modal-backdrop:                rgba(15, 23, 42, 0.60);
    --modal-kicker:                  #64748B;
    --modal-media-bg:                #F1F5F9;
    --modal-list-text:               #334155;
    --modal-action-text:             #0F172A;
    --back-to-top-bg:                rgba(255, 255, 255, 0.95);
    --back-to-top-text:              #0F172A;
    --button-secondary-text:         #334155;
    --timeline-line:                 rgba(15, 23, 42, 0.10);
    --focus-outline:                 #1A73E8;

    --hero-accent:      #1A73E8;
    --hero-accent-glow: rgba(26, 115, 232, 0.20);
    --page-glow-one:    rgba(26, 115, 232, 0.05);
    --page-glow-two:    rgba(26, 115, 232, 0.03);
    --frame-glow:       rgba(26, 115, 232, 0.06);

    --background-video-opacity: 0.06;
    --background-video-filter:  brightness(1.1) saturate(0.5) contrast(0.9);
    --background-video-overlay:
      radial-gradient(circle at top left,  rgba(26, 115, 232, 0.04), transparent 28rem),
      radial-gradient(circle at bottom right, rgba(26, 115, 232, 0.03), transparent 26rem),
      rgba(248, 250, 252, 0.94);

    --toggle-track-bg:      rgba(26, 115, 232, 0.88);
    --toggle-track-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.25),
      0 4px 12px rgba(26, 115, 232, 0.15);
    --toggle-thumb-bg:      #FFFFFF;
    --toggle-thumb-shadow:  0 2px 8px rgba(15, 23, 42, 0.15);
    --toggle-dot-bg:        rgba(255, 255, 255, 0.92);
    --toggle-label-active:  #0F172A;
    --toggle-label-inactive: #94A3B8;
  }

  /* ── Reset ────────────────────────────────────────────────────── */
  *, *::before, *::after { box-sizing: border-box; }

  ::selection {
    background: #1A73E8;
    color: #FFFFFF;
  }

  html {
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    min-height: 100vh;
    font-family: var(--font-body);
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-primary);
    background: var(--bg);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition:
      background-color var(--transition-slow),
      color var(--transition-slow);
  }

  body.modal-open { overflow: hidden; }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: 700;
    line-height: 1.15;
    color: var(--heading);
    letter-spacing: -0.02em;
  }

  p { color: var(--text-secondary); line-height: 1.7; }

  a { color: inherit; text-decoration: none; }

  img, video { display: block; max-width: 100%; }

  button, input, textarea, select { font: inherit; color: inherit; }

  button {
    cursor: pointer;
    border: none;
    background: none;
    -webkit-tap-highlight-color: transparent;
  }

  a, input, textarea { -webkit-tap-highlight-color: transparent; }

  [hidden] { display: none !important; }

  /* ── Accessibility ────────────────────────────────────────────── */
  .sr-only {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0;
  }

  .skip-link {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0;
  }

  .skip-link:focus {
    position: fixed;
    top: 1rem; left: 1rem;
    z-index: 200;
    width: auto; height: auto;
    padding: 0.75rem 1.25rem;
    clip: auto;
    background: var(--accent);
    color: #fff;
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 0.875rem;
    box-shadow: var(--shadow-md);
  }

  a:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--focus-outline);
    outline-offset: 3px;
    border-radius: 3px;
  }

  /* ── Layout shell ─────────────────────────────────────────────── */
  .background-video-shell {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .background-video {
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: var(--background-video-opacity);
    filter: var(--background-video-filter);
  }

  .background-video-overlay {
    position: absolute;
    inset: 0;
    background: var(--background-video-overlay);
  }

  .site-frame {
    position: relative;
    z-index: 1;
    max-width: 1180px;
    min-height: 100vh;
    margin: 0 auto;
  }

  .site-frame::before,
  .site-frame::after {
    content: "";
    position: fixed;
    width: 12rem; height: 12rem;
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

  /* Section spacing — 8pt grid: 80px top/bottom */
  .section {
    padding: 80px 0;
  }

  /* ── Scroll reveal ────────────────────────────────────────────── */
  .reveal {
    opacity: 0;
    transform: translateY(20px);
    transition:
      opacity 0.5s ease,
      transform 0.5s ease;
  }

  .reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Header animations ────────────────────────────────────────── */
  .about-copy h2,
  .projects-header h2,
  .skills-header h2,
  .contact-section .section-header h2 {
    position: relative;
    display: inline-block;
    padding-bottom: 0.6rem;
  }

  .about-copy h2::after,
  .projects-header h2::after,
  .skills-header h2::after,
  .contact-section .section-header h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, var(--accent) 0%, var(--hero-accent) 100%);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Center alignment for centered headers */
  .projects-header h2::after,
  .skills-header h2::after,
  .contact-section .section-header h2::after {
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    transform-origin: center;
  }

  /* When the parent reveal is visible, animate the text and underline */
  .reveal.is-visible .about-copy h2,
  .reveal.is-visible.projects-header h2,
  .reveal.is-visible.skills-header h2,
  .reveal.is-visible.section-header h2 {
    animation: revealText 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .reveal.is-visible .about-copy h2::after {
    transform: scaleX(1);
    transition-delay: 200ms;
  }
  .reveal.is-visible .projects-header h2::after,
  .reveal.is-visible .skills-header h2::after,
  .reveal.is-visible.section-header h2::after {
    transform: translateX(-50%) scaleX(1);
    transition-delay: 200ms;
  }

  /* Hover interactive scale-up */
  .about-copy h2:hover::after {
    transform: scaleX(1.08);
  }
  .projects-header h2:hover::after,
  .skills-header h2:hover::after,
  .contact-section .section-header h2:hover::after {
    transform: translateX(-50%) scaleX(1.08);
  }

  @keyframes revealText {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }


  /* ── Shared button tokens ─────────────────────────────────────── */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    border-radius: var(--radius-sm);
    border: 1px solid transparent;
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.4;
    white-space: nowrap;
    transition:
      background-color var(--transition),
      border-color var(--transition),
      box-shadow var(--transition),
      transform var(--transition);
  }

  .btn:hover, .btn:focus-visible {
    transform: translateY(-1px);
  }

  .btn-primary {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
    box-shadow: 0 0 0 0 var(--accent-ring);
  }

  .btn-primary:hover, .btn-primary:focus-visible {
    background: var(--accent-hover);
    border-color: var(--accent-hover);
    box-shadow: 0 4px 14px rgba(26,115,232,0.40);
  }

  .btn-secondary {
    background: transparent;
    color: var(--text-primary);
    border-color: var(--border-strong);
  }

  .btn-secondary:hover, .btn-secondary:focus-visible {
    border-color: var(--accent);
    color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent-ring);
  }

  /* ── Animations ───────────────────────────────────────────────── */
  @keyframes pulseGlow {
    from { transform: scale(0.98); opacity: 0.72; }
    to   { transform: scale(1.06); opacity: 1; }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  /* ── Responsive container ─────────────────────────────────────── */
  @media (max-width: 560px) {
    .container {
      width: calc(100% - 1.5rem);
    }
    .section {
      padding: 56px 0;
    }
  }

  /* ── Reduced motion ───────────────────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }

    .background-video { display: none; }

    .reveal {
      opacity: 1;
      transform: none;
      transition: none;
    }

    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

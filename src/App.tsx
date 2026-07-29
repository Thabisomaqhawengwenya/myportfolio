import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { getMuiTheme } from './theme/theme';
import { GlobalStyles } from './theme/GlobalStyles';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';

const App: React.FC = () => {
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem('portfolio-theme');
      return savedTheme === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  // Delay video mount until after first paint — prevents it blocking LCP
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('portfolio-theme', newTheme);
    } catch {
      // Ignore storage errors
    }
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Mount video after first paint so it doesn't compete with LCP resources
  useEffect(() => {
    const id = typeof requestIdleCallback !== 'undefined'
      ? requestIdleCallback(() => setVideoReady(true), { timeout: 2000 })
      : window.setTimeout(() => setVideoReady(true), 1000) as unknown as number;
    return () => {
      if (typeof cancelIdleCallback !== 'undefined') cancelIdleCallback(id as number);
      else clearTimeout(id as unknown as ReturnType<typeof setTimeout>);
    };
  }, []);

  // Play video once it mounts
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});

    const handleVisibilityChange = () => {
      if (!document.hidden && video.paused) video.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [videoReady]);

  const muiTheme = getMuiTheme(theme);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <GlobalStyles />

      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <div className="background-video-shell" aria-hidden="true">
        {videoReady && (
          <video
            ref={videoRef}
            id="background-video"
            className="background-video"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
          >
            <source src="/portfoliobackgroundwallpaper.mp4" type="video/mp4" />
          </video>
        )}
        <div className="background-video-overlay" />
      </div>

      <div className="site-frame">
        <Header theme={theme} setTheme={setTheme} />

        <main id="main-content">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>

        <Footer />
      </div>

      <BackToTop />
    </MuiThemeProvider>
  );
};

export default App;

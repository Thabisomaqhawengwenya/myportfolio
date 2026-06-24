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

  // Ensure background video plays correctly across devices and visibility state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlayVideo = () => {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Fallback gracefully if blocked by browser policy
        });
      }
    };

    if (video.readyState >= 2) {
      tryPlayVideo();
    } else {
      video.addEventListener('canplay', tryPlayVideo, { once: true });
    }

    const handleVisibilityChange = () => {
      if (!document.hidden && video.paused) {
        tryPlayVideo();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      video.removeEventListener('canplay', tryPlayVideo);
    };
  }, []);

  const muiTheme = getMuiTheme(theme);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <GlobalStyles />

      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <div className="background-video-shell" aria-hidden="true">
        <video
          ref={videoRef}
          id="background-video"
          className="background-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/portfoliobackgroundwallpaper.mp4" type="video/mp4" />
          Your browser does not support the background video.
        </video>
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

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
import { Dashboard } from './dashboard/Dashboard';
import { LoadingScreen } from './components/LoadingScreen';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isLoading, setIsLoading] = useState(() => {
    const path = window.location.pathname;
    return path !== '/dashboard' && path !== '/admin';
  });

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Track page visits dynamically
  useEffect(() => {
    // Only track public portfolio views (don't count dashboard actions)
    if (currentPath === '/dashboard' || currentPath === '/admin') return;

    try {
      const hasVisited = localStorage.getItem('has_visited');
      const isNewUnique = !hasVisited;
      if (isNewUnique) {
        localStorage.setItem('has_visited', 'true');
      }

      let device = 'desktop';
      if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        device = 'mobile';
      } else if (/Tablet|iPad/i.test(navigator.userAgent)) {
        device = 'tablet';
      }

      let browser = 'other';
      const ua = navigator.userAgent.toLowerCase();
      if (ua.includes('chrome') && !ua.includes('chromium')) browser = 'chrome';
      else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'safari';
      else if (ua.includes('firefox')) browser = 'firefox';
      else if (ua.includes('edge')) browser = 'edge';

      fetch('/api/track-visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isNewUnique,
          referrer: document.referrer || 'direct',
          device,
          browser,
          path: currentPath,
        }),
      }).catch(() => {});
    } catch {
      // LocalStorage or Fetch exceptions handled gracefully
    }
  }, [currentPath]);

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
  const isDashboard = currentPath === '/dashboard' || currentPath === '/admin';

  return (
    <MuiThemeProvider theme={muiTheme}>
      <GlobalStyles />

      {!isDashboard && isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )}

      {isDashboard ? (
        <Dashboard />
      ) : (
        <>
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
        </>
      )}
    </MuiThemeProvider>
  );
};

export default App;

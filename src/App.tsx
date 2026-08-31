import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
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
  const isDashboard = currentPath === '/dashboard' || currentPath === '/admin';
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

  // Dynamic Scroll Reveal Intersection Observer
  useEffect(() => {
    if (isDashboard || isLoading) return;
    const revealItems = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [currentPath, isDashboard, isLoading]);


  // Track page visits dynamically
  useEffect(() => {
    // Only track public portfolio views (don't count dashboard actions)
    if (currentPath === '/dashboard' || currentPath === '/admin') return;

    try {
      let visitorId = localStorage.getItem('visitor_id');
      if (!visitorId) {
        visitorId = 'visitor_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('visitor_id', visitorId);
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

      let referrer = 'direct';
      if (document.referrer) {
        try {
          referrer = new URL(document.referrer).hostname;
        } catch {
          referrer = document.referrer;
        }
      }

      const logVisit = async () => {
        let country = 'Unknown';
        let city = 'Unknown';
        let region = 'Unknown';

        try {
          const geoRes = await fetch('https://ipapi.co/json/');
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            country = geoData.country_name || 'Unknown';
            city = geoData.city || 'Unknown';
            region = geoData.region || 'Unknown';
          }
        } catch (e) {
          console.warn('Geolocation lookup failed:', e);
        }

        try {
          await addDoc(collection(db, 'visits'), {
            visitorId,
            timestamp: new Date().toISOString(),
            referrer,
            device,
            browser,
            path: currentPath,
            location: { country, city, region }
          });
        } catch (e) {
          console.error('Error logging visit to Firestore:', e);
        }
      };

      logVisit();
    } catch (err) {
      console.error('Tracking system error:', err);
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
    const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (favicon) {
      favicon.href = theme === 'light' ? '/images/p.logo.dark.png' : '/images/p.logo.light.png';
    }
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

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { defaultTestimonials, type Testimonial } from '../data/testimonials';

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [isSectionEnabled, setIsSectionEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('portfolio_section_testimonials_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen to local window events
    const handleSettingsChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.type === 'testimonials') {
        setIsSectionEnabled(Boolean(customEvent.detail.enabled));
      }
    };
    window.addEventListener('portfolio_settings_changed', handleSettingsChange);
    const handleStorage = () => {
      const saved = localStorage.getItem('portfolio_section_testimonials_enabled');
      if (saved !== null) setIsSectionEnabled(saved === 'true');
    };
    window.addEventListener('storage', handleStorage);

    // Real-time listener for Section visibility config in Firestore
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'testimonials'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.enabled !== undefined) {
            setIsSectionEnabled(Boolean(data.enabled));
            try {
              localStorage.setItem('portfolio_section_testimonials_enabled', String(data.enabled));
            } catch {
              // ignore
            }
          }
        }
      },
      (err) => {
        console.warn('Testimonials settings snapshot warning:', err);
      }
    );

    // Real-time listener for testimonials list
    const unsubTestimonials = onSnapshot(
      collection(db, 'testimonials'),
      (querySnapshot) => {
        const list: Testimonial[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Testimonial);
        });
        if (list.length > 0) {
          list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
          setTestimonials(list);
        }
      },
      (err) => {
        console.warn('Testimonials collection snapshot warning:', err);
      }
    );

    return () => {
      unsubSettings();
      unsubTestimonials();
    };
  }, []);

  if (!isSectionEnabled) return null;

  const visibleTestimonials = testimonials.filter((t) => t.visible !== false);
  if (visibleTestimonials.length === 0) return null;

  // Duplicate items for infinite seamless carousel loop
  const displayItems = [...visibleTestimonials, ...visibleTestimonials, ...visibleTestimonials];

  const handleScrollPrev = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const handleScrollNext = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  return (
    <StyledTestimonials className="section" id="testimonials">
      <div className="container">
        {/* Section Header */}
        <div className="testimonials-header reveal">
          <div className="header-badge-row">
            <p className="section-kicker">
              <span className="kicker-arrow">›</span> Recommendations & Praise
            </p>
            {/* Carousel Navigation Buttons */}
            <div className="carousel-nav-btns">
              <button
                className="carousel-btn"
                onClick={handleScrollPrev}
                aria-label="Scroll testimonials backward"
                title="Scroll Left"
              >
                <Icon icon="lucide:chevron-left" width={18} height={18} />
              </button>
              <button
                className="carousel-btn"
                onClick={handleScrollNext}
                aria-label="Scroll testimonials forward"
                title="Scroll Right"
              >
                <Icon icon="lucide:chevron-right" width={18} height={18} />
              </button>
            </div>
          </div>

          <h2>
            What People <span className="accent">Say</span>
          </h2>
          <p className="header-desc">
            Feedback from clients, engineering peers, and technical collaborators.
          </p>
        </div>
      </div>

      {/* Moving Left-To-Right Carousel Track */}
      <div className="carousel-container-outer">
        <div className="gradient-mask mask-left" />
        <div className="gradient-mask mask-right" />

        <div className="carousel-viewport" ref={trackRef}>
          <div className="carousel-track">
            {displayItems.map((item, idx) => {
              const initials = item.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={`${item.id}-${idx}`}
                  className={`testimonial-card ${item.featured ? 'is-featured' : ''}`}
                >
                  <div className="card-top">
                    <div className="stars-row">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon
                          key={i}
                          icon="lucide:star"
                          width={16}
                          height={16}
                          style={{
                            color: i < (item.rating || 5) ? '#f59e0b' : '#64748b',
                            fill: i < (item.rating || 5) ? '#f59e0b' : 'transparent',
                          }}
                        />
                      ))}
                    </div>
                    <Icon
                      icon="lucide:quote"
                      width={26}
                      height={26}
                      className="quote-icon"
                    />
                  </div>

                  <p className="testimonial-text">"{item.content}"</p>

                  <div className="author-row">
                    {item.avatar ? (
                      <img src={item.avatar} alt={item.name} className="author-avatar" />
                    ) : (
                      <div className="author-avatar-fallback">{initials}</div>
                    )}
                    <div className="author-info">
                      <h4 className="author-name">{item.name}</h4>
                      <p className="author-role">
                        {item.role}
                        {item.company ? ` • ${item.company}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </StyledTestimonials>
  );
};

const StyledTestimonials = styled.section`
  padding: 85px 0 90px;
  position: relative;
  overflow: hidden;

  .testimonials-header {
    text-align: center;
    max-width: 680px;
    margin: 0 auto 3rem;
    position: relative;

    .header-badge-row {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      margin-bottom: 0.5rem;
    }

    .section-kicker {
      margin: 0;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--accent);

      .kicker-arrow {
        color: var(--accent);
      }
    }

    .carousel-nav-btns {
      position: absolute;
      right: 0;
      display: flex;
      gap: 0.4rem;

      @media (max-width: 640px) {
        display: none;
      }

      .carousel-btn {
        width: 2.1rem;
        height: 2.1rem;
        border-radius: 50%;
        background: var(--surface-raised);
        border: 1px solid var(--border);
        color: var(--text);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition: all 0.15s ease;

        &:hover {
          background: var(--accent);
          color: #ffffff;
          border-color: var(--accent);
        }
      }
    }

    h2 {
      margin: 0 0 0.75rem;
      font-size: clamp(2rem, 3.5vw, 2.75rem);
      font-weight: 700;
      color: var(--heading);
    }

    .accent {
      color: var(--accent);
    }

    .header-desc {
      margin: 0;
      font-size: 0.95rem;
      color: var(--text-muted);
      line-height: 1.6;
    }
  }

  .carousel-container-outer {
    position: relative;
    width: 100%;
    overflow: hidden;
    padding: 0.5rem 0;

    .gradient-mask {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100px;
      z-index: 5;
      pointer-events: none;

      &.mask-left {
        left: 0;
        background: linear-gradient(90deg, var(--bg) 0%, transparent 100%);
      }

      &.mask-right {
        right: 0;
        background: linear-gradient(270deg, var(--bg) 0%, transparent 100%);
      }

      @media (max-width: 768px) {
        width: 40px;
      }
    }
  }

  .carousel-viewport {
    overflow-x: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  /* Left-to-Right Animated Moving Track */
  .carousel-track {
    display: flex;
    gap: 1.5rem;
    width: max-content;
    animation: scrollLeftToRight 45s linear infinite;

    &:hover {
      animation-play-state: paused;
    }
  }

  @keyframes scrollLeftToRight {
    0% {
      transform: translateX(-50%);
    }
    100% {
      transform: translateX(0%);
    }
  }

  .testimonial-card {
    width: 360px;
    max-width: 85vw;
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: 1.25rem;
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-shrink: 0;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    position: relative;
    overflow: hidden;

    &:hover {
      transform: translateY(-4px);
      border-color: var(--border-strong);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
    }

    &.is-featured {
      border-color: rgba(26, 115, 232, 0.4);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #1A73E8, #38bdf8);
      }
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.15rem;

      .stars-row {
        display: flex;
        gap: 0.25rem;
      }

      .quote-icon {
        color: var(--accent);
        opacity: 0.35;
      }
    }

    .testimonial-text {
      font-size: 0.92rem;
      line-height: 1.65;
      color: var(--text);
      margin: 0 0 1.5rem;
      font-style: italic;
    }

    .author-row {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      margin-top: auto;
      padding-top: 1.15rem;
      border-top: 1px solid var(--border);

      .author-avatar {
        width: 2.65rem;
        height: 2.65rem;
        border-radius: 50%;
        object-fit: cover;
      }

      .author-avatar-fallback {
        width: 2.65rem;
        height: 2.65rem;
        border-radius: 50%;
        background: var(--surface);
        border: 1px solid var(--border);
        color: var(--accent);
        font-weight: 700;
        font-size: 0.9rem;
        display: grid;
        place-items: center;
        flex-shrink: 0;
      }

      .author-info {
        min-width: 0;

        .author-name {
          margin: 0;
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--heading);
        }

        .author-role {
          margin: 0.15rem 0 0;
          font-size: 0.76rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
`;

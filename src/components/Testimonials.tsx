import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { defaultTestimonials, type Testimonial } from '../data/testimonials';

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'testimonials'));
        const list: Testimonial[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Testimonial);
        });
        if (list.length > 0) {
          list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
          setTestimonials(list);
        }
      } catch (err) {
        console.warn('Using default testimonials fallback:', err);
      }
    };
    fetchTestimonials();
  }, []);

  const visibleTestimonials = testimonials.filter((t) => t.visible !== false);

  if (visibleTestimonials.length === 0) return null;

  return (
    <StyledTestimonials className="section" id="testimonials">
      <div className="container">
        {/* Section Header */}
        <div className="testimonials-header reveal">
          <p className="section-kicker">
            <span className="kicker-arrow">›</span> Recommendations & Praise
          </p>
          <h2>
            What People <span className="accent">Say</span>
          </h2>
          <p className="header-desc">
            Feedback from clients, collaborative engineering peers, and mentorship programs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {visibleTestimonials.map((item) => {
            const initials = item.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={item.id}
                className={`testimonial-card reveal ${item.featured ? 'is-featured' : ''}`}
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
                    width={28}
                    height={28}
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
    </StyledTestimonials>
  );
};

const StyledTestimonials = styled.section`
  padding: 80px 0;
  position: relative;

  .testimonials-header {
    text-align: center;
    max-width: 640px;
    margin: 0 auto 3.5rem;

    .section-kicker {
      margin: 0 0 0.5rem;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--accent);

      .kicker-arrow {
        color: var(--accent);
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

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.75rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
      gap: 1.25rem;
    }
  }

  .testimonial-card {
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: 1.25rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
      margin-bottom: 1.25rem;

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
      font-size: 0.94rem;
      line-height: 1.65;
      color: var(--text);
      margin: 0 0 1.75rem;
      font-style: italic;
    }

    .author-row {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      margin-top: auto;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border);

      .author-avatar {
        width: 2.75rem;
        height: 2.75rem;
        border-radius: 50%;
        object-fit: cover;
      }

      .author-avatar-fallback {
        width: 2.75rem;
        height: 2.75rem;
        border-radius: 50%;
        background: var(--surface);
        border: 1px solid var(--border);
        color: var(--accent);
        font-weight: 700;
        font-size: 0.92rem;
        display: grid;
        place-items: center;
        flex-shrink: 0;
      }

      .author-info {
        min-width: 0;

        .author-name {
          margin: 0;
          font-size: 0.94rem;
          font-weight: 600;
          color: var(--heading);
        }

        .author-role {
          margin: 0.15rem 0 0;
          font-size: 0.78rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
`;

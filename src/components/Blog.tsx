import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { defaultBlogPosts, type BlogPost } from '../data/blog';
import { BlogModal } from './BlogModal';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(defaultBlogPosts);
  const [isSectionEnabled, setIsSectionEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('portfolio_section_blog_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  useEffect(() => {
    // Listen to local window events
    const handleSettingsChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.type === 'blog') {
        setIsSectionEnabled(Boolean(customEvent.detail.enabled));
      }
    };
    window.addEventListener('portfolio_settings_changed', handleSettingsChange);
    const handleStorage = () => {
      const saved = localStorage.getItem('portfolio_section_blog_enabled');
      if (saved !== null) setIsSectionEnabled(saved === 'true');
    };
    window.addEventListener('storage', handleStorage);

    // Real-time listener for Blog section visibility config
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'blog'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.enabled !== undefined) {
            setIsSectionEnabled(Boolean(data.enabled));
            try {
              localStorage.setItem('portfolio_section_blog_enabled', String(data.enabled));
            } catch {
              // ignore
            }
          }
        }
      },
      (err) => {
        console.warn('Blog settings snapshot warning:', err);
      }
    );

    // Real-time listener for Blog articles collection
    const unsubBlog = onSnapshot(
      collection(db, 'blog'),
      (querySnapshot) => {
        const list: BlogPost[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as BlogPost);
        });
        if (list.length > 0) {
          list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
          setPosts(list);
        }
      },
      (err) => {
        console.warn('Blog collection snapshot warning:', err);
      }
    );

    return () => {
      unsubSettings();
      unsubBlog();
    };
  }, []);

  if (!isSectionEnabled) return null;

  const publishedPosts = posts.filter((p) => p.published !== false);
  if (publishedPosts.length === 0) return null;

  const categories = ['All', ...Array.from(new Set(publishedPosts.map((p) => p.category)))];

  const filteredPosts =
    selectedCategory === 'All'
      ? publishedPosts
      : publishedPosts.filter((p) => p.category === selectedCategory);

  return (
    <StyledBlog className="section" id="blog">
      <div className="container">
        {/* Section Header */}
        <div className="blog-header reveal">
          <p className="section-kicker">
            <span className="kicker-arrow">›</span> Engineering & Writing
          </p>
          <h2>
            Articles & <span className="accent">Case Studies</span>
          </h2>
          <p className="header-desc">
            Deep dives into architectural decisions, 3D WebGL graphics, and performance optimization.
          </p>
        </div>

        {/* Category Filters */}
        {categories.length > 2 && (
          <div className="category-filters-row reveal">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Articles Grid */}
        <div className="articles-grid">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className={`article-card reveal ${post.featured ? 'is-featured' : ''}`}
              onClick={() => setActivePost(post)}
            >
              {post.coverImage && (
                <div className="card-thumb-wrap">
                  <img src={post.coverImage} alt={post.title} className="card-thumb-img" />
                  <div className="thumb-badge">{post.category}</div>
                  {post.featured && <div className="featured-badge">Featured</div>}
                </div>
              )}

              <div className="card-body">
                <div className="card-meta">
                  <span className="read-time">
                    <Icon icon="lucide:clock" width={13} height={13} />
                    {post.readTimeMinutes} min read
                  </span>
                  {post.publishedAt && <span className="card-date">{post.publishedAt}</span>}
                </div>

                <h3 className="card-title">{post.title}</h3>
                <p className="card-excerpt">{post.excerpt}</p>

                <div className="card-footer">
                  <span className="read-more-link">
                    Read Article <Icon icon="lucide:arrow-right" width={16} height={16} />
                  </span>
                  {post.tags && post.tags.length > 0 && (
                    <span className="first-tag">#{post.tags[0]}</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Full Article Reader Modal */}
      <BlogModal post={activePost} onClose={() => setActivePost(null)} />
    </StyledBlog>
  );
};

const StyledBlog = styled.section`
  padding: 85px 0 90px;
  position: relative;

  .blog-header {
    text-align: center;
    max-width: 680px;
    margin: 0 auto 2.5rem;

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

  .category-filters-row {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 3rem;

    .filter-btn {
      background: var(--surface-raised);
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 0.45rem 1.1rem;
      border-radius: 99px;
      font-size: 0.84rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        color: var(--heading);
        border-color: var(--border-strong);
      }

      &.active {
        background: var(--accent);
        border-color: var(--accent);
        color: #ffffff;
      }
    }
  }

  .articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  .article-card {
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: 1.25rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-5px);
      border-color: var(--accent);
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.1);

      .read-more-link {
        color: var(--accent);
        gap: 0.6rem;
      }

      .card-thumb-img {
        transform: scale(1.04);
      }
    }

    &.is-featured {
      border-color: rgba(26, 115, 232, 0.4);
    }

    .card-thumb-wrap {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      background: var(--surface);

      .card-thumb-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .thumb-badge {
        position: absolute;
        top: 0.85rem;
        left: 0.85rem;
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(4px);
        color: #38bdf8;
        font-size: 0.72rem;
        font-weight: 700;
        padding: 0.2rem 0.6rem;
        border-radius: 99px;
      }

      .featured-badge {
        position: absolute;
        top: 0.85rem;
        right: 0.85rem;
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: #ffffff;
        font-size: 0.7rem;
        font-weight: 700;
        padding: 0.2rem 0.55rem;
        border-radius: 99px;
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
      }
    }

    .card-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      .card-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;

        .read-time {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.76rem;
          color: var(--accent);
          font-weight: 600;
        }

        .card-date {
          font-size: 0.76rem;
          color: var(--text-muted);
        }
      }

      .card-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--heading);
        line-height: 1.4;
        margin: 0 0 0.65rem;
      }

      .card-excerpt {
        font-size: 0.88rem;
        color: var(--text-muted);
        line-height: 1.6;
        margin: 0 0 1.5rem;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        padding-top: 1rem;
        border-top: 1px solid var(--border);

        .read-more-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.84rem;
          font-weight: 700;
          color: var(--heading);
          transition: all 0.15s ease;
        }

        .first-tag {
          font-size: 0.76rem;
          color: var(--text-muted);
          background: var(--surface);
          padding: 0.15rem 0.5rem;
          border-radius: 99px;
          border: 1px solid var(--border);
        }
      }
    }
  }
`;

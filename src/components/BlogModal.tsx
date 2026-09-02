import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import type { BlogPost } from '../data/blog';

interface BlogModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ post, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (post) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [post, onClose]);

  if (!post) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Render markdown-like sections safely
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    lines.forEach((line, idx) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${idx}`} className="article-code-block">
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      if (line.startsWith('## ')) {
        elements.push(<h2 key={`h2-${idx}`} className="content-h2">{line.replace('## ', '')}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={`h3-${idx}`} className="content-h3">{line.replace('### ', '')}</h3>);
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={`li-${idx}`} className="content-li">
            {line.replace('- ', '')}
          </li>
        );
      } else if (line.trim() !== '') {
        elements.push(<p key={`p-${idx}`} className="content-p">{line}</p>);
      }
    });

    return elements;
  };

  return (
    <StyledBlogModal onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Top Control Bar */}
        <div className="modal-top-bar">
          <button className="share-btn" onClick={handleShare} title="Share Article">
            <Icon icon="lucide:share-2" width={18} height={18} />
            <span>Share</span>
          </button>
          <button className="close-btn" onClick={onClose} aria-label="Close article">
            <Icon icon="lucide:x" width={22} height={22} />
          </button>
        </div>

        {/* Article Cover */}
        {post.coverImage && (
          <div className="article-cover-wrap">
            <img src={post.coverImage} alt={post.title} className="article-cover-img" />
            <div className="cover-gradient-overlay" />
          </div>
        )}

        {/* Article Header */}
        <div className="article-content-body">
          <div className="meta-badges-row">
            <span className="category-pill">{post.category}</span>
            <span className="read-time-pill">
              <Icon icon="lucide:clock" width={14} height={14} />
              {post.readTimeMinutes} min read
            </span>
            {post.publishedAt && <span className="date-pill">{post.publishedAt}</span>}
          </div>

          <h1 className="article-title">{post.title}</h1>

          {/* Author info */}
          <div className="author-bar">
            <div className="author-avatar">
              {post.author?.avatar ? (
                <img src={post.author.avatar} alt={post.author.name} />
              ) : (
                <div className="author-initials">MT</div>
              )}
            </div>
            <div>
              <h4 className="author-name">{post.author?.name || 'Maqhawe T Ngwenya'}</h4>
              <p className="author-role">{post.author?.role || 'Full Stack & 3D Web Engineer'}</p>
            </div>
          </div>

          {/* Article Formatted Body */}
          <div className="article-prose">
            {renderFormattedContent(post.content)}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="article-tags-footer">
              <span className="tags-label">Related Topics:</span>
              <div className="tags-list">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag-item">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </StyledBlogModal>
  );
};

const StyledBlogModal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 1100;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-y: auto;
  padding: 2.5rem 1rem;

  .modal-container {
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: 1.5rem;
    width: 100%;
    max-width: 800px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
    overflow: hidden;
    position: relative;
    margin: auto 0;
  }

  .modal-top-bar {
    position: sticky;
    top: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: var(--surface-raised);
    border-bottom: 1px solid var(--border);
    z-index: 10;

    .share-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 0.45rem 0.9rem;
      border-radius: 99px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: var(--accent);
        color: #ffffff;
        border-color: var(--accent);
      }
    }

    .close-btn {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      background: var(--surface);
      border: 1px solid var(--border);
      color: var(--text);
      display: grid;
      place-items: center;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: #fee2e2;
        color: #ef4444;
        border-color: #fca5a5;
      }
    }
  }

  .article-cover-wrap {
    position: relative;
    width: 100%;
    height: 340px;

    @media (max-width: 640px) {
      height: 220px;
    }

    .article-cover-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .cover-gradient-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 50%, var(--surface-raised) 100%);
    }
  }

  .article-content-body {
    padding: 2.25rem 2.5rem 3rem;

    @media (max-width: 640px) {
      padding: 1.5rem 1.25rem 2rem;
    }

    .meta-badges-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 1.25rem;

      .category-pill {
        background: rgba(26, 115, 232, 0.15);
        color: var(--accent);
        font-size: 0.78rem;
        font-weight: 700;
        padding: 0.2rem 0.65rem;
        border-radius: 99px;
      }

      .read-time-pill, .date-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.78rem;
        color: var(--text-muted);
      }
    }

    .article-title {
      font-size: clamp(1.75rem, 3vw, 2.25rem);
      font-weight: 800;
      color: var(--heading);
      line-height: 1.3;
      margin: 0 0 1.5rem;
    }

    .author-bar {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding-bottom: 1.75rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--border);

      .author-avatar {
        width: 2.75rem;
        height: 2.75rem;
        border-radius: 50%;
        overflow: hidden;
        border: 1px solid var(--border);

        .author-initials {
          width: 100%;
          height: 100%;
          background: var(--surface);
          color: var(--accent);
          font-weight: 700;
          font-size: 0.95rem;
          display: grid;
          place-items: center;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .author-name {
        margin: 0;
        font-size: 0.96rem;
        font-weight: 700;
        color: var(--heading);
      }

      .author-role {
        margin: 0.15rem 0 0;
        font-size: 0.78rem;
        color: var(--text-muted);
      }
    }

    .article-prose {
      color: var(--text);
      line-height: 1.75;
      font-size: 1rem;

      .content-h2 {
        font-size: 1.45rem;
        font-weight: 700;
        color: var(--heading);
        margin: 2.25rem 0 1rem;
      }

      .content-h3 {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--heading);
        margin: 1.75rem 0 0.75rem;
      }

      .content-p {
        margin: 0 0 1.25rem;
      }

      .content-li {
        margin: 0 0 0.5rem 1.5rem;
        list-style-type: disc;
      }

      .article-code-block {
        background: #0f172a;
        color: #38bdf8;
        padding: 1.25rem 1.5rem;
        border-radius: 12px;
        overflow-x: auto;
        font-family: 'Fira Code', monospace;
        font-size: 0.88rem;
        margin: 1.5rem 0;
        border: 1px solid #1e293b;
      }
    }

    .article-tags-footer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
      margin-top: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);

      .tags-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-muted);
      }

      .tags-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;

        .tag-item {
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 0.76rem;
          padding: 0.2rem 0.6rem;
          border-radius: 99px;
        }
      }
    }
  }
`;

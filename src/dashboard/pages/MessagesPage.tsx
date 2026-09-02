import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
  starred?: boolean;
}

interface MessagesPageProps {
  messages: ContactMessage[];
  onToggleRead: (id: string, currentRead: boolean) => Promise<void>;
  onToggleStar: (id: string, currentStarred: boolean) => Promise<void>;
  onDeleteMessage: (id: string) => Promise<void>;
  onMarkAllAsRead: () => Promise<void>;
  searchQuery: string;
}

type TabType = 'all' | 'unread' | 'starred';

export const MessagesPage: React.FC<MessagesPageProps> = ({
  messages,
  onToggleRead,
  onToggleStar,
  onDeleteMessage,
  onMarkAllAsRead,
  searchQuery,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(() => {
    return messages.length > 0 ? messages[0].id : null;
  });
  const [copied, setCopied] = useState(false);

  // Filter messages by tab and search query
  const filteredMessages = messages.filter((msg) => {
    if (activeTab === 'unread' && msg.read) return false;
    if (activeTab === 'starred' && !msg.starred) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      msg.subject.toLowerCase().includes(q) ||
      msg.message.toLowerCase().includes(q)
    );
  });

  const selectedMessage = messages.find((m) => m.id === selectedMessageId) || (filteredMessages.length > 0 ? filteredMessages[0] : null);

  const unreadCount = messages.filter((m) => !m.read).length;
  const starredCount = messages.filter((m) => m.starred).length;

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMessageId(msg.id);
    if (!msg.read) {
      await onToggleRead(msg.id, false);
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getTimeAgo = (isoString: string) => {
    try {
      // eslint-disable-next-line react-hooks/purity
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return new Date(isoString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <StyledMessagesPage>
      {/* Top Header Controls */}
      <div className="messages-header-row">
        <div className="inbox-tabs">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <Icon icon="lucide:inbox" width={17} height={17} />
            <span>All</span>
            <span className="count-pill">{messages.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            <Icon icon="lucide:mail-warning" width={17} height={17} />
            <span>Unread</span>
            {unreadCount > 0 && <span className="count-pill unread-pill">{unreadCount}</span>}
          </button>
          <button
            className={`tab-btn ${activeTab === 'starred' ? 'active' : ''}`}
            onClick={() => setActiveTab('starred')}
          >
            <Icon icon="lucide:star" width={17} height={17} />
            <span>Starred</span>
            {starredCount > 0 && <span className="count-pill starred-pill">{starredCount}</span>}
          </button>
        </div>

        {unreadCount > 0 && (
          <button className="mark-all-btn" onClick={onMarkAllAsRead}>
            <Icon icon="lucide:check-check" width={16} height={16} />
            Mark all read
          </button>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="inbox-empty-card">
          <div className="empty-icon-wrap">
            <Icon icon="lucide:mail" width={48} height={48} />
          </div>
          <h3>No messages yet</h3>
          <p>When visitors send you a message through your portfolio contact form, they will appear here instantly.</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="inbox-empty-card">
          <div className="empty-icon-wrap">
            <Icon icon="lucide:search-x" width={44} height={44} />
          </div>
          <h3>No matching inquiries</h3>
          <p>No messages match your current filter or search query.</p>
        </div>
      ) : (
        /* Split-Pane Inbox Layout */
        <div className="inbox-container">
          {/* Left Column: Messages List */}
          <div className="messages-list-pane">
            {filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              const initials = msg.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || '??';

              return (
                <div
                  key={msg.id}
                  className={`message-item ${isSelected ? 'is-selected' : ''} ${!msg.read ? 'is-unread' : ''}`}
                  onClick={() => handleSelectMessage(msg)}
                >
                  <div className="item-avatar">{initials}</div>

                  <div className="item-content">
                    <div className="item-header">
                      <h4 className="item-sender">{msg.name}</h4>
                      <span className="item-time">{getTimeAgo(msg.timestamp)}</span>
                    </div>

                    <p className="item-subject">{msg.subject || '(No Subject)'}</p>
                    <p className="item-snippet">{msg.message}</p>
                  </div>

                  <div className="item-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className={`star-btn ${msg.starred ? 'is-starred' : ''}`}
                      onClick={() => onToggleStar(msg.id, !!msg.starred)}
                      title={msg.starred ? 'Unstar message' : 'Star message'}
                    >
                      <Icon icon={msg.starred ? 'lucide:star' : 'lucide:star'} width={16} height={16} />
                    </button>
                    {!msg.read && <span className="unread-dot" title="Unread" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Message Detail View */}
          {selectedMessage ? (
            <div className="message-detail-pane">
              <div className="detail-header">
                <div className="sender-meta">
                  <div className="detail-avatar">
                    {selectedMessage.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2) || '??'}
                  </div>
                  <div className="sender-text">
                    <h3>{selectedMessage.name}</h3>
                    <div className="sender-email-row">
                      <span className="sender-email">{selectedMessage.email}</span>
                      <button
                        className="copy-btn"
                        onClick={() => handleCopyEmail(selectedMessage.email)}
                        title="Copy email address"
                      >
                        <Icon icon={copied ? 'lucide:check' : 'lucide:copy'} width={14} height={14} />
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="detail-action-buttons">
                  <button
                    className={`action-icon-btn ${selectedMessage.starred ? 'starred' : ''}`}
                    onClick={() => onToggleStar(selectedMessage.id, !!selectedMessage.starred)}
                    title={selectedMessage.starred ? 'Unstar' : 'Star'}
                  >
                    <Icon icon="lucide:star" width={18} height={18} />
                  </button>

                  <button
                    className="action-icon-btn"
                    onClick={() => onToggleRead(selectedMessage.id, selectedMessage.read)}
                    title={selectedMessage.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    <Icon icon={selectedMessage.read ? 'lucide:mail-open' : 'lucide:mail'} width={18} height={18} />
                  </button>

                  <button
                    className="action-icon-btn delete-btn"
                    onClick={() => {
                      if (window.confirm(`Delete message from ${selectedMessage.name}?`)) {
                        onDeleteMessage(selectedMessage.id);
                      }
                    }}
                    title="Delete message"
                  >
                    <Icon icon="lucide:trash-2" width={18} height={18} />
                  </button>
                </div>
              </div>

              {/* Subject & Timestamp bar */}
              <div className="detail-subject-bar">
                <div className="subject-box">
                  <span className="subject-tag">Subject</span>
                  <span className="subject-title">{selectedMessage.subject || '(No Subject)'}</span>
                </div>
                <span className="timestamp-badge">
                  <Icon icon="lucide:clock" width={14} height={14} />
                  {formatDate(selectedMessage.timestamp)}
                </span>
              </div>

              {/* Message Content */}
              <div className="detail-body">
                <p>{selectedMessage.message}</p>
              </div>

              {/* Reply Footer */}
              <div className="detail-footer">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Portfolio Inquiry')}`}
                  className="reply-btn"
                >
                  <Icon icon="lucide:reply" width={17} height={17} />
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="no-selection-pane">
              <Icon icon="lucide:mail" width={40} height={40} />
              <p>Select an inquiry to view the full message</p>
            </div>
          )}
        </div>
      )}
    </StyledMessagesPage>
  );
};

const StyledMessagesPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  .messages-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;

    .inbox-tabs {
      display: flex;
      gap: 0.5rem;
      background: #ffffff;
      padding: 0.35rem;
      border-radius: 99px;
      border: 1px solid #e2e8f0;

      .tab-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.45rem 0.95rem;
        border-radius: 99px;
        border: 0;
        background: transparent;
        color: #64748b;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 180ms ease;

        &:hover {
          color: #0f172a;
          background: #f8fafc;
        }

        &.active {
          background: #1A73E8;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(26, 115, 232, 0.25);

          .count-pill {
            background: rgba(255, 255, 255, 0.25);
            color: #ffffff;
          }
        }

        .count-pill {
          display: inline-grid;
          place-items: center;
          min-width: 1.25rem;
          height: 1.25rem;
          padding: 0 0.35rem;
          border-radius: 999px;
          background: #f1f5f9;
          color: #64748b;
          font-size: 0.72rem;
          font-weight: 700;

          &.unread-pill {
            background: #ef4444;
            color: #ffffff;
          }

          &.starred-pill {
            background: #f59e0b;
            color: #ffffff;
          }
        }
      }
    }

    .mark-all-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.5rem 0.95rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #1A73E8;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 160ms ease;

      &:hover {
        background: #f0f7ff;
        border-color: #bfdbfe;
      }
    }
  }

  .inbox-empty-card {
    background: #ffffff;
    border-radius: 1.25rem;
    padding: 3.5rem 1.5rem;
    border: 1px solid #eaeaea;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .empty-icon-wrap {
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
      background: #eff6ff;
      color: #1A73E8;
      display: grid;
      place-items: center;
      margin-bottom: 1.25rem;
    }

    h3 {
      margin: 0 0 0.4rem;
      font-size: 1.2rem;
      color: #0f172a;
      font-weight: 700;
    }

    p {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
      max-width: 420px;
    }
  }

  /* Split-pane container */
  .inbox-container {
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: 1.25rem;
    min-height: 540px;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  /* Left List Pane */
  .messages-list-pane {
    background: #ffffff;
    border-radius: 1.25rem;
    border: 1px solid #eaeaea;
    overflow-y: auto;
    max-height: 680px;
    display: flex;
    flex-direction: column;

    .message-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.95rem 1rem;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
      transition: all 140ms ease;
      position: relative;

      &:hover {
        background: #f8fafc;
      }

      &.is-selected {
        background: #f0f7ff;
        border-left: 3px solid #1A73E8;
      }

      &.is-unread {
        background: #fafcff;
        .item-sender {
          font-weight: 700;
          color: #0f172a;
        }
        .item-subject {
          font-weight: 600;
          color: #1e293b;
        }
      }

      .item-avatar {
        width: 2.3rem;
        height: 2.3rem;
        border-radius: 50%;
        background: #e0edff;
        color: #1A73E8;
        font-weight: 700;
        font-size: 0.82rem;
        display: grid;
        place-items: center;
        flex-shrink: 0;
      }

      .item-content {
        flex: 1;
        min-width: 0;

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.5rem;

          .item-sender {
            margin: 0;
            font-size: 0.88rem;
            color: #334155;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .item-time {
            font-size: 0.72rem;
            color: #94a3b8;
            white-space: nowrap;
          }
        }

        .item-subject {
          margin: 0.15rem 0 0.2rem;
          font-size: 0.82rem;
          color: #475569;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-snippet {
          margin: 0;
          font-size: 0.76rem;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .item-actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.4rem;

        .star-btn {
          border: 0;
          background: transparent;
          color: #cbd5e1;
          cursor: pointer;
          padding: 0.2rem;
          display: grid;
          place-items: center;
          transition: color 140ms ease;

          &:hover {
            color: #f59e0b;
          }

          &.is-starred {
            color: #f59e0b;
          }
        }

        .unread-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #1A73E8;
        }
      }
    }
  }

  /* Right Detail Pane */
  .message-detail-pane {
    background: #ffffff;
    border-radius: 1.25rem;
    border: 1px solid #eaeaea;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 1.25rem;

      .sender-meta {
        display: flex;
        align-items: center;
        gap: 0.9rem;

        .detail-avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: #eff6ff;
          color: #1A73E8;
          font-weight: 700;
          font-size: 1.1rem;
          display: grid;
          place-items: center;
        }

        .sender-text {
          h3 {
            margin: 0;
            font-size: 1.15rem;
            color: #0f172a;
            font-weight: 700;
          }

          .sender-email-row {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            margin-top: 0.2rem;

            .sender-email {
              font-size: 0.84rem;
              color: #64748b;
            }

            .copy-btn {
              display: inline-flex;
              align-items: center;
              gap: 0.3rem;
              padding: 0.15rem 0.45rem;
              border-radius: 4px;
              border: 1px solid #e2e8f0;
              background: #f8fafc;
              color: #475569;
              font-size: 0.72rem;
              cursor: pointer;

              &:hover {
                background: #f1f5f9;
                color: #0f172a;
              }
            }
          }
        }
      }

      .detail-action-buttons {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .action-icon-btn {
          display: grid;
          place-items: center;
          width: 2.2rem;
          height: 2.2rem;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #64748b;
          cursor: pointer;
          transition: all 140ms ease;

          &:hover {
            background: #f1f5f9;
            color: #0f172a;
          }

          &.starred {
            color: #f59e0b;
            border-color: #fef3c7;
            background: #fffbeb;
          }

          &.delete-btn:hover {
            background: #fef2f2;
            color: #ef4444;
            border-color: #fee2e2;
          }
        }
      }
    }

    .detail-subject-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.75rem;

      .subject-box {
        display: flex;
        align-items: center;
        gap: 0.6rem;

        .subject-tag {
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          background: #eff6ff;
          color: #1A73E8;
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .subject-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f172a;
        }
      }

      .timestamp-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.78rem;
        color: #94a3b8;
      }
    }

    .detail-body {
      background: #f8fafc;
      border-radius: 0.75rem;
      padding: 1.25rem;
      border: 1px solid #f1f5f9;
      color: #334155;
      font-size: 0.94rem;
      line-height: 1.65;
      white-space: pre-wrap;
      min-height: 160px;
    }

    .detail-footer {
      display: flex;
      justify-content: flex-start;
      padding-top: 0.5rem;

      .reply-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.65rem 1.35rem;
        border-radius: 99px;
        background: #1A73E8;
        color: #ffffff;
        font-size: 0.88rem;
        font-weight: 600;
        text-decoration: none;
        box-shadow: 0 2px 8px rgba(26, 115, 232, 0.25);
        transition: all 160ms ease;

        &:hover {
          background: #1557B0;
          transform: translateY(-1px);
        }
      }
    }
  }

  .no-selection-pane {
    background: #ffffff;
    border-radius: 1.25rem;
    border: 1px solid #eaeaea;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    gap: 0.75rem;
  }
`;

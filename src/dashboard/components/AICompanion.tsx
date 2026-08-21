import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Icon } from '@iconify/react';

interface Project {
  id: string;
  category: 'personal' | 'business' | 'education' | 'utility' | 'gift';
  title: string;
  description: string;
  tags: string[];
  image?: string;
  liveDemoUrl?: string;
  githubUrl?: string;
}

interface AICompanionProps {
  projects: Project[];
  onSaveProjects: (updated: Project[]) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export const AICompanion: React.FC<AICompanionProps> = ({ projects, onSaveProjects }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hi Maqhawe! I'm your AI Admin Assistant. 🤖\n\nI can help you manage your tasks and portfolio. Try typing:\n• **show stats** — View visitor analytics\n• **add task [title] on [date] desc [description]**\n• **add project [title] desc [description] category [category] tags [tags]**",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(async () => {
      let reply = "I didn't quite get that. Type **help** to see all available commands.";
      const trimmed = textToSend.trim();

      // 1. HELP / GREETING
      if (/^(help|hello|hi|hey|menu)/i.test(trimmed)) {
        reply = "Here are the commands I can execute for you:\n\n" +
          "1. **Add Task/Milestone**:\n`add task [title] on [YYYY-MM-DD] desc [description]`\n\n" +
          "2. **Add Project**:\n`add project [title] desc [description] category [personal/business/...] tags [React, Vite]`\n\n" +
          "3. **Show Visitor Stats**:\n`show stats` or `visitor summary`";
      }
      // 2. SHOW STATS
      else if (/^(show\s+stats|stats|visitor\s+summary|traffic|analytics)/i.test(trimmed)) {
        try {
          const res = await fetch('/api/visitor-stats');
          if (!res.ok) throw new Error('API error');
          const data = await res.json();
          reply = `📈 **Visitor Analytics Summary**:\n\n` +
            `• **Total Visits**: ${data.totalVisits}\n` +
            `• **Unique Visitors**: ${data.uniqueVisitors}\n` +
            `• **Desktop Views**: ${data.devices.desktop}\n` +
            `• **Mobile Views**: ${data.devices.mobile}\n` +
            `• **Chrome Users**: ${data.browsers.chrome}\n` +
            `• **Safari Users**: ${data.browsers.safari}`;
        } catch {
          reply = "❌ Failed to read visitor statistics from the API.";
        }
      }
      // 3. ADD TASK / MILESTONE
      // e.g. add task Code AI Assistant on 2026-08-22 desc Finish dashboard integration
      else if (/^add\s+(task|milestone)\s+(.+?)\s+on\s+(\d{4}-\d{2}-\d{2})(?:\s+(?:desc|description)\s+(.+))?$/i.test(trimmed)) {
        const match = trimmed.match(/^add\s+(task|milestone)\s+(.+?)\s+on\s+(\d{4}-\d{2}-\d{2})(?:\s+(?:desc|description)\s+(.+))?$/i);
        if (match) {
          const type = match[1].toLowerCase() as 'task' | 'milestone';
          const title = match[2];
          const date = match[3];
          const desc = match[4] || '';

          try {
            // Load current events
            const res = await fetch('/api/calendar-events');
            const currentEvents = res.ok ? await res.json() : [];
            
            const newEvent = {
              id: `ev-${Date.now()}`,
              title,
              date,
              type,
              description: desc,
            };

            // Post updated events
            const saveRes = await fetch('/api/calendar-events', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify([...currentEvents, newEvent], null, 2),
            });

            if (saveRes.ok) {
              // Dispatch event to refresh Calendar page in real time
              window.dispatchEvent(new CustomEvent('calendar-updated'));
              reply = `✅ **${type.toUpperCase()} ADDED SUCCESSFULLY!**\n\n` +
                `• **Title**: ${title}\n` +
                `• **Date**: ${date}\n` +
                `• **Description**: ${desc || '*None*'}`;
            } else {
              throw new Error('Save error');
            }
          } catch {
            reply = "❌ Failed to save the task. Please make sure the local server is running.";
          }
        }
      }
      // 4. ADD PROJECT
      // e.g. add project Nike Store desc High-performance frontend store category business tags React, Three.js, CSS
      else if (/^add\s+project\s+(.+?)\s+(?:desc|description)\s+(.+?)(?:\s+category\s+(personal|business|education|utility|gift))?(?:\s+tags\s+(.+))?$/i.test(trimmed)) {
        const match = trimmed.match(/^add\s+project\s+(.+?)\s+(?:desc|description)\s+(.+?)(?:\s+category\s+(personal|business|education|utility|gift))?(?:\s+tags\s+(.+))?$/i);
        if (match) {
          const title = match[1];
          const desc = match[2];
          const category = (match[3] || 'business') as 'personal' | 'business' | 'education' | 'utility' | 'gift';
          const tagsString = match[4] || '';
          const tags = tagsString ? tagsString.split(',').map((t) => t.trim()) : [];

          try {
            const newProject: Project = {
              id: `proj-${Date.now()}`,
              category,
              title,
              description: desc,
              tags,
              liveDemoUrl: '#',
              githubUrl: '#',
            };

            onSaveProjects([...projects, newProject]);
            reply = `✅ **PROJECT ADDED SUCCESSFULLY!**\n\n` +
              `• **Title**: ${title}\n` +
              `• **Category**: ${category}\n` +
              `• **Tags**: ${tags.join(', ') || '*None*'}\n` +
              `• **Description**: ${desc}`;
          } catch {
            reply = "❌ Failed to add project to the portfolio projects list.";
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'ai',
          text: reply,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <ChatBubble onClick={() => setIsOpen(!isOpen)} className={isOpen ? 'active' : ''} aria-label="AI Assistant">
        <Icon icon={isOpen ? "lucide:x" : "lucide:bot-message-square"} width={24} height={24} />
        {!isOpen && <PulseDot />}
      </ChatBubble>

      {/* Chat Drawer */}
      {isOpen && (
        <ChatContainer>
          <ChatHeader>
            <div className="header-info">
              <Icon icon="lucide:bot" width={22} height={22} style={{ color: '#1a73e8' }} />
              <div>
                <h4>AI Admin Assistant</h4>
                <div className="status"><span className="dot" /> Online</div>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <Icon icon="lucide:x" width={18} height={18} />
            </button>
          </ChatHeader>

          <MessageList>
            {messages.map((msg) => (
              <MessageItem key={msg.id} className={msg.sender}>
                <div className="bubble">
                  {msg.text.split('\n').map((line, idx) => (
                    <p key={idx} style={{ margin: 0, minHeight: line === '' ? '0.5rem' : 'auto' }}>
                      {/* Bold parsing logic */}
                      {line.split('**').map((chunk, cIdx) => 
                        cIdx % 2 === 1 ? <strong key={cIdx}>{chunk}</strong> : chunk
                      )}
                    </p>
                  ))}
                </div>
                <div className="time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </MessageItem>
            ))}
            {isTyping && (
              <MessageItem className="ai">
                <div className="bubble typing">
                  <span />
                  <span />
                  <span />
                </div>
              </MessageItem>
            )}
            <div ref={chatEndRef} />
          </MessageList>

          <SuggestionChips>
            <button onClick={() => handleSend('show stats')}>📊 Stats</button>
            <button onClick={() => handleSend('help')}>❓ Help</button>
            <button onClick={() => handleSend('add task Review portfolio on 2026-08-25 desc Final check')}>📝 Add Task</button>
          </SuggestionChips>

          <ChatInputForm onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}>
            <input
              type="text"
              placeholder="Ask me to add tasks or projects..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" disabled={!inputValue.trim()} aria-label="Send message">
              <Icon icon="lucide:send-horizontal" width={18} height={18} />
            </button>
          </ChatInputForm>
        </ChatContainer>
      )}
    </>
  );
};

// Keyframe Animations
const pulse = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(26, 115, 232, 0.5); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(26, 115, 232, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(26, 115, 232, 0); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

// Styled Components
const ChatBubble = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #1a73e8;
  color: #ffffff;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 16px rgba(26, 115, 232, 0.4);
  cursor: pointer;
  z-index: 9999;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: scale(1.08);
    background: #1557b0;
    box-shadow: 0 6px 20px rgba(26, 115, 232, 0.5);
  }

  &.active {
    background: #475569;
    box-shadow: 0 4px 16px rgba(71, 85, 105, 0.4);
    transform: rotate(90deg);
  }

  @media (max-width: 768px) {
    bottom: 80px; /* offset to avoid blocking mobile nav */
  }
`;

const PulseDot = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #10b981;
  border: 2px solid #ffffff;
  animation: ${pulse} 2s infinite;
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 96px;
  right: 24px;
  width: 380px;
  height: 500px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(26, 115, 232, 0.15);
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  z-index: 9998;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${slideIn} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  @media (max-width: 480px) {
    width: calc(100% - 32px);
    right: 16px;
    left: 16px;
    height: 450px;
    bottom: 148px;
  }
`;

const ChatHeader = styled.div`
  background: #ffffff;
  border-bottom: 1px solid #eaeaea;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    h4 {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 700;
      color: #0b1e30;
    }

    .status {
      font-size: 0.75rem;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 0.25rem;

      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #10b981;
        display: inline-block;
      }
    }
  }

  .close-btn {
    border: none;
    background: transparent;
    color: #64748b;
    cursor: pointer;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 0.2s;

    &:hover {
      background: #f1f5f9;
      color: #334155;
    }
  }
`;

const MessageList = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f8fafc;
`;

const MessageItem = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 80%;

  &.user {
    align-self: flex-end;
    .bubble {
      background: #1a73e8;
      color: #ffffff;
      border-radius: 12px 12px 0 12px;
    }
    .time {
      align-self: flex-end;
    }
  }

  &.ai {
    align-self: flex-start;
    .bubble {
      background: #ffffff;
      color: #1e293b;
      border: 1px solid #e2e8f0;
      border-radius: 12px 12px 12px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    .time {
      align-self: flex-start;
    }
  }

  .bubble {
    padding: 0.75rem 1rem;
    font-size: 0.88rem;
    line-height: 1.45;
    word-break: break-word;

    p {
      margin-bottom: 0.5rem;
      &:last-child {
        margin-bottom: 0;
      }
    }

    &.typing {
      display: flex;
      gap: 0.25rem;
      align-items: center;
      padding: 0.75rem;

      span {
        width: 6px;
        height: 6px;
        background: #94a3b8;
        border-radius: 50%;
        animation: ${bounce} 1s infinite ease-in-out;

        &:nth-child(2) { animation-delay: 0.2s; }
        &:nth-child(3) { animation-delay: 0.4s; }
      }
    }
  }

  .time {
    font-size: 0.7rem;
    color: #94a3b8;
    margin-top: 0.25rem;
  }
`;

const SuggestionChips = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #ffffff;
  overflow-x: auto;
  border-top: 1px solid #f1f5f9;

  &::-webkit-scrollbar {
    display: none;
  }

  button {
    white-space: nowrap;
    padding: 0.35rem 0.75rem;
    border-radius: 20px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    color: #475569;
    font-size: 0.78rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #eff6ff;
      border-color: #bfdbfe;
      color: #1a73e8;
    }
  }
`;

const ChatInputForm = styled.form`
  display: flex;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border-top: 1px solid #eaeaea;
  gap: 0.5rem;
  align-items: center;

  input {
    flex: 1;
    border: 1px solid #e2e8f0;
    border-radius: 24px;
    padding: 0.6rem 1rem;
    font-size: 0.88rem;
    outline: none;
    transition: border 0.2s;

    &:focus {
      border-color: #1a73e8;
    }
  }

  button {
    background: #1a73e8;
    color: #ffffff;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: opacity 0.2s;

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background: #1557b0;
    }
  }
`;

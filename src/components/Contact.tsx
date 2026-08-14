import React, { useState } from 'react';
import styled from 'styled-components';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    _honey: '',
  });

  const [status, setStatus] = useState<{ text: string; isError: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitBtnText, setSubmitBtnText] = useState('Send Message');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if honey pot is filled
    if (formData._honey) {
      return;
    }

    setSubmitting(true);
    setSubmitBtnText('Sending...');
    setStatus(null);

    const formEndpoint = 'https://formsubmit.co/ajax/thabisomaqhawengwenya@gmail.com';

    // Prepare body
    const bodyData = new FormData();
    bodyData.append('name', formData.name);
    bodyData.append('email', formData.email);
    bodyData.append('subject', formData.subject);
    bodyData.append('message', formData.message);
    bodyData.append('_subject', 'New portfolio message from Maqhawe');
    bodyData.append('_template', 'table');
    bodyData.append('_url', window.location.href);

    try {
      const response = await fetch(formEndpoint, {
        method: 'POST',
        body: bodyData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('The message could not be sent.');
      }

      setSubmitBtnText('Message Sent');
      setStatus({
        text: 'Your message has been sent successfully.',
        isError: false,
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        _honey: '',
      });
    } catch {
      setSubmitBtnText('Send Message');
      setStatus({
        text: 'Message failed to send. Please try again in a moment.',
        isError: true,
      });
    } finally {
      setTimeout(() => {
        setSubmitBtnText('Send Message');
        setSubmitting(false);
      }, 1800);
    }
  };

  return (
    <StyledContact className="section contact-section" id="contact">
      <div className="container section-header section-header-center reveal is-visible">
        <h2>Let's Work Together</h2>
      </div>

      <div className="container contact-panel reveal is-visible">
        <form className="contact-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="contact-honey">
            Leave this field empty
          </label>
          <input
            className="sr-only"
            id="contact-honey"
            name="_honey"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData._honey}
            onChange={handleChange}
          />

          <label className="sr-only" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            required
            value={formData.name}
            onChange={handleChange}
          />

          <label className="sr-only" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Your email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <label className="sr-only" htmlFor="subject">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="Subject"
            required
            value={formData.subject}
            onChange={handleChange}
          />

          <label className="sr-only" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Message"
            required
            value={formData.message}
            onChange={handleChange}
          />

          <button className="btn btn-primary form-submit" type="submit" disabled={submitting}>
            {submitBtnText}
          </button>
          {status && (
            <p className={`form-status ${status.isError ? 'is-error' : ''}`} role="status" aria-live="polite">
              {status.text}
            </p>
          )}
        </form>

        <aside className="contact-copy">
          <p>
            I create responsive, visually polished interfaces for personal brands, products, and modern businesses.
            If you want a site that feels clean, confident, and memorable, I'd love to hear about it.
          </p>

          <ul className="contact-points">
            <li>Website Development</li>
            <li>Portfolio Design</li>
            <li>Landing Page Design</li>
            <li>Full-Stack Development</li>
            <li>Debugging &amp; Maintenance</li>
          </ul>
        </aside>
      </div>
    </StyledContact>
  );
};

const StyledContact = styled.section`
  padding-bottom: 2.75rem;

  .section-header {
    margin-bottom: 1.35rem;

    h2 {
      margin: 0;
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 700;
      text-shadow: 0 0 18px rgba(0, 0, 244, 0.18);
    }
  }

  .section-header-center {
    text-align: center;
  }

  .contact-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.3rem;
    padding: 1.25rem;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    box-shadow:
      var(--shadow),
      0 0 36px rgba(0, 0, 244, 0.08);
  }

  .contact-form {
    display: grid;
    gap: 0.85rem;

    input,
    textarea {
      width: 100%;
      padding: 0.9rem 1rem;
      border: 1px solid rgba(0, 0, 244, 0.8);
      border-radius: 14px;
      background: var(--input-bg);
      color: var(--input-text);
      resize: vertical;
      transition:
        border-color var(--transition),
        box-shadow var(--transition);

      &::placeholder {
        color: var(--input-placeholder);
      }

      &:focus {
        outline: none;
        border-color: var(--input-focus-border);
        box-shadow: 0 0 0 4px rgba(0, 0, 244, 0.22);
      }
    }
  }

  .form-submit {
    width: 100%;
    cursor: pointer;
  }

  .form-status {
    min-height: 1.4rem;
    margin: 0.15rem 0 0;
    color: var(--form-status-success);
    font-size: 0.88rem;

    &.is-error {
      color: var(--form-status-error);
    }
  }

  .contact-copy {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    p {
      margin: 0;
      color: var(--muted);
      font-size: 0.92rem;
    }
  }

  .contact-points {
    padding-left: 1.1rem;
    margin: 1rem 0 1.4rem;
    color: var(--contact-list-text);

    li {
      margin-bottom: 0.45rem;
    }
  }

  @media (max-width: 960px) {
    .contact-panel {
      grid-template-columns: 1fr;
    }
  }
`;

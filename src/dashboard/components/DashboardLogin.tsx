import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup 
} from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';

interface DashboardLoginProps {
  theme: 'light' | 'dark';
  onBack: () => void;
}

export const DashboardLogin: React.FC<DashboardLoginProps> = ({ theme, onBack }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg('');

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      // Simplify error messages for standard user visibility
      let message = 'Authentication failed. Please verify credentials.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        message = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already registered.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password must be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg('Google Sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledLoginContainer className={theme === 'dark' ? 'dark-theme' : ''}>
      <div className="login-card">
        <button className="back-btn" onClick={onBack} aria-label="Back to Portfolio">
          <Icon icon="lucide:arrow-left" width={18} height={18} />
          <span>Back to Portfolio</span>
        </button>

        <div className="logo-header">
          <div className="logo-icon">
            <img
              src={theme === 'light' ? '/images/p.logo.dark.png' : '/images/p.logo.light.png'}
              alt="Logo"
              className="logo-img"
            />
          </div>
          <h2>Admin Dashboard</h2>
          <p>{isSignUp ? 'Create an administrator account' : 'Sign in to access your dashboard'}</p>
        </div>

        {errorMsg && (
          <div className="error-banner">
            <Icon icon="lucide:alert-circle" width={18} height={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleEmailAuth}>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <div className="input-wrapper">
              <Icon className="input-icon" icon="lucide:mail" width={18} height={18} />
              <input
                id="login-email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-wrapper">
              <Icon className="input-icon" icon="lucide:lock" width={18} height={18} />
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? (
              <span className="spinner-small" />
            ) : (
              <span>{isSignUp ? 'Create Admin Account' : 'Sign In'}</span>
            )}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button className="google-btn" onClick={handleGoogleSignIn} disabled={loading} type="button">
          <Icon icon="logos:google-icon" width={18} height={18} />
          <span>Continue with Google</span>
        </button>

        <div className="toggle-mode">
          <button onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }} type="button">
            {isSignUp ? 'Already have an account? Sign In' : "New administrator? Create Account"}
          </button>
        </div>
      </div>
    </StyledLoginContainer>
  );
};

const StyledLoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f3f6fc;
  color: #333;
  padding: 1.5rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  transition: background 0.3s ease, color 0.3s ease;

  &.dark-theme {
    background: #090d16;
    color: #f8fafc;

    .login-card {
      background: #0f172a;
      border-color: #1e293b;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }

    .back-btn {
      color: #94a3b8;
      &:hover {
        color: #f8fafc;
        background: #1e293b;
      }
    }

    .logo-icon {
      background: #1e293b;
    }

    .logo-header p {
      color: #94a3b8;
    }

    .input-wrapper {
      border-color: #334155;
      background: #1e293b;

      input {
        color: #f8fafc;
        &::placeholder {
          color: #64748b;
        }
      }

      .input-icon {
        color: #64748b;
      }

      &:focus-within {
        border-color: #38bdf8;
        box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
      }
    }

    label {
      color: #94a3b8;
    }

    .divider {
      &::before, &::after {
        background: #1e293b;
      }
      span {
        color: #64748b;
        background: #0f172a;
      }
    }

    .google-btn {
      background: #1e293b;
      border-color: #334155;
      color: #f8fafc;

      &:hover {
        background: #334155;
      }
    }

    .toggle-mode button {
      color: #38bdf8;
      &:hover {
        color: #7dd3fc;
      }
    }
  }

  .login-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 1.25rem;
    padding: 2.25rem 2rem;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    position: relative;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #64748b;
    font-size: 0.84rem;
    font-weight: 600;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    transition: all 180ms ease;

    &:hover {
      color: #0f172a;
      background: #f1f5f9;
    }
  }

  .logo-header {
    text-align: center;
    margin-bottom: 1.75rem;

    .logo-icon {
      background: #eff6ff;
      width: 3rem;
      height: 3rem;
      border-radius: 12px;
      display: inline-grid;
      place-items: center;
      margin-bottom: 1rem;
    }

    .logo-img {
      width: 1.8rem;
      height: auto;
    }

    h2 {
      margin: 0;
      font-size: 1.35rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    p {
      margin: 0.35rem 0 0;
      font-size: 0.88rem;
      color: #64748b;
    }
  }

  .error-banner {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: #fef2f2;
    border: 1px solid #fee2e2;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    color: #b91c1c;
    font-size: 0.82rem;
    font-weight: 500;
    margin-bottom: 1.25rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.15rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    text-align: left;
  }

  label {
    font-size: 0.82rem;
    font-weight: 600;
    color: #475569;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 0.65rem 0.85rem;
    transition: all 180ms ease;

    .input-icon {
      color: #94a3b8;
    }

    input {
      border: 0;
      background: transparent;
      outline: none;
      width: 100%;
      font-size: 0.88rem;
      color: #0f172a;

      &::placeholder {
        color: #94a3b8;
      }
    }

    &:focus-within {
      border-color: #1a73e8;
      box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.15);
    }
  }

  .submit-btn {
    background: #1a73e8;
    color: #fff;
    border: 0;
    border-radius: 8px;
    padding: 0.75rem;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 180ms ease;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background: #1557b0;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .divider {
    position: relative;
    text-align: center;
    margin: 1.25rem 0;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      height: 1px;
      background: #e2e8f0;
      z-index: 1;
    }

    span {
      position: relative;
      z-index: 2;
      background: #fff;
      padding: 0 0.75rem;
      font-size: 0.76rem;
      color: #94a3b8;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.05em;
    }
  }

  .google-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    border: 1px solid #cbd5e1;
    background: #fff;
    color: #334155;
    border-radius: 8px;
    padding: 0.7rem;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 180ms ease;
    width: 100%;

    &:hover {
      background: #f8fafc;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .toggle-mode {
    margin-top: 1.5rem;
    text-align: center;

    button {
      font-size: 0.82rem;
      font-weight: 600;
      color: #1a73e8;
      border: 0;
      background: transparent;
      cursor: pointer;
      transition: color 180ms ease;

      &:hover {
        color: #1557b0;
        text-decoration: underline;
      }
    }
  }

  .spinner-small {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

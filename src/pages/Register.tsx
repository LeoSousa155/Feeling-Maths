import { FormEvent, useState } from 'react';
import './Login.css';
import './Register.css';

type RegisterProps = {
  onRegister: (name: string, email: string) => void;
  onNavigateToLogin: () => void;
};

export default function Register({ onRegister, onNavigateToLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name && email && password) {
      onRegister(name, email);
    }
  };

  return (
    <div className="login-wrapper">
      <header className="login-header">
        <div className="logo">Feeling Maths</div>
      </header>

      <main className="login-main">
        <div className="reg-content">

          {/* Left: Form */}
          <div className="login-right" style={{ maxWidth: '488px', margin: 'auto 0' }}>
            <div className="form-header">
              <h1>Begin Your Journey</h1>
              <p>Create a sanctuary for your mathematical growth. No pressure, just progress.</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Alex Chen"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="20" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="alex@mindful.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Create Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="16" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="login-btn" style={{ background: 'linear-gradient(90deg, #0060ad 0%, #68abff 100%)' }}>
                Sign Up
              </button>
            </form>

            <div className="signup-prompt">
              Already practicing? <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToLogin(); }}>Log in here</a>
            </div>

            <div className="reg-security-note">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>YOUR DATA IS SECURED WITH ARCHITECTURAL-GRADE ENCRYPTION</span>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="reg-visual-side">
            {/* Floating badge */}
            <div className="reg-stress-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#006a6c" strokeWidth="2">
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
                <path d="M8 12s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
              <span>STRESS-FREE ZONE</span>
            </div>

            {/* Chalkboard visual */}
            <div className="reg-visual-card">
              <div className="reg-chalkboard">
                <div className="chalk-f">ax² + bx + c = 0</div>
                <div className="chalk-f sm">∫ f(x) dx</div>
                <div className="chalk-f md">∑ (n=1)^∞</div>
                <div className="chalk-f sm" style={{ opacity: 0.4 }}>lim(x→∞)</div>
                <div className="chalk-f md" style={{ opacity: 0.35 }}>∂f/∂x</div>
              </div>

              {/* Glass overlay — community message */}
              <div className="reg-glass-overlay">
                <div className="reg-overlay-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
                <div className="reg-overlay-text">
                  <h3>Join our community</h3>
                  <p>Become part of a global collective of 40,000+ learners who prioritize cognitive clarity and emotional well-being over rote memorization.</p>
                  <div className="reg-avatar-stack">
                    <div className="reg-av" style={{ background: '#e7eff5' }} />
                    <div className="reg-av" style={{ background: '#d9e4ec' }} />
                    <div className="reg-av" style={{ background: '#83fba5' }} />
                    <div className="reg-av reg-av-count">+12k</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="login-footer">
        <div className="footer-content">
          <div className="footer-logo">Feeling Maths</div>
          <div className="footer-links">
            <a href="#">PRIVACY</a>
            <a href="#">TERMS</a>
            <a href="#">ACCESSIBILITY</a>
            <a href="#">RESEARCH</a>
          </div>
          <div className="footer-copyright">
            © 2024 FEELING MATHS. DESIGNED FOR COGNITIVE CLARITY.
          </div>
        </div>
      </footer>
    </div>
  );
}

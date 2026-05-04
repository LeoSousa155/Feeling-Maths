import { FormEvent } from 'react';
import './Login.css';

type LoginProps = {
  onLogin: (email: string) => void;
  onNavigateToRegister?: () => void;
};

export default function Login({ onLogin, onNavigateToRegister }: LoginProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    if (email) {
      onLogin(email);
    }
  };

  return (
    <div className="login-wrapper">
      <header className="login-header">
        <div className="logo">Feeling Maths</div>
      </header>
      
      <main className="login-main">
        <div className="login-content">
          
          <div className="login-left">
            <div className="image-container">
              <img src="/galileu.png" alt="Galileo Galilei" className="portrait" />
            </div>

            <div className="quote-container">
              <h2>"Matemática é a linguagem com que Deus escreveu o universo"</h2>
              <p className="author">— GALILEU GALILEI</p>
            </div>

            <div className="mindfulness-tip">
              <div className="tip-icon-bg">
                <svg width="19" height="20" viewBox="0 0 24 24" fill="none" stroke="#006e36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
              </div>
              <div className="tip-content">
                <span className="tip-title">MINDFULNESS TIP</span>
                <p>Inspira profundamente antes de começar. O teu potêncial é sem fim.</p>
              </div>
            </div>
          </div>

          <div className="login-right">
            <div className="login-form-container">
              <div className="form-header">
                <h1>Bem vindo de volta</h1>
                <p>Pronto para continuar a tua jornada cognitiva?</p>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="20" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </span>
                    <input type="email" name="email" placeholder="name@example.com" required />
                  </div>
                </div>

                <div className="input-group">
                  <div className="label-row">
                    <label>Password</label>
                    <a href="#" className="forgot-password">Esqueceste palavra passe?</a>
                  </div>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="16" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </span>
                    <input type="password" name="password" placeholder="••••••••" required />
                  </div>
                </div>

                <button type="submit" className="login-btn">Log In</button>
              </form>
              
              <div className="signup-prompt">
                Não tens uma conta? <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToRegister?.(); }}>Criar Conta</a>
              </div>

              <div className="divider">
                <span>OU CONTINUA COM</span>
              </div>

              <div className="social-buttons">
                <button className="social-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button className="social-btn">
                  <svg width="17" height="21" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.43c0 0-3.325.321-5.11 2.518-.002.002-.003.003-.005.005-.125.15-.226.315-.316.486C9.972 5.397 9.87 6.474 9.87 6.474s3.15-.353 4.97-2.457c0 0 .12-.142.23-.306.84-.963 1.295-2.28 1.295-2.28zm5.074 13.91s-1.87 5.568-4.47 8.35c-2.31 2.47-3.86 2.21-4.87 1.83-1.02-.38-2.61-1.04-4.5-1.04-1.9 0-3.58.74-4.54 1.09-1.03.38-2.73.74-4.88-1.55-2.61-2.78-4.48-8.34-4.48-8.34C-2.45 6.64 4.09 6.2 5.92 7.75c1.47 1.25 2.15 1.48 3.51 1.48 1.4 0 2.4-.38 3.79-1.39 1.76-1.28 4.24-1.52 6.11-.29 1.91 1.26 2.88 3.44 2.88 3.44s-3.76 1.4-3.73 5.43c.03 4.03 3.06 5.25 3.06 5.25z"/></svg>
                  Apple
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="login-footer">
        <div className="footer-content">
          <div className="footer-logo">Feeling Maths</div>
          <div className="footer-links">
            <a href="#">PRIVACIDADE</a>
            <a href="#">TERMOS</a>
            <a href="#">ACESSIBILIDADE</a>
            <a href="#">PESQUISA</a>
          </div>
          <div className="footer-copyright">
            © 2024 FEELING MATHS. FEITO PARA CLARIDADE COGNITIVA.
          </div>
        </div>
      </footer>
    </div>
  );
}

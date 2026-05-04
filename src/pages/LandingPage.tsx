import './LandingPage.css';

type LandingPageProps = {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
};

export default function LandingPage({ onNavigateToLogin, onNavigateToRegister }: LandingPageProps) {
  return (
    <div className="home-wrapper">
      <header className="home-header">
        <div className="home-logo">Feeling Maths</div>
        <div className="home-header-icons">
          <button className="icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </button>
          <button className="icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
          </button>
          <button className="avatar-btn" onClick={onNavigateToLogin}>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=e7eff5" alt="Login" />
          </button>
        </div>
      </header>

      <main className="home-main">
        <section className="home-hero">
          <div className="home-hero-left">
            <div className="hero-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
              <span>APRENDIZAGEM EMOCIONALMENTE-ADAPTATIVA</span>
            </div>
            
            <h1 className="home-title">
              Matemática<br/>
              que<br/>
              <span>sente-se correta.</span>
            </h1>
            
            <p className="home-subtitle">
              A primeira plataforma de matemática que ouve as tuas emoções.<br/>
              Usando IA em tempo real, <strong>Feeling Maths</strong> ajusta os desafios<br/>
              Quando estás frustrado e acelera quando estás<br/>
              no fluxo.
            </p>

            <div className="home-actions">
              <button className="btn-primary" onClick={onNavigateToRegister}>
                Começa Grátis
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
              <button className="btn-secondary">
                Como Funciona
              </button>
            </div>

            <div className="home-stats">
              <div className="stat-item">
                <h3>85%</h3>
                <p>Redução de Ansiedade</p>
              </div>
              <div className="stat-item">
                <h3>2.4x</h3>
                <p>Retenção Mais Rápida</p>
              </div>
              <div className="stat-item">
                <h3>12k+</h3>
                <p>Estudantes Ativos</p>
              </div>
            </div>
          </div>

          <div className="home-hero-right">
            <div className="preview-card-wrapper">
              <div className="preview-card">
                <div className="preview-card-image">
                  <div className="math-overlay">
                    <div className="equation-box">
                      <div className="eq-text">f(x) = ∫ 2x dx</div>
                      <div className="eq-sub">Dificuldade: Ajustada ao estado de foco</div>
                    </div>
                  </div>
                </div>
                
                <div className="preview-card-content">
                  <h3>O Motor de Estado Emocional</h3>
                  <p>A interface muda baseada no seu feedback biométrico. Estás confuso? A UI simplifica automaticamente.</p>
                  
                  <div className="preview-social">
                    <div className="preview-avatars">
                      <div className="p-avatar" style={{background: '#e2e8f0'}}></div>
                      <div className="p-avatar" style={{background: '#cbd5e1', left: '-10px'}}></div>
                      <div className="p-avatar" style={{background: '#94a3b8', left: '-20px'}}></div>
                    </div>
                    <span className="join-text">Junta-te a +400 estudantes a estudar agora</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="home-bento">
          <div className="bento-card">
            <div className="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0060ad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
            </div>
            <h3>Detetar Emoções</h3>
            <p>Visão de computador avançada deteta mudanças substis que demonstram frustração ou aborrecimento em tempo real.</p>
          </div>

          <div className="bento-card">
            <div className="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#006e36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="6.5"></line></svg>
            </div>
            <h3>Base Dinâmica</h3>
            <p>Dicas e visualizações que se adaptam ao teu estado mental, providenciando ajuda apenas quando realmente necessário.</p>
          </div>

          <div className="bento-card">
            <div className="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </div>
            <h3>Prespetivas Cognitivas</h3>
            <p>Vai além de pontuações. Entende os teus gatilhos emocionais e aprende nos melhores momentos.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

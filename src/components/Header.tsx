import './Header.css';

type HeaderProps = {
  user: { name: string; email: string };
  activePath?: 'home' | 'exercises' | 'theory' | 'profile';
  onNavigateToHome?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToExercises?: () => void;
  onNavigateToTheory?: () => void;
};

export default function Header({ user, activePath = 'home', onNavigateToHome, onNavigateToProfile, onNavigateToExercises, onNavigateToTheory }: HeaderProps) {
  return (
    <header className="main-header">
      <div className="header-left">
        <div className="header-logo">Feeling Maths</div>
        <nav className="header-nav">
          <button className={`nav-btn ${activePath === 'home' ? 'active' : ''}`} onClick={onNavigateToHome}>Página inicial</button>
          <button className={`nav-btn ${activePath === 'exercises' ? 'active' : ''}`} onClick={onNavigateToExercises}>Exercícios</button>
          <button className={`nav-btn ${activePath === 'theory' ? 'active' : ''}`} onClick={onNavigateToTheory}>Teoria</button>
        </nav>
      </div>
      
      <div className="header-right">
        <button className="header-icon-btn" title="Notificações" style={{ position: 'relative' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <span style={{ 
            position: 'absolute', 
            top: '-2px', 
            right: '-2px', 
            width: '8px', 
            height: '8px', 
            background: '#dc2626', 
            borderRadius: '50%', 
            border: '2px solid #ffffff' 
          }}></span>
        </button>
        <button className="header-icon-btn" title="As tuas conquistas">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
        </button>
        <button className={`header-avatar-btn ${activePath === 'profile' ? 'active-avatar' : ''}`} onClick={onNavigateToProfile}>
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=e7eff5`} alt={user.name} />
        </button>
      </div>
    </header>
  );
}

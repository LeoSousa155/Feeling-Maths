import Header from '../components/Header';
import './Profile.css';
import questionsData from '../data/questions.json';

type Progress = {
  [themeId: string]: {
    completed: number;
    total: number;
    score: number;
  }
};

type ProfileProps = {
  user: { name: string; email: string };
  progress: Progress;
  streak: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  onSelectDifficulty: (diff: 'Beginner' | 'Intermediate' | 'Advanced') => void;
  onNavigateToHome: () => void;
  onNavigateToProfile: () => void;
  onNavigateToExercises: () => void;
  onNavigateToTheory: () => void;
  onSelectTheme: (themeId: string) => void;
};

export default function Profile({ user, progress, streak, difficulty, onSelectDifficulty, onNavigateToHome, onNavigateToProfile, onNavigateToExercises, onNavigateToTheory, onSelectTheme }: ProfileProps) {
  // Calculate dynamic stats
  let totalCompleted = 0;
  let highestMastery = { name: 'Calculus Intuition', percentage: 0 };
  
  for (const [themeId, data] of Object.entries(progress)) {
    totalCompleted += data.completed;
    const percentage = Math.round((data.score / data.total) * 100);
    if (percentage > highestMastery.percentage) {
      const themeName = questionsData.themes.find(t => t.id === themeId)?.name || themeId;
      highestMastery = { name: themeName, percentage };
    }
  }

  const currentLevel = Math.floor(totalCompleted / 3) + 1;
  const xp = totalCompleted * 150;
  const nextLevelXp = currentLevel * 600;

  return (
    <div className="profile-wrapper">
      <Header 
        user={user} 
        activePath="profile" 
        onNavigateToHome={onNavigateToHome} 
        onNavigateToProfile={onNavigateToProfile} 
        onNavigateToExercises={onNavigateToExercises}
        onNavigateToTheory={onNavigateToTheory}
      />

      <main className="profile-main">
        <div className="profile-header-text">
          <h1>Perfil</h1>
          <p>Gere o teu perfil, preferencias de aprendizagem e definições de segurança.</p>
        </div>

        <div className="profile-content">
          {/* Left Column */}
          <div className="profile-left">
            {/* User Card */}
            <div className="user-card">
              <div className="avatar-wrapper">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=e7eff5`} alt={user.name} />
                <div className="student-badge">Trabalho de estudante</div>
              </div>
              
              <h2>{user.name}</h2>
              <p className="learner-type">Aluno Avançado</p>

              <div className="level-info">
                <span className="level-text">Nível {currentLevel}</span>
                <span className="xp-text">{xp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${(xp / nextLevelXp) * 100}%` }}></div>
              </div>
            </div>

            {/* Learning Profile */}
            <div className="learning-profile-card">
              <div className="lp-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0060ad" strokeWidth="2"><path d="M12 2a5 5 0 0 1 5 5v2a5 5 0 0 1-5 5 5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z"></path><path d="M12 14v7"></path><path d="M9 21h6"></path></svg>
                <h3>Perfil de Aprendizagem</h3>
              </div>
              
              <div className="lp-item">
                <span className="lp-label">FORÇA PRINCIPAL</span>
                <span className="lp-value">{highestMastery.percentage > 0 ? highestMastery.name : 'Calculus Intuition'}</span>
              </div>
              
              <div className="lp-item">
                <span className="lp-label">MODO DE FOCO</span>
                <span className="lp-value">Explorador Consciênte</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="profile-right">
            
            <div className="preferences-card">
              <h2>Preferências Pessoais</h2>
              
              <div className="section-block">
                <span className="section-label">NÍVEL DE DIFICULDADE MATEMÁTICA</span>
                <div className="options-grid">
                  <div className={`option-card ${difficulty === 'Beginner' ? 'selected' : ''}`} onClick={() => onSelectDifficulty('Beginner')}>
                    <div className={`opt-icon ${difficulty === 'Beginner' ? 'bg-blue' : 'bg-light-blue'}`}>1</div>
                    <h4>Iniciante</h4>
                    <p>Conceitos fundamentais</p>
                    {difficulty === 'Beginner' && (
                      <div className="check-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      </div>
                    )}
                  </div>
                  
                  <div className={`option-card ${difficulty === 'Intermediate' ? 'selected' : ''}`} onClick={() => onSelectDifficulty('Intermediate')}>
                    <div className={`opt-icon ${difficulty === 'Intermediate' ? 'bg-blue' : 'bg-light-blue'}`}>2</div>
                    <h4>Intermediate</h4>
                    <p>Resolução de problemas complexos</p>
                    {difficulty === 'Intermediate' && (
                      <div className="check-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      </div>
                    )}
                  </div>
                  
                  <div className={`option-card ${difficulty === 'Advanced' ? 'selected' : ''}`} onClick={() => onSelectDifficulty('Advanced')}>
                    <div className={`opt-icon ${difficulty === 'Advanced' ? 'bg-blue' : 'bg-light-blue'}`}>3</div>
                    <h4>Avançado</h4>
                    <p>Abstração Teórica</p>
                    {difficulty === 'Advanced' && (
                      <div className="check-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <hr className="divider" />

              <div className="section-block">
                <h3>Segurança e Conta</h3>
                <div className="action-buttons-grid">
                  <button className="action-btn">
                    <div className="action-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0060ad" strokeWidth="2"><path d="M2 12a10 10 0 1 0 10-10"></path><path d="M12 2v4"></path></svg>
                    </div>
                    <div className="action-text">
                      <span className="title">Mudar paravra passe</span>
                      <span className="desc">Atualizar a tua segurança</span>
                    </div>
                    <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>

                  <button className="action-btn">
                    <div className="action-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0060ad" strokeWidth="2"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>
                    </div>
                    <div className="action-text">
                      <span className="title">Mudar email</span>
                      <span className="desc">{user.email}</span>
                    </div>
                    <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>
              </div>

              <div className="section-block" style={{ marginTop: '32px' }}>
                <span className="section-label">Cursos</span>
                <div className="options-grid">
                  {questionsData.themes.map((theme, idx) => {
                    const themeProgress = progress[theme.id] || { completed: 0, total: theme.questions.length };
                    const isComplete = themeProgress.completed === themeProgress.total && themeProgress.total > 0;
                    const isSelected = idx === 1; // Mocking the second one as selected to match design
                    
                    return (
                      <div key={theme.id} className={`option-card ${isSelected ? 'selected' : ''}`} onClick={() => onSelectTheme(theme.id)}>
                        <div className={`opt-icon ${isSelected ? 'bg-blue' : 'bg-light-blue'}`}>{idx + 1}</div>
                        <h4>{theme.name}</h4>
                        <p>{isComplete ? 'Completo' : `Inacabado ${themeProgress.completed}/${themeProgress.total}`}</p>
                        {isSelected && (
                          <div className="check-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Bottom Cards */}
            <div className="profile-bottom-cards">
              <div className="premium-card">
                <h3>Prespetivas Premium</h3>
                <p>Desbloqueaste uma análise emocional profunda para os teus módulos de cálculo.</p>
                <button className="btn-view-report">Ver Relatório</button>
              </div>

              <div className="streak-card">
                <div className="streak-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#006e36" strokeWidth="2"><path d="M12 15l-3-3m0 0l3-3m-3 3h8"></path><circle cx="12" cy="12" r="10"></circle></svg>
                </div>
                <span className="streak-title">Série Atual</span>
                <span className="streak-value">{streak} Dias</span>
                <span className="streak-desc">Mantém o momento!</span>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

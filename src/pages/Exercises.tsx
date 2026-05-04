import Header from '../components/Header';
import './Exercises.css';
import questionsData from '../data/questions.json';

type Progress = {
  [themeId: string]: {
    completed: number;
    total: number;
    score: number;
  }
};

type ExercisesProps = {
  user: { name: string; email: string };
  progress: Progress;
  onNavigateToHome: () => void;
  onNavigateToExercises: () => void;
  onNavigateToProfile: () => void;
  onNavigateToTheory: () => void;
  onSelectTheme: (themeId: string) => void;
};

export default function Exercises({ user, progress, onNavigateToHome, onNavigateToExercises, onNavigateToProfile, onNavigateToTheory, onSelectTheme }: ExercisesProps) {
  // We'll map the actual JSON themes to the first few cards, and then add the static ones from the design
  const activeThemes = questionsData.themes.map((theme, idx) => {
    const p = progress[theme.id] || { completed: 0, total: theme.questions.length, score: 0 };
    const pct = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
    
    // Assigning specific styles based on index to match the Figma mockup variety
    let styleType = 'blue'; // default
    if (idx === 0) styleType = 'green';
    if (idx === 2) styleType = 'cyan';

    return {
      id: theme.id,
      name: theme.name,
      desc: idx === 0 ? "Domine os principios base da teoria dos numeros e operações." :
            idx === 1 ? "Revelando o poder dos simbolos abstratos e relações." :
            "Parábolas, Quadráticas, e o poder da simetria.",
      badge: idx === 0 ? "FUNDAMENTOS" : idx === 2 ? "INTERMÉDIO" : null,
      pct,
      completed: p.completed,
      total: p.total,
      styleType
    };
  });

  return (
    <div className="exercises-wrapper">
      <Header 
        user={user} 
        activePath="exercises" 
        onNavigateToHome={onNavigateToHome} 
        onNavigateToExercises={onNavigateToExercises}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToTheory={onNavigateToTheory}
      />

      <main className="exercises-main">
        <div className="exercises-header-text">
          <h1>Jornada Matemática</h1>
          <p>Foca-te no processo, não no resultado. Uma abordagem consciente leva a um dominio mais profundo.</p>
        </div>

        <div className="exercises-grid">
          {activeThemes.map((theme) => (
            <div key={theme.id} className={`ex-card ${theme.styleType}-card`}>
              <div className="ex-card-header">
                <div className="ex-icon">
                  {theme.styleType === 'green' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>}
                  {theme.styleType === 'blue' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line></svg>}
                  {theme.styleType === 'cyan' && <span style={{ fontFamily: 'Work Sans', fontWeight: 'bold' }}>x²</span>}
                </div>
                {theme.badge && <div className={`ex-badge badge-${theme.styleType}`}>{theme.badge}</div>}
              </div>

              <h2>{theme.name}</h2>
              <p className="ex-desc">{theme.desc}</p>

              {theme.styleType === 'cyan' ? (
                <>
                  <div className="ex-learners">
                    <div className="learner-bubbles">
                      <div className="bubble"></div>
                      <div className="bubble"></div>
                      <div className="bubble"></div>
                    </div>
                    <span>42 alunos ativos</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${theme.pct}%` }}></div>
                  </div>
                </>
              ) : (
                <>
                  <div className="ex-progress-info">
                    <span className="ex-progress-label">{theme.pct > 80 ? `${theme.pct}% Mastery` : `${theme.pct}% Progress`}</span>
                    <span className="ex-progress-value">{theme.styleType === 'green' ? `${theme.completed}/${theme.total} Lessons` : 'In Progress'}</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className={`progress-bar-fill fill-${theme.styleType}`} style={{ width: `${theme.pct}%` }}></div>
                  </div>
                  <button className={`btn-continue btn-${theme.styleType}`} onClick={() => onSelectTheme(theme.id)}>
                    Continuar a Aprender
                  </button>
                </>
              )}
            </div>
          ))}

          {/* Locked Card: Derivatives */}
          <div className="ex-card locked-card">
            <div className="ex-card-header">
              <div className="ex-icon red">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h2>Derivatives</h2>
            <p className="ex-desc">Taxas de mudança e a linguagem de movimento.</p>
            
            <div className="locked-info-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>Atinge o Nível 6 para desbloquear ou obtem "Concentração consciente".</span>
            </div>
            <button className="btn-locked">Ver Requisitos</button>
          </div>

          {/* Upcoming Content 1 */}
          <div className="ex-card upcoming-card">
            <div className="ex-icon grey">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
            <h3>Conteúdo futuro</h3>
            <p>Cálculo Integral & Campos Vectoriais</p>
          </div>

          {/* Upcoming Content 2 */}
          <div className="ex-card upcoming-card">
            <div className="ex-icon grey">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M21 12H3"></path><path d="M12 3v18"></path></svg>
            </div>
            <h3>Teoria da Probabilidade</h3>
            <p>Desbloqueado ao Nível de Arquiteto 7</p>
          </div>
        </div>
      </main>
    </div>
  );
}

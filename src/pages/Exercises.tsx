import { useEffect } from 'react';
import Header from '../components/Header';
import { useEmotionDetector } from '../hooks/useEmotionDetector';
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
  const {
    videoRef,
    emotion,
    startDetection,
    stopDetection,
    error,
    detectionActive
  } = useEmotionDetector();

  useEffect(() => {
    startDetection();
    return () => stopDetection();
  }, []);

  const getDominantEmotion = () => {
    if (error || !detectionActive) return { name: 'Câmara Desligada', color: '#94a3b8' };
    if (!emotion) return { name: 'À procura de foco...', color: '#64748b' };
    
    const entries = Object.entries(emotion);
    const dominant = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    const emotionMap: any = {
      happy: { name: 'Contente', color: '#16a34a' },
      sad: { name: 'Pensativo', color: '#0284c7' },
      angry: { name: 'Frustrado', color: '#dc2626' },
      surprised: { name: 'Curioso', color: '#9333ea' },
      fearful: { name: 'Ansioso', color: '#ea580c' },
      disgusted: { name: 'Confuso', color: '#4b5563' },
      neutral: { name: 'Focado', color: '#0060ad' }
    };
    return emotionMap[dominant[0]] || { name: 'Estável', color: '#006e36' };
  };

  const currentEmotion = getDominantEmotion();

  // We'll map the actual JSON themes to the cards
  const activeThemes = questionsData.themes.map((theme, idx) => {
    const p = progress[theme.id] || { completed: 0, total: theme.questions.length, score: 0 };
    const pct = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
    
    // Assigning specific styles based on index to match the user's requested variety
    let styleType = 'blue'; 
    if (theme.id === 'algebra') styleType = 'green';
    if (theme.id === 'calculus') styleType = 'indigo';
    if (theme.id === 'set_theory') styleType = 'purple';
    if (idx === 2 && theme.id === 'geometry') styleType = 'cyan'; // Cyan variant for the 3rd card as requested

    return {
      id: theme.id,
      name: theme.name,
      desc: theme.id === 'algebra' ? "Domine os principios base da teoria dos numeros e operações." :
            theme.id === 'geometry' ? "Revelando o poder dos simbolos abstratos e relações." :
            theme.id === 'calculus' ? "Parábolas, Quadráticas, e o poder da simetria." :
            "Explora os conjuntos e a lógica fundamental.",
      badge: theme.id === 'algebra' ? "FUNDAMENTOS" : theme.id === 'calculus' ? "AVANÇADO" : theme.id === 'geometry' ? "INTERMÉDIO" : null,
      pct,
      completed: p.completed,
      total: p.total,
      styleType
    };
  });

  return (
    <div className="exercises-wrapper">
      <video ref={videoRef} autoPlay playsInline muted style={{ display: 'none' }} />
      <Header 
        user={user} 
        activePath="exercises" 
        onNavigateToHome={onNavigateToHome} 
        onNavigateToExercises={onNavigateToExercises}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToTheory={onNavigateToTheory}
      />

      <main className="exercises-main">
        <div className="exercises-header-section">
          <div className="exercises-header-text">
            <h1>Jornada Matemática</h1>
            <p>Foca-te no processo, não no resultado. Uma abordagem consciente leva a um dominio mais profundo.</p>
          </div>

          <div className={`camera-status-bar ${!detectionActive || error ? 'camera-off' : 'camera-on'}`}>
            <div className="status-indicator"></div>
            <div className="status-content">
              {!detectionActive || error ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16"></path><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path></svg>
                  <span>{error || 'Câmara desligada • Mentor offline'}</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  <span>Análise de Foco Ativa • Estado: <strong style={{ color: currentEmotion.color }}>{currentEmotion.name}</strong></span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="exercises-grid">
          {activeThemes.map((theme) => (
            <div key={theme.id} className={`ex-card ${theme.styleType}-card`}>
              <div className="ex-card-header">
                <div className="ex-icon">
                  {theme.styleType === 'green' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>}
                  {theme.styleType === 'blue' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line></svg>}
                  {theme.styleType === 'cyan' && <span style={{ fontFamily: 'Work Sans', fontWeight: 'bold' }}>x²</span>}
                  {theme.styleType === 'indigo' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7"/></svg>}
                  {theme.styleType === 'purple' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/></svg>}
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
                    <span className="ex-progress-value">{theme.completed}/{theme.total} Exercícios</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className={`progress-bar-fill fill-${theme.styleType}`} style={{ width: `${theme.pct}%` }}></div>
                  </div>
                  <button className={`btn-continue btn-${theme.styleType}`} onClick={() => onSelectTheme(theme.id)}>
                    {theme.pct === 0 ? 'Começar a Aprender' : 'Continuar Prática'}
                  </button>
                </>
              )}
            </div>
          ))}

          {/* Locked Card: Derivatives (Matches User Mockup) */}
          <div className="ex-card locked-card">
            <div className="ex-card-header">
              <div className="ex-icon red">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h2>Cálculo Diferencial</h2>
            <p className="ex-desc">Taxas de mudança e a linguagem de movimento.</p>
            
            <div className="locked-info-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>Atinge o Nível 6 para desbloquear ou obtém "Concentração consciente".</span>
            </div>
            <button className="btn-locked">Ver Requisitos</button>
          </div>

          {/* Upcoming Content placeholder 1 */}
          <div className="ex-card upcoming-card">
            <div className="ex-icon grey">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
            <h2>Cálculo Integral</h2>
            <p>Cálculo Integral & Campos Vectoriais em breve disponível.</p>
          </div>

          {/* Upcoming Content placeholder 2 */}
          <div className="ex-card upcoming-card">
            <div className="ex-icon grey">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M21 12H3"></path><path d="M12 3v18"></path></svg>
            </div>
            <h2>Probabilidades</h2>
            <p>Desbloqueado ao Nível de Arquiteto 7.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

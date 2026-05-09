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

  const activeThemes = questionsData.themes.map((theme) => {
    const p = progress[theme.id] || { completed: 0, total: theme.questions.length, score: 0 };
    const pct = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
    
    let styleType = 'blue';
    let badge = null;
    let desc = "Explora este tema e domina os conceitos através da prática.";

    if (theme.id === 'algebra') {
      styleType = 'green';
      badge = 'FUNDAMENTOS';
      desc = "Equações, variáveis e o equilíbrio das relações matemáticas.";
    } else if (theme.id === 'calculus') {
      styleType = 'indigo';
      badge = 'AVANÇADO';
      desc = "O estudo da mudança: domina derivadas, taxas de variação e movimento.";
    } else if (theme.id === 'geometry') {
      styleType = 'blue';
      badge = 'INTERMÉDIO';
      desc = "Entende o espaço: explora áreas, perímetros e o Teorema de Pitágoras.";
    } else if (theme.id === 'set_theory') {
      styleType = 'purple';
      badge = 'LÓGICA';
      desc = "A linguagem da lógica: aprende sobre uniões, interseções e conjuntos.";
    }

    return {
      id: theme.id,
      name: theme.name,
      desc,
      badge,
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
            <p>Foca-te no processo, não no resultado. Uma abordagem consciente leva a um domínio mais profundo.</p>
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
                  {theme.styleType === 'indigo' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7"/></svg>}
                  {theme.styleType === 'purple' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/></svg>}
                </div>
                {theme.badge && <div className={`ex-badge badge-${theme.styleType}`}>{theme.badge}</div>}
              </div>

              <h2>{theme.name}</h2>
              <p className="ex-desc">{theme.desc}</p>

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
            </div>
          ))}

          {/* Upcoming Content placeholder */}
          <div className="ex-card upcoming-card">
            <div className="ex-icon grey">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M21 12H3"></path><path d="M12 3v18"></path></svg>
            </div>
            <h2>Conteúdo Futuro</h2>
            <p>Teoria da Probabilidade & Estatística. Em breve disponível para aprenderes!</p>
          </div>
        </div>
      </main>
    </div>
  );
}

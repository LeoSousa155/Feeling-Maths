import { useEffect } from 'react';
import Header from '../components/Header';
import { useEmotionDetector } from '../hooks/useEmotionDetector';
import './Dashboard.css';
import questionsData from '../data/questions.json';

type Progress = {
  [themeId: string]: {
    completed: number;
    total: number;
    score: number;
  }
};

type DashboardProps = {
  user: { name: string; email: string };
  progress: Progress;
  streak: number;
  onSelectTheme: (themeId: string) => void;
  onNavigateToProfile: () => void;
  onNavigateToExercises: () => void;
  onNavigateToTheory: () => void;
};

export default function Dashboard({ user, progress, streak, onSelectTheme, onNavigateToProfile, onNavigateToExercises, onNavigateToTheory }: DashboardProps) {
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

  // Dominant emotion calculation
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

  // Calculate dynamic stats
  let totalCompleted = 0;
  let highestMastery = { name: 'Nenhum ainda', percentage: 0 };
  let activeThemeData = null;

  for (const [themeId, data] of Object.entries(progress)) {
    totalCompleted += data.completed;
    
    // Calculate mastery
    const percentage = Math.round((data.score / data.total) * 100);
    if (percentage > highestMastery.percentage) {
      const themeName = questionsData.themes.find(t => t.id === themeId)?.name || themeId;
      highestMastery = { name: themeName, percentage };
    }

    // Find first active theme
    if (data.completed > 0 && data.completed < data.total && !activeThemeData) {
      const theme = questionsData.themes.find(t => t.id === themeId);
      if (theme) {
        activeThemeData = {
          id: theme.id,
          name: theme.name,
          completionPercent: Math.round((data.completed / data.total) * 100)
        };
      }
    }
  }

  const currentLevel = Math.floor(totalCompleted / 3) + 1;

  return (
    <div className="dashboard-wrapper">
      <video ref={videoRef} autoPlay playsInline muted style={{ display: 'none' }} />
      <Header 
        user={user} 
        activePath="home" 
        onNavigateToProfile={onNavigateToProfile} 
        onNavigateToExercises={onNavigateToExercises}
        onNavigateToTheory={onNavigateToTheory}
      />

      <main className="dashboard-main">
        <div className="welcome-section">
          <h1 className="welcome-title">Bem vindo de volta, {user.name}!</h1>
          <p className="welcome-subtitle">
            Inspira fundo. Hoje está um lindo dia para descobrir os mistérios da matemática ao teu passo.
          </p>
        </div>

        <div className="top-cards">
          {/* Active Theme Card */}
          <div className="active-theme-card">
            {activeThemeData ? (
              <>
                <div className="badge-blue">TEMA ATIVO</div>
                <h2>Continuar {activeThemeData.name}</h2>
                <p>Dominar este tópico irá abrir as portas para calculo avançado. Estás a ir incrível!</p>
                
                <div className="progress-section">
                  <div className="progress-header">
                    <span className="progress-label">Completude do Curso</span>
                    <span className="progress-value">{activeThemeData.completionPercent}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${activeThemeData.completionPercent}%` }}></div>
                  </div>
                </div>

                <button className="btn-resume" onClick={() => onSelectTheme(activeThemeData!.id)}>
                  Continuar Sessão
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </button>
              </>
            ) : (
              <>
                <div className="badge-blue">COMEÇAR</div>
                <h2>Começar a Aprender</h2>
                <p>Seleciona um tema matemático abaixo para começar a tua viagem para claridade cógnitiva.</p>
                <div style={{ height: '60px' }}></div>
                <button className="btn-resume" onClick={() => onSelectTheme(questionsData.themes[0].id)}>
                  Começar o Primeiro Tema
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </button>
              </>
            )}
          </div>

          {/* Mentor Insight Card */}
          <div className="mentor-card">
            <div className="mentor-visual">
              <div className="mentor-ui-mockup">
                <div className="mockup-header">
                  <div className="mockup-dot red"></div>
                  <div className="mockup-dot yellow"></div>
                  <div className="mockup-dot green"></div>
                </div>
                <div className="mockup-body">
                  {!detectionActive || error ? (
                    <div className="camera-off-indicator">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16"></path><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path></svg>
                      <span style={{ fontSize: '10px', marginTop: '4px', maxWidth: '160px' }}>{error || 'Câmara desligada'}</span>
                    </div>
                  ) : (
                    <div className="ai-detection-visual">
                      <div className="wave-container">
                        <div className="wave" style={{ background: currentEmotion.color }}></div>
                        <div className="wave" style={{ background: currentEmotion.color, animationDelay: '0.5s' }}></div>
                        <div className="wave" style={{ background: currentEmotion.color, animationDelay: '1s' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mentor-floating-badge" style={{ borderColor: currentEmotion.color }}>
                <div className="badge-icon" style={{ background: currentEmotion.color + '20' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={currentEmotion.color} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <div className="badge-text">
                  <span className="b-label">Estado:</span>
                  <span className="b-value" style={{ color: currentEmotion.color }}>{currentEmotion.name}</span>
                </div>
              </div>
            </div>
            
            <div className="mentor-content">
              <h3>Vista do mentor</h3>
              <p>
                {!detectionActive || error 
                  ? "Ativa a câmara para que eu possa ajustar o ritmo da aula ao teu estado emocional."
                  : `Pareces ${currentEmotion.name.toLowerCase()}. ${currentEmotion.name === 'Focado' ? 'Excelente progresso!' : 'Continua assim, estás no caminho certo.'}`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon bg-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0060ad" strokeWidth="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
            </div>
            <div className="stat-info">
              <span className="s-label">NÍVEL ATUAL</span>
              <span className="s-value">Nível {currentLevel}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className={`stat-icon ${streak > 0 ? 'bg-red' : ''}`} style={streak === 0 ? { background: '#f1f5f9' } : {}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={streak > 0 ? "#dc2626" : "#94a3b8"} strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"></path></svg>
            </div>
            <div className="stat-info">
              <span className="s-label">SÉRIE DE APRENDIZAGEM</span>
              <span className="s-value" style={streak === 0 ? {color: '#64748b'} : {}}>{streak} {streak === 1 ? 'Dia' : 'Dias'}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div className="stat-info">
              <span className="s-label">DOMINIOS RECENTES</span>
              <span className="s-value">{highestMastery.name} {highestMastery.percentage > 0 && <span className="mastery-pct">({highestMastery.percentage}%)</span>}</span>
            </div>
          </div>
        </div>

        {/* Path Ahead */}
        <div className="path-ahead-section">
          <div className="section-header">
            <h2>Unidades curriculares</h2>
            <a 
              href="#" 
              className="view-roadmap" 
              onClick={(e) => {
                e.preventDefault();
                onNavigateToExercises();
              }}
            >
              Ver todos os temas
            </a>
          </div>

          <div className="path-grid">
            {questionsData.themes.map((theme) => {
              const isUnlocked = true;
              
              return (
                <div key={theme.id} className={`path-card ${isUnlocked ? 'unlocked' : 'locked'}`} onClick={() => isUnlocked && onSelectTheme(theme.id)}>
                  <div className="path-icon">
                    {isUnlocked ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    )}
                  </div>
                  <h4>{theme.name}</h4>
                  <p>Domina Conceitos Matemáticos</p>
                  
                  {isUnlocked && (
                    <div className="path-action">
                      Praticar Exercícios
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

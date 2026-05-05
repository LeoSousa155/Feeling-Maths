import Header from '../components/Header';
import './Completion.css';

type CompletionProps = {
  user: { name: string; email: string };
  themeName: string;
  score: number;
  total: number;
  difficulty: string;
  onNavigateToHome: () => void;
  onNavigateToExercises: () => void;
  onNavigateToProfile: () => void;
};

export default function Completion({ user, themeName, score, total, difficulty, onNavigateToHome, onNavigateToExercises, onNavigateToProfile }: CompletionProps) {
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="completion-wrapper">
      <Header 
        user={user} 
        activePath="home" 
        onNavigateToHome={onNavigateToHome}
        onNavigateToExercises={onNavigateToExercises}
        onNavigateToProfile={onNavigateToProfile}
      />

      <main className="completion-main">
        <div className="completion-card animate-scale-up">
          <div className="completion-icon">🎉</div>
          <h1>Theme Concluded!</h1>
          <p className="completion-subtitle">l
            Completaste todas as questões de <strong>{themeName}</strong> na dificuldade <strong>{difficulty}</strong>.
          </p>

          <div className="score-ring">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path className="circle"
                strokeDasharray={`${percentage}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="percentage">{percentage}%</text>
            </svg>
          </div>
          
          <p className="score-text">Acertaste {score} de {total}!</p>

          <div className="completion-actions">
            <button className="btn-secondary" onClick={onNavigateToExercises}>Mais exercicios</button>
            <button className="btn-primary" onClick={onNavigateToHome}>Voltar ao Dashboard</button>
          </div>
        </div>
      </main>
    </div>
  );
}

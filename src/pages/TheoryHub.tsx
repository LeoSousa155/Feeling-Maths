import Header from '../components/Header';
import questionsData from '../data/questions.json';
import './TheoryHub.css';

type TheoryHubProps = {
  user: { name: string; email: string };
  onNavigateToHome: () => void;
  onNavigateToExercises: () => void;
  onNavigateToProfile: () => void;
  onSelectTheory: (themeId: string) => void;
};

export default function TheoryHub({ user, onNavigateToHome, onNavigateToExercises, onNavigateToProfile, onSelectTheory }: TheoryHubProps) {
  return (
    <div className="theory-hub-wrapper">
      <Header 
        user={user} 
        activePath="theory" 
        onNavigateToHome={onNavigateToHome}
        onNavigateToExercises={onNavigateToExercises}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToTheory={() => {}}
      />
      <main className="theory-hub-main">
        <div className="theory-hub-header animate-fade-in">
          <h1>Teoria de Biblioteca</h1>
          <p>Aprofunda o teu conhecimento antes de o por em prática.</p>
        </div>
        <div className="theory-grid">
          {questionsData.themes.map((theme, idx) => (
            <div key={theme.id} className="theory-card animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="theory-card-icon">📚</div>
              <h2>{theme.name}</h2>
              <p>Explora os conceitos fundamentais e regras matemáticas para {theme.name.toLowerCase()}.</p>
              <button className="btn-read-theory" onClick={() => onSelectTheory(theme.id)}>
                Ler Teoria
              </button>
            </div>
          ))}
          
          {/* Upcoming Content placeholder */}
          <div className="theory-card upcoming-card animate-fade-in" style={{ animationDelay: `${questionsData.themes.length * 0.1}s` }}>
            <div className="theory-card-icon">
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

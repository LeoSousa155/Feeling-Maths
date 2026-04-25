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
          <h1>Theory Library</h1>
          <p>Deepen your understanding before putting it into practice.</p>
        </div>

        <div className="theory-grid">
          {questionsData.themes.map((theme, idx) => (
            <div key={theme.id} className="theory-card animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="theory-card-icon">📚</div>
              <h2>{theme.name}</h2>
              <p>Explore the foundational concepts and mathematical rules for {theme.name.toLowerCase()}.</p>
              <button className="btn-read-theory" onClick={() => onSelectTheory(theme.id)}>
                Read Theory
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

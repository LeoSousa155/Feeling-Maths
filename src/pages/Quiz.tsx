import { useState, useEffect } from 'react';
import Header from '../components/Header';
import './Quiz.css';

type Option = { id: string; text: string; };
type Question = { id: string; text: string; options: Option[]; correctOptionId: string; explanation: string; tip?: string };
type Theme = { id: string; name: string; questions: Question[]; };

type QuizProps = {
  user: { name: string; email: string };
  theme: Theme;
  questions: Question[];
  onExit: () => void;
  onFinishTheme: (score: number) => void;
  onNavigateToTheory: (themeId: string) => void;
};

export default function Quiz({ user, theme, questions, onExit, onFinishTheme, onNavigateToTheory }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showSupport, setShowSupport] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setShowSupport(false);
    
    // Simulate detecting struggle after 5 seconds to show the Mindful Support card
    const timer = setTimeout(() => {
      if (!selectedOption) setShowSupport(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const question = questions[currentIndex];
  const progressPct = Math.round((currentIndex / questions.length) * 100);

  const handleSubmit = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === question.correctOptionId;
    if (isCorrect) setScore(prev => prev + 1);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onFinishTheme(score + (isCorrect ? 1 : 0));
    }
  };


  return (
    <div className="quiz-wrapper">
      <Header 
        user={user} 
        activePath="exercises" 
        onNavigateToHome={onExit}
        onNavigateToTheory={() => {}}
      />

      <main className="quiz-main">
        {/* Session Header */}
        <div className="quiz-header">
          <span className="chapter-label">CAPÍTULO: {theme.name.toUpperCase()}</span>
          <h1>Resolve para a variável 'x'</h1>
          
          <div className="quiz-progress-row">
            <div className="quiz-progress-bg">
              <div className="quiz-progress-fill" style={{ width: `${progressPct}%` }}></div>
            </div>
            <span className="quiz-progress-text">{progressPct}% Completado</span>
          </div>
        </div>

        <div className={`quiz-content-grid ${showSupport ? 'bento-active' : 'centered-active'}`}>
          {/* Problem Section */}
          <div className="problem-section">
            <div className="problem-badge">PROBLEMA {currentIndex + 1}</div>
            
            <h2 className="problem-text">{question.text}</h2>

            <div className="options-grid">
              {question.options.map((opt, idx) => {
                const isSelected = selectedOption === opt.id;
                const letters = ['A', 'B', 'C', 'D'];
                
                return (
                  <button 
                    key={opt.id}
                    className={`option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedOption(opt.id)}
                  >
                    <span className="opt-text">{letters[idx]}) {opt.text}</span>
                    <div className="opt-circle">
                      {isSelected && <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="problem-actions">
              <button className="btn-previous" onClick={onExit}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Previous
              </button>
              
              <div className="right-actions">
                <button className="btn-save">Salvar para depois</button>
                <button className={`btn-submit ${selectedOption ? 'active' : ''}`} onClick={handleSubmit} disabled={!selectedOption}>
                  {currentIndex + 1 === questions.length ? 'Finish Theme' : 'Submit Answer'}
                </button>
              </div>
            </div>
          </div>

          {/* Mindful Support Section */}
          {showSupport && (
            <div className="support-section animate-fade-in">
              <div className="support-card">
                <div className="support-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006e36" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  <h3>Suporte</h3>
                </div>
                
                <p className="support-desc">Notei que estás a ficar um bom tempo aqui. Vamos Simplificar:</p>
                <div className="support-hint-box">
                  {question.tip}
                </div>

                <div className="support-actions">
                  <button className="btn-explain">Explicar passo 1</button>
                  <button className="btn-dismiss" onClick={() => setShowSupport(false)}>Estou ok, obrigado</button>
                </div>

                <svg className="bg-bulb" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21h6"></path><path d="M10 21v-2a4 4 0 0 1-4-4v-1a7 7 0 1 1 12 0v1a4 4 0 0 1-4 4v2"></path></svg>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Pill Actions */}
        <div className="bottom-pill-actions">
          <button className="pill-btn" onClick={() => onNavigateToTheory(theme.id)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            Rever Teoria
          </button>
          <button className="pill-btn" onClick={() => setShowSupport(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21h6"></path><path d="M10 21v-2a4 4 0 0 1-4-4v-1a7 7 0 1 1 12 0v1a4 4 0 0 1-4 4v2"></path></svg>
            Mostrar Dica
          </button>
        </div>
      </main>
    </div>
  );
}

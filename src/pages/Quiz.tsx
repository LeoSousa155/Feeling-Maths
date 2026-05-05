import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useEmotionDetector } from '../hooks/useEmotionDetector';
import './Quiz.css';

type Option = { id: string; text: string; };
type Question = { id: string; text: string; options: Option[]; correctOptionId: string; explanation: string; };
type Theme = { id: string; name: string; questions: Question[]; };

type QuizProps = {
  user: { name: string; email: string };
  theme: Theme;
  questions: Question[];
  onExit: () => void;
  onFinishTheme: (score: number) => void;
  onNavigateToTheory: () => void;
};

export default function Quiz({ user, theme, questions, onExit, onFinishTheme, onNavigateToTheory }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showSupport, setShowSupport] = useState(false);
  const [emotionNotification, setEmotionNotification] = useState<string | null>(null);

  const {
    videoRef,
    emotion,
    startDetection,
    stopDetection,
  } = useEmotionDetector();

  // Função para obter label da emoção dominante (ANTES dos useEffect)
  const getDominantEmotionLabel = (): string => {
    if (!emotion) return 'Neutro';

    const frustration = emotion.angry + emotion.sad;
    if (frustration > 0.2) {
      return 'Frustrado';
    }

    const emotions: { [key: string]: { label: string; value: number } } = {
      happy: { label: 'Feliz', value: emotion.happy },
      sad: { label: 'Triste', value: emotion.sad },
      angry: { label: 'Irritado', value: emotion.angry },
      surprised: { label: 'Surpreso', value: emotion.surprised },
      fearful: { label: 'Assustado', value: emotion.fearful },
      disgusted: { label: 'Nojento', value: emotion.disgusted },
      neutral: { label: 'Neutro', value: emotion.neutral },
    };

    const dominant = Object.values(emotions).reduce((prev, current) =>
        prev.value > current.value ? prev : current
    );

    return dominant.value > 0.1 ? dominant.label : 'Neutro';
  };

  // Iniciar detecção de emoções ao montar o componente
  useEffect(() => {
    startDetection();
    return () => {
      stopDetection();
    };
  }, [startDetection, stopDetection]);

  // Reset state quando a questão muda
  useEffect(() => {
    setSelectedOption(null);
    setShowSupport(false);
  }, [currentIndex]);

  // Verificar frustração automaticamente
  useEffect(() => {
    if (!emotion) return;

    const frustration = emotion.angry + emotion.sad;
    if (frustration > 0.2 && !selectedOption) {
      setShowSupport(true);
    }
  }, [emotion, selectedOption]);

  // Mostrar notificação de emoção quando muda
  useEffect(() => {
    if (!emotion) return;

    const emotionLabel = getDominantEmotionLabel();
    setEmotionNotification(emotionLabel);

    const timer = setTimeout(() => {
      setEmotionNotification(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [emotion]);

  const question = questions[currentIndex];
  const progressPct = Math.round((currentIndex / questions.length) * 100);

  const handleSubmit = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === question.correctOptionId;
    if (isCorrect) setScore(prev => prev + 1);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      stopDetection();
      onFinishTheme(score + (isCorrect ? 1 : 0));
    }
  };

  return (
      <div className="quiz-wrapper">
        {/* Video ref invisível para detecção de emoções */}
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ display: 'none' }}
        />

        {/* Notificação de emoção */}
        {emotionNotification && (
            <div className="emotion-notification">
              <p>Emoção detectada: <strong>{emotionNotification}</strong></p>
            </div>
        )}

        <Header
            user={user}
            activePath="exercises"
            onNavigateToHome={onExit}
            onNavigateToTheory={onNavigateToTheory}
        />

        {showSupport && (
            <div className="supportive-banner animate-slide-down">
              <div className="banner-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006e36" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <div className="banner-text">
                <h4>Let's try this in a different way</h4>
                <p>I've noticed you're working hard on this. Sometimes a fresh perspective helps!</p>
              </div>
            </div>
        )}

        <main className="quiz-main">
          {/* Session Header */}
          <div className="quiz-header">
            <span className="chapter-label">CHAPTER: {theme.name.toUpperCase()}</span>
            <h1>Solving for Variable 'x'</h1>

            <div className="quiz-progress-row">
              <div className="quiz-progress-bg">
                <div className="quiz-progress-fill" style={{ width: `${progressPct}%` }}></div>
              </div>
              <span className="quiz-progress-text">{progressPct}% Completed</span>
            </div>
          </div>

          <div className={`quiz-content-grid ${showSupport ? 'bento-active' : 'centered-active'}`}>
            {/* Problem Section */}
            <div className="problem-section">
              <div className="problem-badge">PROBLEM {currentIndex + 1}</div>

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
                  <button className="btn-save">Save for later</button>
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
                      <h3>Mindful Support</h3>
                    </div>

                    <p className="support-desc">I noticed you're spending a bit of time here. Let's simplify:</p>
                    <div className="support-hint-box">
                      Try <strong>distributing</strong> the numbers through the parenthesis first, or <strong>subtracting</strong> from both sides.
                    </div>

                    <div className="support-actions">
                      <button className="btn-explain">Explain Step 1</button>
                      <button className="btn-dismiss" onClick={() => setShowSupport(false)}>I'm okay, thanks</button>
                    </div>

                    <svg className="bg-bulb" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21h6"></path><path d="M10 21v-2a4 4 0 0 1-4-4v-1a7 7 0 1 1 12 0v1a4 4 0 0 1-4 4v2"></path></svg>
                  </div>
                </div>
            )}
          </div>

          {/* Bottom Pill Actions */}
          <div className="bottom-pill-actions">
            <button className="pill-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              Review Theory
            </button>
            <button className="pill-btn" onClick={() => setShowSupport(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21h6"></path><path d="M10 21v-2a4 4 0 0 1-4-4v-1a7 7 0 1 1 12 0v1a4 4 0 0 1-4 4v2"></path></svg>
              Show Hint
            </button>
          </div>
        </main>
      </div>
  );
}
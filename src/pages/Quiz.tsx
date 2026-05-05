import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useEmotionDetector } from '../hooks/useEmotionDetector';
import './Quiz.css';

type Option = { id: string; text: string; };
type Question = { id: string; difficulty: string; text: string; options: Option[]; correctOptionId: string; explanation: string; tip?: string };
type Theme = { id: string; name: string; questions: Question[]; };

type QuizProps = {
  user: { name: string; email: string };
  theme: Theme;
  questions: Question[];
  onExit: () => void;
  onFinishTheme: (score: number) => void;
  onNavigateToTheory: (themeId: string) => void;
};

type DifficultyNotification = {
  id: string;
  message: string;
  type: 'up' | 'down';
  timestamp: number;
};

const DIFFICULTY_LEVELS = {
  'Beginner': 1,
  'Intermediate': 2,
  'Advanced': 3
};

export default function Quiz({ user, theme, questions: allQuestions, onExit, onFinishTheme, onNavigateToTheory }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showSupport, setShowSupport] = useState(false);
  const [difficultyNotification, setDifficultyNotification] = useState<DifficultyNotification | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answerCorrect, setAnswerCorrect] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentDifficulty, setCurrentDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);

  const {
    videoRef,
    emotion,
    startDetection,
    stopDetection,
  } = useEmotionDetector();

  // Inicializar quiz com 7 perguntas começando em Intermediate
  useEffect(() => {
    const intermediateQuestions = allQuestions.filter(q => q.difficulty === 'Intermediate');
    const selected = intermediateQuestions.slice(0, 7);
    setSessionQuestions(selected);
    setCurrentDifficulty('Intermediate');
  }, [allQuestions]);

  // Iniciar detecção de emoções ao montar
  useEffect(() => {
    if (sessionQuestions.length > 0) {
      startDetection();
    }
    return () => {
      stopDetection();
    };
  }, [sessionQuestions]);

  // Reset state quando questão muda
  useEffect(() => {
    setSelectedOption(null);
    setShowSupport(false);
    setAnswered(false);
    setAnswerCorrect(false);
  }, [currentIndex]);

  // Verificar frustração automaticamente
  useEffect(() => {
    if (!emotion || answered) return;

    const frustration = emotion.angry + emotion.sad;
    if (frustration > 0.2 && !selectedOption) {
      setShowSupport(true);
    }
  }, [emotion, selectedOption, answered]);

  // Notificação desaparece após 3 segundos
  useEffect(() => {
    if (!difficultyNotification) return;

    const timer = setTimeout(() => {
      setDifficultyNotification(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [difficultyNotification]);

  if (sessionQuestions.length === 0) {
    return <div>Carregando...</div>;
  }

  const question = sessionQuestions[currentIndex];
  const progressPct = Math.round(((currentIndex + 1) / 7) * 100);

  // Obter emoção dominante
  const getDominantEmotion = (): { name: string; value: number; isPositive: boolean } => {
    if (!emotion) return { name: 'Neutro', value: 0, isPositive: false };

    const frustration = emotion.angry + emotion.sad;
    if (frustration > 0.2) {
      return { name: 'Frustrado', value: frustration, isPositive: false };
    }

    const confidence = emotion.happy + emotion.surprised;
    if (confidence > 0.2) {
      return { name: 'Confiante', value: confidence, isPositive: true };
    }

    const emotionConfig: { [key: string]: { name: string; isPositive: boolean } } = {
      happy: { name: 'Feliz', isPositive: true },
      sad: { name: 'Triste', isPositive: false },
      angry: { name: 'Irritado', isPositive: false },
      surprised: { name: 'Surpreso', isPositive: true },
      fearful: { name: 'Assustado', isPositive: false },
      disgusted: { name: 'Nojento', isPositive: false },
      neutral: { name: 'Neutro', isPositive: false },
    };

    const emotions = Object.entries(emotion);
    const dominant = emotions.reduce((prev, current) =>
        prev[1] > current[1] ? prev : current
    );

    const key = dominant[0] as keyof typeof emotionConfig;
    const config = emotionConfig[key];

    return {
      name: dominant[1] > 0.1 ? config.name : 'Neutro',
      value: dominant[1],
      isPositive: config.isPositive
    };
  };

  // Selecionar próxima pergunta baseada em emoções, acertos e erros
  const getNextQuestion = (
      currentDiff: string,
      dominantEmotion: any,
      isCorrect: boolean,
      consecutiveCorrectCount: number
  ): { newDifficulty: string; difficultyChanged: boolean; message?: string } => {
    let newDifficulty = currentDiff;
    let difficultyChanged = false;
    let message = '';

    // 2 acertos consecutivos = sobe dificuldade (mesmo se frustrado)
    if (consecutiveCorrectCount >= 2 && currentDiff !== 'Advanced') {
      newDifficulty = currentDiff === 'Beginner' ? 'Intermediate' : 'Advanced';
      difficultyChanged = true;
      message = '⬆️ Dois acertos seguidos! Subindo de nível! ';
    }
    // Errar = baixa dificuldade
    else if (!isCorrect && currentDiff !== 'Beginner') {
      newDifficulty = currentDiff === 'Advanced' ? 'Intermediate' : 'Beginner';
      difficultyChanged = true;
      message = '⬇️ Vamos tornar mais fácil para aprender melhor. ';
    }
    // Se frustrado, baixa dificuldade
    else if (dominantEmotion.name === 'Frustrado' && currentDiff !== 'Beginner') {
      newDifficulty = currentDiff === 'Advanced' ? 'Intermediate' : 'Beginner';
      difficultyChanged = true;
      message = '⬇️ Detectei frustração. Vamos simplificar. ';
    }
    // Se confiante/feliz E acertou, aumenta dificuldade
    else if (dominantEmotion.isPositive && dominantEmotion.value > 0.15 && isCorrect && currentDiff !== 'Advanced') {
      newDifficulty = currentDiff === 'Beginner' ? 'Intermediate' : 'Advanced';
      difficultyChanged = true;
      message = '⬆️ Estás muito bem! Aumentando dificuldade! ';
    }

    return { newDifficulty, difficultyChanged, message };
  };

  const handleSubmit = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === question.correctOptionId;
    const newScore = score + (isCorrect ? 1 : 0);
    setScore(newScore);
    setAnswered(true);
    setAnswerCorrect(isCorrect);

    // Atualizar contador de acertos consecutivos
    if (isCorrect) {
      setConsecutiveCorrect(prev => prev + 1);
    } else {
      setConsecutiveCorrect(0);
    }

    const dominantEmotion = getDominantEmotion();

    // Mostrar notificação de dificuldade apenas se houver próximas perguntas
    if (currentIndex + 1 < 7) {
      const { newDifficulty, difficultyChanged, message } = getNextQuestion(
          currentDifficulty,
          dominantEmotion,
          isCorrect,
          isCorrect ? consecutiveCorrect + 1 : 0
      );

      if (difficultyChanged && message) {
        setDifficultyNotification({
          id: `notif-${Date.now()}`,
          message: message,
          type: newDifficulty > currentDifficulty ? 'up' : 'down',
          timestamp: Date.now()
        });
      }

      setCurrentDifficulty(newDifficulty as 'Beginner' | 'Intermediate' | 'Advanced');
    }
  };

  const handleContinue = () => {
    if (currentIndex + 1 < 7) {
      setCurrentIndex(prev => prev + 1);
    } else {
      stopDetection();
      onFinishTheme(score);
    }
  };

  const dominantEmotion = getDominantEmotion();

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

        <Header
            user={user}
            activePath="exercises"
            onNavigateToHome={onExit}
            onNavigateToTheory={() => {}}
        />

        <main className="quiz-main">
          {/* Session Header */}
          <div className="quiz-header">
            <div className="quiz-header-top">
              <div>
                <span className="chapter-label">CAPÍTULO: {theme.name.toUpperCase()}</span>
                <h1>Resolve para a variável 'x'</h1>
              </div>
              {emotion && (
                  <div className="emotion-detected-badge">
                    <span className="emotion-text">Emoção: {dominantEmotion.name}</span>
                  </div>
              )}
            </div>

            <div className="quiz-progress-row">
              <div className="quiz-progress-bg">
                <div className="quiz-progress-fill" style={{ width: `${progressPct}%` }}></div>
              </div>
              <span className="quiz-progress-text">{progressPct}% Completado ({currentIndex + 1}/7)</span>
            </div>
          </div>

          {/* Notificação de dificuldade */}
          {difficultyNotification && (
              <div className={`difficulty-notification difficulty-${difficultyNotification.type}`}>
                {difficultyNotification.message}
              </div>
          )}

          <div className={`quiz-content-grid ${showSupport && !answered ? 'bento-active' : 'centered-active'}`}>
            {/* Problem Section */}
            <div className="problem-section">
              <div className="problem-badge">PROBLEMA {currentIndex + 1} DE 7</div>

              <p className="difficulty-indicator">Dificuldade: <span className={`diff-${currentDifficulty}`}>{currentDifficulty}</span></p>

              <h2 className="problem-text">{question.text}</h2>

              <div className="options-grid">
                {question.options.map((opt, idx) => {
                  const isSelected = selectedOption === opt.id;
                  const isCorrectAnswer = opt.id === question.correctOptionId;
                  const letters = ['A', 'B', 'C', 'D'];

                  let btnClass = `option-btn`;
                  if (answered) {
                    if (isCorrectAnswer) {
                      btnClass += ' correct-answer';
                    } else if (isSelected && !isCorrectAnswer) {
                      btnClass += ' wrong-answer';
                    } else {
                      btnClass += ' disabled-answer';
                    }
                  } else if (isSelected) {
                    btnClass += ' selected';
                  }

                  return (
                      <button
                          key={opt.id}
                          className={btnClass}
                          onClick={() => !answered && setSelectedOption(opt.id)}
                          disabled={answered}
                      >
                        <span className="opt-text">{letters[idx]}) {opt.text}</span>
                        <div className="opt-circle">
                          {answered && isCorrectAnswer && <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>}
                          {answered && isSelected && !isCorrectAnswer && <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>}
                          {!answered && isSelected && <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>}
                        </div>
                      </button>
                  );
                })}
              </div>

              {answered && (
                  <div className={`answer-feedback ${answerCorrect ? 'correct' : 'incorrect'}`}>
                    <p className="feedback-title">{answerCorrect ? '✓ Correto!' : '✗ Incorreto'}</p>
                    <p className="feedback-explanation">{question.explanation}</p>
                  </div>
              )}

              <div className="problem-actions">
                <button className="btn-previous" onClick={onExit}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                  Sair
                </button>

                <div className="right-actions">
                  <button className="btn-save">Salvar para depois</button>
                  {!answered ? (
                      <button className={`btn-submit ${selectedOption ? 'active' : ''}`} onClick={handleSubmit} disabled={!selectedOption}>
                        Submeter Resposta
                      </button>
                  ) : (
                      <button className="btn-submit active" onClick={handleContinue}>
                        {currentIndex + 1 === 7 ? 'Terminar Tema' : 'Próxima Pergunta'}
                      </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mindful Support Section */}
            {showSupport && !answered && (
                <div className="support-section animate-fade-in">
                  <div className="support-card">
                    <div className="support-header">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006e36" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                      <h3>Suporte</h3>
                    </div>

                    <p className="support-desc">Notei que estás a ficar um bom tempo aqui. Vamos Simplificar:</p>
                    <div className="support-hint-box">
                      {question.tip || 'Tenta dividir o problema em partes mais pequenas.'}
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
            <button className="pill-btn" onClick={() => !answered && setShowSupport(true)} disabled={answered}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21h6"></path><path d="M10 21v-2a4 4 0 0 1-4-4v-1a7 7 0 1 1 12 0v1a4 4 0 0 1-4 4v2"></path></svg>
              Mostrar Dica
            </button>
          </div>
        </main>
      </div>
  );
}
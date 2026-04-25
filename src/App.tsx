import { useState } from 'react';
import questionsData from './data/questions.json';
import './index.css';

import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Exercises from './pages/Exercises';
import Quiz from './pages/Quiz';
import Completion from './pages/Completion';
import TheoryHub from './pages/TheoryHub';
import TheoryLesson from './pages/TheoryLesson';

type User = {
  name: string;
  email: string;
};

type Progress = {
  [themeId: string]: {
    completed: number;
    total: number;
    score: number;
  }
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress>({});
  const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'exercises' | 'theory-hub' | 'theory-lesson'>('dashboard');
  const [currentTheory, setCurrentTheory] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'Beginner'|'Intermediate'|'Advanced'>('Intermediate');
  
  const [quizStatus, setQuizStatus] = useState<{status: 'idle' | 'playing' | 'completed', score: number}>({status: 'idle', score: 0});
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Derived global stats
  const totalCompleted = Object.values(progress).reduce((sum, p) => sum + p.completed, 0);
  const streak = Math.max(14, totalCompleted);

  // Landing / Auth Screen Routing
  if (!user) {
    if (showLogin) {
      return (
        <Login
          onLogin={(email) => setUser({ name: email.split('@')[0], email })}
          onNavigateToRegister={() => { setShowLogin(false); setShowRegister(true); }}
        />
      );
    }
    if (showRegister) {
      return (
        <Register
          onRegister={(name, email) => setUser({ name, email })}
          onNavigateToLogin={() => { setShowRegister(false); setShowLogin(true); }}
        />
      );
    }
    return (
      <LandingPage
        onNavigateToLogin={() => setShowLogin(true)}
        onNavigateToRegister={() => setShowRegister(true)}
      />
    );
  }

  // Quiz Screen
  if (currentTheme && quizStatus.status !== 'idle') {
    const theme = questionsData.themes.find((t) => t.id === currentTheme);
    if (!theme) return null;

    const filteredQuestions = theme.questions.filter((q) => q.difficulty === difficulty);

    if (quizStatus.status === 'completed') {
      return (
        <Completion 
          user={user}
          themeName={theme.name}
          score={quizStatus.score}
          total={filteredQuestions.length}
          difficulty={difficulty}
          onNavigateToHome={() => {
            setQuizStatus({status: 'idle', score: 0});
            setCurrentTheme(null);
            setActiveView('dashboard');
          }}
          onNavigateToExercises={() => {
            setQuizStatus({status: 'idle', score: 0});
            setCurrentTheme(null);
            setActiveView('exercises');
          }}
          onNavigateToProfile={() => {
            setQuizStatus({status: 'idle', score: 0});
            setCurrentTheme(null);
            setActiveView('profile');
          }}
        />
      );
    }

    return (
      <Quiz 
        user={user}
        theme={theme}
        questions={filteredQuestions}
        onExit={() => {
          setQuizStatus({status: 'idle', score: 0});
          setCurrentTheme(null);
        }}
        onFinishTheme={(score) => {
          // Update progress
          setProgress(prev => {
            const current = prev[theme.id] || { completed: 0, total: filteredQuestions.length, score: 0 };
            return {
              ...prev,
              [theme.id]: {
                ...current,
                completed: Math.min(filteredQuestions.length, current.completed + filteredQuestions.length),
                score: Math.max(current.score, score)
              }
            };
          });
          setQuizStatus({status: 'completed', score});
        }}
      />
    );
  }

  // Theory Hub Screen
  if (activeView === 'theory-hub') {
    return (
      <TheoryHub
        user={user}
        onNavigateToHome={() => setActiveView('dashboard')}
        onNavigateToExercises={() => setActiveView('exercises')}
        onNavigateToProfile={() => setActiveView('profile')}
        onSelectTheory={(themeId) => {
          setCurrentTheory(themeId);
          setActiveView('theory-lesson');
        }}
      />
    );
  }

  // Theory Lesson Screen
  if (activeView === 'theory-lesson' && currentTheory) {
    return (
      <TheoryLesson
        user={user}
        themeId={currentTheory}
        onNavigateToHome={() => setActiveView('dashboard')}
        onNavigateToExercises={() => setActiveView('exercises')}
        onNavigateToProfile={() => setActiveView('profile')}
        onNavigateToTheoryHub={() => setActiveView('theory-hub')}
        onStartPractice={(themeId) => {
          setCurrentTheme(themeId);
          setQuizStatus({status: 'playing', score: 0});
        }}
      />
    );
  }

  // Dashboard Screen (Matches Figma "Html -> Body")
  if (activeView === 'profile') {
    return (
      <Profile 
        user={user} 
        progress={progress} 
        streak={streak}
        difficulty={difficulty}
        onSelectDifficulty={setDifficulty}
        onNavigateToHome={() => setActiveView('dashboard')}
        onNavigateToProfile={() => setActiveView('profile')}
        onNavigateToExercises={() => setActiveView('exercises')}
        onNavigateToTheory={() => setActiveView('theory-hub')}
        onSelectTheme={(themeId) => {
          setCurrentTheme(themeId);
          setQuizStatus({status: 'playing', score: 0});
        }}
      />
    );
  }

  if (activeView === 'exercises') {
    return (
      <Exercises
        user={user}
        progress={progress}
        onNavigateToHome={() => setActiveView('dashboard')}
        onNavigateToExercises={() => setActiveView('exercises')}
        onNavigateToProfile={() => setActiveView('profile')}
        onNavigateToTheory={() => setActiveView('theory-hub')}
        onSelectTheme={(themeId) => {
          setCurrentTheme(themeId);
          setQuizStatus({status: 'playing', score: 0});
        }}
      />
    );
  }

  return (
    <Dashboard 
      user={user} 
      progress={progress} 
      streak={streak}
      onSelectTheme={(themeId) => {
        setCurrentTheme(themeId);
        setQuizStatus({status: 'playing', score: 0});
      }} 
      onNavigateToProfile={() => setActiveView('profile')}
      onNavigateToExercises={() => setActiveView('exercises')}
      onNavigateToTheory={() => setActiveView('theory-hub')}
    />
  );
}

export default App;

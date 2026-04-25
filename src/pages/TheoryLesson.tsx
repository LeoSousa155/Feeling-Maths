import Header from '../components/Header';
import theoryData from '../data/theory.json';
import './TheoryLesson.css';

type TheoryLessonProps = {
  user: { name: string; email: string };
  themeId: string;
  onNavigateToHome: () => void;
  onNavigateToExercises: () => void;
  onNavigateToProfile: () => void;
  onNavigateToTheoryHub: () => void;
  onStartPractice: (themeId: string) => void;
};

// Venn Diagram SVG for Set Theory
function VennDiagram() {
  return (
    <div className="venn-diagram-wrap">
      <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" className="venn-svg">
        {/* Set A circle */}
        <circle cx="120" cy="100" r="75" fill="rgba(0,96,173,0.18)" stroke="#0060ad" strokeWidth="2" />
        {/* Set B circle */}
        <circle cx="200" cy="100" r="75" fill="rgba(22,163,74,0.18)" stroke="#16a34a" strokeWidth="2" />
        {/* Intersection highlight */}
        <clipPath id="clipA">
          <circle cx="120" cy="100" r="75" />
        </clipPath>
        <circle cx="200" cy="100" r="75" fill="rgba(99,102,241,0.3)" clipPath="url(#clipA)" />

        {/* Labels */}
        <text x="80" y="104" textAnchor="middle" fill="#0060ad" fontSize="14" fontWeight="700" fontFamily="Manrope, sans-serif">A only</text>
        <text x="240" y="104" textAnchor="middle" fill="#16a34a" fontSize="14" fontWeight="700" fontFamily="Manrope, sans-serif">B only</text>
        <text x="160" y="97" textAnchor="middle" fill="#4338ca" fontSize="11" fontWeight="800" fontFamily="Manrope, sans-serif">A ∩ B</text>

        {/* Set labels */}
        <text x="75" y="40" textAnchor="middle" fill="#0060ad" fontSize="20" fontWeight="800" fontFamily="Manrope, sans-serif">A</text>
        <text x="245" y="40" textAnchor="middle" fill="#16a34a" fontSize="20" fontWeight="800" fontFamily="Manrope, sans-serif">B</text>

        {/* Union bracket */}
        <text x="160" y="185" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="Work Sans, sans-serif">A ∪ B = everything shown</text>
      </svg>

      <div className="venn-legend">
        <span className="venn-dot" style={{ background: '#0060ad' }} /> Only in A
        <span className="venn-dot" style={{ background: '#4338ca', marginLeft: 16 }} /> A ∩ B
        <span className="venn-dot" style={{ background: '#16a34a', marginLeft: 16 }} /> Only in B
      </div>
    </div>
  );
}

export default function TheoryLesson({ user, themeId, onNavigateToHome, onNavigateToExercises, onNavigateToProfile, onNavigateToTheoryHub, onStartPractice }: TheoryLessonProps) {
  const theme = (theoryData.themes as any[]).find((t) => t.id === themeId);

  if (!theme) return null;

  const isSetTheory = themeId === 'set_theory';

  return (
    <div className="theory-lesson-wrapper">
      <Header
        user={user}
        activePath="theory"
        onNavigateToHome={onNavigateToHome}
        onNavigateToExercises={onNavigateToExercises}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToTheory={onNavigateToTheoryHub}
      />

      <main className="theory-lesson-main">
        {/* Header Section */}
        <div className="theory-header animate-fade-in">
          <div className="breadcrumbs">
            {theme.category} <span className="separator">›</span> {theme.topic}
          </div>
          <h1>
            <span className="title-prefix">{theme.titlePrefix}</span><br />
            <span className="title-main">{theme.titleMain}</span>
          </h1>
          <p className="subtitle">{theme.subtitle}</p>
        </div>

        {/* Bento Grid Content */}
        <div className="theory-bento-grid">
          {/* Main Concept Card */}
          <div className="theory-card golden-rule-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2>{isSetTheory ? 'Fundamental Concepts' : 'The Golden Rule: Balance'}</h2>
            <div className="rule-intro">
              <div className="icon-badge">
                {isSetTheory ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="12" r="7"/><circle cx="15" cy="12" r="7"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3v18M5 10a7 7 0 0 1 14 0"/><line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                )}
              </div>
              <p>{theme.goldenRule.text}</p>
            </div>

            <div className="formula-block">
              <span className="formula-label">{theme.goldenRule.formulaTitle}</span>
              <div className="formula-equation">{theme.goldenRule.formula}</div>
            </div>

            <div className={`rules-split ${theme.goldenRule.rules.length > 2 ? 'rules-split-4' : ''}`}>
              {theme.goldenRule.rules.map((rule: { title: string; desc: string }, idx: number) => (
                <div key={idx} className="rule-subcard">
                  <h3>{rule.title}</h3>
                  <p>{rule.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Column */}
          <div className="theory-side-column">
            {/* Pro Tip Card */}
            <div className="theory-card pro-tip-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <svg className="bulb-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21h6"/><path d="M10 21v-2a4 4 0 0 1-4-4v-1a7 7 0 1 1 12 0v1a4 4 0 0 1-4 4v2"/>
              </svg>
              <h2>Pro Tip</h2>
              <p>{theme.proTip}</p>
            </div>

            {/* Image / Info Card */}
            <div className="theory-card image-info-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {isSetTheory && <VennDiagram />}
              <div className="image-info-content">
                <h3>{theme.imageInfo.title}</h3>
                <p>{theme.imageInfo.desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Concepts Section — only for Set Theory */}
        {theme.extraConcepts && (
          <div className="extra-concepts-section animate-fade-in" style={{ animationDelay: '0.35s' }}>
            <h2 className="section-title">Key Notation</h2>
            <div className="extra-concepts-grid">
              {theme.extraConcepts.map((concept: { icon: string; title: string; desc: string }, idx: number) => (
                <div key={idx} className="extra-concept-card">
                  <div className="concept-icon">{concept.icon}</div>
                  <h3>{concept.title}</h3>
                  <p>{concept.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step by Step Breakdown */}
        <div className="step-by-step-section animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="section-title">Step-by-Step Breakdown</h2>

          <div className="steps-container">
            {theme.steps.map((step: { number: number; title: string; desc: string; equation?: string; solved?: boolean }, idx: number) => (
              <div key={idx} className="step-item">
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>

                  {step.equation && (
                    <div className="step-equation">
                      {step.equation.split('\n').map((line, i) => (
                        <div key={i} className={i === 1 ? 'highlight-eq' : ''}>{line}</div>
                      ))}
                    </div>
                  )}
                </div>
                {step.solved && (
                  <div className="step-solved-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Solved
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="theory-footer animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p>Feeling confident with {theme.titleMain.toLowerCase()}?</p>
          <div className="theory-actions">
            <button className="btn-secondary" onClick={onNavigateToTheoryHub}>Review Next</button>
            <button className="btn-primary" onClick={() => onStartPractice(theme.id)}>Start Practice Exercises</button>
          </div>
        </div>
      </main>
    </div>
  );
}

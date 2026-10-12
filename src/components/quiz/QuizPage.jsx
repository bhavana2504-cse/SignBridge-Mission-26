import React, { useState, useEffect } from 'react';
import { 
  Award, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ShieldAlert, 
  Play, 
  HelpCircle,
  Sparkles
} from '../common/Icons';
import { AchievementBadgeItem } from '../common/Illustrations';
import { VideoPlayer } from '../common/VideoPlayer';
import { signService } from '../../services/signService';
import { storageService } from '../../services/storageService';

export function QuizPage() {
  const [quizState, setQuizState] = useState('setup'); // 'setup' | 'playing' | 'completed'
  const [quizCategory, setQuizCategory] = useState('All');
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answersLog, setAnswersLog] = useState([]);

  const categories = ['All', ...signService.getCategories()];

  const startQuiz = (selectedCat = 'All', questionCount = 8) => {
    let pool = signService.getSignsByCategory(selectedCat);
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const selectedSigns = shuffledPool.slice(0, Math.min(questionCount, shuffledPool.length));

    const generatedQuestions = selectedSigns.map((correctSign) => {
      const distractors = signService.getRandomDistractors(3, correctSign.id);
      const allOptions = [correctSign, ...distractors].sort(() => 0.5 - Math.random());

      return {
        id: correctSign.id,
        correctSign,
        prompt: 'Which sign is demonstrated in the video?',
        options: allOptions.map((item, idx) => ({
          id: item.id,
          text: item.word,
          numberPrefix: `${idx + 1}.`,
          isCorrect: item.id === correctSign.id
        }))
      };
    });

    setQuizCategory(selectedCat);
    setQuestions(generatedQuestions);
    setCurrentQIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setAnswersLog([]);
    setQuizState('playing');
  };

  const handleSelectOption = (option) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(option);
  };

  const handleConfirmAnswer = () => {
    if (!selectedAnswer || isAnswerSubmitted) return;

    const currentQ = questions[currentQIndex];
    const isCorrect = selectedAnswer.isCorrect;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswersLog((prev) => [
      ...prev,
      {
        questionIndex: currentQIndex,
        signWord: currentQ.correctSign.word,
        userAnswer: selectedAnswer.text,
        isCorrect
      }
    ]);

    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizState('completed');
    storageService.saveQuizResult({
      category: quizCategory === 'All' ? 'Comprehensive' : quizCategory,
      score: score,
      total: questions.length
    });
  };

  const currentQuestion = questions[currentQIndex];
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="section-header" style={{ textAlign: 'center' }}>
        <span className="category-badge" style={{ marginBottom: '0.4rem' }}>
          <span>🎯</span>
          <span>Knowledge Check</span>
        </span>
        <h1 className="section-title">Test Your Skills</h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Test and solidify your sign comprehension with video-based multiple-choice challenges.
        </p>
      </div>

      <div className="quiz-container">
        {/* State 1: Setup / Category Selection */}
        {quizState === 'setup' && (
          <div className="quiz-card">
            <h2 style={{ fontSize: '1.45rem', marginBottom: '0.75rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Choose a Quiz Challenge
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Select a specific vocabulary module or test yourself across all 40 signs.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem' }}>
              {categories.map((cat) => {
                const count = signService.getSignsByCategory(cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    className="quiz-option-btn"
                    onClick={() => startQuiz(cat, cat === 'All' ? 10 : Math.min(8, count))}
                  >
                    <div>
                      <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--color-primary-900)' }}>
                        {cat === 'All' ? 'Full Curriculum Challenge' : `${cat} Challenge`}
                      </strong>
                      <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        {cat === 'All' ? '10 randomized video questions across all categories' : `${count} available signs`}
                      </span>
                    </div>
                    <ArrowRight size={18} color="var(--color-primary-600)" />
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <strong>Notice:</strong> Multiple-choice quizzes test visual sign recognition and comprehension. They do not evaluate real physical signing hand posture.
            </div>
          </div>
        )}

        {/* State 2: Active Playing */}
        {quizState === 'playing' && currentQuestion && (
          <div className="quiz-card" role="region" aria-label="Active quiz question">
            {/* Header progress */}
            <div className="quiz-progress-top">
              <span className="category-badge">
                {quizCategory === 'All' ? 'Comprehensive' : quizCategory}
              </span>
              <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--color-primary-700)' }}>
                Question {currentQIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Question Title */}
            <h2 className="quiz-question-title">{currentQuestion.prompt}</h2>

            {/* Video Demonstration Prompt */}
            <VideoPlayer
              src={currentQuestion.correctSign.videoPath}
              title="Quiz prompt video"
              autoPlay={true}
              loop={true}
            />

            {/* Numbered Answer Options (Matching Reference 1. Answer, 2. Answer...) */}
            <div className="quiz-options-grid" role="radiogroup" aria-label="Answer options">
              {currentQuestion.options.map((opt) => {
                let btnClass = 'quiz-option-btn';
                if (isAnswerSubmitted) {
                  if (opt.isCorrect) {
                    btnClass += ' correct';
                  } else if (selectedAnswer?.id === opt.id) {
                    btnClass += ' incorrect';
                  }
                } else if (selectedAnswer?.id === opt.id) {
                  btnClass += ' selected';
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={btnClass}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isAnswerSubmitted}
                    aria-checked={selectedAnswer?.id === opt.id}
                    role="radio"
                  >
                    <span>
                      <strong style={{ marginRight: '0.4rem', color: 'var(--color-primary-600)' }}>
                        {opt.numberPrefix}
                      </strong>
                      {opt.text}
                    </span>
                    {isAnswerSubmitted && opt.isCorrect && (
                      <CheckCircle2 size={18} color="var(--color-success)" />
                    )}
                    {isAnswerSubmitted && selectedAnswer?.id === opt.id && !opt.isCorrect && (
                      <XCircle size={18} color="var(--color-error)" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Submit / Feedback Bar */}
            {!isAnswerSubmitted ? (
              <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ minWidth: '180px' }}
                  onClick={handleConfirmAnswer}
                  disabled={!selectedAnswer}
                >
                  <span>Submit Answer</span>
                </button>
              </div>
            ) : (
              <div className={`quiz-feedback-box ${selectedAnswer?.isCorrect ? 'correct' : 'incorrect'}`}>
                <div>
                  <strong>{selectedAnswer?.isCorrect ? 'Correct! Outstanding recall.' : 'Not quite right.'}</strong>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    This sign represents <strong>"{currentQuestion.correctSign.word}"</strong>: {currentQuestion.correctSign.description}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-primary btn-sm"
                  onClick={handleNextQuestion}
                >
                  <span>{currentQIndex < questions.length - 1 ? 'Next Question →' : 'View Results'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* State 3: Completed Score Screen (Matching Reference Quiz Results) */}
        {quizState === 'completed' && (
          <div className="quiz-card quiz-score-summary" role="status" aria-label="Quiz results summary">
            {/* Celebratory Shield Badge */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <AchievementBadgeItem 
                type={percentage >= 80 ? 'perfect' : percentage >= 50 ? 'champion' : 'first'} 
                label={percentage >= 80 ? 'Perfect Score' : 'Module Completed'}
              />
            </div>

            <div className="quiz-score-circle">
              <span className="quiz-score-num">{percentage}%</span>
              <span className="quiz-score-label">{score} of {questions.length}</span>
            </div>

            <h2 style={{ fontSize: '1.85rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              {percentage >= 80 ? 'Outstanding Performance!' : percentage >= 50 ? 'Great Progress!' : 'Keep Practicing!'}
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 1.75rem', fontSize: '0.95rem' }}>
              You correctly identified {score} out of {questions.length} signs in the {quizCategory} challenge. Results have been saved to your progress dashboard.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => startQuiz(quizCategory, questions.length)}
              >
                <RotateCcw size={16} />
                <span>Retry Challenge</span>
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => setQuizState('setup')}
              >
                <span>Select Another Module</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

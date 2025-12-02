
import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen, { ReviewList } from './components/ResultScreen';
import { getNextQuestion, calculateNextDifficulty } from './services/geminiService';
import { Question, QuizState } from './types';

export default function App() {
  const [gameState, setGameState] = useState<QuizState>({
    status: 'welcome',
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: {},
    answerTimes: {},
    score: 0,
    totalQuestionsToAsk: 20,
    allowedInternalTopics: []
  });

  const startExam = (count: number, selectedTopics: string[]) => {
    setGameState(prev => ({ ...prev, status: 'generating' }));
    
    // Initial Question: Start with Easy or Medium
    // Pass the selected topics to the generator
    const firstQuestion = getNextQuestion('medium', [], selectedTopics);
    
    if (firstQuestion) {
      setGameState(prev => ({
        ...prev,
        status: 'active',
        questions: [firstQuestion],
        currentQuestionIndex: 0,
        userAnswers: {},
        answerTimes: {},
        score: 0,
        totalQuestionsToAsk: count,
        allowedInternalTopics: selectedTopics
      }));
    } else {
       // Fallback in unlikely case no questions match topics (should be impossible with valid topics)
       console.error("No questions found for selected topics");
       alert("No questions found for selected topics. Please select more topics.");
       setGameState(prev => ({ ...prev, status: 'welcome' }));
    }
  };

  const handleOptionSelect = (optionIndex: number, timeTaken: number) => {
    const { currentQuestionIndex, questions, userAnswers, answerTimes } = gameState;
    const currentQuestion = questions[currentQuestionIndex];
    
    // Store answer and time
    setGameState(prev => ({
      ...prev,
      userAnswers: { ...prev.userAnswers, [currentQuestion.id]: optionIndex },
      answerTimes: { ...prev.answerTimes, [currentQuestion.id]: timeTaken }
    }));
  };

  const handleNext = () => {
    const { currentQuestionIndex, questions, totalQuestionsToAsk, userAnswers, answerTimes, allowedInternalTopics } = gameState;
    
    // If we are just moving forward through already generated questions (e.g. user went Back then Next)
    if (currentQuestionIndex < questions.length - 1) {
       setGameState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
      window.scrollTo(0, 0);
      return;
    }

    // --- ADAPTIVE LOGIC ---
    // We are at the end of the current list, need to generate the NEXT question.
    
    const lastQuestion = questions[currentQuestionIndex];
    const userAnswerIndex = userAnswers[lastQuestion.id];
    const timeTaken = answerTimes[lastQuestion.id] || 0;
    const isCorrect = userAnswerIndex === lastQuestion.correctAnswerIndex;

    // Determine new difficulty
    const nextDiff = calculateNextDifficulty(isCorrect, timeTaken, lastQuestion.difficulty);
    
    // Fetch next question
    const usedIds = questions.map(q => q.id);
    const nextQuestion = getNextQuestion(nextDiff, usedIds, allowedInternalTopics);

    if (nextQuestion && questions.length < totalQuestionsToAsk) {
      setGameState(prev => ({
        ...prev,
        questions: [...prev.questions, nextQuestion],
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
      window.scrollTo(0, 0);
    } else {
      // End of exam or no more questions
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (gameState.currentQuestionIndex > 0) {
      setGameState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
      window.scrollTo(0, 0);
    }
  };

  const handleFinish = () => {
    // Calculate Score
    let score = 0;
    gameState.questions.forEach(q => {
      if (gameState.userAnswers[q.id] === q.correctAnswerIndex) {
        score++;
      }
    });

    setGameState(prev => ({
      ...prev,
      status: 'finished',
      score
    }));
  };

  const handleRestart = () => {
    setGameState({
      status: 'welcome',
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      answerTimes: {},
      score: 0,
      totalQuestionsToAsk: 20,
      allowedInternalTopics: []
    });
  };

  // Views based on status
  if (gameState.status === 'welcome' || gameState.status === 'generating') {
    return (
      <WelcomeScreen 
        onStart={startExam} 
        isGenerating={gameState.status === 'generating'} 
      />
    );
  }

  if (gameState.status === 'active') {
    return (
      <QuizScreen
        question={gameState.questions[gameState.currentQuestionIndex]}
        totalQuestions={gameState.totalQuestionsToAsk}
        currentIndex={gameState.currentQuestionIndex}
        selectedOption={gameState.userAnswers[gameState.questions[gameState.currentQuestionIndex].id]}
        onSelectOption={handleOptionSelect}
        onNext={handleNext}
        onPrev={handlePrev}
        onFinish={handleFinish}
      />
    );
  }

  if (gameState.status === 'finished') {
    return (
      <ResultScreen 
        score={gameState.score} 
        total={gameState.questions.length}
        questions={gameState.questions}
        userAnswers={gameState.userAnswers}
        onReview={() => setGameState(prev => ({ ...prev, status: 'review' }))}
        onRetry={handleRestart}
      />
    );
  }

  if (gameState.status === 'review') {
    return (
      <ReviewList 
        questions={gameState.questions}
        userAnswers={gameState.userAnswers}
        onHome={handleRestart}
      />
    );
  }

  return <div>Error State</div>;
}

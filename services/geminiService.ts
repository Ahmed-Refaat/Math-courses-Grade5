
import { Question, Difficulty } from "../types";
import { QUESTION_BANK } from "../data/questionBank";

/**
 * Returns a question of the specified difficulty that hasn't been used yet.
 * If no question of that difficulty is available, it falls back to any available question.
 */
export const getNextQuestion = (
  currentDifficulty: Difficulty,
  usedQuestionIds: number[],
  allowedTopics: string[]
): Question | null => {
  // Filter out used questions AND questions not in allowed topics
  const availableQuestions = QUESTION_BANK.filter(q => 
    !usedQuestionIds.includes(q.id) && 
    (q.topic && allowedTopics.includes(q.topic))
  );

  if (availableQuestions.length === 0) return null;

  // Try to find one with matching difficulty
  let candidates = availableQuestions.filter(q => q.difficulty === currentDifficulty);

  // Fallback: if ran out of 'hard', try 'medium', etc.
  if (candidates.length === 0) {
    // If we wanted Hard but none left, try Medium, then Easy
    if (currentDifficulty === 'hard') {
        candidates = availableQuestions.filter(q => q.difficulty === 'medium');
        if (candidates.length === 0) candidates = availableQuestions; // Take whatever
    } 
    // If we wanted Easy but none left, try Medium
    else if (currentDifficulty === 'easy') {
        candidates = availableQuestions.filter(q => q.difficulty === 'medium');
        if (candidates.length === 0) candidates = availableQuestions;
    }
    // If Medium ran out
    else {
        candidates = availableQuestions;
    }
  }

  // Pick random from candidates
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
};

/**
 * Determines the difficulty for the next question based on performance.
 * @param isCorrect Was the last answer correct?
 * @param timeTakenSeconds How long did it take?
 * @param currentDifficulty The difficulty of the question just answered.
 */
export const calculateNextDifficulty = (
  isCorrect: boolean,
  timeTakenSeconds: number,
  currentDifficulty: Difficulty
): Difficulty => {
  // Threshold for "Quick" answer (e.g., 10 seconds)
  const QUICK_THRESHOLD = 10; 

  if (isCorrect) {
    // If correct and fast, increase difficulty
    if (timeTakenSeconds <= QUICK_THRESHOLD) {
      if (currentDifficulty === 'easy') return 'medium';
      if (currentDifficulty === 'medium') return 'hard';
      return 'hard';
    }
    // If correct but slow, maintain difficulty
    return currentDifficulty;
  } else {
    // If wrong, decrease difficulty
    if (currentDifficulty === 'hard') return 'medium';
    if (currentDifficulty === 'medium') return 'easy';
    return 'easy';
  }
};

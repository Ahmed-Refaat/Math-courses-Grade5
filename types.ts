
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  explanation: string;
  difficulty: Difficulty;
  topic?: string;
}

export interface QuizState {
  status: 'welcome' | 'generating' | 'active' | 'finished' | 'review' | 'error';
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<number, number>; // questionId -> selectedOptionIndex
  answerTimes: Record<number, number>; // questionId -> time taken in seconds
  score: number;
  totalQuestionsToAsk: number;
  allowedInternalTopics: string[]; // Track which topics are allowed in this session
}

export interface TopicOption {
  id: string;
  label: string;
  internalTopics: string[];
}

export const TOPIC_OPTIONS: TopicOption[] = [
  { 
    id: 'unit1', 
    label: 'Unit 1: Decimal Place Value & Computation', 
    internalTopics: ['Unit 1'] 
  },
  { 
    id: 'unit2', 
    label: 'Unit 2: Number Relationships (LCM, GCF, Variables)', 
    internalTopics: ['Unit 2'] 
  },
  { 
    id: 'unit3', 
    label: 'Unit 3: Multiplication with Whole Numbers', 
    internalTopics: ['Unit 3'] 
  },
  { 
    id: 'unit4', 
    label: 'Unit 4: Division with Whole Numbers', 
    internalTopics: ['Unit 4'] 
  },
  { 
    id: 'unit5', 
    label: 'Unit 5: Mult & Div with Decimals (Powers of 10)', 
    internalTopics: ['Unit 5'] 
  },
  { 
    id: 'unit6', 
    label: 'Unit 6: Numerical Expressions & Patterns', 
    internalTopics: ['Unit 6'] 
  }
];

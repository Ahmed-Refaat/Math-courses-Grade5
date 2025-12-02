
import React, { useEffect, useRef } from 'react';
import { Question } from '../types';
import { ArrowLeft, ArrowRight, CheckCircle, Flag, Zap } from 'lucide-react';

interface QuizScreenProps {
  question: Question;
  totalQuestions: number;
  currentIndex: number;
  selectedOption: number | undefined;
  onSelectOption: (index: number, timeTaken: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({
  question,
  totalQuestions,
  currentIndex,
  selectedOption,
  onSelectOption,
  onNext,
  onPrev,
  onFinish
}) => {
  const startTimeRef = useRef<number>(Date.now());
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  // Reset timer when question changes
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [question.id]);

  const handleOptionClick = (idx: number) => {
    if (selectedOption !== undefined) return; // Prevent changing if locked (optional, but good for adaptive logic accuracy)
    
    const endTime = Date.now();
    const timeTaken = (endTime - startTimeRef.current) / 1000; // seconds
    onSelectOption(idx, timeTaken);
  };

  // Difficulty Badge Color
  const getDiffColor = (d: string) => {
    switch(d) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full min-h-screen flex flex-col p-4 md:p-6">
      {/* Header / Progress */}
      <div className="mb-6 sticky top-0 bg-indigo-50 pt-4 z-10 pb-4">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-bold text-indigo-900 bg-indigo-200 px-3 py-1 rounded-lg">
            Question {currentIndex + 1} / {totalQuestions}
          </span>
          <span className={`text-xs font-bold px-2 py-1 rounded border uppercase tracking-wide flex items-center gap-1 ${getDiffColor(question.difficulty)}`}>
            <Zap className="w-3 h-3" /> {question.difficulty}
          </span>
        </div>
        <div className="h-3 w-full bg-indigo-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-grow flex flex-col">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 mb-6 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-2 h-full ${
            question.difficulty === 'hard' ? 'bg-red-500' : question.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
          }`}></div>
          <h2 className="text-2xl md:text-3xl font-medium text-slate-800 leading-relaxed">
            {question.text}
          </h2>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-24">
          {question.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                className={`
                  relative p-6 rounded-2xl text-left border-2 transition-all duration-200 group
                  ${isSelected 
                    ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-200 ring-offset-1' 
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                  }
                `}
              >
                <div className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 border-2
                    ${isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 text-slate-500 border-slate-300 group-hover:border-indigo-400'}
                  `}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={`text-lg ${isSelected ? 'font-semibold text-indigo-900' : 'text-slate-700'}`}>
                    {option}
                  </span>
                </div>
                {isSelected && (
                  <CheckCircle className="absolute top-1/2 right-4 transform -translate-y-1/2 text-indigo-600 w-6 h-6 opacity-50" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg z-20">
        <div className="max-w-3xl mx-auto flex justify-between items-center gap-4">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className={`
              flex items-center px-6 py-3 rounded-xl font-semibold transition-colors
              ${currentIndex === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}
            `}
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>

          {currentIndex === totalQuestions - 1 ? (
            <button
              onClick={onFinish}
              className="flex items-center px-8 py-3 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 shadow-md transition-transform hover:scale-105"
            >
              Finish Exam <Flag className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={selectedOption === undefined}
              className={`
                flex items-center px-8 py-3 rounded-xl font-bold shadow-md transition-transform hover:scale-105
                ${selectedOption === undefined 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }
              `}
            >
              Next <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;

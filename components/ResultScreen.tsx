import React from 'react';
import { Question } from '../types';
import { RotateCcw, BookOpen, Trophy, AlertTriangle, Check, X } from 'lucide-react';

interface ResultProps {
  score: number;
  total: number;
  questions: Question[];
  userAnswers: Record<number, number>;
  onReview: () => void;
  onRetry: () => void;
}

const ResultScreen: React.FC<ResultProps> = ({ score, total, questions, userAnswers, onReview, onRetry }) => {
  const percentage = Math.round((score / total) * 100);
  
  let message = "";
  let color = "";
  
  if (percentage >= 90) {
    message = "Outstanding! You're a Math Wizard!";
    color = "text-green-600";
  } else if (percentage >= 70) {
    message = "Great Job! Keep practicing!";
    color = "text-blue-600";
  } else {
    message = "Good effort! Let's review the mistakes.";
    color = "text-orange-600";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full border-t-8 border-indigo-500">
        <div className="mb-6 relative inline-block">
          <Trophy className={`w-24 h-24 mx-auto ${percentage >= 70 ? 'text-yellow-400' : 'text-slate-300'}`} />
          {percentage >= 90 && (
            <div className="absolute -top-2 -right-2 text-4xl">✨</div>
          )}
        </div>

        <h2 className="text-3xl font-bold text-slate-800 mb-2">Exam Complete!</h2>
        <p className={`text-lg font-medium mb-6 ${color}`}>{message}</p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
          <div className="text-5xl font-black text-slate-800 mb-2">
            {score} <span className="text-2xl text-slate-400 font-normal">/ {total}</span>
          </div>
          <p className="text-slate-500 uppercase text-xs font-bold tracking-widest">Final Score</p>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onReview}
            className="w-full py-4 rounded-xl bg-indigo-100 text-indigo-700 font-bold hover:bg-indigo-200 transition-colors flex items-center justify-center"
          >
            <BookOpen className="w-5 h-5 mr-2" /> Review Answers
          </button>
          
          <button 
            onClick={onRetry}
            className="w-full py-4 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5 mr-2" /> Take New Exam
          </button>
        </div>
      </div>
    </div>
  );
};

interface ReviewListProps {
  questions: Question[];
  userAnswers: Record<number, number>;
  onHome: () => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({ questions, userAnswers, onHome }) => {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 sticky top-4 bg-slate-50/90 backdrop-blur-sm z-10 py-4">
          <h2 className="text-2xl font-bold text-slate-800">Exam Review</h2>
          <button onClick={onHome} className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-700">
            Back to Home
          </button>
        </div>

        <div className="space-y-6">
          {questions.map((q, index) => {
            const userAnswerIdx = userAnswers[q.id];
            const isCorrect = userAnswerIdx === q.correctAnswerIndex;
            const isSkipped = userAnswerIdx === undefined;

            return (
              <div key={q.id} className={`bg-white rounded-2xl shadow-sm border-l-8 p-6 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex items-start gap-4">
                  <span className="bg-slate-100 text-slate-600 font-bold w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-slate-900 mb-4">{q.text}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {q.options.map((opt, i) => {
                        let styles = "border-slate-200 bg-white text-slate-500";
                        let icon = null;

                        if (i === q.correctAnswerIndex) {
                          styles = "border-green-200 bg-green-50 text-green-800 font-semibold ring-1 ring-green-200";
                          icon = <Check className="w-4 h-4 text-green-600" />;
                        } else if (i === userAnswerIdx && !isCorrect) {
                          styles = "border-red-200 bg-red-50 text-red-800 font-medium";
                          icon = <X className="w-4 h-4 text-red-600" />;
                        }

                        return (
                          <div key={i} className={`p-3 rounded-lg border flex items-center justify-between ${styles}`}>
                            <span>{String.fromCharCode(65 + i)}. {opt}</span>
                            {icon}
                          </div>
                        )
                      })}
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 flex items-start">
                       <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500" />
                       <div>
                         <span className="font-bold block mb-1">Explanation:</span>
                         {q.explanation}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ResultScreen;
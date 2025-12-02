
import React, { useState } from 'react';
import { Brain, Calculator, ChevronRight, Settings, CheckSquare, Square } from 'lucide-react';
import { TOPIC_OPTIONS, TopicOption } from '../types';

interface WelcomeProps {
  onStart: (count: number, selectedTopics: string[]) => void;
  isGenerating: boolean;
}

const WelcomeScreen: React.FC<WelcomeProps> = ({ onStart, isGenerating }) => {
  const [questionCount, setQuestionCount] = useState<number>(20);
  // Default all topics selected
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>(TOPIC_OPTIONS.map(t => t.id));

  const handleStart = () => {
    // Flatten the selected user topics into a single array of internal topic strings
    const internalTopics = TOPIC_OPTIONS
      .filter(t => selectedTopicIds.includes(t.id))
      .flatMap(t => t.internalTopics);
      
    onStart(questionCount, internalTopics);
  };

  const toggleTopic = (id: string) => {
    setSelectedTopicIds(prev => {
      if (prev.includes(id)) {
        // Prevent unselecting the last one
        if (prev.length === 1) return prev;
        return prev.filter(t => t !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full border-b-8 border-indigo-200">
        <div className="bg-indigo-100 p-4 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <Brain className="w-12 h-12 text-indigo-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-slate-800 mb-2 fun-font">Math Master Exam</h1>
        <p className="text-slate-500 mb-6 text-lg">Grade 5 • Adaptive Difficulty</p>

        {/* Configuration Section */}
        <div className="text-left space-y-6">
          
          {/* Topics Selection */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-3 flex items-center">
              <Calculator className="w-4 h-4 mr-2" />
              Select Topics:
            </h3>
            <div className="space-y-3">
              {TOPIC_OPTIONS.map((topic) => {
                const isSelected = selectedTopicIds.includes(topic.id);
                return (
                  <button 
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className="flex items-center w-full text-left group"
                  >
                    <div className={`mr-3 transition-colors ${isSelected ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-400'}`}>
                      {isSelected ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                    </div>
                    <span className={`text-sm md:text-base ${isSelected ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                      {topic.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Count Selection */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
             <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center justify-center">
               <Settings className="w-4 h-4 mr-1" /> Number of Questions
             </label>
             <div className="flex items-center justify-center gap-4">
               <input 
                 type="range" 
                 min="5" 
                 max="150" 
                 step="5"
                 value={questionCount} 
                 onChange={(e) => setQuestionCount(Number(e.target.value))}
                 className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
               />
               <span className="font-bold text-indigo-800 bg-indigo-100 px-3 py-1 rounded-lg min-w-[3rem] text-center">
                 {questionCount}
               </span>
             </div>
             <p className="text-xs text-slate-500 mt-2 text-center">
               Fast correct answers unlock harder questions!
             </p>
          </div>
        </div>

        <button 
          onClick={handleStart}
          disabled={isGenerating}
          className={`
            w-full mt-8 py-4 px-6 rounded-2xl font-bold text-xl text-white transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center
            ${isGenerating ? 'bg-slate-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'}
          `}
        >
          {isGenerating ? (
            <>
              <span className="animate-spin mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              Preparing...
            </>
          ) : (
            <>
              Start Exam <ChevronRight className="ml-2 w-6 h-6" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;

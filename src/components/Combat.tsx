import React, { useState, useEffect } from 'react';
import { Enemy } from '../types/game';
import { Sword, Shield, Heart, Brain, Clock, Zap } from 'lucide-react';
import { TriviaQuestion, getQuestionByZone } from '../utils/triviaQuestions';

interface CombatProps {
  enemy: Enemy;
  playerStats: {
    hp: number;
    maxHp: number;
    atk: number;
    def: number;
  };
  onAttack: (hit: boolean, category?: string) => void;
  combatLog: string[];
  gameMode: {
    current: 'normal' | 'speed' | 'survival';
    speedModeActive: boolean;
    survivalLives: number;
    maxSurvivalLives: number;
  };
  knowledgeStreak: {
    current: number;
    best: number;
    multiplier: number;
  };
}

export const Combat: React.FC<CombatProps> = ({ 
  enemy, 
  playerStats, 
  onAttack, 
  combatLog, 
  gameMode,
  knowledgeStreak 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<TriviaQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);

  const questionTime = gameMode.speedModeActive ? 3 : 5;

  useEffect(() => {
    const question = getQuestionByZone(enemy.zone);
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setTimeLeft(questionTime);
    setShowResult(false);
    setLastAnswerCorrect(null);
  }, [enemy, questionTime]);

  useEffect(() => {
    if (!currentQuestion || isAnswering || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, isAnswering, showResult]);

  const handleAnswer = (answerIndex: number | null) => {
    if (isAnswering || !currentQuestion) return;

    setIsAnswering(true);
    setSelectedAnswer(answerIndex);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    setLastAnswerCorrect(isCorrect);
    setShowResult(true);

    setTimeout(() => {
      onAttack(isCorrect, currentQuestion.category);
      
      const newQuestion = getQuestionByZone(enemy.zone);
      setCurrentQuestion(newQuestion);
      setSelectedAnswer(null);
      setIsAnswering(false);
      setTimeLeft(questionTime);
      setShowResult(false);
      setLastAnswerCorrect(null);
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyBorder = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'border-green-400';
      case 'medium': return 'border-yellow-400';
      case 'hard': return 'border-red-400';
      default: return 'border-gray-400';
    }
  };

  if (!currentQuestion) {
    return (
      <div className="bg-gradient-to-br from-red-900 via-purple-900 to-black p-3 sm:p-6 rounded-lg shadow-2xl">
        <div className="text-center py-8">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mb-4"></div>
          <p className="text-white text-lg">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-red-900 via-purple-900 to-black p-3 sm:p-6 rounded-lg shadow-2xl">
      <div className="text-center mb-4 sm:mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Combat - Zone {enemy.zone}</h2>
          {gameMode.speedModeActive && (
            <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
          )}
        </div>
        <p className="text-red-300 text-base sm:text-lg font-semibold">{enemy.name}</p>
        
        {/* Game Mode Info */}
        <div className="flex items-center justify-center gap-4 mt-2 text-sm">
          <span className={`px-2 py-1 rounded ${
            gameMode.current === 'speed' ? 'bg-yellow-600' :
            gameMode.current === 'survival' ? 'bg-red-600' : 'bg-blue-600'
          } text-white font-semibold`}>
            {gameMode.current.toUpperCase()} MODE
          </span>
          
          {gameMode.current === 'survival' && (
            <span className="text-red-300">
              Lives: {gameMode.survivalLives}/{gameMode.maxSurvivalLives}
            </span>
          )}
          
          {knowledgeStreak.current > 0 && (
            <span className="text-yellow-300 flex items-center gap-1">
              🔥 {knowledgeStreak.current} Streak ({Math.round((knowledgeStreak.multiplier - 1) * 100)}% bonus)
            </span>
          )}
        </div>
      </div>

      {/* Health Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="bg-black/30 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            <span className="text-white font-semibold text-sm sm:text-base">You</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-400 h-2 sm:h-3 rounded-full transition-all duration-300"
              style={{ width: `${(playerStats.hp / playerStats.maxHp) * 100}%` }}
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">{playerStats.hp}/{playerStats.maxHp}</p>
          <div className="flex gap-2 sm:gap-4 mt-2 text-xs sm:text-sm">
            <span className="text-orange-400 flex items-center gap-1">
              <Sword className="w-3 h-3 sm:w-4 sm:h-4" />
              {playerStats.atk}
            </span>
            <span className="text-blue-400 flex items-center gap-1">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              {playerStats.def}
            </span>
          </div>
        </div>

        <div className="bg-black/30 p-3 sm:p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            <span className="text-white font-semibold text-sm sm:text-base">{enemy.name}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
            <div 
              className="bg-gradient-to-r from-red-500 to-red-400 h-2 sm:h-3 rounded-full transition-all duration-300"
              style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">{enemy.hp}/{enemy.maxHp}</p>
          <div className="flex gap-2 sm:gap-4 mt-2 text-xs sm:text-sm">
            <span className="text-orange-400 flex items-center gap-1">
              <Sword className="w-3 h-3 sm:w-4 sm:h-4" />
              {enemy.atk}
            </span>
            <span className="text-blue-400 flex items-center gap-1">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              {enemy.def}
            </span>
          </div>
        </div>
      </div>

      {/* Trivia Question Section */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            <h3 className="text-white font-semibold text-sm sm:text-base">Knowledge Challenge</h3>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            <span className={`font-bold text-sm sm:text-base ${
              timeLeft <= 2 ? 'text-red-400 animate-pulse' : 'text-yellow-400'
            }`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Question Card */}
        <div className={`bg-black/40 p-4 sm:p-6 rounded-lg border-2 ${getDifficultyBorder(currentQuestion.difficulty)} mb-4`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm text-gray-400">{currentQuestion.category}</span>
            <span className={`text-xs sm:text-sm font-semibold ${getDifficultyColor(currentQuestion.difficulty)}`}>
              {currentQuestion.difficulty.toUpperCase()}
            </span>
          </div>
          <p className="text-white font-semibold text-sm sm:text-lg mb-4 leading-relaxed">
            {currentQuestion.question}
          </p>

          {/* Answer Options */}
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = 'bg-gray-700 hover:bg-gray-600 text-white';
              
              if (showResult) {
                if (index === currentQuestion.correctAnswer) {
                  buttonClass = 'bg-green-600 text-white';
                } else if (index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) {
                  buttonClass = 'bg-red-600 text-white';
                } else {
                  buttonClass = 'bg-gray-600 text-gray-400';
                }
              } else if (selectedAnswer === index) {
                buttonClass = 'bg-blue-600 text-white';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswering || showResult}
                  className={`p-2 sm:p-3 rounded-lg font-semibold transition-all duration-200 text-left text-xs sm:text-sm ${buttonClass} ${
                    !isAnswering && !showResult ? 'hover:scale-102' : 'cursor-not-allowed'
                  }`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Result Feedback */}
        {showResult && (
          <div className={`text-center p-3 sm:p-4 rounded-lg ${
            lastAnswerCorrect 
              ? 'bg-green-900/50 border border-green-500' 
              : 'bg-red-900/50 border border-red-500'
          }`}>
            <p className={`font-bold text-sm sm:text-base ${
              lastAnswerCorrect ? 'text-green-400' : 'text-red-400'
            }`}>
              {lastAnswerCorrect 
                ? '🎉 Correct! You deal damage!' 
                : '❌ Wrong! The enemy attacks you!'}
            </p>
            {!lastAnswerCorrect && (
              <p className="text-gray-300 text-xs sm:text-sm mt-1">
                Correct answer: {String.fromCharCode(65 + currentQuestion.correctAnswer)}. {currentQuestion.options[currentQuestion.correctAnswer]}
              </p>
            )}
          </div>
        )}

        <div className="text-center mt-3">
          <p className="text-xs sm:text-sm text-gray-300">
            Answer correctly to <span className="text-green-400 font-semibold">deal damage</span>!
          </p>
          <p className={`text-xs font-semibold ${
            gameMode.speedModeActive ? 'text-yellow-400' : 'text-red-400'
          }`}>
            ⚠️ Only {questionTime} seconds to answer!
          </p>
        </div>
      </div>

      {/* Combat Log */}
      <div className="bg-black/40 rounded-lg p-3 sm:p-4 max-h-32 sm:max-h-40 overflow-y-auto">
        <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">Combat Log</h4>
        <div className="space-y-1">
          {combatLog.slice(-6).map((log, index) => (
            <p key={index} className="text-xs sm:text-sm text-gray-300">
              {log}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
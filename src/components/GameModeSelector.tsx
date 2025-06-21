import React from 'react';
import { GameMode } from '../types/game';
import { Zap, Heart, Clock, X } from 'lucide-react';

interface GameModeSelectorProps {
  currentMode: GameMode;
  onSelectMode: (mode: 'normal' | 'speed' | 'survival') => void;
  onClose: () => void;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({ 
  currentMode, 
  onSelectMode, 
  onClose 
}) => {
  const modes = [
    {
      id: 'normal' as const,
      name: 'Normal Mode',
      description: 'Standard gameplay with 5 seconds per question',
      icon: Clock,
      color: 'blue',
      features: ['5 seconds per question', 'Standard rewards', 'Full health restoration']
    },
    {
      id: 'speed' as const,
      name: 'Speed Mode',
      description: 'Fast-paced action with 3 seconds per question',
      icon: Zap,
      color: 'yellow',
      features: ['3 seconds per question', '+50% coin rewards', '+25% gem rewards', 'Adrenaline rush!']
    },
    {
      id: 'survival' as const,
      name: 'Survival Mode',
      description: 'One life only - how far can you go?',
      icon: Heart,
      color: 'red',
      features: ['One life only', 'No health restoration', '+100% rewards', 'Ultimate challenge']
    }
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      blue: {
        border: isSelected ? 'border-blue-500' : 'border-blue-500/30',
        bg: isSelected ? 'bg-blue-900/50' : 'bg-blue-900/20',
        text: 'text-blue-400',
        button: 'bg-blue-600 hover:bg-blue-500'
      },
      yellow: {
        border: isSelected ? 'border-yellow-500' : 'border-yellow-500/30',
        bg: isSelected ? 'bg-yellow-900/50' : 'bg-yellow-900/20',
        text: 'text-yellow-400',
        button: 'bg-yellow-600 hover:bg-yellow-500'
      },
      red: {
        border: isSelected ? 'border-red-500' : 'border-red-500/30',
        bg: isSelected ? 'bg-red-900/50' : 'bg-red-900/20',
        text: 'text-red-400',
        button: 'bg-red-600 hover:bg-red-500'
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-slate-900 p-4 sm:p-6 rounded-lg border border-gray-500/50 max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-white font-bold text-lg sm:text-xl">Select Game Mode</h2>
            <p className="text-gray-300 text-sm">Choose your adventure style</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modes.map((mode) => {
            const isSelected = currentMode.current === mode.id;
            const colorClasses = getColorClasses(mode.color, isSelected);
            const Icon = mode.icon;

            return (
              <div
                key={mode.id}
                className={`p-4 rounded-lg border-2 transition-all ${colorClasses.border} ${colorClasses.bg}`}
              >
                <div className="text-center mb-4">
                  <Icon className={`w-12 h-12 mx-auto mb-2 ${colorClasses.text}`} />
                  <h3 className={`font-bold text-lg ${colorClasses.text}`}>
                    {mode.name}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">
                    {mode.description}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  {mode.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${colorClasses.text.replace('text-', 'bg-')}`} />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onSelectMode(mode.id)}
                  disabled={isSelected}
                  className={`w-full py-2 rounded-lg font-semibold text-white transition-all ${
                    isSelected
                      ? 'bg-gray-600 cursor-not-allowed'
                      : colorClasses.button
                  }`}
                >
                  {isSelected ? 'Current Mode' : 'Select Mode'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Current Mode Info */}
        {currentMode.current === 'survival' && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-sm text-center">
              <Heart className="w-4 h-4 inline mr-1" />
              Survival Mode: {currentMode.survivalLives}/{currentMode.maxSurvivalLives} lives remaining
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
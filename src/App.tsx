import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { Combat } from './components/Combat';
import { Shop } from './components/Shop';
import { Inventory } from './components/Inventory';
import { PlayerStats } from './components/PlayerStats';
import { Research } from './components/Research';
import { Achievements } from './components/Achievements';
import { CollectionBook } from './components/CollectionBook';
import { Statistics } from './components/Statistics';
import { GameModeSelector } from './components/GameModeSelector';
import { FloatingText, ParticleEffect, ScreenShake } from './components/VisualEffects';
import { Shield, Package, User, Play, RotateCcw, Brain, Crown, Trophy, Book, BarChart3, Settings } from 'lucide-react';

type GameView = 'stats' | 'shop' | 'inventory' | 'research';
type ModalView = 'achievements' | 'collection' | 'statistics' | 'gameMode' | null;

function App() {
  const {
    gameState,
    isLoading,
    visualEffects,
    clearVisualEffect,
    equipWeapon,
    equipArmor,
    upgradeWeapon,
    upgradeArmor,
    sellWeapon,
    sellArmor,
    upgradeResearch,
    openChest,
    startCombat,
    attack,
    resetGame,
    setGameMode,
  } = useGameState();

  const [currentView, setCurrentView] = useState<GameView>('stats');
  const [currentModal, setCurrentModal] = useState<ModalView>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading Hugoland...</p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    if (gameState.inCombat && gameState.currentEnemy) {
      return (
        <Combat
          enemy={gameState.currentEnemy}
          playerStats={gameState.playerStats}
          onAttack={attack}
          combatLog={gameState.combatLog}
          gameMode={gameState.gameMode}
          knowledgeStreak={gameState.knowledgeStreak}
        />
      );
    }

    switch (currentView) {
      case 'stats':
        return (
          <div className="space-y-6">
            <PlayerStats
              playerStats={gameState.playerStats}
              zone={gameState.zone}
              coins={gameState.coins}
              gems={gameState.gems}
            />
            
            {/* Knowledge Streak Display */}
            {gameState.knowledgeStreak.current > 0 && (
              <div className="bg-gradient-to-r from-yellow-900 to-orange-900 p-4 rounded-lg border border-yellow-500/50">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">🔥</span>
                    <h3 className="text-yellow-400 font-bold text-lg">Knowledge Streak!</h3>
                  </div>
                  <p className="text-white text-sm">
                    {gameState.knowledgeStreak.current} correct answers in a row
                  </p>
                  <p className="text-yellow-300 text-sm">
                    +{Math.round((gameState.knowledgeStreak.multiplier - 1) * 100)}% reward bonus
                  </p>
                </div>
              </div>
            )}

            <div className="text-center space-y-4">
              <button
                onClick={startCombat}
                disabled={gameState.playerStats.hp <= 0}
                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-white transition-all duration-200 transform flex items-center gap-3 mx-auto text-sm sm:text-base ${
                  gameState.playerStats.hp > 0
                    ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 hover:scale-105 shadow-lg hover:shadow-green-500/25'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                {gameState.playerStats.hp <= 0 ? 'You are defeated!' : 'Start Adventure'}
              </button>
              
              {gameState.playerStats.hp <= 0 && (
                <p className="text-red-400 mt-2 text-sm">
                  Visit the shop to get better equipment and try again!
                </p>
              )}
              
              {gameState.isPremium && (
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-3 rounded-lg">
                  <div className="flex items-center justify-center gap-2">
                    <Crown className="w-5 h-5 text-white" />
                    <span className="text-white font-bold">🎉 PREMIUM MEMBER UNLOCKED! 🎉</span>
                  </div>
                  <p className="text-yellow-100 text-sm mt-1">
                    You've reached Zone 50! Enjoy exclusive Mythical Chests and special rewards!
                  </p>
                </div>
              )}
              
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setCurrentModal('gameMode')}
                  className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 transition-all duration-200 flex items-center gap-2 text-sm"
                >
                  <Settings className="w-4 h-4" />
                  Game Mode
                </button>
                
                <button
                  onClick={resetGame}
                  className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 transition-all duration-200 flex items-center gap-2 text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Game
                </button>
              </div>
            </div>
          </div>
        );
      case 'shop':
        return <Shop coins={gameState.coins} onOpenChest={openChest} isPremium={gameState.isPremium} />;
      case 'inventory':
        return (
          <Inventory
            inventory={gameState.inventory}
            gems={gameState.gems}
            onEquipWeapon={equipWeapon}
            onEquipArmor={equipArmor}
            onUpgradeWeapon={upgradeWeapon}
            onUpgradeArmor={upgradeArmor}
            onSellWeapon={sellWeapon}
            onSellArmor={sellArmor}
          />
        );
      case 'research':
        return (
          <Research
            research={gameState.research}
            coins={gameState.coins}
            onUpgradeResearch={upgradeResearch}
            isPremium={gameState.isPremium}
          />
        );
      default:
        return null;
    }
  };

  const renderModal = () => {
    switch (currentModal) {
      case 'achievements':
        return (
          <Achievements
            achievements={gameState.achievements}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'collection':
        return (
          <CollectionBook
            collectionBook={gameState.collectionBook}
            allWeapons={gameState.inventory.weapons}
            allArmor={gameState.inventory.armor}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'statistics':
        return (
          <Statistics
            statistics={gameState.statistics}
            onClose={() => setCurrentModal(null)}
          />
        );
      case 'gameMode':
        return (
          <GameModeSelector
            currentMode={gameState.gameMode}
            onSelectMode={setGameMode}
            onClose={() => setCurrentModal(null)}
          />
        );
      default:
        return null;
    }
  };

  const unlockedAchievements = gameState.achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Visual Effects */}
      {visualEffects.showFloatingText && (
        <FloatingText
          text={visualEffects.floatingText}
          color={visualEffects.floatingTextColor}
          onComplete={() => clearVisualEffect('text')}
        />
      )}
      {visualEffects.showParticles && (
        <ParticleEffect
          trigger={visualEffects.showParticles}
          onComplete={() => clearVisualEffect('particles')}
        />
      )}
      {visualEffects.showScreenShake && (
        <ScreenShake
          trigger={visualEffects.showScreenShake}
          onComplete={() => clearVisualEffect('shake')}
        />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 via-violet-800 to-purple-800 shadow-2xl">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center">
              🏰 Hugoland 🗡️
            </h1>
            {gameState.isPremium && (
              <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 animate-pulse" />
            )}
          </div>
          
          {/* Quick Stats Bar */}
          <div className="flex justify-center items-center gap-4 mb-4 text-sm">
            <button
              onClick={() => setCurrentModal('achievements')}
              className="flex items-center gap-1 text-yellow-300 hover:text-yellow-200 transition-colors"
            >
              <Trophy className="w-4 h-4" />
              <span>{unlockedAchievements}/{gameState.achievements.length}</span>
            </button>
            
            <button
              onClick={() => setCurrentModal('collection')}
              className="flex items-center gap-1 text-indigo-300 hover:text-indigo-200 transition-colors"
            >
              <Book className="w-4 h-4" />
              <span>{gameState.collectionBook.totalWeaponsFound + gameState.collectionBook.totalArmorFound}</span>
            </button>
            
            <button
              onClick={() => setCurrentModal('statistics')}
              className="flex items-center gap-1 text-blue-300 hover:text-blue-200 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span>{Math.round((gameState.statistics.correctAnswers / Math.max(gameState.statistics.totalQuestionsAnswered, 1)) * 100)}%</span>
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex justify-center space-x-1 sm:space-x-2 overflow-x-auto pb-2">
            {[
              { id: 'stats', label: 'Hero', icon: User },
              { id: 'research', label: 'Research', icon: Brain },
              { id: 'shop', label: 'Shop', icon: Package },
              { id: 'inventory', label: 'Inventory', icon: Shield },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id as GameView)}
                disabled={gameState.inCombat}
                className={`px-2 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap ${
                  currentView === id
                    ? 'bg-white text-purple-800 shadow-lg'
                    : gameState.inCombat
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-700 text-white hover:bg-purple-600 hover:scale-105'
                }`}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {renderCurrentView()}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-gray-400 text-xs sm:text-sm px-4">
        Welcome to Hugoland - Where knowledge meets power! 
        {gameState.isPremium && <span className="text-yellow-400 ml-2">👑 Premium Member</span>}
        {gameState.knowledgeStreak.current > 0 && (
          <span className="text-yellow-400 ml-2">🔥 {gameState.knowledgeStreak.current} Streak</span>
        )}
      </div>

      {/* Modals */}
      {renderModal()}
    </div>
  );
}

export default App;
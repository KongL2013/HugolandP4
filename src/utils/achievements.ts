import { Achievement, GameState } from '../types/game';

export const achievementDefinitions: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  {
    id: 'first_victory',
    name: 'First Victory',
    description: 'Win your first battle',
    icon: '🏆',
    maxProgress: 1,
    reward: { coins: 50, gems: 5 }
  },
  {
    id: 'zone_master_10',
    name: 'Zone Explorer',
    description: 'Reach Zone 10',
    icon: '🗺️',
    maxProgress: 10,
    reward: { coins: 200, gems: 10 }
  },
  {
    id: 'zone_master_25',
    name: 'Zone Conqueror',
    description: 'Reach Zone 25',
    icon: '⚔️',
    maxProgress: 25,
    reward: { coins: 500, gems: 25 }
  },
  {
    id: 'zone_master_50',
    name: 'Zone Legend',
    description: 'Reach Zone 50 and unlock Premium',
    icon: '👑',
    maxProgress: 50,
    reward: { coins: 1000, gems: 50, special: 'Premium Access' }
  },
  {
    id: 'collector_25',
    name: 'Item Collector',
    description: 'Collect 25 different items',
    icon: '📦',
    maxProgress: 25,
    reward: { coins: 300, gems: 15 }
  },
  {
    id: 'collector_50',
    name: 'Master Collector',
    description: 'Collect 50 different items',
    icon: '🎒',
    maxProgress: 50,
    reward: { coins: 750, gems: 35 }
  },
  {
    id: 'scholar_tier_3',
    name: 'Scholar',
    description: 'Reach Research Tier 3',
    icon: '🧠',
    maxProgress: 3,
    reward: { coins: 400, gems: 20 }
  },
  {
    id: 'scholar_tier_5',
    name: 'Master Scholar',
    description: 'Reach Research Tier 5',
    icon: '📚',
    maxProgress: 5,
    reward: { coins: 800, gems: 40 }
  },
  {
    id: 'streak_master_10',
    name: 'Knowledge Streak',
    description: 'Get 10 correct answers in a row',
    icon: '🔥',
    maxProgress: 10,
    reward: { coins: 250, gems: 12 }
  },
  {
    id: 'streak_master_25',
    name: 'Genius Streak',
    description: 'Get 25 correct answers in a row',
    icon: '⚡',
    maxProgress: 25,
    reward: { coins: 600, gems: 30 }
  },
  {
    id: 'wealthy_1000',
    name: 'Coin Collector',
    description: 'Earn 1000 total coins',
    icon: '💰',
    maxProgress: 1000,
    reward: { gems: 20 }
  },
  {
    id: 'wealthy_5000',
    name: 'Rich Adventurer',
    description: 'Earn 5000 total coins',
    icon: '💎',
    maxProgress: 5000,
    reward: { gems: 50 }
  },
  {
    id: 'chest_opener_10',
    name: 'Treasure Hunter',
    description: 'Open 10 chests',
    icon: '🗝️',
    maxProgress: 10,
    reward: { coins: 200, gems: 10 }
  },
  {
    id: 'accuracy_master',
    name: 'Perfect Scholar',
    description: 'Maintain 90% accuracy over 50 questions',
    icon: '🎯',
    maxProgress: 50,
    reward: { coins: 500, gems: 25 }
  },
  {
    id: 'legendary_finder',
    name: 'Legendary Hunter',
    description: 'Find your first Legendary item',
    icon: '✨',
    maxProgress: 1,
    reward: { coins: 300, gems: 15 }
  },
  {
    id: 'mythical_finder',
    name: 'Mythical Seeker',
    description: 'Find your first Mythical item',
    icon: '🌟',
    maxProgress: 1,
    reward: { coins: 500, gems: 25 }
  }
];

export const checkAchievements = (gameState: GameState): Achievement[] => {
  const newUnlocks: Achievement[] = [];
  
  achievementDefinitions.forEach(def => {
    const existing = gameState.achievements.find(a => a.id === def.id);
    if (existing?.unlocked) return;

    let progress = 0;
    let shouldUnlock = false;

    switch (def.id) {
      case 'first_victory':
        progress = gameState.zone > 1 ? 1 : 0;
        break;
      case 'zone_master_10':
        progress = Math.min(gameState.zone, 10);
        shouldUnlock = gameState.zone >= 10;
        break;
      case 'zone_master_25':
        progress = Math.min(gameState.zone, 25);
        shouldUnlock = gameState.zone >= 25;
        break;
      case 'zone_master_50':
        progress = Math.min(gameState.zone, 50);
        shouldUnlock = gameState.zone >= 50;
        break;
      case 'collector_25':
        progress = Math.min(gameState.collectionBook.totalWeaponsFound + gameState.collectionBook.totalArmorFound, 25);
        shouldUnlock = progress >= 25;
        break;
      case 'collector_50':
        progress = Math.min(gameState.collectionBook.totalWeaponsFound + gameState.collectionBook.totalArmorFound, 50);
        shouldUnlock = progress >= 50;
        break;
      case 'scholar_tier_3':
        progress = Math.min(gameState.research.tier + 1, 3);
        shouldUnlock = gameState.research.tier >= 2;
        break;
      case 'scholar_tier_5':
        progress = Math.min(gameState.research.tier + 1, 5);
        shouldUnlock = gameState.research.tier >= 4;
        break;
      case 'streak_master_10':
        progress = Math.min(gameState.knowledgeStreak.best, 10);
        shouldUnlock = gameState.knowledgeStreak.best >= 10;
        break;
      case 'streak_master_25':
        progress = Math.min(gameState.knowledgeStreak.best, 25);
        shouldUnlock = gameState.knowledgeStreak.best >= 25;
        break;
      case 'wealthy_1000':
        progress = Math.min(gameState.statistics.coinsEarned, 1000);
        shouldUnlock = gameState.statistics.coinsEarned >= 1000;
        break;
      case 'wealthy_5000':
        progress = Math.min(gameState.statistics.coinsEarned, 5000);
        shouldUnlock = gameState.statistics.coinsEarned >= 5000;
        break;
      case 'chest_opener_10':
        progress = Math.min(gameState.statistics.chestsOpened, 10);
        shouldUnlock = gameState.statistics.chestsOpened >= 10;
        break;
      case 'accuracy_master':
        const totalAnswered = gameState.statistics.totalQuestionsAnswered;
        if (totalAnswered >= 50) {
          const accuracy = gameState.statistics.correctAnswers / totalAnswered;
          progress = accuracy >= 0.9 ? 50 : 0;
          shouldUnlock = accuracy >= 0.9;
        }
        break;
      case 'legendary_finder':
        progress = gameState.collectionBook.rarityStats.legendary > 0 ? 1 : 0;
        shouldUnlock = progress >= 1;
        break;
      case 'mythical_finder':
        progress = gameState.collectionBook.rarityStats.mythical > 0 ? 1 : 0;
        shouldUnlock = progress >= 1;
        break;
    }

    if (shouldUnlock && !existing?.unlocked) {
      newUnlocks.push({
        ...def,
        unlocked: true,
        unlockedAt: new Date(),
        progress: def.maxProgress
      });
    } else if (existing) {
      existing.progress = progress;
    }
  });

  return newUnlocks;
};

export const initializeAchievements = (): Achievement[] => {
  return achievementDefinitions.map(def => ({
    ...def,
    unlocked: false,
    progress: 0
  }));
};
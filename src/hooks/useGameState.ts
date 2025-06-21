import { useState, useCallback, useEffect } from 'react';
import { GameState, PlayerStats, Inventory, Enemy, Weapon, Armor, ChestReward, Research, Achievement, CollectionBook, KnowledgeStreak, GameMode, Statistics } from '../types/game';
import { generateWeapon, generateArmor, generateEnemy, calculateResearchBonus } from '../utils/gameUtils';
import { checkAchievements, initializeAchievements } from '../utils/achievements';
import AsyncStorage from '../utils/storage';

const STORAGE_KEY = 'hugoland_game_state';

const initialPlayerStats: PlayerStats = {
  hp: 200,
  maxHp: 200,
  atk: 50,
  def: 0,
  baseAtk: 50,
  baseDef: 0,
  baseHp: 200,
};

const initialInventory: Inventory = {
  weapons: [],
  armor: [],
  currentWeapon: null,
  currentArmor: null,
};

const initialResearch: Research = {
  level: 0,
  tier: 0,
  totalSpent: 0,
};

const initialCollectionBook: CollectionBook = {
  weapons: {},
  armor: {},
  totalWeaponsFound: 0,
  totalArmorFound: 0,
  rarityStats: {
    common: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
    mythical: 0,
  },
};

const initialKnowledgeStreak: KnowledgeStreak = {
  current: 0,
  best: 0,
  multiplier: 1,
};

const initialGameMode: GameMode = {
  current: 'normal',
  speedModeActive: false,
  survivalLives: 3,
  maxSurvivalLives: 3,
};

const initialStatistics: Statistics = {
  totalQuestionsAnswered: 0,
  correctAnswers: 0,
  totalPlayTime: 0,
  zonesReached: 1,
  itemsCollected: 0,
  coinsEarned: 0,
  gemsEarned: 0,
  chestsOpened: 0,
  accuracyByCategory: {},
  sessionStartTime: new Date(),
};

const initialGameState: GameState = {
  coins: 100,
  gems: 0,
  zone: 1,
  playerStats: initialPlayerStats,
  inventory: initialInventory,
  currentEnemy: null,
  inCombat: false,
  combatLog: [],
  research: initialResearch,
  isPremium: false,
  achievements: initializeAchievements(),
  collectionBook: initialCollectionBook,
  knowledgeStreak: initialKnowledgeStreak,
  gameMode: initialGameMode,
  statistics: initialStatistics,
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isLoading, setIsLoading] = useState(true);
  const [visualEffects, setVisualEffects] = useState({
    showFloatingText: false,
    floatingText: '',
    floatingTextColor: '',
    showParticles: false,
    showScreenShake: false,
  });

  // Update play time
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        statistics: {
          ...prev.statistics,
          totalPlayTime: prev.statistics.totalPlayTime + 1,
        },
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Load game state from storage on mount
  useEffect(() => {
    const loadGameState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          setGameState({
            ...initialGameState,
            ...parsedState,
            currentEnemy: null,
            inCombat: false,
            combatLog: [],
            achievements: parsedState.achievements || initializeAchievements(),
            collectionBook: parsedState.collectionBook || initialCollectionBook,
            knowledgeStreak: parsedState.knowledgeStreak || initialKnowledgeStreak,
            gameMode: parsedState.gameMode || initialGameMode,
            statistics: {
              ...initialStatistics,
              ...parsedState.statistics,
              sessionStartTime: new Date(),
            },
            research: parsedState.research || initialResearch,
            isPremium: parsedState.isPremium || parsedState.zone >= 50,
          });
        }
      } catch (error) {
        console.error('Error loading game state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGameState();
  }, []);

  // Save game state to storage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      const saveGameState = async () => {
        try {
          const stateToSave = {
            ...gameState,
            currentEnemy: null,
            inCombat: false,
            combatLog: [],
          };
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        } catch (error) {
          console.error('Error saving game state:', error);
        }
      };

      saveGameState();
    }
  }, [gameState, isLoading]);

  const triggerVisualEffect = useCallback((type: 'text' | 'particles' | 'shake', data?: any) => {
    switch (type) {
      case 'text':
        setVisualEffects(prev => ({
          ...prev,
          showFloatingText: true,
          floatingText: data.text,
          floatingTextColor: data.color,
        }));
        break;
      case 'particles':
        setVisualEffects(prev => ({ ...prev, showParticles: true }));
        break;
      case 'shake':
        setVisualEffects(prev => ({ ...prev, showScreenShake: true }));
        break;
    }
  }, []);

  const clearVisualEffect = useCallback((type: 'text' | 'particles' | 'shake') => {
    setVisualEffects(prev => ({
      ...prev,
      [`show${type.charAt(0).toUpperCase() + type.slice(1)}`]: false,
    }));
  }, []);

  const updateCollectionBook = useCallback((item: Weapon | Armor) => {
    setGameState(prev => {
      const isWeapon = 'baseAtk' in item;
      const collectionKey = isWeapon ? 'weapons' : 'armor';
      const countKey = isWeapon ? 'totalWeaponsFound' : 'totalArmorFound';
      
      if (prev.collectionBook[collectionKey][item.name]) {
        return prev; // Already discovered
      }

      return {
        ...prev,
        collectionBook: {
          ...prev.collectionBook,
          [collectionKey]: {
            ...prev.collectionBook[collectionKey],
            [item.name]: true,
          },
          [countKey]: prev.collectionBook[countKey] + 1,
          rarityStats: {
            ...prev.collectionBook.rarityStats,
            [item.rarity]: prev.collectionBook.rarityStats[item.rarity] + 1,
          },
        },
        statistics: {
          ...prev.statistics,
          itemsCollected: prev.statistics.itemsCollected + 1,
        },
      };
    });
  }, []);

  const updateKnowledgeStreak = useCallback((correct: boolean) => {
    setGameState(prev => {
      const newCurrent = correct ? prev.knowledgeStreak.current + 1 : 0;
      const newBest = Math.max(prev.knowledgeStreak.best, newCurrent);
      const newMultiplier = Math.min(1 + Math.floor(newCurrent / 5) * 0.1, 2); // Max 2x multiplier

      if (correct && newCurrent > 0 && newCurrent % 5 === 0) {
        triggerVisualEffect('text', { 
          text: `${newCurrent} Streak! +${Math.round((newMultiplier - 1) * 100)}% Bonus!`, 
          color: 'text-yellow-400' 
        });
      }

      return {
        ...prev,
        knowledgeStreak: {
          current: newCurrent,
          best: newBest,
          multiplier: newMultiplier,
          lastCorrectTime: correct ? new Date() : prev.knowledgeStreak.lastCorrectTime,
        },
      };
    });
  }, [triggerVisualEffect]);

  const updateStatistics = useCallback((category: string, correct: boolean) => {
    setGameState(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        totalQuestionsAnswered: prev.statistics.totalQuestionsAnswered + 1,
        correctAnswers: prev.statistics.correctAnswers + (correct ? 1 : 0),
        accuracyByCategory: {
          ...prev.statistics.accuracyByCategory,
          [category]: {
            correct: (prev.statistics.accuracyByCategory[category]?.correct || 0) + (correct ? 1 : 0),
            total: (prev.statistics.accuracyByCategory[category]?.total || 0) + 1,
          },
        },
      },
    }));
  }, []);

  const checkAndUnlockAchievements = useCallback(() => {
    setGameState(prev => {
      const newUnlocks = checkAchievements(prev);
      
      if (newUnlocks.length > 0) {
        // Trigger visual effects for achievements
        triggerVisualEffect('particles');
        
        // Award achievement rewards
        let bonusCoins = 0;
        let bonusGems = 0;
        
        newUnlocks.forEach(achievement => {
          if (achievement.reward) {
            bonusCoins += achievement.reward.coins || 0;
            bonusGems += achievement.reward.gems || 0;
          }
        });

        if (bonusCoins > 0 || bonusGems > 0) {
          triggerVisualEffect('text', { 
            text: `Achievement Rewards: +${bonusCoins} coins, +${bonusGems} gems!`, 
            color: 'text-green-400' 
          });
        }

        // Update achievements list
        const updatedAchievements = prev.achievements.map(existing => {
          const newUnlock = newUnlocks.find(nu => nu.id === existing.id);
          return newUnlock || existing;
        });

        return {
          ...prev,
          coins: prev.coins + bonusCoins,
          gems: prev.gems + bonusGems,
          achievements: updatedAchievements,
        };
      }

      return prev;
    });
  }, [triggerVisualEffect]);

  const updatePlayerStats = useCallback(() => {
    setGameState(prev => {
      const weaponAtk = prev.inventory.currentWeapon 
        ? prev.inventory.currentWeapon.baseAtk + (prev.inventory.currentWeapon.level - 1) * 10
        : 0;
      const armorDef = prev.inventory.currentArmor 
        ? prev.inventory.currentArmor.baseDef + (prev.inventory.currentArmor.level - 1) * 5
        : 0;

      const researchBonus = calculateResearchBonus(prev.research.level, prev.research.tier);
      const bonusMultiplier = 1 + (researchBonus / 100);

      const finalAtk = Math.floor((prev.playerStats.baseAtk + weaponAtk) * bonusMultiplier);
      const finalDef = Math.floor((prev.playerStats.baseDef + armorDef) * bonusMultiplier);
      const finalMaxHp = Math.floor(prev.playerStats.baseHp * bonusMultiplier);

      return {
        ...prev,
        playerStats: {
          ...prev.playerStats,
          atk: finalAtk,
          def: finalDef,
          maxHp: finalMaxHp,
          hp: Math.min(prev.playerStats.hp, finalMaxHp),
        },
      };
    });
  }, []);

  const setGameMode = useCallback((mode: 'normal' | 'speed' | 'survival') => {
    setGameState(prev => ({
      ...prev,
      gameMode: {
        ...prev.gameMode,
        current: mode,
        speedModeActive: mode === 'speed',
        survivalLives: mode === 'survival' ? prev.gameMode.maxSurvivalLives : prev.gameMode.survivalLives,
      },
    }));
  }, []);

  const equipWeapon = useCallback((weapon: Weapon) => {
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        currentWeapon: weapon,
      },
    }));
    updatePlayerStats();
  }, [updatePlayerStats]);

  const equipArmor = useCallback((armor: Armor) => {
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        currentArmor: armor,
      },
    }));
    updatePlayerStats();
  }, [updatePlayerStats]);

  const upgradeWeapon = useCallback((weaponId: string) => {
    setGameState(prev => {
      const weapon = prev.inventory.weapons.find(w => w.id === weaponId);
      if (!weapon || prev.gems < weapon.upgradeCost) return prev;

      const updatedWeapons = prev.inventory.weapons.map(w =>
        w.id === weaponId
          ? { ...w, level: w.level + 1, upgradeCost: Math.floor(w.upgradeCost * 1.5), sellPrice: Math.floor(w.sellPrice * 1.2) }
          : w
      );

      const updatedCurrentWeapon = prev.inventory.currentWeapon?.id === weaponId
        ? updatedWeapons.find(w => w.id === weaponId) || null
        : prev.inventory.currentWeapon;

      triggerVisualEffect('text', { text: 'Weapon Upgraded!', color: 'text-green-400' });

      return {
        ...prev,
        gems: prev.gems - weapon.upgradeCost,
        inventory: {
          ...prev.inventory,
          weapons: updatedWeapons,
          currentWeapon: updatedCurrentWeapon,
        },
      };
    });
    updatePlayerStats();
  }, [updatePlayerStats, triggerVisualEffect]);

  const upgradeArmor = useCallback((armorId: string) => {
    setGameState(prev => {
      const armor = prev.inventory.armor.find(a => a.id === armorId);
      if (!armor || prev.gems < armor.upgradeCost) return prev;

      const updatedArmor = prev.inventory.armor.map(a =>
        a.id === armorId
          ? { ...a, level: a.level + 1, upgradeCost: Math.floor(a.upgradeCost * 1.5), sellPrice: Math.floor(a.sellPrice * 1.2) }
          : a
      );

      const updatedCurrentArmor = prev.inventory.currentArmor?.id === armorId
        ? updatedArmor.find(a => a.id === armorId) || null
        : prev.inventory.currentArmor;

      triggerVisualEffect('text', { text: 'Armor Upgraded!', color: 'text-blue-400' });

      return {
        ...prev,
        gems: prev.gems - armor.upgradeCost,
        inventory: {
          ...prev.inventory,
          armor: updatedArmor,
          currentArmor: updatedCurrentArmor,
        },
      };
    });
    updatePlayerStats();
  }, [updatePlayerStats, triggerVisualEffect]);

  const sellWeapon = useCallback((weaponId: string) => {
    setGameState(prev => {
      const weapon = prev.inventory.weapons.find(w => w.id === weaponId);
      if (!weapon || prev.inventory.currentWeapon?.id === weaponId) return prev;

      return {
        ...prev,
        coins: prev.coins + weapon.sellPrice,
        inventory: {
          ...prev.inventory,
          weapons: prev.inventory.weapons.filter(w => w.id !== weaponId),
        },
      };
    });
  }, []);

  const sellArmor = useCallback((armorId: string) => {
    setGameState(prev => {
      const armor = prev.inventory.armor.find(a => a.id === armorId);
      if (!armor || prev.inventory.currentArmor?.id === armorId) return prev;

      return {
        ...prev,
        coins: prev.coins + armor.sellPrice,
        inventory: {
          ...prev.inventory,
          armor: prev.inventory.armor.filter(a => a.id !== armorId),
        },
      };
    });
  }, []);

  const upgradeResearch = useCallback(() => {
    const researchCost = 150;
    setGameState(prev => {
      if (prev.coins < researchCost) return prev;

      const newLevel = prev.research.level + 1;
      const newTier = Math.floor(newLevel / 10);
      
      if (newTier > prev.research.tier) {
        triggerVisualEffect('text', { text: `Research Tier ${newTier + 1} Unlocked!`, color: 'text-purple-400' });
        triggerVisualEffect('particles');
      }

      return {
        ...prev,
        coins: prev.coins - researchCost,
        research: {
          level: newLevel,
          tier: newTier,
          totalSpent: prev.research.totalSpent + researchCost,
        },
      };
    });
    updatePlayerStats();
    checkAndUnlockAchievements();
  }, [updatePlayerStats, triggerVisualEffect, checkAndUnlockAchievements]);

  const openChest = useCallback((chestCost: number): ChestReward | null => {
    if (gameState.coins < chestCost) return null;

    const numItems = Math.floor(Math.random() * 2) + 2;
    const bonusGems = Math.floor(Math.random() * 10) + 5;
    const items: (Weapon | Armor)[] = [];

    const isMythicalChest = chestCost === 2500;

    for (let i = 0; i < numItems; i++) {
      const isWeapon = Math.random() < 0.5;
      const item = isWeapon ? generateWeapon(isMythicalChest) : generateArmor(isMythicalChest);
      items.push(item);
      updateCollectionBook(item);
    }

    const chestReward: ChestReward = {
      type: Math.random() < 0.5 ? 'weapon' : 'armor',
      items,
    };

    // Apply streak multiplier to rewards
    const streakMultiplier = gameState.knowledgeStreak.multiplier;
    const finalBonusGems = Math.floor(bonusGems * streakMultiplier);

    setGameState(prev => ({
      ...prev,
      coins: prev.coins - chestCost,
      gems: prev.gems + finalBonusGems,
      inventory: {
        ...prev.inventory,
        weapons: [...prev.inventory.weapons, ...items.filter(item => 'baseAtk' in item) as Weapon[]],
        armor: [...prev.inventory.armor, ...items.filter(item => 'baseDef' in item) as Armor[]],
      },
      statistics: {
        ...prev.statistics,
        chestsOpened: prev.statistics.chestsOpened + 1,
        gemsEarned: prev.statistics.gemsEarned + finalBonusGems,
      },
    }));

    triggerVisualEffect('particles');
    checkAndUnlockAchievements();

    return chestReward;
  }, [gameState.coins, gameState.knowledgeStreak.multiplier, updateCollectionBook, triggerVisualEffect, checkAndUnlockAchievements]);

  const startCombat = useCallback(() => {
    const enemy = generateEnemy(gameState.zone);
    setGameState(prev => ({
      ...prev,
      currentEnemy: enemy,
      inCombat: true,
      playerStats: { 
        ...prev.playerStats, 
        hp: prev.gameMode.current === 'survival' ? prev.playerStats.hp : prev.playerStats.maxHp 
      },
      combatLog: [`You encounter a ${enemy.name} in Zone ${enemy.zone}!`],
    }));
  }, [gameState.zone]);

  const attack = useCallback((hit: boolean, category?: string) => {
    setGameState(prev => {
      if (!prev.currentEnemy || !prev.inCombat) return prev;

      // Update statistics and streaks
      if (category) {
        updateStatistics(category, hit);
      }
      updateKnowledgeStreak(hit);

      let newCombatLog = [...prev.combatLog];
      let newPlayerHp = prev.playerStats.hp;
      let newEnemyHp = prev.currentEnemy.hp;
      let combatEnded = false;
      let playerWon = false;

      if (hit) {
        const damage = Math.max(1, prev.playerStats.atk - prev.currentEnemy.def);
        newEnemyHp = Math.max(0, prev.currentEnemy.hp - damage);
        newCombatLog.push(`You deal ${damage} damage to the ${prev.currentEnemy.name}!`);
        
        triggerVisualEffect('text', { text: `-${damage}`, color: 'text-red-400' });
        
        if (newEnemyHp <= 0) {
          combatEnded = true;
          playerWon = true;
          newCombatLog.push(`You defeated the ${prev.currentEnemy.name}!`);
          triggerVisualEffect('particles');
        }
      } else {
        const damage = Math.max(1, prev.currentEnemy.atk - prev.playerStats.def);
        newPlayerHp = Math.max(0, prev.playerStats.hp - damage);
        newCombatLog.push(`You missed! The ${prev.currentEnemy.name} deals ${damage} damage to you!`);
        
        triggerVisualEffect('shake');
        
        if (newPlayerHp <= 0) {
          combatEnded = true;
          playerWon = false;
          newCombatLog.push(`You were defeated by the ${prev.currentEnemy.name}...`);
          
          // Handle survival mode
          if (prev.gameMode.current === 'survival') {
            const newLives = prev.gameMode.survivalLives - 1;
            if (newLives <= 0) {
              newCombatLog.push('Game Over! No lives remaining.');
            }
          }
        }
      }

      if (combatEnded) {
        if (playerWon) {
          // Apply game mode multipliers
          let coinMultiplier = 1;
          let gemMultiplier = 1;
          
          if (prev.gameMode.current === 'speed') {
            coinMultiplier = 1.5;
            gemMultiplier = 1.25;
          } else if (prev.gameMode.current === 'survival') {
            coinMultiplier = 2;
            gemMultiplier = 2;
          }

          // Apply streak multiplier
          coinMultiplier *= prev.knowledgeStreak.multiplier;
          gemMultiplier *= prev.knowledgeStreak.multiplier;

          const baseCoins = prev.zone * 8 + Math.floor(Math.random() * 15);
          const baseGems = Math.floor(Math.random() * 3) + 1;
          
          const coinsEarned = Math.floor(baseCoins * coinMultiplier);
          const gemsEarned = Math.floor(baseGems * gemMultiplier);
          
          newCombatLog.push(`You earned ${coinsEarned} coins and ${gemsEarned} gems!`);
          
          const newZone = prev.zone + 1;
          const newIsPremium = newZone >= 50;
          
          return {
            ...prev,
            coins: prev.coins + coinsEarned,
            gems: prev.gems + gemsEarned,
            zone: newZone,
            isPremium: newIsPremium,
            currentEnemy: null,
            inCombat: false,
            combatLog: newCombatLog,
            statistics: {
              ...prev.statistics,
              zonesReached: Math.max(prev.statistics.zonesReached, newZone),
              coinsEarned: prev.statistics.coinsEarned + coinsEarned,
              gemsEarned: prev.statistics.gemsEarned + gemsEarned,
            },
          };
        } else {
          // Handle defeat
          let newGameMode = prev.gameMode;
          
          if (prev.gameMode.current === 'survival') {
            newGameMode = {
              ...prev.gameMode,
              survivalLives: prev.gameMode.survivalLives - 1,
            };
            
            if (newGameMode.survivalLives <= 0) {
              // Reset to normal mode and zone 1
              newGameMode = {
                ...initialGameMode,
                current: 'normal',
              };
              
              return {
                ...prev,
                zone: 1,
                currentEnemy: null,
                inCombat: false,
                combatLog: newCombatLog,
                playerStats: { ...prev.playerStats, hp: 0 },
                gameMode: newGameMode,
                knowledgeStreak: { ...prev.knowledgeStreak, current: 0 },
              };
            }
          }
          
          return {
            ...prev,
            currentEnemy: null,
            inCombat: false,
            combatLog: newCombatLog,
            playerStats: { ...prev.playerStats, hp: newPlayerHp },
            gameMode: newGameMode,
          };
        }
      }

      return {
        ...prev,
        currentEnemy: { ...prev.currentEnemy, hp: newEnemyHp },
        playerStats: { ...prev.playerStats, hp: newPlayerHp },
        combatLog: newCombatLog,
      };
    });

    // Check achievements after combat
    setTimeout(checkAndUnlockAchievements, 100);
  }, [updateStatistics, updateKnowledgeStreak, triggerVisualEffect, checkAndUnlockAchievements]);

  const resetGame = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setGameState({
        ...initialGameState,
        achievements: initializeAchievements(),
        statistics: {
          ...initialStatistics,
          sessionStartTime: new Date(),
        },
      });
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  }, []);

  return {
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
    checkAndUnlockAchievements,
  };
};
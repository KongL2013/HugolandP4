import { Weapon, Armor, Enemy } from '../types/game';

const weaponNames = {
  common: ['Rusty Sword', 'Wooden Club', 'Stone Axe', 'Iron Dagger'],
  rare: ['Steel Blade', 'Silver Mace', 'Enchanted Bow', 'Crystal Staff'],
  epic: ['Flamebrand', 'Frostbite', 'Thunder Strike', 'Shadow Cleaver'],
  legendary: ['Excalibur', 'Mjolnir', 'Gungnir', 'Durandal'],
  mythical: ['Void Reaper', 'Cosmic Blade', 'Reality Slicer', 'Dimension Cutter'],
};

const armorNames = {
  common: ['Leather Vest', 'Cloth Robe', 'Wooden Shield', 'Iron Helm'],
  rare: ['Chainmail', 'Steel Plate', 'Mystic Cloak', 'Silver Guard'],
  epic: ['Dragon Scale', 'Phoenix Mail', 'Void Armor', 'Crystal Guard'],
  legendary: ['Divine Aegis', 'Eternal Plate', 'Shadowweave', 'Celestial Ward'],
  mythical: ['Abyssal Aegis', 'Stellar Fortress', 'Quantum Shield', 'Infinity Guard'],
};

const chromaNames = {
  weapon: ['Prismatic Edge', 'Rainbow Striker', 'Spectrum Blade', 'Aurora Cleaver', 'Chromatic Destroyer'],
  armor: ['Prismatic Guard', 'Rainbow Shield', 'Spectrum Plate', 'Aurora Mail', 'Chromatic Fortress'],
};

const enemyNames = [
  'Goblin Warrior', 'Shadow Wolf', 'Stone Golem', 'Fire Imp',
  'Ice Troll', 'Dark Mage', 'Lightning Drake', 'Void Wraith',
  'Crystal Beast', 'Ancient Dragon', 'Chaos Lord', 'Nightmare King',
  'Abyssal Terror', 'Cosmic Horror', 'Reality Bender', 'Dimension Lord'
];

export const generateWeapon = (forceChroma = false): Weapon => {
  const isChroma = forceChroma || Math.random() < 0.05; // 5% chance for chroma
  
  if (isChroma) {
    const name = chromaNames.weapon[Math.floor(Math.random() * chromaNames.weapon.length)];
    const baseAtk = 80 + Math.floor(Math.random() * 20); // 80-100 base attack
    const sellPrice = Math.floor(baseAtk * 8);
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      name,
      rarity: 'mythical',
      baseAtk,
      level: 1,
      upgradeCost: 50,
      sellPrice,
      isChroma: true,
    };
  }

  const rarities = ['common', 'rare', 'epic', 'legendary'] as const;
  const weights = [45, 30, 20, 5]; // Adjusted for mythical items
  const random = Math.random() * 100;
  
  let rarity: typeof rarities[number] = 'common';
  let cumulative = 0;
  
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      rarity = rarities[i];
      break;
    }
  }

  const names = weaponNames[rarity];
  const name = names[Math.floor(Math.random() * names.length)];
  
  const baseAtkMap = { common: 15, rare: 25, epic: 40, legendary: 60 };
  const upgradeCostMap = { common: 5, rare: 10, epic: 20, legendary: 40 };
  const baseAtk = baseAtkMap[rarity] + Math.floor(Math.random() * 10);
  const sellPrice = Math.floor(baseAtk * 2);

  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    rarity,
    baseAtk,
    level: 1,
    upgradeCost: upgradeCostMap[rarity],
    sellPrice,
    isChroma: false,
  };
};

export const generateArmor = (forceChroma = false): Armor => {
  const isChroma = forceChroma || Math.random() < 0.05; // 5% chance for chroma
  
  if (isChroma) {
    const name = chromaNames.armor[Math.floor(Math.random() * chromaNames.armor.length)];
    const baseDef = 50 + Math.floor(Math.random() * 15); // 50-65 base defense
    const sellPrice = Math.floor(baseDef * 10);
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      name,
      rarity: 'mythical',
      baseDef,
      level: 1,
      upgradeCost: 50,
      sellPrice,
      isChroma: true,
    };
  }

  const rarities = ['common', 'rare', 'epic', 'legendary'] as const;
  const weights = [45, 30, 20, 5];
  const random = Math.random() * 100;
  
  let rarity: typeof rarities[number] = 'common';
  let cumulative = 0;
  
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      rarity = rarities[i];
      break;
    }
  }

  const names = armorNames[rarity];
  const name = names[Math.floor(Math.random() * names.length)];
  
  const baseDefMap = { common: 8, rare: 15, epic: 25, legendary: 40 };
  const upgradeCostMap = { common: 5, rare: 10, epic: 20, legendary: 40 };
  const baseDef = baseDefMap[rarity] + Math.floor(Math.random() * 5);
  const sellPrice = Math.floor(baseDef * 3);

  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    rarity,
    baseDef,
    level: 1,
    upgradeCost: upgradeCostMap[rarity],
    sellPrice,
    isChroma: false,
  };
};

export const generateEnemy = (zone: number): Enemy => {
  const name = enemyNames[Math.min(zone - 1, enemyNames.length - 1)];
  // Made enemies much harder
  const hp = 200 + (zone * 15); // Increased from zone * 2
  const atk = 20 + (zone * 8); // Increased from zone * 5
  const def = Math.floor(zone * 2); // Added defense scaling
  
  return {
    name,
    hp,
    maxHp: hp,
    atk,
    def,
    zone,
  };
};

export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'common': return 'text-gray-400';
    case 'rare': return 'text-blue-400';
    case 'epic': return 'text-purple-400';
    case 'legendary': return 'text-yellow-400';
    case 'mythical': return 'text-red-600';
    default: return 'text-gray-400';
  }
};

export const getRarityBorder = (rarity: string): string => {
  switch (rarity) {
    case 'common': return 'border-gray-400';
    case 'rare': return 'border-blue-400';
    case 'epic': return 'border-purple-400';
    case 'legendary': return 'border-yellow-400';
    case 'mythical': return 'border-red-600';
    default: return 'border-gray-400';
  }
};

export const getRarityGlow = (rarity: string): string => {
  switch (rarity) {
    case 'common': return 'shadow-gray-500/20';
    case 'rare': return 'shadow-blue-500/30';
    case 'epic': return 'shadow-purple-500/40';
    case 'legendary': return 'shadow-yellow-500/50';
    case 'mythical': return 'shadow-red-600/60';
    default: return 'shadow-gray-500/20';
  }
};

export const calculateResearchBonus = (level: number, tier: number): number => {
  const baseBonus = level * 5; // 5% per level
  const tierBonus = tier * 15; // 15% per tier (every 10 levels)
  return baseBonus + tierBonus;
};
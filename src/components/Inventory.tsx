import React, { useState } from 'react';
import { Inventory as InventoryType, Weapon, Armor } from '../types/game';
import { Sword, Shield, Gem, Star, Coins, Trash2, Sparkles } from 'lucide-react';
import { getRarityColor, getRarityBorder, getRarityGlow } from '../utils/gameUtils';

interface InventoryProps {
  inventory: InventoryType;
  gems: number;
  onEquipWeapon: (weapon: Weapon) => void;
  onEquipArmor: (armor: Armor) => void;
  onUpgradeWeapon: (weaponId: string) => void;
  onUpgradeArmor: (armorId: string) => void;
  onSellWeapon: (weaponId: string) => void;
  onSellArmor: (armorId: string) => void;
}

export const Inventory: React.FC<InventoryProps> = ({
  inventory,
  gems,
  onEquipWeapon,
  onEquipArmor,
  onUpgradeWeapon,
  onUpgradeArmor,
  onSellWeapon,
  onSellArmor,
}) => {
  const [showSellConfirm, setShowSellConfirm] = useState<string | null>(null);

  const handleSell = (id: string, type: 'weapon' | 'armor') => {
    if (type === 'weapon') {
      onSellWeapon(id);
    } else {
      onSellArmor(id);
    }
    setShowSellConfirm(null);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 sm:p-6 rounded-lg shadow-2xl">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Inventory</h2>
        <div className="flex items-center justify-center gap-2 text-purple-300">
          <Gem className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-semibold text-sm sm:text-base">{gems} Gems</span>
        </div>
      </div>

      {/* Currently Equipped */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-black/30 p-3 sm:p-4 rounded-lg border border-orange-500/50">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Sword className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
            Equipped Weapon
          </h3>
          {inventory.currentWeapon ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className={`font-semibold text-sm sm:text-base ${getRarityColor(inventory.currentWeapon.rarity)}`}>
                  {inventory.currentWeapon.name}
                </p>
                {inventory.currentWeapon.isChroma && (
                  <Sparkles className="w-4 h-4 text-red-400 animate-pulse" />
                )}
              </div>
              <p className="text-white text-sm sm:text-base">ATK: {inventory.currentWeapon.baseAtk + (inventory.currentWeapon.level - 1) * 10}</p>
              <p className="text-gray-300 text-xs sm:text-sm">Level {inventory.currentWeapon.level}</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No weapon equipped</p>
          )}
        </div>

        <div className="bg-black/30 p-3 sm:p-4 rounded-lg border border-blue-500/50">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            Equipped Armor
          </h3>
          {inventory.currentArmor ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className={`font-semibold text-sm sm:text-base ${getRarityColor(inventory.currentArmor.rarity)}`}>
                  {inventory.currentArmor.name}
                </p>
                {inventory.currentArmor.isChroma && (
                  <Sparkles className="w-4 h-4 text-red-400 animate-pulse" />
                )}
              </div>
              <p className="text-white text-sm sm:text-base">DEF: {inventory.currentArmor.baseDef + (inventory.currentArmor.level - 1) * 5}</p>
              <p className="text-gray-300 text-xs sm:text-sm">Level {inventory.currentArmor.level}</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No armor equipped</p>
          )}
        </div>
      </div>

      {/* Weapons */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
          <Sword className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
          Weapons ({inventory.weapons.length})
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 max-h-48 sm:max-h-64 overflow-y-auto">
          {inventory.weapons.map((weapon) => (
            <div 
              key={weapon.id} 
              className={`bg-black/40 p-2 sm:p-3 rounded-lg border-2 ${getRarityBorder(weapon.rarity)} ${getRarityGlow(weapon.rarity)} ${weapon.isChroma ? 'animate-pulse' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-xs sm:text-sm truncate ${getRarityColor(weapon.rarity)}`}>
                      {weapon.name}
                    </p>
                    {weapon.isChroma && (
                      <Sparkles className="w-3 h-3 text-red-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-white text-xs sm:text-sm">
                    ATK: {weapon.baseAtk + (weapon.level - 1) * 10}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-300">
                    <Star className="w-2 h-2 sm:w-3 sm:h-3" />
                    Level {weapon.level}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-yellow-400">
                    <Coins className="w-2 h-2 sm:w-3 sm:h-3" />
                    Sell: {weapon.sellPrice}
                  </div>
                </div>
                <div className="flex flex-col gap-1 ml-2">
                  <button
                    onClick={() => onEquipWeapon(weapon)}
                    disabled={inventory.currentWeapon?.id === weapon.id}
                    className={`px-2 py-1 text-xs rounded font-semibold transition-all whitespace-nowrap ${
                      inventory.currentWeapon?.id === weapon.id
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-orange-600 text-white hover:bg-orange-500'
                    }`}
                  >
                    {inventory.currentWeapon?.id === weapon.id ? 'Equipped' : 'Equip'}
                  </button>
                  <button
                    onClick={() => onUpgradeWeapon(weapon.id)}
                    disabled={gems < weapon.upgradeCost}
                    className={`px-2 py-1 text-xs rounded font-semibold transition-all flex items-center gap-1 justify-center ${
                      gems >= weapon.upgradeCost
                        ? 'bg-purple-600 text-white hover:bg-purple-500'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Gem className="w-2 h-2 sm:w-3 sm:h-3" />
                    {weapon.upgradeCost}
                  </button>
                  <button
                    onClick={() => setShowSellConfirm(weapon.id)}
                    disabled={inventory.currentWeapon?.id === weapon.id}
                    className={`px-2 py-1 text-xs rounded font-semibold transition-all flex items-center gap-1 justify-center ${
                      inventory.currentWeapon?.id === weapon.id
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-500'
                    }`}
                  >
                    <Trash2 className="w-2 h-2 sm:w-3 sm:h-3" />
                  </button>
                </div>
              </div>
              
              {/* Sell Confirmation */}
              {showSellConfirm === weapon.id && (
                <div className="mt-2 p-2 bg-red-900/50 rounded border border-red-500">
                  <p className="text-red-300 text-xs mb-2">Sell for {weapon.sellPrice} coins?</p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleSell(weapon.id, 'weapon')}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-500"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowSellConfirm(null)}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500"
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Armor */}
      <div>
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          Armor ({inventory.armor.length})
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 max-h-48 sm:max-h-64 overflow-y-auto">
          {inventory.armor.map((armor) => (
            <div 
              key={armor.id} 
              className={`bg-black/40 p-2 sm:p-3 rounded-lg border-2 ${getRarityBorder(armor.rarity)} ${getRarityGlow(armor.rarity)} ${armor.isChroma ? 'animate-pulse' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-xs sm:text-sm truncate ${getRarityColor(armor.rarity)}`}>
                      {armor.name}
                    </p>
                    {armor.isChroma && (
                      <Sparkles className="w-3 h-3 text-red-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-white text-xs sm:text-sm">
                    DEF: {armor.baseDef + (armor.level - 1) * 5}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-300">
                    <Star className="w-2 h-2 sm:w-3 sm:h-3" />
                    Level {armor.level}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-yellow-400">
                    <Coins className="w-2 h-2 sm:w-3 sm:h-3" />
                    Sell: {armor.sellPrice}
                  </div>
                </div>
                <div className="flex flex-col gap-1 ml-2">
                  <button
                    onClick={() => onEquipArmor(armor)}
                    disabled={inventory.currentArmor?.id === armor.id}
                    className={`px-2 py-1 text-xs rounded font-semibold transition-all whitespace-nowrap ${
                      inventory.currentArmor?.id === armor.id
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-500'
                    }`}
                  >
                    {inventory.currentArmor?.id === armor.id ? 'Equipped' : 'Equip'}
                  </button>
                  <button
                    onClick={() => onUpgradeArmor(armor.id)}
                    disabled={gems < armor.upgradeCost}
                    className={`px-2 py-1 text-xs rounded font-semibold transition-all flex items-center gap-1 justify-center ${
                      gems >= armor.upgradeCost
                        ? 'bg-purple-600 text-white hover:bg-purple-500'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Gem className="w-2 h-2 sm:w-3 sm:h-3" />
                    {armor.upgradeCost}
                  </button>
                  <button
                    onClick={() => setShowSellConfirm(armor.id)}
                    disabled={inventory.currentArmor?.id === armor.id}
                    className={`px-2 py-1 text-xs rounded font-semibold transition-all flex items-center gap-1 justify-center ${
                      inventory.currentArmor?.id === armor.id
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-500'
                    }`}
                  >
                    <Trash2 className="w-2 h-2 sm:w-3 sm:h-3" />
                  </button>
                </div>
              </div>
              
              {/* Sell Confirmation */}
              {showSellConfirm === armor.id && (
                <div className="mt-2 p-2 bg-red-900/50 rounded border border-red-500">
                  <p className="text-red-300 text-xs mb-2">Sell for {armor.sellPrice} coins?</p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleSell(armor.id, 'armor')}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-500"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowSellConfirm(null)}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500"
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
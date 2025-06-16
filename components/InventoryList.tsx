'use client'

import { Tool } from '@/types/interfaces';

interface InventoryListProps {
  filteredTools: Tool[];
  inventorySlots: (Tool | null)[];
  setSelectedSlot: (slot: number) => void;
}

export default function InventoryList({ filteredTools, inventorySlots, setSelectedSlot }: InventoryListProps) {
  const getRarityColor = (rarity: string): string => {
    const colors: Record<string, string> = {
      common: 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50',
      rare: 'border-cyan-400 bg-cyan-50 dark:border-cyan-500 dark:bg-cyan-900/20',
      epic: 'border-purple-400 bg-purple-50 dark:border-purple-500 dark:bg-purple-900/20',
      legendary: 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:border-yellow-500 dark:bg-gradient-to-br dark:from-yellow-900/20 dark:to-orange-900/20'
    };
    return colors[rarity] || colors.common;
  };

  const getRarityBadge = (rarity: string): string => {
    const badges: Record<string, string> = {
      legendary: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      epic: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      rare: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400',
      common: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400'
    };
    return badges[rarity] || badges.common;
  };

  return (
    <div className="bg-theme-panel rounded-xl shadow-theme-light border border-theme-soft">
      <div className="divide-y divide-theme-soft">
        {filteredTools.map((tool) => {
          const slotIndex = inventorySlots.findIndex(slot => slot?.id === tool.id);
          return (
            <div
              key={tool.id}
              className="p-4 hover:bg-theme-hover cursor-pointer transition-colors"
              onClick={() => setSelectedSlot(slotIndex)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl ${getRarityColor(tool.rarity)}`}>
                  {tool.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-theme-primary">{tool.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRarityBadge(tool.rarity)}`}>
                      {tool.rarity}
                    </span>
                  </div>
                  <p className="text-sm text-theme-secondary">{tool.category}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-theme-secondary">Slot {slotIndex + 1}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
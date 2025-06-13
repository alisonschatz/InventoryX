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
      common: 'border-gray-300 bg-gray-50',
      rare: 'border-cyan-400 bg-cyan-50',
      epic: 'border-purple-400 bg-purple-50', 
      legendary: 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50'
    };
    return colors[rarity] || colors.common;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="divide-y divide-gray-100">
        {filteredTools.map((tool) => {
          const slotIndex = inventorySlots.findIndex(slot => slot?.id === tool.id);
          return (
            <div
              key={tool.id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setSelectedSlot(slotIndex)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl ${getRarityColor(tool.rarity)}`}>
                  {tool.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{tool.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      tool.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800' :
                      tool.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                      tool.rarity === 'rare' ? 'bg-cyan-100 text-cyan-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tool.rarity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{tool.category}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Slot {slotIndex + 1}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
'use client'

import { Tool } from '@/types/interfaces';

interface ItemDetailModalProps {
  selectedSlot: number | null;
  inventorySlots: (Tool | null)[];
  setSelectedSlot: (slot: number | null) => void;
}

export default function ItemDetailModal({ selectedSlot, inventorySlots, setSelectedSlot }: ItemDetailModalProps) {
  const getRarityColor = (rarity: string): string => {
    const colors: Record<string, string> = {
      common: 'border-gray-300 bg-gray-50',
      rare: 'border-cyan-400 bg-cyan-50',
      epic: 'border-purple-400 bg-purple-50', 
      legendary: 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50'
    };
    return colors[rarity] || colors.common;
  };

  if (selectedSlot === null || !inventorySlots[selectedSlot]) {
    return null;
  }

  const item = inventorySlots[selectedSlot];
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 border-2 rounded-xl flex items-center justify-center text-3xl ${getRarityColor(item.rarity)}`}>
              {item.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{item.category}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  item.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800' :
                  item.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                  item.rarity === 'rare' ? 'bg-cyan-100 text-cyan-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.rarity}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-2">Slot: {selectedSlot + 1}/48</p>
            <p className="text-sm text-gray-500">
              Esta ferramenta está equipada no seu inventário e pronta para uso.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg">
              Usar Ferramenta
            </button>
            <button 
              onClick={() => setSelectedSlot(null)}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
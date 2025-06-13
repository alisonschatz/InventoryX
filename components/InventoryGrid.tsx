'use client'

import React from 'react';
import { Tool, DraggedItem } from '@/types/interfaces';

interface InventoryGridProps {
  inventorySlots: (Tool | null)[];
  selectedSlot: number | null;
  setSelectedSlot: (slot: number | null) => void;
  draggedItem: DraggedItem | null;
  dragOverSlot: number | null;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, fromSlot: number) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, toSlot: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, toSlot: number) => void;
}

export default function InventoryGrid({
  inventorySlots,
  selectedSlot,
  setSelectedSlot,
  draggedItem,
  dragOverSlot,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop
}: InventoryGridProps) {
  const getRarityColor = (rarity: string): string => {
    const colors: Record<string, string> = {
      common: 'border-gray-300 bg-gray-50',
      rare: 'border-cyan-400 bg-cyan-50',
      epic: 'border-purple-400 bg-purple-50', 
      legendary: 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50'
    };
    return colors[rarity] || colors.common;
  };

  const getRarityGlow = (rarity: string): string => {
    const glows: Record<string, string> = {
      common: '',
      rare: 'shadow-cyan-200',
      epic: 'shadow-purple-200',
      legendary: 'shadow-yellow-200'
    };
    return glows[rarity] || '';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Inventário</h2>
        <div className="text-sm text-gray-500">
          Arraste e solte para reorganizar
        </div>
      </div>
      <div className="grid grid-cols-6 gap-3">
        {inventorySlots.map((item, index) => (
          <div
            key={index}
            className={`
              relative aspect-square border-2 rounded-lg p-2 cursor-pointer transition-all inventory-slot
              ${item 
                ? `${getRarityColor(item.rarity)} ${getRarityGlow(item.rarity)} shadow-md hover:shadow-lg hover:scale-105` 
                : 'border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'
              }
              ${selectedSlot === index ? 'ring-2 ring-purple-500' : ''}
              ${dragOverSlot === index ? 'ring-2 ring-cyan-400 bg-cyan-50' : ''}
              ${draggedItem?.fromSlot === index ? 'opacity-50' : ''}
            `}
            onClick={() => setSelectedSlot(selectedSlot === index ? null : index)}
            draggable={item !== null}
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => onDragOver(e, index)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, index)}
            title={item ? `${item.name} - Arraste para mover` : 'Slot vazio - Solte aqui'}
          >
            {item ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-2xl mb-1 pointer-events-none">{item.icon}</div>
                <div className="text-xs font-medium text-center text-gray-700 leading-tight pointer-events-none">
                  {item.name.split(' ')[0]}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-400 text-xs pointer-events-none">
                  {dragOverSlot === index ? 'Solte aqui' : 'Vazio'}
                </div>
              </div>
            )}
            
            {/* Slot number indicator */}
            <div className="absolute -top-1 -left-1 w-4 h-4 bg-gray-600 text-white text-xs rounded-full flex items-center justify-center">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
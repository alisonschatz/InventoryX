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
      common: 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50',
      rare: 'border-cyan-400 bg-cyan-50 dark:border-cyan-500 dark:bg-cyan-900/20',
      epic: 'border-purple-400 bg-purple-50 dark:border-purple-500 dark:bg-purple-900/20', 
      legendary: 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:border-yellow-500 dark:bg-gradient-to-br dark:from-yellow-900/20 dark:to-orange-900/20'
    };
    return colors[rarity] || colors.common;
  };

  const getRarityGlow = (rarity: string): string => {
    const glows: Record<string, string> = {
      common: '',
      rare: 'shadow-cyan-200 dark:shadow-cyan-900/50',
      epic: 'shadow-purple-200 dark:shadow-purple-900/50',
      legendary: 'shadow-yellow-200 dark:shadow-yellow-900/50'
    };
    return glows[rarity] || '';
  };

  return (
    <div className="bg-theme-panel rounded-xl shadow-theme-light p-6 border border-theme-soft">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-theme-primary">Inventário de Ferramentas</h2>
          <p className="text-theme-secondary text-sm mt-1">
            Organize suas ferramentas arrastando e soltando
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-theme-secondary">
            {inventorySlots.filter(slot => slot !== null).length} / {inventorySlots.length}
          </div>
          <div className="text-xs text-theme-secondary">
            slots ocupados
          </div>
        </div>
      </div>

      {/* Grid de 8 colunas para melhor uso do espaço */}
      <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
        {inventorySlots.map((item, index) => (
          <div
            key={index}
            className={`
              relative aspect-square border-2 rounded-xl p-3 cursor-pointer transition-all duration-200 inventory-slot group
              ${item 
                ? `${getRarityColor(item.rarity)} ${getRarityGlow(item.rarity)} shadow-md hover:shadow-lg hover:scale-105 hover:-translate-y-1` 
                : 'border-dashed border-theme-soft bg-theme-hover hover:bg-theme-soft hover:border-purple-300 dark:hover:border-purple-600'
              }
              ${selectedSlot === index ? 'ring-2 ring-purple-500 dark:ring-purple-400' : ''}
              ${dragOverSlot === index ? 'ring-2 ring-cyan-400 bg-cyan-50 dark:bg-cyan-900/20' : ''}
              ${draggedItem?.fromSlot === index ? 'opacity-50' : ''}
            `}
            onClick={() => setSelectedSlot(selectedSlot === index ? null : index)}
            draggable={item !== null}
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => onDragOver(e, index)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, index)}
            title={item ? `${item.name} - Clique para ver detalhes ou arraste para mover` : 'Slot vazio - Solte um item aqui'}
          >
            {item ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-2xl lg:text-3xl mb-1 pointer-events-none group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="text-xs lg:text-sm font-medium text-center text-theme-primary leading-tight pointer-events-none">
                  {item.name.split(' ')[0]}
                </div>
                
                {/* Indicador de raridade */}
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                  item.rarity === 'legendary' ? 'bg-yellow-400' :
                  item.rarity === 'epic' ? 'bg-purple-400' :
                  item.rarity === 'rare' ? 'bg-cyan-400' :
                  'bg-gray-400'
                }`} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-theme-secondary text-xs pointer-events-none text-center leading-tight">
                  {dragOverSlot === index ? (
                    <span className="font-medium text-cyan-600 dark:text-cyan-400">Solte aqui</span>
                  ) : (
                    <span>Vazio</span>
                  )}
                </div>
              </div>
            )}
            
            {/* Número do slot */}
            <div className="absolute -top-2 -left-2 w-5 h-5 bg-theme-secondary text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm">
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Legenda de Raridades */}
      <div className="mt-6 pt-4 border-t border-theme-soft">
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span className="text-theme-secondary">Comum</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
            <span className="text-theme-secondary">Raro</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
            <span className="text-theme-secondary">Épico</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="text-theme-secondary">Lendário</span>
          </div>
        </div>
      </div>
    </div>
  );
}
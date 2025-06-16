'use client'

import { Tool } from '@/types/interfaces';

interface ItemDetailModalProps {
  selectedSlot: number | null;
  inventorySlots: (Tool | null)[];
  setSelectedSlot: (slot: number | null) => void;
  onOpenTool?: (toolId: string) => void;
}

export default function ItemDetailModal({ 
  selectedSlot, 
  inventorySlots, 
  setSelectedSlot,
  onOpenTool 
}: ItemDetailModalProps) {
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

  if (selectedSlot === null || !inventorySlots[selectedSlot]) {
    return null;
  }

  const item = inventorySlots[selectedSlot];
  if (!item) return null;

  const handleUseTool = () => {
    if (onOpenTool) {
      onOpenTool(item.id)
    }
  }

  // Verificar se a ferramenta é interativa
  const isInteractiveTool = ['todo-list', 'todo-advanced', 'task-manager', 'pomodoro-timer'].includes(item.id) || 
                           item.name.includes('Lista de Tarefas') || 
                           item.name.includes('To-Do') ||
                           item.name.includes('Pomodoro') ||
                           item.name.includes('Timer')
  
  // Debug rápido para verificar o ID
  if (item.name.includes('Tarefas') || item.name.includes('To-Do') || item.name.includes('Pomodoro')) {
    console.log('🔍 Ferramenta interativa detectada:', { 
      id: item.id, 
      name: item.name,
      isInteractive: isInteractiveTool,
      matchById: ['todo-list', 'todo-advanced', 'task-manager', 'pomodoro-timer'].includes(item.id),
      matchByName: item.name.includes('Lista de Tarefas') || item.name.includes('To-Do') || item.name.includes('Pomodoro')
    })
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      style={{ pointerEvents: 'auto' }}
    >
      <div 
        className="bg-theme-panel rounded-2xl max-w-md w-full p-6 shadow-2xl border border-theme-soft relative z-10"
        onClick={(e) => e.stopPropagation()}
        style={{ pointerEvents: 'auto' }}
      >
        <div>
          {/* Header com ícone e informações */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 border-2 rounded-xl flex items-center justify-center text-3xl ${getRarityColor(item.rarity)} shadow-md`}>
              {item.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-theme-primary mb-1">{item.name}</h2>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-theme-secondary text-sm">{item.category}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getRarityBadge(item.rarity)}`}>
                  {item.rarity === 'legendary' ? 'Lendário' :
                   item.rarity === 'epic' ? 'Épico' :
                   item.rarity === 'rare' ? 'Raro' : 'Comum'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Descrição da ferramenta */}
          {item.description && (
            <div className="mb-6 p-4 bg-theme-hover rounded-lg border border-theme-soft">
              <h3 className="text-sm font-semibold text-theme-primary mb-2">Descrição</h3>
              <p className="text-sm text-theme-secondary leading-relaxed">
                {item.description}
              </p>
            </div>
          )}
          
          {/* Informações do slot */}
          <div className="mb-6 p-4 bg-theme-hover rounded-lg border border-theme-soft">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-theme-primary">Localização</h3>
                <p className="text-sm text-theme-secondary">Slot {selectedSlot + 1} de 48</p>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-semibold text-theme-primary">Status</h3>
                <p className="text-sm text-green-600">Equipada</p>
              </div>
            </div>
          </div>
          
          {/* Botões de ação */}
          <div className="flex gap-3">
            {isInteractiveTool ? (
              <button 
                onClick={handleUseTool}
                className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                🚀 Usar Ferramenta
              </button>
            ) : (
              <button 
                className="flex-1 bg-theme-hover hover:bg-theme-soft text-theme-primary font-medium py-3 px-4 rounded-xl transition-all border border-theme-soft cursor-not-allowed"
                disabled
              >
                📋 Ferramenta Passiva
              </button>
            )}
            
            <button 
              onClick={() => setSelectedSlot(null)}
              className="px-4 py-3 border border-theme-soft text-theme-secondary hover:text-theme-primary hover:bg-theme-hover rounded-xl transition-colors"
            >
              Fechar
            </button>
          </div>

          {/* Dicas de uso */}
          {isInteractiveTool && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs text-blue-700 dark:text-blue-400 text-center">
                💡 <strong>Dica:</strong> Clique em "Usar Ferramenta" para abrir a interface completa desta ferramenta.
              </p>
            </div>
          )}
          
          {/* Debug temporário para identificar problema */}
          {!isInteractiveTool && (item.name.includes('Tarefas') || item.name.includes('To-Do') || item.name.includes('Pomodoro')) && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-xs text-red-700 dark:text-red-400 text-center">
                🔧 <strong>Debug:</strong> ID atual: {item.id} (deveria ser: todo-list ou pomodoro-timer)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
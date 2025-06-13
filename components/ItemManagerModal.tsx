'use client'

import { useState } from 'react'
import { X, Plus, Trash2, Search } from 'lucide-react'
import { Tool } from '@/types/interfaces'

interface ItemManagerModalProps {
  isOpen: boolean
  onClose: () => void
  availableItems: Tool[]
  onAddItem: (item: Tool, slotIndex: number) => void
  onRemoveItem: (slotIndex: number) => void
  inventorySlots: (Tool | null)[]
}

export default function ItemManagerModal({
  isOpen,
  onClose,
  availableItems,
  onAddItem,
  onRemoveItem,
  inventorySlots
}: ItemManagerModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)

  if (!isOpen) return null

  const categories = ['all', ...new Set(availableItems.map(item => item.category))]
  
  const filteredItems = availableItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const notInInventory = !inventorySlots.some(slot => slot?.id === item.id)
    return matchesSearch && matchesCategory && notInInventory
  })

  const getRarityColor = (rarity: string): string => {
    const colors: Record<string, string> = {
      common: 'border-gray-300 bg-gray-50',
      rare: 'border-cyan-400 bg-cyan-50',
      epic: 'border-purple-400 bg-purple-50',
      legendary: 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50'
    }
    return colors[rarity] || colors['common']
  }

  const getRarityBadge = (rarity: string): string => {
    const badges: Record<string, string> = {
      legendary: 'bg-yellow-100 text-yellow-800',
      epic: 'bg-purple-100 text-purple-800',
      rare: 'bg-cyan-100 text-cyan-800',
      common: 'bg-gray-100 text-gray-800'
    }
    return badges[rarity] || badges['common']
  }

  const handleAddItem = (item: Tool) => {
    if (selectedSlot !== null) {
      onAddItem(item, selectedSlot)
      setSelectedSlot(null)
    }
  }

  const usedSlots = inventorySlots.map((slot, index) => ({ slot, index })).filter(s => s.slot !== null)
  const emptySlots = inventorySlots.map((slot, index) => ({ slot, index })).filter(s => s.slot === null)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-theme-panel rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-theme-soft">
          <h2 className="text-2xl font-bold text-theme-primary">Gerenciar Inventário</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-theme-hover rounded-xl transition-theme"
          >
            <X className="w-5 h-5 text-theme-secondary" />
          </button>
        </div>

        <div className="flex h-[600px]">
          {/* Lista de Itens Disponíveis */}
          <div className="w-1/2 p-6 border-r border-theme-soft">
            <h3 className="text-lg font-semibold text-theme-primary mb-4">Adicionar Itens</h3>
            
            {/* Busca e Filtros */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary" />
                <input
                  type="text"
                  placeholder="Buscar ferramentas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-theme-panel border border-theme-soft rounded-lg focus:ring-2 focus:ring-purple-500 text-theme-primary"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 bg-theme-panel border border-theme-soft rounded-lg text-theme-primary"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Todas as categorias' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Lista de Itens */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${getRarityColor(item.rarity)}`}
                  onClick={() => selectedSlot !== null && handleAddItem(item)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{item.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-theme-primary">{item.name}</div>
                      <div className="text-xs text-theme-secondary">{item.category}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getRarityBadge(item.rarity)}`}>
                      {item.rarity}
                    </div>
                    <Plus className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              ))}
              
              {filteredItems.length === 0 && (
                <div className="text-center py-8 text-theme-secondary">
                  Nenhum item disponível para adicionar
                </div>
              )}
            </div>
          </div>

          {/* Gerenciar Slots */}
          <div className="w-1/2 p-6">
            <h3 className="text-lg font-semibold text-theme-primary mb-4">Slots do Inventário</h3>
            
            {/* Seletor de Slot para Adicionar */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-theme-primary mb-2">
                Selecione um slot vazio para adicionar:
              </h4>
              <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                {emptySlots.map(({ index }) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot(index)}
                    className={`
                      aspect-square border-2 border-dashed rounded-lg flex items-center justify-center text-xs font-medium transition-all
                      ${selectedSlot === index 
                        ? 'border-green-400 bg-green-50 text-green-700' 
                        : 'border-theme-soft hover:border-green-300 text-theme-secondary'
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              {selectedSlot !== null && (
                <p className="text-sm text-green-600 mt-2">
                  Slot {selectedSlot + 1} selecionado - clique em um item para adicionar
                </p>
              )}
            </div>

            {/* Itens para Remover */}
            <div>
              <h4 className="text-sm font-medium text-theme-primary mb-2">
                Itens no inventário (clique para remover):
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {usedSlots.map(({ slot, index }) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${getRarityColor(slot!.rarity)} hover:border-red-400`}
                    onClick={() => onRemoveItem(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-lg">{slot!.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-theme-primary">{slot!.name}</div>
                        <div className="text-xs text-theme-secondary">Slot {index + 1}</div>
                      </div>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </div>
                  </div>
                ))}
                
                {usedSlots.length === 0 && (
                  <div className="text-center py-8 text-theme-secondary">
                    Nenhum item no inventário
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-theme-soft">
          <div className="text-sm text-theme-secondary">
            {usedSlots.length}/{inventorySlots.length} slots ocupados
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-theme-panel hover:bg-theme-hover border border-theme-soft rounded-xl transition-theme text-theme-primary"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { UserStats } from '@/types/interfaces'
import { useInventory } from '@/hooks/useInventory'
import { useAtmosphere } from '@/hooks/useAtmosphere'

// Componentes
import Header from './Header'
import AtmospherePanel from './AtmospherePanel'
import InventoryGrid from './InventoryGrid'
import InventoryList from './InventoryList'
import ItemDetailModal from './ItemDetailModal'
import ItemManagerModal from './ItemManagerModal'

export default function HeroInventory() {
  // Estados principais
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Dados do usuário
  const userStats: UserStats = {
    level: 12,
    xp: 2840,
    nextLevelXp: 3000,
    streak: 7
  }

  // Hooks
  const inventory = useInventory()
  const atmosphere = useAtmosphere()

  // Estatísticas calculadas
  const usedSlots = inventory.tools.length
  const totalSlots = inventory.inventorySlots.length
  const emptySlots = totalSlots - usedSlots
  const legendaryItems = inventory.tools.filter(tool => tool.rarity === 'legendary').length
  const categoriesCount = new Set(inventory.tools.map(tool => tool.category)).size

  return (
    <div className="min-h-screen bg-theme-primary flex flex-col">
      
      {/* =========================== HEADER =========================== */}
      <Header
        userStats={userStats}
        toolsCount={usedSlots}
        totalSlots={totalSlots}
        viewMode={viewMode}
        setViewMode={setViewMode}
        atmosphereOpen={atmosphere.atmosphereOpen}
        setAtmosphereOpen={atmosphere.setAtmosphereOpen}
        currentTrack={atmosphere.currentTrack}
        isPlaying={atmosphere.isPlaying}
        setIsPlaying={atmosphere.setIsPlaying}
        onOpenItemManager={() => inventory.setItemManagerOpen(true)}
      />

      {/* ====================== PAINEL DE MÚSICA ====================== */}
      <AtmospherePanel
        atmosphereOpen={atmosphere.atmosphereOpen}
        setAtmosphereOpen={atmosphere.setAtmosphereOpen}
        currentTrack={atmosphere.currentTrack}
        setCurrentTrack={atmosphere.setCurrentTrack}
        isPlaying={atmosphere.isPlaying}
        setIsPlaying={atmosphere.setIsPlaying}
        volume={atmosphere.volume}
        setVolume={atmosphere.setVolume}
        playerRef={atmosphere.playerRef}
        availableTracks={atmosphere.availableTracks}
        loadCustomTrack={atmosphere.loadCustomTrack}
        clearCurrentTrack={atmosphere.clearCurrentTrack}
      />

      {/* ========================= CONTEÚDO PRINCIPAL ========================= */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          
          {/* ================= DASHBOARD DE ESTATÍSTICAS ================= */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Slots Usados */}
            <div className="bg-theme-panel rounded-xl p-4 border border-theme-soft shadow-theme-light hover:shadow-theme-medium transition-all">
              <div className="text-xs font-medium text-theme-secondary uppercase tracking-wide mb-1">
                Slots Usados
              </div>
              <div className="text-2xl font-bold text-theme-primary">
                {usedSlots}<span className="text-lg text-theme-secondary">/{totalSlots}</span>
              </div>
              <div className="w-full bg-theme-hover rounded-full h-1.5 mt-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${(usedSlots / totalSlots) * 100}%` }}
                />
              </div>
            </div>

            {/* Slots Vazios */}
            <div className="bg-theme-panel rounded-xl p-4 border border-theme-soft shadow-theme-light hover:shadow-theme-medium transition-all">
              <div className="text-xs font-medium text-theme-secondary uppercase tracking-wide mb-1">
                Slots Livres
              </div>
              <div className="text-2xl font-bold text-theme-primary">
                {emptySlots}
              </div>
              <div className="text-xs text-theme-secondary mt-2">
                {((emptySlots / totalSlots) * 100).toFixed(1)}% disponível
              </div>
            </div>

            {/* Itens Lendários */}
            <div className="bg-theme-panel rounded-xl p-4 border border-theme-soft shadow-theme-light hover:shadow-theme-medium transition-all">
              <div className="text-xs font-medium text-theme-secondary uppercase tracking-wide mb-1">
                Lendários
              </div>
              <div className="text-2xl font-bold text-accent-contrast">
                {legendaryItems}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <span className="text-xs text-theme-secondary">Raridade máxima</span>
              </div>
            </div>

            {/* Categorias */}
            <div className="bg-theme-panel rounded-xl p-4 border border-theme-soft shadow-theme-light hover:shadow-theme-medium transition-all">
              <div className="text-xs font-medium text-theme-secondary uppercase tracking-wide mb-1">
                Categorias
              </div>
              <div className="text-2xl font-bold text-theme-primary">
                {categoriesCount}
              </div>
              <div className="text-xs text-theme-secondary mt-2">
                Diversidade de ferramentas
              </div>
            </div>
          </section>

          {/* ====================== ÁREA DO INVENTÁRIO ====================== */}
          <section className="w-full">
            {viewMode === 'grid' ? (
              <InventoryGrid
                inventorySlots={inventory.inventorySlots}
                selectedSlot={inventory.selectedSlot}
                setSelectedSlot={inventory.setSelectedSlot}
                draggedItem={inventory.draggedItem}
                dragOverSlot={inventory.dragOverSlot}
                onDragStart={inventory.handleDragStart}
                onDragEnd={inventory.handleDragEnd}
                onDragOver={inventory.handleDragOver}
                onDragLeave={inventory.handleDragLeave}
                onDrop={inventory.handleDrop}
              />
            ) : (
              <InventoryList
                filteredTools={inventory.tools}
                inventorySlots={inventory.inventorySlots}
                setSelectedSlot={inventory.setSelectedSlot}
              />
            )}
          </section>
        </div>
      </main>

      {/* ========================= MODAIS ========================= */}
      
      {/* Modal de Detalhes do Item */}
      <ItemDetailModal
        selectedSlot={inventory.selectedSlot}
        inventorySlots={inventory.inventorySlots}
        setSelectedSlot={inventory.setSelectedSlot}
      />

      {/* Modal de Gerenciamento de Itens */}
      <ItemManagerModal
        isOpen={inventory.itemManagerOpen}
        onClose={() => inventory.setItemManagerOpen(false)}
        availableItems={inventory.availableItems}
        onAddItem={inventory.addItem}
        onRemoveItem={inventory.removeItem}
        inventorySlots={inventory.inventorySlots}
      />
    </div>
  )
}
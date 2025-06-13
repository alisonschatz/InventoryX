'use client'

import { useState } from 'react'
import { UserStats } from '@/types/interfaces'
import { useInventory } from '@/hooks/useInventory'
import { useAtmosphere } from '@/hooks/useAtmosphere'
import { useSearch } from '@/hooks/useSearch'

// Componentes principais
import Header from './Header'
import AtmospherePanel from './AtmospherePanel'
import Sidebar from './Sidebar'
import InventoryGrid from './InventoryGrid'
import InventoryList from './InventoryList'
import ItemDetailModal from './ItemDetailModal'
import ItemManagerModal from './ItemManagerModal'

export default function HeroInventory() {
  // Estado do usuário (mock data)
  const [userStats] = useState<UserStats>({
    level: 12,
    xp: 2840,
    nextLevelXp: 3000,
    streak: 7
  })

  // Estado da visualização
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Hooks customizados
  const inventory = useInventory()
  const atmosphere = useAtmosphere()
  const search = useSearch(inventory.tools)

  return (
    <div className="min-h-screen bg-theme-primary">
      
      {/* Header Principal */}
      <Header
        userStats={userStats}
        toolsCount={inventory.tools.length}
        totalSlots={inventory.inventorySlots.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        atmosphereOpen={atmosphere.atmosphereOpen}
        setAtmosphereOpen={atmosphere.setAtmosphereOpen}
        currentTrack={atmosphere.currentTrack}
        isPlaying={atmosphere.isPlaying}
        setIsPlaying={atmosphere.setIsPlaying}
        onOpenItemManager={() => inventory.setItemManagerOpen(true)}
      />

      {/* Painel de Atmosfera Musical com Sistema de Áudio Funcional */}
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

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          
          {/* Sidebar com busca e filtros */}
          <Sidebar
            searchTerm={search.searchTerm}
            setSearchTerm={search.setSearchTerm}
            tools={inventory.tools}
            inventorySlots={inventory.inventorySlots}
          />

          {/* Área do inventário */}
          <div className="flex-1">
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
                filteredTools={search.filteredTools}
                inventorySlots={inventory.inventorySlots}
                setSelectedSlot={inventory.setSelectedSlot}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modal de detalhes do item */}
      <ItemDetailModal
        selectedSlot={inventory.selectedSlot}
        inventorySlots={inventory.inventorySlots}
        setSelectedSlot={inventory.setSelectedSlot}
      />

      {/* Modal de gerenciamento de itens */}
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
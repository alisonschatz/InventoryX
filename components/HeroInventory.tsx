'use client'

import { useState } from 'react'
import { UserStats } from '@/types/interfaces'
import { useInventory } from '@/hooks/useInventory'
import { useAtmosphere } from '@/hooks/useAtmosphere'
import { useSearch } from '@/hooks/useSearch'
import Header from './Header'
import AtmospherePanel from './AtmospherePanel'
import Sidebar from './Sidebar'
import InventoryGrid from './InventoryGrid'
import InventoryList from './InventoryList'
import ItemDetailModal from './ItemDetailModal'

export default function HeroInventory() {
  // Estados locais simples
  const [userStats] = useState<UserStats>({
    level: 12,
    xp: 2840,
    nextLevelXp: 3000,
    streak: 7
  })
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Hooks que gerenciam a lógica complexa
  const inventory = useInventory()
  const atmosphere = useAtmosphere()
  const search = useSearch(inventory.tools)

  return (
    <div className="min-h-screen bg-theme-primary">
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
      />

      <AtmospherePanel 
        atmosphereOpen={atmosphere.atmosphereOpen}
        setAtmosphereOpen={atmosphere.setAtmosphereOpen}
        currentTrack={atmosphere.currentTrack}
        setCurrentTrack={atmosphere.setCurrentTrack}
        isPlaying={atmosphere.isPlaying}
        setIsPlaying={atmosphere.setIsPlaying}
        volume={atmosphere.volume}
        setVolume={atmosphere.setVolume}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <Sidebar
            searchTerm={search.searchTerm}
            setSearchTerm={search.setSearchTerm}
            tools={inventory.tools}
            inventorySlots={inventory.inventorySlots}
          />

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

      <ItemDetailModal
        selectedSlot={inventory.selectedSlot}
        inventorySlots={inventory.inventorySlots}
        setSelectedSlot={inventory.setSelectedSlot}
      />
    </div>
  )
}
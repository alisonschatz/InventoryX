'use client'

import React, { useState, useMemo } from 'react'
import { 
  Package, 
  Plus, 
  Grid3X3, 
  List, 
  Settings
} from 'lucide-react'

// Types
import { UserStats, ViewMode } from '@/types/interfaces'

// Hooks
import { useInventory } from '@/hooks/useInventory'
import { useAtmosphere } from '@/hooks/useAtmosphere'

// Components
import Header from './Header'
import AtmospherePanel from './AtmospherePanel'
import InventoryGrid from './InventoryGrid'
import InventoryList from './InventoryList'
import ItemDetailModal from './ItemDetailModal'
import ItemManagerModal from './ItemManagerModal'
import GuestConversionBanner from './GuestConversionBanner'
import XPSystem from './XPSystem'
import MetricsDashboard from './MetricsDashboard'

// ========================= HERO INVENTORY COMPONENT =========================

const HeroInventory: React.FC = () => {
  // ========================= HOOKS =========================
  
  const inventory = useInventory()
  const atmosphere = useAtmosphere()

  // ========================= LOCAL STATE =========================
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // ========================= MOCK DATA =========================
  
  const userStats: UserStats = {
    level: 12,
    xp: 2840,
    nextLevelXp: 3000,
    streak: 7,
    totalTools: inventory.activeTools.length,
    favoriteCategory: inventory.inventoryStats.categories[0]?.[0] || 'Produtividade'
  }

  // ========================= COMPUTED VALUES =========================
  
  const stats = inventory.inventoryStats
  
  const metrics = useMemo(() => ({
    utilization: {
      used: stats.usedSlots,
      total: stats.totalSlots,
      free: stats.emptySlots,
      percentage: stats.usagePercentage
    },
    rarity: {
      legendary: stats.rarityCount.legendary,
      epic: stats.rarityCount.epic,
      rare: stats.rarityCount.rare,
      common: stats.rarityCount.common,
      premium: stats.rarityCount.legendary + stats.rarityCount.epic
    },
    categories: {
      total: stats.categories.length,
      primary: stats.categories[0] || ['Nenhuma', 0],
      distribution: stats.categories
    }
  }), [stats])

  // ========================= EVENT HANDLERS =========================
  
  const handleOpenItemManager = () => {
    inventory.setItemManagerOpen(true)
  }

  const handleCloseItemManager = () => {
    inventory.setItemManagerOpen(false)
  }

  const handleCloseItemDetail = () => {
    inventory.setSelectedSlot(null)
  }

  const handleResetInventory = () => {
    const confirmed = confirm('⚠️ Tem certeza que deseja resetar o inventário?\n\nEsta ação irá:\n• Remover todas as ferramentas atuais\n• Restaurar apenas as 3 ferramentas padrão\n• Não pode ser desfeita')
    
    if (confirmed) {
      inventory.resetToDefault()
    }
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
  }

  // ========================= RENDER HELPERS =========================

  /**
   * Renderiza o header do inventário com controles
   */
  const renderInventoryHeader = () => (
    <div className="bg-theme-panel rounded-t-xl border border-b-0 border-theme-soft p-4 lg:p-6 shadow-theme-light">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        
        {/* Seção do título */}
        <div className="space-y-1">
          <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-theme-primary flex items-center gap-3">
            <Package className="w-6 h-6 lg:w-7 lg:h-7 text-purple-500" />
            Inventário de Ferramentas
          </h2>
          <p className="text-sm lg:text-base text-theme-secondary">
            Organize e gerencie suas ferramentas de produtividade
          </p>
        </div>
        
        {/* Seção de controles */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4">
          
          {/* Controles de ação */}
          <div className="flex items-center gap-2">
            
            {/* Toggle de visualização */}
            <div className="flex items-center bg-theme-hover rounded-lg p-1 border border-theme-soft">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-sm' 
                    : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-soft'
                }`}
                title="Visualização em grade"
                aria-label="Mudar para visualização em grade"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handleViewModeChange('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-sm' 
                    : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-soft'
                }`}
                title="Visualização em lista"
                aria-label="Mudar para visualização em lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Botão gerenciar ferramentas */}
            <button
              onClick={handleOpenItemManager}
              className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              aria-label="Abrir gerenciador de ferramentas"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline text-sm lg:text-base">Gerenciar</span>
            </button>

            {/* Botão configurações */}
            <button
              onClick={handleResetInventory}
              className="p-2 lg:p-2.5 text-theme-secondary hover:text-theme-primary hover:bg-theme-hover rounded-lg transition-all duration-200 border border-theme-soft hover:border-theme-primary"
              title="Resetar inventário"
              aria-label="Resetar inventário para configuração padrão"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * Renderiza o conteúdo do inventário baseado no modo de visualização
   */
  const renderInventoryContent = () => (
    <div className="bg-theme-panel rounded-b-xl border border-theme-soft shadow-theme-light">
      <div className="p-3 lg:p-6">
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
            filteredTools={inventory.activeTools}
            inventorySlots={inventory.inventorySlots}
            setSelectedSlot={inventory.setSelectedSlot}
          />
        )}
      </div>
    </div>
  )

  // ========================= MAIN RENDER =========================

  return (
    <div className="min-h-screen bg-theme-primary flex flex-col">
      
      {/* ===================== HEADER GLOBAL ===================== */}
      <Header
        userStats={userStats}
        toolsCount={metrics.utilization.used}
        totalSlots={metrics.utilization.total}
        atmosphereOpen={atmosphere.atmosphereOpen}
        setAtmosphereOpen={atmosphere.setAtmosphereOpen}
        currentTrack={atmosphere.currentTrack}
        isPlaying={atmosphere.isPlaying}
        setIsPlaying={atmosphere.setIsPlaying}
      />

      {/* ===================== ATMOSPHERE PANEL ===================== */}
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

      {/* ===================== MAIN CONTENT ===================== */}
      <main className="flex-1 w-full bg-theme-primary">
        <div className="max-w-7xl mx-auto px-4 py-6">
          
          {/* Banner de conversão para convidados */}
          <GuestConversionBanner />
          
          {/* ================= SISTEMA DE XP ================= */}
          <XPSystem userStats={userStats} />
          
          {/* ================= DASHBOARD DE MÉTRICAS ================= */}
          <MetricsDashboard 
            userStats={userStats}
            utilizationData={metrics.utilization}
          />

          {/* ================= SEÇÃO DO INVENTÁRIO ================= */}
          <section className="space-y-0" aria-label="Inventário de ferramentas">
            {renderInventoryHeader()}
            {renderInventoryContent()}
          </section>
        </div>
      </main>

      {/* ===================== MODALS ===================== */}
      
      {/* Modal de detalhes da ferramenta */}
      <ItemDetailModal
        selectedSlot={inventory.selectedSlot}
        inventorySlots={inventory.inventorySlots}
        setSelectedSlot={handleCloseItemDetail}
      />

      {/* Modal de gerenciamento de ferramentas */}
      <ItemManagerModal
        isOpen={inventory.itemManagerOpen}
        onClose={handleCloseItemManager}
        availableItems={inventory.availableTools}
        onAddItem={inventory.addTool}
        onRemoveItem={inventory.removeTool}
        inventorySlots={inventory.inventorySlots}
      />
    </div>
  )
}

export default HeroInventory
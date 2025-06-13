'use client'

import React, { useState, useMemo } from 'react'
import { 
  Package, 
  Plus, 
  Grid3X3, 
  List, 
  TrendingUp, 
  Users, 
  Settings,
  BarChart3,
  Zap,
  Star
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

  // Calcular progresso do XP
  const xpProgress = (userStats.xp / userStats.nextLevelXp) * 100

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
   * Renderiza a barra de XP discreta
   */
  const renderXPBar = () => (
    <div className="mb-6">
      <div className="max-w-5xl mx-auto bg-theme-panel rounded-xl border border-theme-soft shadow-theme-light p-3 md:p-4">
        
        {/* Layout Mobile (Vertical) */}
        <div className="md:hidden space-y-3">
          
          {/* Header Mobile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg">
                <Star className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="text-sm font-bold text-theme-primary">
                Nível {userStats.level}
              </div>
            </div>
            <div className="text-sm font-bold text-theme-primary">
              {Math.round(xpProgress)}%
            </div>
          </div>

          {/* Barra de Progresso Mobile */}
          <div>
            <div className="flex justify-between text-xs text-theme-secondary mb-1">
              <span>{userStats.xp.toLocaleString()} XP</span>
              <span>{userStats.nextLevelXp.toLocaleString()} XP</span>
            </div>
            <div className="w-full bg-theme-hover rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 via-purple-600 to-cyan-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min(xpProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Layout Desktop (Horizontal) */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Ícone de nível */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-theme-primary">
                Nível {userStats.level}
              </div>
              <div className="text-xs text-theme-secondary">
                Progresso atual
              </div>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="flex-1 mx-4">
            <div className="flex justify-between text-xs text-theme-secondary mb-1">
              <span>{userStats.xp.toLocaleString()} XP</span>
              <span>{userStats.nextLevelXp.toLocaleString()} XP</span>
            </div>
            <div className="w-full bg-theme-hover rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 via-purple-600 to-cyan-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min(xpProgress, 100)}%` }}
              />
            </div>
          </div>

          {/* Porcentagem */}
          <div className="text-right">
            <div className="text-sm font-bold text-theme-primary">
              {Math.round(xpProgress)}%
            </div>
            <div className="text-xs text-theme-secondary">
              Completo
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * Renderiza um card de métrica com ícone, título, valor e detalhes
   */
  const renderMetricCard = (
    IconComponent: React.ComponentType<{ className?: string }>,
    title: string,
    value: string | number,
    subtitle: string,
    colorClasses: string,
    progress?: number,
    badge?: string
  ) => (
    <div className="bg-theme-panel rounded-xl p-4 lg:p-5 border border-theme-soft shadow-theme-light hover:shadow-theme-medium transition-all duration-300 group cursor-default">
      {/* Header com ícone e badge */}
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${colorClasses}`}>
          <IconComponent className="w-4 h-4 lg:w-5 lg:h-5" />
        </div>
        {badge && (
          <span className="text-xs font-medium text-theme-secondary bg-theme-hover px-2 py-1 rounded-full border border-theme-soft">
            {badge}
          </span>
        )}
      </div>

      {/* Conteúdo principal */}
      <div className="space-y-2">
        <h3 className="text-xs lg:text-sm font-medium text-theme-secondary uppercase tracking-wide">
          {title}
        </h3>
        
        <div className="text-xl lg:text-2xl font-bold text-theme-primary group-hover:scale-105 transition-transform">
          {value}
        </div>
        
        {/* Barra de progresso opcional */}
        {typeof progress === 'number' && (
          <div className="w-full bg-theme-hover rounded-full h-2 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-current to-current opacity-80"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
        
        {/* Subtítulo */}
        <p className="text-xs text-theme-secondary leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  )

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
          
          {/* Estatísticas rápidas */}
          <div className="hidden lg:flex items-center gap-4 bg-theme-hover rounded-lg px-4 py-2.5 border border-theme-soft">
            <div className="text-center">
              <div className="text-lg font-bold text-theme-primary">{metrics.utilization.used}</div>
              <div className="text-xs text-theme-secondary">Em uso</div>
            </div>
            <div className="w-px h-8 bg-theme-soft"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-theme-primary">{metrics.utilization.free}</div>
              <div className="text-xs text-theme-secondary">Livres</div>
            </div>
          </div>
          
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
          
          {/* ================= BARRA DE XP DISCRETA ================= */}
          {renderXPBar()}
          
          {/* ================= DASHBOARD DE MÉTRICAS ================= */}
          <section className="mb-6 lg:mb-8" aria-label="Métricas do inventário">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
              
              {/* Métrica: Utilização */}
              {renderMetricCard(
                BarChart3,
                'Utilização do Inventário',
                `${metrics.utilization.used}/${metrics.utilization.total}`,
                `${((metrics.utilization.free / metrics.utilization.total) * 100).toFixed(1)}% de capacidade livre disponível`,
                'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-600',
                metrics.utilization.percentage,
                `${metrics.utilization.percentage}%`
              )}

              {/* Métrica: Itens Raros e Lendários */}
              {renderMetricCard(
                TrendingUp,
                'Itens Premium',
                metrics.rarity.premium,
                `${metrics.rarity.legendary} Lendários • ${metrics.rarity.epic} Épicos`,
                'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 text-yellow-600',
                undefined,
                metrics.rarity.premium > 0 ? '🌟 Premium' : 'Básico'
              )}

              {/* Métrica: Diversidade de Categorias */}
              {renderMetricCard(
                Package,
                'Categorias Ativas',
                metrics.categories.total,
                metrics.categories.total > 0 
                  ? `${metrics.categories.primary[1]} ferramentas em ${metrics.categories.primary[0]}`
                  : 'Nenhuma categoria ativa no momento',
                'bg-gradient-to-br from-green-500/10 to-emerald-500/10 text-green-600',
                undefined,
                metrics.categories.primary[0] || 'N/A'
              )}

              {/* Métrica: Slots Disponíveis */}
              {renderMetricCard(
                Users,
                'Slots Disponíveis',
                metrics.utilization.free,
                `${metrics.utilization.used} em uso • ${metrics.utilization.total} total`,
                'bg-gradient-to-br from-purple-500/10 to-pink-500/10 text-purple-600',
                undefined,
                metrics.utilization.free > 15 ? '🟢 Muito espaço' : 
                metrics.utilization.free > 8 ? '🟡 Espaço OK' : 
                '🔴 Pouco espaço'
              )}
            </div>
          </section>

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
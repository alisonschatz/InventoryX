'use client'

import { useState } from 'react'
import { Plus, TrendingUp, Package, Grid3x3, Users } from 'lucide-react'
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
import GuestConversionBanner from './GuestConversionBanner'

export default function HeroInventory() {
  // ===================== ESTADO DA APLICAÇÃO =====================
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // ===================== DADOS DO USUÁRIO =====================
  const userStats: UserStats = {
    level: 12,
    xp: 2840,
    nextLevelXp: 3000,
    streak: 7
  }

  // ===================== HOOKS CUSTOMIZADOS =====================
  const inventory = useInventory()
  const atmosphere = useAtmosphere()

  // ===================== MÉTRICAS CALCULADAS =====================
  const metrics = {
    usedSlots: inventory.tools.length,
    totalSlots: inventory.inventorySlots.length,
    emptySlots: inventory.inventorySlots.length - inventory.tools.length,
    usagePercentage: Math.round((inventory.tools.length / inventory.inventorySlots.length) * 100),
    legendaryCount: inventory.tools.filter(tool => tool.rarity === 'legendary').length,
    epicCount: inventory.tools.filter(tool => tool.rarity === 'epic').length,
    categoriesCount: new Set(inventory.tools.map(tool => tool.category)).size,
    categories: Object.entries(
      inventory.tools.reduce((acc, tool) => {
        acc[tool.category] = (acc[tool.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    ).sort((a, b) => b[1] - a[1])
  }

  // ===================== HANDLERS =====================
  const openItemManager = () => {
    inventory.setItemManagerOpen(true)
  }

  const closeItemManager = () => {
    inventory.setItemManagerOpen(false)
  }

  const closeItemDetail = () => {
    inventory.setSelectedSlot(null)
  }

  return (
    <div className="min-h-screen bg-theme-primary flex flex-col">
      
      {/* ========================= HEADER GLOBAL ========================= */}
      <Header
        userStats={userStats}
        toolsCount={metrics.usedSlots}
        totalSlots={metrics.totalSlots}
        viewMode={viewMode}
        setViewMode={setViewMode}
        atmosphereOpen={atmosphere.atmosphereOpen}
        setAtmosphereOpen={atmosphere.setAtmosphereOpen}
        currentTrack={atmosphere.currentTrack}
        isPlaying={atmosphere.isPlaying}
        setIsPlaying={atmosphere.setIsPlaying}
      />

      {/* ====================== PAINEL DE ATMOSFERA ====================== */}
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

      {/* ====================== CONTEÚDO PRINCIPAL ====================== */}
      <main className="flex-1 w-full bg-theme-primary">
        <div className="max-w-7xl mx-auto px-4 py-6">
          
          {/* ================= BANNER DE CONVERSÃO (CONVIDADO) ================= */}
          <GuestConversionBanner />
          
          {/* ================= DASHBOARD DE MÉTRICAS ================= */}
          <section className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Utilização do Inventário */}
              <div className="bg-theme-panel rounded-xl p-5 border border-theme-soft shadow-theme-light hover:shadow-theme-medium transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg">
                    <Package className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-xs font-medium text-theme-secondary bg-theme-hover px-2 py-1 rounded-full">
                    {metrics.usagePercentage}%
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-theme-secondary uppercase tracking-wide">
                    Utilização
                  </h3>
                  <div className="text-2xl font-bold text-theme-primary group-hover:text-blue-500 transition-colors">
                    {metrics.usedSlots}<span className="text-lg text-theme-secondary">/{metrics.totalSlots}</span>
                  </div>
                  <div className="w-full bg-theme-hover rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${metrics.usagePercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Itens por Raridade */}
              <div className="bg-theme-panel rounded-xl p-5 border border-theme-soft shadow-theme-light hover:shadow-theme-medium transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="flex gap-1">
                    {metrics.legendaryCount > 0 && <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>}
                    {metrics.epicCount > 0 && <div className="w-2 h-2 bg-purple-400 rounded-full"></div>}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-theme-secondary uppercase tracking-wide">
                    Raros & Lendários
                  </h3>
                  <div className="text-2xl font-bold text-theme-primary group-hover:text-yellow-500 transition-colors">
                    {metrics.legendaryCount + metrics.epicCount}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      {metrics.legendaryCount} Lendários
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      {metrics.epicCount} Épicos
                    </span>
                  </div>
                </div>
              </div>

              {/* Diversidade de Categorias */}
              <div className="bg-theme-panel rounded-xl p-5 border border-theme-soft shadow-theme-light hover:shadow-theme-medium transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg">
                    <Grid3x3 className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-xs font-medium text-theme-secondary">
                    {metrics.categories.length > 0 ? metrics.categories[0][0] : 'N/A'}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-theme-secondary uppercase tracking-wide">
                    Categorias
                  </h3>
                  <div className="text-2xl font-bold text-theme-primary group-hover:text-green-500 transition-colors">
                    {metrics.categoriesCount}
                  </div>
                  <div className="text-xs text-theme-secondary">
                    {metrics.categoriesCount > 0 ? `${metrics.categories[0][1]} ferramentas na principal` : 'Nenhuma categoria'}
                  </div>
                </div>
              </div>

              {/* Slots Disponíveis */}
              <div className="bg-theme-panel rounded-xl p-5 border border-theme-soft shadow-theme-light hover:shadow-theme-medium transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg">
                    <Users className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                    metrics.emptySlots > 10 ? 'bg-green-100 text-green-700' : 
                    metrics.emptySlots > 5 ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {metrics.emptySlots > 10 ? 'Muito espaço' : 
                     metrics.emptySlots > 5 ? 'Espaço OK' : 
                     'Quase cheio'}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-theme-secondary uppercase tracking-wide">
                    Slots Livres
                  </h3>
                  <div className="text-2xl font-bold text-theme-primary group-hover:text-purple-500 transition-colors">
                    {metrics.emptySlots}
                  </div>
                  <div className="text-xs text-theme-secondary">
                    {((metrics.emptySlots / metrics.totalSlots) * 100).toFixed(1)}% de capacidade livre
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= SEÇÃO DO INVENTÁRIO ================= */}
          <section className="space-y-0">
            
            {/* Header do Inventário */}
            <div className="bg-theme-panel rounded-t-xl border border-b-0 border-theme-soft p-6 shadow-theme-light">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Título e Descrição */}
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-theme-primary flex items-center gap-2">
                    <Package className="w-6 h-6 text-purple-500" />
                    Inventário de Ferramentas
                  </h2>
                  <p className="text-theme-secondary">
                    Organize e gerencie suas ferramentas de produtividade através de drag & drop
                  </p>
                </div>
                
                {/* Controles */}
                <div className="flex items-center gap-4">
                  
                  {/* Estatísticas Rápidas */}
                  <div className="hidden md:flex items-center gap-4 bg-theme-hover rounded-lg px-4 py-2 border border-theme-soft">
                    <div className="text-center">
                      <div className="text-lg font-bold text-theme-primary">{metrics.usedSlots}</div>
                      <div className="text-xs text-theme-secondary">Em uso</div>
                    </div>
                    <div className="w-px h-8 bg-theme-soft"></div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-theme-primary">{metrics.emptySlots}</div>
                      <div className="text-xs text-theme-secondary">Livres</div>
                    </div>
                  </div>
                  
                  {/* Botão Gerenciar */}
                  <button
                    onClick={openItemManager}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg hover:scale-[1.02]"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:block">Gerenciar Itens</span>
                    <span className="sm:hidden">Itens</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Conteúdo do Inventário */}
            <div className="bg-theme-panel rounded-b-xl border border-theme-soft shadow-theme-light overflow-hidden">
              <div className="p-6">
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
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ========================= MODAIS ========================= */}
      
      {/* Modal de Detalhes do Item */}
      <ItemDetailModal
        selectedSlot={inventory.selectedSlot}
        inventorySlots={inventory.inventorySlots}
        setSelectedSlot={closeItemDetail}
      />

      {/* Modal de Gerenciamento */}
      <ItemManagerModal
        isOpen={inventory.itemManagerOpen}
        onClose={closeItemManager}
        availableItems={inventory.availableItems}
        onAddItem={inventory.addItem}
        onRemoveItem={inventory.removeItem}
        inventorySlots={inventory.inventorySlots}
      />
    </div>
  )
}
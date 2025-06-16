'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Package, Plus, Grid3X3, List, Settings } from 'lucide-react'

// ========================= TYPES =========================

import { UserStats, ViewMode } from '@/types/interfaces'

// ========================= HOOKS =========================

import { useInventory } from '@/hooks/useInventory'
import { useAtmosphere } from '@/hooks/useAtmosphere'
import { useTodo } from '@/hooks/useTodo'
import { usePomodoro } from '@/hooks/usePomodoro'
import { useKanban } from '@/hooks/useKanban'

// ========================= COMPONENTS =========================

import Header from './Header'
import AtmospherePanel from './AtmospherePanel'
import InventoryGrid from './InventoryGrid'
import InventoryList from './InventoryList'
import ItemDetailModal from './ItemDetailModal'
import ItemManagerModal from './ItemManagerModal'
import GuestConversionBanner from './GuestConversionBanner'
import XPSystem from './XPSystem'
import MetricsDashboard from './MetricsDashboard'
import TodoTool from './TodoTool'
import PomodoroTool from './PomodoroTool'
import KanbanTool from './KanbanTool'
import Footer from './Footer'

// ========================= MAIN COMPONENT =========================

const HeroInventory: React.FC = () => {
  // ========================= HOOKS INITIALIZATION =========================
  
  const inventory = useInventory()
  const atmosphere = useAtmosphere()
  const todo = useTodo()
  const pomodoro = usePomodoro()
  const kanban = useKanban()

  // ========================= LOCAL STATE =========================
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // ========================= USER STATS COMPUTATION =========================
  
  const userStats: UserStats = useMemo(() => ({
    level: 12,
    xp: 2840,
    nextLevelXp: 3000,
    streak: 7,
    totalTools: inventory.activeTools.length,
    favoriteCategory: inventory.inventoryStats.categories[0]?.[0] || 'Produtividade'
  }), [inventory.activeTools.length, inventory.inventoryStats.categories])

  // ========================= INVENTORY METRICS COMPUTATION =========================
  
  const metrics = useMemo(() => {
    const stats = inventory.inventoryStats
    
    return {
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
    }
  }, [inventory.inventoryStats])

  // ========================= DEFAULT TOOLS SETUP =========================
  
  useEffect(() => {
    // Verificar se os hooks estão prontos
    if (!inventory?.addTool || !inventory?.inventorySlots) {
      console.log('⏳ Aguardando hooks do inventário...')
      return
    }

    const defaultTools = [
      {
        id: 'todo-list',
        name: 'Lista de Tarefas',
        icon: '✅',
        category: 'Produtividade',
        rarity: 'common' as const,
        slot: 0,
        description: 'Organize suas tarefas diárias e acompanhe seu progresso. Gerencie prioridades, categorias e prazos de forma eficiente.',
        isActive: true
      },
      {
        id: 'pomodoro-timer',
        name: 'Pomodoro Timer',
        icon: '🍅',
        category: 'Produtividade',
        rarity: 'rare' as const,
        slot: 1,
        description: 'Técnica Pomodoro para aumentar foco e produtividade com sessões cronometradas de trabalho e pausas.',
        isActive: true
      },
      {
        id: 'kanban-board',
        name: 'Kanban Board',
        icon: '📋',
        category: 'Projetos',
        rarity: 'epic' as const,
        slot: 2,
        description: 'Quadro Kanban para gerenciamento visual de projetos e tarefas. Organize fluxos de trabalho com colunas personalizáveis.',
        isActive: true
      }
    ]

    // Verificar e adicionar ferramentas padrão se necessário
    defaultTools.forEach((tool, index) => {
      const currentSlot = inventory.inventorySlots[index]
      const needsToAdd = !currentSlot || 
                        currentSlot.id !== tool.id || 
                        !currentSlot.name.includes(tool.name.split(' ')[0])

      if (needsToAdd) {
        console.log(`🔧 Adicionando ferramenta padrão: ${tool.name} no slot ${index}`)
        inventory.addTool(tool, index)
      }
    })
  }, [inventory?.addTool, inventory?.inventorySlots])

  // ========================= EVENT HANDLERS =========================
  
  const handleOpenItemManager = () => {
    console.log('📦 Abrindo gerenciador de itens')
    inventory.setItemManagerOpen(true)
  }

  const handleCloseItemManager = () => {
    console.log('📦 Fechando gerenciador de itens')
    inventory.setItemManagerOpen(false)
  }

  const handleCloseItemDetail = () => {
    console.log('📋 Fechando detalhes do item')
    inventory.setSelectedSlot(null)
  }

  const handleResetInventory = () => {
    const confirmed = confirm(
      '⚠️ Tem certeza que deseja resetar o inventário?\n\n' +
      'Esta ação irá:\n' +
      '• Remover todas as ferramentas atuais\n' +
      '• Restaurar apenas as 3 ferramentas padrão\n' +
      '• Não pode ser desfeita\n\n' +
      'Deseja continuar?'
    )
    
    if (confirmed) {
      console.log('🔄 Resetando inventário para padrão')
      inventory.resetToDefault()
    }
  }

  const handleViewModeChange = (mode: ViewMode) => {
    console.log(`👁️ Mudando modo de visualização para: ${mode}`)
    setViewMode(mode)
  }

  const handleOpenTool = (toolId: string) => {
    console.log('🎯 handleOpenTool executado com:', toolId)
    
    // Mapear tipos de ferramentas por ID e palavras-chave
    const toolMatchers = {
      todo: ['todo-list', 'todo-advanced', 'task-manager', 'task-list'],
      pomodoro: ['pomodoro-timer', 'pomodoro-tool', 'timer', 'focus-timer'],
      kanban: ['kanban-board', 'kanban-tool', 'project-board', 'board', 'project-manager', 'task-board']
    }

    // Função para buscar ferramentas por palavras-chave no slot
    const searchInSlots = (keywords: string[]) => {
      return inventory.inventorySlots.find(slot => 
        slot?.id === toolId && keywords.some(keyword => 
          slot.name.toLowerCase().includes(keyword.toLowerCase()) ||
          slot.id.toLowerCase().includes(keyword.toLowerCase())
        )
      )
    }

    // Verificar tipo de ferramenta - TODO
    const isTodoTool = toolMatchers.todo.includes(toolId) ||
                     toolId.toLowerCase().includes('todo') ||
                     toolId.toLowerCase().includes('task') ||
                     searchInSlots(['tarefas', 'to-do', 'task', 'lista', 'todo'])

    // Verificar tipo de ferramenta - POMODORO  
    const isPomodoroTool = toolMatchers.pomodoro.includes(toolId) ||
                         toolId.toLowerCase().includes('pomodoro') ||
                         toolId.toLowerCase().includes('timer') ||
                         searchInSlots(['pomodoro', 'timer', 'cronômetro', 'foco', 'focus'])

    // Verificar tipo de ferramenta - KANBAN
    const isKanbanTool = toolMatchers.kanban.includes(toolId) ||
                       toolId.toLowerCase().includes('kanban') ||
                       toolId.toLowerCase().includes('board') ||
                       toolId.toLowerCase().includes('project') ||
                       searchInSlots(['kanban', 'board', 'projeto', 'quadro', 'painel', 'project'])

    console.log('🔍 Análise de tipos de ferramenta:', {
      toolId,
      isTodoTool,
      isPomodoroTool,
      isKanbanTool,
      slot: inventory.inventorySlots.find(slot => slot?.id === toolId)
    })

    // Abrir a ferramenta correspondente
    if (isTodoTool) {
      console.log('✅ Abrindo Todo Tool')
      todo.openTodo()
    } else if (isPomodoroTool) {
      console.log('🍅 Abrindo Pomodoro Tool')
      pomodoro.openPomodoro()
    } else if (isKanbanTool) {
      console.log('📋 Abrindo Kanban Tool')
      kanban.openKanban()
    } else {
      console.log('❌ Tipo de ferramenta não reconhecido:', toolId)
      // Fallback: tentar abrir baseado no nome
      const tool = inventory.inventorySlots.find(slot => slot?.id === toolId)
      if (tool) {
        console.log('🔄 Tentativa de fallback baseada no nome:', tool.name)
        const toolName = tool.name.toLowerCase()
        if (toolName.includes('tarefa') || toolName.includes('todo')) {
          todo.openTodo()
        } else if (toolName.includes('pomodoro') || toolName.includes('timer')) {
          pomodoro.openPomodoro()
        } else if (toolName.includes('kanban') || toolName.includes('board') || toolName.includes('projeto')) {
          kanban.openKanban()
        }
      }
    }

    // Fechar modal de detalhes
    handleCloseItemDetail()
  }

  // ========================= RENDER HELPERS =========================

  const renderInventoryHeader = () => (
    <div className="bg-theme-panel rounded-t-xl border border-b-0 border-theme-soft p-4 lg:p-6 shadow-theme-light">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        
        {/* Título e Descrição */}
        <div className="space-y-1">
          <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-theme-primary flex items-center gap-3">
            <Package className="w-6 h-6 lg:w-7 lg:h-7 text-purple-500" />
            Inventário de Ferramentas
          </h2>
          <p className="text-sm lg:text-base text-theme-secondary">
            Organize e gerencie suas ferramentas de produtividade
          </p>
        </div>
        
        {/* Controles de Interface */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4">
          
          {/* Toggle de Visualização */}
          <div className="flex items-center bg-theme-hover rounded-lg p-1 border border-theme-soft">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-sm' 
                  : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-soft'
              }`}
              title="Visualização em grade"
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
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Botão Gerenciar Inventário */}
          <button
            onClick={handleOpenItemManager}
            className="flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline text-sm lg:text-base">Gerenciar</span>
          </button>

          {/* Botão Reset */}
          <button
            onClick={handleResetInventory}
            className="p-2 lg:p-2.5 text-theme-secondary hover:text-theme-primary hover:bg-theme-hover rounded-lg transition-all duration-200 border border-theme-soft hover:border-theme-primary"
            title="Resetar inventário"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

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
      
      {/* =================== HEADER GLOBAL =================== */}
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

      {/* =================== PAINEL DE ATMOSFERA =================== */}
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

      {/* =================== CONTEÚDO PRINCIPAL =================== */}
      <main className="flex-1 w-full bg-theme-primary">
        <div className="max-w-7xl mx-auto px-4 py-6">
          
          {/* Banner de Conversão para Convidados */}
          <GuestConversionBanner />
          
          {/* Sistema de Experiência */}
          <XPSystem userStats={userStats} />
          
          {/* Dashboard de Métricas */}
          <MetricsDashboard 
            userStats={userStats}
            utilizationData={metrics.utilization}
          />

          {/* Seção Principal do Inventário */}
          <section className="space-y-0" aria-label="Inventário de ferramentas">
            {renderInventoryHeader()}
            {renderInventoryContent()}
          </section>
        </div>
      </main>

      {/* =================== FOOTER DISCRETO =================== */}
      <Footer />

      {/* ========================= MODAIS DE INTERFACE ========================= */}
      
      {/* Modal de Detalhes do Item */}
      <ItemDetailModal
        selectedSlot={inventory.selectedSlot}
        inventorySlots={inventory.inventorySlots}
        setSelectedSlot={handleCloseItemDetail}
        onOpenTool={handleOpenTool}
      />

      {/* Modal de Gerenciamento de Inventário */}
      <ItemManagerModal
        isOpen={inventory.itemManagerOpen}
        onClose={handleCloseItemManager}
        availableItems={inventory.availableTools}
        onAddItem={inventory.addTool}
        onRemoveItem={inventory.removeTool}
        inventorySlots={inventory.inventorySlots}
      />

      {/* ========================= FERRAMENTAS INTERATIVAS ========================= */}
      
      {/* Ferramenta de Lista de Tarefas */}
      <TodoTool
        isOpen={todo.isTodoOpen}
        onClose={todo.closeTodo}
      />
      
      {/* Ferramenta Pomodoro Timer */}
      <PomodoroTool
        isOpen={pomodoro.isPomodoroOpen}
        onClose={pomodoro.closePomodoro}
      />

      {/* Ferramenta Kanban Board */}
      <KanbanTool
        isOpen={kanban.isKanbanOpen}
        onClose={kanban.closeKanban}
      />
    </div>
  )
}

export default HeroInventory
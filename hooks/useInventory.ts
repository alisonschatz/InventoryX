// hooks/useInventory.ts - Atualizado com sincronização Firebase
'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { Tool, DraggedItem, InventoryStats, ViewMode } from '@/types/interfaces'
import { useInventorySync } from './useInventorySync'
import { useAuth } from '@/contexts/AuthContext'
import debugService from '@/lib/debug'

// ========================= CONSTANTS =========================

const TOTAL_SLOTS = 48
const INITIAL_TOOL_COUNT = 3

// ========================= DEFAULT TOOLS =========================

const createDefaultTools = (): Tool[] => [
  {
    id: 'todo-001',
    name: 'To-Do List',
    icon: '✅',
    category: 'Produtividade',
    rarity: 'common',
    slot: 0,
    description: 'Organize suas tarefas diárias de forma eficiente',
    isActive: true,
    dateAdded: new Date().toISOString()
  },
  {
    id: 'pomodoro-002',
    name: 'Pomodoro Timer',
    icon: '🍅',
    category: 'Produtividade',
    rarity: 'rare',
    slot: 1,
    description: 'Técnica de foco em blocos de 25 minutos',
    isActive: true,
    dateAdded: new Date().toISOString()
  },
  {
    id: 'kanban-003',
    name: 'Kanban Board',
    icon: '📋',
    category: 'Produtividade',
    rarity: 'epic',
    slot: 2,
    description: 'Visualize seu fluxo de trabalho com quadros',
    isActive: true,
    dateAdded: new Date().toISOString()
  }
]

// ========================= AVAILABLE TOOLS =========================

const createAvailableTools = (): Tool[] => [
  {
    id: 'calendar-004',
    name: 'Calendar',
    icon: '📅',
    category: 'Organização',
    rarity: 'common',
    slot: -1,
    description: 'Gerencie compromissos e eventos'
  },
  {
    id: 'notes-005',
    name: 'Notes App',
    icon: '📝',
    category: 'Produtividade',
    rarity: 'common',
    slot: -1,
    description: 'Anote ideias rapidamente'
  },
  {
    id: 'password-006',
    name: 'Password Manager',
    icon: '🔐',
    category: 'Segurança',
    rarity: 'epic',
    slot: -1,
    description: 'Gerencie senhas com segurança máxima'
  },
  {
    id: 'time-007',
    name: 'Time Tracker',
    icon: '⏱️',
    category: 'Produtividade',
    rarity: 'rare',
    slot: -1,
    description: 'Monitore tempo gasto em atividades'
  },
  {
    id: 'weather-008',
    name: 'Weather App',
    icon: '🌤️',
    category: 'Utilidades',
    rarity: 'common',
    slot: -1,
    description: 'Previsão do tempo atualizada'
  },
  {
    id: 'calculator-009',
    name: 'Calculator',
    icon: '🧮',
    category: 'Utilidades',
    rarity: 'common',
    slot: -1,
    description: 'Calculadora científica avançada'
  },
  {
    id: 'mindmap-010',
    name: 'Mind Map',
    icon: '🧠',
    category: 'Criatividade',
    rarity: 'epic',
    slot: -1,
    description: 'Organize ideias de forma visual'
  },
  {
    id: 'habits-011',
    name: 'Habit Tracker',
    icon: '📊',
    category: 'Produtividade',
    rarity: 'rare',
    slot: -1,
    description: 'Acompanhe e construa novos hábitos'
  },
  {
    id: 'code-012',
    name: 'Code Editor',
    icon: '💻',
    category: 'Desenvolvimento',
    rarity: 'legendary',
    slot: -1,
    description: 'Editor de código com syntax highlighting'
  }
]

// ========================= INVENTORY HOOK =========================

export const useInventory = () => {
  // ========================= CONTEXTS =========================
  
  const { user, isGuestMode, loading: authLoading } = useAuth()
  const { syncState, saveInventory: saveToFirebase, loadInventory: loadFromFirebase, forceSave, clearSyncError, enableAutoSave, setEnableAutoSave } = useInventorySync()

  // ========================= STATES =========================
  
  const [inventorySlots, setInventorySlots] = useState<(Tool | null)[]>(() => {
    const slots = new Array(TOTAL_SLOTS).fill(null)
    const defaultTools = createDefaultTools()
    
    // Inserir ferramentas padrão nos primeiros slots (apenas inicialmente)
    defaultTools.forEach((tool, index) => {
      slots[index] = tool
    })
    
    return slots
  })

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [itemManagerOpen, setItemManagerOpen] = useState(false)
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null)
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  // ========================= EFFECTS =========================

  // Carregar inventário do Firebase quando usuário logar
  useEffect(() => {
    const initializeInventory = async () => {
      if (authLoading) return // Aguardar autenticação

      setIsInitializing(true)

      try {
        if (user && !isGuestMode) {
          debugService.info('firebase', 'Carregando inventário do usuário')
          
          const loadedInventory = await loadFromFirebase()
          
          if (loadedInventory && loadedInventory.length === TOTAL_SLOTS) {
            debugService.success('firebase', 'Inventário carregado do Firestore')
            setInventorySlots(loadedInventory)
          } else {
            debugService.info('firebase', 'Nenhum inventário salvo - usando padrão')
            // Manter inventário padrão e salvar no Firebase
            const defaultSlots = new Array(TOTAL_SLOTS).fill(null)
            const defaultTools = createDefaultTools()
            
            defaultTools.forEach((tool, index) => {
              defaultSlots[index] = tool
            })
            
            setInventorySlots(defaultSlots)
            await saveToFirebase(defaultSlots)
          }
        } else if (isGuestMode) {
          debugService.info('guest', 'Modo convidado - usando localStorage')
          // Para convidados, tentar carregar do localStorage
          const savedGuest = localStorage.getItem('inventoryx-guest-inventory')
          if (savedGuest) {
            try {
              const parsed = JSON.parse(savedGuest)
              if (Array.isArray(parsed) && parsed.length === TOTAL_SLOTS) {
                setInventorySlots(parsed)
              }
            } catch (error) {
              debugService.error('guest', 'Erro ao carregar inventário do localStorage', error)
            }
          }
        }
      } catch (error) {
        debugService.error('firebase', 'Erro ao inicializar inventário', error)
      } finally {
        setIsInitializing(false)
      }
    }

    initializeInventory()
  }, [user, isGuestMode, authLoading, loadFromFirebase, saveToFirebase])

  // Auto-salvar mudanças no inventário
  useEffect(() => {
    if (isInitializing || authLoading) return

    if (user && !isGuestMode) {
      // Para usuários reais, salvar no Firebase
      saveToFirebase(inventorySlots)
    } else if (isGuestMode) {
      // Para convidados, salvar no localStorage
      localStorage.setItem('inventoryx-guest-inventory', JSON.stringify(inventorySlots))
    }
  }, [inventorySlots, user, isGuestMode, isInitializing, authLoading, saveToFirebase])

  // ========================= COMPUTED VALUES =========================

  // Ferramentas ativas no inventário
  const activeTools = useMemo(() => {
    return inventorySlots.filter((tool): tool is Tool => tool !== null)
  }, [inventorySlots])

  // Ferramentas disponíveis para instalar
  const availableTools = useMemo(() => {
    const allAvailable = createAvailableTools()
    return allAvailable.filter(tool => 
      !inventorySlots.some(slot => slot?.id === tool.id)
    )
  }, [inventorySlots])

  // Estatísticas do inventário
  const inventoryStats = useMemo((): InventoryStats => {
    const totalSlots = TOTAL_SLOTS
    const usedSlots = activeTools.length
    const emptySlots = totalSlots - usedSlots
    const usagePercentage = Math.round((usedSlots / totalSlots) * 100)

    // Contagem por raridade
    const rarityCount = activeTools.reduce((acc, tool) => {
      acc[tool.rarity] = (acc[tool.rarity] || 0) + 1
      return acc
    }, { common: 0, rare: 0, epic: 0, legendary: 0 })

    // Contagem por categoria
    const categoryCount = activeTools.reduce((acc, tool) => {
      acc[tool.category] = (acc[tool.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Array de categorias ordenado por quantidade
    const categories = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)

    return {
      totalSlots,
      usedSlots,
      emptySlots,
      usagePercentage,
      rarityCount,
      categoryCount,
      categories
    }
  }, [activeTools])

  // ========================= DRAG & DROP HANDLERS =========================

  const handleDragStart = useCallback((e: React.DragEvent, fromSlot: number) => {
    const tool = inventorySlots[fromSlot]
    if (!tool) return

    const dragData: DraggedItem = {
      item: tool,
      fromSlot,
      dragStartTime: Date.now()
    }

    setDraggedItem(dragData)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', '')
  }, [inventorySlots])

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null)
    setDragOverSlot(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, toSlot: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverSlot(toSlot)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOverSlot(null)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, toSlot: number) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem.fromSlot === toSlot) {
      setDraggedItem(null)
      setDragOverSlot(null)
      return
    }

    setInventorySlots(prev => {
      const newSlots = [...prev]
      const { item: draggedTool, fromSlot } = draggedItem
      const targetTool = newSlots[toSlot]

      // Atualizar slots das ferramentas
      const updatedDraggedTool = { ...draggedTool, slot: toSlot }
      const updatedTargetTool = targetTool ? { ...targetTool, slot: fromSlot } : null

      // Realizar a troca
      newSlots[fromSlot] = updatedTargetTool
      newSlots[toSlot] = updatedDraggedTool

      return newSlots
    })

    // Log da ação
    debugService.info('firebase', `Ferramenta ${draggedItem.item.name} movida do slot ${draggedItem.fromSlot + 1} para ${toSlot + 1}`)

    setDraggedItem(null)
    setDragOverSlot(null)
  }, [draggedItem])

  // ========================= INVENTORY MANAGEMENT =========================

  const addTool = useCallback((tool: Tool, targetSlot: number): boolean => {
    if (inventorySlots[targetSlot] !== null) {
      debugService.warning('firebase', 'Slot ocupado, não é possível adicionar ferramenta')
      return false
    }

    const toolWithSlot = {
      ...tool,
      slot: targetSlot,
      isActive: true,
      dateAdded: new Date().toISOString()
    }

    setInventorySlots(prev => {
      const newSlots = [...prev]
      newSlots[targetSlot] = toolWithSlot
      return newSlots
    })

    debugService.success('firebase', `${tool.name} adicionada ao slot ${targetSlot + 1}`)
    return true
  }, [inventorySlots])

  const removeTool = useCallback((slotIndex: number): boolean => {
    const tool = inventorySlots[slotIndex]
    if (!tool) {
      debugService.warning('firebase', 'Slot vazio, nada para remover')
      return false
    }

    setInventorySlots(prev => {
      const newSlots = [...prev]
      newSlots[slotIndex] = null
      return newSlots
    })

    debugService.success('firebase', `${tool.name} removida do slot ${slotIndex + 1}`)
    return true
  }, [inventorySlots])

  const clearInventory = useCallback(() => {
    setInventorySlots(new Array(TOTAL_SLOTS).fill(null))
    setSelectedSlot(null)
    debugService.info('firebase', 'Inventário completamente limpo')
  }, [])

  const resetToDefault = useCallback(() => {
    const slots = new Array(TOTAL_SLOTS).fill(null)
    const defaultTools = createDefaultTools()
    
    defaultTools.forEach((tool, index) => {
      slots[index] = tool
    })
    
    setInventorySlots(slots)
    setSelectedSlot(null)
    debugService.info('firebase', 'Inventário resetado para configuração padrão')
  }, [])

  const swapTools = useCallback((slotA: number, slotB: number): boolean => {
    if (slotA === slotB) return false

    setInventorySlots(prev => {
      const newSlots = [...prev]
      const toolA = newSlots[slotA]
      const toolB = newSlots[slotB]

      // Atualizar slots se as ferramentas existirem
      const updatedToolA = toolA ? { ...toolA, slot: slotB } : null
      const updatedToolB = toolB ? { ...toolB, slot: slotA } : null

      newSlots[slotA] = updatedToolB
      newSlots[slotB] = updatedToolA

      return newSlots
    })

    debugService.info('firebase', `Ferramentas dos slots ${slotA + 1} e ${slotB + 1} trocadas`)
    return true
  }, [])

  // ========================= UTILITY FUNCTIONS =========================

  const getToolBySlot = useCallback((slotIndex: number): Tool | null => {
    return inventorySlots[slotIndex] || null
  }, [inventorySlots])

  const getToolById = useCallback((toolId: string): Tool | null => {
    return inventorySlots.find(tool => tool?.id === toolId) || null
  }, [inventorySlots])

  const findToolSlot = useCallback((toolId: string): number | null => {
    const slotIndex = inventorySlots.findIndex(tool => tool?.id === toolId)
    return slotIndex >= 0 ? slotIndex : null
  }, [inventorySlots])

  const isSlotEmpty = useCallback((slotIndex: number): boolean => {
    return inventorySlots[slotIndex] === null
  }, [inventorySlots])

  const getEmptySlots = useCallback((): number[] => {
    return inventorySlots
      .map((tool, index) => tool === null ? index : -1)
      .filter(index => index >= 0)
  }, [inventorySlots])

  const getOccupiedSlots = useCallback((): number[] => {
    return inventorySlots
      .map((tool, index) => tool !== null ? index : -1)
      .filter(index => index >= 0)
  }, [inventorySlots])

  const getToolsByCategory = useCallback((category: string): Tool[] => {
    return activeTools.filter(tool => tool.category === category)
  }, [activeTools])

  const getToolsByRarity = useCallback((rarity: string): Tool[] => {
    return activeTools.filter(tool => tool.rarity === rarity)
  }, [activeTools])

  // ========================= SEARCH & FILTER =========================

  const searchTools = useCallback((query: string): Tool[] => {
    const lowercaseQuery = query.toLowerCase()
    return activeTools.filter(tool =>
      tool.name.toLowerCase().includes(lowercaseQuery) ||
      tool.category.toLowerCase().includes(lowercaseQuery) ||
      tool.description?.toLowerCase().includes(lowercaseQuery)
    )
  }, [activeTools])

  // ========================= SYNC CONTROLS =========================

  const manualSave = useCallback(async (): Promise<boolean> => {
    if (user && !isGuestMode) {
      return await forceSave()
    }
    return false
  }, [user, isGuestMode, forceSave])

  // ========================= EXPORT =========================

  return {
    // Estado do inventário
    inventorySlots,
    selectedSlot,
    setSelectedSlot,
    itemManagerOpen,
    setItemManagerOpen,

    // Estados de carregamento
    isInitializing,
    authLoading,

    // Drag & Drop
    draggedItem,
    dragOverSlot,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,

    // Dados computados
    activeTools,
    availableTools,
    inventoryStats,

    // Gerenciamento de ferramentas
    addTool,
    removeTool,
    clearInventory,
    resetToDefault,
    swapTools,

    // Utilitários
    getToolBySlot,
    getToolById,
    findToolSlot,
    isSlotEmpty,
    getEmptySlots,
    getOccupiedSlots,
    getToolsByCategory,
    getToolsByRarity,
    searchTools,

    // Sincronização
    syncState,
    manualSave,
    clearSyncError,
    enableAutoSave,
    setEnableAutoSave,

    // Constantes
    TOTAL_SLOTS,
    INITIAL_TOOL_COUNT
  }
}
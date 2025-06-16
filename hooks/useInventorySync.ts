// hooks/useInventorySync.ts
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Tool } from '@/types/interfaces'
import { firebaseInventoryService, SaveResult, LoadResult } from '@/lib/firebase-inventory'
import { useAuth } from '@/contexts/AuthContext'
import debugService from '@/lib/debug'

interface InventorySyncState {
  isSyncing: boolean
  lastSaved: string | null
  hasUnsavedChanges: boolean
  isOnline: boolean
  syncError: string | null
}

interface UseInventorySyncReturn {
  syncState: InventorySyncState
  saveInventory: (inventorySlots: (Tool | null)[]) => Promise<boolean>
  loadInventory: () => Promise<(Tool | null)[] | null>
  forceSave: () => Promise<boolean>
  clearSyncError: () => void
  enableAutoSave: boolean
  setEnableAutoSave: (enable: boolean) => void
}

export const useInventorySync = (): UseInventorySyncReturn => {
  // ========================= STATE =========================
  
  const [syncState, setSyncState] = useState<InventorySyncState>({
    isSyncing: false,
    lastSaved: null,
    hasUnsavedChanges: false,
    isOnline: navigator.onLine,
    syncError: null
  })

  const [enableAutoSave, setEnableAutoSave] = useState(true)
  const [currentInventory, setCurrentInventory] = useState<(Tool | null)[]>([])

  // ========================= REFS =========================
  
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitializedRef = useRef(false)
  const lastSyncVersionRef = useRef<number>(0)

  // ========================= AUTH CONTEXT =========================
  
  const { user, isGuestMode } = useAuth()

  // ========================= EFFECTS =========================

  // Inicializar serviço quando usuário logado
  useEffect(() => {
    const initializeSync = async () => {
      if (user && !isGuestMode && !isInitializedRef.current) {
        debugService.info('firebase', 'Inicializando sincronização do inventário', {
          userId: user.uid
        })

        const initialized = await firebaseInventoryService.initialize(user.uid)
        if (initialized) {
          isInitializedRef.current = true
          debugService.success('firebase', 'Sincronização inicializada')
          
          // Carregar inventário inicial
          await loadInventoryFromFirebase()
        } else {
          debugService.error('firebase', 'Falha na inicialização da sincronização')
        }
      }
    }

    initializeSync()

    // Cleanup na mudança de usuário
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [user, isGuestMode])

  // Monitor de conexão
  useEffect(() => {
    const handleOnline = () => {
      setSyncState(prev => ({ ...prev, isOnline: true }))
      debugService.info('firebase', 'Conexão restaurada')
      
      // Tentar sincronizar mudanças pendentes
      if (syncState.hasUnsavedChanges && currentInventory.length > 0) {
        saveToFirebase(currentInventory)
      }
    }

    const handleOffline = () => {
      setSyncState(prev => ({ ...prev, isOnline: false }))
      debugService.warning('firebase', 'Conexão perdida')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [syncState.hasUnsavedChanges, currentInventory])

  // ========================= FIREBASE OPERATIONS =========================

  // Carregar inventário do Firebase
  const loadInventoryFromFirebase = async (): Promise<(Tool | null)[] | null> => {
    if (!user || isGuestMode || !isInitializedRef.current) {
      debugService.warning('firebase', 'Não pode carregar - usuário não autenticado ou modo convidado')
      return null
    }

    try {
      debugService.info('firebase', 'Carregando inventário do Firestore')

      const result: LoadResult = await firebaseInventoryService.loadInventory()

      if (result.success && result.data) {
        debugService.success('firebase', 'Inventário carregado com sucesso', {
          itemCount: result.data.inventorySlots.filter(slot => slot !== null).length,
          lastUpdated: result.data.lastUpdated
        })

        // Converter para formato do frontend
        const inventory = result.data.inventorySlots.map(slot => {
          if (!slot) return null
          
          return {
            id: slot.id,
            name: slot.name,
            icon: slot.icon,
            category: slot.category,
            rarity: slot.rarity as 'common' | 'rare' | 'epic' | 'legendary',
            slot: slot.slot,
            description: slot.description,
            isActive: slot.isActive,
            dateAdded: slot.dateAdded
          } as Tool
        })

        lastSyncVersionRef.current = result.data.version
        setSyncState(prev => ({
          ...prev,
          lastSaved: result.data?.lastUpdated || null,
          hasUnsavedChanges: false,
          syncError: null
        }))

        return inventory
      } else if (result.isOffline) {
        debugService.warning('firebase', 'Offline - usando cache local')
        setSyncState(prev => ({
          ...prev,
          syncError: 'Offline - dados podem estar desatualizados'
        }))
        return null
      } else {
        debugService.info('firebase', 'Nenhum inventário encontrado - primeira vez')
        return null
      }
    } catch (error: any) {
      debugService.error('firebase', 'Erro ao carregar inventário', error)
      setSyncState(prev => ({
        ...prev,
        syncError: `Erro ao carregar: ${error.message}`
      }))
      return null
    }
  }

  // Salvar inventário no Firebase
  const saveToFirebase = async (inventorySlots: (Tool | null)[]): Promise<boolean> => {
    if (!user || isGuestMode || !isInitializedRef.current) {
      debugService.warning('firebase', 'Não pode salvar - usuário não autenticado ou modo convidado')
      return false
    }

    if (syncState.isSyncing) {
      debugService.info('firebase', 'Sincronização já em progresso, pulando')
      return false
    }

    setSyncState(prev => ({ ...prev, isSyncing: true, syncError: null }))

    try {
      debugService.info('firebase', 'Salvando inventário no Firestore', {
        itemCount: inventorySlots.filter(slot => slot !== null).length
      })

      const result: SaveResult = await firebaseInventoryService.saveInventory(inventorySlots)

      if (result.success) {
        debugService.success('firebase', 'Inventário salvo com sucesso')
        
        if (result.data) {
          lastSyncVersionRef.current = result.data.version
        }

        setSyncState(prev => ({
          ...prev,
          isSyncing: false,
          lastSaved: new Date().toISOString(),
          hasUnsavedChanges: false,
          syncError: null
        }))

        return true
      } else {
        throw new Error(result.error || 'Erro desconhecido ao salvar')
      }
    } catch (error: any) {
      debugService.error('firebase', 'Erro ao salvar inventário', error)
      
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        syncError: `Erro ao salvar: ${error.message}`
      }))

      return false
    }
  }

  // ========================= AUTO SAVE =========================

  // Programar auto-save
  const scheduleAutoSave = useCallback((inventorySlots: (Tool | null)[]) => {
    if (!enableAutoSave) return

    // Limpar timeout anterior
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    // Programar novo save em 2 segundos
    autoSaveTimeoutRef.current = setTimeout(() => {
      if (syncState.isOnline) {
        saveToFirebase(inventorySlots)
      }
    }, 2000)

    // Marcar como tendo mudanças não salvas
    setSyncState(prev => ({ ...prev, hasUnsavedChanges: true }))
  }, [enableAutoSave, syncState.isOnline])

  // ========================= PUBLIC METHODS =========================

  // Salvar inventário (público)
  const saveInventory = useCallback(async (inventorySlots: (Tool | null)[]): Promise<boolean> => {
    setCurrentInventory(inventorySlots)

    // Se auto-save está habilitado, programar save
    if (enableAutoSave) {
      scheduleAutoSave(inventorySlots)
      return true // Retorna true imediatamente para não bloquear UI
    } else {
      // Save imediato se auto-save desabilitado
      return await saveToFirebase(inventorySlots)
    }
  }, [enableAutoSave, scheduleAutoSave])

  // Carregar inventário (público)
  const loadInventory = useCallback(async (): Promise<(Tool | null)[] | null> => {
    return await loadInventoryFromFirebase()
  }, [])

  // Forçar save imediato
  const forceSave = useCallback(async (): Promise<boolean> => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    if (currentInventory.length > 0) {
      return await saveToFirebase(currentInventory)
    }

    return false
  }, [currentInventory])

  // Limpar erro de sincronização
  const clearSyncError = useCallback(() => {
    setSyncState(prev => ({ ...prev, syncError: null }))
  }, [])

  // ========================= RETURN =========================

  return {
    syncState,
    saveInventory,
    loadInventory,
    forceSave,
    clearSyncError,
    enableAutoSave,
    setEnableAutoSave
  }
}
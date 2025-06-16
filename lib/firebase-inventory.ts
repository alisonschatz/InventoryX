// lib/firebase-inventory.ts
import { getFirebaseFunctions, getFirebaseDb } from './firebase-client'

// ========================= INTERFACES =========================

export interface UserInventoryData {
  userId: string
  inventorySlots: (InventoryTool | null)[]
  lastUpdated: string
  version: number
}

export interface InventoryTool {
  id: string
  name: string
  icon: string
  category: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  slot: number
  description?: string
  isActive: boolean
  dateAdded: string
}

export interface LoadResult {
  success: boolean
  data: UserInventoryData | null
  error?: string
  isOffline?: boolean
}

export interface SaveResult {
  success: boolean
  data?: UserInventoryData
  error?: string
}

// Tipo genérico para outras operações
export interface SyncResult {
  success: boolean
  data?: UserInventoryData | null
  error?: string
  isOffline?: boolean
}

// ========================= FIREBASE INVENTORY SERVICE =========================

class FirebaseInventoryService {
  private db: any = null
  private userId: string | null = null
  private syncInProgress = false

  // Inicializar serviço
  async initialize(userId: string): Promise<boolean> {
    try {
      console.log('🔥 Inicializando Firebase Inventory Service para user:', userId)
      
      this.userId = userId
      this.db = getFirebaseDb()
      
      if (!this.db) {
        console.warn('⚠️ Firebase Firestore não disponível')
        return false
      }
      
      console.log('✅ Firebase Inventory Service inicializado')
      return true
    } catch (error) {
      console.error('❌ Erro ao inicializar Firebase Inventory Service:', error)
      return false
    }
  }

  // Salvar inventário no Firebase
  async saveInventory(inventorySlots: (any | null)[]): Promise<SaveResult> {
    if (!this.userId || !this.db || this.syncInProgress) {
      return { success: false, error: 'Serviço não inicializado ou sync em progresso' }
    }

    this.syncInProgress = true

    try {
      console.log('💾 Salvando inventário no Firebase...')

      const { doc, setDoc } = await getFirebaseFunctions()
      
      if (!doc || !setDoc) {
        throw new Error('Funções do Firestore não disponíveis')
      }

      // Converter slots para formato serializável
      const serializedSlots = inventorySlots.map(slot => 
        slot ? {
          id: slot.id,
          name: slot.name,
          icon: slot.icon,
          category: slot.category,
          rarity: slot.rarity,
          slot: slot.slot,
          description: slot.description,
          isActive: slot.isActive,
          dateAdded: slot.dateAdded || new Date().toISOString()
        } : null
      )

      const inventoryData: UserInventoryData = {
        userId: this.userId,
        inventorySlots: serializedSlots,
        lastUpdated: new Date().toISOString(),
        version: Date.now() // Para controle de versão
      }

      // Salvar no Firestore
      const userInventoryRef = doc(this.db, 'userInventories', this.userId)
      await setDoc(userInventoryRef, inventoryData, { merge: true })

      console.log('✅ Inventário salvo com sucesso no Firebase')
      
      return { 
        success: true, 
        data: inventoryData 
      }
      
    } catch (error: any) {
      console.error('❌ Erro ao salvar inventário:', error)
      
      return { 
        success: false, 
        error: error.message || 'Erro desconhecido ao salvar'
      }
    } finally {
      this.syncInProgress = false
    }
  }

  // Carregar inventário do Firebase
  async loadInventory(): Promise<LoadResult> {
    if (!this.userId || !this.db) {
      return { success: false, data: null, error: 'Serviço não inicializado' }
    }

    try {
      console.log('📥 Carregando inventário do Firebase...')

      const { doc, getDoc } = await getFirebaseFunctions()
      
      if (!doc || !getDoc) {
        throw new Error('Funções do Firestore não disponíveis')
      }

      const userInventoryRef = doc(this.db, 'userInventories', this.userId)
      const docSnap = await getDoc(userInventoryRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as UserInventoryData
        console.log('✅ Inventário carregado do Firebase:', {
          userId: data.userId,
          slotsCount: data.inventorySlots.length,
          lastUpdated: data.lastUpdated
        })
        
        return { 
          success: true, 
          data 
        }
      } else {
        console.log('📝 Nenhum inventário encontrado no Firebase - primeira vez')
        return { 
          success: true, 
          data: null 
        }
      }
      
    } catch (error: any) {
      console.error('❌ Erro ao carregar inventário:', error)
      
      return { 
        success: false, 
        data: null,
        error: error.message || 'Erro desconhecido ao carregar',
        isOffline: error.code === 'unavailable'
      }
    }
  }

  // Verificar se há conflitos (controle de versão simples)
  async checkForConflicts(localVersion: number): Promise<boolean> {
    try {
      const result = await this.loadInventory()
      
      if (result.success && result.data) {
        return result.data.version > localVersion
      }
      
      return false
    } catch (error) {
      console.error('❌ Erro ao verificar conflitos:', error)
      return false
    }
  }

  // Limpar dados do usuário (logout)
  cleanup(): void {
    console.log('🧹 Limpando Firebase Inventory Service')
    this.userId = null
    this.db = null
    this.syncInProgress = false
  }

  // Verificar se está online
  isOnline(): boolean {
    return typeof navigator !== 'undefined' && navigator.onLine
  }

  // Status do serviço
  getStatus() {
    return {
      initialized: !!this.userId && !!this.db,
      userId: this.userId,
      syncInProgress: this.syncInProgress,
      online: this.isOnline()
    }
  }
}

// ========================= SINGLETON INSTANCE =========================

export const firebaseInventoryService = new FirebaseInventoryService()

// ========================= UTILITY FUNCTIONS =========================

// Comparar dois inventários
export const compareInventories = (
  inventory1: (any | null)[], 
  inventory2: (any | null)[]
): boolean => {
  if (inventory1.length !== inventory2.length) return false
  
  for (let i = 0; i < inventory1.length; i++) {
    const slot1 = inventory1[i]
    const slot2 = inventory2[i]
    
    // Ambos null
    if (!slot1 && !slot2) continue
    
    // Um é null, outro não
    if (!slot1 || !slot2) return false
    
    // Comparar propriedades essenciais
    if (
      slot1.id !== slot2.id ||
      slot1.slot !== slot2.slot ||
      slot1.isActive !== slot2.isActive
    ) {
      return false
    }
  }
  
  return true
}

// Validar dados do inventário
export const validateInventoryData = (data: any): data is UserInventoryData => {
  if (!data || typeof data !== 'object') return false
  
  const required = ['userId', 'inventorySlots', 'lastUpdated', 'version']
  
  for (const field of required) {
    if (!(field in data)) return false
  }
  
  if (!Array.isArray(data.inventorySlots)) return false
  if (data.inventorySlots.length !== 48) return false // Verificar tamanho correto
  
  return true
}

// Mesclar inventários em caso de conflito
export const mergeInventories = (
  local: (any | null)[], 
  remote: (any | null)[]
): (any | null)[] => {
  console.log('🔄 Mesclando inventários...')
  
  const merged = new Array(48).fill(null)
  
  // Primeiro, adicionar todos os itens locais
  local.forEach((item, index) => {
    if (item) {
      merged[index] = item
    }
  })
  
  // Depois, adicionar itens remotos que não conflitam
  remote.forEach((item, index) => {
    if (item && !merged[index]) {
      merged[index] = item
    }
  })
  
  console.log('✅ Inventários mesclados')
  return merged
}

// Debug: Exportar dados do inventário
export const exportInventoryData = async (userId: string): Promise<string | null> => {
  try {
    await firebaseInventoryService.initialize(userId)
    const result = await firebaseInventoryService.loadInventory()
    
    if (result.success && result.data) {
      return JSON.stringify(result.data, null, 2)
    }
    
    return null
  } catch (error) {
    console.error('❌ Erro ao exportar dados:', error)
    return null
  }
}
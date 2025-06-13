// types/interfaces.ts
// Interfaces principais do sistema InventoryX

// ========================= TOOL INTERFACE =========================

export interface Tool {
  id: string
  name: string
  icon: string
  category: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  slot: number
  description?: string
  isActive?: boolean
  dateAdded?: string
}

// ========================= USER STATS =========================

export interface UserStats {
  level: number
  xp: number
  nextLevelXp: number
  streak: number
  totalTools?: number
  favoriteCategory?: string
}

// ========================= MUSIC TRACK =========================

export interface Track {
  id: number
  name: string
  artist: string
  duration: string
  url: string
  genre?: string
  isPlaying?: boolean
}

// ========================= DRAG & DROP =========================

export interface DraggedItem {
  item: Tool
  fromSlot: number
  dragStartTime?: number
}

// ========================= INVENTORY STATS =========================

export interface InventoryStats {
  totalSlots: number
  usedSlots: number
  emptySlots: number
  usagePercentage: number
  rarityCount: {
    common: number
    rare: number
    epic: number
    legendary: number
  }
  categoryCount: Record<string, number>
  categories: Array<[string, number]>
}

// ========================= INVENTORY SLOT =========================

export interface InventorySlot {
  index: number
  tool: Tool | null
  isEmpty: boolean
  isSelected: boolean
  isDragOver: boolean
}

// ========================= TOOL CATEGORY =========================

export interface ToolCategory {
  id: string
  name: string
  icon: string
  color: string
  description: string
  toolCount?: number
}

// ========================= ATMOSPHERE SETTINGS =========================

export interface AtmosphereSettings {
  isOpen: boolean
  currentTrack: Track | null
  isPlaying: boolean
  volume: number
  availableTracks: Track[]
}

// ========================= MODAL STATES =========================

export interface ModalStates {
  itemDetail: boolean
  itemManager: boolean
  userProfile: boolean
  settings: boolean
}

// ========================= VIEW MODES =========================

export type ViewMode = 'grid' | 'list'

// ========================= RARITY TYPES =========================

export type ToolRarity = 'common' | 'rare' | 'epic' | 'legendary'

// ========================= THEME TYPES =========================

export type ThemeMode = 'light' | 'dark' | 'system'

// ========================= NOTIFICATION =========================

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  isVisible: boolean
}
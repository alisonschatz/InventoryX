'use client'

import { Star, Settings, LayoutGrid, List, Package } from 'lucide-react'
import { UserStats } from '@/types/interfaces'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'

interface HeaderProps {
  userStats: UserStats
  toolsCount: number
  totalSlots: number
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
  atmosphereOpen: boolean
  setAtmosphereOpen: (open: boolean) => void
  currentTrack: any
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  onOpenItemManager: () => void
}

export default function Header(props: HeaderProps) {
  const {
    userStats,
    toolsCount,
    totalSlots,
    viewMode,
    setViewMode,
    atmosphereOpen,
    setAtmosphereOpen,
    currentTrack,
    isPlaying,
    setIsPlaying,
    onOpenItemManager
  } = props

  const xpProgress = (userStats.xp / userStats.nextLevelXp) * 100

  return (
    <header className="bg-theme-panel shadow-theme-light border-b border-theme-soft">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Seção Esquerda - Logo e XP */}
          <div className="flex items-center gap-6">
            {/* Logo e Título */}
            <div className="flex items-center gap-3">
              <img 
                src="/img/logo.png" 
                alt="InventoryX" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-theme-primary">
                  <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-cyan-500 bg-clip-text text-transparent">
                    InventoryX
                  </span>
                </h1>
                <p className="text-sm text-theme-secondary">
                  {toolsCount}/{totalSlots} slots ocupados
                </p>
              </div>
            </div>

            {/* Barra de XP */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-accent-contrast" />
                <span className="text-sm font-medium text-theme-primary">
                  Nível {userStats.level}
                </span>
              </div>
              <div className="w-32">
                <div className="flex justify-between text-xs text-theme-secondary mb-1">
                  <span>{userStats.xp}</span>
                  <span>{userStats.nextLevelXp}</span>
                </div>
                <div className="w-full bg-theme-hover rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 via-purple-600 to-cyan-500 h-2 rounded-full transition-all"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seção Direita - Controles */}
          <div className="flex items-center gap-3">
            
            {/* Controle de Atmosfera */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAtmosphereOpen(!atmosphereOpen)}
                className={`
                  px-3 py-2 rounded-xl transition-theme flex items-center gap-2
                  ${currentTrack 
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg' 
                    : 'bg-theme-panel hover:bg-theme-hover text-theme-primary border border-theme-soft'
                  }
                `}
              >
                <span>{isPlaying ? '🎵' : '🎶'}</span>
                <span className="text-sm font-medium">Atmosfera</span>
                {currentTrack && (
                  <span className="text-xs opacity-90 truncate max-w-20">
                    {currentTrack.name}
                  </span>
                )}
              </button>

              {currentTrack && (
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white rounded-full flex items-center justify-center transition-theme shadow-lg"
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
              )}
            </div>

            {/* Gerenciar Itens */}
            <button
              onClick={onOpenItemManager}
              className="px-3 py-2 bg-theme-panel hover:bg-theme-hover border border-theme-soft rounded-xl transition-theme flex items-center gap-2 text-theme-primary"
              title="Gerenciar Itens"
            >
              <Package className="w-4 h-4" />
              <span className="text-sm font-medium">Itens</span>
            </button>

            {/* Seletor de Visualização */}
            <div className="flex items-center bg-theme-panel rounded-xl p-1 border border-theme-soft">
              <button
                onClick={() => setViewMode('grid')}
                className={`
                  p-2 rounded-lg transition-theme
                  ${viewMode === 'grid' 
                    ? 'bg-purple-600 text-white' 
                    : 'hover:bg-theme-hover text-theme-secondary'
                  }
                `}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`
                  p-2 rounded-lg transition-theme
                  ${viewMode === 'list' 
                    ? 'bg-purple-600 text-white' 
                    : 'hover:bg-theme-hover text-theme-secondary'
                  }
                `}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Menu do Usuário */}
            <UserMenu />

            {/* Botão de Tema */}
            <ThemeToggle />

            {/* Configurações */}
            <button className="p-2 hover:bg-theme-hover rounded-xl transition-theme border border-theme-soft">
              <Settings className="w-5 h-5 text-theme-secondary" />
            </button>

          </div>
        </div>
      </div>
    </header>
  )
}
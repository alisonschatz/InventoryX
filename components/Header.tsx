'use client'

import { Star, LayoutGrid, List } from 'lucide-react'
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
}

export default function Header({
  userStats,
  toolsCount,
  totalSlots,
  viewMode,
  setViewMode,
  atmosphereOpen,
  setAtmosphereOpen,
  currentTrack,
  isPlaying,
  setIsPlaying
}: HeaderProps) {
  
  // Calcular progresso do XP
  const xpProgress = (userStats.xp / userStats.nextLevelXp) * 100

  // Handler para play/pause direto do header
  const handleQuickPlayPause = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    const audio = document.getElementById('atmosphere-persistent-audio') as HTMLAudioElement
    if (audio && currentTrack) {
      if (isPlaying) {
        audio.pause()
      } else {
        audio.play().catch(console.error)
      }
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <header className="bg-theme-panel shadow-theme-light border-b border-theme-soft sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* ==================== SEÇÃO ESQUERDA - BRAND & XP ==================== */}
          <div className="flex items-center gap-6">
            
            {/* Logo e Branding */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-700 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <img 
                  src="/img/logo.png" 
                  alt="InventoryX" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-cyan-500 bg-clip-text text-transparent">
                    InventoryX
                  </span>
                </h1>
                <p className="text-sm text-theme-secondary">
                  {toolsCount}/{totalSlots} ferramentas ativas
                </p>
              </div>
            </div>

            {/* Sistema de XP */}
            <div className="hidden lg:flex items-center gap-3 bg-theme-hover rounded-xl px-4 py-2 border border-theme-soft">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-accent-contrast" />
                <span className="text-sm font-bold text-theme-primary">
                  Nível {userStats.level}
                </span>
              </div>
              
              <div className="w-32">
                <div className="flex justify-between text-xs text-theme-secondary mb-1">
                  <span>{userStats.xp.toLocaleString()}</span>
                  <span>{userStats.nextLevelXp.toLocaleString()}</span>
                </div>
                <div className="w-full bg-theme-soft rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 via-purple-600 to-cyan-500 h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
              
              <div className="text-xs text-theme-secondary">
                {Math.round(xpProgress)}%
              </div>
            </div>
          </div>

          {/* ==================== SEÇÃO DIREITA - CONTROLES ==================== */}
          <div className="flex items-center gap-3">
            
            {/* ========== PLAYER DE MÚSICA ========== */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAtmosphereOpen(!atmosphereOpen)}
                className={`
                  relative px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 group
                  ${currentTrack 
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md hover:shadow-lg' 
                    : 'bg-theme-hover hover:bg-theme-soft text-theme-primary border border-theme-soft hover:border-purple-300'
                  }
                `}
                title="Player de música ambiente"
              >
                {/* Visualizador de áudio */}
                <div className="relative">
                  {isPlaying && currentTrack ? (
                    <div className="flex items-center gap-0.5">
                      <div className={`w-1 h-3 rounded-full animate-pulse ${currentTrack ? 'bg-white' : 'bg-purple-500'}`}></div>
                      <div className={`w-1 h-4 rounded-full animate-pulse ${currentTrack ? 'bg-white' : 'bg-purple-500'}`} style={{ animationDelay: '0.1s' }}></div>
                      <div className={`w-1 h-2 rounded-full animate-pulse ${currentTrack ? 'bg-white' : 'bg-purple-500'}`} style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  ) : (
                    <svg className={`w-4 h-4 ${currentTrack ? 'text-white' : 'text-purple-500'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.785l-4-3.143A1 1 0 014 13V7a1 1 0 01.383-.924l4-3.143a1 1 0 011.234.143zM16 5.5a1 1 0 01-1 1 .5.5 0 000 1 1 1 0 011 1 3.5 3.5 0 000-7zM15 8.5a.5.5 0 01-.5-.5 2.5 2.5 0 000 5 .5.5 0 01.5-.5 1 1 0 000-2 1 1 0 000-2z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                <span className="hidden sm:block text-sm font-medium">
                  {currentTrack ? 'Música' : 'Atmosfera'}
                </span>

                {/* Indicador de track ativa */}
                {currentTrack && (
                  <div className="hidden md:block text-xs opacity-90 truncate max-w-20 bg-black/10 px-2 py-0.5 rounded-full">
                    {currentTrack.name.split(' ')[0]}
                  </div>
                )}

                {/* Indicador de painel aberto */}
                {atmosphereOpen && (
                  <div className={`w-1.5 h-1.5 rounded-full ${currentTrack ? 'bg-white' : 'bg-purple-500'}`}></div>
                )}
              </button>

              {/* Controle rápido de play/pause */}
              {currentTrack && (
                <button
                  onClick={handleQuickPlayPause}
                  className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg hover:scale-105"
                  title={isPlaying ? 'Pausar música' : 'Tocar música'}
                >
                  {isPlaying ? (
                    <div className="flex gap-0.5">
                      <div className="w-0.5 h-2.5 bg-white rounded-full"></div>
                      <div className="w-0.5 h-2.5 bg-white rounded-full"></div>
                    </div>
                  ) : (
                    <div className="w-0 h-0 border-l-[4px] border-l-white border-y-[2.5px] border-y-transparent ml-0.5"></div>
                  )}
                </button>
              )}
            </div>

            {/* Separador */}
            <div className="w-px h-8 bg-theme-soft hidden md:block"></div>

            {/* ========== SELETOR DE VISUALIZAÇÃO ========== */}
            <div className="flex items-center bg-theme-hover rounded-xl p-1 border border-theme-soft shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`
                  p-2 rounded-lg transition-all duration-200 group
                  ${viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-sm' 
                    : 'hover:bg-theme-soft text-theme-secondary hover:text-theme-primary'
                  }
                `}
                title="Visualização em grade"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`
                  p-2 rounded-lg transition-all duration-200 group
                  ${viewMode === 'list' 
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-sm' 
                    : 'hover:bg-theme-soft text-theme-secondary hover:text-theme-primary'
                  }
                `}
                title="Visualização em lista"  
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Separador */}
            <div className="w-px h-8 bg-theme-soft hidden md:block"></div>

            {/* ========== CONTROLES DE USUÁRIO ========== */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
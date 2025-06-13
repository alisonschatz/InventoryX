'use client'

import { Star, LayoutGrid, List, Volume2, VolumeX, Settings, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { UserStats, ViewMode } from '@/types/interfaces'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'

interface HeaderProps {
  userStats: UserStats
  toolsCount: number
  totalSlots: number
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
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
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="bg-theme-panel shadow-theme-light border-b border-theme-soft sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        
        {/* ===================== MOBILE HEADER ===================== */}
        <div className="flex items-center justify-between px-3 py-3 md:hidden">
          
          {/* Logo compacto */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 via-purple-700 to-cyan-500 rounded-lg flex items-center justify-center">
              <img 
                src="/img/logo.png" 
                alt="InventoryX" 
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold">
                <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-cyan-500 bg-clip-text text-transparent">
                  InventoryX
                </span>
              </h1>
            </div>
          </div>

          {/* Controles direita mobile */}
          <div className="flex items-center gap-2">
            
            {/* Player compacto */}
            {currentTrack && (
              <button
                onClick={handleQuickPlayPause}
                className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-full flex items-center justify-center transition-all"
                title={isPlaying ? 'Pausar música' : 'Tocar música'}
              >
                {isPlaying ? (
                  <div className="flex gap-0.5">
                    <div className="w-0.5 h-2 bg-white rounded-full"></div>
                    <div className="w-0.5 h-2 bg-white rounded-full"></div>
                  </div>
                ) : (
                  <div className="w-0 h-0 border-l-[3px] border-l-white border-y-[2px] border-y-transparent ml-0.5"></div>
                )}
              </button>
            )}

            {/* Menu hamburger */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-hover rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ===================== MOBILE MENU ===================== */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-theme-soft bg-theme-panel">
            <div className="px-3 py-4 space-y-4">
              
              {/* Status do usuário */}
              <div className="flex items-center gap-3 p-3 bg-theme-hover rounded-lg">
                <Star className="w-4 h-4 text-yellow-500" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-theme-primary">
                    Nível {userStats.level}
                  </div>
                  <div className="text-xs text-theme-secondary">
                    {userStats.xp.toLocaleString()} / {userStats.nextLevelXp.toLocaleString()} XP
                  </div>
                  <div className="w-full bg-theme-soft rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Inventário status */}
              <div className="flex items-center justify-between p-3 bg-theme-hover rounded-lg">
                <div>
                  <div className="text-sm font-medium text-theme-primary">
                    {toolsCount}/{totalSlots} ferramentas
                  </div>
                  <div className="text-xs text-theme-secondary">
                    {Math.round((toolsCount / totalSlots) * 100)}% utilizado
                  </div>
                </div>
                <div className="w-12 h-2 bg-theme-soft rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{ width: `${(toolsCount / totalSlots) * 100}%` }}
                  />
                </div>
              </div>

              {/* Seletor de visualização */}
              <div>
                <div className="text-xs font-medium text-theme-secondary uppercase tracking-wide mb-2">
                  Visualização
                </div>
                <div className="flex bg-theme-hover rounded-lg p-1">
                  <button
                    onClick={() => {
                      setViewMode('grid')
                      setMobileMenuOpen(false)
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white' 
                        : 'text-theme-secondary'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span className="text-sm">Grade</span>
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('list')
                      setMobileMenuOpen(false)
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${
                      viewMode === 'list' 
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white' 
                        : 'text-theme-secondary'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    <span className="text-sm">Lista</span>
                  </button>
                </div>
              </div>

              {/* Player de música */}
              <div>
                <div className="text-xs font-medium text-theme-secondary uppercase tracking-wide mb-2">
                  Música
                </div>
                <button
                  onClick={() => {
                    setAtmosphereOpen(!atmosphereOpen)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    currentTrack 
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white' 
                      : 'bg-theme-hover text-theme-primary hover:bg-theme-soft'
                  }`}
                >
                  {isPlaying && currentTrack ? (
                    <div className="flex items-center gap-0.5">
                      <div className={`w-1 h-3 rounded-full animate-pulse ${currentTrack ? 'bg-white' : 'bg-purple-500'}`}></div>
                      <div className={`w-1 h-4 rounded-full animate-pulse ${currentTrack ? 'bg-white' : 'bg-purple-500'}`} style={{ animationDelay: '0.1s' }}></div>
                      <div className={`w-1 h-2 rounded-full animate-pulse ${currentTrack ? 'bg-white' : 'bg-purple-500'}`} style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">
                      {currentTrack ? 'Player Ativo' : 'Atmosfera Musical'}
                    </div>
                    {currentTrack && (
                      <div className="text-xs opacity-90">
                        {currentTrack.name}
                      </div>
                    )}
                  </div>
                  {atmosphereOpen && (
                    <div className="w-2 h-2 bg-current rounded-full"></div>
                  )}
                </button>
              </div>

              {/* Controles do usuário */}
              <div className="flex items-center justify-between pt-2 border-t border-theme-soft">
                <ThemeToggle />
                <UserMenu />
              </div>
            </div>
          </div>
        )}

        {/* ===================== DESKTOP HEADER ===================== */}
        <div className="hidden md:flex items-center justify-between px-4 py-4">
          
          {/* ========== SEÇÃO ESQUERDA - BRAND & XP ========== */}
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
                <Star className="w-4 h-4 text-yellow-500" />
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

          {/* ========== SEÇÃO DIREITA - CONTROLES ========== */}
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
                    <Volume2 className="w-4 h-4" />
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
            <div className="w-px h-8 bg-theme-soft hidden lg:block"></div>

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
            <div className="w-px h-8 bg-theme-soft hidden lg:block"></div>

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
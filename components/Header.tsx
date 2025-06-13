'use client'

import { Star, LayoutGrid, List, Package } from 'lucide-react'
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
            <div className="hidden lg:flex items-center gap-3">
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
          <div className="flex items-center gap-2">
            
            {/* Botão de Atmosfera Elegante e Compacto */}
            <div className="flex items-center">
              <button
                onClick={() => setAtmosphereOpen(!atmosphereOpen)}
                className={`relative px-3 py-2 rounded-xl transition-all flex items-center gap-2 group ${
                  currentTrack 
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md' 
                    : 'bg-theme-panel hover:bg-theme-hover text-theme-primary border border-theme-soft hover:border-purple-300'
                }`}
                title="Player de música ambiente"
              >
                {/* Ícone Musical Elegante */}
                <div className="relative">
                  {isPlaying ? (
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
                  {currentTrack ? 'Tocando' : 'Atmosfera'}
                </span>

                {/* Indicador de Track Atual */}
                {currentTrack && (
                  <div className="hidden md:block text-xs opacity-90 truncate max-w-24 bg-black/10 px-2 py-0.5 rounded-full">
                    {currentTrack.name.split(' ')[0]}
                  </div>
                )}

                {/* Indicador de Painel Aberto */}
                {atmosphereOpen && (
                  <div className={`w-1 h-1 rounded-full ${currentTrack ? 'bg-white' : 'bg-purple-500'}`}></div>
                )}
              </button>

              {/* Quick Play/Pause (apenas quando tem música) */}
              {currentTrack && (
                <button
                  onClick={(e) => {
                    e.stopPropagation() // Evita conflito com o botão principal
                    console.log('🎵 Header: Toggle play/pause', { isPlaying, currentTrack: currentTrack?.name })
                    
                    // Tentar acessar o áudio persistente diretamente
                    const audio = document.getElementById('atmosphere-persistent-audio') as HTMLAudioElement
                    if (audio) {
                      if (isPlaying) {
                        audio.pause()
                        console.log('⏸️ Header: Pausando áudio')
                      } else {
                        audio.play().then(() => {
                          console.log('▶️ Header: Tocando áudio')
                        }).catch((err) => {
                          console.error('❌ Header: Erro ao tocar:', err)
                        })
                      }
                    } else {
                      console.error('❌ Header: Áudio persistente não encontrado')
                      // Fallback para a função do hook
                      setIsPlaying(!isPlaying)
                    }
                  }}
                  className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white rounded-full flex items-center justify-center transition-all shadow-md ml-1"
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

            {/* Gerenciar Itens */}
            <button
              onClick={onOpenItemManager}
              className="px-3 py-2 bg-theme-panel hover:bg-theme-hover border border-theme-soft rounded-xl transition-theme flex items-center gap-2 text-theme-primary"
              title="Gerenciar itens do inventário"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:block text-sm font-medium">Itens</span>
            </button>

            {/* Seletor de Visualização */}
            <div className="flex items-center bg-theme-panel rounded-xl p-1 border border-theme-soft">
              <button
                onClick={() => setViewMode('grid')}
                className={`
                  p-2 rounded-lg transition-theme
                  ${viewMode === 'grid' 
                    ? 'bg-purple-600 text-white shadow-sm' 
                    : 'hover:bg-theme-hover text-theme-secondary'
                  }
                `}
                title="Visualização em grade"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`
                  p-2 rounded-lg transition-theme
                  ${viewMode === 'list' 
                    ? 'bg-purple-600 text-white shadow-sm' 
                    : 'hover:bg-theme-hover text-theme-secondary'
                  }
                `}
                title="Visualização em lista"  
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Separador */}
            <div className="w-px h-8 bg-theme-soft hidden md:block"></div>

            {/* Botão de Tema */}
            <ThemeToggle />

            {/* Menu do Usuário */}
            <UserMenu />

          </div>
        </div>
      </div>
    </header>
  )
}
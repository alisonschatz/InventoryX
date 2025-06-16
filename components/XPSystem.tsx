'use client'

import { Star } from 'lucide-react'
import { UserStats } from '@/types/interfaces'

interface XPSystemProps {
  userStats: UserStats
  className?: string
}

export default function XPSystem({ userStats, className = '' }: XPSystemProps) {
  // Calcular progresso do XP
  const xpProgress = (userStats.xp / userStats.nextLevelXp) * 100
  
  // Calcular XP restante para próximo nível
  const xpRemaining = userStats.nextLevelXp - userStats.xp
  
  // Determinar cor da barra baseado no progresso
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-500 via-green-600 to-emerald-500'
    if (progress >= 50) return 'from-purple-500 via-purple-600 to-cyan-500'
    if (progress >= 25) return 'from-blue-500 via-blue-600 to-cyan-500'
    return 'from-gray-500 via-gray-600 to-slate-500'
  }

  // Determinar badge baseado no progresso
  const getProgressBadge = (progress: number) => {
    if (progress >= 95) return '🚀 Quase lá!'
    if (progress >= 80) return '🔥 Focado'
    if (progress >= 50) return '⚡ Progresso'
    if (progress >= 25) return '📈 Crescendo'
    return '🌱 Começando'
  }

  return (
    <div className={`mb-6 ${className}`}>
      <div className="max-w-5xl mx-auto bg-theme-panel rounded-xl border border-theme-soft shadow-theme-light p-3 md:p-4">
        
        {/* Layout Mobile (Vertical) */}
        <div className="md:hidden space-y-3">
          
          {/* Header Mobile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg">
                <Star className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-theme-primary">
                  Nível {userStats.level}
                </div>
                <div className="text-xs text-theme-secondary">
                  {xpRemaining.toLocaleString()} XP restantes
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-theme-primary">
                {Math.round(xpProgress)}%
              </div>
              <div className="text-xs px-2 py-1 bg-theme-hover rounded-full text-theme-secondary">
                {getProgressBadge(xpProgress).split(' ')[0]}
              </div>
            </div>
          </div>

          {/* Barra de Progresso Mobile */}
          <div>
            <div className="flex justify-between text-xs text-theme-secondary mb-1">
              <span>{userStats.xp.toLocaleString()} XP</span>
              <span>{userStats.nextLevelXp.toLocaleString()} XP</span>
            </div>
            <div className="relative w-full bg-theme-hover rounded-full h-2.5 overflow-hidden">
              <div 
                className={`bg-gradient-to-r ${getProgressColor(xpProgress)} h-full rounded-full transition-all duration-700 ease-out relative`}
                style={{ width: `${Math.min(xpProgress, 100)}%` }}
              >
                {/* Efeito de brilho na barra */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Layout Desktop (Horizontal) */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Ícone de nível com informações */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2.5 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              {/* Badge de nível */}
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                {userStats.level}
              </div>
            </div>
            <div>
              <div className="text-base font-bold text-theme-primary">
                Nível {userStats.level}
              </div>
              <div className="text-xs text-theme-secondary">
                {xpRemaining.toLocaleString()} XP para o próximo nível
              </div>
            </div>
          </div>

          {/* Barra de progresso expandida */}
          <div className="flex-1 mx-6">
            <div className="flex justify-between text-xs text-theme-secondary mb-2">
              <span className="font-medium">{userStats.xp.toLocaleString()} XP</span>
              <span className="font-medium">{userStats.nextLevelXp.toLocaleString()} XP</span>
            </div>
            <div className="relative w-full bg-theme-hover rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className={`bg-gradient-to-r ${getProgressColor(xpProgress)} h-full rounded-full transition-all duration-700 ease-out relative`}
                style={{ width: `${Math.min(xpProgress, 100)}%` }}
              >
                {/* Efeito de brilho animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                
                {/* Marcador de progresso */}
                {xpProgress > 10 && (
                  <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                )}
              </div>
            </div>
            
            {/* Milestones visuais */}
            <div className="flex justify-between mt-1">
              {[25, 50, 75].map((milestone) => (
                <div 
                  key={milestone}
                  className={`w-1 h-1 rounded-full transition-colors ${
                    xpProgress >= milestone ? 'bg-yellow-500' : 'bg-theme-soft'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Status e estatísticas */}
          <div className="text-right flex flex-col items-end gap-1">
            <div className="text-lg font-bold text-theme-primary">
              {Math.round(xpProgress)}%
            </div>
            <div className="text-xs px-2 py-1 bg-gradient-to-r from-theme-hover to-theme-soft rounded-full text-theme-secondary border border-theme-soft">
              {getProgressBadge(xpProgress)}
            </div>
            {userStats.streak > 0 && (
              <div className="text-xs text-theme-secondary flex items-center gap-1">
                <span>🔥</span>
                <span>{userStats.streak} dias</span>
              </div>
            )}
          </div>
        </div>

        {/* Informações adicionais (ambos layouts) */}
        <div className="mt-3 pt-3 border-t border-theme-soft/50 flex justify-between items-center text-xs">
          <div className="flex items-center gap-4 text-theme-secondary">
            <span>Streak: {userStats.streak} dias</span>
            <span>Total: {userStats.totalTools || 0} ferramentas</span>
          </div>
          <div className="text-theme-secondary">
            {userStats.favoriteCategory && (
              <span>📊 Categoria favorita: {userStats.favoriteCategory}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
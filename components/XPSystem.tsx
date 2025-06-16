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
  
  // Determinar cor da barra baseado no progresso (mais sutis)
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-emerald-400 to-emerald-500'
    if (progress >= 50) return 'from-blue-400 to-blue-500'
    if (progress >= 25) return 'from-purple-400 to-purple-500'
    return 'from-gray-400 to-gray-500'
  }

  // Determinar badge baseado no progresso (mais discreto)
  const getProgressBadge = (progress: number) => {
    if (progress >= 95) return '🔥'
    if (progress >= 80) return '⚡'
    if (progress >= 50) return '📈'
    if (progress >= 25) return '🌱'
    return '💫'
  }

  return (
    <div className={`mb-6 ${className}`}>
      {/* Usar a mesma estrutura do inventário mas muito mais compacto */}
      <div className="bg-theme-panel rounded-xl border border-theme-soft shadow-theme-light p-3 lg:p-4">
        
        {/* Layout Mobile (Ultra Compacto) */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg">
                <Star className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-theme-primary">
                  Nível {userStats.level}
                </div>
                <div className="text-xs text-theme-secondary">
                  {xpRemaining.toLocaleString()} XP restantes
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-theme-primary">
                {Math.round(xpProgress)}%
              </div>
            </div>
          </div>

          {/* Barra de Progresso Mobile - Uma linha só */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-theme-secondary mb-1">
              <span>{userStats.xp.toLocaleString()}</span>
              <span>{userStats.nextLevelXp.toLocaleString()}</span>
            </div>
            <div className="relative w-full bg-theme-hover rounded-full h-1.5 overflow-hidden">
              <div 
                className={`bg-gradient-to-r ${getProgressColor(xpProgress)} h-full rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${Math.min(xpProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Layout Desktop (Uma linha horizontal só) */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Ícone e nível compactos */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="p-1.5 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              {/* Badge de nível pequeno */}
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-1 py-0.5 rounded-full shadow-sm">
                {userStats.level}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-theme-primary">
                Nível {userStats.level}
              </div>
            </div>
          </div>

          {/* Barra de progresso inline */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs text-theme-secondary font-medium whitespace-nowrap">
              {userStats.xp.toLocaleString()} XP
            </span>
            <div className="relative flex-1 bg-theme-hover rounded-full h-2 overflow-hidden">
              <div 
                className={`bg-gradient-to-r ${getProgressColor(xpProgress)} h-full rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${Math.min(xpProgress, 100)}%` }}
              >
                {/* Efeito de brilho sutil */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
            <span className="text-xs text-theme-secondary font-medium whitespace-nowrap">
              {userStats.nextLevelXp.toLocaleString()} XP
            </span>
          </div>

          {/* Progresso e restante inline */}
          <div className="flex items-center gap-3 text-xs text-theme-secondary">
            <span className="font-bold text-theme-primary">
              {Math.round(xpProgress)}%
            </span>
            <span className="whitespace-nowrap">
              {xpRemaining.toLocaleString()} restantes
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
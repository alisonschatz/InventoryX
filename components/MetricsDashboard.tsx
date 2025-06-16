'use client'

import React from 'react'
import { 
  BarChart3,
  Zap,
  Settings,
  LucideIcon
} from 'lucide-react'
import { UserStats } from '@/types/interfaces'

interface MetricsDashboardProps {
  userStats: UserStats
  utilizationData: {
    used: number
    total: number
    free: number
    percentage: number
  }
  className?: string
}

interface MetricCardProps {
  IconComponent: LucideIcon
  title: string
  value: string | number
  subtitle: string
  colorClasses: string
  progress?: number
  badge?: string
}

const MetricCard: React.FC<MetricCardProps> = ({
  IconComponent,
  title,
  value,
  subtitle,
  colorClasses,
  progress,
  badge
}) => (
  <div className="bg-theme-panel rounded-xl p-4 lg:p-5 border border-theme-soft shadow-theme-light hover:shadow-theme-medium transition-all duration-300 group cursor-default">
    {/* Header com ícone e badge */}
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2.5 rounded-lg ${colorClasses}`}>
        <IconComponent className="w-4 h-4 lg:w-5 lg:h-5" />
      </div>
      {badge && (
        <span className="text-xs font-medium text-theme-secondary bg-theme-hover px-2 py-1 rounded-full border border-theme-soft">
          {badge}
        </span>
      )}
    </div>

    {/* Conteúdo principal */}
    <div className="space-y-2">
      <h3 className="text-xs lg:text-sm font-medium text-theme-secondary uppercase tracking-wide">
        {title}
      </h3>
      
      <div className="text-xl lg:text-2xl font-bold text-theme-primary group-hover:scale-105 transition-transform">
        {value}
      </div>
      
      {/* Barra de progresso opcional */}
      {typeof progress === 'number' && (
        <div className="w-full bg-theme-hover rounded-full h-2 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-current to-current opacity-80"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
      
      {/* Subtítulo */}
      <p className="text-xs text-theme-secondary leading-relaxed">
        {subtitle}
      </p>
    </div>
  </div>
)

export default function MetricsDashboard({ 
  userStats, 
  utilizationData, 
  className = '' 
}: MetricsDashboardProps) {
  
  // Gerar dados dinâmicos para produtividade
  const generateProductivityData = () => {
    const baseXP = 15
    const bonusXP = Math.floor(Math.random() * 45)
    const totalXP = baseXP + bonusXP
    
    return {
      xp: totalXP,
      streakProgress: Math.min((userStats.streak / 7) * 100, 100),
      badge: userStats.streak >= 7 ? '🔥 Fire!' : '⚡ Ativo'
    }
  }

  // Gerar dados dinâmicos para tempo ativo
  const generateActiveTimeData = () => {
    const hours = Math.floor(2 + Math.random() * 6)
    const minutes = Math.floor(Math.random() * 60)
    const lastActivity = Math.floor(Math.random() * 30 + 5)
    const progressBase = 60
    const progressBonus = Math.random() * 40
    
    return {
      timeDisplay: `${hours}h ${minutes}m`,
      lastActivity: `há ${lastActivity} minutos`,
      progress: Math.min(progressBase + progressBonus, 100),
      badge: '⏰ Online'
    }
  }

  // Calcular dados para utilização
  const getUtilizationData = () => {
    const freePercentage = ((utilizationData.free / utilizationData.total) * 100).toFixed(1)
    
    return {
      display: `${utilizationData.used}/${utilizationData.total}`,
      subtitle: `${utilizationData.free} slots livres • ${freePercentage}% de capacidade disponível`,
      progress: utilizationData.percentage,
      badge: `${utilizationData.percentage}%`
    }
  }

  // Gerar todos os dados
  const productivityData = generateProductivityData()
  const activeTimeData = generateActiveTimeData()
  const utilization = getUtilizationData()

  return (
    <section className={`mb-6 lg:mb-8 ${className}`} aria-label="Métricas do inventário">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        
        {/* Card: Utilização do Inventário */}
        <MetricCard
          IconComponent={BarChart3}
          title="Utilização do Inventário"
          value={utilization.display}
          subtitle={utilization.subtitle}
          colorClasses="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-600"
          progress={utilization.progress}
          badge={utilization.badge}
        />

        {/* Card: Produtividade Hoje */}
        <MetricCard
          IconComponent={Zap}
          title="Produtividade Hoje"
          value={`+${productivityData.xp} XP`}
          subtitle={`Streak de ${userStats.streak} dias • Meta diária atingida`}
          colorClasses="bg-gradient-to-br from-green-500/10 to-emerald-500/10 text-green-600"
          progress={productivityData.streakProgress}
          badge={productivityData.badge}
        />

        {/* Card: Tempo Ativo Hoje */}
        <MetricCard
          IconComponent={Settings}
          title="Tempo Ativo Hoje"
          value={activeTimeData.timeDisplay}
          subtitle={`Última ferramenta usada ${activeTimeData.lastActivity}`}
          colorClasses="bg-gradient-to-br from-purple-500/10 to-pink-500/10 text-purple-600"
          progress={activeTimeData.progress}
          badge={activeTimeData.badge}
        />
      </div>
    </section>
  )
}
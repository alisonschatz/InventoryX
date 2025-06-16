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
  <div className="bg-theme-panel rounded-lg p-3 border border-theme-soft shadow-sm hover:shadow-md transition-all duration-300 group cursor-default">
    {/* Layout horizontal compacto */}
    <div className="flex items-center justify-between">
      
      {/* Ícone e valor em linha */}
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-md ${colorClasses}`}>
          <IconComponent className="w-4 h-4" />
        </div>
        <div>
          <div className="text-lg font-bold text-theme-primary group-hover:scale-105 transition-transform">
            {value}
          </div>
          <div className="text-xs text-theme-secondary uppercase tracking-wide">
            {title}
          </div>
        </div>
      </div>

      {/* Badge e progresso */}
      <div className="flex items-center gap-2">
        {badge && (
          <span className="text-xs font-medium text-theme-secondary bg-theme-hover px-2 py-1 rounded-full border border-theme-soft">
            {badge}
          </span>
        )}
        
        {/* Barra de progresso vertical pequena */}
        {typeof progress === 'number' && (
          <div className="w-1 h-8 bg-theme-hover rounded-full overflow-hidden">
            <div 
              className="w-full rounded-full transition-all duration-700 ease-out bg-gradient-to-t from-current to-current opacity-60"
              style={{ 
                height: `${Math.min(progress, 100)}%`,
                marginTop: `${100 - Math.min(progress, 100)}%`
              }}
            />
          </div>
        )}
      </div>
    </div>

    {/* Subtítulo compacto */}
    <p className="text-xs text-theme-secondary leading-relaxed mt-1 line-clamp-1">
      {subtitle}
    </p>
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
      badge: userStats.streak >= 7 ? '🔥' : '⚡'
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
      lastActivity: `há ${lastActivity}min`,
      progress: Math.min(progressBase + progressBonus, 100),
      badge: '⏰'
    }
  }

  // Calcular dados para utilização
  const getUtilizationData = () => {
    const freePercentage = ((utilizationData.free / utilizationData.total) * 100).toFixed(1)
    
    return {
      display: `${utilizationData.used}/${utilizationData.total}`,
      subtitle: `${utilizationData.free} slots livres • ${freePercentage}% disponível`,
      progress: utilizationData.percentage,
      badge: `${utilizationData.percentage}%`
    }
  }

  // Gerar todos os dados
  const productivityData = generateProductivityData()
  const activeTimeData = generateActiveTimeData()
  const utilization = getUtilizationData()

  return (
    <section className={`mb-6 ${className}`} aria-label="Métricas do inventário">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
        
        {/* Card: Utilização do Inventário */}
        <MetricCard
          IconComponent={BarChart3}
          title="Utilização"
          value={utilization.display}
          subtitle={utilization.subtitle}
          colorClasses="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-600"
          progress={utilization.progress}
          badge={utilization.badge}
        />

        {/* Card: Produtividade Hoje */}
        <MetricCard
          IconComponent={Zap}
          title="Produtividade"
          value={`+${productivityData.xp} XP`}
          subtitle={`Streak ${userStats.streak} dias • Meta atingida`}
          colorClasses="bg-gradient-to-br from-green-500/10 to-emerald-500/10 text-green-600"
          progress={productivityData.streakProgress}
          badge={productivityData.badge}
        />

        {/* Card: Tempo Ativo Hoje */}
        <MetricCard
          IconComponent={Settings}
          title="Tempo Ativo"
          value={activeTimeData.timeDisplay}
          subtitle={`Última atividade ${activeTimeData.lastActivity}`}
          colorClasses="bg-gradient-to-br from-purple-500/10 to-pink-500/10 text-purple-600"
          progress={activeTimeData.progress}
          badge={activeTimeData.badge}
        />
      </div>
    </section>
  )
}
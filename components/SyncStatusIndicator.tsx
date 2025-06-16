'use client'

import React from 'react'
import { Cloud, CloudOff, Wifi, WifiOff, Save, AlertCircle, CheckCircle, Loader2, X } from 'lucide-react'

interface SyncStatusProps {
  syncState: {
    isSyncing: boolean
    lastSaved: string | null
    hasUnsavedChanges: boolean
    isOnline: boolean
    syncError: string | null
  }
  onManualSave?: () => Promise<boolean>
  onClearError?: () => void
  enableAutoSave: boolean
  onToggleAutoSave?: (enabled: boolean) => void
  className?: string
}

export default function SyncStatusIndicator({
  syncState,
  onManualSave,
  onClearError,
  enableAutoSave,
  onToggleAutoSave,
  className = ''
}: SyncStatusProps) {
  const { isSyncing, lastSaved, hasUnsavedChanges, isOnline, syncError } = syncState

  // Determinar estado visual
  const getStatusInfo = () => {
    if (syncError) {
      return {
        icon: AlertCircle,
        color: 'text-red-500',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        message: 'Erro na sincronização',
        details: syncError
      }
    }

    if (!isOnline) {
      return {
        icon: WifiOff,
        color: 'text-orange-500',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        borderColor: 'border-orange-200 dark:border-orange-800',
        message: 'Offline',
        details: 'Mudanças serão salvas quando conectar'
      }
    }

    if (isSyncing) {
      return {
        icon: Loader2,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        message: 'Sincronizando...',
        details: 'Salvando no servidor'
      }
    }

    if (hasUnsavedChanges) {
      return {
        icon: Save,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        message: 'Mudanças não salvas',
        details: enableAutoSave ? 'Salvamento automático em breve' : 'Clique para salvar'
      }
    }

    return {
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      message: 'Sincronizado',
      details: lastSaved ? `Salvo em ${formatTime(lastSaved)}` : 'Tudo em dia'
    }
  }

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString)
      const now = new Date()
      const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

      if (diffMinutes < 1) return 'agora mesmo'
      if (diffMinutes < 60) return `${diffMinutes}min atrás`
      
      const diffHours = Math.floor(diffMinutes / 60)
      if (diffHours < 24) return `${diffHours}h atrás`
      
      return date.toLocaleDateString('pt-BR')
    } catch {
      return 'há pouco'
    }
  }

  const handleManualSave = async () => {
    if (onManualSave && !isSyncing) {
      try {
        await onManualSave()
      } catch (error) {
        console.error('Erro no salvamento manual:', error)
      }
    }
  }

  const statusInfo = getStatusInfo()
  const IconComponent = statusInfo.icon

  return (
    <div className={`${className}`}>
      
      {/* Indicador Compacto */}
      <div className={`
        flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200
        ${statusInfo.bgColor} ${statusInfo.borderColor}
      `}>
        
        {/* Ícone com animação */}
        <div className="relative">
          <IconComponent 
            className={`w-4 h-4 ${statusInfo.color} ${
              isSyncing ? 'animate-spin' : ''
            }`} 
          />
          
          {/* Indicador de conexão */}
          <div className="absolute -bottom-1 -right-1">
            {isOnline ? (
              <Wifi className="w-2 h-2 text-green-500" />
            ) : (
              <WifiOff className="w-2 h-2 text-red-500" />
            )}
          </div>
        </div>

        {/* Status e detalhes */}
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium ${statusInfo.color}`}>
            {statusInfo.message}
          </div>
          <div className="text-xs text-theme-secondary truncate">
            {statusInfo.details}
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-1">
          
          {/* Botão de save manual */}
          {(hasUnsavedChanges || syncError) && !isSyncing && (
            <button
              onClick={handleManualSave}
              className="p-1.5 hover:bg-white/50 dark:hover:bg-black/20 rounded transition-colors"
              title="Salvar agora"
            >
              <Save className="w-3 h-3 text-theme-secondary hover:text-theme-primary" />
            </button>
          )}

          {/* Toggle auto-save */}
          {onToggleAutoSave && (
            <button
              onClick={() => onToggleAutoSave(!enableAutoSave)}
              className={`p-1.5 rounded transition-colors ${
                enableAutoSave 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}
              title={enableAutoSave ? 'Auto-save ativo' : 'Auto-save desativo'}
            >
              <Cloud className="w-3 h-3" />
            </button>
          )}

          {/* Limpar erro */}
          {syncError && onClearError && (
            <button
              onClick={onClearError}
              className="p-1.5 hover:bg-white/50 dark:hover:bg-black/20 rounded transition-colors"
              title="Limpar erro"
            >
              <X className="w-3 h-3 text-theme-secondary hover:text-theme-primary" />
            </button>
          )}
        </div>
      </div>

      {/* Toast de erro expandido */}
      {syncError && (
        <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">
                Erro na Sincronização
              </div>
              <div className="text-xs text-red-600 dark:text-red-500 leading-relaxed">
                {syncError}
              </div>
            </div>
            <button
              onClick={onClearError}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-800/30 rounded transition-colors"
            >
              <X className="w-3 h-3 text-red-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
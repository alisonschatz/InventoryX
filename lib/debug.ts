// lib/debug.ts
// Sistema de debug centralizado

type LogLevel = 'info' | 'success' | 'warning' | 'error'
type LogCategory = 'auth' | 'firebase' | 'guest' | 'state' | 'init'

interface DebugLog {
  timestamp: string
  level: LogLevel
  category: LogCategory
  message: string
  data?: any
}

class DebugService {
  private logs: DebugLog[] = []
  private maxLogs = 100
  private isEnabled = typeof window !== 'undefined' && process.env.NODE_ENV === 'development'

  private log(level: LogLevel, category: LogCategory, message: string, data?: any) {
    if (!this.isEnabled) return

    const timestamp = new Date().toLocaleTimeString()
    const emoji = this.getEmoji(level, category)
    
    const logEntry: DebugLog = {
      timestamp,
      level,
      category,
      message,
      data
    }

    // Adicionar ao histórico
    this.logs.push(logEntry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Console output
    const consoleMessage = `${emoji} [${timestamp}] ${category.toUpperCase()}: ${message}`
    
    switch (level) {
      case 'error':
        console.error(consoleMessage, data || '')
        break
      case 'warning':
        console.warn(consoleMessage, data || '')
        break
      case 'success':
        console.log(`%c${consoleMessage}`, 'color: green; font-weight: bold', data || '')
        break
      default:
        console.log(consoleMessage, data || '')
    }
  }

  private getEmoji(level: LogLevel, category: LogCategory): string {
    const categoryEmojis = {
      auth: '🔐',
      firebase: '🔥',
      guest: '👤',
      state: '📊',
      init: '🚀'
    }

    const levelEmojis = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    }

    return `${categoryEmojis[category]} ${levelEmojis[level]}`
  }

  // Métodos públicos
  info(category: LogCategory, message: string, data?: any) {
    this.log('info', category, message, data)
  }

  success(category: LogCategory, message: string, data?: any) {
    this.log('success', category, message, data)
  }

  warning(category: LogCategory, message: string, data?: any) {
    this.log('warning', category, message, data)
  }

  error(category: LogCategory, message: string, data?: any) {
    this.log('error', category, message, data)
  }

  // Métodos específicos
  authOperation(operation: string, details?: any) {
    this.info('auth', `${operation}`, details)
  }

  authSuccess(operation: string) {
    this.success('auth', `${operation} concluído`)
  }

  authError(operation: string, error: any) {
    this.error('auth', `Erro em ${operation}`, error)
  }

  stateChange(hasUser: boolean, isGuest: boolean, loading: boolean, userName?: string | null) {
    this.info('state', 'Estado atualizado', {
      hasUser,
      isGuest,
      loading,
      userName: userName || 'nenhum'
    })
  }

  // Utilitários
  getAllLogs(): DebugLog[] {
    return [...this.logs]
  }

  exportLogs(): string {
    return this.logs.map(log => 
      `[${log.timestamp}] ${log.category.toUpperCase()} ${log.level.toUpperCase()}: ${log.message}${
        log.data ? '\n  Data: ' + JSON.stringify(log.data, null, 2) : ''
      }`
    ).join('\n\n')
  }

  clearLogs() {
    this.logs = []
    this.info('state', 'Logs limpos')
  }
}

// Singleton instance
export const debugService = new DebugService()

// Export default
export default debugService
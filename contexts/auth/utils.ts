// contexts/auth/utils.ts
// Utilitários para autenticação

/**
 * Traduzir erros do Firebase
 */
export const translateFirebaseError = (error: any): string => {
  const errorMap: Record<string, string> = {
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/email-already-in-use': 'Este email já está em uso',
    'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres)',
    'auth/invalid-email': 'Email inválido',
    'auth/invalid-credential': 'Email ou senha incorretos',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
    'auth/popup-closed-by-user': 'Login cancelado pelo usuário',
    'auth/cancelled-popup-request': 'Popup cancelado',
    'auth/popup-blocked': 'Popup bloqueado pelo navegador. Permita popups para este site',
    'auth/operation-not-allowed': 'Operação não permitida',
    'auth/user-disabled': 'Conta desabilitada'
  }
  
  if (error?.code && errorMap[error.code]) {
    return errorMap[error.code]
  }
  
  if (error?.message) {
    return error.message
  }
  
  return 'Erro inesperado. Tente novamente.'
}

/**
 * Validar dados de registro
 */
export const validateRegistration = (name: string, email: string, password: string): {
  valid: boolean
  errors: string[]
} => {
  const errors: string[] = []
  
  // Nome
  if (!name.trim()) {
    errors.push('Nome é obrigatório')
  } else if (name.trim().length < 2) {
    errors.push('Nome muito curto')
  } else if (name.trim().length > 50) {
    errors.push('Nome muito longo')
  }
  
  // Email
  if (!email.trim()) {
    errors.push('Email é obrigatório')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Email inválido')
  }
  
  // Senha
  if (!password) {
    errors.push('Senha é obrigatória')
  } else if (password.length < 6) {
    errors.push('Senha muito curta (mín. 6 caracteres)')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validar dados de login
 */
export const validateLogin = (email: string, password: string): {
  valid: boolean
  errors: string[]
} => {
  const errors: string[] = []
  
  if (!email.trim()) {
    errors.push('Email é obrigatório')
  }
  
  if (!password) {
    errors.push('Senha é obrigatória')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Calcular nível baseado no XP
 */
export const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

/**
 * Calcular XP para próximo nível
 */
export const calculateNextLevelXP = (level: number): number => {
  return Math.pow(level, 2) * 100
}

/**
 * Obter progresso do nível
 */
export const getLevelProgress = (xp: number): {
  level: number
  nextLevelXP: number
  progress: number
} => {
  const level = calculateLevel(xp)
  const currentLevelXP = Math.pow(level - 1, 2) * 100
  const nextLevelXP = calculateNextLevelXP(level)
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
  
  return {
    level,
    nextLevelXP,
    progress: Math.max(0, Math.min(100, progress))
  }
}

/**
 * Formatar data
 */
export const formatDate = (date: string | undefined): string => {
  if (!date) return 'Hoje'
  
  try {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return 'Data inválida'
  }
}

/**
 * Sanitizar nome
 */
export const sanitizeName = (name: string): string => {
  return name.trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\u00C0-\u024F\u1E00-\u1EFF]/g, '')
    .substring(0, 50)
}

/**
 * Verificar se é email válido
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Debounce
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
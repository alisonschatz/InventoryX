// contexts/auth/hooks.ts
// Hooks customizados para autenticação

import { useState, useCallback } from 'react'
import { translateFirebaseError, validateLogin, validateRegistration } from './utils'

/**
 * Hook para formulário de login
 */
export const useLoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }, [])

  const handleSubmit = useCallback(async (
    e: React.FormEvent,
    loginFn: (email: string, password: string) => Promise<any>
  ) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const validation = validateLogin(formData.email, formData.password)
      if (!validation.valid) {
        throw new Error(validation.errors[0])
      }

      await loginFn(formData.email, formData.password)
    } catch (err: any) {
      setError(translateFirebaseError(err))
    } finally {
      setIsLoading(false)
    }
  }, [formData])

  const reset = useCallback(() => {
    setFormData({ email: '', password: '' })
    setError('')
    setIsLoading(false)
  }, [])

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    reset,
    setError
  }
}

/**
 * Hook para formulário de registro
 */
export const useRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }, [])

  const handleSubmit = useCallback(async (
    e: React.FormEvent,
    registerFn: (email: string, password: string, name: string) => Promise<any>
  ) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const validation = validateRegistration(formData.name, formData.email, formData.password)
      if (!validation.valid) {
        throw new Error(validation.errors[0])
      }

      await registerFn(formData.email, formData.password, formData.name.trim())
    } catch (err: any) {
      setError(translateFirebaseError(err))
    } finally {
      setIsLoading(false)
    }
  }, [formData])

  const reset = useCallback(() => {
    setFormData({ name: '', email: '', password: '' })
    setError('')
    setIsLoading(false)
  }, [])

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    reset,
    setError
  }
}

/**
 * Hook para reset de senha
 */
export const usePasswordReset = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleReset = useCallback(async (
    resetFn: (email: string) => Promise<void>,
    resetEmail?: string
  ) => {
    const emailToUse = resetEmail || email
    
    if (!emailToUse.trim()) {
      setError('Digite seu email primeiro')
      return
    }

    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      await resetFn(emailToUse)
      setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.')
    } catch (err: any) {
      setError(translateFirebaseError(err))
    } finally {
      setIsLoading(false)
    }
  }, [email])

  const reset = useCallback(() => {
    setEmail('')
    setError('')
    setSuccess('')
    setIsLoading(false)
  }, [])

  return {
    email,
    setEmail,
    isLoading,
    error,
    success,
    handleReset,
    reset,
    setError,
    setSuccess
  }
}

/**
 * Hook para conversão de convidado
 */
export const useGuestConversion = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }, [])

  const handleConvert = useCallback(async (
    e: React.FormEvent,
    convertFn: (email: string, password: string, name: string) => Promise<void>
  ) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const validation = validateRegistration(formData.name, formData.email, formData.password)
      if (!validation.valid) {
        throw new Error(validation.errors[0])
      }

      await convertFn(formData.email, formData.password, formData.name.trim())
    } catch (err: any) {
      setError(translateFirebaseError(err))
    } finally {
      setIsLoading(false)
    }
  }, [formData])

  const reset = useCallback(() => {
    setFormData({ name: '', email: '', password: '' })
    setError('')
    setIsLoading(false)
  }, [])

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleConvert,
    reset,
    setError
  }
}

/**
 * Hook para logout com confirmação
 */
export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = useCallback(async (
    logoutFn: () => Promise<void>,
    skipConfirmation: boolean = false
  ) => {
    if (!skipConfirmation) {
      const confirmed = window.confirm('Tem certeza que deseja sair?')
      if (!confirmed) return
    }

    setIsLoading(true)
    
    try {
      await logoutFn()
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    handleLogout
  }
}

/**
 * Hook para login como convidado
 */
export const useGuestLogin = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGuestLogin = useCallback(async (
    guestLoginFn: () => void
  ) => {
    setIsLoading(true)
    
    try {
      // Simular delay para UX
      await new Promise(resolve => setTimeout(resolve, 500))
      guestLoginFn()
    } catch (error) {
      console.error('Erro no login como convidado:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    handleGuestLogin
  }
}

/**
 * Hook para estado derivado de autenticação
 */
export const useAuthState = (user: any, userProfile: any, loading: boolean, isGuestMode: boolean) => {
  const isAuthenticated = user !== null
  const isGuest = isGuestMode
  const isRealUser = isAuthenticated && !isGuest
  const hasProfile = userProfile !== null

  const userName = user?.displayName || userProfile?.displayName || 'Usuário'
  const userEmail = user?.email || ''
  const userLevel = userProfile?.level || 1
  const userXP = userProfile?.xp || 0

  return {
    // Estados básicos
    user,
    userProfile,
    loading,
    isGuestMode,
    
    // Estados derivados
    isAuthenticated,
    isGuest,
    isRealUser,
    hasProfile,
    
    // Dados do usuário
    userName,
    userEmail,
    userLevel,
    userXP
  }
}
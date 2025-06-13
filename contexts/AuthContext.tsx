// contexts/AuthContext.tsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { 
  User, 
  UserProfile, 
  AuthContextType,
  GuestService,
  FirebaseService
} from './auth'
import debugService from '../lib/debug'

// ========================= CONTEXT =========================

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}

// ========================= PROVIDER =========================

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Estados principais
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGuestMode, setIsGuestMode] = useState(false)

  debugService.info('init', 'AuthProvider iniciado')

  // ===================== INICIALIZAÇÃO =====================

  useEffect(() => {
    debugService.info('init', 'Executando inicialização')
    
    // Timeout de segurança
    const forceStopLoading = setTimeout(() => {
      debugService.warning('state', 'TIMEOUT: Forçando parada do loading')
      setLoading(false)
    }, 3000)
    
    const runInit = async () => {
      await initializeAuth()
      clearTimeout(forceStopLoading)
    }
    
    runInit()
    
    return () => clearTimeout(forceStopLoading)
  }, [])

  // Debug de mudanças de estado (sem loops)
  useEffect(() => {
    // Só logar após inicialização
    if (loading && !user && !isGuestMode) return
    
    debugService.stateChange(!!user, isGuestMode, loading, user?.displayName || undefined)
  }, [user, isGuestMode, loading])

  /**
   * Inicializar sistema de autenticação
   */
  const initializeAuth = async () => {
    debugService.info('init', 'Iniciando sistema de autenticação')

    // Só no cliente
    if (typeof window === 'undefined') {
      debugService.warning('init', 'Servidor detectado - parando loading')
      setLoading(false)
      return
    }

    // 1. Verificar modo convidado primeiro
    const guestResult = GuestService.checkGuestMode()
    if (guestResult.isGuest && guestResult.user && guestResult.profile) {
      debugService.success('guest', 'Convidado encontrado - configurando estados')
      
      setUser(guestResult.user)
      setUserProfile(guestResult.profile)
      setIsGuestMode(true)
      setLoading(false)
      return
    }

    // 2. Inicializar Firebase se não for convidado
    const firebaseInitialized = await FirebaseService.initialize()
    if (!firebaseInitialized) {
      debugService.error('firebase', 'Falha na inicialização - parando loading')
      setLoading(false)
      return
    }

    // 3. Configurar listener do Firebase
    const unsubscribe = FirebaseService.setupAuthListener(
      handleFirebaseUserChange,
      handleLoadUserProfile
    )

    if (!unsubscribe) {
      debugService.error('firebase', 'Falha no listener - parando loading')
      setLoading(false)
    }
  }

  /**
   * Handler para mudança de usuário Firebase
   */
  const handleFirebaseUserChange = (firebaseUser: User | null) => {
    debugService.info('firebase', 'Mudança de usuário detectada', {
      hasUser: !!firebaseUser,
      isGuest: isGuestMode
    })

    if (firebaseUser && !isGuestMode) {
      setUser(firebaseUser)
      setIsGuestMode(false)
    } else if (!isGuestMode) {
      setUser(null)
      setUserProfile(null)
    }
    
    setLoading(false)
  }

  /**
   * Handler para carregar perfil do usuário
   */
  const handleLoadUserProfile = async (user: User) => {
    try {
      const profile = await FirebaseService.loadUserProfile(user)
      if (profile) {
        setUserProfile(profile)
      }
    } catch (error) {
      debugService.error('firebase', 'Erro ao carregar perfil', error)
    }
  }

  // ===================== MÉTODOS PÚBLICOS =====================

  /**
   * Login como convidado
   */
  const loginAsGuest = () => {
    debugService.info('guest', 'Iniciando login como convidado')
    
    const { user: guestUser, profile: guestProfile } = GuestService.createGuestSession()
    
    setUser(guestUser)
    setUserProfile(guestProfile)
    setIsGuestMode(true)
    setLoading(false)
    
    debugService.success('guest', 'Login como convidado concluído')
  }

  /**
   * Login com email e senha
   */
  const login = async (email: string, password: string) => {
    return await FirebaseService.login(email, password)
  }

  /**
   * Registro
   */
  const register = async (email: string, password: string, name: string) => {
    return await FirebaseService.register(email, password, name)
  }

  /**
   * Login com Google
   */
  const loginWithGoogle = async () => {
    return await FirebaseService.loginWithGoogle()
  }

  /**
   * Reset de senha
   */
  const resetPassword = async (email: string) => {
    return await FirebaseService.resetPassword(email)
  }

  /**
   * Atualizar perfil
   */
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (isGuestMode) {
      // Atualizar convidado
      GuestService.updateGuestData(updates)
      setUserProfile(prev => prev ? { ...prev, ...updates } : null)
    } else if (user) {
      // Atualizar Firebase
      await FirebaseService.updateProfile(user.uid, updates)
      setUserProfile(prev => prev ? { ...prev, ...updates } : null)
    }
  }

  /**
   * Logout
   */
  const logout = async () => {
    try {
      if (isGuestMode) {
        debugService.info('guest', 'Logout de convidado')
        GuestService.clearGuestData()
        setUser(null)
        setUserProfile(null)
        setIsGuestMode(false)
        
        // Reinicializar Firebase
        await FirebaseService.initialize()
      } else {
        debugService.info('firebase', 'Logout do Firebase')
        await FirebaseService.logout()
      }
    } catch (error) {
      debugService.error('auth', 'Erro no logout', error)
      throw error
    }
  }

  /**
   * Converter convidado para usuário real
   */
  const convertGuestToUser = async (email: string, password: string, name: string) => {
    if (!isGuestMode || !userProfile) {
      throw new Error('Não está no modo convidado')
    }
    
    try {
      debugService.info('guest', 'Iniciando conversão para usuário real', {
        email,
        currentXP: userProfile.xp,
        currentLevel: userProfile.level
      })
      
      // Obter dados para transferir
      const conversionData = GuestService.getConversionData()
      if (!conversionData) {
        throw new Error('Dados de conversão não encontrados')
      }
      
      // Limpar dados do convidado
      GuestService.clearGuestData()
      setIsGuestMode(false)
      
      // Registrar usuário real
      await register(email, password, name)
      
      // Transferir dados (será feito pelo listener)
      if (user && FirebaseService.isInitialized()) {
        await FirebaseService.updateProfile(user.uid, {
          level: conversionData.level,
          xp: conversionData.xp
        })
      }
      
      debugService.success('guest', 'Conversão concluída com sucesso')
    } catch (error) {
      debugService.error('guest', 'Erro na conversão', error)
      throw error
    }
  }

  // ===================== CONTEXT VALUE =====================

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    isGuestMode,
    loginAsGuest,
    logout,
    login,
    register,
    loginWithGoogle,
    resetPassword,
    updateUserProfile,
    convertGuestToUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
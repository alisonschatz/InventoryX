'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { initializeFirebase, getFirebaseFunctions } from '@/lib/firebase-client'

interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  createdAt: string
  lastLogin: string
  level: number
  xp: number
}

interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  metadata: {
    creationTime?: string
    lastSignInTime?: string
  }
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  login: (email: string, password: string) => Promise<any>
  register: (email: string, password: string, name: string) => Promise<any>
  loginWithGoogle: () => Promise<any>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [firebaseReady, setFirebaseReady] = useState(false)
  const [auth, setAuth] = useState<any>(null)
  const [db, setDb] = useState<any>(null)

  console.log('🔥 AuthProvider iniciando...')

  // Inicializar Firebase apenas no cliente
  useEffect(() => {
    if (typeof window === 'undefined') {
      console.log('⚠️ Rodando no servidor, aguardando cliente...')
      return
    }

    const setupFirebase = async () => {
      try {
        console.log('🔥 Configurando Firebase...')
        
        const { auth: authInstance, db: dbInstance } = await initializeFirebase()
        
        if (!authInstance || !dbInstance) {
          throw new Error('Falha ao inicializar Firebase')
        }

        setAuth(authInstance)
        setDb(dbInstance)
        setFirebaseReady(true)

        console.log('✅ Firebase configurado com sucesso')

        // Configurar listener de autenticação
        const functions = await getFirebaseFunctions()
        
        if (functions.onAuthStateChanged) {
          const unsubscribe = functions.onAuthStateChanged(authInstance, async (firebaseUser: any) => {
            console.log('🔄 Auth state changed:', firebaseUser ? 'LOGADO' : 'DESLOGADO')
            
            if (firebaseUser) {
              const userData: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                metadata: firebaseUser.metadata
              }
              
              setUser(userData)
              await fetchUserProfile(firebaseUser.uid, dbInstance, functions)
            } else {
              setUser(null)
              setUserProfile(null)
            }
            
            setLoading(false)
          })

          return unsubscribe
        }
      } catch (error) {
        console.error('❌ Erro ao configurar Firebase:', error)
        setLoading(false)
        setFirebaseReady(false)
      }
    }

    setupFirebase()
  }, [])

  // Criar perfil do usuário
  const createUserProfile = async (user: User, additionalData: any = {}) => {
    if (!db || !firebaseReady) {
      console.error('❌ Firebase não está pronto')
      return
    }

    try {
      const functions = await getFirebaseFunctions()
      if (!functions.doc || !functions.setDoc || !functions.getDoc) {
        throw new Error('Funções do Firestore não disponíveis')
      }

      const userRef = functions.doc(db, 'users', user.uid)
      const snapshot = await functions.getDoc(userRef)

      if (!snapshot.exists()) {
        const profileData: UserProfile = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          level: 1,
          xp: 0,
          ...additionalData
        }

        await functions.setDoc(userRef, profileData)
        setUserProfile(profileData)
        console.log('✅ Perfil criado')
      } else {
        const existingData = snapshot.data() as UserProfile
        const updatedData = {
          ...existingData,
          lastLogin: new Date().toISOString()
        }
        await functions.setDoc(userRef, updatedData, { merge: true })
        setUserProfile(updatedData)
        console.log('✅ Perfil atualizado')
      }
    } catch (error) {
      console.error('❌ Erro ao criar perfil:', error)
    }
  }

  // Buscar perfil do usuário
  const fetchUserProfile = async (uid: string, dbInstance: any, functions: any) => {
    try {
      if (!functions.doc || !functions.getDoc) return

      const userRef = functions.doc(dbInstance, 'users', uid)
      const snapshot = await functions.getDoc(userRef)
      
      if (snapshot.exists()) {
        setUserProfile(snapshot.data() as UserProfile)
      }
    } catch (error) {
      console.error('❌ Erro ao buscar perfil:', error)
    }
  }

  // Registro
  const register = async (email: string, password: string, name: string) => {
    if (!auth || !firebaseReady) {
      throw new Error('Firebase não está pronto')
    }

    try {
      const functions = await getFirebaseFunctions()
      if (!functions.createUserWithEmailAndPassword || !functions.updateProfile) {
        throw new Error('Funções de autenticação não disponíveis')
      }

      console.log('📝 Criando conta...')
      const result = await functions.createUserWithEmailAndPassword(auth, email, password)
      
      console.log('✅ Conta criada, atualizando perfil...')
      await functions.updateProfile(result.user, { displayName: name })
      
      const userData: User = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: name,
        photoURL: result.user.photoURL,
        metadata: result.user.metadata
      }

      await createUserProfile(userData, { displayName: name })
      
      return result
    } catch (error) {
      console.error('❌ Erro no registro:', error)
      throw error
    }
  }

  // Login
  const login = async (email: string, password: string) => {
    if (!auth || !firebaseReady) {
      throw new Error('Firebase não está pronto')
    }

    try {
      const functions = await getFirebaseFunctions()
      if (!functions.signInWithEmailAndPassword) {
        throw new Error('Função de login não disponível')
      }

      console.log('🔐 Fazendo login...')
      const result = await functions.signInWithEmailAndPassword(auth, email, password)
      
      const userData: User = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        metadata: result.user.metadata
      }

      await createUserProfile(userData)
      
      return result
    } catch (error) {
      console.error('❌ Erro no login:', error)
      throw error
    }
  }

  // Login com Google
  const loginWithGoogle = async () => {
    if (!auth || !firebaseReady) {
      throw new Error('Firebase não está pronto')
    }

    try {
      const functions = await getFirebaseFunctions()
      if (!functions.GoogleAuthProvider || !functions.signInWithPopup) {
        throw new Error('Funções do Google não disponíveis')
      }

      console.log('🔗 Login com Google...')
      const provider = new functions.GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      
      const result = await functions.signInWithPopup(auth, provider)
      
      const userData: User = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        metadata: result.user.metadata
      }

      await createUserProfile(userData)
      
      return result
    } catch (error) {
      console.error('❌ Erro no Google:', error)
      throw error
    }
  }

  // Logout
  const logout = async () => {
    if (!auth || !firebaseReady) return

    try {
      const functions = await getFirebaseFunctions()
      if (!functions.signOut) return

      await functions.signOut(auth)
      setUser(null)
      setUserProfile(null)
    } catch (error) {
      console.error('❌ Erro no logout:', error)
      throw error
    }
  }

  // Reset de senha
  const resetPassword = async (email: string) => {
    if (!auth || !firebaseReady) {
      throw new Error('Firebase não está pronto')
    }

    try {
      const functions = await getFirebaseFunctions()
      if (!functions.sendPasswordResetEmail) {
        throw new Error('Função de reset não disponível')
      }

      await functions.sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error('❌ Erro no reset:', error)
      throw error
    }
  }

  // Atualizar perfil
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user || !db || !firebaseReady) return
    
    try {
      const functions = await getFirebaseFunctions()
      if (!functions.doc || !functions.setDoc) return

      const userRef = functions.doc(db, 'users', user.uid)
      await functions.setDoc(userRef, data, { merge: true })
      
      if (userProfile) {
        setUserProfile({ ...userProfile, ...data })
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile
  }

  console.log('📊 AuthProvider state:', { 
    firebaseReady,
    hasUser: !!user, 
    loading 
  })

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
// contexts/auth/firebaseService.ts
// Serviço de autenticação Firebase

import { User, UserProfile, FirebaseAuthState } from './types'
import debugService from '../../lib/debug'

export class FirebaseService {
  private static state: FirebaseAuthState = {
    auth: null,
    db: null,
    functions: null
  }

  /**
   * Inicializar Firebase
   */
  static async initialize(): Promise<boolean> {
    try {
      debugService.info('firebase', 'Inicializando Firebase')
      
      if (typeof window === 'undefined') {
        debugService.warning('firebase', 'Executando no servidor - pulando inicialização')
        return false
      }

      const { initializeFirebase, getFirebaseFunctions } = await import('../../lib/firebase-client')
      
      const { auth, db } = await initializeFirebase()
      const functions = await getFirebaseFunctions()
      
      if (!auth || !db || !functions) {
        throw new Error('Firebase não configurado corretamente')
      }
      
      if (!functions.onAuthStateChanged) {
        throw new Error('onAuthStateChanged não disponível')
      }
      
      this.state = { auth, db, functions }
      
      debugService.success('firebase', 'Firebase inicializado')
      return true
      
    } catch (error) {
      debugService.error('firebase', 'Erro na inicialização', error)
      return false
    }
  }

  /**
   * Configurar listener de autenticação
   */
  static setupAuthListener(
    onUserChange: (user: User | null) => void,
    onProfileLoad: (user: User) => Promise<void>
  ): (() => void) | null {
    const { auth, functions } = this.state
    
    if (!auth || !functions?.onAuthStateChanged) {
      debugService.error('firebase', 'Firebase não inicializado para listener')
      return null
    }

    debugService.info('firebase', 'Configurando auth listener')

    const unsubscribe = functions.onAuthStateChanged(auth, async (firebaseUser: any) => {
      debugService.info('firebase', 'Mudança de usuário', {
        hasUser: !!firebaseUser,
        uid: firebaseUser?.uid || 'nenhum'
      })
      
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          isGuest: false,
          metadata: firebaseUser.metadata
        }
        
        onUserChange(user)
        await onProfileLoad(user)
      } else {
        onUserChange(null)
      }
    })
    
    return unsubscribe
  }

  /**
   * Carregar perfil do usuário
   */
  static async loadUserProfile(user: User): Promise<UserProfile | null> {
    try {
      const { db, functions } = this.state
      
      if (!db || !functions?.doc || !functions?.getDoc || !functions?.setDoc) {
        debugService.error('firebase', 'Firestore não disponível')
        return null
      }
      
      debugService.info('firebase', 'Carregando perfil', { uid: user.uid })
      
      const userRef = functions.doc(db, 'users', user.uid)
      const snapshot = await functions.getDoc(userRef)
      
      if (snapshot.exists()) {
        const profile = snapshot.data() as UserProfile
        debugService.success('firebase', 'Perfil carregado')
        return profile
      } else {
        // Criar novo perfil
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          level: 1,
          xp: 0,
          isGuest: false
        }
        
        await functions.setDoc(userRef, newProfile)
        debugService.success('firebase', 'Novo perfil criado')
        return newProfile
      }
    } catch (error) {
      debugService.error('firebase', 'Erro ao carregar perfil', error)
      return null
    }
  }

  /**
   * Atualizar perfil do usuário
   */
  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const { db, functions } = this.state
    
    if (!db || !functions?.doc || !functions?.setDoc) {
      throw new Error('Firestore não disponível')
    }
    
    try {
      debugService.info('firebase', 'Atualizando perfil', { userId, updates })
      
      const userRef = functions.doc(db, 'users', userId)
      await functions.setDoc(userRef, updates, { merge: true })
      
      debugService.success('firebase', 'Perfil atualizado')
    } catch (error) {
      debugService.error('firebase', 'Erro ao atualizar perfil', error)
      throw error
    }
  }

  /**
   * Login com email e senha
   */
  static async login(email: string, password: string): Promise<any> {
    const { auth, functions } = this.state
    
    if (!auth || !functions?.signInWithEmailAndPassword) {
      throw new Error('Firebase não inicializado')
    }
    
    try {
      debugService.authOperation('login', { email })
      const result = await functions.signInWithEmailAndPassword(auth, email, password)
      debugService.authSuccess('login')
      return result
    } catch (error) {
      debugService.authError('login', error)
      throw error
    }
  }

  /**
   * Registro
   */
  static async register(email: string, password: string, name: string): Promise<any> {
    const { auth, functions } = this.state
    
    if (!auth || !functions?.createUserWithEmailAndPassword || !functions?.updateProfile) {
      throw new Error('Firebase não inicializado')
    }
    
    try {
      debugService.authOperation('registro', { email, name })
      const result = await functions.createUserWithEmailAndPassword(auth, email, password)
      await functions.updateProfile(result.user, { displayName: name })
      debugService.authSuccess('registro')
      return result
    } catch (error) {
      debugService.authError('registro', error)
      throw error
    }
  }

  /**
   * Login com Google
   */
  static async loginWithGoogle(): Promise<any> {
    const { auth, functions } = this.state
    
    if (!auth || !functions?.GoogleAuthProvider || !functions?.signInWithPopup) {
      throw new Error('Google auth não disponível')
    }
    
    try {
      debugService.authOperation('login Google')
      const provider = new functions.GoogleAuthProvider()
      const result = await functions.signInWithPopup(auth, provider)
      debugService.authSuccess('login Google')
      return result
    } catch (error) {
      debugService.authError('login Google', error)
      throw error
    }
  }

  /**
   * Reset de senha
   */
  static async resetPassword(email: string): Promise<void> {
    const { auth, functions } = this.state
    
    if (!auth || !functions?.sendPasswordResetEmail) {
      throw new Error('Firebase não inicializado')
    }
    
    try {
      debugService.authOperation('reset password', { email })
      await functions.sendPasswordResetEmail(auth, email)
      debugService.authSuccess('reset password')
    } catch (error) {
      debugService.authError('reset password', error)
      throw error
    }
  }

  /**
   * Logout
   */
  static async logout(): Promise<void> {
    const { auth, functions } = this.state
    
    if (!auth || !functions?.signOut) {
      throw new Error('Firebase não inicializado')
    }
    
    try {
      debugService.authOperation('logout')
      await functions.signOut(auth)
      debugService.authSuccess('logout')
    } catch (error) {
      debugService.authError('logout', error)
      throw error
    }
  }

  /**
   * Verificar se está inicializado
   */
  static isInitialized(): boolean {
    return !!(this.state.auth && this.state.db && this.state.functions)
  }

  /**
   * Limpar estado
   */
  static clearState(): void {
    this.state = { auth: null, db: null, functions: null }
    debugService.info('firebase', 'Estado limpo')
  }
}
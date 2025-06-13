// contexts/auth/guestService.ts
// Serviço de autenticação para convidados

import { User, UserProfile, GUEST_MODE_KEY, GUEST_USER_KEY } from './types'
import debugService from '../../lib/debug'

export class GuestService {
  
  /**
   * Verificar se está em modo convidado
   */
  static checkGuestMode(): {
    isGuest: boolean
    user?: User
    profile?: UserProfile
  } {
    try {
      debugService.info('guest', 'Verificando modo convidado')
      
      if (typeof window === 'undefined') {
        return { isGuest: false }
      }

      const guestFlag = localStorage.getItem(GUEST_MODE_KEY)
      const guestData = localStorage.getItem(GUEST_USER_KEY)
      
      debugService.info('guest', 'Dados do localStorage', {
        hasFlag: guestFlag === 'true',
        hasData: !!guestData,
        dataSize: guestData?.length || 0
      })
      
      if (guestFlag === 'true' && guestData) {
        const data = JSON.parse(guestData)
        
        const guestUser: User = {
          uid: data.uid,
          email: data.email,
          displayName: data.displayName,
          photoURL: data.photoURL,
          isGuest: true,
          metadata: data.metadata
        }
        
        const guestProfile: UserProfile = {
          uid: data.uid,
          email: data.email,
          displayName: data.displayName,
          photoURL: data.photoURL,
          createdAt: data.metadata?.creationTime || new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          level: data.level || 1,
          xp: data.xp || 0,
          isGuest: true
        }
        
        debugService.success('guest', 'Convidado encontrado', {
          name: guestUser.displayName,
          level: guestProfile.level,
          xp: guestProfile.xp
        })
        
        return {
          isGuest: true,
          user: guestUser,
          profile: guestProfile
        }
      }
      
      debugService.info('guest', 'Não está em modo convidado')
      return { isGuest: false }
      
    } catch (error) {
      debugService.error('guest', 'Erro ao verificar modo convidado', error)
      this.clearGuestData()
      return { isGuest: false }
    }
  }

  /**
   * Criar nova sessão de convidado
   */
  static createGuestSession(): { user: User; profile: UserProfile } {
    debugService.info('guest', 'Criando nova sessão')
    
    const guestId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()
    
    const guestUser: User = {
      uid: guestId,
      email: 'convidado@inventoryx.com',
      displayName: 'Usuário Convidado',
      photoURL: null,
      isGuest: true,
      metadata: {
        creationTime: now,
        lastSignInTime: now
      }
    }
    
    const guestProfile: UserProfile = {
      uid: guestId,
      email: 'convidado@inventoryx.com',
      displayName: 'Usuário Convidado',
      photoURL: null,
      createdAt: now,
      lastLogin: now,
      level: 1,
      xp: 0,
      isGuest: true
    }
    
    // Salvar no localStorage
    const saveData = {
      uid: guestId,
      email: guestUser.email,
      displayName: guestUser.displayName,
      photoURL: guestUser.photoURL,
      level: guestProfile.level,
      xp: guestProfile.xp,
      metadata: guestUser.metadata
    }
    
    localStorage.setItem(GUEST_MODE_KEY, 'true')
    localStorage.setItem(GUEST_USER_KEY, JSON.stringify(saveData))
    
    debugService.success('guest', 'Sessão criada', {
      uid: guestId,
      name: guestUser.displayName
    })
    
    return { user: guestUser, profile: guestProfile }
  }

  /**
   * Atualizar dados do convidado
   */
  static updateGuestData(updates: Partial<UserProfile>): void {
    try {
      const currentData = localStorage.getItem(GUEST_USER_KEY)
      if (currentData) {
        const parsed = JSON.parse(currentData)
        const updated = { ...parsed, ...updates }
        localStorage.setItem(GUEST_USER_KEY, JSON.stringify(updated))
        
        debugService.success('guest', 'Dados atualizados', updates)
      }
    } catch (error) {
      debugService.error('guest', 'Erro ao atualizar dados', error)
    }
  }

  /**
   * Obter dados atuais para conversão
   */
  static getConversionData(): { xp: number; level: number } | null {
    try {
      const data = localStorage.getItem(GUEST_USER_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        return {
          xp: parsed.xp || 0,
          level: parsed.level || 1
        }
      }
      return null
    } catch (error) {
      debugService.error('guest', 'Erro ao obter dados de conversão', error)
      return null
    }
  }

  /**
   * Limpar dados do convidado
   */
  static clearGuestData(): void {
    try {
      localStorage.removeItem(GUEST_MODE_KEY)
      localStorage.removeItem(GUEST_USER_KEY)
      debugService.success('guest', 'Dados limpos')
    } catch (error) {
      debugService.error('guest', 'Erro ao limpar dados', error)
    }
  }

  /**
   * Verificar se está em modo convidado (simples)
   */
  static isGuestMode(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(GUEST_MODE_KEY) === 'true'
  }
}
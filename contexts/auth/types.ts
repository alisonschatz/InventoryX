// contexts/auth/types.ts
// Tipos e interfaces para o sistema de autenticação

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  isGuest?: boolean
  metadata?: {
    creationTime?: string
    lastSignInTime?: string
  }
}

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  createdAt: string
  lastLogin: string
  level: number
  xp: number
  isGuest?: boolean
}

export interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  isGuestMode: boolean
  loginAsGuest: () => void
  logout: () => Promise<void>
  login: (email: string, password: string) => Promise<any>
  register: (email: string, password: string, name: string) => Promise<any>
  loginWithGoogle: () => Promise<any>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
  convertGuestToUser: (email: string, password: string, name: string) => Promise<void>
}

export interface FirebaseAuthState {
  auth: any
  db: any
  functions: any
}

// Constants
export const GUEST_MODE_KEY = 'inventoryx-guest-mode'
export const GUEST_USER_KEY = 'inventoryx-guest-user'
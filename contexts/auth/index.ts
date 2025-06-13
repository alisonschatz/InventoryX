// contexts/auth/index.ts
// Barrel export para facilitar importações

// Types
export type {
  User,
  UserProfile,
  AuthContextType,
  FirebaseAuthState
} from './types'

export {
  GUEST_MODE_KEY,
  GUEST_USER_KEY
} from './types'

// Services
export { GuestService } from './guestService'
export { FirebaseService } from './firebaseService'

// Utils
export {
  translateFirebaseError,
  validateRegistration,
  validateLogin,
  calculateLevel,
  calculateNextLevelXP,
  getLevelProgress,
  formatDate,
  sanitizeName,
  isValidEmail,
  debounce
} from './utils'

// Hooks
export {
  useLoginForm,
  useRegisterForm,
  usePasswordReset,
  useGuestConversion,
  useLogout,
  useGuestLogin,
  useAuthState
} from './hooks'
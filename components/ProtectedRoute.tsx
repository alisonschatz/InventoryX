'use client'

import { useAuth } from '@/contexts/AuthContext'
import LoginPage from './LoginPage'
import LoadingScreen from './LoadingScreen'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isGuestMode } = useAuth()

  // DEBUG: Log detalhado para verificar estados
  console.log('🛡️ ProtectedRoute - Estados:', {
    hasUser: !!user,
    isGuest: isGuestMode,
    loading,
    userType: user?.isGuest ? 'CONVIDADO' : user ? 'REAL' : 'NENHUM'
  })

  // Ainda carregando - mostrar loading
  if (loading) {
    console.log('⏳ ProtectedRoute: Ainda carregando...')
    return <LoadingScreen />
  }

  // Verificar se tem usuário (real ou convidado)
  const hasValidUser = user && (user.isGuest || !isGuestMode)
  
  if (!hasValidUser) {
    console.log('🔐 ProtectedRoute: Sem usuário válido, mostrando LoginPage')
    return <LoginPage />
  }

  // Usuário válido (real ou convidado) - mostrar conteúdo
  console.log('✅ ProtectedRoute: Usuário autenticado:', {
    type: isGuestMode ? 'CONVIDADO' : 'REAL',
    name: user.displayName,
    email: user.email
  })
  
  return <>{children}</>
}
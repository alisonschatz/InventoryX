'use client'

import { useAuth } from '@/contexts/AuthContext'
import LoginPage from './LoginPage'
import LoadingScreen from './LoadingScreen'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  // DEBUG: Log para verificar o que está acontecendo
  console.log('🛡️ ProtectedRoute - User:', user ? 'LOGADO' : 'NÃO LOGADO', 'Loading:', loading)

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    console.log('⏳ Mostrando LoadingScreen - verificando autenticação')
    return <LoadingScreen />
  }

  // Se não autenticado, mostra página de login
  if (!user) {
    console.log('🔐 Mostrando LoginPage - usuário não autenticado')
    return <LoginPage />
  }

  // Se autenticado, mostra o conteúdo protegido
  console.log('✅ Mostrando conteúdo protegido - usuário autenticado:', user.email)
  return <>{children}</>
}
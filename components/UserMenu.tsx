'use client'

import { useState, useRef, useEffect } from 'react'
import { User, LogOut, Settings, Crown, Zap } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { user, userProfile, logout } = useAuth()

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      console.log('👋 Fazendo logout...')
      await logout()
      setIsOpen(false)
      console.log('✅ Logout realizado com sucesso')
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error)
    }
  }

  if (!user) {
    console.log('⚠️ UserMenu: Usuário não logado')
    return null
  }

  const displayName = user.displayName || userProfile?.displayName || 'Usuário'
  const email = user.email || ''
  const photoURL = user.photoURL || userProfile?.photoURL
  const level = userProfile?.level || 1
  const xp = userProfile?.xp || 0
  const createdAt = userProfile?.createdAt || user.metadata?.creationTime

  console.log('👤 UserMenu renderizando:', { displayName, email, level, xp })

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar/Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-theme-hover rounded-xl transition-theme border border-theme-soft"
        title={`Menu do usuário - ${displayName}`}
      >
        {photoURL ? (
          <img
            src={photoURL}
            alt={displayName}
            className="w-8 h-8 rounded-full border-2 border-purple-200"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="hidden md:block text-sm font-medium text-theme-primary">
          {displayName.split(' ')[0]}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-theme-panel rounded-xl shadow-theme-medium border border-theme-soft overflow-hidden z-50 animate-fade-in">
          {/* Header do usuário */}
          <div className="p-4 bg-gradient-to-r from-purple-600/10 to-cyan-500/10 border-b border-theme-soft">
            <div className="flex items-center gap-3">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={displayName}
                  className="w-12 h-12 rounded-full border-2 border-purple-200"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-theme-primary truncate">
                  {displayName}
                </div>
                <div className="text-sm text-theme-secondary truncate">
                  {email}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full">
                  <Crown className="w-3 h-3 text-yellow-600" />
                  <span className="text-xs font-medium text-yellow-700">Nv.{level}</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-100 to-cyan-100 rounded-full">
                  <Zap className="w-3 h-3 text-purple-600" />
                  <span className="text-xs font-medium text-purple-700">{xp} XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false)
                // Aqui você pode adicionar navegação para perfil
                console.log('📋 Abrir perfil do usuário')
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-theme-primary hover:bg-theme-hover transition-theme"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">Meu Perfil</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false)
                // Aqui você pode adicionar navegação para configurações
                console.log('⚙️ Abrir configurações')
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-theme-primary hover:bg-theme-hover transition-theme"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Configurações</span>
            </button>

            <div className="border-t border-theme-soft my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-theme"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sair</span>
            </button>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-theme-hover border-t border-theme-soft">
            <div className="text-xs text-theme-secondary">
              Membro desde {createdAt ? new Date(createdAt).toLocaleDateString('pt-BR') : 'Hoje'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
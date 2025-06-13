'use client'

import { useState, useRef, useEffect } from 'react'
import { User, LogOut, Settings, Crown, Zap, ChevronDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getUserPhoto } from '@/lib/firebase-photo'
import ProfileModal from './ProfileModal'
import SettingsModal from './SettingsModal'

export default function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  
  const menuRef = useRef<HTMLDivElement>(null)
  const { user, userProfile, logout } = useAuth()

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }

    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isMenuOpen])

  // Não renderizar se não houver usuário
  if (!user) return null

  // Dados do usuário
  const userName = user.displayName || userProfile?.displayName || 'Usuário'
  const userEmail = user.email || ''
  const userPhoto = getUserPhoto(user, userProfile) // Prioriza Firestore sobre Firebase Auth
  const userLevel = userProfile?.level || 1
  const userXP = userProfile?.xp || 0

  // Handlers
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  
  const openProfile = () => {
    setIsMenuOpen(false)
    setIsProfileOpen(true)
  }
  
  const openSettings = () => {
    setIsMenuOpen(false)
    setIsSettingsOpen(true)
  }
  
  const handleLogout = async () => {
    try {
      await logout()
      setIsMenuOpen(false)
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  return (
    <>
      {/* Menu Principal */}
      <div className="relative" ref={menuRef}>
        
        {/* Botão do Avatar */}
        <button
          onClick={toggleMenu}
          className="flex items-center gap-2 p-2 rounded-xl border border-theme-soft hover:bg-theme-hover transition-all duration-200"
        >
          {/* Avatar */}
          {userPhoto ? (
            <img
              src={userPhoto}
              alt={userName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
          
          {/* Nome (apenas desktop) */}
          <span className="hidden md:block text-sm font-medium text-theme-primary">
            {userName.split(' ')[0]}
          </span>
          
          {/* Seta */}
          <ChevronDown 
            className={`w-4 h-4 text-theme-secondary transition-transform duration-200 ${
              isMenuOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-theme-panel border border-theme-soft rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
            
            {/* Header do Usuário */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20">
              <div className="flex items-center gap-3">
                
                {/* Avatar Grande */}
                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt={userName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center border-2 border-white shadow-sm">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                
                {/* Info do Usuário */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-theme-primary truncate">
                    {userName}
                  </h3>
                  <p className="text-sm text-theme-secondary truncate">
                    {userEmail}
                  </p>
                </div>
                
                {/* Badges de Nível e XP */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                    <Crown className="w-3 h-3 text-yellow-600" />
                    <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">
                      {userLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <Zap className="w-3 h-3 text-purple-600" />
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-400">
                      {userXP}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              
              {/* Meu Perfil */}
              <button
                onClick={openProfile}
                className="w-full flex items-center gap-3 px-4 py-3 text-theme-primary hover:bg-theme-hover transition-colors"
              >
                <User className="w-5 h-5 text-purple-600" />
                <span className="font-medium">Meu Perfil</span>
              </button>

              {/* Divisor */}
              <div className="my-2 border-t border-theme-soft"></div>

              {/* Sair */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sair da Conta</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenSettings={() => {
          setIsProfileOpen(false)
          setIsSettingsOpen(true)
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  )
}
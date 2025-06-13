'use client'

import { useState } from 'react'
import { User, Mail, Lock, X, Crown, Zap, Shield } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function GuestConversionBanner() {
  const { isGuestMode, userProfile, convertGuestToUser } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  // Não mostrar se não for convidado
  if (!isGuestMode) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsConverting(true)

    try {
      // Validações
      if (!formData.name.trim()) {
        throw new Error('Nome é obrigatório')
      }
      if (!formData.email.trim()) {
        throw new Error('Email é obrigatório')
      }
      if (formData.password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres')
      }

      // Converter conta
      await convertGuestToUser(formData.email, formData.password, formData.name.trim())
      
      setShowModal(false)
      console.log('✅ Conversão concluída com sucesso!')
      
    } catch (err: any) {
      console.error('❌ Erro na conversão:', err)
      setError(err.message || 'Erro ao converter conta')
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <>
      {/* Banner Principal */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-theme-primary">
                🎯 Modo Convidado Ativo
              </h3>
              <p className="text-xs text-theme-secondary mt-0.5">
                Crie uma conta para salvar seu progresso permanentemente • 
                <span className="font-medium text-blue-600"> {userProfile?.xp} XP • Nível {userProfile?.level}</span>
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all font-medium text-sm shadow-md hover:shadow-lg"
          >
            Criar Conta Real
          </button>
        </div>
      </div>

      {/* Modal de Conversão */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-theme-panel rounded-2xl w-full max-w-md shadow-2xl border border-theme-soft">
            
            {/* Header */}
            <div className="p-6 border-b border-theme-soft">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-theme-primary">Converter para Conta Real</h2>
                  <p className="text-sm text-theme-secondary mt-1">
                    Mantenha todo seu progresso atual
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-theme-hover rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-theme-secondary" />
                </button>
              </div>
            </div>

            {/* Benefícios */}
            <div className="p-6 bg-theme-hover border-b border-theme-soft">
              <h3 className="text-sm font-semibold text-theme-primary mb-3">
                ✨ O que você mantém:
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 bg-theme-panel rounded-lg">
                  <Crown className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                  <div className="text-xs font-medium text-theme-primary">Nível {userProfile?.level}</div>
                </div>
                <div className="p-2 bg-theme-panel rounded-lg">
                  <Zap className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                  <div className="text-xs font-medium text-theme-primary">{userProfile?.xp} XP</div>
                </div>
                <div className="p-2 bg-theme-panel rounded-lg">
                  <Shield className="w-4 h-4 text-green-500 mx-auto mb-1" />
                  <div className="text-xs font-medium text-theme-primary">Ferramentas</div>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <form onSubmit={handleConvert} className="p-6 space-y-4">
              
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-theme-primary mb-2">
                  Nome completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isConverting}
                    className="w-full pl-10 pr-4 py-2.5 bg-theme-primary border border-theme-soft rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-theme-primary placeholder-theme-secondary transition-all disabled:opacity-50"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-theme-primary mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isConverting}
                    className="w-full pl-10 pr-4 py-2.5 bg-theme-primary border border-theme-soft rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-theme-primary placeholder-theme-secondary transition-all disabled:opacity-50"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-theme-primary mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isConverting}
                    className="w-full pl-10 pr-4 py-2.5 bg-theme-primary border border-theme-soft rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-theme-primary placeholder-theme-secondary transition-all disabled:opacity-50"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              </div>

              {/* Erro */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isConverting}
                  className="flex-1 px-4 py-2.5 bg-theme-hover hover:bg-theme-soft text-theme-primary rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isConverting}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-lg transition-all font-medium"
                >
                  {isConverting ? 'Convertendo...' : 'Criar Conta'}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="p-4 bg-theme-hover rounded-b-2xl border-t border-theme-soft">
              <p className="text-xs text-theme-secondary text-center">
                🔒 Seus dados serão migrados automaticamente e você manterá todo o progresso atual
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
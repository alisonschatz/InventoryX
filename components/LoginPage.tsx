'use client'

import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import ThemeToggle from './ThemeToggle'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  // Verificar se o hook está funcionando
  const authContext = useAuth()
  console.log('🔍 LoginPage - authContext:', authContext ? 'OK' : 'ERRO')
  
  const { login, register, loginWithGoogle, resetPassword } = authContext

  // Verificar se as funções estão disponíveis
  console.log('🔍 Funções disponíveis:', {
    login: typeof login,
    register: typeof register,
    loginWithGoogle: typeof loginWithGoogle,
    resetPassword: typeof resetPassword
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const translateFirebaseError = (error: any): string => {
    console.log('🔍 Traduzindo erro:', error)
    
    const errorMap: Record<string, string> = {
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/email-already-in-use': 'Este email já está em uso',
      'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres)',
      'auth/invalid-email': 'Email inválido',
      'auth/invalid-credential': 'Email ou senha incorretos',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
      'auth/popup-closed-by-user': 'Login cancelado pelo usuário',
      'auth/cancelled-popup-request': 'Popup cancelado',
      'auth/popup-blocked': 'Popup bloqueado pelo navegador. Permita popups para este site',
      'auth/operation-not-allowed': 'Operação não permitida. Verifique as configurações do Firebase',
      'auth/user-disabled': 'Conta desabilitada'
    }
    
    if (error?.code && errorMap[error.code]) {
      return errorMap[error.code]
    }
    
    if (error?.message) {
      return error.message
    }
    
    return 'Erro inesperado. Tente novamente.'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    console.log('🚀 Submit iniciado:', { 
      isLogin, 
      email: formData.email,
      hasRegister: typeof register === 'function',
      hasLogin: typeof login === 'function'
    })

    try {
      if (isLogin) {
        console.log('🔐 Fazendo login...')
        if (typeof login !== 'function') {
          throw new Error('Função de login não está disponível')
        }
        await login(formData.email, formData.password)
        console.log('✅ Login concluído')
      } else {
        console.log('📝 Criando conta...')
        
        // Validações client-side
        if (!formData.name.trim()) {
          throw new Error('Nome é obrigatório')
        }
        if (formData.name.trim().length < 2) {
          throw new Error('Nome deve ter pelo menos 2 caracteres')
        }
        if (!formData.email.trim()) {
          throw new Error('Email é obrigatório')
        }
        if (!formData.password) {
          throw new Error('Senha é obrigatória')
        }
        if (formData.password.length < 6) {
          throw new Error('Senha deve ter pelo menos 6 caracteres')
        }
        
        if (typeof register !== 'function') {
          throw new Error('Função de registro não está disponível')
        }
        
        await register(formData.email, formData.password, formData.name.trim())
        console.log('✅ Conta criada com sucesso')
      }
    } catch (err: any) {
      console.error('❌ Erro capturado:', err)
      const errorMessage = translateFirebaseError(err)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setSuccess('')
    setIsLoading(true)

    console.log('🔗 Iniciando login com Google...', {
      hasFunction: typeof loginWithGoogle === 'function'
    })

    try {
      if (typeof loginWithGoogle !== 'function') {
        throw new Error('Função de login com Google não está disponível')
      }
      
      await loginWithGoogle()
      console.log('✅ Login com Google concluído')
    } catch (err: any) {
      console.error('❌ Erro no Google login:', err)
      setError(translateFirebaseError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
      setError('Digite seu email primeiro')
      return
    }

    setError('')
    setSuccess('')

    try {
      console.log('📧 Enviando reset de senha...')
      
      if (typeof resetPassword !== 'function') {
        throw new Error('Função de reset de senha não está disponível')
      }
      
      await resetPassword(formData.email)
      setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.')
      console.log('✅ Email de reset enviado')
    } catch (err: any) {
      console.error('❌ Erro no reset:', err)
      setError(translateFirebaseError(err))
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setSuccess('')
    setFormData({ name: '', email: '', password: '' })
  }

  return (
    <div className="min-h-screen bg-theme-primary flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-purple-700 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <img 
                src="/img/logo.png" 
                alt="InventoryX" 
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-theme-primary mb-2">
            <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-cyan-500 bg-clip-text text-transparent">
              InventoryX
            </span>
          </h1>
          <p className="text-theme-secondary">
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta gratuita'}
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-theme-panel rounded-2xl shadow-theme-medium p-8 border border-theme-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Campo Nome (apenas no registro) */}
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-theme-primary mb-2">
                  Nome completo
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLogin}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 bg-theme-primary border border-theme-soft rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-theme-primary placeholder-theme-secondary transition-all disabled:opacity-50"
                    placeholder="Digite seu nome completo"
                  />
                </div>
              </div>
            )}

            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-theme-primary mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 bg-theme-primary border border-theme-soft rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-theme-primary placeholder-theme-secondary transition-all disabled:opacity-50"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-theme-primary">
                  Senha
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                    className="text-xs text-purple-600 hover:text-purple-700 transition-colors disabled:opacity-50"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-12 py-3 bg-theme-primary border border-theme-soft rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-theme-primary placeholder-theme-secondary transition-all disabled:opacity-50"
                  placeholder={isLogin ? 'Sua senha' : 'Mínimo 6 caracteres'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-theme-secondary hover:text-theme-primary transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mensagens de Erro/Sucesso */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm">
                {success}
              </div>
            )}

            {/* Botão Principal */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isLogin ? 'Entrando...' : 'Criando conta...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Entrar' : 'Criar conta'}
                </>
              )}
            </button>

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-theme-soft"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-theme-panel text-theme-secondary">ou</span>
              </div>
            </div>

            {/* Botão Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLogin ? 'Entrar com Google' : 'Criar conta com Google'}
            </button>

          </form>

          {/* Toggle Login/Registro */}
          <div className="mt-6 text-center">
            <p className="text-theme-secondary text-sm">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              <button
                onClick={toggleMode}
                disabled={isLoading}
                className="ml-2 text-purple-600 hover:text-purple-700 font-medium transition-colors disabled:opacity-50"
              >
                {isLogin ? 'Criar conta' : 'Fazer login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
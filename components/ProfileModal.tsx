'use client'

import { useState } from 'react'
import { User, Crown, Zap, Camera, Settings, X, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { uploadProfilePhotoToFirestore, validateImageFileForFirestore, getUserPhoto } from '@/lib/firebase-photo'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenSettings: () => void
}

export default function ProfileModal({ isOpen, onClose, onOpenSettings }: ProfileModalProps) {
  // Estados
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' })
  const [preview, setPreview] = useState<string | null>(null)

  // Dados do usuário
  const { user, userProfile } = useAuth()

  // Não renderizar se modal fechado ou sem usuário
  if (!isOpen || !user) return null

  // Extrair dados do usuário
  const name = user.displayName || userProfile?.displayName || 'Usuário'
  const email = user.email || ''
  const photo = preview || getUserPhoto(user, userProfile) // Prioriza Firestore
  const level = userProfile?.level || 1
  const xp = userProfile?.xp || 0
  const memberSince = userProfile?.createdAt || user.metadata?.creationTime

  // Formatar data de membro
  const formatMemberDate = (date: string | undefined) => {
    if (!date) return 'Hoje'
    return new Date(date).toLocaleDateString('pt-BR')
  }

  // Limpar estados
  const clearStates = () => {
    setMessage({ type: null, text: '' })
    setPreview(null)
    setProgress(0)
  }

  // Fechar modal
  const handleClose = () => {
    clearStates()
    onClose()
  }

  // Abrir configurações
  const handleOpenSettings = () => {
    clearStates()
    onClose()
    onOpenSettings()
  }

  // Upload de foto
  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Resetar estados
    setMessage({ type: null, text: '' })
    setProgress(0)

    // Validar arquivo
    const validation = validateImageFileForFirestore(file)
    if (!validation.valid) {
      setMessage({ type: 'error', text: validation.error || 'Arquivo inválido' })
      return
    }

    // Mostrar preview imediato
    const objectURL = URL.createObjectURL(file)
    setPreview(objectURL)

    setUploading(true)

    try {
      // Upload da foto
      const result = await uploadProfilePhotoToFirestore(
        file,
        user.uid,
        (progressValue) => {
          setProgress(progressValue)
        }
      )

      if (result.success && result.photoURL) {
        setMessage({ type: 'success', text: 'Foto atualizada com sucesso!' })
        setPreview(result.photoURL)
        
        // Auto-remover mensagem após 3 segundos
        setTimeout(() => {
          setMessage({ type: null, text: '' })
        }, 3000)
      } else {
        throw new Error(result.error || 'Falha no upload')
      }

    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erro ao enviar foto' })
      setPreview(null)
    } finally {
      setUploading(false)
      setProgress(0)
      // Limpar input para permitir re-upload
      event.target.value = ''
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-theme-panel rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-theme-soft">
          <h2 className="text-xl font-bold text-theme-primary">Meu Perfil</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-theme-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-theme-secondary" />
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="p-6">
          
          {/* Foto e Info do Usuário */}
          <div className="text-center mb-6">
            
            {/* Avatar com botão de upload */}
            <div className="relative inline-block mb-4">
              {photo ? (
                <img
                  src={photo}
                  alt={name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center border-4 border-white shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
              
              {/* Botão da câmera */}
              <label
                htmlFor="photo-input"
                className={`
                  absolute bottom-0 right-0 w-8 h-8 rounded-full 
                  bg-gradient-to-r from-green-500 to-green-600 
                  flex items-center justify-center cursor-pointer 
                  hover:scale-110 transition-transform shadow-lg
                  ${uploading ? 'pointer-events-none opacity-50' : ''}
                `}
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-white" />
                )}
              </label>
              
              <input
                id="photo-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                disabled={uploading}
                className="hidden"
              />
            </div>

            {/* Nome e Email */}
            <h3 className="text-lg font-semibold text-theme-primary">{name}</h3>
            <p className="text-theme-secondary text-sm">{email}</p>
            <p className="text-xs text-theme-secondary mt-1">
              Clique na câmera para alterar
            </p>
          </div>

          {/* Barra de Progresso */}
          {uploading && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-theme-secondary">Salvando...</span>
                <span className="text-theme-secondary">{progress}%</span>
              </div>
              <div className="w-full bg-theme-hover rounded-full h-2">
                <div 
                  className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Mensagens */}
          {message.type && (
            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
                : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              <span className="text-sm flex-1">{message.text}</span>
              <button
                onClick={() => setMessage({ type: null, text: '' })}
                className="opacity-70 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Estatísticas do Usuário */}
          <div className="space-y-3 mb-6">
            
            {/* Nível */}
            <div className="flex items-center justify-between p-3 bg-theme-hover rounded-lg">
              <span className="text-theme-primary font-medium">Nível</span>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-600" />
                <span className="font-bold text-theme-primary">{level}</span>
              </div>
            </div>

            {/* XP */}
            <div className="flex items-center justify-between p-3 bg-theme-hover rounded-lg">
              <span className="text-theme-primary font-medium">Experiência</span>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-theme-primary">{xp} XP</span>
              </div>
            </div>

            {/* Data de Cadastro */}
            <div className="flex items-center justify-between p-3 bg-theme-hover rounded-lg">
              <span className="text-theme-primary font-medium">Membro desde</span>
              <span className="font-bold text-theme-primary">
                {formatMemberDate(memberSince)}
              </span>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-theme-hover hover:bg-theme-soft text-theme-primary rounded-lg transition-colors font-medium"
            >
              Fechar
            </button>
            <button
              onClick={handleOpenSettings}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
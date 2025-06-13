'use client'

import { useState } from 'react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [notifications, setNotifications] = useState(true)
  const [autoTheme, setAutoTheme] = useState(false)
  const [systemSounds, setSystemSounds] = useState(true)

  if (!isOpen) return null

  const handleSave = () => {
    console.log('💾 Configurações salvas:', {
      notifications,
      autoTheme,
      systemSounds
    })
    onClose()
  }

  const ToggleSwitch = ({ 
    enabled, 
    onChange 
  }: { 
    enabled: boolean
    onChange: (value: boolean) => void 
  }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-12 h-6 rounded-full relative transition-colors ${
        enabled ? 'bg-purple-600' : 'bg-gray-300'
      }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
          enabled ? 'right-0.5' : 'left-0.5'
        }`}
      />
    </button>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-theme-panel rounded-xl max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-theme-primary">Configurações</h2>
          <button
            onClick={onClose}
            className="text-theme-secondary hover:text-theme-primary transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Notificações */}
          <div className="p-4 border border-theme-soft rounded-lg">
            <h3 className="font-semibold text-theme-primary mb-2 flex items-center gap-2">
              🔔 Notificações
            </h3>
            <p className="text-sm text-theme-secondary mb-3">
              Controle como você recebe notificações
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-primary">Notificações push</span>
              <ToggleSwitch 
                enabled={notifications} 
                onChange={setNotifications} 
              />
            </div>
          </div>

          {/* Aparência */}
          <div className="p-4 border border-theme-soft rounded-lg">
            <h3 className="font-semibold text-theme-primary mb-2 flex items-center gap-2">
              🎨 Aparência
            </h3>
            <p className="text-sm text-theme-secondary mb-3">
              Personalize a interface do aplicativo
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-primary">Tema automático</span>
              <ToggleSwitch 
                enabled={autoTheme} 
                onChange={setAutoTheme} 
              />
            </div>
          </div>

          {/* Som */}
          <div className="p-4 border border-theme-soft rounded-lg">
            <h3 className="font-semibold text-theme-primary mb-2 flex items-center gap-2">
              🎵 Som
            </h3>
            <p className="text-sm text-theme-secondary mb-3">
              Configurações de áudio e música
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-primary">Sons do sistema</span>
              <ToggleSwitch 
                enabled={systemSounds} 
                onChange={setSystemSounds} 
              />
            </div>
          </div>

          {/* Conta */}
          <div className="p-4 border border-theme-soft rounded-lg">
            <h3 className="font-semibold text-theme-primary mb-2 flex items-center gap-2">
              👤 Conta
            </h3>
            <p className="text-sm text-theme-secondary mb-3">
              Gerencie sua conta e dados
            </p>
            <div className="space-y-2">
              <button className="w-full text-left text-sm text-theme-primary hover:bg-theme-hover p-2 rounded transition-colors">
                Alterar senha
              </button>
              <button className="w-full text-left text-sm text-theme-primary hover:bg-theme-hover p-2 rounded transition-colors">
                Exportar dados
              </button>
              <button className="w-full text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded transition-colors">
                Excluir conta
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-theme-hover hover:bg-theme-soft text-theme-primary rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-lg transition-all"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
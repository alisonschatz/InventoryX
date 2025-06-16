'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Coffee,
  Clock,
  Target,
  TrendingUp,
  Settings as SettingsIcon,
  X,
  Volume2,
  VolumeX,
  Plus,
  Minus
} from 'lucide-react'

// ========================= TYPES =========================

interface PomodoroSession {
  id: string
  type: 'work' | 'shortBreak' | 'longBreak'
  duration: number
  completedAt: string
  interrupted: boolean
}

interface PomodoroSettings {
  workDuration: number      // em minutos
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number // a cada quantos pomodoros
  autoStartBreaks: boolean
  autoStartWork: boolean
  soundEnabled: boolean
  volume: number
}

interface PomodoroToolProps {
  isOpen: boolean
  onClose: () => void
}

type TimerState = 'idle' | 'running' | 'paused'
type SessionType = 'work' | 'shortBreak' | 'longBreak'

// ========================= MAIN COMPONENT =========================

export default function PomodoroTool({ isOpen, onClose }: PomodoroToolProps) {
  // ========================= SETTINGS STATE =========================
  
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartWork: false,
    soundEnabled: true,
    volume: 80
  })

  // ========================= TIMER STATE =========================
  
  const [currentSession, setCurrentSession] = useState<SessionType>('work')
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60) // em segundos
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [totalSessions, setTotalSessions] = useState(0)
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  
  // ========================= UI STATE =========================
  
  const [showSettings, setShowSettings] = useState(false)
  const [currentTask, setCurrentTask] = useState('')
  const [showStats, setShowStats] = useState(false)

  // ========================= REFS =========================
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // ========================= EFFECTS =========================

  // Carregar dados do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('inventoryX-pomodoro-settings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(parsed)
      setTimeLeft(parsed.workDuration * 60)
    }

    const savedSessions = localStorage.getItem('inventoryX-pomodoro-sessions')
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions)
      setSessions(parsed)
      setCompletedPomodoros(parsed.filter((s: PomodoroSession) => s.type === 'work' && !s.interrupted).length)
      setTotalSessions(parsed.length)
    }

    const savedTask = localStorage.getItem('inventoryX-pomodoro-task')
    if (savedTask) {
      setCurrentTask(savedTask)
    }
  }, [])

  // Salvar configurações
  useEffect(() => {
    localStorage.setItem('inventoryX-pomodoro-settings', JSON.stringify(settings))
  }, [settings])

  // Salvar sessões
  useEffect(() => {
    localStorage.setItem('inventoryX-pomodoro-sessions', JSON.stringify(sessions))
  }, [sessions])

  // Salvar tarefa atual
  useEffect(() => {
    localStorage.setItem('inventoryX-pomodoro-task', currentTask)
  }, [currentTask])

  // Timer principal
  useEffect(() => {
    if (timerState === 'running' && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timerState, timeLeft])

  // Inicializar áudio
  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.volume = settings.volume / 100
  }, [settings.volume])

  // ========================= HANDLERS =========================

  const playNotificationSound = () => {
    if (settings.soundEnabled && audioRef.current) {
      // Som simples usando Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)
      
      gainNode.gain.setValueAtTime(settings.volume / 200, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    }
  }

  const handleSessionComplete = () => {
    playNotificationSound()
    
    // Registrar sessão completada
    const newSession: PomodoroSession = {
      id: Date.now().toString(),
      type: currentSession,
      duration: getCurrentDuration(),
      completedAt: new Date().toISOString(),
      interrupted: false
    }
    
    setSessions(prev => [newSession, ...prev])
    
    if (currentSession === 'work') {
      setCompletedPomodoros(prev => prev + 1)
    }
    
    setTotalSessions(prev => prev + 1)
    
    // Determinar próxima sessão
    let nextSession: SessionType = 'work'
    if (currentSession === 'work') {
      const nextPomodoroCount = completedPomodoros + 1
      if (nextPomodoroCount % settings.longBreakInterval === 0) {
        nextSession = 'longBreak'
      } else {
        nextSession = 'shortBreak'
      }
    }
    
    setCurrentSession(nextSession)
    setTimeLeft(getSessionDuration(nextSession))
    
    // Auto-start se configurado
    if ((nextSession !== 'work' && settings.autoStartBreaks) || 
        (nextSession === 'work' && settings.autoStartWork)) {
      setTimerState('running')
    } else {
      setTimerState('idle')
    }
  }

  const getCurrentDuration = () => {
    switch (currentSession) {
      case 'work': return settings.workDuration
      case 'shortBreak': return settings.shortBreakDuration
      case 'longBreak': return settings.longBreakDuration
    }
  }

  const getSessionDuration = (session: SessionType) => {
    switch (session) {
      case 'work': return settings.workDuration * 60
      case 'shortBreak': return settings.shortBreakDuration * 60
      case 'longBreak': return settings.longBreakDuration * 60
    }
  }

  const startTimer = () => {
    setTimerState('running')
  }

  const pauseTimer = () => {
    setTimerState('paused')
  }

  const stopTimer = () => {
    if (timerState === 'running' && timeLeft < getCurrentDuration() * 60) {
      // Registrar como interrompido se estava rodando
      const interruptedSession: PomodoroSession = {
        id: Date.now().toString(),
        type: currentSession,
        duration: getCurrentDuration(),
        completedAt: new Date().toISOString(),
        interrupted: true
      }
      setSessions(prev => [interruptedSession, ...prev])
      setTotalSessions(prev => prev + 1)
    }
    
    setTimerState('idle')
    setTimeLeft(getCurrentDuration() * 60)
  }

  const resetTimer = () => {
    setTimerState('idle')
    setTimeLeft(getCurrentDuration() * 60)
  }

  const switchSession = (session: SessionType) => {
    setCurrentSession(session)
    setTimeLeft(getSessionDuration(session))
    setTimerState('idle')
  }

  // ========================= COMPUTED VALUES =========================

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getSessionLabel = () => {
    switch (currentSession) {
      case 'work': return '🍅 Trabalho'
      case 'shortBreak': return '☕ Pausa Curta'
      case 'longBreak': return '🏖️ Pausa Longa'
    }
  }

  const getSessionColor = () => {
    switch (currentSession) {
      case 'work': return 'from-red-500 to-red-600'
      case 'shortBreak': return 'from-green-500 to-green-600'
      case 'longBreak': return 'from-blue-500 to-blue-600'
    }
  }

  const progress = ((getCurrentDuration() * 60 - timeLeft) / (getCurrentDuration() * 60)) * 100

  const todaysSessions = sessions.filter(session => {
    const today = new Date().toDateString()
    const sessionDate = new Date(session.completedAt).toDateString()
    return today === sessionDate
  })

  // ========================= RENDER =========================

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-theme-panel rounded-2xl w-full max-w-2xl shadow-2xl border border-theme-soft overflow-hidden">
        
        {/* =================== HEADER =================== */}
        <div className="flex items-center justify-between p-6 border-b border-theme-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-lg">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-theme-primary">Pomodoro Timer</h2>
              <p className="text-sm text-theme-secondary">
                Técnica de produtividade com intervalos focados
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-theme-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-theme-secondary" />
          </button>
        </div>

        {/* =================== TIMER DISPLAY =================== */}
        <div className="p-8 text-center">
          
          {/* Session Type */}
          <div className="mb-6">
            <div className={`inline-flex px-4 py-2 rounded-full text-white font-medium bg-gradient-to-r ${getSessionColor()}`}>
              {getSessionLabel()}
            </div>
          </div>

          {/* Timer */}
          <div className="mb-8">
            <div className="text-6xl md:text-7xl font-bold text-theme-primary mb-4 font-mono">
              {formatTime(timeLeft)}
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-theme-hover rounded-full h-2 mb-4">
              <div 
                className={`h-full rounded-full transition-all duration-300 bg-gradient-to-r ${getSessionColor()}`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Current Task */}
            <input
              type="text"
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              placeholder="Em que você está trabalhando?"
              className="w-full max-w-md mx-auto px-4 py-2 bg-theme-hover border border-theme-soft rounded-lg text-center text-theme-primary placeholder-theme-secondary"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {timerState === 'idle' || timerState === 'paused' ? (
              <button
                onClick={startTimer}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5" />
                {timerState === 'paused' ? 'Continuar' : 'Iniciar'}
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl"
              >
                <Pause className="w-5 h-5" />
                Pausar
              </button>
            )}

            <button
              onClick={stopTimer}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all font-medium"
            >
              <Square className="w-5 h-5" />
              Parar
            </button>

            <button
              onClick={resetTimer}
              className="flex items-center gap-2 px-4 py-3 bg-theme-hover hover:bg-theme-soft text-theme-primary rounded-lg transition-all border border-theme-soft"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>

          {/* Session Switcher */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              onClick={() => switchSession('work')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentSession === 'work' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-theme-hover text-theme-primary hover:bg-theme-soft'
              }`}
            >
              🍅 Trabalho
            </button>
            <button
              onClick={() => switchSession('shortBreak')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentSession === 'shortBreak' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-theme-hover text-theme-primary hover:bg-theme-soft'
              }`}
            >
              ☕ Pausa
            </button>
            <button
              onClick={() => switchSession('longBreak')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentSession === 'longBreak' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-theme-hover text-theme-primary hover:bg-theme-soft'
              }`}
            >
              🏖️ Descanso
            </button>
          </div>
        </div>

        {/* =================== STATS =================== */}
        <div className="px-6 py-4 bg-theme-hover border-t border-theme-soft">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-theme-primary">{completedPomodoros}</div>
              <div className="text-xs text-theme-secondary">Pomodoros Hoje</div>
            </div>
            <div>
              <div className="text-lg font-bold text-theme-primary">{todaysSessions.length}</div>
              <div className="text-xs text-theme-secondary">Sessões Hoje</div>
            </div>
            <div>
              <div className="text-lg font-bold text-theme-primary">
                {Math.round((todaysSessions.filter(s => !s.interrupted).length / Math.max(todaysSessions.length, 1)) * 100)}%
              </div>
              <div className="text-xs text-theme-secondary">Taxa de Conclusão</div>
            </div>
          </div>
        </div>

        {/* =================== BOTTOM CONTROLS =================== */}
        <div className="flex items-center justify-between p-4 border-t border-theme-soft">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-3 py-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-hover rounded-lg transition-all"
          >
            <SettingsIcon className="w-4 h-4" />
            Configurações
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
              className="p-2 text-theme-secondary hover:text-theme-primary hover:bg-theme-hover rounded-lg transition-all"
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* =================== SETTINGS PANEL =================== */}
        {showSettings && (
          <div className="border-t border-theme-soft p-6 bg-theme-hover">
            <h3 className="text-lg font-semibold text-theme-primary mb-4">Configurações</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Durações */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-theme-primary mb-1">
                    Trabalho (minutos)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, workDuration: Math.max(1, prev.workDuration - 1) }))}
                      className="p-1 hover:bg-theme-soft rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-theme-primary font-mono">{settings.workDuration}</span>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, workDuration: Math.min(60, prev.workDuration + 1) }))}
                      className="p-1 hover:bg-theme-soft rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-theme-primary mb-1">
                    Pausa Curta (minutos)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, shortBreakDuration: Math.max(1, prev.shortBreakDuration - 1) }))}
                      className="p-1 hover:bg-theme-soft rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-theme-primary font-mono">{settings.shortBreakDuration}</span>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, shortBreakDuration: Math.min(30, prev.shortBreakDuration + 1) }))}
                      className="p-1 hover:bg-theme-soft rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-theme-primary mb-1">
                    Pausa Longa (minutos)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, longBreakDuration: Math.max(1, prev.longBreakDuration - 1) }))}
                      className="p-1 hover:bg-theme-soft rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-theme-primary font-mono">{settings.longBreakDuration}</span>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, longBreakDuration: Math.min(60, prev.longBreakDuration + 1) }))}
                      className="p-1 hover:bg-theme-soft rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Configurações */}
              <div className="space-y-3">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.autoStartBreaks}
                      onChange={(e) => setSettings(prev => ({ ...prev, autoStartBreaks: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm text-theme-primary">Auto-iniciar pausas</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.autoStartWork}
                      onChange={(e) => setSettings(prev => ({ ...prev, autoStartWork: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm text-theme-primary">Auto-iniciar trabalho</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-theme-primary mb-1">
                    Volume da Notificação
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.volume}
                    onChange={(e) => setSettings(prev => ({ ...prev, volume: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
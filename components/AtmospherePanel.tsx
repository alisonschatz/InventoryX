'use client'

import { useState, useRef, useEffect } from 'react'
import { Track } from '@/lib/youtube-player'

interface AtmospherePanelProps {
  atmosphereOpen: boolean
  setAtmosphereOpen: (open: boolean) => void
  currentTrack: Track | null
  setCurrentTrack: (track: Track) => void
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  volume: number
  setVolume: (volume: number) => void
  playerRef: React.RefObject<HTMLDivElement>
  availableTracks: Track[]
  loadCustomTrack: (youtubeUrl: string) => void
  clearCurrentTrack: () => void
}

export default function AtmospherePanel({
  atmosphereOpen,
  setAtmosphereOpen,
  currentTrack,
  setCurrentTrack,
  isPlaying,
  setIsPlaying,
  volume,
  setVolume,
  availableTracks,
  clearCurrentTrack
}: AtmospherePanelProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Ref local para o elemento de áudio HTML5 
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Garantir que o áudio persista no DOM mesmo quando o painel é fechado
  useEffect(() => {
    let audio = document.getElementById('atmosphere-persistent-audio') as HTMLAudioElement
    if (!audio) {
      audio = document.createElement('audio')
      audio.id = 'atmosphere-persistent-audio'
      audio.preload = 'metadata'
      audio.style.display = 'none'
      document.body.appendChild(audio)
    }
    audioRef.current = audio

    return () => {
      // NÃO remover o áudio - deixar persistente
    }
  }, [])

  // Sincronizar volume com o elemento de áudio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  // Event listeners do áudio
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedData = () => {
      setLoading(false)
    }

    const handleError = () => {
      setError('Erro ao carregar áudio')
      setLoading(false)
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    audio.addEventListener('loadeddata', handleLoadedData)
    audio.addEventListener('error', handleError)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [currentTrack])

  // Handler para seleção de track
  const handleTrackSelect = (track: Track) => {
    console.log('🎯 Selecionando track:', track.name)
    
    setError('')
    setLoading(true)
    
    if (audioRef.current) {
      audioRef.current.pause()
    }
    
    setCurrentTrack(track)
    
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = track.url
        audioRef.current.load()
        audioRef.current.play().then(() => {
          setIsPlaying(true)
          setLoading(false)
          console.log('✅ Áudio tocando com sucesso')
        }).catch((err) => {
          console.error('❌ Erro ao tocar áudio:', err)
          setError('Não foi possível tocar esta música')
          setLoading(false)
          setIsPlaying(false)
        })
      }
    }, 100)
  }

  // Handler para play/pause
  const handlePlayPause = () => {
    if (!audioRef.current || !currentTrack) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch((err) => {
        console.error('Erro ao tocar:', err)
        setError('Não foi possível tocar')
      })
    }
  }

  // Handler para parar música
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setError('')
    clearCurrentTrack()
  }

  // Retorno condicional APÓS todos os hooks
  if (!atmosphereOpen) return null

  return (
    <div className="border-t bg-gradient-to-r from-purple-50/30 via-purple-100/30 to-cyan-50/30 dark:from-purple-900/5 dark:via-purple-900/10 dark:to-cyan-900/5">
      <div className="max-w-5xl mx-auto px-4 py-3">
        
        {/* Layout Ultra Compacto em Uma Linha */}
        <div className="flex items-center justify-between gap-4">
          
          {/* Info da Música + Controles */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            
            {/* Controles Elegantes com Identidade Visual */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayPause}
                disabled={loading || !currentTrack}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm disabled:opacity-50 group ${
                  isPlaying 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' 
                    : 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600'
                } text-white`}
                title={isPlaying ? 'Pausar' : 'Tocar'}
              >
                {loading ? (
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                ) : isPlaying ? (
                  <div className="flex gap-0.5">
                    <div className="w-0.5 h-3 bg-white rounded-full"></div>
                    <div className="w-0.5 h-3 bg-white rounded-full"></div>
                  </div>
                ) : (
                  <div className="w-0 h-0 border-l-[5px] border-l-white border-y-[3px] border-y-transparent ml-0.5"></div>
                )}
              </button>
              
              {currentTrack && (
                <button
                  onClick={handleStop}
                  className="w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white rounded-full flex items-center justify-center transition-all group"
                  title="Parar"
                >
                  <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>
                </button>
              )}
            </div>

            {/* Info da Música Compacta */}
            {currentTrack ? (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-theme-primary truncate">{currentTrack.name}</div>
                <div className="text-xs text-theme-secondary truncate">{currentTrack.artist.split(' - ')[0]}</div>
              </div>
            ) : (
              <div className="flex-1 text-sm text-theme-secondary">
                🎵 Selecione uma rádio
              </div>
            )}

            {/* Status Visual Minimalista */}
            {isPlaying && (
              <div className="flex items-center gap-0.5">
                <div className="w-0.5 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-0.5 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-0.5 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            )}
          </div>

          {/* Seletor de Rádios Inline */}
          <div className="flex items-center gap-2">
            {availableTracks.map((track) => (
              <button
                key={track.id}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                  currentTrack?.id === track.id
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-sm'
                    : 'bg-white/50 dark:bg-gray-800/50 text-theme-primary border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
                onClick={() => handleTrackSelect(track)}
                title={`${track.name} - ${track.artist}`}
              >
                {track.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Volume + Close */}
          <div className="flex items-center gap-3">
            
            {/* Volume Compacto */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-theme-secondary">🔊</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${volume}%, #e5e7eb ${volume}%, #e5e7eb 100%)`
                }}
              />
              <span className="text-xs text-theme-secondary w-6">{volume}%</span>
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => setAtmosphereOpen(false)}
              className="text-theme-secondary hover:text-theme-primary w-5 h-5 rounded-full hover:bg-white/30 dark:hover:bg-black/20 flex items-center justify-center transition-all text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Erro (se houver) */}
        {error && (
          <div className="mt-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
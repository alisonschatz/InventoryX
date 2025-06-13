import { useState, useEffect, useRef } from 'react'
import { Track, YouTubePlayerManager, PlayerState, DEFAULT_TRACKS, isValidAudioUrl } from '@/lib/youtube-player'

export interface AtmosphereHookReturn {
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
  playerState: PlayerState
  loadCustomTrack: (audioUrl: string) => Promise<void>
  clearCurrentTrack: () => void
}

export const useAtmosphere = (): AtmosphereHookReturn => {
  const [atmosphereOpen, setAtmosphereOpen] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(50)
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 50,
    loading: false
  })

  const playerRef = useRef<HTMLDivElement>(null)
  const playerManagerRef = useRef<YouTubePlayerManager | null>(null)

  // Inicializar audio manager
  useEffect(() => {
    console.log('🎵 Inicializando AudioManager')
    
    playerManagerRef.current = new YouTubePlayerManager((state) => {
      console.log('📊 Estado do áudio atualizado:', state)
      setPlayerState(state)
      setIsPlaying(state.isPlaying)
      setVolume(state.volume)
    })

    // Sincronizar com o áudio persistente global
    const syncWithPersistentAudio = () => {
      const audio = document.getElementById('atmosphere-persistent-audio') as HTMLAudioElement
      if (audio) {
        const handlePlay = () => {
          console.log('🎵 Evento global: áudio iniciou')
          setIsPlaying(true)
        }
        
        const handlePause = () => {
          console.log('⏸️ Evento global: áudio pausou')
          setIsPlaying(false)
        }
        
        const handleEnded = () => {
          console.log('🔚 Evento global: áudio terminou')
          setIsPlaying(false)
        }

        audio.addEventListener('play', handlePlay)
        audio.addEventListener('pause', handlePause)
        audio.addEventListener('ended', handleEnded)

        return () => {
          audio.removeEventListener('play', handlePlay)
          audio.removeEventListener('pause', handlePause)
          audio.removeEventListener('ended', handleEnded)
        }
      }
    }

    // Aguardar um pouco para o áudio ser criado
    const timeoutId = setTimeout(syncWithPersistentAudio, 500)

    return () => {
      console.log('🧹 Limpando audio manager')
      clearTimeout(timeoutId)
      if (playerManagerRef.current) {
        playerManagerRef.current.destroyPlayer()
      }
    }
  }, [])

  // Carregar track quando selecionada
  const handleSetCurrentTrack = (track: Track) => {
    console.log('🎯 Hook: Selecionando track:', track.name)
    
    // Verificar se temos playerManager
    if (playerManagerRef.current) {
      try {
        // Se playerRef estiver disponível, usar o manager
        if (playerRef.current) {
          playerManagerRef.current.createPlayer(playerRef.current, track, true)
          console.log('✅ Track carregada via PlayerManager')
        } else {
          console.log('⚠️ PlayerRef não disponível, track será gerenciada pelo componente')
        }
        
        setCurrentTrack(track)
        setIsPlaying(true)
        console.log('✅ Estado do hook atualizado')
      } catch (error) {
        console.error('❌ Erro ao carregar track no hook:', error)
      }
    } else {
      console.error('❌ PlayerManager não disponível')
    }
  }

  // Toggle play/pause - com sincronização global
  const handleSetIsPlaying = (playing: boolean) => {
    console.log('⏯️ Hook: Toggle playback para:', playing, 'Track atual:', currentTrack?.name)
    
    // Acessar o áudio persistente diretamente
    const audio = document.getElementById('atmosphere-persistent-audio') as HTMLAudioElement
    if (audio && currentTrack) {
      if (playing) {
        audio.play().then(() => {
          console.log('✅ Hook: Play bem-sucedido')
          setIsPlaying(true)
        }).catch((err) => {
          console.error('❌ Hook: Erro no play:', err)
          setIsPlaying(false)
        })
      } else {
        audio.pause()
        console.log('⏸️ Hook: Pause bem-sucedido')
        setIsPlaying(false)
      }
    } else {
      console.warn('⚠️ Hook: Áudio ou track não disponível')
      setIsPlaying(playing)
    }
  }

  // Controle de volume
  const handleSetVolume = (newVolume: number) => {
    console.log('🔊 Hook: Ajustando volume para:', newVolume)
    
    if (playerManagerRef.current) {
      playerManagerRef.current.setVolume(newVolume)
    }
    setVolume(newVolume)
  }

  // Função para limpar track atual
  const clearCurrentTrack = () => {
    console.log('🗑️ Hook: Limpando track atual')
    
    if (playerManagerRef.current) {
      playerManagerRef.current.destroyPlayer()
    }
    
    setCurrentTrack(null)
    setIsPlaying(false)
  }

  // Carregar track customizada com URL de áudio
  const loadCustomTrack = async (audioUrl: string): Promise<void> => {
    console.log('🔗 Hook: Carregando áudio customizado:', audioUrl)
    
    try {
      if (!isValidAudioUrl(audioUrl)) {
        throw new Error('URL de áudio inválida. Use MP3, MP4, WAV, ou streams de rádio.')
      }

      const customTrack: Track = {
        id: Date.now(),
        name: 'Música Personalizada',
        artist: 'URL Customizada',
        duration: 'Carregando...',
        url: audioUrl
      }

      console.log('🎵 Track customizada criada:', customTrack)
      handleSetCurrentTrack(customTrack)
      
    } catch (error) {
      console.error('❌ Erro ao carregar áudio customizado:', error)
      throw error
    }
  }

  // Debug: Log do estado atual
  useEffect(() => {
    console.log('🔍 Estado atual do useAtmosphere:', {
      atmosphereOpen,
      currentTrack: currentTrack?.name || 'Nenhuma',
      isPlaying,
      volume,
      playerManagerExists: !!playerManagerRef.current,
      playerRefExists: !!playerRef.current
    })
  }, [atmosphereOpen, currentTrack, isPlaying, volume])

  return {
    atmosphereOpen,
    setAtmosphereOpen,
    currentTrack,
    setCurrentTrack: handleSetCurrentTrack,
    isPlaying,
    setIsPlaying: handleSetIsPlaying,
    volume,
    setVolume: handleSetVolume,
    playerRef,
    availableTracks: DEFAULT_TRACKS,
    playerState,
    loadCustomTrack,
    clearCurrentTrack
  }
}
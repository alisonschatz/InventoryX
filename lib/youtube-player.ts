// Serviço de áudio funcional - Substituindo YouTube por HTML5 Audio
export interface Track {
  id: number
  name: string
  artist: string
  duration: string
  url: string
  youtubeId?: string // Mantido para compatibilidade, mas não usado
}

export interface PlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  loading: boolean
}

// Extrair ID do YouTube (mantido para compatibilidade)
export const extractYouTubeId = (url: string): string | null => {
  const regexps = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/
  ]
  
  for (const regexp of regexps) {
    const match = url.match(regexp)
    if (match) {
      return match[1]
    }
  }
  
  return null
}

// Validar URL de áudio
export const isValidAudioUrl = (url: string): boolean => {
  try {
    new URL(url)
    // Verificar se é uma URL de áudio comum ou stream
    return url.includes('.mp3') || 
           url.includes('.mp4') || 
           url.includes('.wav') || 
           url.includes('.ogg') || 
           url.includes('.m4a') ||
           url.includes('stream') ||
           url.includes('radio') ||
           url.includes('.m3u8')
  } catch {
    return false
  }
}

// Manter função do YouTube para compatibilidade
export const isValidYouTubeUrl = (url: string): boolean => {
  return extractYouTubeId(url) !== null
}

// Apenas 3 tracks de alta qualidade SEM ANÚNCIOS - Foco Lo-Fi/Chill
export const DEFAULT_TRACKS: Track[] = [
  {
    id: 1,
    name: 'Groove Salad',
    artist: 'SomaFM - Ambient/Downtempo',
    duration: '24/7 Stream',
    url: 'https://ice.somafm.com/groovesalad'
  },
  {
    id: 2,
    name: 'Space Station Soma',
    artist: 'SomaFM - Spaced-out Ambient',
    duration: '24/7 Stream',
    url: 'https://ice.somafm.com/spacestation'
  },
  {
    id: 3,
    name: 'Drone Zone',
    artist: 'SomaFM - Atmospheric Textures',
    duration: '24/7 Stream', 
    url: 'https://ice.somafm.com/dronezone'
  }
]

// Classe para gerenciar áudio HTML5 - Substituindo YouTube
export class YouTubePlayerManager {
  private audio: HTMLAudioElement | null = null
  private currentTrack: Track | null = null
  private playerState: PlayerState = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 50,
    loading: false
  }
  private onStateChange?: (state: PlayerState) => void

  constructor(onStateChange?: (state: PlayerState) => void) {
    this.onStateChange = onStateChange
    console.log('🎵 AudioManager inicializado')
  }

  // Criar player de áudio
  createPlayer(container: HTMLElement, track: Track, autoplay: boolean = true): void {
    console.log('🎵 Criando player de áudio para:', track.name)
    
    // Remover player anterior
    this.destroyPlayer()
    
    // Criar elemento de áudio
    this.audio = new Audio()
    this.audio.preload = 'metadata'
    this.audio.volume = this.playerState.volume / 100
    
    // Event listeners
    this.setupEventListeners()
    
    // Carregar track
    this.audio.src = track.url
    this.currentTrack = track
    this.updateState({ loading: true })
    
    // Adicionar ao DOM (escondido)
    this.audio.style.display = 'none'
    container.appendChild(this.audio)
    
    // Autoplay se solicitado
    if (autoplay) {
      this.audio.load()
      this.audio.play().then(() => {
        this.updateState({ isPlaying: true, loading: false })
        console.log('✅ Áudio iniciado com sucesso')
      }).catch((error) => {
        console.error('❌ Erro no autoplay:', error)
        this.updateState({ isPlaying: false, loading: false })
      })
    } else {
      this.updateState({ loading: false })
    }
  }

  // Configurar event listeners do áudio
  private setupEventListeners(): void {
    if (!this.audio) return

    this.audio.addEventListener('loadeddata', () => {
      this.updateState({ 
        duration: this.audio?.duration || 0,
        loading: false 
      })
    })

    this.audio.addEventListener('timeupdate', () => {
      this.updateState({ 
        currentTime: this.audio?.currentTime || 0,
        duration: this.audio?.duration || 0
      })
    })

    this.audio.addEventListener('play', () => {
      this.updateState({ isPlaying: true })
    })

    this.audio.addEventListener('pause', () => {
      this.updateState({ isPlaying: false })
    })

    this.audio.addEventListener('ended', () => {
      this.updateState({ isPlaying: false, currentTime: 0 })
    })

    this.audio.addEventListener('error', (error) => {
      console.error('❌ Erro no áudio:', error)
      this.updateState({ isPlaying: false, loading: false })
    })

    this.audio.addEventListener('canplay', () => {
      this.updateState({ loading: false })
    })
  }

  // Destruir player
  destroyPlayer(): void {
    if (this.audio) {
      this.audio.pause()
      this.audio.removeAttribute('src')
      this.audio.load()
      if (this.audio.parentNode) {
        this.audio.parentNode.removeChild(this.audio)
      }
      this.audio = null
      console.log('🗑️ Player de áudio removido')
    }
    this.currentTrack = null
    this.updateState({ 
      isPlaying: false, 
      loading: false, 
      currentTime: 0, 
      duration: 0 
    })
  }

  // Carregar nova track
  loadTrack(track: Track, autoplay: boolean = true): void {
    console.log('🔄 Carregando nova track:', track.name)
    
    if (this.audio) {
      this.audio.pause()
      this.audio.src = track.url
      this.currentTrack = track
      this.updateState({ loading: true })
      
      this.audio.load()
      
      if (autoplay) {
        this.audio.play().then(() => {
          this.updateState({ isPlaying: true, loading: false })
        }).catch((error) => {
          console.error('❌ Erro ao tocar nova track:', error)
          this.updateState({ isPlaying: false, loading: false })
        })
      } else {
        this.updateState({ loading: false })
      }
    }
  }

  // Atualizar estado e notificar
  private updateState(newState: Partial<PlayerState>): void {
    this.playerState = { ...this.playerState, ...newState }
    if (this.onStateChange) {
      this.onStateChange(this.playerState)
    }
  }

  // Getters
  getCurrentTrack(): Track | null {
    return this.currentTrack
  }

  getPlayerState(): PlayerState {
    return { ...this.playerState }
  }

  // Controles de áudio
  togglePlayback(): void {
    if (!this.audio || !this.currentTrack) return

    if (this.playerState.isPlaying) {
      this.audio.pause()
    } else {
      this.audio.play().catch((error) => {
        console.error('❌ Erro ao tocar:', error)
      })
    }
  }

  setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(100, volume))
    this.updateState({ volume: clampedVolume })
    
    if (this.audio) {
      this.audio.volume = clampedVolume / 100
    }
    
    console.log('🔊 Volume ajustado para:', clampedVolume)
  }

  // Controles de posição (para arquivos, não streams)
  seek(time: number): void {
    if (this.audio && this.audio.duration && !isNaN(this.audio.duration)) {
      this.audio.currentTime = Math.max(0, Math.min(time, this.audio.duration))
    }
  }

  // Verificar se player está ativo
  isPlayerActive(): boolean {
    return this.audio !== null && this.currentTrack !== null
  }

  // Verificar se é stream (não tem duração definida)
  isStream(): boolean {
    return this.audio ? (isNaN(this.audio.duration) || this.audio.duration === Infinity) : false
  }
}
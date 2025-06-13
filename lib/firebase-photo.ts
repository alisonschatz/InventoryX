// Serviço para upload de foto usando Firestore (gratuito)
export interface PhotoUploadResult {
  success: boolean
  photoURL?: string
  error?: string
}

export const uploadProfilePhotoToFirestore = async (
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<PhotoUploadResult> => {
  try {
    console.log('📸 Iniciando upload da foto para Firestore...')

    // Import dinâmico do Firebase
    const [firestoreModule] = await Promise.all([
      import('firebase/firestore')
    ])

    const { doc, updateDoc } = firestoreModule

    // Obter instâncias do Firebase
    const { initializeFirebase } = await import('./firebase-client')
    const { auth, db } = await initializeFirebase()

    if (!auth || !db) {
      throw new Error('Firebase não está inicializado')
    }

    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('Usuário não está logado')
    }

    // Simular progresso inicial
    if (onProgress) onProgress(10)

    // Redimensionar imagem para economizar espaço
    console.log('🔧 Redimensionando imagem...')
    const resizedFile = await resizeImageForFirestore(file, 150) // Ainda menor para evitar limite
    
    if (onProgress) onProgress(30)

    // Converter para base64
    console.log('🔄 Convertendo para base64...')
    const base64 = await fileToBase64(resizedFile)
    
    if (onProgress) onProgress(60)

    // Criar data URL
    const photoURL = `data:${resizedFile.type};base64,${base64}`
    
    console.log('📊 Tamanho da imagem:', {
      original: file.size,
      redimensionada: resizedFile.size,
      base64Length: base64.length,
      photoURLLength: photoURL.length,
      reduction: `${((1 - resizedFile.size / file.size) * 100).toFixed(1)}%`
    })

    // Verificar se não está muito grande (Firebase Auth tem limite ~2KB)
    if (photoURL.length > 2048) {
      console.log('⚠️ PhotoURL muito grande para Firebase Auth, salvando apenas no Firestore')
    }

    if (onProgress) onProgress(80)

    // Salvar APENAS no Firestore (não no Firebase Auth para evitar erro)
    console.log('🗄️ Salvando no Firestore...')
    const userDocRef = doc(db, 'users', userId)
    await updateDoc(userDocRef, {
      photoURL: photoURL,
      lastUpdated: new Date().toISOString()
    })

    if (onProgress) onProgress(100)

    console.log('🎉 Foto de perfil salva com sucesso no Firestore!')
    
    return {
      success: true,
      photoURL: photoURL
    }

  } catch (error: any) {
    console.error('❌ Erro no upload:', error)
    return {
      success: false,
      error: error.message || 'Erro inesperado no upload'
    }
  }
}

// Converter arquivo para base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      const result = reader.result as string
      // Remover o prefixo "data:image/...;base64,"
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'))
    }
    
    reader.readAsDataURL(file)
  })
}

// Redimensionar imagem específica para Firestore (ainda menor)
const resizeImageForFirestore = (file: File, maxWidth: number = 150): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calcular novas dimensões (quadrado para foto de perfil)
      const size = Math.min(maxWidth, img.width, img.height)
      canvas.width = size
      canvas.height = size

      // Calcular posição para centralizar a imagem
      const aspectRatio = img.width / img.height
      let sx = 0, sy = 0, sw = img.width, sh = img.height

      if (aspectRatio > 1) {
        // Imagem mais larga - cortar as laterais
        sw = img.height
        sx = (img.width - img.height) / 2
      } else if (aspectRatio < 1) {
        // Imagem mais alta - cortar topo/baixo
        sh = img.width
        sy = (img.height - img.width) / 2
      }

      // Desenhar imagem redimensionada e cortada
      ctx?.drawImage(img, sx, sy, sw, sh, 0, 0, size, size)

      // Converter canvas para blob com alta compressão
      canvas.toBlob((blob) => {
        if (blob) {
          const resizedFile = new File([blob], file.name, {
            type: 'image/jpeg', // Sempre JPEG para menor tamanho
            lastModified: Date.now()
          })
          resolve(resizedFile)
        } else {
          resolve(file) // Fallback
        }
      }, 'image/jpeg', 0.6) // 60% de qualidade para ainda menor tamanho
    }

    img.src = URL.createObjectURL(file)
  })
}

// Validação de arquivo (mais restritiva para Firestore)
export const validateImageFileForFirestore = (file: File): { valid: boolean; error?: string } => {
  // Verificar tipo
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Por favor, selecione apenas arquivos de imagem' }
  }

  // Verificar tamanho original (2MB máximo para evitar problemas)
  const maxSize = 2 * 1024 * 1024 // 2MB
  if (file.size > maxSize) {
    return { valid: false, error: 'A imagem deve ter menos de 2MB' }
  }

  // Verificar tipos suportados
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!supportedTypes.includes(file.type)) {
    return { valid: false, error: 'Tipo de arquivo não suportado. Use JPG, PNG ou WebP' }
  }

  return { valid: true }
}

// Função para limpar base64 antigo (opcional)
export const cleanupOldPhoto = async (userId: string): Promise<void> => {
  try {
    console.log('🧹 Limpando foto anterior...')
    
    // Como estamos usando Firestore, não há necessidade de limpeza manual
    // A foto anterior é substituída automaticamente
    
    console.log('✅ Limpeza concluída')
  } catch (error) {
    console.error('⚠️ Erro na limpeza:', error)
    // Não é crítico
  }
}

// Função utilitária para verificar se a URL é base64
export const isBase64Photo = (url: string | null): boolean => {
  return url ? url.startsWith('data:image/') : false
}

// Função para obter tamanho estimado em bytes do base64
export const getBase64Size = (base64: string): number => {
  return Math.ceil(base64.length * 0.75) // Base64 adiciona ~25% de overhead
}

// Função para obter foto do usuário (prioritiza Firestore sobre Firebase Auth)
export const getUserPhoto = (user: any, userProfile: any): string | null => {
  // Priorizar foto do Firestore (mais atualizada e sem limite de tamanho)
  if (userProfile?.photoURL) {
    return userProfile.photoURL
  }
  
  // Fallback para Firebase Auth (pode estar desatualizada)
  if (user?.photoURL) {
    return user.photoURL
  }
  
  return null
}
// Firebase inicializado apenas no cliente para evitar problemas de SSR
let firebaseApp: any = null
let firebaseAuth: any = null
let firebaseDb: any = null

const firebaseConfig = {
  apiKey: "AIzaSyCOBeKVlkmFrTfauDpJZwbkRpWM3uvClBQ",
  authDomain: "inventoryx-ef236.firebaseapp.com",
  projectId: "inventoryx-ef236",
  storageBucket: "inventoryx-ef236.firebasestorage.app",
  messagingSenderId: "279277377067",
  appId: "1:279277377067:web:1c35bf9ea1f2ab843b3c6e"
}

export const initializeFirebase = async () => {
  // Só executar no cliente
  if (typeof window === 'undefined') {
    console.log('⚠️ Firebase não pode ser inicializado no servidor')
    return { auth: null, db: null }
  }

  // Se já foi inicializado, retornar instâncias existentes
  if (firebaseApp && firebaseAuth && firebaseDb) {
    console.log('✅ Firebase já inicializado, retornando instâncias existentes')
    return { auth: firebaseAuth, db: firebaseDb }
  }

  try {
    console.log('🔥 Inicializando Firebase no cliente...')

    // Import dinâmico apenas no cliente
    const { initializeApp, getApps } = await import('firebase/app')
    const { getAuth } = await import('firebase/auth')
    const { getFirestore } = await import('firebase/firestore')

    // Inicializar app
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    firebaseAuth = getAuth(firebaseApp)
    firebaseDb = getFirestore(firebaseApp)

    console.log('✅ Firebase inicializado com sucesso no cliente')
    
    return { auth: firebaseAuth, db: firebaseDb }
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error)
    return { auth: null, db: null }
  }
}

// Funções para obter instâncias (só no cliente)
export const getFirebaseAuth = () => {
  if (typeof window === 'undefined') return null
  return firebaseAuth
}

export const getFirebaseDb = () => {
  if (typeof window === 'undefined') return null
  return firebaseDb
}

// Export das funções do Firebase que serão usadas
export const getFirebaseFunctions = async () => {
  if (typeof window === 'undefined') {
    return {
      createUserWithEmailAndPassword: null,
      signInWithEmailAndPassword: null,
      signOut: null,
      onAuthStateChanged: null,
      updateProfile: null,
      GoogleAuthProvider: null,
      signInWithPopup: null,
      sendPasswordResetEmail: null,
      doc: null,
      setDoc: null,
      getDoc: null
    }
  }

  try {
    const [authModule, firestoreModule] = await Promise.all([
      import('firebase/auth'),
      import('firebase/firestore')
    ])

    return {
      createUserWithEmailAndPassword: authModule.createUserWithEmailAndPassword,
      signInWithEmailAndPassword: authModule.signInWithEmailAndPassword,
      signOut: authModule.signOut,
      onAuthStateChanged: authModule.onAuthStateChanged,
      updateProfile: authModule.updateProfile,
      GoogleAuthProvider: authModule.GoogleAuthProvider,
      signInWithPopup: authModule.signInWithPopup,
      sendPasswordResetEmail: authModule.sendPasswordResetEmail,
      doc: firestoreModule.doc,
      setDoc: firestoreModule.setDoc,
      getDoc: firestoreModule.getDoc
    }
  } catch (error) {
    console.error('❌ Erro ao importar funções do Firebase:', error)
    return {
      createUserWithEmailAndPassword: null,
      signInWithEmailAndPassword: null,
      signOut: null,
      onAuthStateChanged: null,
      updateProfile: null,
      GoogleAuthProvider: null,
      signInWithPopup: null,
      sendPasswordResetEmail: null,
      doc: null,
      setDoc: null,
      getDoc: null
    }
  }
}
'use client'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-theme-primary flex items-center justify-center">
      <div className="text-center">
        
        {/* Logo com Animação */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 via-purple-700 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl mx-auto relative">
            <img 
              src="/img/logo.png" 
              alt="InventoryX" 
              className="w-20 h-20 object-contain"
            />
            {/* Pulse Animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-cyan-500 rounded-2xl animate-pulse opacity-30"></div>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold text-theme-primary mb-2">
          <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-cyan-500 bg-clip-text text-transparent">
            InventoryX
          </span>
        </h1>

        <p className="text-theme-secondary mb-8 text-lg">
          Organize suas ferramentas
        </p>

        {/* Loading Spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-theme-soft rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Texto de Loading */}
        <p className="text-theme-secondary text-sm animate-pulse">
          Preparando sua experiência...
        </p>

        {/* Barra de Progresso Animada */}
        <div className="w-80 max-w-sm mx-auto mt-8 bg-theme-hover rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 via-purple-700 to-cyan-500 rounded-full animate-pulse loading-bar"></div>
        </div>

        {/* Pontos de Loading */}
        <div className="flex justify-center mt-8 space-x-2">
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-700 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

      </div>

      {/* Animações CSS */}
      <style jsx>{`
        .loading-bar {
          animation: loading 2s ease-in-out infinite;
        }
        
        @keyframes loading {
          0% { 
            width: 0%;
            opacity: 0.3;
          }
          50% { 
            width: 80%;
            opacity: 1;
          }
          100% { 
            width: 100%;
            opacity: 0.3;
          }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0,-8px,0);
          }
          70% {
            transform: translate3d(0,-4px,0);
          }
          90% {
            transform: translate3d(0,-2px,0);
          }
        }
      `}</style>
    </div>
  )
}
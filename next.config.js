/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Resolver problemas de compatibilidade do Firebase com undici
    if (!isServer) {
      // Para o cliente (browser)
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "undici": false,
        "fs": false,
        "net": false,
        "tls": false,
        "crypto": false,
        "stream": false,
        "http": false,
        "https": false,
        "zlib": false,
        "path": false,
        "os": false,
        "url": false,
        "util": false,
        "querystring": false,
        "child_process": false,
        "worker_threads": false,
        "perf_hooks": false,
      }
    }

    // Para o servidor também
    config.externals = config.externals || []
    config.externals.push({
      'undici': 'commonjs undici',
      'node:http': 'commonjs http',
      'node:https': 'commonjs https',
      'node:url': 'commonjs url',
      'node:buffer': 'commonjs buffer',
      'node:stream': 'commonjs stream',
    })

    // Configurações adicionais para Firebase
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    })

    // Ignorar warnings específicos
    config.ignoreWarnings = [
      { module: /node_modules\/undici/ },
      { file: /node_modules\/undici/ },
    ]

    return config
  },

  // Transpile Firebase packages
  transpilePackages: [
    'firebase',
    '@firebase/app',
    '@firebase/auth',
    '@firebase/firestore',
    '@firebase/analytics',
    '@firebase/remote-config',
    '@firebase/storage'
  ],

  // Configurações experimentais (removendo appDir que está deprecated)
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },

  // Headers para CORS se necessário
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
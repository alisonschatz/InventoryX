'use client'

import { Github, Linkedin, Mail, Globe, Heart } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/alisonschatz',
      color: 'hover:text-gray-700 dark:hover:text-gray-300'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/alison-schatz/',
      color: 'hover:text-blue-600'
    },
    {
      name: 'Email',
      icon: Mail,
      url: 'mailto:alisonschatz1@gmail.com',
      color: 'hover:text-green-600'
    },
    {
      name: 'Portfolio',
      icon: Globe,
      url: 'https://as-dev-portfolio.vercel.app/',
      color: 'hover:text-purple-600'
    }
  ]

  return (
    <footer className="mt-auto border-t border-theme-soft/50 bg-theme-panel/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        
        {/* Layout Mobile - Ultra Compacto */}
        <div className="md:hidden text-center space-y-2">
          
          {/* Desenvolvido por - Linha única */}
          <div className="flex items-center justify-center gap-1 text-xs text-theme-secondary">
            <span>Desenvolvido com</span>
            <Heart className="w-3 h-3 text-red-500 fill-current" />
            <span>por</span>
            <span className="font-semibold text-theme-primary">Alison Schatz</span>
            <span className="text-theme-secondary/50">•</span>
            <span className="text-theme-secondary/70">© {currentYear}</span>
          </div>

          {/* Redes Sociais - Compactas */}
          <div className="flex items-center justify-center gap-2">
            {socialLinks.map((link) => {
              const IconComponent = link.icon
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-1.5 rounded-md transition-all duration-200 text-theme-secondary ${link.color} hover:bg-theme-hover`}
                  title={link.name}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                </a>
              )
            })}
          </div>
        </div>

        {/* Layout Desktop - Uma linha só */}
        <div className="hidden md:flex items-center justify-between">
          
          {/* Lado Esquerdo - Desenvolvido por */}
          <div className="flex items-center gap-2 text-xs text-theme-secondary">
            <span>Desenvolvido com</span>
            <Heart className="w-3 h-3 text-red-500 fill-current animate-pulse" />
            <span>por</span>
            <span className="font-semibold text-theme-primary bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Alison Schatz
            </span>
            <span className="text-theme-secondary/50">•</span>
            <span className="text-theme-secondary/70">
              © {currentYear} InventoryX
            </span>
            <span className="text-theme-secondary/50">•</span>
            <a
              href="https://as-dev-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-theme-secondary/70 hover:text-theme-secondary transition-colors"
            >
              as-dev-portfolio.vercel.app
            </a>
          </div>

          {/* Lado Direito - Redes Sociais */}
          <div className="flex items-center gap-1">
            {socialLinks.map((link) => {
              const IconComponent = link.icon
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-1.5 rounded-md transition-all duration-200 text-theme-secondary ${link.color} hover:bg-theme-hover hover:scale-110 active:scale-95`}
                  title={link.name}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
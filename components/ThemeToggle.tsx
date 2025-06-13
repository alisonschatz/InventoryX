'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2 rounded-xl transition-theme hover-theme
        bg-theme-panel border border-theme-soft
        shadow-theme-light hover:shadow-theme-medium
        group relative overflow-hidden
      "
      title={`Trocar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Ícone do Sol */}
        <Sun 
          className={`
            w-5 h-5 text-accent-contrast transition-all duration-300 absolute
            ${theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-75'
            }
          `}
        />
        
        {/* Ícone da Lua */}
        <Moon 
          className={`
            w-5 h-5 text-accent-secondary transition-all duration-300 absolute
            ${theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-75'
            }
          `}
        />
      </div>
      
      {/* Efeito de brilho */}
      <div className="
        absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        bg-gradient-to-r from-transparent via-white/10 to-transparent
        -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%]
        transition-transform duration-700
      " />
    </button>
  )
}
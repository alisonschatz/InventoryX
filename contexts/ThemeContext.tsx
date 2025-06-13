'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializar com light para evitar hidratação inconsistente
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Marcar como montado
    setMounted(true)
    
    // Só no cliente, verificar preferência salva ou sistema
    const savedTheme = localStorage.getItem('inventory-theme') as Theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    
    const initialTheme = savedTheme || systemTheme
    setTheme(initialTheme)
    
    // Aplicar tema ao documento
    applyTheme(initialTheme)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    // Aplicar tema ao documento
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const toggleTheme = () => {
    if (!mounted) return // Só permitir toggle após hidratação
    
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    
    // Salvar preferência
    localStorage.setItem('inventory-theme', newTheme)
    
    // Aplicar tema
    applyTheme(newTheme)
  }

  // Durante SSR ou antes da hidratação, usar valores padrão
  const value = {
    theme: mounted ? theme : 'light',
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
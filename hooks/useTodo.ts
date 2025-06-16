'use client'

import { useState } from 'react'

export const useTodo = () => {
  const [isTodoOpen, setIsTodoOpen] = useState(false)

  const openTodo = () => setIsTodoOpen(true)
  const closeTodo = () => setIsTodoOpen(false)
  const toggleTodo = () => setIsTodoOpen(prev => !prev)

  return {
    isTodoOpen,
    openTodo,
    closeTodo,
    toggleTodo,
    setIsTodoOpen
  }
}
'use client'

import { useState } from 'react'

export const usePomodoro = () => {
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false)

  const openPomodoro = () => setIsPomodoroOpen(true)
  const closePomodoro = () => setIsPomodoroOpen(false)
  const togglePomodoro = () => setIsPomodoroOpen(prev => !prev)

  return {
    isPomodoroOpen,
    openPomodoro,
    closePomodoro,
    togglePomodoro,
    setIsPomodoroOpen
  }
}
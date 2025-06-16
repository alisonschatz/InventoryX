'use client'

import { useState } from 'react'

export function useKanban() {
  const [isKanbanOpen, setIsKanbanOpen] = useState(false)

  const openKanban = () => {
    console.log('🎯 Abrindo Kanban Tool')
    setIsKanbanOpen(true)
  }

  const closeKanban = () => {
    console.log('✅ Fechando Kanban Tool')
    setIsKanbanOpen(false)
  }

  return {
    isKanbanOpen,
    openKanban,
    closeKanban
  }
}
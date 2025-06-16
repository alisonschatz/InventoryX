'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  Plus, 
  X, 
  Edit2, 
  Trash2, 
  Calendar,
  Clock,
  User,
  Flag,
  MoreVertical,
  Search,
  Filter,
  Settings as SettingsIcon,
  Grid3X3,
  List,
  Archive,
  Target,
  Users
} from 'lucide-react'

// ========================= TYPES =========================

interface KanbanCard {
  id: string
  title: string
  description?: string
  assignee?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  tags: string[]
  dueDate?: string
  createdAt: string
  updatedAt: string
  columnId: string
  order: number
  estimatedHours?: number
  completedHours?: number
  attachments?: string[]
}

interface KanbanColumn {
  id: string
  title: string
  color: string
  order: number
  limit?: number
  cards: KanbanCard[]
}

interface KanbanBoard {
  id: string
  title: string
  description?: string
  columns: KanbanColumn[]
  createdAt: string
  updatedAt: string
}

interface KanbanToolProps {
  isOpen: boolean
  onClose: () => void
}

type ViewMode = 'board' | 'list'

// ========================= CONSTANTS =========================

const DEFAULT_COLUMNS: Omit<KanbanColumn, 'cards'>[] = [
  { id: 'backlog', title: 'Backlog', color: 'gray', order: 0 },
  { id: 'todo', title: 'A Fazer', color: 'blue', order: 1 },
  { id: 'in-progress', title: 'Em Progresso', color: 'yellow', order: 2, limit: 3 },
  { id: 'review', title: 'Revisão', color: 'purple', order: 3, limit: 2 },
  { id: 'done', title: 'Concluído', color: 'green', order: 4 }
]

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
  medium: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  high: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
  urgent: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
}

const COLUMN_COLORS = {
  gray: 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50',
  blue: 'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20',
  yellow: 'border-yellow-300 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900/20',
  purple: 'border-purple-300 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/20',
  green: 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20',
  red: 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
}

// ========================= MAIN COMPONENT =========================

export default function KanbanTool({ isOpen, onClose }: KanbanToolProps) {
  // ========================= STATE =========================
  
  const [board, setBoard] = useState<KanbanBoard | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('board')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterAssignee, setFilterAssignee] = useState<string>('all')
  const [showCardModal, setShowCardModal] = useState(false)
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null)
  const [draggedCard, setDraggedCard] = useState<KanbanCard | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  // ========================= REFS =========================
  
  const dragRef = useRef<HTMLDivElement>(null)

  // ========================= EFFECTS =========================
  
  // Carregar board do localStorage
  useEffect(() => {
    const savedBoard = localStorage.getItem('inventoryX-kanban-board')
    if (savedBoard) {
      setBoard(JSON.parse(savedBoard))
    } else {
      // Criar board padrão
      const defaultBoard: KanbanBoard = {
        id: 'default-board',
        title: 'Meu Projeto',
        description: 'Board principal do projeto',
        columns: DEFAULT_COLUMNS.map(col => ({
          ...col,
          cards: []
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setBoard(defaultBoard)
    }
  }, [])

  // Salvar board no localStorage
  useEffect(() => {
    if (board) {
      localStorage.setItem('inventoryX-kanban-board', JSON.stringify(board))
    }
  }, [board])

  // ========================= HANDLERS =========================
  
  const createCard = (columnId: string, cardData: Partial<KanbanCard>) => {
    if (!board) return

    const column = board.columns.find(col => col.id === columnId)
    if (!column) return

    const newCard: KanbanCard = {
      id: Date.now().toString(),
      title: cardData.title || 'Nova Tarefa',
      description: cardData.description,
      assignee: cardData.assignee,
      priority: cardData.priority || 'medium',
      tags: cardData.tags || [],
      dueDate: cardData.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      columnId,
      order: column.cards.length,
      estimatedHours: cardData.estimatedHours,
      completedHours: cardData.completedHours || 0
    }

    setBoard(prev => {
      if (!prev) return prev
      return {
        ...prev,
        columns: prev.columns.map(col => 
          col.id === columnId 
            ? { ...col, cards: [...col.cards, newCard] }
            : col
        ),
        updatedAt: new Date().toISOString()
      }
    })
  }

  const updateCard = (cardId: string, updates: Partial<KanbanCard>) => {
    if (!board) return

    setBoard(prev => {
      if (!prev) return prev
      return {
        ...prev,
        columns: prev.columns.map(col => ({
          ...col,
          cards: col.cards.map(card => 
            card.id === cardId 
              ? { ...card, ...updates, updatedAt: new Date().toISOString() }
              : card
          )
        })),
        updatedAt: new Date().toISOString()
      }
    })
  }

  const deleteCard = (cardId: string) => {
    if (!board) return

    setBoard(prev => {
      if (!prev) return prev
      return {
        ...prev,
        columns: prev.columns.map(col => ({
          ...col,
          cards: col.cards.filter(card => card.id !== cardId)
        })),
        updatedAt: new Date().toISOString()
      }
    })
  }

  const moveCard = (cardId: string, targetColumnId: string, targetIndex?: number) => {
    if (!board) return

    const sourceColumn = board.columns.find(col => 
      col.cards.some(card => card.id === cardId)
    )
    const targetColumn = board.columns.find(col => col.id === targetColumnId)
    
    if (!sourceColumn || !targetColumn) return

    // Verificar limite da coluna
    if (targetColumn.limit && targetColumn.cards.length >= targetColumn.limit && sourceColumn.id !== targetColumnId) {
      alert(`A coluna "${targetColumn.title}" atingiu o limite de ${targetColumn.limit} cards.`)
      return
    }

    const cardToMove = sourceColumn.cards.find(card => card.id === cardId)
    if (!cardToMove) return

    setBoard(prev => {
      if (!prev) return prev
      
      const newColumns = prev.columns.map(col => {
        if (col.id === sourceColumn.id) {
          return {
            ...col,
            cards: col.cards.filter(card => card.id !== cardId)
          }
        }
        if (col.id === targetColumnId) {
          const newCards = [...col.cards]
          const insertIndex = targetIndex !== undefined ? targetIndex : newCards.length
          newCards.splice(insertIndex, 0, {
            ...cardToMove,
            columnId: targetColumnId,
            updatedAt: new Date().toISOString()
          })
          return {
            ...col,
            cards: newCards.map((card, index) => ({ ...card, order: index }))
          }
        }
        return col
      })

      return {
        ...prev,
        columns: newColumns,
        updatedAt: new Date().toISOString()
      }
    })
  }

  // ========================= DRAG & DROP =========================
  
  const handleDragStart = (e: React.DragEvent, card: KanbanCard) => {
    setDraggedCard(card)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', card.id)
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    if (draggedCard) {
      moveCard(draggedCard.id, columnId)
    }
    setDraggedCard(null)
    setDragOverColumn(null)
  }

  const handleDragEnd = () => {
    setDraggedCard(null)
    setDragOverColumn(null)
  }

  // ========================= COMPUTED VALUES =========================
  
  const filteredCards = board?.columns.flatMap(col => col.cards).filter(card => {
    const matchesSearch = searchTerm === '' || 
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPriority = filterPriority === 'all' || card.priority === filterPriority
    const matchesAssignee = filterAssignee === 'all' || card.assignee === filterAssignee
    
    return matchesSearch && matchesPriority && matchesAssignee
  }) || []

  const allAssignees = [...new Set(board?.columns.flatMap(col => 
    col.cards.map(card => card.assignee).filter(Boolean)
  ) || [])]

  const boardStats = {
    totalCards: board?.columns.reduce((sum, col) => sum + col.cards.length, 0) || 0,
    todoCards: board?.columns.find(col => col.id === 'todo')?.cards.length || 0,
    inProgressCards: board?.columns.find(col => col.id === 'in-progress')?.cards.length || 0,
    doneCards: board?.columns.find(col => col.id === 'done')?.cards.length || 0
  }

  // ========================= RENDER HELPERS =========================
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Amanhã'
    if (diffDays === -1) return 'Ontem'
    if (diffDays < 0) return `${Math.abs(diffDays)} dias atrás`
    return `Em ${diffDays} dias`
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🔴'
      case 'high': return '🟠'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  const renderCard = (card: KanbanCard) => (
    <div
      key={card.id}
      draggable
      onDragStart={(e) => handleDragStart(e, card)}
      onDragEnd={handleDragEnd}
      className={`bg-theme-panel border border-theme-soft rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-move group ${
        draggedCard?.id === card.id ? 'opacity-50' : ''
      }`}
    >
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-theme-primary text-sm flex-1 line-clamp-2">
          {card.title}
        </h4>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              setEditingCard(card)
              setShowCardModal(true)
            }}
            className="p-1 hover:bg-theme-hover rounded text-theme-secondary"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => deleteCard(card.id)}
            className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Descrição */}
      {card.description && (
        <p className="text-xs text-theme-secondary mb-2 line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Tags */}
      {card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-theme-hover text-theme-secondary rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {card.tags.length > 3 && (
            <span className="px-2 py-1 bg-theme-hover text-theme-secondary rounded text-xs">
              +{card.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer do Card */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {/* Prioridade */}
          <span
            className={`px-2 py-1 rounded border text-xs font-medium ${PRIORITY_COLORS[card.priority]}`}
          >
            {getPriorityIcon(card.priority)} {card.priority}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Assignee */}
          {card.assignee && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3 text-theme-secondary" />
              <span className="text-theme-secondary truncate max-w-20">
                {card.assignee}
              </span>
            </div>
          )}

          {/* Due Date */}
          {card.dueDate && (
            <div className={`flex items-center gap-1 ${
              new Date(card.dueDate) < new Date() 
                ? 'text-red-600' 
                : 'text-theme-secondary'
            }`}>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(card.dueDate)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderColumn = (column: KanbanColumn) => (
    <div
      key={column.id}
      className={`flex flex-col bg-theme-hover rounded-xl border-2 transition-colors ${
        dragOverColumn === column.id 
          ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
          : COLUMN_COLORS[column.color as keyof typeof COLUMN_COLORS]
      }`}
      onDragOver={(e) => handleDragOver(e, column.id)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, column.id)}
    >
      {/* Header da Coluna */}
      <div className="p-4 border-b border-theme-soft">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-theme-primary">
            {column.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-theme-secondary">
              {column.cards.length}
              {column.limit && `/${column.limit}`}
            </span>
            <button
              onClick={() => {
                setEditingCard(null)
                setShowCardModal(true)
              }}
              className="p-1 hover:bg-theme-soft rounded text-theme-secondary"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barra de Progresso do Limite */}
        {column.limit && (
          <div className="w-full bg-theme-soft rounded-full h-1">
            <div
              className={`h-1 rounded-full transition-all ${
                column.cards.length >= column.limit 
                  ? 'bg-red-500' 
                  : column.cards.length >= column.limit * 0.8 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
              }`}
              style={{ width: `${(column.cards.length / column.limit) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Cards da Coluna */}
      <div className="flex-1 p-4 space-y-3 min-h-32 max-h-96 overflow-y-auto">
        {column.cards.map(renderCard)}
        
        {column.cards.length === 0 && (
          <div className="text-center py-8 text-theme-secondary">
            <Grid3X3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum card nesta coluna</p>
          </div>
        )}
      </div>
    </div>
  )

  // ========================= RENDER =========================
  
  if (!isOpen || !board) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-theme-panel rounded-2xl w-full max-w-7xl h-[90vh] shadow-2xl border border-theme-soft flex flex-col">
        
        {/* =================== HEADER =================== */}
        <div className="flex items-center justify-between p-6 border-b border-theme-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-lg">
              <Grid3X3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-theme-primary">{board.title}</h2>
              <p className="text-sm text-theme-secondary">
                {boardStats.totalCards} cards • {boardStats.inProgressCards} em progresso
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center bg-theme-hover rounded-lg p-1 border border-theme-soft">
              <button
                onClick={() => setViewMode('board')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'board' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-theme-secondary hover:text-theme-primary'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-theme-secondary hover:text-theme-primary'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-theme-hover rounded-lg transition-colors"
            >
              <SettingsIcon className="w-5 h-5 text-theme-secondary" />
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-theme-hover rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-theme-secondary" />
            </button>
          </div>
        </div>

        {/* =================== STATS =================== */}
        <div className="p-6 border-b border-theme-soft">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-600">{boardStats.todoCards}</div>
              <div className="text-xs text-blue-600">A Fazer</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-yellow-600">{boardStats.inProgressCards}</div>
              <div className="text-xs text-yellow-600">Em Progresso</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-600">{boardStats.doneCards}</div>
              <div className="text-xs text-green-600">Concluído</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-purple-600">{boardStats.totalCards}</div>
              <div className="text-xs text-purple-600">Total</div>
            </div>
          </div>
        </div>

        {/* =================== FILTERS =================== */}
        <div className="p-6 border-b border-theme-soft space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary" />
              <input
                type="text"
                placeholder="Buscar cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-theme-panel border border-theme-soft rounded-lg text-theme-primary"
              />
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 bg-theme-panel border border-theme-soft rounded-lg text-theme-primary"
              >
                <option value="all">Todas Prioridades</option>
                <option value="urgent">Urgente</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>

              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="px-3 py-2 bg-theme-panel border border-theme-soft rounded-lg text-theme-primary"
              >
                <option value="all">Todos Responsáveis</option>
                {allAssignees.map(assignee => (
                  <option key={assignee} value={assignee}>{assignee}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* =================== BOARD CONTENT =================== */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'board' ? (
            <div className="h-full p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 h-full">
                {board.columns
                  .sort((a, b) => a.order - b.order)
                  .map(renderColumn)
                }
              </div>
            </div>
          ) : (
            <div className="p-6 overflow-y-auto h-full">
              {filteredCards.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-theme-secondary mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-theme-primary mb-2">
                    Nenhum card encontrado
                  </h3>
                  <p className="text-theme-secondary">
                    Ajuste os filtros ou crie um novo card
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredCards.map(renderCard)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* =================== CARD MODAL =================== */}
      {showCardModal && (
        <CardModal
          card={editingCard}
          columnId={editingCard?.columnId || 'todo'}
          onSave={(cardData) => {
            if (editingCard) {
              updateCard(editingCard.id, cardData)
            } else {
              createCard(cardData.columnId || 'todo', cardData)
            }
            setShowCardModal(false)
            setEditingCard(null)
          }}
          onClose={() => {
            setShowCardModal(false)
            setEditingCard(null)
          }}
          columns={board.columns}
        />
      )}
    </div>
  )
}

// ========================= CARD MODAL COMPONENT =========================

interface CardModalProps {
  card?: KanbanCard | null
  columnId: string
  onSave: (cardData: Partial<KanbanCard>) => void
  onClose: () => void
  columns: KanbanColumn[]
}

function CardModal({ card, columnId, onSave, onClose, columns }: CardModalProps) {
  const [formData, setFormData] = useState({
    title: card?.title || '',
    description: card?.description || '',
    assignee: card?.assignee || '',
    priority: card?.priority || 'medium' as const,
    tags: card?.tags?.join(', ') || '',
    dueDate: card?.dueDate || '',
    columnId: card?.columnId || columnId,
    estimatedHours: card?.estimatedHours || 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) return

    onSave({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]">
      <div className="bg-theme-panel rounded-xl w-full max-w-md shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-theme-primary">
              {card ? 'Editar Card' : 'Novo Card'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-theme-hover rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-1">
                Título *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-theme-primary border border-theme-soft rounded-lg text-theme-primary"
                placeholder="Digite o título do card"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-primary mb-1">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 bg-theme-primary border border-theme-soft rounded-lg text-theme-primary resize-none"
                placeholder="Adicione uma descrição (opcional)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-theme-primary mb-1">
                  Coluna
                </label>
                <select
                  value={formData.columnId}
                  onChange={(e) => setFormData(prev => ({ ...prev, columnId: e.target.value }))}
                  className="w-full px-3 py-2 bg-theme-primary border border-theme-soft rounded-lg text-theme-primary"
                >
                  {columns.map(col => (
                    <option key={col.id} value={col.id}>{col.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-primary mb-1">
                  Prioridade
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-theme-primary border border-theme-soft rounded-lg text-theme-primary"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-theme-primary mb-1">
                  Responsável
                </label>
                <input
                  type="text"
                  value={formData.assignee}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                  className="w-full px-3 py-2 bg-theme-primary border border-theme-soft rounded-lg text-theme-primary"
                  placeholder="Nome do responsável"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-primary mb-1">
                  Data Limite
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-theme-primary border border-theme-soft rounded-lg text-theme-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-theme-primary mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 bg-theme-primary border border-theme-soft rounded-lg text-theme-primary"
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-primary mb-1">
                  Estimativa (horas)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-theme-primary border border-theme-soft rounded-lg text-theme-primary"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-theme-hover hover:bg-theme-soft text-theme-primary rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white rounded-lg transition-all font-medium"
              >
                {card ? 'Salvar' : 'Criar Card'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
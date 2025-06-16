'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Check, 
  X, 
  Trash2, 
  Edit2, 
  Calendar,
  Clock,
  Flag,
  Filter,
  Search,
  CheckCircle2,
  Circle,
  Archive,
  Star
} from 'lucide-react'

// ========================= TYPES =========================

interface TodoItem {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  dueDate?: string
  createdAt: string
  completedAt?: string
}

interface TodoToolProps {
  isOpen: boolean
  onClose: () => void
}

type FilterType = 'all' | 'active' | 'completed'
type SortType = 'created' | 'priority' | 'dueDate' | 'alphabetical'

// ========================= MAIN COMPONENT =========================

export default function TodoTool({ isOpen, onClose }: TodoToolProps) {
  // ========================= STATE =========================
  
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [newCategory, setNewCategory] = useState('Geral')
  const [newDueDate, setNewDueDate] = useState('')
  
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('created')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // ========================= EFFECTS =========================
  
  // Carregar todos do localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem('inventoryX-todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // Salvar todos no localStorage
  useEffect(() => {
    localStorage.setItem('inventoryX-todos', JSON.stringify(todos))
  }, [todos])

  // ========================= HANDLERS =========================
  
  const addTodo = () => {
    if (!newTodo.trim()) return

    const todo: TodoItem = {
      id: Date.now().toString(),
      title: newTodo.trim(),
      description: newDescription.trim() || undefined,
      completed: false,
      priority: newPriority,
      category: newCategory,
      dueDate: newDueDate || undefined,
      createdAt: new Date().toISOString()
    }

    setTodos(prev => [todo, ...prev])
    resetForm()
  }

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { 
            ...todo, 
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date().toISOString() : undefined
          }
        : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const updateTodo = (id: string, updates: Partial<TodoItem>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ))
  }

  const resetForm = () => {
    setNewTodo('')
    setNewDescription('')
    setNewPriority('medium')
    setNewCategory('Geral')
    setNewDueDate('')
    setShowAddForm(false)
    setEditingId(null)
  }

  // ========================= COMPUTED VALUES =========================
  
  const categories = ['Geral', 'Trabalho', 'Pessoal', 'Estudos', 'Projetos', 'Compras']
  
  const filteredTodos = todos
    .filter(todo => {
      // Filtro por status
      if (filter === 'active' && todo.completed) return false
      if (filter === 'completed' && !todo.completed) return false
      
      // Filtro por busca
      if (searchTerm && !todo.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      
      return true
    })
    .sort((a, b) => {
      switch (sort) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
    highPriority: todos.filter(t => t.priority === 'high' && !t.completed).length
  }

  // ========================= RENDER HELPERS =========================
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
      case 'low': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
      default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-600'
    }
  }

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

  // ========================= RENDER =========================
  
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]"
    >
      <div 
        className="bg-theme-panel rounded-2xl w-full max-w-4xl h-[90vh] shadow-2xl border border-theme-soft flex flex-col"
      >
        
        {/* =================== HEADER =================== */}
        <div className="flex items-center justify-between p-6 border-b border-theme-soft">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-theme-primary">Lista de Tarefas</h2>
              <p className="text-sm text-theme-secondary">
                {stats.active} ativas • {stats.completed} concluídas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-theme-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-theme-secondary" />
          </button>
        </div>

        {/* =================== STATS CARDS =================== */}
        <div className="p-6 border-b border-theme-soft">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-theme-hover rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-theme-primary">{stats.total}</div>
              <div className="text-xs text-theme-secondary">Total</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-600">{stats.active}</div>
              <div className="text-xs text-blue-600">Ativas</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-600">{stats.completed}</div>
              <div className="text-xs text-green-600">Concluídas</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-red-600">{stats.highPriority}</div>
              <div className="text-xs text-red-600">Urgentes</div>
            </div>
          </div>
        </div>

        {/* =================== CONTROLS =================== */}
        <div className="p-6 border-b border-theme-soft space-y-4">
          
          {/* Botão Adicionar + Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg transition-all font-medium"
            >
              <Plus className="w-4 h-4" />
              Nova Tarefa
            </button>
            
            <div className="flex gap-2">
              {/* Filtros */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="px-3 py-2 bg-theme-panel border border-theme-soft rounded-lg text-theme-primary text-sm"
              >
                <option value="all">Todas</option>
                <option value="active">Ativas</option>
                <option value="completed">Concluídas</option>
              </select>
              
              {/* Ordenação */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortType)}
                className="px-3 py-2 bg-theme-panel border border-theme-soft rounded-lg text-theme-primary text-sm"
              >
                <option value="created">Mais recentes</option>
                <option value="priority">Prioridade</option>
                <option value="dueDate">Data limite</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>
          </div>

          {/* Busca */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary" />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-theme-panel border border-theme-soft rounded-lg text-theme-primary placeholder-theme-secondary"
            />
          </div>

          {/* Formulário de Adição */}
          {showAddForm && (
            <div className="bg-theme-hover rounded-lg p-4 space-y-4 border border-theme-soft">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-theme-primary mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Digite o título da tarefa"
                    className="w-full px-3 py-2 bg-theme-panel border border-theme-soft rounded-lg text-theme-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-theme-primary mb-1">
                    Categoria
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-theme-panel border border-theme-soft rounded-lg text-theme-primary"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-primary mb-1">
                  Descrição
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Adicione uma descrição (opcional)"
                  rows={2}
                  className="w-full px-3 py-2 bg-theme-panel border border-theme-soft rounded-lg text-theme-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-theme-primary mb-1">
                    Prioridade
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full px-3 py-2 bg-theme-panel border border-theme-soft rounded-lg text-theme-primary"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-theme-primary mb-1">
                    Data limite
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-theme-panel border border-theme-soft rounded-lg text-theme-primary"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={addTodo}
                  disabled={!newTodo.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 text-white rounded-lg transition-all"
                >
                  Adicionar
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-theme-hover hover:bg-theme-soft text-theme-primary rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =================== LISTA DE TAREFAS =================== */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-theme-secondary mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-theme-primary mb-2">
                {searchTerm ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa ainda'}
              </h3>
              <p className="text-theme-secondary">
                {searchTerm 
                  ? 'Tente ajustar sua busca ou filtros'
                  : 'Comece criando sua primeira tarefa!'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTodos.map(todo => (
                <div
                  key={todo.id}
                  className={`group bg-theme-panel border border-theme-soft rounded-lg p-4 transition-all hover:shadow-md ${
                    todo.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="mt-0.5 flex-shrink-0"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-theme-secondary hover:text-green-600 transition-colors" />
                      )}
                    </button>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            todo.completed 
                              ? 'line-through text-theme-secondary' 
                              : 'text-theme-primary'
                          }`}>
                            {todo.title}
                          </h4>
                          
                          {todo.description && (
                            <p className="text-sm text-theme-secondary mt-1">
                              {todo.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {/* Prioridade */}
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                              {todo.priority === 'high' ? 'Alta' : todo.priority === 'medium' ? 'Média' : 'Baixa'}
                            </span>
                            
                            {/* Categoria */}
                            <span className="px-2 py-1 bg-theme-hover text-theme-secondary rounded text-xs">
                              {todo.category}
                            </span>
                            
                            {/* Data limite */}
                            {todo.dueDate && (
                              <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                                new Date(todo.dueDate) < new Date() && !todo.completed
                                  ? 'bg-red-50 text-red-600 dark:bg-red-900/20'
                                  : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                              }`}>
                                <Calendar className="w-3 h-3" />
                                {formatDate(todo.dueDate)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Search, Package, Heart, Coffee, Code, Wrench, Copy, Check } from 'lucide-react'
import { Tool } from '@/types/interfaces'

interface SidebarProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  tools: Tool[]
  inventorySlots: (Tool | null)[]
}

export default function Sidebar({ searchTerm, setSearchTerm, tools, inventorySlots }: SidebarProps) {
  const [pixCopied, setPixCopied] = useState(false)
  const [donationExpanded, setDonationExpanded] = useState(false)

  const categories = Array.from(new Set(tools.map(tool => tool.category)))
  const slotsByCategory = categories.reduce((acc: Record<string, number>, category) => {
    acc[category] = tools.filter(tool => tool.category === category).length
    return acc
  }, {})

  // Função para copiar PIX
  const copyPixKey = async () => {
    try {
      await navigator.clipboard.writeText('alisonschatz1@gmail.com')
      setPixCopied(true)
      setTimeout(() => setPixCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar PIX:', err)
    }
  }

  return (
    <div className="w-64 space-y-4">
      {/* Search */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl shadow-sm p-4 border border-purple-200 dark:border-purple-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500" />
          <input
            type="text"
            placeholder="Buscar ferramentas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-purple-300 dark:border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 placeholder-purple-500 dark:placeholder-purple-400"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl shadow-sm p-4 border border-purple-200 dark:border-purple-800">
        <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
          <Package className="w-4 h-4 text-purple-600" />
          Categorias
        </h3>
        <div className="space-y-2">
          {Object.entries(slotsByCategory).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between text-sm">
              <span className="text-purple-700 dark:text-purple-400">{category}</span>
              <span className="bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-300 px-2 py-1 rounded text-xs font-medium">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl shadow-sm p-4 border border-purple-200 dark:border-purple-800">
        <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">Inventário</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-purple-700 dark:text-purple-400">Slots usados</span>
            <span className="font-medium text-purple-900 dark:text-purple-200">{tools.length}/{inventorySlots.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-700 dark:text-purple-400">Slots vazios</span>
            <span className="font-medium text-purple-900 dark:text-purple-200">{inventorySlots.length - tools.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-700 dark:text-purple-400">Itens lendários</span>
            <span className="font-medium text-yellow-600 dark:text-yellow-400">
              {tools.filter(t => t.rarity === 'legendary').length}
            </span>
          </div>
        </div>
      </div>

      {/* Botão de Apoio Expansível */}
      <div className="bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-xl shadow-sm border border-purple-200 dark:border-purple-800 overflow-hidden transition-all duration-300">
        
        {/* Botão Principal */}
        <button
          onClick={() => setDonationExpanded(!donationExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-purple-100/50 dark:hover:bg-purple-800/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Heart className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
              {!donationExpanded && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              )}
            </div>
            <div className="text-left">
              <h3 className="font-bold text-purple-800 dark:text-purple-300 text-sm">Apoie o Projeto</h3>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                {donationExpanded ? 'Clique para recolher' : 'Ajude a manter vivo ✨'}
              </p>
            </div>
          </div>
          <div className={`text-purple-600 dark:text-purple-400 transition-transform duration-200 ${donationExpanded ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </button>

        {/* Conteúdo Expansível */}
        {donationExpanded && (
          <div className="px-4 pb-4 opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]">
            <style jsx>{`
              @keyframes fadeIn {
                from { 
                  opacity: 0; 
                  transform: translateY(-10px); 
                }
                to { 
                  opacity: 1; 
                  transform: translateY(0); 
                }
              }
            `}</style>
            
            {/* Área do PIX */}
            <div className="bg-white dark:bg-purple-900/40 rounded-lg p-3 mb-4 border border-purple-300 dark:border-purple-600">
              <p className="text-xs text-purple-700 dark:text-purple-300 mb-3 text-center font-medium">
                🎯 Escaneie o QR code ou copie a chave PIX
              </p>
              
              {/* QR Code Placeholder mais criativo */}
              <div className="w-20 h-20 bg-gradient-to-br from-purple-800 to-purple-900 dark:from-purple-200 dark:to-purple-300 mx-auto mb-3 rounded-lg flex items-center justify-center shadow-lg">
                <div className="text-white dark:text-purple-900 text-xs font-bold">QR</div>
              </div>

              {/* Chave PIX com design melhorado */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-800/50 dark:to-purple-700/50 rounded-lg p-2 border border-purple-300 dark:border-purple-600">
                <span className="text-xs font-mono text-purple-900 dark:text-purple-200 flex-1 truncate font-medium">
                  alisonschatz1@gmail.com
                </span>
                <button
                  onClick={copyPixKey}
                  className="flex-shrink-0 p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                  title="Copiar chave PIX"
                >
                  {pixCopied ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
              
              {pixCopied && (
                <div className="text-xs text-green-600 dark:text-green-400 text-center mt-2 font-medium animate-bounce">
                  🎉 PIX copiado com sucesso!
                </div>
              )}
            </div>

            {/* Por que apoiar - Versão criativa */}
            <div className="space-y-3">
              <div className="text-center mb-3">
                <h4 className="font-bold text-purple-800 dark:text-purple-300 text-sm mb-1">🚀 Por que apoiar?</h4>
                <p className="text-xs text-purple-600 dark:text-purple-400 italic font-medium">
                  ⭐ Seu apoio faz toda a diferença ⭐
                </p>
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-start gap-2 p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                  <Code className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-purple-800 dark:text-purple-300">🚀 Desenvolvimento Contínuo</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">Recursos incríveis e melhorias constantes!</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                  <Wrench className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-purple-800 dark:text-purple-300">🔧 Manutenção</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">Bugs eliminados, performance turbinada!</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                  <Package className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-purple-800 dark:text-purple-300">💡 Novas Funcionalidades</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">Ferramentas mágicas que vão te surpreender!</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                  <Coffee className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-purple-800 dark:text-purple-300">☕ Café Premium</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">Combustível para noites épicas de código!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensagem de agradecimento mais criativa */}
            <div className="mt-4 pt-3 border-t border-purple-300 dark:border-purple-600 text-center">
              <p className="text-xs text-purple-600 dark:text-purple-400 italic leading-relaxed">
                💜 <span className="font-semibold">"Obrigado pelo seu apoio!"</span><br/>
                <span className="text-purple-700 dark:text-purple-300">Cada contribuição é uma semente que faz este projeto florescer! 🌱</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
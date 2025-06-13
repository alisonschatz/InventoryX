'use client'

import { Search, Package } from 'lucide-react';
import { Tool } from '@/types/interfaces';

interface SidebarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  tools: Tool[];
  inventorySlots: (Tool | null)[];
}

export default function Sidebar({ searchTerm, setSearchTerm, tools, inventorySlots }: SidebarProps) {
  const categories = Array.from(new Set(tools.map(tool => tool.category)));
  const slotsByCategory = categories.reduce((acc: Record<string, number>, category) => {
    acc[category] = tools.filter(tool => tool.category === category).length;
    return acc;
  }, {});

  return (
    <div className="w-64 space-y-4">
      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar ferramentas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Categorias
        </h3>
        <div className="space-y-2">
          {Object.entries(slotsByCategory).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{category}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Inventário</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Slots usados</span>
            <span className="font-medium">{tools.length}/{inventorySlots.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Slots vazios</span>
            <span className="font-medium">{inventorySlots.length - tools.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Itens lendários</span>
            <span className="font-medium text-yellow-600">
              {tools.filter(t => t.rarity === 'legendary').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
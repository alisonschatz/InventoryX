import { Tool } from '@/types/interfaces';

export const getInitialInventorySlots = (): (Tool | null)[] => {
  const slots: (Tool | null)[] = Array(48).fill(null);
  
  // Tools placed in specific slots
  const initialTools: Tool[] = [
    // Row 1 - Core Productivity
    { slot: 0, id: 'pomodoro', name: 'Pomodoro Timer', icon: '⏰', rarity: 'epic', category: 'Produtividade' },
    { slot: 1, id: 'todo', name: 'To-Do List', icon: '✅', rarity: 'common', category: 'Produtividade' },
    { slot: 2, id: 'kanban', name: 'Kanban Board', icon: '📋', rarity: 'rare', category: 'Produtividade' },
    { slot: 3, id: 'habits', name: 'Habit Tracker', icon: '🎯', rarity: 'legendary', category: 'Produtividade' },
    { slot: 4, id: 'notepad', name: 'Notepad', icon: '📝', rarity: 'common', category: 'Produtividade' },
    { slot: 5, id: 'water', name: 'Water Reminder', icon: '💧', rarity: 'common', category: 'Produtividade' },
    
    // Row 2 - Security & Utilities  
    { slot: 6, id: 'password', name: 'Password Generator', icon: '🔐', rarity: 'epic', category: 'Segurança' },
    { slot: 7, id: 'qr', name: 'QR Generator', icon: '📱', rarity: 'rare', category: 'Utilitários' },
    { slot: 8, id: 'unit', name: 'Unit Converter', icon: '⚖️', rarity: 'rare', category: 'Utilitários' },
    { slot: 9, id: 'timezone', name: 'Timezone Converter', icon: '🌍', rarity: 'epic', category: 'Utilitários' },
    { slot: 10, id: 'currency', name: 'Currency Converter', icon: '💰', rarity: 'rare', category: 'Utilitários' },
    
    // Row 3 - Internet Search
    { slot: 12, id: 'search', name: 'Internet Search', icon: '🔍', rarity: 'common', category: 'Utilitários' }
  ];

  // Place tools in inventory slots
  initialTools.forEach(tool => {
    slots[tool.slot] = tool;
  });

  return slots;
};
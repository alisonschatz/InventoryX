// Dados iniciais do inventário
import { Tool } from '@/types/interfaces';

export const getInitialInventorySlots = (): (Tool | null)[] => {
  const slots: (Tool | null)[] = Array(48).fill(null);
  
  // Ferramentas iniciais organizadas por categoria
  const initialTools: Tool[] = [
    // Produtividade - Linha 1
    { slot: 0, id: 'pomodoro', name: 'Pomodoro Timer', icon: '⏰', rarity: 'epic', category: 'Produtividade' },
    { slot: 1, id: 'todo', name: 'To-Do List', icon: '✅', rarity: 'common', category: 'Produtividade' },
    { slot: 2, id: 'kanban', name: 'Kanban Board', icon: '📋', rarity: 'rare', category: 'Produtividade' },
    { slot: 3, id: 'habits', name: 'Habit Tracker', icon: '🎯', rarity: 'legendary', category: 'Produtividade' },
    { slot: 4, id: 'notepad', name: 'Notepad', icon: '📝', rarity: 'common', category: 'Produtividade' },
    { slot: 5, id: 'water', name: 'Water Reminder', icon: '💧', rarity: 'common', category: 'Produtividade' },
    
    // Segurança & Utilitários - Linha 2
    { slot: 6, id: 'password', name: 'Password Generator', icon: '🔐', rarity: 'epic', category: 'Segurança' },
    { slot: 7, id: 'qr', name: 'QR Generator', icon: '📱', rarity: 'rare', category: 'Utilitários' },
    { slot: 8, id: 'unit', name: 'Unit Converter', icon: '⚖️', rarity: 'rare', category: 'Utilitários' },
    { slot: 9, id: 'timezone', name: 'Timezone Converter', icon: '🌍', rarity: 'epic', category: 'Utilitários' },
    { slot: 10, id: 'currency', name: 'Currency Converter', icon: '💰', rarity: 'rare', category: 'Utilitários' },
    
    // Busca - Linha 3
    { slot: 12, id: 'search', name: 'Internet Search', icon: '🔍', rarity: 'common', category: 'Utilitários' }
  ];

  // Posiciona as ferramentas nos slots
  initialTools.forEach(tool => {
    slots[tool.slot] = tool;
  });

  return slots;
};

// Catálogo completo de itens disponíveis
export const getAllAvailableItems = (): Tool[] => {
  return [
    // Produtividade
    { slot: -1, id: 'pomodoro', name: 'Pomodoro Timer', icon: '⏰', rarity: 'epic', category: 'Produtividade' },
    { slot: -1, id: 'todo', name: 'To-Do List', icon: '✅', rarity: 'common', category: 'Produtividade' },
    { slot: -1, id: 'kanban', name: 'Kanban Board', icon: '📋', rarity: 'rare', category: 'Produtividade' },
    { slot: -1, id: 'habits', name: 'Habit Tracker', icon: '🎯', rarity: 'legendary', category: 'Produtividade' },
    { slot: -1, id: 'notepad', name: 'Notepad', icon: '📝', rarity: 'common', category: 'Produtividade' },
    { slot: -1, id: 'water', name: 'Water Reminder', icon: '💧', rarity: 'common', category: 'Produtividade' },
    { slot: -1, id: 'calendar', name: 'Calendar', icon: '📅', rarity: 'rare', category: 'Produtividade' },
    { slot: -1, id: 'timer', name: 'Timer', icon: '⏱️', rarity: 'common', category: 'Produtividade' },
    { slot: -1, id: 'focus', name: 'Focus Mode', icon: '🎧', rarity: 'epic', category: 'Produtividade' },
    { slot: -1, id: 'goals', name: 'Goal Tracker', icon: '🏆', rarity: 'legendary', category: 'Produtividade' },

    // Segurança
    { slot: -1, id: 'password', name: 'Password Generator', icon: '🔐', rarity: 'epic', category: 'Segurança' },
    { slot: -1, id: '2fa', name: '2FA Authenticator', icon: '🛡️', rarity: 'legendary', category: 'Segurança' },
    { slot: -1, id: 'vpn', name: 'VPN Client', icon: '🔒', rarity: 'epic', category: 'Segurança' },
    { slot: -1, id: 'encryption', name: 'File Encryptor', icon: '🗝️', rarity: 'rare', category: 'Segurança' },
    { slot: -1, id: 'firewall', name: 'Firewall Monitor', icon: '🚧', rarity: 'rare', category: 'Segurança' },

    // Utilitários
    { slot: -1, id: 'qr', name: 'QR Generator', icon: '📱', rarity: 'rare', category: 'Utilitários' },
    { slot: -1, id: 'unit', name: 'Unit Converter', icon: '⚖️', rarity: 'rare', category: 'Utilitários' },
    { slot: -1, id: 'timezone', name: 'Timezone Converter', icon: '🌍', rarity: 'epic', category: 'Utilitários' },
    { slot: -1, id: 'currency', name: 'Currency Converter', icon: '💰', rarity: 'rare', category: 'Utilitários' },
    { slot: -1, id: 'search', name: 'Internet Search', icon: '🔍', rarity: 'common', category: 'Utilitários' },
    { slot: -1, id: 'calculator', name: 'Calculator', icon: '🧮', rarity: 'common', category: 'Utilitários' },
    { slot: -1, id: 'weather', name: 'Weather Forecast', icon: '🌤️', rarity: 'rare', category: 'Utilitários' },
    { slot: -1, id: 'translator', name: 'Translator', icon: '🌐', rarity: 'epic', category: 'Utilitários' },
    { slot: -1, id: 'scanner', name: 'Document Scanner', icon: '📄', rarity: 'rare', category: 'Utilitários' },

    // Criatividade
    { slot: -1, id: 'color-picker', name: 'Color Picker', icon: '🎨', rarity: 'rare', category: 'Criatividade' },
    { slot: -1, id: 'image-editor', name: 'Image Editor', icon: '🖼️', rarity: 'epic', category: 'Criatividade' },
    { slot: -1, id: 'logo-maker', name: 'Logo Maker', icon: '⭐', rarity: 'legendary', category: 'Criatividade' },
    { slot: -1, id: 'font-preview', name: 'Font Preview', icon: '🔤', rarity: 'common', category: 'Criatividade' },
    { slot: -1, id: 'gradient', name: 'Gradient Generator', icon: '🌈', rarity: 'rare', category: 'Criatividade' },

    // Desenvolvedor
    { slot: -1, id: 'json-formatter', name: 'JSON Formatter', icon: '🔧', rarity: 'rare', category: 'Desenvolvedor' },
    { slot: -1, id: 'regex-tester', name: 'Regex Tester', icon: '📝', rarity: 'epic', category: 'Desenvolvedor' },
    { slot: -1, id: 'api-tester', name: 'API Tester', icon: '🌐', rarity: 'legendary', category: 'Desenvolvedor' },
    { slot: -1, id: 'hash-generator', name: 'Hash Generator', icon: '#️⃣', rarity: 'rare', category: 'Desenvolvedor' },
    { slot: -1, id: 'base64', name: 'Base64 Encoder', icon: '📋', rarity: 'common', category: 'Desenvolvedor' },

    // Comunicação
    { slot: -1, id: 'email-validator', name: 'Email Validator', icon: '📧', rarity: 'common', category: 'Comunicação' },
    { slot: -1, id: 'url-shortener', name: 'URL Shortener', icon: '🔗', rarity: 'rare', category: 'Comunicação' },
    { slot: -1, id: 'text-analyzer', name: 'Text Analyzer', icon: '📊', rarity: 'epic', category: 'Comunicação' },
    { slot: -1, id: 'markdown-editor', name: 'Markdown Editor', icon: '📑', rarity: 'rare', category: 'Comunicação' }
  ];
};
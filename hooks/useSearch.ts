import { useState, useMemo } from 'react';
import { Tool } from '@/types/interfaces';

export const useSearch = (tools: Tool[]) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredTools = useMemo(() => {
    if (!searchTerm) return tools;
    
    return tools.filter(tool =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tools, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredTools
  };
};
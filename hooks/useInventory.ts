import { useState } from 'react';
import { Tool, DraggedItem } from '@/types/interfaces';
import { getInitialInventorySlots } from '@/utils/inventoryData';

export const useInventory = () => {
  const [inventorySlots, setInventorySlots] = useState(getInitialInventorySlots);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

  const tools = inventorySlots.filter((slot): slot is Tool => slot !== null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, fromSlot: number) => {
    const item = inventorySlots[fromSlot];
    if (!item) return;
    
    setDraggedItem({ item, fromSlot });
    e.dataTransfer.effectAllowed = 'move';
    (e.target as HTMLElement).style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).style.opacity = '1';
    setDraggedItem(null);
    setDragOverSlot(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, toSlot: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot(toSlot);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toSlot: number) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.fromSlot === toSlot) return;

    const newSlots = [...inventorySlots];
    [newSlots[draggedItem.fromSlot], newSlots[toSlot]] = [newSlots[toSlot], newSlots[draggedItem.fromSlot]];
    
    setInventorySlots(newSlots);
    setDraggedItem(null);
    setDragOverSlot(null);
  };

  return {
    inventorySlots,
    selectedSlot,
    setSelectedSlot,
    draggedItem,
    dragOverSlot,
    tools,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave: () => setDragOverSlot(null),
    handleDrop
  };
};
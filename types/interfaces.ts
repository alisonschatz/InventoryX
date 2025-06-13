export interface Tool {
  slot: number;
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
}

export interface UserStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
}

export interface Track {
  id: number;
  name: string;
  artist: string;
  duration: string;
  url: string;
}

export interface DraggedItem {
  item: Tool;
  fromSlot: number;
}
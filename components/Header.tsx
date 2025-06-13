'use client'

import { Star, Settings, LayoutGrid, List } from 'lucide-react';
import { UserStats } from '@/types/interfaces';

interface HeaderProps {
  userStats: UserStats;
  toolsCount: number;
  totalSlots: number;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  atmosphereOpen: boolean;
  setAtmosphereOpen: (open: boolean) => void;
  currentTrack: any;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export default function Header({
  userStats,
  toolsCount,
  totalSlots,
  viewMode,
  setViewMode,
  atmosphereOpen,
  setAtmosphereOpen,
  currentTrack,
  isPlaying,
  setIsPlaying
}: HeaderProps) {
  const getXpProgress = (): number => {
    return (userStats.xp / userStats.nextLevelXp) * 100;
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="/img/logo.png" 
                  alt="InventoryX Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  InventoryX
                </h1>
                <p className="text-sm text-gray-600">
                  {toolsCount}/{totalSlots} slots ocupados
                </p>
              </div>
            </div>
            
            {/* XP Bar */}
            <div className="hidden md:flex items-center gap-3 ml-8">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Nível {userStats.level}</span>
              </div>
              <div className="w-32">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{userStats.xp}</span>
                  <span>{userStats.nextLevelXp}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 via-purple-600 to-cyan-500 h-2 rounded-full transition-all shadow-sm"
                    style={{ width: `${getXpProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Atmosphere Controls */}
            <div className="flex items-center gap-2 mr-4">
              <button
                onClick={() => setAtmosphereOpen(!atmosphereOpen)}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 shadow-sm ${
                  currentTrack 
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-purple-200' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-1">
                  {isPlaying ? '🎵' : '🎶'}
                  <span className="text-sm font-medium">Atmosfera</span>
                </div>
                {currentTrack && (
                  <div className="text-xs opacity-90 truncate max-w-24">
                    {currentTrack.name}
                  </div>
                )}
              </button>

              {/* Quick Play/Pause */}
              {currentTrack && (
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 bg-gradient-to-br from-purple-700 to-purple-800 hover:from-purple-600 hover:to-purple-700 text-white rounded-full flex items-center justify-center transition-all shadow-lg"
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
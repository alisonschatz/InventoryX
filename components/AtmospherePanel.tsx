'use client'

import { Track } from '@/types/interfaces';

interface AtmospherePanelProps {
  atmosphereOpen: boolean;
  setAtmosphereOpen: (open: boolean) => void;
  currentTrack: Track | null;
  setCurrentTrack: (track: Track) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

export default function AtmospherePanel({
  atmosphereOpen,
  setAtmosphereOpen,
  currentTrack,
  setCurrentTrack,
  isPlaying,
  setIsPlaying,
  volume,
  setVolume
}: AtmospherePanelProps) {
  const lofiTracks: Track[] = [
    { id: 1, name: 'Chill Beats', artist: 'Study Vibes', duration: '1:23:45', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
    { id: 2, name: 'Forest Rain', artist: 'Nature Sounds', duration: '2:15:30', url: 'https://www.youtube.com/watch?v=nDq6TstdEi8' },
    { id: 3, name: 'Coffee Shop Jazz', artist: 'Ambient Cafe', duration: '45:22', url: 'https://www.youtube.com/watch?v=bHQqvYy5KYo' },
    { id: 4, name: 'Night City', artist: 'Synthwave Dreams', duration: '1:05:18', url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY' },
    { id: 5, name: 'Ocean Waves', artist: 'Peaceful Mind', duration: '3:00:00', url: 'https://www.youtube.com/watch?v=V1bFr2SWP1I' }
  ];

  if (!atmosphereOpen) return null;

  return (
    <div className="border-t bg-gradient-to-r from-purple-50 via-purple-100 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            🎵 <span className="bg-gradient-to-r from-purple-700 to-cyan-600 bg-clip-text text-transparent">Crie sua Atmosfera Perfeita</span>
          </h3>
          <div className="flex items-center gap-4">
            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">🔊</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-purple"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${volume}%, #e5e7eb ${volume}%, #e5e7eb 100%)`
                }}
              />
              <span className="text-xs text-gray-500 w-8">{volume}%</span>
            </div>
            <button
              onClick={() => setAtmosphereOpen(false)}
              className="text-gray-400 hover:text-gray-600 w-6 h-6 rounded-full hover:bg-white/50 flex items-center justify-center transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Track Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {lofiTracks.map((track) => (
            <div
              key={track.id}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                currentTrack?.id === track.id
                  ? 'border-purple-400 bg-gradient-to-br from-purple-100 to-cyan-100 shadow-lg shadow-purple-200'
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
              }`}
              onClick={() => {
                setCurrentTrack(track);
                setIsPlaying(true);
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  currentTrack?.id === track.id ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600'
                }`}>
                  {currentTrack?.id === track.id && isPlaying ? '⏸️' : '▶️'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">{track.name}</div>
                  <div className="text-xs text-gray-500 truncate">{track.artist}</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">{track.duration}</div>
            </div>
          ))}
        </div>

        {/* Custom YouTube Link */}
        <div className="mt-4 pt-4 border-t border-purple-200">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Cole um link do YouTube para sua música perfeita..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg">
              📺 Carregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
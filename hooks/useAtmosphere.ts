import { useState } from 'react';
import { Track } from '@/types/interfaces';

export const useAtmosphere = () => {
  const [atmosphereOpen, setAtmosphereOpen] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);

  return {
    atmosphereOpen,
    setAtmosphereOpen,
    currentTrack,
    setCurrentTrack,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume
  };
};
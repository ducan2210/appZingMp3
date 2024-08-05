// SoundContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const playPauseHandler = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const handlePlaybackStatusUpdate = (status) => {
      if (status.isLoaded) {
        setPosition(status.positionMillis);
        setDuration(status.durationMillis);
      }
    };

    if (sound) {
      sound.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);
    }
  }, [sound]);

  return (
    <SoundContext.Provider value={{ sound, setSound, playPauseHandler, position, duration, isPlaying, setIsPlaying }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);

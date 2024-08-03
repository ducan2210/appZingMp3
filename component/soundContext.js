// SoundContext.js
import React, { createContext, useState, useContext } from 'react';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [sound, setSound] = useState(null);

  return <SoundContext.Provider value={{ sound, setSound }}>{children}</SoundContext.Provider>;
};

export const useSound = () => useContext(SoundContext);

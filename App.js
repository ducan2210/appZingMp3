import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Router from './UI/router';
import { SoundProvider } from './component/soundContext';

const App = () => {
  return (
    <SoundProvider>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </SoundProvider>
  );
};

export default App;

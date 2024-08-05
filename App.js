import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Router from './router/router';
import { SoundProvider } from './component/soundContext';
import { Provider } from 'react-redux';
import store from './redux/store';

const App = () => {
  return (
    <Provider store={store}>
      <SoundProvider>
        <NavigationContainer>
          <Router />
        </NavigationContainer>
      </SoundProvider>
    </Provider>
  );
};

export default App;

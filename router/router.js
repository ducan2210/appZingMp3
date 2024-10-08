import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContainerRouter from './containerRouter';
import PlayMusicUI from '../UI/playMusicUI';
import MvUI from '../UI/mvUI';
const Stack = createNativeStackNavigator();

const Router = () => {
  return (
    <Stack.Navigator initialRouteName="ContainerRouter">
      <Stack.Screen name="ContainerRouter" component={ContainerRouter} options={{ title: '', headerShown: false }} />
      <Stack.Screen
        name="PlayMusicUI"
        component={PlayMusicUI}
        options={{ title: '', headerShown: false, animationTypeForReplace: 'push', gestureDirection: 'vertical' }}
      />
      <Stack.Screen
        name="MvUI"
        component={MvUI}
        options={{ title: '', headerShown: false, animationTypeForReplace: 'push', gestureDirection: 'vertical' }}
      />
    </Stack.Navigator>
  );
};
export default Router;

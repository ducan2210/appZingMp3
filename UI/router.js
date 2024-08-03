import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContainerRouter from './containerRouter';
import CaNhanUI from './caNhanUI'; // Import các screen bạn muốn hiển thị trong các tab
import KhamPhaUI from './khamPhaUI';
import RadioUI from './radioUI';
import ZingChartUI from './zingChartUI';
import ThuVienUI from './thuVienUI';
import PlayMusicUI from './playMusicUI';
const Stack = createNativeStackNavigator();

const Router = () => {
  return (
    <Stack.Navigator initialRouteName="ContainerRouter">
      <Stack.Screen name="ContainerRouter" component={ContainerRouter} options={{ title: '', headerShown: false }} />
      <Stack.Screen name="CaNhanUI" component={CaNhanUI} options={{ title: '', headerShown: false }} />
      <Stack.Screen name="KhamPhaUI" component={KhamPhaUI} options={{ title: '', headerShown: false }} />
      <Stack.Screen name="RadioUI" component={RadioUI} options={{ title: '', headerShown: false }} />
      <Stack.Screen name="ZingChartUI" component={ZingChartUI} options={{ title: '', headerShown: false }} />
      <Stack.Screen name="ThuVienUI" component={ThuVienUI} options={{ title: '', headerShown: true }} />
      <Stack.Screen name="PlayMusicUI" component={PlayMusicUI} options={{ title: '', headerShown: false }} />
    </Stack.Navigator>
  );
};

export default Router;

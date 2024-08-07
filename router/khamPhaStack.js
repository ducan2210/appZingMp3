import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import KhamPhaUI from '../UI/khamPhaUI';
import PlayMusicUI from '../UI/playMusicUI';
import PlayListSoundUI from '../UI/playListSoundUI';
import ArtistUI from '../UI/artistUI';
const Stack = createNativeStackNavigator();

const KhamPhaStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="KhamPhaUI" component={KhamPhaUI} />
      <Stack.Screen name="ArtistUI" component={ArtistUI} />
      <Stack.Screen name="PlayListSoundUI" component={PlayListSoundUI} />
    </Stack.Navigator>
  );
};

export default KhamPhaStack;

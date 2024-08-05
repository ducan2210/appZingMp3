import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CaNhanUI from '../UI/caNhanUI';
const Stack = createNativeStackNavigator();

const CaNhanStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CaNhanUI" component={CaNhanUI} />
    </Stack.Navigator>
  );
};

export default CaNhanStack;

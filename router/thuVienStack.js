import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ThuVienUI from '../UI/thuVienUI';
const Stack = createNativeStackNavigator();

const ThuVienStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ThuVienUI" component={ThuVienUI} />
    </Stack.Navigator>
  );
};

export default ThuVienStack;

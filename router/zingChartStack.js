import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ZingChartUI from '../UI/zingChartUI';
const Stack = createNativeStackNavigator();

const ZingChartStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ZingChartUI" component={ZingChartUI} />
    </Stack.Navigator>
  );
};

export default ZingChartStack;

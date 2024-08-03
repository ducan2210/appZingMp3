import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import CaNhanUI from './caNhanUI'; // Import các screen bạn muốn hiển thị trong các tab
import khamPhaUI from './khamPhaUI';
import RadioUI from './radioUI';
import ZingChartUI from './zingChartUI';
import ThuVienUI from './thuVienUI';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
const Tab = createBottomTabNavigator();

export default function Tabbarbottom() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconColor = focused ? '#9c4de0' : '#b5b3b9';
          size = wp(7);
          if (route.name === 'Thư viện') {
            return <MaterialIcons name="library-music" size={size} color={iconColor} />;
          } else if (route.name === 'Khám phá') {
            return <MaterialCommunityIcons name="selection-search" size={size} color={iconColor} />;
          } else if (route.name === '#ZingChart') {
            return <MaterialCommunityIcons name="chart-timeline-variant-shimmer" size={size} color={iconColor} />;
          } else if (route.name === 'Cá nhân') {
            return <Ionicons name="person" size={size} color={iconColor} />;
          } else if (route.name === 'Radio') {
            return <MaterialCommunityIcons name="radio-tower" size={size} color={iconColor} />;
          }
        },
        tabBarStyle: {
          backgroundColor: 'black', // Màu nền của tab bar
          height: hp(10),
        },
        tabBarLabelStyle: {
          fontSize: wp(3), // Tùy chỉnh kích thước font của label
        },
        tabBarActiveTintColor: '#9c4de0',
        headerShown: false,
      })}
      initialRouteName="Khám phá"
    >
      <Tab.Screen name="Thư viện" component={ThuVienUI} />
      <Tab.Screen name="Khám phá" component={khamPhaUI} />
      <Tab.Screen name="#ZingChart" component={ZingChartUI} />
      <Tab.Screen name="Radio" component={RadioUI} />
      <Tab.Screen name="Cá nhân" component={CaNhanUI} />
    </Tab.Navigator>
  );
}

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const toggleToPlayMusicUI = () => {
  const navigation = useNavigation();

  const toggleToPlayMusicUI = (id) => {
    navigation.navigate('PlayMusicUI', { id });
  };

  return toggleToPlayMusicUI;
};

export const toggleGoBack = () => {
  const navigation = useNavigation();

  const toggleGoBack = () => {
    navigation.goBack();
  };

  return toggleGoBack;
};

export const toggleToZingChart = () => {
  const navigation = useNavigation();

  const toggleToZingChart = () => {
    navigation.navigate('ZingChartUI');
  };

  return toggleToZingChart;
};

export const toggleToArtistInfo = () => {
  const navigation = useNavigation();

  const toggleToZingChart = () => {
    navigation.navigate('ArtistUI');
  };

  return toggleToZingChart;
};

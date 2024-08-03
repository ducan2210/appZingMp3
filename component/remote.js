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

export const toggleToHome = () => {
  const navigation = useNavigation();

  const toggleToPlayMusicUI = () => {
    navigation.navigate('ContainerRouter');
  };

  return toggleToPlayMusicUI;
};

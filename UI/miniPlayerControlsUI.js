import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSound } from '../component/soundContext';
import { useNavigation } from '@react-navigation/native';

const MiniPlayer = () => {
  const { sound, isPlaying, playPauseHandler, showMiniPlayer } = useSound();
  const navigation = useNavigation();

  if (!showMiniPlayer || !sound) return null;

  const handlePress = () => {
    navigation.navigate('PlayMusicUI');
  };

  return (
    <TouchableOpacity style={styles.miniPlayer} onPress={handlePress}>
      <TouchableOpacity onPress={playPauseHandler}>
        <Text style={styles.playPauseButton}>{isPlaying ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>
      <Text style={styles.songTitle}>{sound.title || 'No Title'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  miniPlayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playPauseButton: {
    color: '#fff',
    fontSize: 16,
  },
  songTitle: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MiniPlayer;

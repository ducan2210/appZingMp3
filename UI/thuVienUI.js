import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
export default function ThuVienUI() {
  return (
    <View style={styles.Container}>
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Open up App.js to start working on your app!</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  Container: {
    backgroundColor: 'black',
    flex: 1,
    paddingHorizontal: wp(2),
    paddingTop: hp('7.5%'), // 7.5% of screen height
  },
});

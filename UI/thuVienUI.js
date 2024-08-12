import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
export default function ThuVienUI() {
  return (
    <View style={styles.Container}>
      <Text>con cac</Text>
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

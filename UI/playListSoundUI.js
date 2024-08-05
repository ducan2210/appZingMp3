import React, { Component, useEffect } from 'react';
import { Text, View, ImageBackground, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { setDataPlaylist, setTitlePlaylist } from '../redux/soundSlice';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { toggleGoBack } from '../component/remote';
import { Feather, AntDesign, Entypo, FontAwesome5, FontAwesome6, FontAwesome } from '@expo/vector-icons';
export default function PlayListSoundUI() {
  const playListData = useSelector((state) => state.sound.dataPlaylist);
  const toggleBackView = toggleGoBack();
  return (
    <ImageBackground
      source={{ uri: playListData?.data?.thumbnailM }} // URL hình ảnh nền, thay thế bằng URL thực tế
      style={styles.backgroundImage}
      blurRadius={20} // Độ mờ của hình ảnh nền
    >
      <View style={styles.overlay} />
      <View style={styles.Container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity onPress={toggleBackView}>
            <AntDesign name="left" size={wp(5)} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Entypo name="dots-three-horizontal" size={wp(5)} color="white" />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: wp(1) }}>
            <Image style={{ height: wp(55), width: wp(55) }} source={{ uri: playListData?.data?.thumbnailM }} />
            <Text style={{ marginVertical: wp(2), fontSize: wp(5), fontWeight: 'bold', color: 'white' }}>
              {playListData?.data?.title}
            </Text>
            <Text style={{ fontSize: wp(4), fontWeight: 'bold', color: '#A9A9A9' }}>Zing MP3</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: wp(5) }}>
              <TouchableOpacity style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Feather name="arrow-down-circle" size={wp(7)} color="white" />
                <Text style={{ color: 'white', fontSize: wp(3), marginTop: wp(2) }}>Tải xuống</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: hp(5),
                  width: wp(50),
                  backgroundColor: '#9c4de0',
                  borderRadius: wp(10),
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: wp(3),
                }}
              >
                <Text style={{ fontSize: wp(4), fontWeight: '700', color: 'white' }}>PHÁT NGẪU NHIÊN</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <AntDesign name="hearto" size={wp(7)} color="white" />
                <Text style={{ color: 'white', fontSize: wp(3), marginTop: wp(2) }}>Thích</Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{ color: '#A9A9A9', fontSize: wp(3.5), textAlign: 'center' }}
              // numberOfLines={2}
              ellipsizeMode="tail"
            >
              {playListData?.data?.sortDescription}.
            </Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Cách hình ảnh được hiển thị (cover, contain, stretch, etc.)
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu sắc và độ mờ của lớp phủ
  },
  Container: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp('6.5%'),
  },
});

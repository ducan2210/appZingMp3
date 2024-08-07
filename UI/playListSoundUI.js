import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Animated, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { convertSecondsToTime, formatNumber } from '../component/library';
import LoadingIndicator from '../component/loadingIndicator';
import { toggleGoBack, toggleToPlayMusicUI, toggleToArtistInfo } from '../component/remote';
import { loadDataArtist } from '../redux/artistSlice';
export default function PlayListSoundUI() {
  const playListData = useSelector((state) => state.sound.dataPlaylist);
  const playListTitle = useSelector((state) => state.sound.titlePlaylist);
  const isLoading = useSelector((state) => state.sound.isLoading);
  const toPlayMusicUI = toggleToPlayMusicUI();
  const toggleBackView = toggleGoBack();
  const toggleToArtist = toggleToArtistInfo();

  const dispatch = useDispatch();
  const scrollY = useRef(new Animated.Value(0)).current;
  const titleOpacity = scrollY.interpolate({
    inputRange: [hp(30), hp(50)],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: false,
  });

  return isLoading ? (
    <LoadingIndicator></LoadingIndicator>
  ) : (
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

          <Animated.View style={{ opacity: titleOpacity }}>
            <Text style={{ fontSize: wp(4), fontWeight: 'bold', color: 'white' }}>{playListTitle}</Text>
          </Animated.View>
          <TouchableOpacity>
            <Entypo name="dots-three-horizontal" size={wp(5)} color="white" />
          </TouchableOpacity>
        </View>
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ marginTop: wp(3) }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ height: wp(55), width: wp(55) }} source={{ uri: playListData?.data?.thumbnailM }} />
            <Text style={{ marginVertical: wp(2), fontSize: wp(5), fontWeight: 'bold', color: 'white' }}>
              {playListData?.data?.title}
            </Text>
            <Text style={{ fontSize: wp(4), fontWeight: 'bold', color: '#A9A9A9' }}>Zing MP3</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: wp(2) }}>
              <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: '#A9A9A9' }}>
                {playListData?.data?.song?.total} bài hát
              </Text>
              <Entypo name="dot-single" size={wp(4)} color="#A9A9A9" />
              <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: '#A9A9A9' }}>
                {convertSecondsToTime(playListData?.data?.song?.totalDuration)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: wp(4) }}>
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
          <View>
            {playListData?.data?.song?.items?.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginTop: wp(3),
                  alignItems: 'center',
                }}
                onPress={() => {
                  toPlayMusicUI(item.encodeId);
                }}
              >
                <View>
                  <Image
                    style={{
                      height: wp(15),
                      width: wp(15),
                      borderRadius: wp(2),
                    }}
                    source={{ uri: item.thumbnail }}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: wp(3) }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      numberOfLines={1} // Giới hạn số dòng hiển thị
                      ellipsizeMode="tail" // Thêm dấu ba chấm ở cuối nếu vượt quá chiều rộng
                      style={{
                        fontSize: wp(4),
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: wp(2),
                        maxWidth: item?.previewInfo ? wp(52) : wp(70),
                        marginRight: wp(1),
                      }}
                    >
                      {item.title}
                    </Text>
                    {item?.previewInfo ? (
                      <View
                        style={{
                          paddingHorizontal: wp(1),
                          backgroundColor: 'rgba(128, 128, 128, 0.2)',
                          borderRadius: wp(1),
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: wp(4.5),
                        }}
                      >
                        <Text style={{ color: 'gold', fontSize: wp(2), fontWeight: 'bold' }}>PREMIUM</Text>
                      </View>
                    ) : (
                      <></>
                    )}
                  </View>
                  <Text
                    style={styles.artistsText}
                    numberOfLines={1} // Giới hạn số dòng hiển thị
                    ellipsizeMode="tail" // Thêm dấu ba chấm ở cuối nếu vượt quá chiều rộng
                    maxWidth={wp(70)}
                  >
                    {Array.isArray(item.artists) && item.artists.length > 0
                      ? item.artists.reduce((acc, artist, index) => {
                          return acc + artist.name + (index < item.artists.length - 1 ? ', ' : '');
                        }, '')
                      : 'Unknown Artist'}{' '}
                  </Text>
                </View>
                <TouchableOpacity style={{}}>
                  <Entypo name="dots-three-horizontal" size={wp('4%')} marginRight={wp(4)} color="#A9A9A9" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
          <View>
            <TouchableOpacity style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nghệ sĩ đóng góp</Text>
              <AntDesign name="right" size={wp(5)} color="white" marginLeft={wp(0.2)} />
            </TouchableOpacity>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexDirection: 'row', marginTop: wp(3) }}
            >
              {playListData?.data?.artists.map((artist, index) => (
                <TouchableOpacity
                  key={index}
                  style={{ flexDirection: 'column', marginLeft: wp(3), alignItems: 'center' }}
                  onPress={() => {
                    dispatch(loadDataArtist(artist.alias));
                    toggleToArtist();
                  }}
                >
                  <Image
                    style={{ height: wp(40), width: wp(40), borderRadius: wp(100) }}
                    source={{ uri: artist.thumbnail }}
                  />
                  <Text style={{ marginVertical: wp(2), color: 'white', fontSize: wp(3.7), fontWeight: '600' }}>
                    {artist.name}
                  </Text>
                  <Text style={{ marginBottom: wp(4), color: '#A9A9A9', fontSize: wp(3.7), fontWeight: '600' }}>
                    {formatNumber(artist.totalFollow)} quan tâm
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  artistsText: {
    color: '#A9A9A9',
    fontSize: wp(3.5),
    maxWidth: wp(60),
  },
  sectionHeader: {
    marginTop: hp(3),
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp(6),
  },
});

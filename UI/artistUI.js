import React, { useEffect, useState, useRef } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, Image, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { toggleGoBack } from '../component/remote';
import { formatNumber } from '../component/library';
import HTMLView from 'react-native-htmlview';

export default function ArtistUI() {
  const artist = useSelector((state) => state.artist.artistData);
  const toggleBackView = toggleGoBack();
  const [songList, setSongList] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;

  const [isExpanded, setIsExpanded] = useState(false);

  // Hàm để cắt bớt văn bản sau 3 dòng
  const truncateText = (text) => {
    const lines = text.split('\n');
    return lines.slice(0, 1).join('\n');
  };

  // Nội dung để hiển thị
  const content = isExpanded ? artist?.data?.biography : truncateText(artist?.data?.biography);

  const titleOpacity = scrollY.interpolate({
    inputRange: [hp(30), hp(40)],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const backgroundOpacity = scrollY.interpolate({
    inputRange: [hp(30), hp(40)],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: false,
  });

  useEffect(() => {}, [artist]);

  return (
    <View style={{ backgroundColor: 'black', flex: 1 }}>
      <Animated.View
        style={[
          styles.headerContainer,
          {
            backgroundColor: backgroundOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: ['rgba(0,0,0,0)', 'black'],
            }),
          },
        ]}
      >
        <TouchableOpacity onPress={toggleBackView}>
          <AntDesign name="left" size={wp(5)} color="white" />
        </TouchableOpacity>
        <Animated.View style={{ opacity: titleOpacity }}>
          <Text style={{ fontSize: wp(4), fontWeight: 'bold', color: 'white' }}>{artist?.data?.name}</Text>
        </Animated.View>
        <TouchableOpacity>
          <Entypo name="dots-three-horizontal" size={wp(5)} color="white" />
        </TouchableOpacity>
      </Animated.View>
      <ScrollView onScroll={handleScroll} scrollEventThrottle={16} style={{ flex: 1 }}>
        <ImageBackground
          source={{ uri: artist?.data?.thumbnailM }} // URL hình ảnh nền, thay thế bằng URL thực tế
          style={styles.backgroundImage}
        >
          <View style={styles.footerContainer}>
            <Text style={styles.artistName}>{artist?.data?.name}</Text>
            <Text style={{ color: '#A9A9A9', fontSize: wp(3.5) }}>{formatNumber(artist?.data?.follow)} quan tâm</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: wp(2) }}>
              <TouchableOpacity
                style={{
                  borderWidth: wp(0.1),
                  borderColor: 'white',
                  borderRadius: wp(10),
                  height: hp(3),
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <Text style={{ color: 'white', fontWeight: '500' }}>QUAN TÂM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderWidth: wp(0.1),
                  borderRadius: wp(10),
                  height: hp(3),
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: wp(2),
                  flex: 1,
                  backgroundColor: '#9c4de0',
                }}
              >
                <Text style={{ color: 'white', fontWeight: '500' }}>QUAN TÂM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        <View style={{ paddingHorizontal: wp(2) }}>
          <TouchableOpacity style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bài hát nổi bật</Text>
            <AntDesign name="right" size={wp('4')} color="white" style={{ marginLeft: wp('1.5%') }} />
          </TouchableOpacity>
          {artist?.data?.sections[0]?.items.slice(0, 5).map((item, index) => (
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
          <TouchableOpacity
            style={{
              height: hp(4),
              borderWidth: wp(0.1),
              borderColor: 'white',
              borderRadius: wp(10),
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: wp(5),
              width: wp(40),
              alignSelf: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: wp(3), fontWeight: 'bold' }}>XEM THÊM</Text>
          </TouchableOpacity>
          <View style={{}}>
            <Text style={styles.sectionTitle}>Thông tin</Text>

            <View
              style={{
                borderRadius: wp(3),
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                height: 'auto',
                marginTop: wp(2),
                padding: wp(3.5),
              }}
            >
              <HTMLView
                value={`<p>${content || 'Không có dữ liệu'}</p>`}
                stylesheet={{
                  p: {
                    color: '#FFFFFF',
                    fontSize: wp(4),
                  },
                }}
              />
              {!isExpanded && artist?.data?.biography.length > 0 && (
                <TouchableOpacity onPress={() => setIsExpanded(true)} style={styles.readMoreButton}>
                  <Text style={styles.readMoreText}>Xem thêm</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={{ flexDirection: 'row', marginTop: wp(2) }}>
              <Text style={{ color: '#A9A9A9', fontSize: wp(4), width: wp(25) }}>Tên thật</Text>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: wp(4) }}>{artist?.data?.realname}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: wp(2) }}>
              <Text style={{ color: '#A9A9A9', fontSize: wp(4), width: wp(25) }}>Ngày sinh</Text>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: wp(4) }}>{artist?.data?.birthday}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: wp(2) }}>
              <Text style={{ color: '#A9A9A9', fontSize: wp(4), width: wp(25) }}>Quốc gia</Text>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: wp(4) }}>{artist?.data?.national}</Text>
            </View>
            {/* <View style={{ flexDirection: 'row', marginTop: wp(2) }}>
              <Text style={{ color: '#A9A9A9', fontSize: wp(4), width: wp(25) }}>Thể loại</Text>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: wp(4) }}>{artist?.data?.name}</Text>
            </View> */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    height: hp(50),
    resizeMode: 'cover', // Cách hình ảnh được hiển thị (cover, contain, stretch, etc.)
    paddingHorizontal: wp(2),
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: hp(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    zIndex: 1, // Đảm bảo headerContainer nằm trên cùng
    paddingTop: hp(3.5),
  },
  footerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: hp(2),
    paddingHorizontal: wp(2),
  },
  artistName: {
    color: 'white',
    fontSize: wp(10),
    fontWeight: 'bold',
  },
  sectionHeader: {
    marginTop: hp(3),
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp(4.7),
  },
  artistsText: {
    color: '#A9A9A9',
    fontSize: wp(3.5),
  },
  readMoreButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  readMoreText: {
    color: '#ffffff', // Màu sắc của nút xem thêm
    fontSize: wp(4),
    fontWeight: 'bold',
  },
});

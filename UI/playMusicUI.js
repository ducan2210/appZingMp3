import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Feather, AntDesign, Entypo, FontAwesome5, FontAwesome6, FontAwesome } from '@expo/vector-icons';
import { loadDataMusic, loadMusicRecommend, loadSoundPremium, loadSoundNor, loadLyric } from '../CallAPI/mp3API';
import { toggleGoBack } from '../component/remote';
import LoadingIndicator from '../component/loadingIndicator';
import PagerView from 'react-native-pager-view';
import { formatDateRelativeTime } from '../component/library';
import * as Animatable from 'react-native-animatable';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { useSound } from '../component/soundContext';
import Animated, { useSharedValue, withRepeat, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { loadSoundData } from '../redux/soundControlSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function PlayMusicUI({ route }) {
  const { id } = route.params || {};
  // const [music, setMusic] = useState([]);
  const [musicRecommend, setMusicRecommend] = useState([]);
  const [loading, setLoading] = useState(true);
  const headderTitle = useSelector((state) => state.sound.titlePlaylist);
  const [selectedPage, setSelectedPage] = useState(0);

  const toggleBackHome = toggleGoBack();

  const [idSound, setIdSound] = useState(id);
  const { sound, setSound, isPlaying, setIsPlaying, playPauseHandler, position, duration } = useSound();
  const [lyric, setLyric] = useState([]);

  const dispatch = useDispatch();
  const music = useSelector((state) => state.soundControl.soundData);
  useEffect(() => {
    dispatch(loadSoundData(idSound));
  }, [dispatch, idSound]);

  // Shared value to hold the rotation angle
  const rotate = useSharedValue(0);

  // Update rotation value based on playing status
  useEffect(() => {
    if (isPlaying) {
      rotate.value = withRepeat(
        withTiming(360, {
          duration: 17000,
          easing: Easing.linear,
        }),
        -1, // Infinite loop
        0, // No reverse animation
      );
    } else {
      rotate.value = withTiming(rotate.value, { duration: 0 }); // Maintain current rotation value when paused
    }
  }, [isPlaying]);

  // Animated style for the image
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value}deg` }],
    };
  });

  const loadData = async () => {
    setLoading(true);
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      // const dataMusic = await loadDataMusic(idSound);
      const dataRecommend = await loadMusicRecommend(idSound);
      // setMusic(datamusic?.data?.data);
      setMusicRecommend(dataRecommend.data);

      const loadLy = await loadLyric(idSound);
      setLyric(loadLy);
      const loadSound = await loadSoundNor(idSound);

      if (music?.data?.previewInfo) {
        const loadSoundPre = await loadSoundPremium(idSound);
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: loadSoundPre?.data?.link });
        setSound(newSound);
        setIsPlaying(true);
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: loadSound?.data[128] });
        setSound(newSound);
        setIsPlaying(true);
      }
      setLoading(false);
    } catch (error) {
      console.error('error', error);
      throw error;
    }
  };

  useEffect(() => {
    loadData();
  }, [idSound]);

  useEffect(() => {
    if (!loading && sound) {
      sound.playAsync(); // Bắt đầu phát nhạc khi loading hoàn tất
    }
  }, [loading, sound]);
  const handlePageChange = (e) => {
    setSelectedPage(e.nativeEvent.position);
  };

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleSoundRecomend = (id) => {
    setIdSound(id);
  };

  return loading ? (
    <LoadingIndicator />
  ) : (
    <ImageBackground
      source={{ uri: music?.data?.thumbnailM }} // URL hình ảnh nền, thay thế bằng URL thực tế
      style={styles.backgroundImage}
      blurRadius={20} // Độ mờ của hình ảnh nền
    >
      <View style={styles.overlay} />
      <View style={styles.Container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: hp(7) }}>
          <TouchableOpacity onPress={toggleBackHome}>
            <AntDesign name="down" size={wp(5)} color="white" />
          </TouchableOpacity>
          <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            {headderTitle && selectedPage === 1 ? (
              <Text style={{ color: '#A9A9A9', fontWeight: 'bold' }}>PHÁT TỪ</Text>
            ) : (
              <></>
            )}
            <Text
              numberOfLines={1} // Giới hạn số dòng hiển thị
              ellipsizeMode="tail" // Thêm dấu ba chấm ở cuối nếu vượt quá chiều rộng
              maxWidth={wp(70)}
              style={{ color: 'white', fontWeight: 'bold', marginVertical: wp(1) }}
            >
              {selectedPage === 0
                ? 'Thông tin'
                : selectedPage === 1
                ? headderTitle
                  ? headderTitle
                  : music?.album?.title
                : selectedPage === 2
                ? 'Lời bài hát'
                : ''}
            </Text>
            {/* Dấu gạch ngang */}
            <View style={styles.indicatorContainer}>
              {['left', 'center', 'right'].map((item, index) => (
                <Animatable.View
                  key={index}
                  style={[
                    styles.indicator,
                    {
                      backgroundColor: index === selectedPage ? 'white' : '#A9A9A9',
                      width: index === selectedPage ? wp(3.5) : wp(2),
                    },
                  ]}
                  animation={index === selectedPage ? 'pulse' : undefined}
                  duration={100}
                  easing="ease-in-out"
                />
              ))}
            </View>
          </View>
          <Entypo name="dots-three-horizontal" size={wp(5)} color="white" />
        </View>
        <PagerView style={styles.pagerView} initialPage={1} onPageSelected={handlePageChange}>
          <ScrollView showsVerticalScrollIndicator={false} key="1" style={styles.page}>
            <View style={styles.infoContainer}>
              <View style={styles.infoHeader}>
                <Image style={styles.thumbnail} source={{ uri: music?.data?.thumbnail }} />
                <View style={styles.infoTextContainer}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleText} numberOfLines={2} ellipsizeMode="tail">
                      {music?.data?.title}
                    </Text>
                    {music?.data?.previewInfo ? (
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
                  <Text style={styles.artistsText} numberOfLines={3} ellipsizeMode="tail">
                    {Array.isArray(music?.data?.artists) && music?.data?.artists.length > 0
                      ? music?.data?.artists?.reduce((acc, artist, index) => {
                          return acc + artist.name + (index < music?.data?.artists.length - 1 ? ', ' : '');
                        }, '')
                      : 'Unknown Artist'}
                  </Text>
                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <FontAwesome5 name="heart" size={wp(4)} color="#A9A9A9" />
                      <Text style={styles.statText}>{music?.data?.like}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Feather name="headphones" size={wp(4)} color="#A9A9A9" />
                      <Text style={styles.statText}>{music?.data?.listen}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Album</Text>
                  <Text style={styles.detailValue} numberOfLines={3} ellipsizeMode="tail">
                    {music?.data?.album?.title}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nhạc sĩ</Text>
                  <Text style={styles.detailValue} numberOfLines={3} ellipsizeMode="tail">
                    {Array.isArray(music?.data?.artists) && music?.data?.artists.length > 0
                      ? music?.data?.composers?.reduce((acc, composers, index) => {
                          return acc + composers.name + (index < music?.data?.composers.length - 1 ? ', ' : '');
                        }, '')
                      : 'Unknown Artist'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Thể loại</Text>
                  <Text style={styles.detailValue} numberOfLines={3} ellipsizeMode="tail">
                    {Array.isArray(music?.data?.artists) && music?.data?.artists.length > 0
                      ? music?.genres?.reduce((acc, genres, index) => {
                          return acc + genres.name + (index < music?.data?.genres.length - 1 ? ', ' : '');
                        }, '')
                      : 'Unknown Artist'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phát hành</Text>
                  <Text style={styles.detailValue}>{formatDateRelativeTime(music?.data?.releaseDate)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Cung cấp</Text>
                  <Text style={styles.detailValue}>{music?.data?.distributor}</Text>
                </View>
              </View>
            </View>
            <View style={{ marginTop: wp(5) }}>
              <Text style={{ color: 'white', fontSize: wp(4.5), fontWeight: 'bold' }}>Có thể bạn muốn nghe</Text>
              <View>
                {musicRecommend?.items?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      marginTop: wp(3),
                      alignItems: 'center',
                    }}
                    onPress={() => toggleSoundRecomend(item.encodeId)}
                  >
                    <Image
                      style={{ height: wp(15), width: wp(15), borderRadius: wp(2) }}
                      source={{ uri: item.thumbnail }}
                    />
                    <View style={{ flex: 1, marginLeft: wp(3) }}>
                      <View style={{ flexDirection: 'row' }}>
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
            </View>
          </ScrollView>
          <View key="2" style={styles.page}>
            <View style={styles.imageContainer}>
              <Animated.Image style={[styles.image, animatedStyle]} source={{ uri: music?.data?.thumbnailM }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <FontAwesome6 name="share-square" size={wp(6)} color="#A9A9A9" />
              <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text
                  numberOfLines={1} // Giới hạn số dòng hiển thị
                  ellipsizeMode="tail" // Thêm dấu ba chấm ở cuối nếu vượt quá chiều rộng
                  maxWidth={wp(70)}
                  style={{ fontSize: wp(5), fontWeight: 'bold', color: 'white', marginBottom: wp(2) }}
                >
                  {music?.data?.title}
                </Text>
                <Text
                  style={styles.artistsText}
                  numberOfLines={1} // Giới hạn số dòng hiển thị
                  ellipsizeMode="tail" // Thêm dấu ba chấm ở cuối nếu vượt quá chiều rộng
                  maxWidth={wp(70)}
                >
                  {Array.isArray(music?.data?.artists) && music?.data?.artists.length > 0
                    ? music?.data?.artists.reduce((acc, artist, index) => {
                        return acc + artist.name + (index < music?.data?.artists.length - 1 ? ', ' : '');
                      }, '')
                    : 'Unknown Artist'}{' '}
                </Text>
              </View>
              <FontAwesome5 name="heart" size={wp(6)} color="#A9A9A9" />
            </View>
          </View>
          <View key="3" style={styles.page}>
            <View style={styles.infoHeader}>
              <Image style={styles.thumbnail} source={{ uri: music?.data?.thumbnail }} />
              <View style={{ justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ ...styles.titleText, marginBottom: wp(2) }} numberOfLines={2} ellipsizeMode="tail">
                    {music?.data?.title}
                  </Text>
                  {music?.previewInfo ? (
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
                <Text style={styles.artistsText} numberOfLines={3} ellipsizeMode="tail">
                  {Array.isArray(music?.data?.artists) && music?.data?.artists.length > 0
                    ? music?.artists?.reduce((acc, artist, index) => {
                        return acc + artist.name + (index < music?.data?.artists.length - 1 ? ', ' : '');
                      }, '')
                    : 'Unknown Artist'}
                </Text>
              </View>
            </View>
            <ScrollView style={{ marginTop: wp(2) }} showsVerticalScrollIndicator={false}>
              {lyric?.data?.sentences ? (
                <View>
                  {lyric?.data?.sentences.map((rowText, index) => {
                    // Tính toán thời gian bắt đầu và kết thúc của toàn bộ dòng
                    const rowStartTime = rowText.words[0].startTime;
                    const rowEndTime = rowText.words[rowText.words.length - 1].endTime;
                    const isHighlighted = position >= rowStartTime && position <= rowEndTime;

                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          marginBottom: wp(4),
                          flexWrap: 'wrap', // Cho phép dòng tiếp theo khi quá chiều rộng màn hình
                          backgroundColor: isHighlighted ? 'rgba(255, 255, 255, 0.3)' : 'transparent', // Highlight toàn bộ dòng
                          padding: wp(1), // Thêm padding để tạo không gian xung quanh
                          borderRadius: wp(1),
                        }}
                        key={index}
                      >
                        {rowText.words.map((text, idx) => (
                          <Text
                            style={{
                              fontSize: wp(5),
                              fontWeight: 'bold',
                              marginRight: wp(1),
                              color: isHighlighted ? 'gold' : '#A9A9A9', // Chuyển màu chữ khi highlight
                            }}
                            key={idx}
                          >
                            {text.data}
                          </Text>
                        ))}
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: wp(5), fontWeight: 'bold', marginRight: wp(1), color: '#A9A9A9' }}>
                    Không có lời cho bài hát này
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </PagerView>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={async (value) => {
            await sound.setPositionAsync(value);
          }}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#A9A9A9"
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
        <View style={styles.controlContainer}>
          <TouchableOpacity onPress={() => {}}>
            <FontAwesome name="random" size={wp(5)} color="#A9A9A9" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <AntDesign name="stepbackward" size={wp(7)} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={playPauseHandler}>
            <View
              style={{
                height: wp(17),
                width: wp(17),
                borderWidth: wp(1),
                borderRadius: wp(100),
                borderColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isPlaying ? (
                <FontAwesome5 name="pause" size={wp(6)} color="white" />
              ) : (
                <FontAwesome5 name="play" size={wp(6)} color="white" />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <AntDesign name="stepforward" size={wp(7)} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Feather name="repeat" size={wp(5)} color="#A9A9A9" />
          </TouchableOpacity>
        </View>
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
    paddingTop: hp('5.5%'),
  },
  pagerView: {
    height: hp(60),
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: wp(1),
  },
  indicator: {
    height: wp(1),
    borderRadius: wp(0.5),
    marginHorizontal: wp(0.5),
  },
  image: {
    width: wp(80), // Giảm kích thước để hình ảnh không bị phóng to quá
    height: wp(80), // Giảm kích thước để hình ảnh không bị phóng to quá
    borderRadius: wp(100), // Đảm bảo hình ảnh là hình tròn
    resizeMode: 'cover', // Đảm bảo hình ảnh không bị vỡ hoặc kéo dài
    marginVertical: hp(8),
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  page: {
    flex: 1,
  },
  infoContainer: {
    borderRadius: wp(3),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: 'auto',
    padding: wp(3.5),
  },
  infoHeader: {
    flexDirection: 'row',
    borderBottomWidth: wp(0.1),
    borderColor: '#A9A9A9',
    paddingBottom: wp(3.5),
  },
  thumbnail: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(2),
    marginRight: wp(3.5),
  },
  infoTextContainer: {
    justifyContent: 'space-between',
    height: 'auto',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: wp(3.5),
    color: 'white',
    maxWidth: wp(60),
    marginRight: wp(1),
  },
  artistsText: {
    color: '#A9A9A9',
    fontSize: wp(3.5),
    maxWidth: wp(60),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: wp(30),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#A9A9A9',
    fontSize: wp(4),
    marginLeft: wp(1),
    marginRight: wp(10),
  },
  detailsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: wp(3.5),
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: wp(2),
  },
  detailLabel: {
    color: '#A9A9A9',
    fontSize: wp(3.5),
    width: wp(20),
  },
  detailValue: {
    color: 'white',
    fontSize: wp(3.5),
    fontWeight: '600',
    maxWidth: wp(65),
  },
  controlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: wp(5),
  },
  slider: {
    width: wp(90),
    alignSelf: 'center',
    marginTop: wp(2),
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(90),
    alignSelf: 'center',
    marginTop: wp(2),
  },
  timeText: {
    color: 'white',
    fontSize: wp(3.5),
  },
});

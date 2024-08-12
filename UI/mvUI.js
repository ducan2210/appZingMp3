import React, { Component, useEffect, useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AntDesign, Entypo, Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { toggleGoBack } from '../component/remote';
import LoadingIndicator from '../component/loadingIndicator';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { formatNumber } from '../component/library';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { convertSeconds } from '../component/library';
import { Video } from 'expo-av';
import { toggleToPlayMusicUI } from '../component/remote';

export default function MvUI() {
  const toPlayMusicUI = toggleToPlayMusicUI();
  const videoInfo = useSelector((state) => state.videoClip.videoInfo);
  const loading = useSelector((state) => state.videoClip.loading);
  const listVideo = useSelector((state) => state.videoClip.listMV);
  const [selectedTab, setSelectedTab] = useState('Đề xuất');
  const [autoPlay, setAutoPlay] = useState(true);
  const toggleBackView = toggleGoBack();
  //   useEffect(() => {
  //     console.log(listVideo);
  //   }, [listVideo]);
  const videoRef = useRef(null); // Tạo ref cho video
  const [isPlaying, setIsPlaying] = useState(true); // Quản lý trạng thái video

  const handlePress = () => {
    // Dừng video
    if (videoRef.current) {
      videoRef.current.pauseAsync();
    }
    toPlayMusicUI(videoInfo.data.song.encodeId);
  };

  const toggleOnOffAuto = () => {
    setAutoPlay(!autoPlay);
  };

  const FirstRoute = () => (
    <ScrollView style={[styles.scene]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: '#A9A9A9' }}>Phát kế tiếp</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: '#A9A9A9', marginRight: wp(1) }}>Tự động phát</Text>
          <TouchableOpacity onPress={toggleOnOffAuto}>
            {autoPlay ? (
              <MaterialCommunityIcons name="toggle-switch" size={wp(10)} color="#c273ed" />
            ) : (
              <MaterialCommunityIcons name="toggle-switch-off" size={wp(10)} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View>
        {listVideo &&
          listVideo
            .filter((item) => item.encodeId !== videoInfo.data.encodeId)
            .map((item, index) => (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',

                  alignItems: 'center',
                  marginBottom: wp(3),
                }}
                key={index}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      borderRadius: wp(2),
                      overflow: 'hidden',
                    }}
                  >
                    <ImageBackground
                      style={{
                        height: wp(25),
                        width: wp(40),
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        paddingBottom: wp(2),
                        paddingRight: wp(2),
                      }}
                      source={{ uri: item.thumbnail }}
                    >
                      <View
                        style={{
                          backgroundColor: 'rgba(128, 128, 128, 0.9)',
                          height: wp(5),
                          width: wp(13),
                          alignItems: 'center',
                          borderRadius: wp(10),
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ color: 'white', fontSize: wp(3.5), fontWeight: 'bold' }}>
                          {convertSeconds(item.duration)}
                        </Text>
                      </View>
                    </ImageBackground>
                  </View>
                  <View style={{ marginLeft: wp(3) }}>
                    <Text style={{ color: 'white', marginBottom: wp(3), maxWidth: wp(40) }} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={{ color: '#A9A9A9' }} numberOfLines={1} ellipsizeMode="tail">
                      {item?.artists?.reduce((acc, artist, index) => {
                        return acc + artist.name + (index < item.artists.length - 1 ? ', ' : '');
                      }, '')}
                    </Text>
                  </View>
                </View>
                <View>
                  <TouchableOpacity>
                    <Entypo name="dots-three-horizontal" size={wp(4)} color="#A9A9A9" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
        {videoInfo &&
          videoInfo.data.recommends
            .filter((item) => item.encodeId !== videoInfo.data.encodeId)
            .map((item, index) => (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',

                  alignItems: 'center',
                  marginBottom: wp(3),
                }}
                key={index}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      borderRadius: wp(2),
                      overflow: 'hidden',
                    }}
                  >
                    <ImageBackground
                      style={{
                        height: wp(25),
                        width: wp(40),
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        paddingBottom: wp(2),
                        paddingRight: wp(2),
                      }}
                      source={{ uri: item.thumbnail }}
                    >
                      <View
                        style={{
                          backgroundColor: 'rgba(128, 128, 128, 0.9)',
                          height: wp(5),
                          width: wp(13),
                          alignItems: 'center',
                          borderRadius: wp(10),
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ color: 'white', fontSize: wp(3.5), fontWeight: 'bold' }}>
                          {convertSeconds(item.duration)}
                        </Text>
                      </View>
                    </ImageBackground>
                  </View>
                  <View style={{ marginLeft: wp(3) }}>
                    <Text style={{ color: 'white', marginBottom: wp(3), maxWidth: wp(40) }} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={{ color: '#A9A9A9' }} numberOfLines={1} ellipsizeMode="tail">
                      {item?.artists?.reduce((acc, artist, index) => {
                        return acc + artist.name + (index < item.artists.length - 1 ? ', ' : '');
                      }, '')}
                    </Text>
                  </View>
                </View>
                <View>
                  <TouchableOpacity>
                    <Entypo name="dots-three-horizontal" size={wp(4)} color="#A9A9A9" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
      </View>
    </ScrollView>
  );

  const SecondRoute = () => (
    <View style={[styles.scene, { flex: 1 }]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} // Căn giữa nội dung
      >
        <FontAwesome name="comment-o" size={wp(10)} color="white" />
        <Text style={{ color: '#c273ed', textAlign: 'center', marginVertical: wp(2) }}>Chưa có bình luận nào</Text>
        <Text style={{ color: 'white', textAlign: 'center' }}>Hãy là người đầu tiên đăng bình luận</Text>
      </ScrollView>
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            height: wp(8),
            width: wp(8),
            borderRadius: wp(100),

            backgroundColor: 'rgba(128, 128, 128, 0.9)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AntDesign name="user" size={wp(4)} color="#A9A9A9" />
        </View>

        <TextInput
          placeholder="Nhập bình luận..."
          placeholderTextColor={'#A9A9A9'}
          style={{
            color: 'white',
            borderWidth: wp(0.1),
            borderColor: 'white',
            flex: 1,
            marginLeft: wp(2),
            paddingHorizontal: wp(3),
            borderRadius: wp(10),
          }}
        ></TextInput>
      </View>
    </View>
  );

  const ThirdRoute = () => (
    <ScrollView style={[styles.scene]}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ color: '#A9A9A9', fontSize: wp(3.5), width: wp(25) }}>Nghệ sĩ</Text>
        <Text style={{ color: 'white', fontSize: wp(3.5) }}>{videoInfo.data.artistsNames}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginVertical: wp(2) }}>
        <Text style={{ color: '#A9A9A9', fontSize: wp(3.5), width: wp(25) }}>Thể loại</Text>
        <Text style={{ color: 'white', fontSize: wp(3.5) }} numberOfLines={1} ellipsizeMode="tail">
          {videoInfo &&
            videoInfo.data.genres.reduce((acc, genres, index) => {
              return acc + genres.name + (index < videoInfo.data.genres.length - 1 ? ', ' : '');
            }, '')}
        </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ color: '#A9A9A9', fontSize: wp(3.5), width: wp(25) }}>Nhạc sĩ</Text>
        <Text style={{ color: 'white', fontSize: wp(3.5) }} numberOfLines={1} ellipsizeMode="tail">
          {videoInfo &&
            videoInfo.data.composers.reduce((acc, composers, index) => {
              return acc + composers.name + (index < videoInfo.data.composers.length - 1 ? ', ' : '');
            }, '')}
        </Text>
      </View>
      <View>
        <Text style={{ color: 'white', marginVertical: wp(4), fontWeight: 'bold', fontSize: wp(6) }}>Audio</Text>
        <TouchableOpacity
          onPress={handlePress}
          key={index}
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',

            alignItems: 'center',
          }}
        >
          <View>
            <Image
              style={{
                height: wp(15),
                width: wp(15),
                borderRadius: wp(2),
              }}
              source={{ uri: videoInfo.data.song.thumbnailM }}
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
                  maxWidth: videoInfo.data.song.previewInfo ? wp(52) : wp(70),
                  marginRight: wp(1),
                }}
              >
                {videoInfo.data.song.title}
              </Text>
              {videoInfo.data.song.previewInfo ? (
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
              {videoInfo.data.song.artistsNames}
            </Text>
          </View>
          <TouchableOpacity style={{}}>
            <Entypo name="dots-three-horizontal" size={wp('4%')} marginRight={wp(4)} color="#A9A9A9" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Tiếp theo' },
    { key: 'second', title: 'Bình luận' },
    { key: 'third', title: 'Thông tin' },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });
  return loading ? (
    <LoadingIndicator></LoadingIndicator>
  ) : (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          height: hp(12),
          justifyContent: 'space-between',
          paddingHorizontal: wp(4),
          alignItems: 'center',
          paddingTop: hp(3.5),
        }}
      >
        <TouchableOpacity onPress={toggleBackView}>
          <AntDesign name="left" size={wp(5)} color="white" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Entypo name="dots-three-horizontal" size={wp(5)} color="white" />
        </TouchableOpacity>
      </View>
      <Video
        ref={videoRef} // Gán ref cho Video
        source={{ uri: videoInfo.data.streaming.mp4?.['360p'] }} // URL của video
        style={styles.video}
        useNativeControls // Hiển thị các điều khiển video mặc định
        resizeMode="contain" // Đặt chế độ co giãn video
        isLooping // Video sẽ lặp lại khi kết thúc
        shouldPlay={isPlaying} // Quản lý trạng thái phát video
      />
      <View style={{ paddingHorizontal: wp(2), paddingVertical: wp(4) }}>
        <Text style={{ color: 'white', marginBottom: wp(2), fontWeight: 'bold', fontSize: wp(6) }}>
          {videoInfo.data.title}
        </Text>
        <Text style={{ color: '#A9A9A9', fontSize: wp(4) }}>{videoInfo.data.artistsNames}</Text>
        <View style={{ flexDirection: 'row', marginTop: wp(1), alignItems: 'center' }}>
          <AntDesign name="caretright" size={wp(4)} color="#A9A9A9" />
          <Text style={{ color: '#A9A9A9', fontSize: wp(4), marginRight: wp(10), marginLeft: wp(2) }}>
            {formatNumber(videoInfo.data.listen)}
          </Text>
          <AntDesign name="heart" size={wp(4)} color="#A9A9A9" />
          <Text style={{ color: '#A9A9A9', fontSize: wp(4), marginRight: wp(10), marginLeft: wp(2) }}>
            {formatNumber(videoInfo.data.like)}
          </Text>
        </View>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#c273ed' }}
            style={{ backgroundColor: 'rgba(128, 128, 128, 0.2)' }}
            labelStyle={{ fontSize: wp(4), fontWeight: 'bold' }}
            activeColor="#c273ed"
            inactiveColor="#A9A9A9"
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  video: {
    width: '100%',
    height: hp(26),
    alignSelf: 'center',
    // marginTop: hp(2),
  },
  scene: {
    flex: 1,
    backgroundColor: 'black',
    padding: wp(2),
    marginBottom: wp(10),
  },
  artistsText: {
    color: '#A9A9A9',
    fontSize: wp(3.5),
  },
});

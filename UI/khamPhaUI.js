import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Feather, AntDesign, Entypo } from '@expo/vector-icons';
import { loadDataPlayList, loadDataHome, loadTop100 } from '../CallAPI/mp3API';
import { LinearGradient } from 'expo-linear-gradient';
import LoadingIndicator from '../component/loadingIndicator';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Text as SvgText,
  ClipPath,
  Rect,
} from 'react-native-svg';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { formatRelativeTime, shuffleArray, formatDate } from '../component/library';

import { toggleToPlayMusicUI } from '../component/remote';

import { useNavigation } from '@react-navigation/native';

import { setDataPlaylist, setTitlePlaylist, loadPlayList } from '../redux/soundSlice';
import { useSelector, useDispatch } from 'react-redux';

export default function KhamPhaUI() {
  const [dataHome, setDataHome] = useState([]);
  const [dataHomeBaner, setDataHomeBaner] = useState([]);
  const [dataHomeNew, setDataHomeNew] = useState({});
  const [genreNew, setGenreNew] = useState('all');
  const [chart, setChart] = useState();
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [refreshing, setRefreshing] = useState(false); // Trạng thái làm mới
  const [dataHomeRadio, setDataHomeRadio] = useState([]);
  const [dataTopWeek, setDataTopWeek] = useState([]);
  const [dataNewReleaseChart, setDataNewReleaseChart] = useState([]);
  const [dataRandom, setDataRandom] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [idMusic, setIdMusic] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const date = formatDate();
  const dispatch = useDispatch();
  const toPlayMusicUI = toggleToPlayMusicUI();
  const navigation = useNavigation();

  const toggleToZingChart = () => {
    navigation.navigate('#ZingChart');
  };

  const loadData = async () => {
    try {
      const dataHome = await loadDataHome();

      dataHome.data.items.forEach((item) => {
        if (item.sectionType === 'new-release') {
          setDataHomeNew(item.items);
        } else if (item.sectionType === 'banner') {
          setDataHomeBaner(item.items);
        } else if (item.sectionType === 'RTChart') {
          setChart(item.items);
        } else if (item.sectionType === 'livestream') {
          setDataHomeRadio(item);
        } else if (item.sectionType === 'weekChart') {
          setDataTopWeek(item);
        } else if (item.sectionType === 'newReleaseChart') {
          setDataNewReleaseChart(item);
        }
      });
      setDataHome(dataHome);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after data fetching
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (dataHomeNew) {
      const newCombinedData = [...(dataHomeNew['others'] || []), ...(dataHomeNew['vPop'] || [])];
      setCombinedData(newCombinedData);
    }
  }, [dataHomeNew]);

  const [flag, setFlag] = useState(false);

  const togglerandom = () => {
    setFlag(!flag);
  };

  useEffect(() => {
    setDataRandom(shuffleArray(combinedData));
  }, [flag]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData(); // Gọi hàm loadData để làm mới dữ liệu
    setRefreshing(false);
  };

  const toggleNew = (id) => {
    setGenreNew(id);
  };

  // Hàm để tạo dữ liệu cho FlatList, chia thành các hàng
  const getDataChunks = (data, chunkSize) => {
    let result = [];
    if (data && Array.isArray(data)) {
      for (let i = 0; i < data.length; i += chunkSize) {
        result.push(data.slice(i, i + chunkSize));
      }
    }
    return result;
  };

  const togglePlaylistMuic = () => {
    navigation.navigate('PlayListSoundUI');
  };

  return loading ? (
    <LoadingIndicator></LoadingIndicator>
  ) : (
    <View style={styles.Container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['white']} // Set the color for Android
            tintColor="white" // Set the color for iOS
          />
        }
      >
        <ScrollView>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Khám phá</Text>
            <View style={styles.headerIcons}>
              <Feather name="mic" size={wp('6%')} color="white" style={{ marginRight: wp('5%') }} />
              <Feather name="search" size={wp('6%')} color="white" />
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannerScroll}>
            {dataHomeBaner?.map((playList, index) => (
              <TouchableOpacity key={playList.encodeId || index}>
                <ImageBackground
                  source={{ uri: playList.banner }}
                  resizeMode="cover"
                  style={styles.bannerImage}
                ></ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30 }}>
            <View>
              <Text style={{ color: 'grey', fontSize: wp('4.5%') }}>Bắt đầu nghe từ một bài hát</Text>
              <Text style={styles.sectionTitle}>Gợi ý cho bạn</Text>
            </View>
            <TouchableOpacity onPress={togglerandom} style={styles.filterButtonOutline}>
              <Text style={styles.filterButtonText}>Làm mới</Text>
            </TouchableOpacity>
          </View>
          <View>
            <FlatList
              data={getDataChunks(dataRandom.slice(0, 7) || [], 3)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <FlatList
                  data={item}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(setDataPlaylist(combinedData));
                        dispatch(setTitlePlaylist('Bài hát gợi ý'));
                        toPlayMusicUI(item.encodeId);
                      }}
                      style={styles.itemContainer}
                    >
                      <Image source={{ uri: item.thumbnailM }} style={styles.imageStyle} />
                      <View style={styles.textContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: wp('4.5%'),
                              maxWidth: item?.previewInfo ? wp(44) : wp(55),
                              marginRight: wp(1),
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
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
                          ) : null}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={styles.artistsText} numberOfLines={1} ellipsizeMode="tail">
                            {item.artists.reduce((acc, artist, index) => {
                              return acc + artist.name + (index < item.artists.length - 1 ? ', ' : '');
                            }, '')}
                          </Text>
                          <TouchableOpacity>
                            <Entypo name="dots-three-horizontal" size={wp('5%')} marginRight={wp(4)} color="grey" />
                          </TouchableOpacity>
                        </View>
                        <Text style={{ color: 'gray', fontSize: wp(3.5) }}>{formatRelativeTime(item.releaseDate)}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.rowContainer}
                />
              )}
            />
          </View>
          <TouchableOpacity style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chủ đề & thể loại</Text>
            <AntDesign name="right" size={22} color="white" marginLeft={5} />
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {dataNewReleaseChart && (
              <TouchableOpacity style={{ marginRight: wp(2) }}>
                <Image
                  source={{ uri: dataNewReleaseChart.banner }}
                  style={{ width: wp(70), height: wp(25), borderRadius: 5 }}
                />
              </TouchableOpacity>
            )}
            {dataTopWeek?.items?.map((item, index) => (
              <TouchableOpacity style={{ marginRight: wp(2) }} key={index}>
                <Image source={{ uri: item.cover }} style={{ width: wp(70), height: wp(25), borderRadius: 5 }} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mới phát hành</Text>
            <AntDesign name="right" size={wp('6%')} color="white" style={{ marginLeft: wp('1.5%') }} />
          </TouchableOpacity>
          <View style={styles.filterContainer}>
            <TouchableOpacity
              onPress={() => toggleNew('all')}
              style={genreNew == 'all' ? styles.filterButton : styles.filterButtonOutline}
            >
              <Text style={styles.filterButtonText}>Tất cả</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleNew('vPop')}
              style={genreNew == 'vPop' ? styles.filterButton : styles.filterButtonOutline}
            >
              <Text style={styles.filterButtonText}>Việt Nam</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleNew('others')}
              style={genreNew == 'others' ? styles.filterButton : styles.filterButtonOutline}
            >
              <Text style={styles.filterButtonText}>Quốc Tế</Text>
            </TouchableOpacity>
          </View>

          <View>
            <FlatList
              data={getDataChunks(dataHomeNew[genreNew] || [], 3)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <FlatList
                  data={item}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(setDataPlaylist(dataHomeNew[genreNew]));
                        dispatch(setTitlePlaylist('Mới phát hành'));
                        toPlayMusicUI(item.encodeId);
                      }}
                      style={styles.itemContainer}
                    >
                      <Image source={{ uri: item.thumbnailM }} style={styles.imageStyle} />
                      <View style={styles.textContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: wp('4.5%'),
                              maxWidth: item?.previewInfo ? wp(44) : wp(55),
                              marginRight: wp(1),
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
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
                          ) : null}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={styles.artistsText} numberOfLines={1} ellipsizeMode="tail">
                            {item.artists.reduce((acc, artist, index) => {
                              return acc + artist.name + (index < item.artists.length - 1 ? ', ' : '');
                            }, '')}
                          </Text>
                          <TouchableOpacity>
                            <Entypo name="dots-three-horizontal" size={wp('5%')} marginRight={wp(4)} color="grey" />
                          </TouchableOpacity>
                        </View>
                        <Text style={{ color: 'gray', fontSize: wp(3.5) }}>{formatRelativeTime(item.releaseDate)}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.rowContainer}
                />
              )}
            />
          </View>

          <LinearGradient
            colors={['#000099', '#000022', '#000022', '#000022']} // Các màu gradient từ trên xuống
            style={{
              height: 'auto',
              marginTop: hp('3%'), // 3% of screen height
              borderRadius: wp('2.5%'), // 2.5% of screen width
              padding: wp('5%'), // 5% of screen width
            }}
          >
            <TouchableOpacity>
              <Text style={{ color: 'grey', fontSize: wp('4%'), fontWeight: 'bold' }}>Cập nhật {date}</Text>
              <Svg height={hp('5%')} width={wp('50%')}>
                <Defs>
                  <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <Stop offset="0%" stopColor="#FF6666" />
                    <Stop offset="50%" stopColor="#CC66CC" />
                    <Stop offset="100%" stopColor="#6699FF" />
                  </SvgLinearGradient>
                  <ClipPath id="clip">
                    <Rect x="0" y="0" width="100%" height="100%" />
                  </ClipPath>
                </Defs>
                <SvgText
                  fill="url(#grad)"
                  fontSize={wp('5.5%')}
                  fontWeight="bold"
                  x={wp('15%')}
                  y={wp('6%')}
                  textAnchor="middle"
                  clipPath="url(#clip)"
                >
                  #ZingChart
                </SvgText>
              </Svg>
            </TouchableOpacity>
            <View>
              {chart?.slice(0, 5).map((item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setDataPlaylist(chart));
                    dispatch(setTitlePlaylist('#ZingChart'));
                    toPlayMusicUI(item.encodeId);
                  }}
                  key={index}
                  style={{ flexDirection: 'row', marginBottom: hp('2%') }}
                >
                  <View>
                    <Image
                      style={{ height: wp('15%'), width: wp('15%'), borderRadius: 5 }}
                      source={{ uri: item.thumbnail }}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: wp('2.5%'), justifyContent: 'center' }}>
                    <View>
                      <Text
                        numberOfLines={1} // Giới hạn số dòng hiển thị
                        ellipsizeMode="tail" // Thêm dấu ba chấm ở cuối nếu vượt quá chiều rộng
                        style={{ color: 'white', fontSize: wp('4.8'), fontWeight: 'bold' }}
                      >
                        {`${index + 1}. ${item.title}`}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: wp('1.5'), alignItems: 'center' }}>
                      <Entypo name="dot-single" size={wp('4')} color="grey" />
                      <Text
                        numberOfLines={1} // Giới hạn số dòng hiển thị
                        ellipsizeMode="tail" // Thêm dấu ba chấm ở cuối nếu vượt quá chiều rộng
                        style={{ color: 'grey', fontSize: wp('4') }}
                      >
                        {item.artistsNames}
                      </Text>
                    </View>
                  </View>
                  <View style={{ justifyContent: 'center' }}>
                    <TouchableOpacity>
                      <Entypo name="dots-three-horizontal" size={wp('5%')} color="grey" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
              <View style={{ borderTopWidth: 0.4, borderColor: 'grey' }}></View>
              <TouchableOpacity onPress={toggleToZingChart} style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: wp(3.5), paddingTop: 15 }}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {dataHome?.data?.items?.map((genres, index) =>
            genres?.sectionType == 'playlist' ? (
              <View key={genres.encodeId || index}>
                <TouchableOpacity style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{genres.title}</Text>
                  <AntDesign name="right" size={wp(5)} color="white" marginLeft={wp(0.2)} />
                </TouchableOpacity>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: wp(4) }}>
                  {genres?.items?.slice(0, 6).map((item, itemIndex) => (
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(loadPlayList(item.encodeId));
                        togglePlaylistMuic();
                      }}
                      key={item.encodeId || itemIndex}
                      style={{ flexDirection: 'column', width: wp(35), marginRight: wp(3) }}
                    >
                      <Image
                        style={{ height: wp(35), width: wp(35), borderRadius: wp(3), overflow: 'hidden' }}
                        source={{ uri: item.thumbnail }}
                      />
                      {item.sortDescription ? (
                        <Text
                          style={{ fontSize: wp(4), color: 'grey', width: wp(35), marginTop: wp(2) }}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {item.sortDescription}
                        </Text>
                      ) : (
                        <View>
                          <Text
                            style={{
                              fontSize: wp(4),
                              color: 'white',
                              fontWeight: 'bold',
                              width: wp(40),
                              marginTop: wp(2),
                            }}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                          >
                            {item.title}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginTop: wp(2),
                            }}
                          >
                            <Text
                              style={styles.artistsText}
                              numberOfLines={1} // Giới hạn số dòng hiển thị
                              ellipsizeMode="tail" // Thêm dấu ba chấm ở cuối nếu vượt quá chiều rộng
                            >
                              {item?.artists?.reduce((acc, artist, index) => {
                                return acc + artist.name + (index < item.artists.length - 1 ? ', ' : '');
                              }, '')}
                            </Text>
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View
                      style={{
                        height: wp(15),
                        width: wp(15),
                        borderRadius: wp(100),
                        backgroundColor: '#161616',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <AntDesign name="arrowright" size={wp(7)} color="grey" />
                    </View>
                    <Text style={{ color: 'grey', marginTop: wp(1), fontSize: wp(4) }}>Xem tất cả</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            ) : (
              <View key={index}></View>
            ),
          )}
          {dataHomeRadio ? (
            <View>
              <TouchableOpacity style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{dataHomeRadio.title}</Text>
                <AntDesign name="right" size={wp(5)} color="white" marginLeft={wp(0.2)} />
              </TouchableOpacity>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexDirection: 'row', marginTop: wp(4) }}
              >
                {dataHomeRadio.items?.slice(0, 6).map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: wp(2.5),
                    }}
                  >
                    <Image
                      style={{ height: wp(45), width: wp(45), marginRight: wp('2.5%'), borderRadius: 100 }}
                      source={{ uri: item.thumbnail }}
                    />
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: wp(4), marginTop: wp(2) }}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <View
                    style={{
                      height: hp(7),
                      width: wp(15),
                      borderRadius: wp(100),
                      backgroundColor: '#161616',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <AntDesign name="arrowright" size={wp(7)} color="grey" />
                  </View>
                  <Text style={{ color: 'grey', marginTop: wp(1), fontSize: wp(4) }}>Xem tất cả</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          ) : (
            <View></View>
          )}
        </ScrollView>
      </ScrollView>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp('8%'), // 8% of screen width
  },
  headerIcons: {
    flexDirection: 'row',
  },
  bannerScroll: {
    marginTop: wp(3),
  },
  bannerImage: {
    height: wp('50%'), // Ví dụ: 25% của chiều cao màn hình
    width: wp('87%'), // Ví dụ: 90% của chiều rộng màn hình
    marginRight: wp('2.5%'), // Điều chỉnh margin theo tỷ lệ màn hình
    borderRadius: 10,
    overflow: 'hidden',
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
  chipScroll: {
    marginTop: 15,
  },
  chip: {
    height: 100,
    width: 200,
    backgroundColor: 'blue',
    borderRadius: 10,
    marginRight: 10,
    marginTop: 15,
  },
  filterContainer: {
    marginTop: hp('2%'),
    flexDirection: 'row',
  },
  filterButton: {
    backgroundColor: '#9c4de0',
    height: wp('10%'),
    width: wp('25%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginRight: wp('2.5%'),
  },
  filterButtonOutline: {
    borderColor: 'gray',
    borderWidth: 0.5,
    height: wp('10%'),
    width: wp('25%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginRight: wp('2.5%'),
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp('4.5%'),
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: hp('3.5%'),
    marginTop: hp('2%'),
  },
  imageStyle: {
    height: wp('22%'),
    width: wp('22%'),
    marginRight: wp('2.5%'),
    borderRadius: 10,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  itemContainer: {
    marginRight: wp('2.5%'),
    width: wp('90%'),
    marginTop: hp('2%'),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    maxWidth: wp(100),
  },
  titleText: {
    color: 'white',
    fontSize: wp('4.5%'),
    maxWidth: wp(55),
  },
  artistsText: {
    color: 'gray',
    fontSize: wp('3.5%'),
    maxWidth: '80%',
  },
});

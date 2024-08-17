import React, { Component, useEffect, useState } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Text as SvgText,
  ClipPath,
  Rect,
} from 'react-native-svg';
import { loadZingChart, loadDataHome, loadWeekChartByCountry } from '../CallAPI/mp3API';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { formatRelativeTime, formatDate } from '../component/library';
import { Feather, AntDesign, Entypo } from '@expo/vector-icons';
import LoadingIndicator from '../component/loadingIndicator';

import { LineChart } from 'react-native-chart-kit';
import { useDispatch } from 'react-redux';
import { setDataPlaylist, setTitlePlaylist } from '../redux/soundSlice';
import { toggleToPlayMusicUI } from '../component/remote';
export default function ZingChartUI() {
  const [dataHome, setDataHome] = useState([]);
  const toPlayMusicUI = toggleToPlayMusicUI();
  const dispatch = useDispatch();
  const [chart, setChart] = useState();
  const date = formatDate();
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [showAll, setShowAll] = useState(false);
  const [dataTopWeek, setDataTopWeek] = useState([]);
  const [weekChartVPOP, setWeekChartVPOP] = useState([]);
  const [weekChartUSUK, setWeekChartUSUK] = useState([]);
  const [weekChartKPOP, setWeekChartKPOP] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // Trạng thái làm mới
  const [timeLabelChart, setTimeLabelChart] = useState([]);
  const [top1, setTop1] = useState([]);
  const [top2, setTop2] = useState([]);
  const [top3, setTop3] = useState([]);

  const loadData = async () => {
    try {
      const zingChart = await loadZingChart();
      const dataHome = await loadDataHome();
      dataHome.data.items.forEach((item) => {
        if (item.sectionType === 'weekChart') {
          setDataTopWeek(item);
        }
      });
      setChart(zingChart.data.RTChart);
      //IWZ9Z08I: vn  IWZ9Z0BO: korea IWZ9Z0BW: us
      const wcVPOP = await loadWeekChartByCountry('IWZ9Z08I');
      const wcUSUK = await loadWeekChartByCountry('IWZ9Z0BW');
      const wcKPOP = await loadWeekChartByCountry('IWZ9Z0BO');

      setWeekChartVPOP(wcVPOP.data);
      setWeekChartUSUK(wcUSUK.data);
      setWeekChartKPOP(wcKPOP.data);

      // console.log(top1), console.log(timeLabelChart);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after data fetching
    }
  };

  useEffect(() => {
    if (chart && chart.chart && chart.chart.items) {
      // Reset trạng thái trước khi cập nhật
      setTop1([]);
      setTop2([]);
      setTop3([]);

      // Duyệt qua từng mảng trong items
      Object.keys(chart.chart.items).forEach((key, index) => {
        const itemArray = chart.chart.items[key];

        // Cập nhật trạng thái tương ứng với chỉ số (index)
        const updateState = (stateUpdater) => {
          itemArray.forEach((item) => {
            const i = item.counter;
            stateUpdater((prev) => {
              if (!prev.includes(i)) {
                return [...prev, i];
              }
              return prev;
            });
          });
        };

        // Cập nhật trạng thái dựa trên chỉ số
        if (index === 0) {
          updateState(setTop1);
        } else if (index === 1) {
          updateState(setTop2);
        } else if (index === 2) {
          updateState(setTop3);
        }
      });
    }

    if (chart?.chart?.times) {
      // Tạo một mảng tạm thời để chứa các giá trị mới
      const newTimeLabels = [];

      chart.chart.times.forEach((item) => {
        const i = item.hour;
        setTimeLabelChart((prev) => {
          if (!prev.includes(i)) {
            return [...prev, i];
          }
          return prev;
        });
      });
    }
  }, [chart]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData(); // Gọi hàm loadData để làm mới dữ liệu
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleShowAll = () => {
    setShowAll(true);
  };

  const data = {
    labels: timeLabelChart.slice(-12),
    datasets: [
      {
        data: top1.slice(-12), // Giá trị dữ liệu
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Màu của đường line
        strokeWidth: 2, // Độ dày của đường line
      },
      {
        data: top2.slice(-12), // Giá trị dữ liệu
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Màu khác cho đường line
        strokeWidth: 2,
      },
      {
        data: top3.slice(-12), // Giá trị dữ liệu
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Màu khác cho đường line
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Màu của trục và nhãn
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Màu của nhãn
    strokeWidth: 1, // Đặt strokeWidth nhỏ để giảm bóng đổ
    propsForDots: {
      r: wp(1), // Bán kính của chấm (4px)
      strokeWidth: wp(0.2), // Độ dày viền của chấm (2px)
      stroke: '#fff', // Màu viền của chấm
    },
    useShadowColorFromDataset: true, // Không sử dụng màu bóng từ dataset
    decimalPlaces: 0, // Không có số thập phân
    propsForBackgroundLines: {
      strokeWidth: 0, // Loại bỏ đường grid
    },
    // Thêm min và max cho trục dọc
    yAxisLabel: '',
    yAxisSuffix: '',
    yAxisMin: 0, // Giá trị tối thiểu của trục dọc
    yAxisMax: 10827.6, // Giá trị tối đa của trục dọc
  };

  return loading ? (
    <LoadingIndicator></LoadingIndicator>
  ) : (
    <LinearGradient
      colors={['#000099', '#000022', '#000022', '#000022']} // Các màu gradient từ trên xuống
      style={{
        height: hp(100),
        borderRadius: wp('2.5%'), // 2.5% of screen width
        padding: wp('5%'), // 5% of screen width
        paddingVertical: wp(15),
        paddingBottom: hp(10),
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['white']} // Set the color for Android
            tintColor="white" // Set the color for iOS
          />
        }
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: wp(5) }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
              y={wp('5%')}
              textAnchor="middle"
              clipPath="url(#clip)"
            >
              #ZingChart
            </SvgText>
          </Svg>
          <View style={styles.headerIcons}>
            <Feather name="mic" size={wp('6%')} color="white" style={{ marginRight: wp('5%') }} />
            <Feather name="search" size={wp('6%')} color="white" />
          </View>
        </View>
        <View style={styles.labelsContainer}>
          <View style={styles.label}>
            <Image
              style={{
                width: wp(15),
                height: wp(15),
                borderRadius: wp(10),
                borderWidth: wp(0.5),
                borderColor: 'rgba(0, 122, 255, 1)',
              }}
              source={{ uri: chart?.items[0].thumbnail }}
            />
          </View>
          <View style={styles.label}>
            <Image
              style={{
                width: wp(15),
                height: wp(15),
                borderRadius: wp(10),
                borderWidth: wp(0.5),
                borderColor: 'rgba(0, 255, 0, 1)',
              }}
              source={{ uri: chart?.items[1].thumbnail }}
            />
          </View>
          <View style={styles.label}>
            <Image
              style={{
                width: wp(15),
                height: wp(15),
                borderRadius: wp(10),
                borderWidth: wp(0.5),
                borderColor: 'rgba(255, 0, 0, 1)',
              }}
              source={{ uri: chart?.items[2].thumbnail }}
            />
          </View>
        </View>
        <View style={{ overflow: 'hidden' }}>
          <LineChart
            data={data}
            width={wp(108)}
            height={wp(50)}
            chartConfig={chartConfig}
            withDots={true} // Không hiển thị các chấm
            withInnerLines={false} // Không hiển thị các đường nội bộ
            withVerticalLabels={true} // Hiển thị nhãn trục dọc
            withHorizontalLabels={false} // Hiển thị nhãn trục ngang
            yAxisLabel=""
            yAxisSuffix=""
            xAxisLabel=""
            style={{ marginLeft: -wp(13) }}
          />
        </View>

        {!showAll ? (
          <View>
            {chart?.items?.slice(0, 20).map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  dispatch(setDataPlaylist(chart.items));
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
                      style={{ color: 'white', fontSize: wp('4'), fontWeight: 'bold' }}
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
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity
                onPress={toggleShowAll}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: wp(0.3),
                  borderRadius: wp(5),
                  borderColor: 'white',
                  width: wp(30),
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: wp(3.5), paddingVertical: wp(2) }}>
                  Xem thêm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            {chart?.items?.map((item, index) => (
              <TouchableOpacity key={index} style={{ flexDirection: 'row', marginBottom: hp('2%') }}>
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
                      style={{ color: 'white', fontSize: wp('4'), fontWeight: 'bold' }}
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
          </View>
        )}
        <View style={{ marginTop: wp(3) }}>
          <Text style={{ color: 'white', fontSize: wp(6), fontWeight: 'bold' }}>#zingchart tuần</Text>
        </View>
        <TouchableOpacity
          style={{
            marginTop: wp(3),
            borderRadius: wp(3),
            backgroundColor: 'black',
            padding: wp(3),
            flexDirection: 'row',
          }}
        >
          <Image
            style={{ height: wp(25), width: wp(25), borderRadius: wp(3), marginRight: wp(3) }}
            source={{ uri: weekChartVPOP?.items[0].thumbnail }}
          />
          <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: wp(4.5) }}>V-POP</Text>

            {weekChartVPOP?.items?.slice(0, 3).map((item, index) => (
              <View styles={{ marginTop: wp(4) }} key={index}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ color: 'white', fontSize: wp(4), fontWeight: '700' }}
                >
                  {index + 1}. {item.title}
                </Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginTop: wp(3),
            borderRadius: wp(3),
            backgroundColor: 'black',
            padding: wp(3),
            flexDirection: 'row',
          }}
        >
          <Image
            style={{ height: wp(25), width: wp(25), borderRadius: wp(3), marginRight: wp(3) }}
            source={{ uri: weekChartUSUK?.items[0].thumbnail }}
          />
          <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: wp(4.5) }}>US-UK</Text>

            {weekChartUSUK?.items?.slice(0, 3).map((item, index) => (
              <View styles={{ marginTop: wp(4) }} key={index}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ color: 'white', fontSize: wp(4), fontWeight: '700' }}
                >
                  {index + 1}. {item.title}
                </Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginTop: wp(3),
            borderRadius: wp(3),
            backgroundColor: 'black',
            padding: wp(3),
            flexDirection: 'row',
          }}
        >
          <Image
            style={{ height: wp(25), width: wp(25), borderRadius: wp(3), marginRight: wp(3) }}
            source={{ uri: weekChartKPOP?.items[0].thumbnail }}
          />
          <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: wp(4.5) }}>K-POP</Text>

            {weekChartKPOP?.items?.slice(0, 3).map((item, index) => (
              <View styles={{ marginTop: wp(4) }} key={index}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ color: 'white', fontSize: wp(4), fontWeight: '700' }}
                >
                  {index + 1}. {item.title}
                </Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerIcons: {
    flexDirection: 'row',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: wp(90),
    marginBottom: wp(2),
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorBox: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(5),
    marginRight: wp(2),
  },
  labelText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp(4),
  },
});

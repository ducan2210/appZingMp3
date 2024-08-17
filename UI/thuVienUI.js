import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FontAwesome6, AntDesign, Feather, Entypo, FontAwesome5 } from '@expo/vector-icons';

const BoxViewIcon = ({ title, iconName, color }) => (
  <TouchableOpacity style={styles.boxViewContainer}>
    <AntDesign name={iconName} size={wp(8)} color={color} />
    <View>
      <Text style={styles.boxTitle}>{title}</Text>
      <Text style={styles.boxTitle}></Text>
    </View>
  </TouchableOpacity>
);

export default function ThuVienUI() {
  const [selectedMenuSound, setSelectedMenuSound] = useState('playlist');

  const toggleMenuSound = (genre) => {
    setSelectedMenuSound(genre);
  };
  return (
    <View style={styles.Container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Thư viện</Text>
          <View style={styles.headerIcons}>
            <Feather name="mic" size={wp('6%')} color="white" style={{ marginRight: wp('5%') }} />
            <Feather name="search" size={wp('6%')} color="white" />
          </View>
        </View>

        {/* ScrollView ngang */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.boxContainer}>
          <BoxViewIcon title="Yêu thích" iconName="hearto" color="#00ffff" />
          <BoxViewIcon title="Đã tải" iconName="clouddownload" color="#c273ed" />
          <BoxViewIcon title="Upload" iconName="cloudupload" color="#FFCC33" />
          <BoxViewIcon title="MV" iconName="youtube" color="#c273ed" />
          <BoxViewIcon title="Nghệ sĩ" iconName="user" color="#ff9933" />
        </ScrollView>

        <View>
          <TouchableOpacity style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nghe gần đây</Text>
            <AntDesign name="right" size={wp(5)} color="white" marginLeft={wp(0.2)} />
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={{
                height: wp(30),
                width: wp(30),
                borderRadius: wp(2),
                marginTop: wp(4),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FF6666',
              }}
            >
              <FontAwesome6 name="clock-rotate-left" size={wp(17)} color="#ff9933" />
            </View>
            <Text style={{ fontWeight: '600', color: 'white', fontSize: wp(3.7), marginTop: wp(2), maxWidth: wp(30) }}>
              Bài hát nghe gần đây
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: wp(5) }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => toggleMenuSound('playlist')}>
              <Text
                style={{
                  fontSize: wp(4),
                  fontWeight: 'bold',
                  color: selectedMenuSound === 'playlist' ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  marginRight: wp(5),
                }}
              >
                Playlist
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleMenuSound('album')}>
              <Text
                style={{
                  fontSize: wp(4),
                  fontWeight: 'bold',
                  color: selectedMenuSound === 'album' ? 'white' : 'rgba(255, 255, 255, 0.5)',
                }}
              >
                Album
              </Text>
            </TouchableOpacity>
          </View>
          {selectedMenuSound === 'playlist' ? (
            <TouchableOpacity>
              <Entypo name="dots-three-horizontal" size={wp(6)} color="#A9A9A9" />
            </TouchableOpacity>
          ) : (
            <View></View>
          )}
        </View>
        <View>
          {selectedMenuSound === 'playlist' ? (
            <TouchableOpacity style={{ marginTop: wp(2), flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  height: wp(18),
                  width: wp(18),
                  borderRadius: wp(2),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <AntDesign name="plus" size={wp(9)} color="grey" />
              </View>
              <Text style={{ color: 'white', fontSize: wp(4), marginLeft: wp(2) }}>Tạo playlist</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ marginTop: wp(10), justifyContent: 'center', alignItems: 'center' }}>
              <View
                style={{
                  height: wp(12),
                  width: wp(12),
                  borderRadius: wp(2),
                  borderWidth: wp(0.1),
                  borderColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <FontAwesome5 name="itunes-note" size={wp(8)} color="white" />
              </View>
              <Text style={{ color: 'white', fontSize: wp(4), marginTop: wp(3), fontWeight: 'bold' }}>
                Bạn chưa có album nào
              </Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.5)', marginTop: wp(3), fontSize: wp(4) }}>
                Tìm album yêu thích để thêm vào thư viện
              </Text>
            </View>
          )}
        </View>
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
  boxContainer: {
    marginTop: hp(2),
  },
  boxViewContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: wp(29),
    width: wp(29),
    justifyContent: 'center',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: wp(2),
    marginRight: wp(2), // Cách nhau một khoảng nhỏ giữa các hộp
    paddingVertical: wp(2),
  },
  boxTitle: {
    color: 'white',
    marginTop: hp(1),
    textAlign: 'center',
    fontSize: wp(4),
    fontWeight: '600',
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

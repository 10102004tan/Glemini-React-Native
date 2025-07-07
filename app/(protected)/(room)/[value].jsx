import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text, View, ScrollView, Alert, TouchableOpacity, BackHandler, Animated, StyleSheet } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import Wrapper from '@/components/customs/Wrapper';
import { useAuthStore } from '@/store/useAuthStore';
import { useRoomProvider } from '@/contexts/RoomProvider';
import socket, { authenticateSocket } from '@/libs/socket';
import { API_VERSION, END_POINTS } from '@/configs/api.config';
import api from '@/libs/axios';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message-custom';
import { useAppProvider } from '@/contexts/AppProvider';
import UserJoinedRoomItem from '@/components/customs/UserJoinedRoomItem';
import Button from '@/components/customs/Button';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Lottie from '@/components/loadings/Lottie';
import { LinearGradient } from 'expo-linear-gradient';

export default function RoomScreen() {
  const { value } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { setCurrentRoom } = useRoomProvider();
  const { i18n } = useAppProvider();
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [roomData, setRoomData] = useState(null);
  const [totalJoinedUsers, setTotalJoinedUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showJoinAnim, setShowJoinAnim] = useState(false);
  const isFocused = useIsFocused();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Authenticate socket khi component mount
    if (user && user.accessToken) {
      authenticateSocket(user.accessToken, user.refreshToken);
    }

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Bounce animation nhẹ nhàng cho icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [user]);

  useEffect(() => {
    // Lắng nghe sự kiện khi user join room
    socket.on('userJoined', (data) => {
      setJoinedUsers((prev) => [...prev, data.user]);
      setTotalJoinedUsers((prev) => prev + 1);
      setShowJoinAnim(true);
      setTimeout(() => setShowJoinAnim(false), 2000);
      Toast.show({
        type: 'success',
        text1: '🎉 Chào mừng!',
        text2: `${data.user.fullname || data.user.user_fullname} đã tham gia phòng`,
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 50,
      });
    });

    // Lắng nghe danh sách user cập nhật
    socket.on('updateUserList', (users) => {
      setJoinedUsers(users);
      setTotalJoinedUsers(users.length);
    });

    // Lắng nghe khi người dùng rời phòng
    socket.on('userLeft', (data) => {
      setJoinedUsers((prev) => prev.filter((user) => user.user_id !== data.user.user_id));
      setTotalJoinedUsers((prev) => prev - 1);
      Toast.show({
        type: 'info',
        text1: '👋 Tạm biệt!',
        text2: `${data.user.fullname || data.user.user_fullname} đã rời phòng`,
        visibilityTime: 3000,
        autoHide: true,
      });
    });

    // Lắng nghe sự kiện khi bắt đầu phòng chơi
    socket.on('startQuiz', () => {
      if (roomData && user) {
        Toast.show({
          type: 'success',
          text1: '🚀 Bắt đầu!',
          text2: 'Phòng chơi đã bắt đầu',
          visibilityTime: 2000,
          autoHide: true,
        });
        setTimeout(() => {
          router.replace({
            pathname: '/(play)/realtime',
            params: {
              quizId: roomData.quiz_id,
              roomId: roomData._id,
              roomCode: roomData.room_code,
              createdUserId: roomData.user_created_id,
            },
          });
        }, 2000);
      }
    });

    // Hủy lắng nghe khi component bị hủy
    return () => {
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('updateUserList');
      socket.off('startQuiz');
    };
  }, [roomData, user]);

  useEffect(() => {
    const getRoomData = async () => {
      try {
        setIsLoading(true);
        const response = await api.post(`${API_VERSION.V1}${END_POINTS.ROOM_DETAIL}`, {
          room_code: value,
        });
        const data = response.data;
        if (data.statusCode === 200) {
          setRoomData(data.metadata);
        }
      } catch (error) {
        console.log('Error fetching room data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getRoomData();
  }, [value]);

  useEffect(() => {
    if (!isFocused) return;
    const backAction = async () => {
      Alert.alert('Xác nhận', 'Bạn có chắc muốn thoát khỏi phòng chờ?', [
        { text: 'Hủy', onPress: () => null, style: 'cancel' },
        {
          text: 'Thoát',
          onPress: async () => {
            try {
              const exitRoom = await api.post(`${API_VERSION.V1}${END_POINTS.ROOM_REMOVE_USER}`, {
                room_code: value,
                user_id: user.user_id,
              });
              const data = exitRoom.data;
              if (data.statusCode === 200) {
                socket.emit('leaveRoom', { roomCode: value, user: user });
                router.replace({
                  pathname: '/(protected)/(room)/list',
                  params: {},
                });
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Không thể thoát khỏi phòng chơi',
                  visibilityTime: 3000,
                  autoHide: true,
                });
              }
            } catch (error) {
              console.log('Error leaving room:', error);
            }
          },
        },
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => {
      backHandler.remove();
    };
  }, [isFocused, value, user]);

  const handleLeaveRoom = async () => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn thoát khỏi phòng chờ?', [
      { text: 'Hủy', onPress: () => null, style: 'cancel' },
      {
        text: 'Thoát',
        onPress: async () => {
          try {
            const exitRoom = await api.post(`${API_VERSION.V1}${END_POINTS.ROOM_REMOVE_USER}`, {
              room_code: value,
              user_id: user.user_id,
            });
            const data = exitRoom.data;
            if (data.statusCode === 200) {
              socket.emit('leaveRoom', { roomCode: value, user: user });
              router.replace({
                pathname: '/(protected)/(room)/list',
                params: {},
              });
            } else {
              Toast.show({
                type: 'error',
                text1: 'Không thể thoát khỏi phòng chơi',
                visibilityTime: 3000,
                autoHide: true,
              });
            }
          } catch (error) {
            console.log('Error leaving room:', error);
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <Wrapper>
        <View className="flex-1 justify-center items-center">
          <Lottie source={require('@/assets/jsons/fly-loading.json')} width={200} height={200} />
          <Text className="text-lg font-semibold mt-4 text-blue-600">Đang tải thông tin phòng...</Text>
        </View>
      </Wrapper>
    );
  }

  return (
    <LinearGradient colors={["#a8ff78", "#78ffd6"]} style={{ flex: 1 }}>
      <Wrapper>
        <Animated.View
          className="flex-1"
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          {/* Header với gradient background */}
          <View style={{padding: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, backgroundColor: '#4ade80', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View style={{flex: 1}}>
              <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>Phòng chơi</Text>
              <Text style={{color: '#fff', fontSize: 32, fontWeight: 'bold'}}>{value}</Text>
            </View>
            <TouchableOpacity
              onPress={handleLeaveRoom}
              style={{backgroundColor: '#fff', padding: 12, borderRadius: 100, elevation: 4}}>
              <Ionicons name="exit-outline" size={28} color="#ef4444" />
            </TouchableOpacity>
          </View>

          {/* Hiệu ứng join vui nhộn */}
          {showJoinAnim && (
            <View style={{position: 'absolute', top: 100, left: 0, right: 0, alignItems: 'center', zIndex: 10}}>
              <Lottie source={require('@/assets/jsons/fly-loading.json')} width={120} height={120} />
              <Text style={{color: '#16a34a', fontWeight: 'bold', fontSize: 18, marginTop: 8}}>Có người mới tham gia!</Text>
            </View>
          )}

          {/* Room Info Card */}
          {roomData && (
            <View style={{marginHorizontal: 16, marginTop: -32, backgroundColor: '#fff', borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, padding: 16, marginBottom: 16, elevation: 4}}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                <Ionicons name="information-circle" size={20} color="#3b82f6" />
                <Text style={{fontSize: 18, fontWeight: 'bold', marginLeft: 8, color: '#333'}}>Thông tin phòng</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{alignItems: 'center'}}>
                  <Ionicons name="time-outline" size={24} color="#10b981" />
                  <Text style={{fontSize: 13, color: '#666', marginTop: 2}}>Thời gian</Text>
                  <Text style={{fontWeight: 'bold', color: '#10b981'}}>{roomData.room_time} phút</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                  <Ionicons name="people-outline" size={24} color="#f59e0b" />
                  <Text style={{fontSize: 13, color: '#666', marginTop: 2}}>Tối đa</Text>
                  <Text style={{fontWeight: 'bold', color: '#f59e0b'}}>{roomData.user_max} người</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                  <Ionicons name="checkmark-circle-outline" size={24} color="#3b82f6" />
                  <Text style={{fontSize: 13, color: '#666', marginTop: 2}}>Đã tham gia</Text>
                  <Text style={{fontWeight: 'bold', color: '#3b82f6'}}>{totalJoinedUsers}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Joined Users Section */}
          <View style={{flex: 1, paddingHorizontal: 16}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="people" size={20} color="#3b82f6" />
                <Text style={{fontSize: 18, fontWeight: 'bold', marginLeft: 8, color: '#333'}}>
                  Người tham gia ({totalJoinedUsers})
                </Text>
              </View>
              <View style={{backgroundColor: '#bbf7d0', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16}}>
                <Text style={{color: '#16a34a', fontWeight: 'bold', fontSize: 13}}>
                  {joinedUsers.length > 0 ? 'Đang hoạt động' : 'Chờ người tham gia'}
                </Text>
              </View>
            </View>
            <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
              {joinedUsers.length > 0 ? (
                joinedUsers.map((userItem, index) => (
                  <Animated.View
                    key={userItem.user_id || userItem._id || index}
                    style={{
                      opacity: fadeAnim,
                      transform: [{ scale: scaleAnim }],
                      marginBottom: 12,
                    }}
                  >
                    <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', borderRadius: 20, padding: 12, elevation: 2}}>
                      <View style={{width: 48, height: 48, borderRadius: 24, backgroundColor: '#bbf7d0', alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 2, borderColor: '#4ade80'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 20, color: '#16a34a'}}>
                          {(userItem.fullname || userItem.user_fullname || 'U').split(' ').map(w => w[0]).join('').toUpperCase()}
                        </Text>
                      </View>
                      <View style={{flex: 1}}>
                        <Text style={{fontWeight: 'bold', fontSize: 16, color: '#333'}}>{userItem.fullname || userItem.user_fullname}</Text>
                        <Text style={{fontSize: 13, color: '#666'}}>{userItem.email || userItem.user_email}</Text>
                      </View>
                    </View>
                  </Animated.View>
                ))
              ) : (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 32}}>
                  <Lottie
                    source={require('@/assets/jsons/empty.json')}
                    width={150}
                    height={150}
                  />
                  <Text style={{color: '#999', fontWeight: 'bold', fontSize: 16, marginTop: 12}}>
                    Chưa có người tham gia
                  </Text>
                  <Text style={{color: '#bbb', fontSize: 13, marginTop: 4}}>
                    Hãy chờ giáo viên và các bạn khác tham gia
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Bottom Status Bar */}
          <View style={{marginHorizontal: 16, marginBottom: 16, padding: 16, backgroundColor: '#f0fdf4', borderRadius: 20, borderWidth: 1, borderColor: '#bbf7d0', alignItems: 'center'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <View style={{width: 12, height: 12, backgroundColor: '#16a34a', borderRadius: 6, marginRight: 8}} />
              <Text style={{color: '#16a34a', fontWeight: 'bold', fontSize: 15}}>
                Sẵn sàng tham gia phòng chơi
              </Text>
            </View>
          </View>
        </Animated.View>
      </Wrapper>
    </LinearGradient>
  );
}

import { View, Text, ScrollView, Alert, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import Wrapper from '@/components/customs/Wrapper';
import Field from '@/components/customs/Field';
import Button from '@/components/customs/Button';
import Feather from '@expo/vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import UserJoinedRoomItem from '@/components/customs/UserJoinedRoomItem';
import socket, { authenticateSocket } from '@/libs/socket';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/libs/axios';
import * as Clipboard from 'expo-clipboard';
import { AppState } from 'react-native';
import { BackHandler } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import QRGenerator from '@/components/customs/QRGenerator';
import Toast from 'react-native-toast-message-custom';
import Lottie from '@/components/loadings/Lottie';
import BottomSheet from '@/components/customs/BottomSheet';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import Overlay from '@/components/customs/Overlay';
import { SelectList } from 'react-native-dropdown-select-list';
import { useAppProvider } from '@/contexts/AppProvider';
import { CommonActions, useNavigation } from '@react-navigation/native';

const TeacherRoomWaitScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [roomData, setRoomData] = useState(null);
  const { user } = useAuthStore();
  const { roomCode } = useGlobalSearchParams();
  const [totalJoindUsers, setTotalJoindUsers] = useState(0);
  const [testLoading, setTestLoading] = useState(true);
  const { classrooms } = useClassroomProvider();
  const [showClassroom, setShowClassroom] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const { i18n } = useAppProvider();

  useEffect(() => {
    if (user && user.accessToken) {
      authenticateSocket(user.accessToken, user.refreshToken);
    }

    socket.on('userJoined', (data) => {
      console.log('🔔 Teacher received userJoined event:', data);
      setJoinedUsers((prev) => [...prev, data.user]);
      console.log(`User ${data.user.fullname || data.user.user_fullname} joined room`);
      setTotalJoindUsers((prev) => prev + 1);
      Toast.show({
        type: 'info',
        text1: i18n.t('room_wait.userJoined').replace('{name}', data.user.fullname || data.user.user_fullname),
        visibilityTime: 3000,
        autoHide: true,
      });
    });

    socket.on('updateUserList', (users) => {
      console.log('📋 Teacher received updateUserList event:', users);
      setJoinedUsers(users);
      setTotalJoindUsers(users.length);
    });

    socket.on('kicked', async (data) => {
      const removed = await api.post(`${API_VERSION.V1}${END_POINTS.ROOM_REMOVE_USER}`, {
        room_code: roomCode,
        user_id: user.user_id,
      });

      const resultRemoved = removed.data;
      if (resultRemoved.statusCode === 200) {
        Toast.show({
          type: 'info',
          text1: i18n.t('room_wait.kicked').replace('{name}', data.userName),
          visibilityTime: 3000,
          autoHide: true,
        });

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: '(homev2)' }],
          })
        );
      }

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: '(homev2)' }],
        })
      );
    });

    socket.on('userLeft', (data) => {
      setJoinedUsers((prev) => prev.filter((user) => user._id !== data.user._id));
      console.log(data.message);
      setTotalJoindUsers((prev) => prev - 1);
      Toast.show({
        type: 'info',
        text1: i18n.t('room_wait.userLeft').replace('{name}', data.user.user_fullname),
        visibilityTime: 3000,
        autoHide: true,
      });
    });

    return () => {
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('updateUserList');
      socket.off('kicked');
    };
  }, []);

  useEffect(() => {
    const getRoomData = async () => {
      const response = await api.post(`${API_VERSION.V1}${END_POINTS.ROOM_DETAIL}`, {
        room_code: roomCode,
      });
      const data = response.data;
      if (data.statusCode === 200) {
        setRoomData(data.metadata);

        // Kiểm tra trạng thái socket và join room
        const joinRoomWithSocket = () => {
          console.log('🔌 Socket connected:', socket.connected);
          console.log('Teacher user object being sent to socket:', user);
          console.log('🚀 Teacher emitting joinRoom with roomCode:', roomCode);

          if (socket.connected) {
            socket.emit('joinRoom', { roomCode: roomCode, user: user });
            console.log(`Teacher ${user.fullname || user.user_fullname} joined room: ${roomCode}`);
          } else {
            console.log('⚠️ Socket not connected, waiting for connection...');
            // Thử lại sau 1 giây
            setTimeout(joinRoomWithSocket, 1000);
          }
        };

        // Thử join room ngay lập tức
        joinRoomWithSocket();

        // Lắng nghe sự kiện socket connect để join room
        const handleSocketConnect = () => {
          console.log('🔌 Socket connected, joining room...');
          socket.emit('joinRoom', { roomCode: roomCode, user: user });
        };

        socket.on('connect', handleSocketConnect);

        return () => {
          socket.off('connect', handleSocketConnect);
        };
      }
    };
    getRoomData();
  }, [roomCode, user]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        console.log('User has left the app');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;

    const backAction = async () => {
      Alert.alert(i18n.t('room_wait.alert'), i18n.t('room_wait.exitRoomConfirmation'), [
        { text: i18n.t('room_wait.cancel'), onPress: () => null, style: 'cancel' },
        {
          text: i18n.t('room_wait.leave'),
          onPress: async () => {
            const exitRoom = await api.post(`${API_VERSION.V1}${END_POINTS.ROOM_REMOVE_USER}`, {
              room_code: roomCode,
              user_id: user.user_id,
            });

            const data = exitRoom.data;
            if (data.statusCode === 200) {
              socket.emit('leaveRoom', { roomCode: roomCode, user: user });
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: '(homev2)' }],
                })
              );
            } else {
              Toast.show({
                type: 'info',
                text1: i18n.t('room_wait.errorLeaveRoom'),
                visibilityTime: 3000,
                autoHide: true,
              });
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
  }, [isFocused]);

  useEffect(() => {
    socket.on('startQuiz', () => {
      if (roomData && user) {
        // Giáo viên không cần chuyển vào màn hình chơi, chỉ cần ở lại màn hình theo dõi
        console.log('🎮 Quiz started - Teacher stays in monitoring screen');
        // Không cần làm gì cả, giáo viên đã ở màn hình teacher_room_wait_result rồi
      }
    });

    return () => {
      socket.off('startQuiz');
    };
  }, [user, roomData]);

  const handleCopyRoomCode = async () => {
    try {
      await Clipboard.setStringAsync(roomData.room_code);
      Toast.show({
        type: 'success',
        text1: i18n.t('room_wait.copyRoomCodeSuccess'),
        visibilityTime: 1000,
        autoHide: true,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: i18n.t('room_wait.copyRoomCodeFail'),
        visibilityTime: 1000,
        autoHide: true,
      });
    }
  };

  const handleStartRoom = async () => {
    if (joinedUsers.length - 1 < 1) {
      Toast.show({
        type: 'info',
        text1: i18n.t('room_wait.roomNotEnoughPlayers'),
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    const joinedUsersId = joinedUsers.map((user) => user._id);

    const response = await api.post(`${API_VERSION.V1}${END_POINTS.ROOM_UPDATE_STATUS}`, {
      room_code: roomCode,
      status: 'doing',
      joined_users: joinedUsersId,
    });

    const data = response.data;
    if (data.statusCode === 200) {
      socket.emit('startRoom', { roomCode: roomCode });
      router.replace({
        pathname: '/(teacher)/teacher_room_wait_result',
        params: {
          roomCode: roomCode,
          users: JSON.stringify(joinedUsers),
          quizId: roomData.quiz_id,
          roomTime: roomData.room_time,
          createdAt: roomData.createdAt,
        },
      });
    } else {
      Toast.show({
        type: 'info',
        text1: i18n.t('room_wait.cannotStartRoom'),
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const handleReOpenRoom = async () => {
    const response = await api.post(`${API_VERSION.V1}${END_POINTS.ROOM_UPDATE_STATUS}`, {
      room_code: roomCode,
      status: 'start',
    });

    const data = response.data;
    if (data.statusCode === 200) {
      console.log(roomData);
      setRoomData(data.metadata);
    } else {
      Toast.show({
        type: 'info',
        text1: i18n.t('room_wait.cannotStartRoom'),
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const handleNotification = async (classroomId, roomCode) => {
    if (classroomId === null) {
      Toast.show({
        type: 'info',
        text1: i18n.t('room_wait.classroomSelect'),
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    try {
      const res = await api.post(`${API_VERSION.V1}${END_POINTS.NOTIFY_SHARE_ROOM}`, {
        classroomId,
        roomCode,
      });

      const data = res.data;
      console.log(data);
      if (data.statusCode === 200) {
        Toast.show({
          type: 'success',
          text1: i18n.t('room_wait.notifySent'),
          visibilityTime: 1000,
          autoHide: true,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: i18n.t('room_wait.notifyError'),
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: i18n.t('room_wait.notifyError'),
        visibilityTime: 1000,
        autoHide: true,
      });
    }
  };

  const handleLeaveRoom = () => {
    Alert.alert(i18n.t('room_wait.alert'), i18n.t('room_wait.exitRoomConfirmation'), [
      {
        text: i18n.t('room_wait.cancel'),
        onPress: () => {},
      },
      {
        text: i18n.t('room_wait.leave'),
        onPress: async () => {
          const exitRoom = await api.post(`${API_VERSION.V1}${END_POINTS.ROOM_REMOVE_USER}`, {
            room_code: roomCode,
            user_id: user.user_id,
          });

          const data = exitRoom.data;
          if (data.statusCode === 200) {
            socket.emit('leaveRoom', { roomCode: roomCode, user: user });

            const removed = await api.post(`${API_VERSION.V1}${END_POINTS.ROOM_REMOVE_USER}`, {
              room_code: roomCode,
              user_id: user.user_id,
            });

            const resultRemoved = removed.data;
            if (resultRemoved.statusCode === 200) {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: '(homev2)' }],
                })
              );
            } else {
              Toast.show({
                type: 'info',
                text1: i18n.t('room_wait.errorLeaveRoom'),
                visibilityTime: 3000,
                autoHide: true,
              });
            }
          } else {
            Toast.show({
              type: 'info',
              text1: i18n.t('room_wait.errorLeaveRoom'),
              visibilityTime: 3000,
              autoHide: true,
            });
          }
        },
      },
    ]);
  };

  if (!roomData) {
    return (
      <View style={styles.loadingContainer}>
        <Lottie source={require('@/assets/jsons/fly-loading.json')} width={300} height={300} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Bottom sheet */}
      <Overlay
        visible={showClassroom}
        onPress={() => {
          setShowClassroom(false);
        }}
      />
      <BottomSheet
        visible={showClassroom}
        onClose={() => {
          setShowClassroom(false);
        }}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>{i18n.t('room_wait.listJoined')}</Text>
          <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
            {classrooms.length > 0 &&
              classrooms.map((cls) => (
                <SelectList
                  key={cls._id}
                  data={classrooms.map((cls) => ({
                    key: cls._id,
                    value: cls.class_name,
                  }))}
                  setSelected={setSelectedClass}
                  placeholder="Chọn lớp học"
                />
              ))}

            <Pressable
              style={styles.shareButton}
              onPress={() => {
                handleNotification(selectedClass, roomCode);
              }}
            >
              <Text style={styles.shareButtonText}>Chia sẻ</Text>
            </Pressable>
          </ScrollView>
        </View>
      </BottomSheet>

      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Phòng chờ giáo viên</Text>
          <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveRoom}>
            <Icon name="exit-outline" size={20} color="#ef4444" />
            <Text style={styles.leaveButtonText}>{i18n.t('room_wait.leave')}</Text>
          </TouchableOpacity>
        </View>

        {/* Status Messages */}
        <View style={styles.statusContainer}>
          {roomData && roomData.status === 'completed' && (
            <View style={styles.statusCard}>
              <Icon name="checkmark-circle" size={20} color="#22c55e" />
              <Text style={styles.statusText}>{i18n.t('room_wait.roomAlreadyCompleted')}</Text>
            </View>
          )}
          {roomData && roomData.status === 'doing' && (
            <View style={styles.statusCard}>
              <Icon name="play-circle" size={20} color="#3b82f6" />
              <Text style={styles.statusText}>{i18n.t('room_wait.roomInProgress')}</Text>
            </View>
          )}
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Room Code Section */}
          <View style={styles.roomCodeSection}>
            <View style={styles.qrContainer}>
              <View style={styles.roomCodeInput}>
                <Field
                  placeholder={`${i18n.t('room_item.roomCode')}: ${roomData && roomData.room_code}`}
                  disabled={true}
                />
              </View>

              <TouchableOpacity style={styles.copyButton} onPress={handleCopyRoomCode}>
                <Feather name="copy" size={20} color="#fff" />
                <Text style={styles.copyButtonText}>{i18n.t('room_wait.copy')}</Text>
              </TouchableOpacity>

              {user && roomData && user.user_id === roomData.user_created_id && roomData.status === 'completed' && (
                <TouchableOpacity style={styles.actionButton} onPress={handleReOpenRoom}>
                  <Icon2 name="refresh" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>{i18n.t('room_wait.openAgain')}</Text>
                </TouchableOpacity>
              )}

              {user && roomData && user.user_id === roomData.user_created_id && roomData.status === 'doing' && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    router.replace({
                      pathname: '/(teacher)/teacher_room_wait_result',
                      params: {
                        roomCode: roomCode,
                        users: JSON.stringify(joinedUsers),
                        quizId: roomData.quiz_id,
                        createdAt: roomData.createdAt,
                      },
                    });
                  }}
                >
                  <Icon2 name="chart-line" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>{i18n.t('room_wait.followResult')}</Text>
                </TouchableOpacity>
              )}

              {user && roomData && user.user_id === roomData.user_created_id && roomData.status === 'start' && (
                <TouchableOpacity style={styles.startButton} onPress={handleStartRoom}>
                  <Icon2 name="play" size={20} color="#fff" />
                  <Text style={styles.startButtonText}>{i18n.t('room_wait.start')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* QR Code Section */}
          {user && roomData && user.user_id === roomData.user_created_id && (
            <View style={styles.qrSection}>
              <Text style={styles.qrTitle}>{i18n.t('room_wait.shareQr')}</Text>
              <QRGenerator
                value={roomCode}
                handleShareRoom={() => {
                  setShowClassroom(true);
                }}
              />
            </View>
          )}

          {/* Users Count */}
          <View style={styles.usersCountCard}>
            <Icon name="people" size={20} color="#38bdf8" />
            <Text style={styles.usersCountText}>
              {i18n.t('room_wait.totalJoined')} ({totalJoindUsers > 0 ? totalJoindUsers - 1 : totalJoindUsers})
            </Text>
          </View>

          {/* Debug Section */}
          <View style={styles.debugSection}>
            <Text style={styles.debugTitle}>Debug Info</Text>
            <Text style={styles.debugText}>Socket Connected: {socket.connected ? '✅' : '❌'}</Text>
            <Text style={styles.debugText}>Room Code: {roomCode}</Text>
            <Text style={styles.debugText}>Users Count: {joinedUsers.length}</Text>
            <TouchableOpacity
              style={styles.rejoinButton}
              onPress={() => {
                console.log('🔄 Manual rejoin attempt...');
                socket.emit('joinRoom', { roomCode: roomCode, user: user });
              }}
            >
              <Icon name="refresh" size={16} color="#fff" />
              <Text style={styles.rejoinButtonText}>Rejoin Room</Text>
            </TouchableOpacity>
          </View>

          {/* Users List */}
          <View style={styles.usersList}>
            {roomData &&
              joinedUsers.length > 0 &&
              joinedUsers.map((user) => {
                if (user._id !== roomData.user_created_id) {
                  return (
                    <UserJoinedRoomItem
                      roomCode={roomCode}
                      showDelete={user && roomData && user.user_id === roomData.user_created_id}
                      key={user._id}
                      user={user}
                    />
                  );
                }
              })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    color: '#38bdf8',
    fontWeight: '800',
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  leaveButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  roomCodeSection: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  qrContainer: {
    gap: 12,
  },
  roomCodeInput: {
    backgroundColor: '#334155',
    borderRadius: 12,
    overflow: 'hidden',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f59e0b',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  qrSection: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  qrTitle: {
    color: '#38bdf8',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  usersCountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    gap: 8,
  },
  usersCountText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  usersList: {
    gap: 8,
  },
  bottomSheetContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1e293b',
  },
  shareButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  debugSection: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  debugTitle: {
    color: '#38bdf8',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  debugText: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
  rejoinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 4,
  },
  rejoinButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TeacherRoomWaitScreen;

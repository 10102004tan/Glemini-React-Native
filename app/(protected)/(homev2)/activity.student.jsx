import { useResultProvider } from '@/contexts/ResultProvider';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Alert,
  Dimensions,
  Text,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Field from '@/components/customs/Field';
import { API_VERSION, END_POINTS } from '@/configs/api.config';
import { useRoomProvider } from '@/contexts/RoomProvider';
import socket from '@/libs/socket';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCameraPermissions } from 'expo-camera';
import { useAppProvider } from '@/contexts/AppProvider';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/libs/axios';
import CompletedResults from '@/components/customs/CompletedResults';
import DoingResults from '@/components/customs/DoingResults';
import ScaleTouchable from '@/components/customs/ScaleTouchable';

const screenWidth = Dimensions.get('window').width;

const ActivityStudent = () => {
  const { i18n } = useAppProvider();
  const { results, fetchResultsForStudent, fetchResetResultOfQuiz } = useResultProvider();
  const [roomCode, setRoomCode] = useState('');
  const [roomTemp, setRoomTemp] = useState(null);
  const { user } = useAuthStore();
  const { setCurrentRoom } = useRoomProvider();
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [routes] = useState([
    { key: 'doing', title: i18n.t('activity.textDoing') },
    { key: 'completed', title: i18n.t('activity.textCompleted') },
  ]);

  useEffect(() => {
    if (!isPermissionGranted) requestPermission();

    const loadData = async () => {
      setRefreshing(true);
      try {
        await fetchResultsForStudent();
      } catch (error) {
        console.log('[ActivityStudent] Error fetching results:', error);
      } finally {
        setRefreshing(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const checkRoom = async () => {
      try {
        const res = await api.post(`${API_VERSION.V1}${END_POINTS.ROOM_DETAIL}`, {
          room_code: roomTemp,
        });
        const data = res.data;

        if (data.statusCode === 200) {
          if (["completed", "deleted"].includes(data.metadata.status)) {
            Alert.alert('Thông báo', 'Không thể tham gia vào phòng chơi lúc này !!!');
          } else {
            const userCheckRes = await api.post(`${API_VERSION.V1}${END_POINTS.ROOM_CHECK_USER}`, {
              room_code: roomTemp,
              user_id: user.user_id,
            });

            if (userCheckRes.data.metadata) {
              setCurrentRoom(data.metadata._id);
              socket.emit('joinRoom', { roomCode, user });
              router.replace({
                pathname: '/(play)/realtime',
                params: {
                  roomCode: data.metadata.room_code,
                  quizId: data.metadata.quiz_id,
                  roomId: data.metadata._id,
                  createdUserId: data.metadata.user_created_id,
                },
              });
            } else {
              Alert.alert('Thông báo', 'Bạn đã hoàn thành phòng chơi này !!!');
            }
          }
        } else {
          Alert.alert('Thông báo', 'Mã phòng không tồn tại');
        }
      } catch (err) {
        Alert.alert('Lỗi', 'Không thể kết nối tới phòng chơi');
      } finally {
        setRoomTemp(null);
      }
    };

    if (roomTemp) checkRoom();
  }, [roomTemp]);

  const fetchResults = async () => {
    try {
      setRefreshing(true);
      await fetchResultsForStudent();
    } catch (_) { }
    finally {
      setRefreshing(false);
    }
  };

  return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Field
            placeholder={i18n.t('activity.textRoomCODE')}
            wrapperStyles="mb-3"
            value={roomCode}
            onChange={(text) => setRoomCode(text)}
          />
          <ScaleTouchable onPress={() => setRoomTemp(roomCode)}>
            <View style={styles.buttonPrimary}>
              <Text style={styles.buttonText}>{i18n.t('activity.btnJoin')}</Text>
            </View>
          </ScaleTouchable>

          {isPermissionGranted && (
            <ScaleTouchable
              onPress={() => router.push({ pathname: '/(protected)/(room)/scanner', params: { type: 'join' } })}
            >
              <View style={styles.buttonScan}>
                <Ionicons name="qr-code-outline" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>{i18n.t('activity.btnScan')}</Text>
              </View>
            </ScaleTouchable>

          )}
        </View>

        <TabView
          navigationState={{ index, routes }}
          renderScene={SceneMap({
            doing: () => (
              <DoingResults
                results={results.doing}
                onRefresh={fetchResults}
                i18n={i18n}
                refreshing={refreshing}
                screenWidth={screenWidth}
              />
            ),
            completed: () => (
              <CompletedResults
                results={results.completed}
                onRefresh={fetchResults}
                i18n={i18n}
                fetchResetResultOfQuiz={fetchResetResultOfQuiz}
                refreshing={refreshing}
                screenWidth={screenWidth}
              />
            ),
          })}
          onIndexChange={setIndex}
          initialLayout={{ width: screenWidth }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              style={styles.tabBar}
              indicatorStyle={styles.tabIndicator}
              labelStyle={styles.tabLabel}
            />
          )}
        />
      </View>
  );
};

const styles = {
  container: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 12,
  },
  tabBar: {
    backgroundColor: '#34d399', // xanh lá cây (emerald-400)
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  tabIndicator: {
    backgroundColor: '#10b981', // xanh lá cây đậm hơn (emerald-500)
    height: 4,
    borderRadius: 2,
  },
  tabLabel: {
    fontWeight: '800',
    color: '#ffffff',
  },
  buttonPrimary: {
    backgroundColor: '#10b981', // emerald-500
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#34d399', // emerald-400
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 2,
    flexDirection: 'row',
  },
  buttonScan: {
    backgroundColor: '#84cc16', // lime-500
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#a3e635', // lime-400
    borderBottomWidth: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',

  },
};


export default ActivityStudent;

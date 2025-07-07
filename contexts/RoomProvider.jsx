import { Alert, Linking } from 'react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { useRouter } from 'expo-router';
import socket from '@/libs/socket';
import Toast from 'react-native-toast-message-custom';
import { useAppProvider } from './AppProvider';
import api from '@/libs/axios';
import { useAuthStore } from '@/store/useAuthStore';

const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const router = useRouter();

  const { user } = useAuthStore();
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const { i18n } = useAppProvider();

  const createRoom = async (room_code, quiz_id, user_created_id, user_max, description) => {
    const response = await api.post(`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_CREATE}`, {
      room_code,
      quiz_id,
      user_created_id,
      user_max,
      description: description || 'no desc',
    });

    const data = await response.data;
    if (data.statusCode === 200) {
      setRoom(data.metadata);
      setCurrentRoom(data.metadata.room_code);
      socket.emit('joinRoom', { roomCode: data.metadata.room_code, user: user });
      router.replace({
        pathname: '/(protected)/(teacher)/teacher_room_wait',
        params: { roomCode: data.metadata.room_code },
      });
    }
  };

  const checkRoom = async (roomCode) => {
    const res = await api.post(`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_DETAIL}`, {
      room_code: roomCode,
    });

    const notAccepted = ['completed', 'deleted'];

    const data = await res.data;
    if (data.statusCode === 200) {
      if (notAccepted.includes(data.metadata.status)) {
        Alert.alert(i18n.t('room_wait.alert'), i18n.t('room_wait.cannotStartRoom'));
      } else if (data.metadata.status === 'doing') {
        const res = await api.post(`${API_VERSION.V1}${END_POINTS.ROOM_CHECK_USER}`, {
          room_code: roomCode,
          user_id: user.user_id,
        });

        const dt = await res.data;
        if (dt.statusCode === 200 && dt.metadata) {
          setCurrentRoom(data.metadata._id);
          socket.emit('joinRoom', { roomCode, user: user });
          // Người dùng đang chơi bị out, khi join lại chuyển thẳng tới màn hình chơi

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
          Toast.show({
            type: 'error',
            text1: 'Phòng chơi đã bắt đầu, bạn không thể tham gia lúc này',
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      } else {
        try {
          // Xóa kết quả cũ nếu có
          const bodyReset = {
            room_id: data.metadata._id,
            user_id: user.user_id,
          };
          await api.post(`${API_VERSION.V1}${END_POINTS.RESULT_RESET}`, bodyReset);
        } catch (error) {
          console.log(error);
        } finally {
          const bodyAddUser = {
            room_code: data.metadata.room_code,
            user_id: user.user_id,
          };
          const checkAdded = await api.post(
            `${API_VERSION.V1}${END_POINTS.ROOM_ADD_USER}`,
            bodyAddUser,
          );
          const checkData = checkAdded.data;
          if (checkData.statusCode === 200) {
            setCurrentRoom(data.metadata._id);
            socket.emit('joinRoom', { roomCode, user: user });
            router.replace({
              pathname: '/(protected)/(room)/[value]',
              params: { value: roomCode },
            });
          } else {
            if (checkData.message === 'No room found') {
              Toast.show({
                type: 'error',
                text1: i18n.t('room_wait.notFound'),
                visibilityTime: 3000,
                autoHide: true,
              });
            } else if (checkData.message === 'Room is full') {
              Toast.show({
                type: 'error',
                text1: i18n.t('room_wait.full'),
                visibilityTime: 3000,
                autoHide: true,
              });
            } else if (checkData.message === 'User already joined room') {
              Toast.show({
                type: 'error',
                text1: i18n.t('room_wait.joined'),
                visibilityTime: 3000,
                autoHide: true,
              });
            }
          }
        }
      }
    } else {
      Alert.alert(i18n.t('room_wait.alert'), i18n.t('room_wait.notFound'));
    }
  };

  return (
    <RoomContext.Provider
      value={{
        room,
        rooms,
        createRoom,
        setRoom,
        currentRoom,
        setCurrentRoom,
        checkRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomProvider = () => useContext(RoomContext);

export default RoomProvider;

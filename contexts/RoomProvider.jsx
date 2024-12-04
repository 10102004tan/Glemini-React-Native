import { Alert, Linking } from 'react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { useAuthContext } from './AuthContext';
import { useRouter } from 'expo-router';
import socket from '@/utils/socket';
import Toast from 'react-native-toast-message-custom';

const RoomContext = createContext();

const RoomProvider = ({ children }) => {
   const router = useRouter();

   const { userData } = useAuthContext();
   const [rooms, setRooms] = useState([]);
   const [room, setRoom] = useState([]);
   const [currentRoom, setCurrentRoom] = useState(null);


   const createRoom = async (room_code, quiz_id, user_created_id, user_max, description) => {
      const response = await fetch(
         `${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_CREATE}`,
         {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-client-id': userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({
               room_code,
               quiz_id,
               user_created_id,
               user_max,
               description: description || 'no desc'
            })
         }
      );

      const data = await response.json();
      if (data.statusCode === 200) {
         setRoom(data.metadata);
         setCurrentRoom(data.metadata.room_code);
         socket.emit('joinRoom', { roomCode: data.metadata.room_code, user: userData });
         router.replace({
            pathname: '/(app)/(teacher)/teacher_room_wait',
            params: { roomCode: data.metadata.room_code }
         });
      }
   };

   const checkRoom = async (roomCode) => {
      const res = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_DETAIL}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'x-client-id': userData._id,
            authorization: userData.accessToken,
         },
         body: JSON.stringify({
            room_code: roomCode,
         }),
      })

      const notAccepted = ['completed', 'deleted'];

      const data = await res.json();
      if (data.statusCode === 200) {
         if (notAccepted.includes(data.metadata.status)) {
            Alert.alert('Thông báo', 'Không thể tham gia vào phòng chơi lúc này !!!');
         } else if (data.metadata.status === 'doing') {
            const res = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_CHECK_USER}`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'x-client-id': userData._id,
                  authorization: userData.accessToken,
               },
               body: JSON.stringify({
                  room_code: roomCode,
                  user_id: userData._id
               }),
            });

            const dt = await res.json();
            if (dt.statusCode === 200 && dt.metadata) {
               setCurrentRoom(data.metadata._id);
               socket.emit('joinRoom', { roomCode, user: userData });
               // Người dùng đang chơi bị out, khi join lại chuyển thẳng tới màn hình chơi

               router.replace({
                  pathname: '/(play)/realtime',
                  params:
                  {
                     roomCode: data.metadata.room_code, quizId: data.metadata.quiz_id, roomId: data.metadata._id, createdUserId: data.metadata.user_created_id
                  }
               });
            } else {
               Toast.show({
                  type: 'error',
                  text1: 'Bạn đã hoàn thành phòng chơi này !!!',
                  visibilityTime: 3000,
                  autoHide: true,
               });
            }
         } else {
            try {
               // Xóa kết quả cũ nếu có
               const responseDeleteOldResult = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.RESULT_RESET}`, {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                     'x-client-id': userData._id,
                     authorization: userData.accessToken,
                  },
                  body: JSON.stringify({
                     room_id: data.metadata._id,
                     user_id: userData._id,
                  }),
               });
            } catch (error) {
               console.log(error)
            } finally {
               const checkAdded = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_ADD_USER}`, {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                     'x-client-id': userData._id,
                     authorization: userData.accessToken,
                  },
                  body: JSON.stringify({
                     room_code: data.metadata.room_code,
                     user_id: userData._id,
                  }),
               });
               const checkData = await checkAdded.json();
               // console.log(checkData)
               if (checkData.statusCode === 200) {
                  setCurrentRoom(data.metadata._id);
                  socket.emit('joinRoom', { roomCode, user: userData });
                  router.replace({
                     pathname: '/(app)/(teacher)/teacher_room_wait',
                     params: { roomCode: roomCode }
                  });
               } else {
                  if (checkData.message === "No room found") {
                     Toast.show({
                        type: 'error',
                        text1: 'Phòng chơi không tồn tại !!!',
                        visibilityTime: 3000,
                        autoHide: true,
                     });
                  } else if (checkData.message === "Room is full") {
                     Toast.show({
                        type: 'error',
                        text1: 'Số lượng người chơi đã đầy không thể tham gia !!!',
                        visibilityTime: 3000,
                        autoHide: true,
                     });
                  } else if (checkData.message === "User already joined room") {
                     Toast.show({
                        type: 'error',
                        text1: 'Bạn đã tham gia vào phòng chơi này !!!',
                        visibilityTime: 3000,
                        autoHide: true,
                     });
                  }
               }
            }
         }
      } else {
         Alert.alert('Thông báo', 'Mã phòng không tồn tại');
      }
   };

   return (
      <RoomContext.Provider value={{
         room,
         rooms,
         createRoom,
         setRoom,
         currentRoom,
         setCurrentRoom,
         checkRoom
      }}>
         {children}
      </RoomContext.Provider>
   );
};

export const useRoomProvider = () => useContext(RoomContext);

export default RoomProvider;

import { View, Text } from 'react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { useAuthContext } from './AuthContext';
import { useRouter } from 'expo-router';
import socket from '@/utils/socket';

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



   return (
      <RoomContext.Provider value={{
         room,
         rooms,
         createRoom,
         setRoom,
         currentRoom,
         setCurrentRoom
      }}>
         {children}
      </RoomContext.Provider>
   );
};

export const useRoomProvider = () => useContext(RoomContext);

export default RoomProvider;

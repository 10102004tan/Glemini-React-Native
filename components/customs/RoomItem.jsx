import { View, Text } from 'react-native'
import React from 'react'
import { createdAtConvert } from '@/utils';
import Button from './Button';
import socket from '@/utils/socket';
import { useRouter } from 'expo-router';
import { useRoomProvider } from '@/contexts/RoomProvider';
import { useAuthContext } from '@/contexts/AuthContext';

const RoomItem = ({ room = {} }) => {
   const router = useRouter();
   const { setCurrentRoom } = useRoomProvider();
   const { userData } = useAuthContext();
   return (
      <View
         className="flex-1 rounded-xl overflow-hidden border border-gray mb-2"
      >
         <View className="flex flex-row">
            <View className="p-4">
               <Text className="font-semibold">Mã phòng: <Text className="text-blue-600 font-semibold">{room.room_code}</Text></Text>
               <Text className="text-gray text-[12px] mt-2">{createdAtConvert(room.createdAt)}</Text>
               <Text className={`text-gray text-[12px] mt-2 ${room.status === "completed" ? 'text-red-500' : 'text-green-500'}`}>{room.status === "completed" ? "Đã hoàn thành" : "Đang diễn ra"}</Text>

               <Button text='Xem chi tiết' otherStyles='p-3 mt-2 justify-center' onPress={() => {
                  setCurrentRoom(room.room_code);
                  socket.emit('joinRoom', { roomCode: room.room_code, user: userData });
                  router.push({
                     pathname: '/(teacher)/teacher_room_wait',
                     params: { roomCode: room.room_code }
                  });
               }} />
            </View>
         </View>
      </View>
   )
}

export default RoomItem

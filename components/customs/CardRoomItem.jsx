import { View, Text, Image } from 'react-native'
import React from 'react'
import Button from './Button';
import { createdAtConvert } from '@/utils';

const CardRoomItem = ({ room }) => {
   return (
      <View
         className="flex-1 rounded-xl overflow-hidden "
         style={{
            shadowColor: "#000",
            shadowOffset: {
               width: 0,
               height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
         }}
      >
         <View className="flex flex-row bg-white">
            <View className="flex items-center justify-center h-full">
               <Image
                  source={{ uri: 'https://www.jrykerscreative.com.au/wp-content/uploads/2020/09/lets-play-650x804.jpg' }}
                  className="h-full"
                  style={{ aspectRatio: 1 }}
               />
            </View>
            <View className="pt-8">
               <Text className="font-semibold">Mã phòng: <Text className="text-blue-600 font-semibold">{room.room_code}</Text></Text>
               <Text className="text-gray text-[12px] mt-2">{createdAtConvert(room.createdAt)}</Text>
               <Button text='Xem chi tiết' otherStyles='p-4 mt-2' onPress={() => {
                  setCurrentRoom(room.room_code);
                  socket.emit('joinRoom', { roomCode: room.room_code, user: userData });
                  router.push({
                     pathname: '/(app)/(teacher)/teacher_room_wait',
                     params: { roomCode: room.room_code }
                  });
               }} />
            </View>
         </View>
      </View>
   )
}

export default CardRoomItem

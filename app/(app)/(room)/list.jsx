import { View, Text, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Wrapper from '@/components/customs/Wrapper'
import { useAuthContext } from '@/contexts/AuthContext'
import Toast from 'react-native-toast-message-custom'
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config'
import { createdAtConvert } from '@/utils'
import Button from '@/components/customs/Button'
import { useRouter } from 'expo-router'
import { useRoomProvider } from '@/contexts/RoomProvider'
import socket from '@/utils/socket'

const ListRoomScreen = () => {
   const { userData } = useAuthContext();
   const [rooms, setRooms] = useState([]);
   const [isFetching, setIsFetching] = useState(false);
   const router = useRouter();
   const { currentRoom, setCurrentRoom } = useRoomProvider();

   const fetchRecentCreatedRooms = async () => {
      try {
         setIsFetching(true);
         const response = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_LIST}`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-client-id': userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({
               user_created_id: userData._id,
            }),
         });
         const data = await response.json();
         if (data.statusCode === 200) {
            setRooms(data.metadata);
         } else {
            Toast.show({
               type: 'error',
               text1: "Lỗi khi lấy danh sách phòng chơi, vui lòng thử lại sau ít phút",
               visibilityTime: 1000,
               autoHide: true,
            });
         }
      } catch (error) {
         console.log(error)
      } finally {
         setIsFetching(false);
      }
   }

   useEffect(() => {
      if (userData) {
         fetchRecentCreatedRooms();
      }
   }, [userData])

   return (
      <Wrapper >
         <View className="p-4">
            {/* <Text className="text-center text-lg font-semibold">Danh sách phòng chơi</Text> */}
            <ScrollView className="w-full h-full"
               showsVerticalScrollIndicator={false}
            >
               {rooms && rooms.length > 0 && rooms.map((item, index) => {
                  return <View key={index}
                     className="flex-1 rounded-xl overflow-hidden border border-gray mb-2"
                  >
                     <View className="flex flex-row">
                        <View className="flex items-center justify-center w-1/2 h-full">
                           <Image
                              source={{ uri: 'https://www.jrykerscreative.com.au/wp-content/uploads/2020/09/lets-play-650x804.jpg' }}
                              className="h-full"
                              style={{ aspectRatio: 1 }}
                           />
                        </View>
                        <View className="p-4">
                           <Text className="font-semibold">Mã phòng: <Text className="text-blue-600 font-semibold">{item.room_code}</Text></Text>
                           <Text className="text-gray text-[12px] mt-2">{createdAtConvert(item.createdAt)}</Text>
                           <Button text='Xem chi tiết' otherStyles='p-4 mt-2' onPress={() => {
                              setCurrentRoom(item.room_code);
                              socket.emit('joinRoom', { roomCode: item.room_code, user: userData });
                              router.push({
                                 pathname: '/(app)/(teacher)/teacher_room_wait',
                                 params: { roomCode: item.room_code }
                              });
                           }} />
                        </View>
                     </View>
                  </View>
               })}
            </ScrollView>
         </View>
      </Wrapper>
   )
}

export default ListRoomScreen

import { View, Text, ScrollView, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Wrapper from '@/components/customs/Wrapper'
import { useAuthContext } from '@/contexts/AuthContext'
import Toast from 'react-native-toast-message-custom'
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config'
import Field from '@/components/customs/Field'
import RoomItem from '@/components/customs/RoomItem'

const ListRoomScreen = () => {
   const { userData } = useAuthContext();
   const [rooms, setRooms] = useState([]);
   const [isFetching, setIsFetching] = useState(false);
   const [page, setPage] = useState(1);
   const LIMIT = 10;
   const [roomSearch, setRoomSearch] = useState('');
   const [roomCode, setRoomCode] = useState('');

   const fetchRoomSearch = async () => {
      try {
         setIsFetching(true);
         setRoomSearch([]);
         const response = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_CODE}`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-client-id': userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({
               room_code: roomCode,
            }),
         });

         const data = await response.json();
         if (data.statusCode === 200) {
            setRoomSearch([data.metadata]);
         }
      } catch (error) {
         console.log(error)
         setRoomSearch([]);
      } finally {
         setIsFetching(false)
      }
   }

   useEffect(() => {
      if (roomCode) {
         // Debounce search
         const handler = setTimeout(() => {
            fetchRoomSearch();
         }, 500);

         return () => {
            clearTimeout(handler);
         }
      }
   }, [roomCode])



   const fetchRecentCreatedRooms = async () => {
      if (isFetching) {
         return;
      }

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
               page: page,
               limit: LIMIT,
            }),
         });
         const data = await response.json();
         if (data.statusCode === 200) {
            if (data.metadata.length > 0) {
               if (page === 1) {
                  setRooms(data.metadata);
               } else {
                  setRooms([...rooms, ...data.metadata]);
               }
            }
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
         // console.log(rooms.length)
      }
   }

   useEffect(() => {
      if (userData) {
         fetchRecentCreatedRooms(1);
      }
   }, [userData])

   return (
      <Wrapper >
         <View className="p-4">
            {/* <Text className="text-center text-lg font-semibold">Danh sách phòng chơi</Text> */}
            <Field placeholder='Tìm kiếm phòng chơi' wrapperStyles='mb-4' value={roomCode} onChange={(text) => {
               setRoomCode(text);
            }} />
            {
               roomCode !== '' ? <>
                  {roomSearch.length > 0 ? <>
                     <FlatList
                        style={{ marginBottom: 60 }}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={roomSearch}
                        keyExtractor={item => item._id}
                        renderItem={({ item }) => (
                           <RoomItem key={item._id} room={item} />
                        )}
                        // columnWrapperStyle={{ justifyContent: 'space-between' }}
                        columnWrapperStyle={{
                           justifyContent: 'space-between',
                           rowGap: 4,
                           columnGap: 8
                        }}
                        numColumns={2}
                     />
                  </> : <>
                     {isFetching ? <Text className="text-center text-blue-500">Đang tìm kiếm</Text> : <Text className="text-center text-red-500">Không có phòng chơi nào</Text>}
                  </>}
               </> : <>
                  {rooms.length > 0 ? <>
                     <FlatList
                        onEndReached={() => {
                           setPage(page + 1);
                           fetchRecentCreatedRooms();
                        }}
                        style={{ marginBottom: 60 }}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={rooms}
                        keyExtractor={item => item._id}
                        renderItem={({ item }) => (
                           <RoomItem key={item._id} room={item} />
                        )}
                        // columnWrapperStyle={{ justifyContent: 'space-between' }}
                        columnWrapperStyle={{
                           justifyContent: 'space-between',
                           rowGap: 4,
                           columnGap: 8
                        }}
                        numColumns={2}
                     />
                  </> : <>
                     <Text className="text-center text-red-500">Không có phòng chơi nào</Text>
                  </>}
               </>
            }
         </View>
      </Wrapper >
   )
}

export default ListRoomScreen

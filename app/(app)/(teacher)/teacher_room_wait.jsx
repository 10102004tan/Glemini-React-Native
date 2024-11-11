import { View, Text, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Wrapper from '@/components/customs/Wrapper'
import Field from '@/components/customs/Field'
import Button from '@/components/customs/Button'
import Feather from '@expo/vector-icons/Feather';
import UserJoinedRoomItem from '@/components/customs/UserJoinedRoomItem'
import socket from '@/utils/socket'
import { useGlobalSearchParams, router } from 'expo-router'
import { useAuthContext } from '@/contexts/AuthContext'
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config'
import * as Clipboard from 'expo-clipboard';
import { AppState } from 'react-native';
import { BackHandler } from 'react-native';
const TeacherRoomWaitScreen = () => {
   const [joinedUsers, setJoinedUsers] = useState([]);
   const [messages, setMessages] = useState([]);
   const [roomData, setRoomData] = useState(null);
   const { userData } = useAuthContext();
   const { roomCode } = useGlobalSearchParams();


   useEffect(() => {
      // Lắng nghe sự kiện khi user join room
      socket.on('userJoined', (data) => {
         setJoinedUsers((prev) => [...prev, data.user]);
         console.log(`User ${data.user.user_fullname} joined room`);
      });

      // Lắng nghe danh sách user cập nhật
      socket.on('updateUserList', (users) => {
         // console.log(users)
         setJoinedUsers(users);
      });

      // Lắng nghe khi người dùng rời phòng
      socket.on('userLeft', (data) => {
         setJoinedUsers((prev) => prev.filter((user) => user._id !== data.user._id));
         console.log(data.message);
      })

      // Hủy lắng nghe khi component bị hủy
      return () => {
         socket.off('userJoined');
         socket.off('userLeft');
         socket.off('updateUserList');
      };
   }, []);

   useEffect(() => {
      const getRoomData = async () => {
         const response = await fetch(
            `${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_DETAIL}`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'x-client-id': userData._id,
                  authorization: userData.accessToken,
               },
               body: JSON.stringify({
                  room_code: roomCode,
               }),
            }
         )
         const data = await response.json();
         // console.log(data)
         if (data.statusCode === 200) {
            setRoomData(data.metadata);
         }
      }
      getRoomData();
   }, [])

   // Lắng nghe khi người dùng thoát ra khỏi ứng dụng
   useEffect(() => {
      const handleAppStateChange = (nextAppState) => {
         if (nextAppState === 'background' || nextAppState === 'inactive') {
            // Gửi sự kiện thoát phòng đến server
            console.log('User has left the app');
            // Thêm logic xử lý thoát phòng tại đây
         }
      };

      const subscription = AppState.addEventListener('change', handleAppStateChange);

      return () => {
         subscription.remove();
      };
   }, []);

   // Lắng nghe sự kiện khi người dùng muốn thoát ra
   useEffect(() => {
      const backAction = () => {
         Alert.alert('Cảnh báo', 'Bạn có chắc chắn muốn thoát khỏi phòng chơi không?', [
            { text: 'Hủy', onPress: () => null, style: 'cancel' },
            { text: 'Thoát', onPress: () => BackHandler.exitApp() },
         ]);
         return true; // Chặn hành động mặc định
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
         backHandler.remove();
      };
   }, []);

   // Lắng nghe sự kiện khi bắt đầu phòng chơi
   useEffect(() => {
      socket.on('startQuiz', () => {
         // Lưu tất cả người dùng đã tham gia vào phòng chơi lên server

         if (roomData && userData) {
            // Nếu là sinh viên thì sẽ chuyển hướng tới màn hình làm bài
            router.push(
               {
                  pathname: '/(play)/realtime',
                  params: { roomCode, quizId: roomData.quiz_id, roomId: roomData._id, roomCode: roomData.room_code, createdUserId: roomData.user_created_id }
               }
            );
         }
      });

      return () => {
         socket.off('startQuiz');
      }
   }, [userData, roomData]);


   const handleCopyRoomCode = async () => {
      try {
         await Clipboard.setStringAsync(roomData.room_code);
         Alert.alert("Success", "Room code copied to clipboard!");
      } catch (error) {
         console.error("Failed to copy room code:", error);
         Alert.alert("Error", "Failed to copy room code.");
      }
   };

   const handleStartRoom = async () => {
      // Cập nhật laị trạng thái của phòng chơi
      const response = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_UPDATE_STATUS}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'x-client-id': userData._id,
            authorization: userData.accessToken,
         },

         body: JSON.stringify({
            room_code: roomCode,
            status: 'doing',
         }),
      });

      const data = await response.json();
      if (data.statusCode === 200) {
         // Gửi một event lên server để bắt đầu phòng học

         socket.emit('startRoom', { roomCode: roomCode });
         router.replace({
            pathname: '/(teacher)/teacher_room_wait_result',
            params: { roomCode: roomCode, users: JSON.stringify(joinedUsers), quizId: roomData.quiz_id, roomTime: roomData.room_time }
         })
      }

      else {
         Alert.alert('Thông báo', 'Không thể bắt đầu phòng chơi');
      }
   }

   const handleReOpenRoom = async () => {
      // Cập nhật laị trạng thái của phòng chơi
      const response = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_UPDATE_STATUS}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'x-client-id': userData._id,
            authorization: userData.accessToken,
         },

         body: JSON.stringify({
            room_code: roomCode,
            status: 'start',
         }),
      });

      const data = await response.json();
      if (data.statusCode === 200) {
         // Gửi một event lên server để bắt đầu phòng học
         console.log(roomData)
         setRoomData(data.metadata);
      }
      else {
         Alert.alert('Thông báo', 'Không thể mở phòng chơi');
      }
   }

   return (
      <Wrapper>
         <View className="flex-1 p-4 bg-primary pt-[60px]">
            <View className="flex flex-row items-center justify-end w-full">
               <Button text='Thoát' otherStyles='p-3 bg-red-500 justify-center w-fit' onPress={() => {
                  Alert.alert('Thông báo', 'Bạn có chắc chắn muốn thoát phòng?', [
                     {
                        text: 'Hủy',
                        onPress: () => { }
                     },
                     {
                        text: 'Thoát',
                        onPress: () => {
                           socket.emit('leaveRoom', { roomCode: roomCode, user: userData });
                           router.replace({
                              pathname: '/(app)/(home)',
                              params: {}
                           })
                        }
                     }
                  ])
               }} />
            </View>
            <View className="my-4">
               {roomData && roomData.status === 'completed' && <Text className="text-white bg-red-400 text-center p-4 rounded-2xl">Phòng chơi đã kết thúc trước đó bạn có muốn mở lại không ?</Text>}
               {roomData && roomData.status === 'doing' && <Text className="text-white bg-red-400 text-center p-4 rounded-2xl">Phòng hiện đang mở hãy chuyển tới màn hình theo dõi kết quả</Text>}
            </View>
            <ScrollView className="">
               {/* Copy Room Code */}
               <View className="p-4 rounded-2xl bg-[#0C0C0C] w-full">
                  <View className="w-full h-[200px] bg-[rgba(117, 117, 117, 0.3)] flex items-center justify-center p-4 rounded-2xl">
                     <View className="w-full rounded-xl  bg-white">
                        <Field placeholder={`Mã phòng: ${roomData && roomData.room_code}`} />
                     </View>
                     <Button text='Sao chép' onPress={handleCopyRoomCode} otherStyles='p-3 mt-4 w-full flex items-center justify-center bg-[#A1732A]' textStyles='' icon={<Feather name="copy" size={20} color="white" />} />
                     {userData && roomData && userData._id === roomData.user_created_id && roomData.status === 'completed' && <Button text='Mở lại' onPress={() => {
                        handleReOpenRoom();
                     }} otherStyles='p-3 mt-4 w-full flex items-center justify-center bg-[#A1732A]' textStyles='' />}

                     {userData && roomData && userData._id === roomData.user_created_id && roomData.status === 'doing' && <Button text='Chuyển tới màn hình theo dõi' onPress={() => {
                        router.replace({
                           pathname: '/(teacher)/teacher_room_wait_result',
                           params: { roomCode: roomCode, users: JSON.stringify(joinedUsers), quizId: roomData.quiz_id }
                        })
                     }} otherStyles='p-3 mt-4 w-full flex items-center justify-center bg-[#A1732A]' textStyles='' />}

                     {userData && roomData && userData._id === roomData.user_created_id && roomData.status === 'start' && <Button text='Bắt đầu' onPress={() => {
                        handleStartRoom();
                     }} otherStyles='p-3 mt-4 w-full flex items-center justify-center bg-[#A1732A]' textStyles='' />}
                  </View>
               </View>
               <View className="mt-4 p-4 rounded-2xl bg-[#0C0C0C] w-full">
                  <Text className="text-white text-center">Chờ học sinh tham gia</Text>
               </View>
               <View className="mt-4 p-4 w-full">
                  {/* Student Items */}
                  {roomData && joinedUsers.length > 0 && joinedUsers.map((user) => {
                     if (user._id !== roomData.user_created_id) {
                        return <UserJoinedRoomItem
                           key={user._id}
                           user={{
                              user_fullname: user.user_fullname,
                              user_avatar: user.user_avatar,
                           }} />
                     }
                  })}



                  {/* <Text className="text-white">Messages</Text>
                  {messages.map((msg, index) => (
                     <Text className="text-white" key={index}>{msg}</Text>
                  ))} */}

                  {/* <Text className="text-white">Users in Room</Text>
                  {joinedUsers.map((user) => (
                     <Text className="text-white" key={user._id}>{user.user_fullname}</Text>
                  ))} */}
               </View>
            </ScrollView>
         </View>
      </Wrapper>
   )
}

export default TeacherRoomWaitScreen

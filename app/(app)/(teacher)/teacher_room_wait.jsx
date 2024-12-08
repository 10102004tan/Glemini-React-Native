import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Wrapper from '@/components/customs/Wrapper'
import Field from '@/components/customs/Field'
import Button from '@/components/customs/Button'
import Feather from '@expo/vector-icons/Feather';
import UserJoinedRoomItem from '@/components/customs/UserJoinedRoomItem'
import socket from '@/utils/socket'
import { useGlobalSearchParams, useRouter } from 'expo-router'
import { useAuthContext } from '@/contexts/AuthContext'
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config'
import * as Clipboard from 'expo-clipboard';
import { AppState } from 'react-native';
import { BackHandler } from 'react-native';
import { useIsFocused } from '@react-navigation/native'
import QRGenerator from '@/components/customs/QRGenerator'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Toast from 'react-native-toast-message-custom'
import Lottie from '@/components/loadings/Lottie';
import BottomSheet from '@/components/customs/BottomSheet'
import { useClassroomProvider } from '@/contexts/ClassroomProvider'
import Overlay from '@/components/customs/Overlay'
import DropDownMultipleSelect from '@/components/customs/DropDownMultipleSelect'
import { SelectList } from 'react-native-dropdown-select-list'
import { useAppProvider } from '@/contexts/AppProvider'

const TeacherRoomWaitScreen = () => {
   const router = useRouter();
   const [joinedUsers, setJoinedUsers] = useState([]);
   const [messages, setMessages] = useState([]);
   const [roomData, setRoomData] = useState(null);
   const { userData } = useAuthContext();
   const { roomCode } = useGlobalSearchParams();
   const [totalJoindUsers, setTotalJoindUsers] = useState(0);
   const [testLoading, setTestLoading] = useState(true);
   const { classrooms } = useClassroomProvider();
   const [showClassroom, setShowClassroom] = useState(false);
   const [selectedClass, setSelectedClass] = useState(null);
   const { i18n } = useAppProvider();


   useEffect(() => {
      // Lắng nghe sự kiện khi user join room
      socket.on('userJoined', (data) => {
         setJoinedUsers((prev) => [...prev, data.user]);
         console.log(`User ${data.user.user_fullname} joined room`);
         setTotalJoindUsers((prev) => prev + 1);
         Toast.show({
            type: 'info',
            text1: i18n.t('room_wait.userJoined').replace('{name}', data.user.user_fullname),
            visibilityTime: 3000,
            autoHide: true,
         });
      });

      // Lắng nghe danh sách user cập nhật
      socket.on('updateUserList', (users) => {
         // console.log(users)
         setJoinedUsers(users);
         setTotalJoindUsers(users.length);
      });

      // Lắng nghe khi người dùng rời phòng
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

   const isFocused = useIsFocused();

   useEffect(() => {
      if (!isFocused) return; // Chỉ lắng nghe khi màn hình được hiển thị

      const backAction = async () => {
         Alert.alert(i18n.t('room_wait.alert'), i18n.t('room_wait.exitRoomConfirmation'), [
            { text: i18n.t('room_wait.cancel'), onPress: () => null, style: 'cancel' },
            {
               text: i18n.t('room_wait.leave'), onPress: async () => {
                  const exitRoom = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_REMOVE_USER}`, {
                     method: 'POST',
                     headers: {
                        'Content-Type': 'application/json',
                        'x-client-id': userData._id,
                        authorization: userData.accessToken,
                     },
                     body: JSON.stringify({
                        room_code: roomCode,
                        user_id: userData._id,
                     }),
                  });

                  const data = await exitRoom.json();
                  if (data.statusCode === 200) {
                     socket.emit('leaveRoom', { roomCode: roomCode, user: userData });
                     router.replace({
                        pathname: '/(app)/(home)',
                        params: {}
                     })
                  } else {
                     Toast.show({
                        type: 'info',
                        text1: i18n.t('room_wait.errorLeaveRoom'),
                        visibilityTime: 3000,
                        autoHide: true,
                     });
                  }
               }
            },
         ]);
         return true; // Chặn hành động mặc định
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
         backHandler.remove();
      };
   }, [isFocused]);

   // Lắng nghe sự kiện khi bắt đầu phòng chơi
   useEffect(() => {
      socket.on('startQuiz', () => {
         if (roomData && userData) {
            // Nếu là sinh viên thì sẽ chuyển hướng tới màn hình làm bài
            router.replace(
               {
                  pathname: '/(play)/realtime',
                  params: { quizId: roomData.quiz_id, roomId: roomData._id, roomCode: roomData.room_code, createdUserId: roomData.user_created_id }
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
      // Kiểm tra xem phòng chơi có đủ người chưa
      if ((joinedUsers.length - 1) < 1) {
         Toast.show({
            type: 'info',
            text1: i18n.t('room_wait.roomNotEnoughPlayers'),
            visibilityTime: 3000,
            autoHide: true,
         });
         return;
      }

      const joinedUsersId = joinedUsers.map((user) => user._id);

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
            joined_users: joinedUsersId,
         }),
      });

      const data = await response.json();
      // console.log(data)
      if (data.statusCode === 200) {
         // Gửi một event lên server để bắt đầu phòng học

         socket.emit('startRoom', { roomCode: roomCode });
         router.replace({
            pathname: '/(teacher)/teacher_room_wait_result',
            params: { roomCode: roomCode, users: JSON.stringify(joinedUsers), quizId: roomData.quiz_id, roomTime: roomData.room_time, createdAt: roomData.createdAt }
         })
      }
      else {
         Toast.show({
            type: 'info',
            text1: i18n.t('room_wait.cannotStartRoom'),
            visibilityTime: 3000,
            autoHide: true,
         });
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
         Toast.show({
            type: 'info',
            text1: i18n.t('room_wait.cannotStartRoom'),
            visibilityTime: 3000,
            autoHide: true,
         });
      }
   }

   // Hàm xử lý thông báo tới sinh viên khi giáo viên share phòng vào lớp
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
         const res = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.NOTIFY_SHARE_ROOM}`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-client-id': userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({
               classroomId,
               roomCode
            }),
         });

         const data = await res.json();
         console.log(data)
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
   }

   if (!roomData) {
      return (
         <Wrapper>
            <View className="flex items-center justify-center w-full h-full">
               <Lottie
                  source={require('@/assets/jsons/fly-loading.json')}
                  width={300}
                  height={300}
               />
            </View>
         </Wrapper>
      )
   }

   return (
      <Wrapper>

         {/* Bottom sheet */}
         <Overlay visible={showClassroom} onPress={() => {
            setShowClassroom(false);
         }} />
         <BottomSheet visible={showClassroom} onClose={() => {
            setShowClassroom(false);
         }}>
            {/* Hiển thị danh sách lớp học */}
            <View className="bg-white p-4 rounded-2xl">
               <Text className="text-xl font-semibold mb-4">{i18n.t('room_wait.listJoined')}</Text>
               <ScrollView
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
               >
                  {classrooms.length > 0 && classrooms.map((cls) => (
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

                  <Button text='Chia sẻ' onPress={() => { handleNotification(selectedClass, roomCode) }} otherStyles='p-3 mt-4 w-full flex items-center justify-center bg-[#A1732A]' textStyles='' />
               </ScrollView>
            </View>
         </BottomSheet>

         <View className="flex-1 p-4 bg-primary pt-[60px]">
            <View className="flex flex-row items-center justify-end w-full">
               <Button text={i18n.t('room_wait.leave')} otherStyles='p-3 bg-red-500 justify-center w-fit' onPress={() => {
                  Alert.alert(i18n.t('room_wait.alert'), i18n.t('room_wait.exitRoomConfirmation'), [
                     {
                        text: i18n.t('room_wait.cancel'),
                        onPress: () => { }
                     },
                     {
                        text: i18n.t('room_wait.leave'),
                        onPress: async () => {
                           const exitRoom = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_REMOVE_USER}`, {
                              method: 'POST',
                              headers: {
                                 'Content-Type': 'application/json',
                                 'x-client-id': userData._id,
                                 authorization: userData.accessToken,
                              },
                              body: JSON.stringify({
                                 room_code: roomCode,
                                 user_id: userData._id,
                              }),
                           });

                           const data = await exitRoom.json();
                           // console.log(data)
                           if (data.statusCode === 200) {
                              socket.emit('leaveRoom', { roomCode: roomCode, user: userData });
                              router.replace({
                                 pathname: '/(app)/(home)',
                                 params: {}
                              })
                           } else {
                              Toast.show({
                                 type: 'info',
                                 text1: i18n.t('room_wait.errorLeaveRoom'),
                                 visibilityTime: 3000,
                                 autoHide: true,
                              });
                           }
                        }
                     }
                  ])
               }} />
            </View>
            <View className="my-4">
               {roomData && roomData.status === 'completed' && <Text className="text-white bg-red-500 text-center p-4 rounded-2xl">{i18n.t('room_wait.roomAlreadyCompleted')}</Text>}
               {roomData && roomData.status === 'doing' && <Text className="text-white bg-red-500 text-center p-4 rounded-2xl">{i18n.t('room_wait.roomInProgress')}</Text>}
            </View>
            <ScrollView className=""
               showsHorizontalScrollIndicator={false}
               showsVerticalScrollIndicator={false}
            >
               {/* Copy Room Code */}
               <View className="p-4 rounded-2xl bg-[#2f3542] w-full">
                  <View className="w-full h-[200px] bg-[rgba(117, 117, 117, 0.3)] flex items-center justify-center p-4 rounded-2xl">

                     <View className="w-full rounded-xl  bg-white">
                        <Field placeholder={`${i18n.t('room_item.roomCode')}: ${roomData && roomData.room_code}`} disabled={true} />
                     </View>
                     <Button text={i18n.t('room_wait.copy')} onPress={handleCopyRoomCode} otherStyles='p-3 mt-4 w-full flex items-center justify-center bg-[#A1732A]' textStyles='' icon={<Feather name="copy" size={20} color="white" />} />
                     {userData && roomData && userData._id === roomData.user_created_id && roomData.status === 'completed' && <Button text={i18n.t('room_wait.openAgain')} onPress={() => {
                        handleReOpenRoom();
                     }} otherStyles='p-3 mt-4 w-full flex items-center justify-center bg-[#A1732A]' textStyles='' />}

                     {userData && roomData && userData._id === roomData.user_created_id && roomData.status === 'doing' && <Button text={i18n.t('room_wait.followResult')} onPress={() => {
                        router.replace({
                           pathname: '/(teacher)/teacher_room_wait_result',
                           params: { roomCode: roomCode, users: JSON.stringify(joinedUsers), quizId: roomData.quiz_id, createdAt: roomData.createdAt }
                        })
                     }} otherStyles='p-3 mt-4 w-full flex items-center justify-center bg-[#A1732A]' textStyles='' />}

                     {userData && roomData && userData._id === roomData.user_created_id && roomData.status === 'start' && <Button text={i18n.t('room_wait.start')} onPress={() => {
                        handleStartRoom();
                     }} otherStyles='p-3 mt-4 w-full flex items-center justify-center bg-[#A1732A]' textStyles='' />}
                  </View>
               </View>
               {userData && roomData && userData._id === roomData.user_created_id && <View className="mt-4 bg-[#2f3542] p-8 flex items-center justify-center rounded-2xl">
                  <Text className="text-blue-500 text-center">{i18n.t('room_wait.shareQr')}</Text>
                  <QRGenerator value={roomCode} handleShareRoom={() => {
                     setShowClassroom(true)
                  }} />
               </View>}
               <View className="mt-4 p-4 rounded-2xl bg-[#2f3542] w-full">
                  <Text className="text-white text-center">{i18n.t('room_wait.totalJoined')} ({totalJoindUsers > 0 ? totalJoindUsers - 1 : totalJoindUsers})</Text>
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
               </View>
            </ScrollView>
         </View>
      </Wrapper>
   )
}

export default TeacherRoomWaitScreen

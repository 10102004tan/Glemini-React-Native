
import { Images } from "@/constants";
import { useAuthContext } from "@/contexts/AuthContext";
import { useResultProvider } from "@/contexts/ResultProvider";
import { useFocusEffect, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Dimensions, FlatList, Image, Alert } from "react-native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Button from "@/components/customs/Button";
import Field from "@/components/customs/Field";
import { API_URL, API_VERSION, END_POINTS } from "@/configs/api.config";
import { useRoomProvider } from "@/contexts/RoomProvider";
import socket from "@/utils/socket";
import { Pressable } from "react-native";
import moment from "moment";
import Toast from "react-native-toast-message-custom";
import Lottie from "@/components/loadings/Lottie";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / 2 - 16;

export default function ActivityScreen() {
   const { results, fetchResultsForStudent } = useResultProvider();
   const [roomCode, setRoomCode] = useState(null);
   const [roomTemp, setRoomTemp] = useState(null);
   const { userData } = useAuthContext();
   const { setCurrentRoom } = useRoomProvider();
   const router = useRouter();

   useFocusEffect(
      useCallback(() => {
         fetchResultsForStudent();
      }, [])
   );

   useEffect(() => {
      const checkRoom = async () => {
         const res = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_DETAIL}`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-client-id': userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({
               room_code: roomTemp,
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
                     room_code: roomTemp,
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
                  Alert.alert('Thông báo', 'Bạn đã hoàn thành phòng chơi này !!!');
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
                  setCurrentRoom(data.metadata._id);
                  socket.emit('joinRoom', { roomCode, user: userData });
                  router.replace({
                     pathname: '/(app)/(teacher)/teacher_room_wait',
                     params: { roomCode: roomTemp }
                  });
               }
            }
            setRoomTemp(null);
         } else {
            Alert.alert('Thông báo', 'Mã phòng không tồn tại');
         }
      }

      if (roomTemp) {
         checkRoom()
      }
   }, [roomTemp])

   const [index, setIndex] = useState(0);
   const [routes] = useState([
      { key: 'doing', title: 'Đang thực hiện' },
      { key: 'completed', title: 'Đã hoàn thành' },
   ]);

   return (
      <View className="flex-1 mb-20 bg-slate-50">
         <View className="p-4">
            <Field placeholder="Mã phòng" wrapperStyles="mb-3" value={roomCode} onChange={(text) => {
               setRoomCode(text);
            }} />

            <Button text='JOIN' otherStyles='p-4' onPress={() => {
               setRoomTemp(roomCode);
            }} />
         </View>

         <TabView
            navigationState={{ index, routes }}
            renderScene={SceneMap({
               doing: () => <DoingResults results={results.doing} />,
               completed: () => <CompletedResults results={results.completed} />,
            })}
            onIndexChange={setIndex}
            initialLayout={{ width: Dimensions.get('window').width }}
            renderTabBar={(props) => (
               <TabBar
                  {...props}
                  className='bg-[#813b3b] text-white'
                  indicatorStyle={{ backgroundColor: 'white' }}
               />
            )}
         />
      </View>
   );
}

const ResultCompletedItem = ({ result }) => {
   const correctCount = result.result_questions.filter(q => q.correct).length;
   const totalQuestions = result.result_questions?.length || 0;
   const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
   return (
      <View style={{ width: itemWidth }} className="m-2 bg-slate-200/50 rounded-lg border-slate-200 border-b-[6px] overflow-hidden">
         <Image
            source={result.quiz_id?.quiz_thumb ? { uri: result.quiz_id?.quiz_thumb } : Images.banner1}
            className="w-full h-28"
            style={{ resizeMode: 'cover' }}
         />
         <View className='bg-black/50 px-1 rounded-lg absolute top-2 left-2 flex-row items-center'>
            <FontAwesome6 name="chalkboard-user" color='white' />
            <Text className="text-sm text-slate-50 ml-1">{result.exercise_id?._id ? 'Được giao' : result.room_id ? 'Phòng' : 'Công khai'}</Text>
         </View>
         <View className='bg-slate-400/80 px-1 rounded-md absolute top-20 right-2 flex-row items-center'>
            <Text className="text-sm text-slate-50 ml-1">{result?.quiz_id?.questionCount} Qs</Text>
         </View>
         <View className='absolute top-2 right-2'>
            {totalQuestions < result.quiz_id?.questionCount ? <MaterialCommunityIcons name="clock-alert" size={25} color="red" /> : ''}
         </View>
         <View className='px-4 py-2'>
            <Text className="text-sm font-pmedium">
               {(result.exercise_id?.name.length > 20 ? result.exercise_id?.name.substring(0, 20) + "..." : result.exercise_id?.name) || result.room_id?.room_code}
            </Text>
            <Text className="text-sm font-light">
               {(result.quiz_id?.quiz_name.length > 20 ? result.quiz_id?.quiz_name.substring(0, 20) + "..." : result.quiz_id?.quiz_name)}
            </Text>
            <Text className="text-xs font-light">
               bởi: {result.quiz_id?.user_id?.user_fullname}
            </Text>

            <Text className={`${accuracy < 40 ? 'bg-red-600' : accuracy < 70 ? 'bg-yellow-400' : 'bg-green-500'} text-sm mt-4 font-light text-slate-50 rounded-full px-2`}>
               {accuracy.toFixed(0)}% độ chính xác
            </Text>
         </View>
      </View>
   );
};

const CompletedResults = ({ results }) => {
   const router = useRouter();

   if (!results || results.length === 0) {
      return <Lottie
         source={require('@/assets/jsons/empty.json')}
         width={150}
         height={150}
         text={'Danh sách trống'}
      />
   }
   return (
      <FlatList
         showsVerticalScrollIndicator={false}
         data={results}
         renderItem={({ item }) => (
            <Pressable onPress={() => {
               router.push({
                  pathname: '(report)/overview_report',
                  params: { resultId: item._id },
               });
            }}>
               <ResultCompletedItem result={item} />
            </Pressable>
         )}
         keyExtractor={item => item._id}
         numColumns={2}
         columnWrapperStyle="flex-row justify-between"
      />
   );
};

const ResultDoingItem = ({ result }) => {
   return <View style={{ width: itemWidth }} className="m-2 bg-slate-200/70 rounded-lg border-slate-200 border-b-[6px] overflow-hidden">
      <Image
         source={result.quiz_id?.quiz_thumb ? { uri: result.quiz_id?.quiz_thumb } : Images.banner1}
         className="w-full h-28"
         style={{ resizeMode: 'cover' }}
      />

      <View className='bg-black/50 px-1 rounded-lg absolute top-2 left-2 flex-row items-center'>
         <FontAwesome6 name="chalkboard-user" color='white' />
         <Text className="text-sm text-slate-50 ml-1">{result.exercise_id?._id ? 'Được giao' : result.room_id ? 'Phòng' : 'Công khai'}</Text>
      </View>
      <View className='bg-slate-400/80 px-1 rounded-md absolute top-20 right-2 flex-row items-center'>
         <Text className="text-sm text-slate-50 ml-1">{result.quiz_id?.questionCount} Qs</Text>
      </View>
      <View className='px-4 py-2'>
         <Text className="text-base font-pmedium">
            {(result.exercise_id?.name.length > 20 ? result.exercise_id?.name.substring(0, 20) + "..." : result.exercise_id?.name) || result.room_id?.room_code}
         </Text>
         <Text className="text-base font-light">
            {(result.quiz_id?.quiz_name.length > 20 ? result.quiz_id?.quiz_name.substring(0, 20) + "..." : result.quiz_id?.quiz_name)}
         </Text>
         <Text className="text-xs font-light">
            hạn: {moment(result.exercise_id?.date_end).format('DD/MM/YYYY')}
         </Text>

         <Text className="text-sm mt-4 font-light text-center text-slate-50 bg-violet-300 rounded-full px-2">
            {result.result_questions?.length}/{result.quiz_id?.questionCount} câu hỏi
         </Text>
      </View>
   </View>
}

const DoingResults = ({ results }) => {
   const { userData } = useAuthContext();
   const router = useRouter();
   const { completed } = useResultProvider()
   if (!results || results.length === 0) {
      return <Lottie
         source={require('@/assets/jsons/empty.json')}
         width={150}
         height={150}
         text={'Danh sách trống'}
      />
   }

   return (
      <FlatList
         showsVerticalScrollIndicator={false}
         data={results}
         renderItem={({ item }) => (
            <Pressable onPress={() => {
               Alert.alert(
                  "Tiếp tục thực hiện?",
                  "Bạn có muốn tiếp tục bài kiểm tra này?",
                  [
                     { text: "Hủy", style: "cancel" },
                     {
                        text: "Tiếp tục", onPress: async () => {

                           if (item.type === 'publish') {
                              router.push({
                                 pathname: '(play)/single',
                                 params: { quizId: item.quiz_id?._id, type: item.type }
                              })
                           } else if (item.type === 'exercise') {
                              const now = moment();
                              const deadline = moment(item.exercise_id?.date_end);
                              if (now.isBefore(deadline)) {
                                 router.push({
                                    pathname: '(play)/single',
                                    params: { quizId: item.quiz_id?._id, exerciseId: item.exercise_id?._id, type: item.type }
                                 })
                              } else {
                                 Toast.show({
                                    type: 'info',
                                    text1: 'Đã quá hạn làm bài!',
                                    visibilityTime: 2000
                                 })

                                 const completedResult = await completed(item.exercise_id?._id, item.quiz_id?._id);
                                 router.push({
                                    pathname: '(report)/overview_report',
                                    params: { resultId: completedResult._id },
                                 });
                              }
                           } else if (item.type === 'room') {
                              socket.emit('joinRoom', { roomCode: item.room_id.room_code, user: userData });
                              router.push({
                                 pathname: '(play)/realtime',
                                 params: { roomCode: item.room_id.room_code, quizId: item.quiz_id._id, roomId: item.room_id._id, createdUserId: item.room_id.user_created_id }
                              })

                           }
                        }
                     },
                  ]
               );
            }}>
               <ResultDoingItem result={item} />
            </Pressable>
         )}
         keyExtractor={item => item._id}
         numColumns={2}
         columnWrapperStyle="flex-row justify-between"
      />
   );
};

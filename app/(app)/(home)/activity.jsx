import { Images } from "@/constants";
import { useAuthContext } from "@/contexts/AuthContext";
import { useResultProvider } from "@/contexts/ResultProvider";
import { Link, useFocusEffect, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {View, Text, Dimensions, FlatList, Image, Alert, ScrollView, RefreshControl} from "react-native";
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
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCameraPermissions } from "expo-camera";
import { useAppProvider } from "@/contexts/AppProvider";
const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / 2 - 16;
import SkeletonList from "@/components/loadings/SkeletonListActivity";

export default function ActivityScreen() {
   const { i18n } = useAppProvider()
   const { results, fetchResultsForStudent, fetchResetResultOfQuiz } = useResultProvider();
   const [roomCode, setRoomCode] = useState(null);
   const [roomTemp, setRoomTemp] = useState(null);
   const { userData } = useAuthContext();
   const { setCurrentRoom } = useRoomProvider();
   const [permission, requestPermission] = useCameraPermissions();
   const isPermissionGranted = Boolean(permission?.granted);
   const router = useRouter();
   const [index, setIndex] = useState(0);
   const [refreshing, setRefreshing] = useState(false);
   const [isFirstLoad, setIsFirstLoad] = useState(null);
   const [routes] = useState([
      { key: 'doing', title: i18n.t("activity.textDoing") },
      { key: 'completed', title: i18n.t("activity.textCompleted") },
   ]);

   useEffect(() => {
      if (!isPermissionGranted) {
         requestPermission();
      }
      const loadData = async () => {
         setRefreshing(true)
         try {
            await fetchResultsForStudent();
         } catch (error) {
            console.error('Error fetching classroom:', error);
         } finally {
            setRefreshing(false)
         }
      }
      loadData()
   }, [])


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
                        params: { roomCode: roomTemp }
                     });
                  } else {
                     if (checkData.message === "No room found") {
                        Alert.alert('Thông báo', 'Phòng chơi không tồn tại !!!');
                     } else if (checkData.message === "Room is full") {
                        Alert.alert('Thông báo', 'Số lượng người chơi đã đầy không thể tham gia !!!');
                     } else if (checkData.message === "User already joined room") {
                        Alert.alert('Thông báo', 'Bạn đã tham gia vào phòng chơi này !!!');
                     }
                  }
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

   const fetchResults = async () => {
      try {
         setRefreshing(true);
         await fetchResultsForStudent();
      } catch (error) {
         setRefreshing(false);
      } finally {
         setRefreshing(false);
      }
   };

   return (
      <View className="flex-1 bg-white pb-20">
         <View className="p-4">
            <Field placeholder={i18n.t('activity.textRoomCODE')} wrapperStyles="mb-3" value={roomCode} onChange={(text) => {
               setRoomCode(text);
            }} />

            <Button text={i18n.t('activity.btnJoin')} otherStyles='p-4 justify-center' onPress={() => {
               setRoomTemp(roomCode);
            }} />

            {
               isPermissionGranted && <Button text={i18n.t('activity.btnScan')}
                  otherStyles="p-4 mt-3 justify-center"
                  icon={<Ionicons name="qr-code-outline" size={20} color="white" />}
                  onPress={() => {
                     router.push({
                        pathname: '/(app)/(room)/scanner',
                        params: { type: 'join' }
                     })
                  }}
               />
            }

         </View>

         <TabView
            navigationState={{ index, routes }}
            renderScene={SceneMap({
               doing: () => <DoingResults results={results.doing} onRefresh={fetchResults} i18n={i18n}
                  refreshing={refreshing} />,
               completed: () => <CompletedResults results={results.completed} onRefresh={fetchResults} i18n={i18n} fetchResetResultOfQuiz={fetchResetResultOfQuiz}
                  refreshing={refreshing} />,
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

const ResultCompletedItem = ({ result, i18n }) => {
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
            <Text className="text-sm text-slate-50 ml-1">{result.exercise_id?._id ? i18n.t('activity.exercise') : result.room_id ? i18n.t('activity.room') : i18n.t('activity.publish')}</Text>
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
               {i18n.t('activity.textCreated')} {result.quiz_id?.user_id?.user_fullname}
            </Text>

            <Text className={`${accuracy < 40 ? 'bg-red-600' : accuracy < 70 ? 'bg-yellow-400' : 'bg-green-500'} text-sm mt-4 font-light text-slate-50 rounded-full px-2`}>
               {accuracy.toFixed(0)}% độ chính xác
            </Text>
         </View>
      </View>
   );
};

const CompletedResults = ({ results, refreshing, onRefresh, i18n, fetchResetResultOfQuiz }) => {
   const router = useRouter();

   if (refreshing || !results) {
      return <SkeletonList count={6} />;
   }

   if (results.length === 0) {
      return(
      <ScrollView
          refreshControl={
             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
      >
         <View className={"h-[400px]"}>
            <Lottie
                source={require('@/assets/jsons/empty.json')}
                width={150}
                height={150}
                text={i18n.t('activity.emptyActivity')}
            />
         </View>
      </ScrollView>
      )
   }
   return (
      <FlatList
         showsVerticalScrollIndicator={false}
         data={results}
         renderItem={({ item }) => (
            <Pressable onPress={() => {
               if (item.type === 'publish' && !item.room_id && !item.exercise_id) {
                  Alert.alert(
                     i18n.t('activity.titleQuestionReplayQUiz'),
                     i18n.t('activity.textQuestionReplayQuiz'),
                     [
                        { text: i18n.t('activity.btnCancel'), style: "cancel" },
                        {
                           text: i18n.t('activity.btnReadResult'), onPress: async () => {
                              router.push({
                                 pathname: '(report)/overview_report',
                                 params: { resultId: item._id },
                              });
                           }
                        },
                        {
                           text: i18n.t('activity.btnContinute'), onPress: async () => {
                              await fetchResetResultOfQuiz(item._id)
                              router.push({
                                 pathname: '(play)/single',
                                 params: { quizId: item.quiz_id._id, type: 'publish' }
                              });
                           }
                        },
                     ]
                  );
               } else {
                  router.push({
                     pathname: '(report)/overview_report',
                     params: { resultId: item._id },
                  });
               }
            }}>
               <ResultCompletedItem result={item} i18n={i18n} />
            </Pressable>
         )}
         keyExtractor={item => item._id}
         numColumns={2}
         columnWrapperStyle="flex-row justify-between"
         refreshing={refreshing}
         onRefresh={onRefresh}
      />
   );
};

const ResultDoingItem = ({ result, i18n }) => {
   return <View style={{ width: itemWidth }} className="m-2 bg-slate-200/70 rounded-lg border-slate-200 border-b-[6px] overflow-hidden">
      <Image
         source={result.quiz_id?.quiz_thumb ? { uri: result.quiz_id?.quiz_thumb } : Images.banner1}
         className="w-full h-28"
         style={{ resizeMode: 'cover' }}
      />

      <View className='bg-black/50 px-1 rounded-lg absolute top-2 left-2 flex-row items-center'>
         <FontAwesome6 name="chalkboard-user" color='white' />
         <Text className="text-sm text-slate-50 ml-1">{result.exercise_id?._id ? i18n.t('activity.exercise') : result.room_id ? i18n.t('activity.room') : i18n.t('activity.publish')}</Text>
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
            {result.type !== 'publish' ? `hạn: ${moment(result.exercise_id?.date_end).format('DD/MM/YYYY')}` : 'Không thời hạn'}
         </Text>

         <Text className="text-sm mt-4 font-light text-center text-slate-50 bg-violet-300 rounded-full px-2">
            {result.result_questions?.length}/{result.quiz_id?.questionCount} câu hỏi
         </Text>
      </View>
   </View>
}

const DoingResults = ({ results, refreshing, onRefresh, i18n }) => {
   const { userData } = useAuthContext();
   const router = useRouter();
   const { completed } = useResultProvider()

   if (refreshing || !results) {
      return <SkeletonList count={6} />;
   }

   if (results.length === 0) {
      return (<ScrollView
              refreshControl={
                 <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
          >
             <View className={"h-[400px]"}>
                <Lottie
                    source={require('@/assets/jsons/empty.json')}
                    width={150}
                    height={150}
                    text={i18n.t('activity.emptyActivity')}
                />
             </View>
          </ScrollView>
      )
   }

   return (
      <FlatList
         showsVerticalScrollIndicator={false}
         data={results}
         renderItem={({ item }) => (
            <Pressable onPress={() => {
               Alert.alert(
                  i18n.t('activity.titleQuestionContinuteQUiz'),
                  i18n.t('activity.textQuestionContinuteQuiz'),
                  [
                     { text: i18n.t('activity.btnCancel'), style: "cancel" },
                     {
                        text: i18n.t('activity.btnContinute'), onPress: async () => {

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
                                    text1: i18n.t('activity.notiDL'),
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
               <ResultDoingItem result={item} i18n={i18n} />
            </Pressable>
         )}
         keyExtractor={item => item._id}
         numColumns={2}
         columnWrapperStyle="flex-row justify-between"
         refreshing={refreshing}
         onRefresh={onRefresh}
      />
   );
};

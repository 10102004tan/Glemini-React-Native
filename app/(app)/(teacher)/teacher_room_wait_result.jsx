import { View, Text, Dimensions, Animated, TouchableOpacity, Easing, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Wrapper from '@/components/customs/Wrapper'
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import RankBoardUserItem from '@/components/customs/RankBoardUserItem';
import { useQuestionProvider } from '@/contexts/QuestionProvider';
import QuestionOverview from '@/components/customs/QuestionOverview';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { useAuthContext } from '@/contexts/AuthContext';
import { FlatList } from 'react-native-gesture-handler';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import socket from '@/utils/socket';
import Button from '@/components/customs/Button';
const TeacherRoomWaitResultScreen = () => {
   const [translateValue] = useState(new Animated.Value(0));
   const screenWidth = Dimensions.get('window').width;
   const [tabResult, setTabResult] = useState('rankboard');
   const [rankBoardTransform] = useState(new Animated.Value(0));
   const [questionBoardTransform] = useState(new Animated.Value(screenWidth));
   const { getQuestionsByQuizId } = useQuestionProvider();

   const { quizId, users, roomCode } = useGlobalSearchParams();
   const joinedUsers = JSON.parse(users) // Parse JSON string back to array
   const [questions, setQuestions] = useState([]);
   const { userData } = useAuthContext();
   const [rankData, setRankData] = useState([]);
   const [accuracy, setAccuracy] = useState(0);
   const animatedWidthGreen = useRef(new Animated.Value(50)).current;
   const animatedWidthRed = useRef(new Animated.Value(50)).current;

   const router = useRouter();

   useEffect(() => {
      // Chạy animation khi giá trị `accuracy` thay đổi
      Animated.timing(animatedWidthGreen, {
         toValue: accuracy > 0 ? accuracy : 50,
         duration: 500, // Thời gian animation (miligiây)
         useNativeDriver: false, // `false` vì `width` không hỗ trợ `native driver`
      }).start();

      Animated.timing(animatedWidthRed, {
         toValue: accuracy > 0 ? 100 - accuracy : 50,
         duration: 500, // Thời gian animation (miligiây)
         useNativeDriver: false,
      }).start();
   }, [accuracy]);

   // Interpolate giá trị để chuyển thành chuỗi `%`
   const greenWidth = animatedWidthGreen.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
   });

   const redWidth = animatedWidthGreen.interpolate({
      inputRange: [0, 100],
      outputRange: ['100%', '0%'],
   });


   // Call API to get questions by quizId
   useEffect(() => {
      // console.log(quizId)
      const fetchQuestion = async () => {
         const response = await fetch(
            `${API_URL}${API_VERSION.V1}${END_POINTS.GET_QUIZ_QUESTIONS}`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  "x-client-id": userData._id,
                  "authorization": userData.accessToken,
               },
               body: JSON.stringify({
                  quiz_id: quizId,
               }),
            }
         );

         const data = await response.json();
         if (data.statusCode === 200) {
            setQuestions(data.metadata);
         }
      }

      if (quizId) {
         fetchQuestion();
      }
   }, [quizId])

   useEffect(() => {

      // Lắng nghe sự kiện 'updateRanking' từ socket
      socket.on('updateRanking', (users) => {
         setRankData(users);
      });

      // Lắng nghe sự kiện cập nhật lại thanh process
      socket.on('updateStats', (data) => {
         console.log(data);
         setAccuracy(data.accuracy);
         // setErrorRate(data.errorRate);
      });


      return () => {
         socket.off('updateRanking');
         socket.off('updateStats');
      };
   }, []);


   useEffect(() => {
      Animated.timing(translateValue, {
         toValue: tabResult === 'rankboard' ? 0 : (screenWidth * 90 / 100) / 2,
         duration: 300,
         useNativeDriver: true,
      }).start();

      Animated.timing(rankBoardTransform, {
         toValue: tabResult === 'question' ? -1.0 * screenWidth : 0,
         duration: 300,
         useNativeDriver: true,
         easing: Easing.out(Easing.exp),
      }).start();

      Animated.timing(questionBoardTransform, {
         toValue: tabResult === 'question' ? 0 : screenWidth,
         duration: 300,
         useNativeDriver: true,
         easing: Easing.out(Easing.exp),
      }).start();
   }, [tabResult])

   return (
      <Wrapper>
         <View className="flex-1 p-4 bg-primary">
            <View className="flex items-end justify-end flex-row mb-4 mt-[40px]">
               <Button text='Kết thúc' otherStyles='p-3 bg-red-500' onPress={() => {
                  Alert.alert('Thông báo', 'Bạn có chắc chắn muốn thoát phòng?', [
                     {
                        text: 'Hủy',
                        onPress: () => { }
                     },
                     {
                        text: 'Thoát',
                        onPress: async () => {
                           const response = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_UPDATE_STATUS}`, {
                              method: 'POST',
                              headers: {
                                 'Content-Type': 'application/json',
                                 'x-client-id': userData._id,
                                 authorization: userData.accessToken,
                              },
                              body: JSON.stringify({
                                 room_code: roomCode,
                                 status: 'completed',
                              }),
                           })
                           const data = await response.json();
                           console.log(data)
                           if (data.statusCode === 200) {
                              socket.emit('endQuiz', { roomCode: roomCode, user: userData });
                              router.replace({
                                 pathname: '/(app)/(home)',
                                 params: {}
                              }) // Redirect to home
                           }
                        }
                     }
                  ])
               }} />
            </View>
            <View className="p-4 rounded-2xl bg-black flex flex-row items-center justify-between">
               <View >
                  <Text className="text-sm text-gray">
                     Mã tham gia
                  </Text>
                  <Text className="text-white text-lg">
                     {roomCode}
                  </Text>
               </View>
               <Feather name="copy" size={20} color="white" />
            </View>
            <View className="mt-10 bg-black p-4 rounded-2xl flex items-center justify-between flex-row">
               <Animated.View className="h-8 rounded-tl-lg border-black border rounded-bl-lg bg-green-500"
                  style={{ width: greenWidth }}
               ></Animated.View>
               <Animated.View className="w-2 h-8 rounded-tr-lg border-black border rounded-br-lg bg-red-500"
                  style={{ width: redWidth }}
               ></Animated.View>

               <View className={`w-[100px] h-[100px] absolute rounded-full flex items-center justify-center flex-col left-[40%] bg-white border-4 border-white ${accuracy > 50 ? 'border-green-500' : 'border-red-500'}`}>
                  <Text className="font-semibold text-black text-2xl">
                     {accuracy}%
                  </Text>
                  <Text className="text-gray text-sm">
                     Độ chính xác
                  </Text>
               </View>
            </View>

            <View className="w-full relative">
               <View className="mt-[40px] mx-auto overflow-hidden flex items-center w-[90%] justify-center flex-row p-4 bg-black rounded-tl-2xl  rounded-tr-2xl">
                  <TouchableOpacity className="w-1/2"
                     onPress={() => setTabResult('rankboard')}
                  >
                     <Text className="text-white text-center">
                        Bảng xếp hạng
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="w-1/2"
                     onPress={() => setTabResult('question')}
                  >
                     <Text className="text-white text-center">
                        Câu hỏi
                     </Text>
                  </TouchableOpacity>
                  <Animated.View className="w-1/2 absolute h-1 bg-white rounded-2xl bottom-0 left-0"
                     style={{
                        transform: [{ translateX: translateValue }],
                     }}
                  ></Animated.View>
                  {/* Line bottom */}
               </View>
            </View>
            {/* Board Content */}
            <View className="relative flex-1">
               {/* Rank Board */}
               <Animated.View
                  style={{
                     transform: [{ translateX: rankBoardTransform }],
                  }}
                  className="p-4 w-full absolute rounded-2xl bg-gray">
                  <View className="flex items-center flex-row justify-start">
                     <AntDesign name="user" size={14} color="white" />
                     <Text className="text-white ml-1">
                        {joinedUsers.length - 1} Người tham gia
                     </Text>
                  </View>
                  {/* Items */}
                  {userData && rankData.length > 0 &&
                     rankData.map((user, index) => {
                        if (userData._id !== user._id) {
                           return <RankBoardUserItem
                              key={user._id}
                              user={{ user_fullname: user.user_fullname, user_avatar: user.user_avatar }} point={user.score} rankIndex={index} />
                        }
                     })
                  }
               </Animated.View>

               {/* Question Board */}
               <Animated.View
                  style={{
                     transform: [{ translateX: questionBoardTransform }],
                  }}
                  className="w-full absolute rounded-2xl overflow-hidden h-full">
                  <FlatList
                     style={{ flex: 1, borderRadius: 20, overflow: 'hidden' }}
                     data={questions}
                     key={(item) => item._id}
                     keyExtractor={(item) => item._id}
                     renderItem={({ item, index }) => (
                        <QuestionOverview question={item} index={index} quizId={quizId} editable={false} />
                     )}
                  />
               </Animated.View>
            </View>

         </View>
      </Wrapper>
   )
}

export default TeacherRoomWaitResultScreen

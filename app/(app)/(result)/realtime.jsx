import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import Button from '../../../components/customs/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAppProvider } from '@/contexts/AppProvider';
import { API_URL, API_VERSION, END_POINTS } from '../../../configs/api.config';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import RankBoard from '@/components/customs/RankBoard';
import socket from '@/utils/socket';

const RealtimeResult = ({ correctCount, wrongCount, score, totalQuestions, handleRestart, quizId, roomCode, rankBoardData, createdUserId, roomId }) => {

   const { i18n } = useAppProvider()
   const { userData } = useAuthContext()
   const correctPercentage = (correctCount / totalQuestions) * 100;
   const wrongPercentage = (wrongCount / totalQuestions) * 100;
   const [resultData, setResultData] = useState([])
   const [sound, setSound] = useState(null)
   const router = useRouter();

   useEffect(() => {
      const fetchResultData = async () => {
         try {
            const res = await fetch(API_URL + API_VERSION.V1 + END_POINTS.RESULT_REVIEW, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'x-client-id': userData._id,
                  authorization: userData.accessToken,
               },
               body: JSON.stringify({
                  quiz_id: quizId,
                  user_id: userData._id,
                  room_id: roomId,
               }),
            });

            const data = await res.json();
            // console.log(data)
            setResultData(data.metadata);
         } catch (error) {
            console.error('Lỗi khi lấy câu hỏi:', error);
         }
      };
      if (userData) {
         fetchResultData();
      }
   }, [userData]);

   const playCompletedSound = async () => {
      try {
         const { sound } = await Audio.Sound.createAsync(
            require('@/assets/sounds/completed.mp3')
         );
         setSound(sound);
         await sound.playAsync();
      } catch (error) {
         console.error('Lỗi khi phát âm thanh:', error);
      }
   };

   useEffect(() => {
      playCompletedSound();

      return () => {
         if (sound) {
            sound.unloadAsync();
         }
      };
   }, []);


   return (
      <View className="flex-1 bg-[#1C2833] px-6 pb-4 pt-10">
         <ScrollView className="flex-1">
            <View className="flex flex-row items-center justify-between mt-3">
               <Button
                  text={i18n.t('result.single.buttonReview')}
                  onPress={() => {
                     router.push({
                        pathname: '/(result)/review',
                        params: {
                           result: JSON.stringify(resultData)
                        }
                     })
                  }}
                  type="fill"
                  otherStyles={'bg-[#435362] p-4'}
                  textStyles={'text-white text-center text-sm'}
               />
               <Button
                  text={i18n.t('result.single.buttonQuit')}
                  onPress={() => {
                     socket.emit('leaveRoom', { roomCode, user: userData });
                     router.replace({
                        pathname: '/(app)/(home)',
                        params: {}
                     })
                  }}
                  type="fill"
                  otherStyles={'bg-[#435362] p-4'}
                  textStyles={'text-sm'}
               />
            </View>

            <View className="flex-row p-5 bg-[#435362] mt-5 rounded-lg">
               <Image
                  source={{
                     uri: userData.user_avatar
                  }}
                  className="w-20 h-20 rounded-full"
                  style={{ resizeMode: 'cover' }}
               />
               <View className="flex ml-5 justify-around">
                  <Text className="text-lg text-slate-200">
                     {userData.user_fullname}
                  </Text>
                  <Text className="bg-slate-500 rounded-full text-sm px-2 text-slate-200">
                     {i18n.t('result.single.textDesc')}
                  </Text>
               </View>
            </View>

            <View className="flex p-5 bg-[#435362] mt-5  rounded-lg">
               <Text className="text-slate-200 text-[15px]">{i18n.t('result.single.textResult')}</Text>

               {/* Thanh Progress Bar */}
               <View className="flex-row h-5 mt-2 rounded-full overflow-hidden border border-white">
                  <View
                     style={{
                        width: `${correctPercentage}%`,
                        backgroundColor: '#4CAF50', // Màu xanh lá cho đúng
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                        borderTopRightRadius:
                           correctPercentage === 100 ? 10 : 0,
                        borderBottomRightRadius:
                           correctPercentage === 100 ? 10 : 0,
                     }}
                  />
                  <View
                     style={{
                        width: `${wrongPercentage}%`,
                        backgroundColor: '#F44336', // Màu đỏ cho sai
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                        borderTopLeftRadius:
                           wrongPercentage === 100 ? 10 : 0,
                        borderBottomLeftRadius:
                           wrongPercentage === 100 ? 10 : 0,
                     }}
                  />
               </View>

               <View className="flex flex-row justify-between mt-3">
                  <Text className="text-green-500 font-semibold">
                     {i18n.t('result.single.correct')}: {correctPercentage.toFixed(0)}%
                  </Text>
                  <Text className="text-red-500 font-semibold">
                     {i18n.t('result.single.incorrect')}: {wrongPercentage.toFixed(0)}%
                  </Text>
               </View>
            </View>

            <View className="flex-row justify-between ">
               <View className="flex-row p-3 flex-1 mr-2 mt-5 rounded-lg bg-[#435362] justify-between items-center">
                  <View className="flex-col">
                     <Text className="text-sm text-slate-200">{i18n.t('result.single.score')}</Text>
                     <Text className="text-xl text-slate-100 font-semibold">
                        {score}
                     </Text>
                  </View>
                  <View className="ml-5 bg-orange-400 rounded-lg p-1">
                     <Icon
                        name="ribbon-outline"
                        size={25}
                        color={'white'}
                     />
                  </View>
               </View>
               <View className="flex-row p-3 mt-5 w-1/2 rounded-lg bg-[#435362] justify-between items-center">
                  <View className="flex-col">
                     <Text className="text-sm text-slate-200">
                        {i18n.t('result.single.totalQuestions')}
                     </Text>
                     <Text className="text-xl text-slate-100 font-semibold">
                        {totalQuestions}
                     </Text>
                  </View>
                  <View className="ml-2 bg-violet-400 rounded-lg p-1">
                     <Icon
                        name="help-circle-outline"
                        size={25}
                        color={'white'}
                     />
                  </View>
               </View>
            </View>

            <View className="flex-row justify-between">
               <View className="flex-row p-3 flex-1 mr-2 mt-2 rounded-lg bg-[#435362] justify-between items-center">
                  <View className="flex-col">
                     <Text className="text-sm text-slate-200">{i18n.t('result.single.correct')}</Text>
                     <Text className="text-xl text-slate-100 font-semibold">
                        {correctCount}
                     </Text>
                  </View>
                  <View className="ml-5 bg-green-500 rounded-lg p-1">
                     <Icon
                        name="checkmark-circle-outline"
                        size={25}
                        color={'white'}
                     />
                  </View>
               </View>
               <View className="flex-row p-3 w-1/2 mt-2 rounded-lg bg-[#435362] justify-between items-center">
                  <View className="flex-col">
                     <Text className="text-sm text-slate-200">
                        {i18n.t('result.single.incorrect')}
                     </Text>
                     <Text className="text-xl text-slate-100 font-semibold">
                        {wrongCount}
                     </Text>
                  </View>
                  <View className="ml-5 bg-red-500 rounded-lg p-1">
                     <Icon
                        name="close-circle-outline"
                        size={25}
                        color={'white'}
                     />
                  </View>
               </View>
            </View>

            <View className="relative mt-4 bg-[#435362] rounded-xl border border-white">
               <Text className="p-4 bg-green-500 text-white mb-5 rounded-tl-xl rounded-tr-xl ">Bảng xếp hạng</Text>
               <View className="p-4" showsVerticalScrollIndicator={false}>
                  {rankBoardData.rank && rankBoardData.rank.length > 0 &&
                     rankBoardData.rank.map((rank, index) => {
                        if (rank.user_id._id !== createdUserId) {
                           return <View
                              key={index}
                              className={`bg-gray mb-2 ${userData && userData._id === rank.user_id._id && 'bg-white'} p-2 rounded-2xl flex items-center justify-start flex-row`}
                           >
                              <Image source={{ uri: rank.user_id.user_avatar }} className="w-[50px] h-[50px] rounded-full" />
                              <View className="ml-3">
                                 <Text className="text-lg font-semibold">{rank.user_id.user_fullname}</Text>
                                 <Text className="text-red-500">Điểm số: {rank.userScore} </Text>
                              </View>
                           </View>
                        }
                     })}
               </View>
            </View>
         </ScrollView>
      </View>
   );
};

export default RealtimeResult;

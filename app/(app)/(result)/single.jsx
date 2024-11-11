import React, { useEffect, useState } from 'react';
// import { useNavigation } from '@react-navigation/native';
import { View, Text, Image } from 'react-native';
import Button from '../../../components/customs/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAppProvider } from '@/contexts/AppProvider';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { useResultProvider } from '@/contexts/ResultProvider';

const ResultSingle = ({ quizId, correctCount, wrongCount, score, totalQuestions, handleRestart, exerciseId }) => {

   const { fetchResultData, result } = useResultProvider()
   // const navigation = useNavigation()
   const { i18n } = useAppProvider()
   const { userData } = useAuthContext()
   const correctPercentage = (correctCount / totalQuestions) * 100;
   const wrongPercentage = (wrongCount / totalQuestions) * 100;
   const [sound, setSound] = useState(null)
   const router = useRouter();

   useEffect(() => {
      fetchResultData(quizId, exerciseId);
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
      <View className="flex-1 bg-[#1C2833] px-5 pb-4 pt-10">
         <View className="flex self-end mt-3">
            <Button
               text={i18n.t('result.single.buttonQuit')}
               onPress={() => {
                  router.push('/(app)/(home)')
               }}
               type="fill"
               otherStyles={'bg-[#435362] p-2'}
               textStyles={'text-sm'}
            />
         </View>

         <View className="flex-row justify-around pt-5 ">
            <Button
               text={i18n.t('result.single.buttonReplay')}
               onPress={handleRestart}
               type="fill"
               otherStyles={
                  'bg-violet-500 py-4 px-6 border-b-4 border-b-violet-600'
               }
               textStyles={'text-lg'}
            />
            <Button
               text={i18n.t('result.single.buttonPlayNewQuiz')}
               onPress={() => {
                  router.push('search')
               }}
               type="fill"
               otherStyles={
                  'bg-slate-100 p-4 border-b-4 border-b-slate-300'
               }
               textStyles={'text-black text-lg'}
            />
         </View>

         <View className="flex-row p-5 bg-[#435362] mt-5 mx-3 rounded-lg">
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
                  {' '}
                  <Icon name="person-outline" /> {i18n.t('result.single.textDesc')}
               </Text>
            </View>
         </View>

         <View className="flex p-5 bg-[#435362] mt-5 mx-3 rounded-lg">
            <Text className="text-slate-200 text-[15px]">{i18n.t('result.single.textResult')}</Text>

            {/* Thanh Progress Bar */}
            <View className="flex-row h-5 mt-2">
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

         <View className="flex-row justify-between mx-3">
            <View className="flex-row p-3 mt-5 rounded-lg bg-[#435362] justify-between items-center">
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
            <View className="flex-row p-3 mt-5 rounded-lg bg-[#435362] justify-between items-center">
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

         <View className="flex-row justify-between mx-3">
            <View className="flex-row p-3 mt-5 rounded-lg bg-[#435362] justify-between items-center">
               <View className="flex-col">
                  <Text className="text-sm text-slate-200">{i18n.t('result.single.correct')}</Text>
                  <Text className="text-xl text-slate-100 font-semibold">
                     {correctCount}
                  </Text>
               </View>
               <View className="ml-2">
                  <Icon2
                     name="checkbox-marked-outline"
                     size={40}
                     color={'green'}
                  />
               </View>
            </View>
            <View className="flex-row p-3 mt-5 rounded-lg bg-[#435362] justify-between items-center">
               <View className="flex-col">
                  <Text className="text-sm text-slate-200">
                     {i18n.t('result.single.incorrect')}
                  </Text>
                  <Text className="text-xl text-slate-100 font-semibold">
                     {wrongCount}
                  </Text>
               </View>
               <View className="ml-2">
                  <Icon2
                     name="close-box-outline"
                     size={40}
                     color={'red'}
                  />
               </View>
            </View>
         </View>

         <View className="flex self-start absolute bottom-5 left-5">
            <Button
               text={i18n.t('result.single.buttonReview')}
               onPress={() => {
                  router.push({
                     pathname: '(result)/review',
                     params: { result: JSON.stringify(result) }
                  })
               }}
               type="fill"
               otherStyles={'bg-[#435362] p-2'}
               textStyles={'text-white text-center text-sm'}
            />
         </View>
      </View>
   );
};

export default ResultSingle;

import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import Button from '../../../components/customs/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAppProvider } from '@/contexts/AppProvider';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { useResultProvider } from '@/contexts/ResultProvider';
import LottieView from 'lottie-react-native';

const ResultSingle = ({ resultId, handleRestart }) => {
   const { i18n } = useAppProvider();
   const { userData } = useAuthContext();
   const [sound, setSound] = useState(null);
   const router = useRouter();
   const {fetchOverViewData, overViewData} = useResultProvider()

   useEffect(()=>{
      fetchOverViewData(resultId)
   },[resultId])
   // const playCompletedSound = async () => {
   //    try {
   //       const { sound } = await Audio.Sound.createAsync(
   //          require('@/assets/sounds/completed.mp3')
   //       );
   //       setSound(sound);
   //       await sound.playAsync();
   //    } catch (error) {
   //       console.error('Error playing sound:', error);
   //    }
   // };

   // useEffect(() => {
   //    playCompletedSound();
   //    return () => sound && sound.unloadAsync();
   // }, [overViewData]);

   if (!overViewData) {
      return (
         <View className="flex-1 items-center justify-center">
            <LottieView
               source={require('@/assets/jsons/splash.json')}
               autoPlay
               loop
               style={{ width: 100, height: 100 }}
            />
         </View>
      );
   }

   const correctCount = overViewData.result_questions?.filter(q => q.correct)?.length;
   const incorrectCount = overViewData.result_questions?.filter(q => q.correct === false)?.length;

   const correctPercentage = overViewData.result_questions 
      ? (correctCount / overViewData.result_questions.length) * 100 
      : 0;
   const wrongPercentage = overViewData.result_questions 
      ? (incorrectCount / overViewData.result_questions.length) * 100 
      : 0;
   
   return (
      <View className="flex-1 bg-[#1C2833] px-5 pb-4 pt-10">
         {/* Top Navigation Button */}
         <View className="flex self-end mt-3">
            <Button
               text={i18n.t('result.single.buttonQuit')}
               onPress={() => router.push('/(app)/(home)')}
               type="fill"
               otherStyles="bg-[#435362] p-2"
               textStyles="text-sm"
            />
         </View>

         {/* Replay and New Quiz Buttons */}
         <View className="flex-row justify-around pt-5">
            <Button
               text={i18n.t('result.single.buttonReplay')}
               onPress={handleRestart}
               type="fill"
               otherStyles="bg-violet-500 py-4 px-6 border-b-4 border-b-violet-600"
               textStyles="text-lg"
            />
            <Button
               text={i18n.t('result.single.buttonPlayNewQuiz')}
               onPress={() => router.push('/(home)/search')}
               type="fill"
               otherStyles="bg-slate-100 p-4 border-b-4 border-b-slate-300"
               textStyles="text-black text-lg"
            />
         </View>

         {/* User Information */}
         <View className="flex-row p-5 bg-slate-600 mt-5 mx-3 rounded-lg items-center">
            <Image
               source={{ uri: userData.user_avatar }}
               className="w-20 h-20 rounded-full"
               style={{ resizeMode: 'cover' }}
            />
            <View className="flex ml-5">
               <Text className="text-lg text-slate-50 font-psemibold">{userData.user_fullname}</Text>
               <Text className="bg-slate-600 rounded-full text-sm px-2 text-slate-50 mt-1 flex-row items-center">
                  <Icon name="person-outline" size={15} color="white" /> {i18n.t('result.single.textDesc')}
               </Text>
            </View>
         </View>

         {/* Result Summary and Progress Bar */}
         <View className="flex p-5 bg-slate-600 mt-5 mx-3 rounded-lg">
            <Text className="text-slate-50 text-base font-pmedium">{i18n.t('result.single.textResult')}</Text>
            <View className="flex-row h-5 mt-2 rounded-lg overflow-hidden">
               <View style={{ width: `${correctPercentage}%`, backgroundColor: '#4CAF50' }} />
               <View style={{ width: `${wrongPercentage}%`, backgroundColor: '#F44336' }} />
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

         {/* Result Details */}
         <View className="flex-row justify-between mx-3 mt-5">
            <DetailBox
               label={i18n.t('result.single.score')}
               value={correctCount}
               icon={<Icon name="ribbon-outline" size={25} color="white" />}
               background="bg-orange-400"
            />
            <DetailBox
               label={i18n.t('result.single.totalQuestions')}
               value={overViewData.result_questions?.length}
               icon={<Icon name="help-circle-outline" size={25} color="white" />}
               background="bg-violet-400"
            />
         </View>

         <View className="flex-row justify-between mx-3 mt-5">
            <DetailBox
               label={i18n.t('result.single.correct')}
               value={correctCount}
               icon={<Icon2 name="checkbox-marked-outline" size={40} color="green" />}
            />
            <DetailBox
               label={i18n.t('result.single.incorrect')}
               value={incorrectCount}
               icon={<Icon2 name="close-box-outline" size={40} color="red" />}
            />
         </View>

         {/* Review Button */}
         <View className="absolute bottom-5 left-5">
            <Button
               text={i18n.t('result.single.buttonReview')}
               onPress={() =>
                  router.push({ 
                     pathname: '(result)/review', 
                     params: { result: JSON.stringify(overViewData) } 
                  })
               }
               type="fill"
               otherStyles="bg-[#435362] p-2"
               textStyles="text-white text-center text-sm"
            />
         </View>
      </View>
   );
};

// Component for Detail Boxes
const DetailBox = ({ label, value, icon, background }) => (
   <View className={`flex-row p-3 rounded-lg bg-slate-600 items-center justify-between `}>
      <View className="flex-col">
         <Text className="text-sm text-slate-300">{label}</Text>
         <Text className="text-slate-200 font-semibold text-lg">{value}</Text>
      </View>
      <View className={`p-2 rounded-lg ${background}`}>
         {icon}
      </View>
   </View>
);

export default ResultSingle;

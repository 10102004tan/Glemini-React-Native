import { View, Text, FlatList, Pressable, Image, RefreshControl } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Images } from '@/constants';
import Toast from 'react-native-toast-message-custom';
import moment from 'moment';
import { useResultProvider } from '@/contexts/ResultProvider';
import Lottie from '@/components/loadings/Lottie';
import { useAppProvider } from '@/contexts/AppProvider';
import SkeletonClassroomCard from '@/components/loadings/SkeletonClassroomCard';

const StudentDetail = () => {
   const { i18n } = useAppProvider()
   const { classroomId } = useLocalSearchParams();
   const { classroom, fetchClassroom } = useClassroomProvider();
   const { fetchResultData } = useResultProvider()
   const [isLoading, setIsLoading] = useState(false)
   const [refreshing, setRefreshing] = useState(null)
   const {moment} = useAppProvider();
   useFocusEffect(
      useCallback(() => {
         const loadClassroom = async () => {
            setIsLoading(true);
            try {
               await fetchClassroom(classroomId);
            } catch (error) {
               console.error('Error fetching classroom:', error);
            } finally {
               setIsLoading(false);
            }
         };

         loadClassroom();
      }, [classroomId])
   );

   const onRefresh = async () => {
      setRefreshing(true);
      await fetchClassroom(classroomId);
      setRefreshing(false);
   };

   const startQuiz = async (quizId, exerciseId) => {
      // console.log({quizId, exerciseId, type : 'exercise'});
      const fetchedResult = await fetchResultData({ quizId, exerciseId, type: 'exercise' });
      if (fetchedResult) {
         router.push({
            pathname: '/(home)/activity',
         });
      } else {
         router.push({
            pathname: '(play)/single',
            params: { quizId, exerciseId, type: 'exercise' },
         });
      }
   };

   return (
      <View className='p-4 bg-white flex-1'>
         <Text className='text-xl font-semibold mb-3 text-gray-800'>{i18n.t('classroom.student.title')}</Text>
         {isLoading || refreshing ?
            <>
               {[...Array(5)].map((_, index) => (
                  <SkeletonClassroomCard key={index} />
               ))}
            </> : classroom.exercises && classroom.exercises.length > 0 ?
               <FlatList
                  showsVerticalScrollIndicator={false}
                  data={classroom.exercises}
                  keyExtractor={(quiz) => quiz._id}
                  renderItem={({ item }) => {
                     const endDate = moment(item.date_end);
                     const startDate = moment(item.date_start);
                     const now = moment();
                     const duration = moment.duration(endDate.diff(now));
                     const isExpired = duration.asMilliseconds() <= 0;
                     const isNotStartedYet = startDate.isAfter(now);

                     return (
                        <Pressable
                           onPress={() => {
                              if (isExpired) {
                                 Toast.show({
                                    type: 'error',
                                    text1: i18n.t('classroom.student.notiDL'),
                                    text2: i18n.t('classroom.student.notiChildDL'),
                                    position: 'top',
                                    visibilityTime: 1000,
                                    autoHide: true,
                                 });
                              } else if (isNotStartedYet) {
                                 Toast.show({
                                    type: 'warn',
                                    text1: i18n.t('classroom.student.notiStart'),
                                    text2: i18n.t('classroom.student.notiChildStart'),
                                    position: 'top',
                                    visibilityTime: 1000,
                                    autoHide: true,
                                 });
                              }
                              else {
                                 startQuiz(item.quiz_id._id, item._id);
                              }
                           }}
                        >
                           <View className={`bg-slate-200/50 mb-4 rounded-lg shadow-lg ${isExpired || isNotStartedYet ? 'opacity-50' : ''}`}>
                              <View className='flex-row items-center gap-4'>
                                 <Image
                                    source={item.quiz_id?.quiz_thumb ? { uri: item.quiz_id?.quiz_thumb } : Images.banner1}
                                    className='w-24 h-24 rounded-lg shadow-md shadow-black/20'
                                 />
                                 <View>
                                    <Text className='text-lg font-semibold'>
                                       {item.name}
                                    </Text>
                                    <Text className='text-base font-semibold'>
                                       {item.quiz_id.quiz_name}
                                    </Text>
                                    {isExpired ? (
                                       <Text className='text-red-600 mt-2'>
                                          {i18n.t('classroom.student.notiDL')}
                                       </Text>
                                    ) : isNotStartedYet ? (
                                       <Text className='text-orange-600 mt-2'>
                                          {i18n.t('classroom.student.textNotStartedYet')}
                                       </Text>
                                    ) : (
                                        <View>
                                           <Text className='text-green-600 mt-2'>
                                              {moment(item.date_end).format('LLLL')}
                                           </Text>
                                           <Text className='text-green-600 text-[10px]'>
                                              {moment(item.date_end).fromNow()}
                                           </Text>
                                        </View>
                                    )}
                                 </View>
                              </View>
                           </View>
                        </Pressable>
                     );
                  }}
                  refreshControl={
                     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
               />
               : <Lottie
                  source={require('@/assets/jsons/empty.json')}
                  width={250}
                  height={250}
                  text={i18n.t('classroom.student.emptyExercise')}
               />}
      </View>
   );
};

export default StudentDetail;

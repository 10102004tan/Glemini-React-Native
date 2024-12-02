import { View, Text, FlatList, Pressable, Image } from 'react-native';
import React, { useCallback } from 'react';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Images } from '@/constants';
import Toast from 'react-native-toast-message-custom';
import moment from 'moment';
import { useResultProvider } from '@/contexts/ResultProvider';
import Lottie from '@/components/loadings/Lottie';
import { useAppProvider } from '@/contexts/AppProvider';

const StudentDetail = () => {
    const {i18n} = useAppProvider()
    const { classroomId } = useLocalSearchParams();
    const { classroom, fetchClassroom } = useClassroomProvider();
    const { fetchResultData } = useResultProvider()

    useFocusEffect(
        useCallback(() => {
            fetchClassroom(classroomId);
        }, [classroomId])
    );

    const startQuiz = async (quizId, exerciseId) => {
        // console.log({quizId, exerciseId, type : 'exercise'});

        const fetchedResult = await fetchResultData({ quizId, exerciseId, type: 'exercise' });
        console.log(fetchedResult);
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
            <Text className='text-xl font-semibold mb-3 text-gray-800'>{I18n.t('classroom.student.title')}</Text>
            {classroom.exercises && classroom.exercises.length > 0 ?
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

                        const timeRemaining = isExpired
                            ? I18n.t('classroom.student.textEnd')
                            : duration.asDays() >= 1
                                ? `${Math.floor(duration.asDays())} ngày nữa`
                                : duration.asHours() >= 1
                                    ? `${Math.floor(duration.asHours() + 1)} giờ nữa`
                                    : `${Math.floor(duration.asMinutes())} phút nữa`;

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
                                                <Text className='text-green-600 mt-2'>
                                                    {timeRemaining}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        );
                    }}
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
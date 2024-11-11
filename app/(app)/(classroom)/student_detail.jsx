import { View, Text, FlatList, Pressable, Image } from 'react-native';
import React, { useCallback } from 'react';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import LottieView from 'lottie-react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Images } from '@/constants';
import Toast from 'react-native-toast-message-custom';
import moment from 'moment';
import { useResultProvider } from '@/contexts/ResultProvider';

const StudentDetail = () => {
    const { classroomId } = useLocalSearchParams();
    const { classroom, fetchClassroom } = useClassroomProvider();
    const { fetchResultData, result } = useResultProvider()

    useFocusEffect(
        useCallback(() => {
            fetchClassroom(classroomId);
        }, [classroomId])
    );

    const startQuiz = async (quizId, exerciseId) => {
        const fetchedResult = await fetchResultData(quizId, exerciseId);
        if (fetchedResult) {
            router.push({
                pathname: '/(home)/activity',
            });
        } else {
            router.push({
                pathname: '(play)/single',
                params: { quizId, exerciseId },
            });
        }
    };
    


    return (
        <View className='p-4 bg-white mb-10'>
            <Text className='text-xl font-semibold mb-3 text-gray-800'>Bài tập được giao</Text>
            {classroom?.exercises?.length > 0 ? (
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
                            ? 'Đã kết thúc'
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
                                            text1: 'Hết hạn làm bài',
                                            text2: 'Bạn không thể làm bài này nữa.',
                                            position: 'top',
                                            visibilityTime: 1000,
                                            autoHide: true,
                                        });
                                    } else if (isNotStartedYet) {
                                        Toast.show({
                                            type: 'warn',
                                            text1: 'Chưa bắt đầu',
                                            text2: 'Hiện tại bạn chưa thể làm bài này.',
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
                                                    Hết hạn làm bài
                                                </Text>
                                            ) : isNotStartedYet ? (
                                                <Text className='text-orange-600 mt-2'>
                                                    Chưa đến thời gian làm bài
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
            ) : (
                <View className='flex-1 items-center justify-center'>
                    <LottieView
                        source={require('@/assets/jsons/not-found.json')}
                        autoPlay
                        loop
                        style={{ width: 250, height: 250 }}
                    />
                </View>
            )}
        </View>
    );
};

export default StudentDetail;
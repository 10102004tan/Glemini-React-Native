import { View, Text, FlatList, Pressable } from 'react-native';
import React, { useCallback } from 'react';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import LottieView from 'lottie-react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

const StudentDetail = () => {
    const { classroomId } = useLocalSearchParams();
    const { classroom, fetchClassroom } = useClassroomProvider();

    useFocusEffect(
        useCallback(() => {
            fetchClassroom(classroomId);
        }, [classroomId])
    );

    const startQuiz = (quizId, exerciseId) => {
        router.push({
            pathname: '(play)/single',
            params: { quizId, exerciseId },
        });
    };

    return (
        <View className='p-5'>
            {classroom?.exercises?.length > 0 ? (
                <FlatList
                    data={classroom.exercises}
                    keyExtractor={(quiz) => quiz._id}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => startQuiz(item.quiz_id, item._id)}>
                            <View className='bg-slate-100 px-4 py-2 mb-2 rounded-md'>
                                <View className='flex-row items-center justify-between'>
                                    <View className='flex-row items-center gap-3'>
                                        <View>
                                            <Text className='text-base font-semibold'>{item.name}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    )}
                />
            ) : (
                <View className='h-full flex items-center justify-center'>
                    <LottieView
                        source={require('@/assets/jsons/not-found.json')}
                        autoPlay
                        loop
                        style={{ width: 300, height: 300 }}
                    />
                </View>
            )}
        </View>
    );
};

export default StudentDetail;

import {View, Text, FlatList, Pressable, TextInput, RefreshControl, ScrollView} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import ClassroomCard from '@/components/customs/ClassroomCard';
import { router } from 'expo-router';
import Lottie from '@/components/loadings/Lottie';
import { useAppProvider } from '@/contexts/AppProvider';
import SkeletonClassroomCard from '@/components/loadings/SkeletonClassroomCard';
const StudentView = () => {
    const { i18n } = useAppProvider()
    const { classrooms, fetchClassrooms } = useClassroomProvider();
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchClassrooms();
        setRefreshing(false);
    };

    const filteredClassrooms = classrooms.filter(classroom =>
        classroom.class_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleNavigateToDetail = (classroomId) => {
        router.push({
            pathname: '(classroom)/student_detail',
            params: { classroomId },
        });
    };
    return (
        <View className='flex-1 bg-white pb-20'>
            {/* Bộ tìm kiếm */}
            <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={i18n.t('classroom.student.titleSearchQuery')}
                className='border border-slate-500 rounded-xl py-2 px-5 mx-5 my-4'
            />

            {refreshing ? (
                // Hiển thị skeleton loader khi đang tải dữ liệu
                <>
                    {[...Array(4)].map((_, index) => (
                        <SkeletonClassroomCard key={index} />
                    ))}
                </>
            ) : filteredClassrooms && filteredClassrooms.length > 0 ? (
                <FlatList
                    data={filteredClassrooms}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => handleNavigateToDetail(item._id)}>
                            <ClassroomCard classroom={item} />
                        </Pressable>
                    )}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            ) : (
               <ScrollView
               refreshControl={
                   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
               }
               >
                  <View className={"h-[600px]"}>
                      <Lottie
                          source={require('@/assets/jsons/empty.json')}
                          width={250}
                          height={250}
                          text={'Không có lớp học'}
                      />
                  </View>
               </ScrollView>
            )}
        </View>

    );
};

export default StudentView;

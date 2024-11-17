import { View, Text, FlatList, Pressable, TextInput, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import ClassroomCard from '@/components/customs/ClassroomCard';
import { router } from 'expo-router';
import Lottie from '@/components/loadings/Lottie';
const StudentView = () => {
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
        <View className='flex-1 bg-slate-50 mb-20'>
            {/* Bộ tìm kiếm */}
            <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={'Nhập tên lớp cần tìm'}
                className='border border-slate-500 rounded-xl py-2 px-5 mx-5 mt-4'
            />

            {filteredClassrooms && filteredClassrooms.length > 0 ?
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
                : 
                <Lottie
					source={require('@/assets/jsons/empty.json')}
					width={250}
					height={250}
                    text={'Chưa có lớp học nào'}
				/>
            }
        </View>

    );
};

export default StudentView;

import { View, Text, FlatList, Pressable, TextInput} from 'react-native';
import React, {useCallback, useContext, useState} from 'react';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import ClassroomCard from '@/components/customs/ClassroomCard';
import { useFocusEffect } from 'expo-router';
const StudentView = () => {
    const { classrooms, fetchClassrooms } = useClassroomProvider();
	const [searchQuery, setSearchQuery] = useState('');
	
	useFocusEffect(
        useCallback(() => {
            fetchClassrooms();
        }, [])
    );
	const filteredClassrooms = classrooms.filter(classroom =>
        classroom.class_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
	return (
		<View className='flex-1 bg-slate-50'>
			{/* Bộ tìm kiếm */}
            <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={'Nhập tên lớp cần tìm'}
                className='border border-slate-500 rounded-xl py-2 px-5 mx-5 mt-4'
            />

			<FlatList
                data={filteredClassrooms}
                renderItem={({ item }) => (
                    <Pressable onPress={() => handleNavigateToDetail(item._id)}>
                        <ClassroomCard classroom={item} />
                    </Pressable>
                )}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ paddingBottom: 16 }}
            />
		</View>

	);
};

export default StudentView;

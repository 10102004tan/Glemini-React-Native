import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  RefreshControl,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import ClassroomCard from '@/components/customs/ClassroomCard';
import { router } from 'expo-router';
import Lottie from '@/components/loadings/Lottie';
import { useAppProvider } from '@/contexts/AppProvider';
import SkeletonClassroomCard from '@/components/loadings/SkeletonClassroomCard';
import MainLayout from '@/components/layouts/MainLayout';
import ScaleTouchable from '@/components/customs/ScaleTouchable';
const StudentView = () => {
  const { i18n } = useAppProvider();
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

  const filteredClassrooms = classrooms.filter((classroom) =>
    classroom.class_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const handleNavigateToDetail = (classroomId) => {
    router.push({
      pathname: '(classroom)/student_detail',
      params: { classroomId },
    });
  };
  return (
    <MainLayout>
      {/* Bộ tìm kiếm */}
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={i18n.t('classroom.student.titleSearchQuery')}
        placeholderTextColor="#9CA3AF"
        style={{
          backgroundColor: '#fff',
          color: '#111827', 
          borderRadius: 8,
          borderWidth: 1, 
          borderColor: '#58CC02', 
          borderRightWidth:3,
          borderBottomWidth: 3, 
          padding: 10,
          marginBottom: 16, 
          fontSize: 16
        }}
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
            <ScaleTouchable onPress={() => handleNavigateToDetail(item._id)}>
              <ClassroomCard classroom={item} />
            </ScaleTouchable>
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View className={'h-[600px]'}>
            <Lottie
              source={require('@/assets/jsons/empty.json')}
              width={250}
              height={250}
              text={'Không có lớp học'}
            />
          </View>
        </ScrollView>
      )}

    </MainLayout>
  );
};

export default StudentView;

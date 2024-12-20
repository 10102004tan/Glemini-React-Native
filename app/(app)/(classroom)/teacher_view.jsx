import { View, Text, TextInput, FlatList, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import Button from '@/components/customs/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomSheet from '@/components/customs/BottomSheet';
import Overlay from '@/components/customs/Overlay';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAppProvider } from '@/contexts/AppProvider';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import { useSubjectProvider } from '@/contexts/SubjectProvider';
import { SelectList } from 'react-native-dropdown-select-list';
import Toast from 'react-native-toast-message-custom';
import ClassroomCard from '@/components/customs/ClassroomCard';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Lottie from '@/components/loadings/Lottie';
import SkeletonClassroomCard from '@/components/loadings/SkeletonClassroomCard';

const TeacherView = () => {
   const { userData, fetchDetailUser } = useAuthContext();
   const [first, setFirst] = useState(false);
   const [selectedSchool, setSelectedSchool] = useState(null);
   const [selectedSubject, setSelectedSubject] = useState(null);
   const [className, setClassName] = useState('');
   const [searchQuery, setSearchQuery] = useState('');
   const [refreshing, setRefreshing] = useState(false);
   const { classrooms, createClassroom, fetchClassrooms } = useClassroomProvider();
   const { subjects } = useSubjectProvider();
   const { setIsHiddenNavigationBar, i18n } = useAppProvider();
   const navigation = useNavigation();
   const [schools, setSchools] = useState([])

   const handleCloseBts = () => {
      setFirst(false);
      setIsHiddenNavigationBar(false);
   };

   useEffect(() => {
      fetchDetailUser().then(data => {
         setSchools(data.schools);
      }).catch(err => {
         console.log(err);
      });

   }, [userData])

   const handleCreateClass = async () => {
      if (!selectedSchool || !selectedSubject || !className) {
         Toast.show({
            type: 'warn',
            text1: `${i18n.t('play.single.errorTitle')}`,
            text2: `Nhập đầy đủ!`,
            visibilityTime: 1000,
            autoHide: true,
         });
         return;
      }

      const classData = {
         class_name: className,
         user_id: userData._id,
         school_id: selectedSchool,
         subject_id: selectedSubject,
      };

      await createClassroom(classData);
      await fetchClassrooms();
      handleCloseBts();
      setClassName('');
   };

   const handleNavigateToDetail = (classroomId) => {
      navigation.push('(classroom)/teacher_detail', { classroomId });
   };

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

   return (
      <View className='flex-1 bg-white pb-20'>
         {/* Bộ tìm kiếm */}
         <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={i18n.t('classroom.teacher.titleSearchQuery')}
            className='border border-slate-500 rounded-xl py-2 px-5 mx-5 mt-4'
         />

         {/* Thêm lớp mới */}
         <Button
            onPress={() => { setFirst(true); setIsHiddenNavigationBar(true); }}
            otherStyles='mx-auto my-5 bg-[#fab1a0]'
            textStyles='text-base text-black'
            text={i18n.t('classroom.teacher.btnAddClass')}
            icon={<Icon className='text-lg' name='add-circle-outline' size={18} />}
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
            <Lottie
               source={require('@/assets/jsons/empty.json')}
               width={250}
               height={250}
               text={i18n.t('classroom.teacher.emptyClassroom')}
            />
         )}


         {/* BottomSheet */}
         <Overlay onPress={handleCloseBts} visible={first} />
         <BottomSheet onClose={handleCloseBts} visible={first}>
            <View className='items-center'>
               <Text className='text-lg font-semibold'>{i18n.t('classroom.teacher.titleBts')}</Text>

               <View className='pt-5 w-full'>
                  <Text className='pb-2 text-base text-slate-700 font-semibold'>{i18n.t('classroom.teacher.fieldSchool')}</Text>
                  <SelectList
                     setSelected={setSelectedSchool}
                     data={schools.map(school => ({ key: school._id, value: school.school_name }))}
                     placeholder={i18n.t('classroom.teacher.placeholderFieldSchool')}
                  />
               </View>

               <View className='pt-5 w-full'>
                  <Text className='pb-2 text-base text-slate-700 font-semibold'>{i18n.t('classroom.teacher.fieldSubject')}</Text>
                  <SelectList
                     setSelected={setSelectedSubject}
                     data={subjects.map(subject => ({ key: subject._id, value: i18n.t(`subjects.${subject.name}`) }))}
                     placeholder={i18n.t('classroom.teacher.placeholderFieldSubject')}
                  />
               </View>

               <View className='pt-5 w-full'>
                  <Text className='pb-2 text-base text-slate-700 font-semibold'>{i18n.t('classroom.teacher.fieldClassroom')}</Text>
                  <TextInput
                     value={className}
                     onChangeText={setClassName}
                     placeholder={i18n.t('classroom.teacher.placeholderFieldClassroom')}
                     className='border border-slate-500 rounded-xl py-2 px-5'
                  />
               </View>

               <View className='pt-8 flex-row justify-end w-full px-4'>
                  <Button
                     otherStyles='mr-3 bg-transparent px-4'
                     textStyles='text-black text-base'
                     text={i18n.t('classroom.teacher.btnCancel')}
                     onPress={handleCloseBts}
                  />
                  <Button
                     otherStyles='ml-3 bg-violet-500 px-4'
                     textStyles='text-base'
                     text={i18n.t('classroom.teacher.btnSave')}
                     onPress={handleCreateClass}
                  />
               </View>
            </View>
         </BottomSheet>
      </View >
   );
};

export default TeacherView;

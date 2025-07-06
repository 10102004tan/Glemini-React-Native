import {
  View,
  Text,
  TextInput,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Button from '@/components/customs/Button';
import BottomSheet from '@/components/customs/BottomSheet';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAppProvider } from '@/contexts/AppProvider';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import { useSubjectProvider } from '@/contexts/SubjectProvider';
import { SelectList } from 'react-native-dropdown-select-list';
import Toast from 'react-native-toast-message-custom';
import ClassroomCard from '@/components/customs/ClassroomCard';
import Lottie from '@/components/loadings/Lottie';
import SkeletonClassroomCard from '@/components/loadings/SkeletonClassroomCard';
import { useAuthStore } from '@/store/useAuthStore';
import MainLayout from '@/components/layouts/MainLayout';
import ScaleTouchable from '@/components/customs/ScaleTouchable';
import { useNavigation } from '@react-navigation/native';
import AnimatedModal from '@/components/customs/AnimatedModal';

const TeacherView = () => {
  const { fetchDetailUser } = useAuthContext();
  const { user } = useAuthStore();
  const [first, setFirst] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [className, setClassName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { classrooms, createClassroom, fetchClassrooms } = useClassroomProvider();
  const { subjects } = useSubjectProvider();
  const { i18n } = useAppProvider();
  const navigation = useNavigation();
  const [schools, setSchools] = useState([]);

  const handleCloseBts = () => {
    setFirst(false);
  };

  useEffect(() => {
    fetchDetailUser()
      .then((data) => {
        setSchools(data.schools);
      })
      .catch((err) => {
        console.log('Error fetching user details:', err);
      });
  }, [fetchDetailUser]);

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
      user_id: user.user_id,
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
    const loadData = async () => {
      setIsLoading(true);
      await fetchClassrooms();
      setIsLoading(false);
    };

    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClassrooms();
    setRefreshing(false);
  };

  const filteredClassrooms = classrooms.filter((classroom) =>
    classroom.class_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16, backgroundColor: '#fff', paddingTop: 40 }}>
        <View>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={i18n.t('classroom.teacher.titleSearchQuery')}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 10,
              padding: 12,
              backgroundColor: '#f8f8f8',
              color: '#333',
              fontSize: 16,
              borderBottomWidth: 3,
              borderBottomColor: '#6c63ff',
            }}
          />
        </View>

        {/* FlatList - Flexible middle */}
        <View style={{ flex: 1, marginTop: 10 }}>
          {/* Skeleton list */}
          {(isLoading || refreshing) && (
            <FlatList
              data={Array(5).fill(null)}
              renderItem={({ index }) => (
                <SkeletonClassroomCard key={index} />
              )}
              keyExtractor={(item, index) => `skeleton-${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          )}

          {/* Main classroom list */}
          {!isLoading && !refreshing && (
            <FlatList
              data={filteredClassrooms}
              renderItem={({ item }) => (
                <ScaleTouchable onPress={() => handleNavigateToDetail(item._id)}>
                  <ClassroomCard classroom={item} />
                </ScaleTouchable>
              )}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 16,
                flexGrow: 1,
                justifyContent:
                  filteredClassrooms.length === 0 ? 'center' : 'flex-start',
                alignItems:
                  filteredClassrooms.length === 0 ? 'center' : 'stretch',
              }}
              ListEmptyComponent={
                <Lottie
                  source={require('@/assets/jsons/empty.json')}
                  width={250}
                  height={250}
                  text={i18n.t('classroom.teacher.emptyClassroom')}
                />
              }
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>

        {/* Add Class Button - Fixed Bottom */}
        <View style={{ marginTop: 10 }}>
          <ScaleTouchable onPress={() => setFirst(true)}>
            <View
              style={{
                backgroundColor: '#F59E0B',
                paddingVertical: 12,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderBottomWidth: 4,
                borderColor: '#D97706',
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '800',
                  fontSize: 15,
                  textTransform: 'uppercase',
                }}
              >
                {i18n.t('classroom.teacher.btnAddClass')}
              </Text>
            </View>
          </ScaleTouchable>
        </View>
      </View>

      {/* BottomSheet */}
      {/* <BottomSheet
        onClose={handleCloseBts}
        visible={first}
        bottomSheetTitle={i18n.t('classroom.teacher.titleBts')}
      >
        <View className="items-center">
          <View className="pt-5 w-full">
            <Text className="pb-2 text-base text-slate-700 font-semibold">
              {i18n.t('classroom.teacher.fieldSchool')}
            </Text>
            <SelectList
              setSelected={setSelectedSchool}
              data={schools.map((school) => ({
                key: school._id,
                value: school.school_name,
              }))}
              placeholder={i18n.t('classroom.teacher.placeholderFieldSchool')}
            />
          </View>

          <View className="pt-5 w-full">
            <Text className="pb-2 text-base text-slate-700 font-semibold">
              {i18n.t('classroom.teacher.fieldSubject')}
            </Text>
            <SelectList
              setSelected={setSelectedSubject}
              data={subjects.map((subject) => ({
                key: subject._id,
                value: i18n.t(`subjects.${subject.name}`),
              }))}
              placeholder={i18n.t('classroom.teacher.placeholderFieldSubject')}
            />
          </View>

          <View className="pt-5 w-full">
            <Text className="pb-2 text-base text-slate-700 font-semibold">
              {i18n.t('classroom.teacher.fieldClassroom')}
            </Text>
            <TextInput
              value={className}
              onChangeText={setClassName}
              placeholder={i18n.t('classroom.teacher.placeholderFieldClassroom')}
              className="border border-slate-500 rounded-xl py-2 px-5"
            />
          </View>

          <View className="pt-8 flex-row justify-end w-full px-4">
            <Button
              otherStyles="mr-3 bg-transparent px-4"
              textStyles="text-black text-base"
              text={i18n.t('classroom.teacher.btnCancel')}
              onPress={handleCloseBts}
            />
            <Button
              otherStyles="ml-3 bg-violet-500 px-4"
              textStyles="text-base"
              text={i18n.t('classroom.teacher.btnSave')}
              onPress={handleCreateClass}
            />
          </View>
        </View>
      </BottomSheet> */}
      <AnimatedModal
        visible={first}
        onClose={() => setFirst(false)}
        onSave={handleCreateClass}
        className={className}
        setClassName={setClassName}
        selectedSchool={selectedSchool}
        setSelectedSchool={setSelectedSchool}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        schools={schools}
        subjects={subjects}
        i18n={i18n}
      />

    </View>
  );
};

export default TeacherView;

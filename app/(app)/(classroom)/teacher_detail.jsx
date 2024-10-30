import { View, Text, FlatList, Image, Modal, Pressable, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useRoute } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Overlay from '@/components/customs/Overlay';
import BottomSheet from '@/components/customs/BottomSheet';
import { useAppProvider } from '@/contexts/AppProvider';
import Button from '@/components/customs/Button';
import { router, useFocusEffect } from 'expo-router';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import Toast from 'react-native-toast-message-custom';

const TeacherDetail = () => {
    const route = useRoute();
    const { classroomId } = route.params;
    const [showBottomSheet, setShowBottomSheet] = useState(0); 
    const [modalVisible, setModalVisible] = useState(false);
    const [studentToRemove, setStudentToRemove] = useState(null);
    const { setIsHiddenNavigationBar, i18n } = useAppProvider();
    const { classroom, fetchClassroom, removeStudent, addStudent } = useClassroomProvider();
    const [email, setEmail] = useState('');

    useFocusEffect(
        useCallback(() => {
            fetchClassroom(classroomId);
        }, [classroomId])
    );

    const handleCloseBottomSheet = () => {
        setShowBottomSheet(0);
        setIsHiddenNavigationBar(false);
    };

    const confirmDeleteStudent = (studentId) => {
        setStudentToRemove(studentId);
        setModalVisible(true);
    };

    const handleDeleteStudent = async () => {
        if (studentToRemove) {
            await removeStudent(classroomId, studentToRemove);
            fetchClassroom(classroomId);
            Toast.show({
                type: 'success',
                text1: 'Xóa thành công!' 
            });
        }
        setModalVisible(false);
    };

    const handleAddStudent = async () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailPattern.test(email)) {
            setEmail('');
            Toast.show({
                type: 'warn',
                text1: `${i18n.t('play.single.errorTitle')}`,
                text2: email ? `"${email}" không hợp lệ. 🤨` : `Vui lòng nhập Email 🤨`,
            });
            return;
        }
        try {
            await addStudent(classroomId, email);
            setEmail('');
            setShowBottomSheet(0);
            Toast.show({
                type: 'success',
                text1: 'Thêm mới thành công!' 
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error adding student',
                text2: error.message,
            });
        }
    };

    // Tab routes
    const renderQuizzes = () => (
        <View className='p-5'>
            {classroom.quizzes?.length > 0 ? (
                <FlatList
                    data={classroom.quizzes}
                    keyExtractor={(quiz) => quiz._id}
                    renderItem={({ item }) => (
                        <View className='py-2'>
                            <Text>{item.name}</Text>
                        </View>
                    )}
                />
            ) : (
                <Text className='text-center text-gray-500'>No quizzes available</Text>
            )}
        </View>
    );

    const renderStudents = () => (
        <View className='p-5'>
            {classroom.students?.length > 0 ? (
                <FlatList
                    data={classroom.students}
                    keyExtractor={(student) => student._id}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => console.log(item._id)}>
                            <View className='bg-slate-100 px-4 py-2 mb-2 rounded-md'>
                                <View className='flex-row items-center justify-between'>
                                    <View className='flex-row items-center gap-3'>
                                        <Image source={{ uri: item.user_avatar }} className='w-10 h-10 rounded-full' />
                                        <View>
                                            <Text className='text-base font-semibold'>{item.user_fullname}</Text>
                                            <Text className='text-xs'>{item.user_email}</Text>
                                        </View>
                                    </View>
                                    <Pressable onPress={() => confirmDeleteStudent(item._id)}>
                                        <AntDesign name='delete' size={20} />
                                    </Pressable>
                                </View>
                            </View>
                        </Pressable>
                    )}
                />
            ) : (
                <Text className='text-center text-gray-500'>No students enrolled</Text>
            )}
        </View>
    );

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'quizzes', title: 'Danhh sách câu hỏi' },
        { key: 'students', title: 'Danh sách học sinh' },
    ]);

    const renderScene = SceneMap({
        quizzes: renderQuizzes,
        students: renderStudents,
    });

    return (
        <View className='flex-1 bg-white'>
            <View className='w-full h-44 bg-red-800 flex justify-center items-center'>
                <Text className='text-2xl text-white'>{classroom.class_name} - {classroom.subject?.name}</Text>
                <TouchableOpacity className='bg-white/70 rounded-full p-2 absolute bottom-5 right-5' onPress={() => { setShowBottomSheet(1); setIsHiddenNavigationBar(true); }}>
                    <AntDesign name='adduser' size={25} />
                </TouchableOpacity>
            </View>
            
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: 'green' }}
                        style={{ backgroundColor: 'white' }}
                        labelStyle={{ color: 'black' }}
                    />
                )}
            />

             {/* Overlay and BottomSheets */}
             <Overlay onPress={handleCloseBottomSheet} visible={showBottomSheet !== 0} />
            
            {/* BottomSheet 1 */}
            <BottomSheet onClose={handleCloseBottomSheet} visible={showBottomSheet === 1}>
                <View className='items-center'>
                    <Text className='text-lg font-semibold'>{i18n.t('classroom.teacher.titleBtsAddStudent')}</Text>
                    <Button
                        otherStyles='bg-green-500 px-5 mt-5'
                        textStyles='text-base font-semibold'
                        text={'Excel'}
                        onPress={() => {
                            router.push({
                                pathname: '/(classroom)/upload_excel',
                                params: { classroomId: classroom._id },
                            });
                        }}
                    />
                    <View className='h-[1px] bg-green-100 rounded-full w-40 my-4' />
                    <Button
                        otherStyles='bg-blue-500 px-4'
                        textStyles='text-base font-semibold'
                        text={i18n.t('classroom.teacher.btnSave')}
                        onPress={() => setShowBottomSheet(2)} 
                    />
                </View>
            </BottomSheet>

            {/* BottomSheet 2 */}
            <BottomSheet onClose={handleCloseBottomSheet} visible={showBottomSheet === 2}>
                <View className='items-center'>
                    <Text className='text-lg font-semibold'>Thông tin học sinh mới</Text>

                    <View className='pt-5 w-full'>
                    <Text className='pb-2 mt-3 text-base text-slate-700 font-semibold'>Địa chỉ liên lạc (email) </Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder='Nhập địa chỉ email'
                            className='border border-slate-500 rounded-xl py-2 px-5'
                        />

                    </View>

                    <View className='pt-8 flex-row justify-end w-full px-4'>
                        <Button
                            otherStyles='mr-3 bg-transparent px-4'
                            textStyles='text-black text-base'
                            text={i18n.t('classroom.teacher.btnCancel')}
                            onPress={handleCloseBottomSheet}
                        />
                        <Button
                            otherStyles='ml-3 bg-violet-500 px-4'
                            textStyles='text-base'
                            text={i18n.t('classroom.teacher.btnSave')}
                            onPress={()=>{handleAddStudent()}}/>
                    </View>
                </View>
            </BottomSheet>

            {/* Confirmation Modal for Student Deletion */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className='flex-1 justify-center items-center bg-black/50'>
                    <View className='bg-white p-5 rounded-lg w-3/4'>
                        <Text className='text-lg font-semibold mb-3'>Xác nhận xóa học sinh</Text>
                        <Text>Bạn có chắc chắn muốn xóa học sinh này khỏi lớp học không?</Text>
                        <View className='flex-row justify-between mt-4'>
                            <Pressable onPress={() => setModalVisible(false)}>
                                <Text className='text-red-500 bg-red-500/30 rounded-lg font-semibold px-3 py-2'>Hủy</Text>
                            </Pressable>
                            <Pressable onPress={handleDeleteStudent}>
                                <Text className='text-blue-500 bg-blue-500/30 rounded-lg font-semibold px-3 py-2'>Xóa</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default TeacherDetail;

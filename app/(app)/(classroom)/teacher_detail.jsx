import { View, Text, FlatList, ScrollView, Pressable, TouchableOpacity, Image, Modal } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Overlay from '@/components/customs/Overlay';
import BottomSheet from '@/components/customs/BottomSheet';
import { useAppProvider } from '@/contexts/AppProvider';
import Button from '@/components/customs/Button';
import { router, useFocusEffect } from 'expo-router';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import { EvilIcons } from '@expo/vector-icons';

const TeacherDetail = () => {
    const route = useRoute();
    const { classroomId } = route.params;
    const [first, setFirst] = useState(false);
    const [showQuizzes, setShowQuizzes] = useState(false);
    const [showStudents, setShowStudents] = useState(false);
    const [modalVisible, setModalVisible] = useState(false); // State for the confirmation modal
    const [studentToRemove, setStudentToRemove] = useState(null);
    const { setIsHiddenNavigationBar, i18n } = useAppProvider();
    const { classroom, fetchClassroom, removeStudent } = useClassroomProvider();

    useFocusEffect(
        useCallback(() => {
            fetchClassroom(classroomId);
        }, [classroomId])
    );

    const handleCloseBts = () => {
        setFirst(false);
        setIsHiddenNavigationBar(false);
    };

    const handleOpenQuizzes = () => setShowQuizzes(true);
    const handleOpenStudents = () => setShowStudents(true);

    const handleCloseModal = () => {
        setShowQuizzes(false);
        setShowStudents(false);
    };

    const confirmDeleteStudent = (studentId) => {
        setStudentToRemove(studentId);
        setModalVisible(true); // Show confirmation modal
    };

    const handleDeleteStudent = async () => {
        if (studentToRemove) {
            await removeStudent(classroomId, studentToRemove);
            fetchClassroom(classroomId); // Refresh classroom data
        }
        setModalVisible(false); // Close the modal after deletion
    };

    return (
        <View className='flex-1 bg-white'>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className='w-full h-44 bg-red-800 flex justify-center items-center'>
                    <Text className='text-2xl font-pmedium text-slate-100'>{classroom.class_name} - {classroom.subject?.name} - {classroom.school?.school_code}</Text>
                    <TouchableOpacity className='bg-slate-50/50 rounded-full p-2 absolute bottom-5 right-5' onPress={() => { setFirst(true); setIsHiddenNavigationBar(true); }}>
                        <AntDesign name='adduser' className='text-white' size={25} />
                    </TouchableOpacity>
                </View>

                {/* Box for quizzes and students list */}
                <View className='w-full flex flex-row justify-evenly p-3 mt-4'>
                    <Button
                        text="Quizzes"
                        onPress={handleOpenQuizzes}
                        otherStyles='bg-purple-500 px-5'
                        textStyles='text-base font-semibold'
                    />
                    <Button
                        text="Students List"
                        onPress={handleOpenStudents}
                        otherStyles='bg-green-500 px-5'
                        textStyles='text-base font-semibold'
                    />
                </View>
            </ScrollView>

            {/* Quiz Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showQuizzes}
                onRequestClose={handleCloseModal}
            >
                <View className='flex-1 justify-center items-center bg-black/50'>
                    <View className='bg-white w-11/12 p-5 rounded-lg'>
                        <Pressable onPress={handleCloseModal} className='p-2 bg-slate-300/70 rounded-full absolute top-5 right-5 z-10'>
                            <AntDesign name='close' size={20} />
                        </Pressable>
                        <Text className='text-xl font-semibold mb-4'>Danh sách bộ kiểm tra</Text>
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
                </View>
            </Modal>

            {/* Student List Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showStudents}
                onRequestClose={handleCloseModal}
            >
                <View className='flex-1 justify-center items-center bg-black/50'>
                    <View className='bg-white w-11/12 p-5 rounded-lg'>
                        <Pressable onPress={handleCloseModal} className='p-2 bg-slate-300/70 rounded-full absolute top-5 right-5 z-10'>
                            <AntDesign name='close' size={20} />
                        </Pressable>
                        <Text className='text-xl font-semibold mb-4'>Danh sách tham gia</Text>
                        {classroom.students?.length > 0 ? (
                            <FlatList
                                className='mt-5'
                                data={classroom.students}
                                keyExtractor={(student) => student._id}
                                renderItem={({ item }) => (
                                    <Pressable onPress={() => console.log(item._id)}>
                                        <View className='bg-slate-100 px-4 py-2 mb-2 rounded-md' style={{ elevation: 3 }}>
                                            <View className='flex-row flex items-center justify-between'>
                                                <View className='flex-row items-center gap-3'>
                                                    <Image source={{ uri: item.user_avatar }}
                                                        className='w-10 h-10 rounded-full'
                                                        style={{ resizeMode: 'cover' }} />
                                                    <View>
                                                        <Text className='text-base font-pmedium'>{item.user_fullname}</Text>
                                                        <Text className='text-xs'>{item.user_email}</Text>
                                                    </View>
                                                </View>
                                                <Pressable onPress={() => confirmDeleteStudent(item._id)}>
                                                    <EvilIcons name='trash' size={30} />
                                                </Pressable>
                                            </View>
                                            <View className='w-full h-[1px] bg-black/30 mt-3'></View>
                                        </View>
                                    </Pressable>
                                )}
                            />
                        ) : (
                            <Text className='text-center text-gray-500'>No students enrolled</Text>
                        )}
                    </View>
                </View>
            </Modal>

            <Overlay onPress={handleCloseBts} visible={first} />
            <BottomSheet onClose={handleCloseBts} visible={first}>
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
                    <View className='h-[2px] bg-green-100 rounded-full w-40 my-4' />
                    <Button
                        otherStyles='bg-blue-500 px-4'
                        textStyles='text-base font-semibold'
                        text={i18n.t('classroom.teacher.btnSave')}
                    />
                </View>
            </BottomSheet>

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
                                <Text className='text-red-500 font-semibold'>Hủy</Text>
                            </Pressable>
                            <Pressable onPress={handleDeleteStudent}>
                                <Text className='text-blue-500 font-semibold'>Xóa</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default TeacherDetail;

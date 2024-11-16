import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import React from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import Toast from 'react-native-toast-message-custom';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';

const ClassroomCard = ({ classroom }) => {
    const { userData } = useAuthContext()
    const { removeClassroom } = useClassroomProvider()
    return (
        <View
            className={`flex-row justify-between items-center p-5 mx-5 my-2 bg-white rounded-lg border-orange-600 border-l-[6px]`}
            style={{ elevation: 3 }}
        >
            <View>
                <Text className='font-pbold text-lg'>{`${classroom.class_name}`}</Text>
                <Text className='font-semibold text-base'> {userData.user_type === 'teacher' ? `${classroom.school?.school_name}` : `Giáo viên: ${classroom.user_id.user_fullname}`}</Text>
                <Text className='font-pregular'>{`${classroom.students?.length} học sinh`}</Text>
            </View>
            {userData.user_type === 'teacher' &&
                <TouchableOpacity className='bg-slate-50 rounded-full p-2' onPress={() => {
                    Alert.alert(
                        "Tiếp tục thực hiện?",
                        "Bạn có muốn xóa lớp học này?",
                        [
                            { text: "Hủy", style: "cancel" },
                            {
                                text: "Tiếp tục", onPress: () => {
                                    removeClassroom(classroom._id)
                                }
                            },
                        ]
                    );
                }}>
                    <Entypo name='dots-three-horizontal' className='text-slate-400' size={20} />
                </TouchableOpacity>
            }
        </View>
    );
};

export default ClassroomCard;

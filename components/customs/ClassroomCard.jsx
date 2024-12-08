import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import React from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import Toast from 'react-native-toast-message-custom';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import { useAppProvider } from '@/contexts/AppProvider';

const ClassroomCard = ({ classroom }) => {
    const { userData } = useAuthContext()
    const {i18n} = useAppProvider()
    const { removeClassroom } = useClassroomProvider()
    
    return (
        <View
            className={`flex-row items-center p-5 mx-5 my-2 bg-white rounded-lg border-orange-600 border-l-[6px]`}
            style={{ elevation: 3 }}
        >
            <View className='w-11/12'>
                <Text className='font-pbold text-lg'>{`${classroom.class_name}`}</Text>
                <Text className='font-semibold text-base'> {userData.user_type === 'teacher' ? `${i18n.t('classroom.textSubject')} ${i18n.t(`subjects.${classroom.subject.name}`)}` : `${i18n.t('classroom.textTeacher')} ${classroom.user_id.user_fullname}`}</Text>
                <Text className='font-semibold text-base'> {classroom.school?.school_name || 'No data'}</Text>
                <Text className='font-pregular'>{`${classroom.students?.length} ${i18n.t('classroom.textStudent')}`}</Text>
            </View>
            {userData.user_type === 'teacher' &&
                <TouchableOpacity className='bg-slate-50 rounded-full p-2' onPress={() => {
                    Alert.alert(
                        i18n.t('classroom.teacher.titleQuestionContinuteQUiz'),
                        i18n.t('classroom.teacher.textQuestionContinuteQuiz'),
                        [
                            { text: i18n.t('classroom.teacher.btnCancel'), style: "cancel" },
                            {
                                text: i18n.t('classroom.teacher.btnContinute'), onPress: () => {
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

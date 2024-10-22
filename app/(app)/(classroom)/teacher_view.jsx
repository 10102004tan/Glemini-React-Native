import { View, Text } from 'react-native';
import React, { useState } from 'react';
import Button from '@/components/customs/Button';
import Icon from 'react-native-vector-icons/Ionicons'
import BottomSheet from '@/components/customs/BottomSheet';
import { useAppProvider } from '@/contexts/AppProvider';
import Overlay from '@/components/customs/Overlay';
import Field from '@/components/customs/Field';
const TeacherView = () => {
    const [first, setfirst] = useState(false)
    const { setIsHiddenNavigationBar, i18n } = useAppProvider()
    const handelCloseBts = () => {
        setfirst(false)
        setIsHiddenNavigationBar(false)
    }

    return (
        <View className='flex-1'>
            {/* Main */}
            <Button
                onPress={() => { setfirst(true); setIsHiddenNavigationBar(true) }}
                otherStyles='mx-auto mt-5 bg-[#bdc3c7]'
                textStyles='text-base text-black'
                text={i18n.t('classroom.teacher.btnAddClass')}
                icon={<Icon className='text-lg' name='add-circle-outline' />} />





            {/* BottomSheet */}
            <Overlay onPress={handelCloseBts} visible={first} />
            <BottomSheet onClose={handelCloseBts} visible={first}>
                <View className='items-center'>
                    <Text className='text-lg'>{i18n.t('classroom.teacher.titleBts')}</Text>

                    <View className='pt-5'>
                        <Text className='pb-2 text-base text-slate-700 font-psemibold'>{i18n.t('classroom.teacher.fieldSchool')}</Text>
                        <Field placeholder={i18n.t('classroom.teacher.placeholderFieldSchool')}/>
                    </View>

                    <View className='pt-5'>
                        <Text className='pb-2 text-base text-slate-700 font-psemibold'>{i18n.t('classroom.teacher.fieldClassroom')}</Text>
                        <Field placeholder={i18n.t('classroom.teacher.placeholderFieldClassroom')}/>
                    </View>

                    <View className='pt-8 flex-row justify-end w-full '>
                        <Button otherStyles='mr-3 bg-transparent px-4' textStyles='text-black text-base' text={i18n.t('classroom.teacher.btnCancel')}/>
                        <Button otherStyles='ml-3 bg-violet-500 px-4' textStyles='text-base' text={i18n.t('classroom.teacher.btnSave')}/>
                    </View>

                </View>
            </BottomSheet>
        </View>
    );
};

export default TeacherView;

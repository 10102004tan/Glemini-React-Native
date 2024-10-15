import React from 'react';
import { View, Text, Modal, Image } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from '../customs/Button';
import { useAuthContext } from '@/contexts/AuthContext';
import { truncateDescription } from '@/utils'
import { useAppProvider } from '@/contexts/AppProvider';
const QuizModal = ({ visible, onClose, onStartQuiz, quiz }) => {
    const { userData } = useAuthContext()  
    const { i18n } = useAppProvider()
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className='flex-1 justify-center items-center bg-black/50 '>
                <View className='w-11/12 bg-white rounded-2xl overflow-hidden'>
                    <Image
                        source={{
                            uri: 'https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-1/456537396_794061249555708_1663471177791048027_n.jpg?stp=dst-jpg_s200x200&_nc_cat=101&ccb=1-7&_nc_sid=50d2ac&_nc_eui2=AeFsVKryqdDFHD9LyKwncdC1HTmCAzypGDgdOYIDPKkYOI3clzOxlMLTwLW5KtwEY70jyPrCI5YMekhp1w_ex4Jg&_nc_ohc=eyXn5PYjLdcQ7kNvgFdsotm&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=A4COVmBRgOZfuOKFOuZclAs&oh=00_AYA8zKzNfJe9vsPnpwW-eW6zhp_h2K_2lbzlpiaIImOUhw&oe=66FF40CD',
                        }}
                        className="w-full h-56"
                        style={{ resizeMode: 'cover' }}
                    />
                    <View className='items-end flex absolute right-3 top-3'>
                        <Button
                            text={<Icon name='close' size={20} />}
                            onPress={onClose}
                            loading={false}
                            type="fill"
                            otherStyles={'bg-slate-300/70 rounded-full'}
                            textStyles={'text-sm text-black'}
                        />
                    </View>
                    <View className='py-2'>
                        <View className='px-4'>
                            <Text className='text-xl font-bold'>{quiz?.quiz_name}</Text>
                            <Text className='text-sm font-medium'><Text>{i18n.t('student_homepage.author')}</Text> {quiz?.user_id.user_fullname}</Text>
                            <View className='flex-col mt-3 text-base'>
                            <Text className='text-slate-600 font-medium underline'>{i18n.t('student_homepage.desc')}</Text>
                            <Text >{quiz?.quiz_description ? truncateDescription(quiz?.quiz_description, 30) : i18n.t('student_homepage.textDesc')}</Text>
                            </View>
                        </View>
                        <View className='flex flex-row p-2 w-full justify-around'>
                            {userData.user_type === 'teacher' ?  <Button text="Thử thách bạn"
                                loading={false}
                                type="fill"
                                otherStyles={'bg-green-300 rounded-lg'}
                                textStyles={'text-base text-black'} onPress={() => {
                                    console.log('Thử thách với bạn');
                                }} /> : <>
                                <Button text={i18n.t('student_homepage.btnThuThach')}
                                loading={false}
                                type="fill"
                                otherStyles={'bg-green-500 rounded-lg'}
                                textStyles={'text-base text-black'} onPress={() => {
                                    console.log('Thử thách với bạn');
                                }} />
                            <Button text={i18n.t('student_homepage.btnLuyenTap')}
                                loading={false}
                                type="fill"
                                otherStyles={'bg-pink-500 rounded-lg'}
                                textStyles={'text-base text-black'} onPress={onStartQuiz} />
                            </>}
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default QuizModal;

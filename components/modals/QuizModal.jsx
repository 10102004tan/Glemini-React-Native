import React from 'react';
import { View, Text, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from '../customs/Button';

const QuizModal = ({ visible, onClose, onStartQuiz, quiz }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className='flex-1 justify-center items-center bg-black/50'>
                <View className='w-11/12 bg-white rounded-2xl p-4'>
                    <View className='items-end flex'>
                        <Button
                            text={<Icon name='close' size={20} />}
                            onPress={onClose}
                            loading={false}
                            type="fill"
                            otherStyles={'bg-slate-300/70 rounded-full'}
                            textStyles={'text-sm text-black'}
                        />
                    </View>
                    <View className='mt-2'>
                        <View>
                            <Text className='text-lg font-bold'>{quiz?.quiz_name}</Text>
                            <Text className='mt-3'>{quiz?.quiz_description}</Text>
                        </View>
                        <View className='gap-2 flex flex-row p-2 items-baseline'>
                            <Button text="Thử thách bạn"
                                loading={false}
                                type="fill"
                                otherStyles={'bg-green-300 rounded-lg'}
                                textStyles={'text-sm text-black'} onPress={() => {
                                    console.log('Thử thách với bạn');
                                }} />
                            <Button text="Luyện tập"
                                loading={false}
                                type="fill"
                                otherStyles={'bg-pink-300 rounded-lg'}
                                textStyles={'text-sm text-black'} onPress={onStartQuiz} />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default QuizModal;

import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Wrapper from '../../components/customs/Wrapper';
import Field from '../../components/customs/Field';
import Button from '../../components/customs/Button';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
const CreateTitleQuizzScreen = () => {
	const handleCreateQuizTitle = () => {
		router.push('quiz/overview');
	};

	return (
		<Wrapper>
			<View className="p-4">
				<TouchableOpacity>
					<Ionicons name="arrow-back" size={24} color="black" />
				</TouchableOpacity>
			</View>
			<View className="flex-1 items-center justify-center p-4">
				<Text className="text-2xl">
					Hãy đặt tên cho bộ Quiz của bạn
				</Text>
				<Field
					placeholder={'Nhập tên bài kiểm tra'}
					wrapperStyles="w-full"
					inputStyles="p-4"
				/>
			</View>
			<View className="p-4">
				<Button
					onPress={handleCreateQuizTitle}
					handleCreateQuizTitle
					text={'Bắt đầu tạo'}
					otherStyles={'p-4'}
					textStyles={'text-center'}
				/>
			</View>
		</Wrapper>
	);
};

export default CreateTitleQuizzScreen;

import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Wrapper from '../../../components/customs/Wrapper';
import Field from '../../../components/customs/Field';
import Button from '../../../components/customs/Button';
import { router } from 'expo-router';
import { useQuizProvider } from '../../../contexts/QuizProvider';
import { useAuthContext } from '@/contexts/AuthContext';
import { API_URL, END_POINTS, API_VERSION } from '@/configs/api.config';
const CreateTitleQuizzScreen = () => {
	const { userData } = useAuthContext();
	const [quizName, setQuizName] = useState('');
	const { setNeedUpdate } = useQuizProvider();
	const { actionQuizType } = useQuizProvider();
	const handleCreateQuizTitle = async () => {
		// Xử lý tạo quiz rỗng
		if (userData) {
			const response = await fetch(
				`${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_CREATE}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'x-client-id': userData._id,
						authorization: userData.accessToken,
					},
					body: JSON.stringify({
						user_id: userData._id,
						quiz_name: quizName,
					}),
				}
			);
			const data = await response.json();

			if (data.statusCode === 200) {
				setNeedUpdate(true);
				if (actionQuizType === 'create') {
					router.replace({
						pathname: '/(app)/(quiz)/overview/',
						params: { id: data.metadata._id },
					});
				} else {
					router.replace({
						pathname: '/(app)/(quiz)/demo_create_quiz_by_template',
						params: { id: data.metadata._id },
					});
				}
			} else {
				// Alert to user here
				console.log('Error when create quiz');
			}
		} else {
			console.log('User not found');
		}
	};

	return (
		<Wrapper>
			<View className="flex-1 items-center justify-center p-4">
				<Text className="text-2xl mb-4">
					Hãy đặt tên cho bộ câu hỏi của bạn
				</Text>
				<Field
					value={quizName}
					onChange={(text) => setQuizName(text)}
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
					otherStyles={'p-4 justify-center'}
					textStyles={'text-center'}
				/>
			</View>
		</Wrapper>
	);
};

export default CreateTitleQuizzScreen;

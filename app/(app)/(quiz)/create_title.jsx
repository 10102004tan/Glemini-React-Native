import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Wrapper from '../../../components/customs/Wrapper';
import Field from '../../../components/customs/Field';
import Button from '../../../components/customs/Button';
import { router } from 'expo-router';
import { useQuizProvider } from '../../../contexts/QuizProvider';
import { useAuthContext } from '@/contexts/AuthContext';
import { API_URL, END_POINTS, API_VERSION } from '@/configs/api.config';
import { useQuestionProvider } from '@/contexts/QuestionProvider';
const CreateTitleQuizzScreen = () => {
	const { userData } = useAuthContext();
	const [quizName, setQuizName] = useState('');
	const { setNeedUpdate } = useQuizProvider();
	const { actionQuizType } = useQuizProvider();
	const [prompt, setPrompt] = useState('');
	const { generateQuestionsFromGemini } = useQuestionProvider();

	const handleGenerateQuestionFromGemini = async (quizId) => {
		alert('handleGenerateQuestionFromGemini');
		// Xử lý tạo quiz từ gemini
		const response = await fetch(
			`${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_GENERATE_GEMINI}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-client-id': userData._id,
					authorization: userData.accessToken,
				},
				body: JSON.stringify({ prompt: prompt }),
			}
		);

		const data = await response.json();
		if (data.statusCode === 200) {
			const questions = data.metadata;
			generateQuestionsFromGemini(questions, quizId);
		}
	};

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
				} else if (actionQuizType === 'template') {
					router.replace({
						pathname: '/(app)/(quiz)/demo_create_quiz_by_template',
						params: { id: data.metadata._id },
					});
				} else if (actionQuizType === 'ai/prompt') {
					handleGenerateQuestionFromGemini(data.metadata._id);
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
				<Field
					label={'Tên bài kiểm tra'}
					value={quizName}
					onChange={(text) => setQuizName(text)}
					placeholder={'Nhập tên bài kiểm tra'}
					wrapperStyles="w-full"
					inputStyles="p-4"
				/>

				{actionQuizType === 'ai/prompt' && (
					<Field
						label={'Promt'}
						value={prompt}
						onChange={(text) => setPrompt(text)}
						placeholder={
							'Nhập vào mô tả bài kiểm tra mà bạn muốn tạo'
						}
						wrapperStyles="w-full mt-4"
						inputStyles="p-4"
					/>
				)}
			</View>
			<View className="p-4">
				<Button
					onPress={handleCreateQuizTitle}
					text={'Bắt đầu tạo'}
					otherStyles={'p-4 justify-center'}
					textStyles={'text-center'}
				/>
			</View>
		</Wrapper>
	);
};

export default CreateTitleQuizzScreen;

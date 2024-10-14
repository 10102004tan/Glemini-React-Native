import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useQuizProvider } from '@/contexts/QuizProvider';
import { useRouter } from 'expo-router';
const QuestionOverview = ({ quizId, question, index }) => {
	const [showExpain, setShowExpain] = useState(false);
	const { width } = useWindowDimensions();
	const { setActionQuizType } = useQuizProvider();
	const router = useRouter();

	const renderAnswerIcon = (correct) => (
		<View className="mr-2">
			<AntDesign
				name={correct ? 'checkcircle' : 'closecircle'}
				size={18}
				color={correct ? '#4cd137' : '#F22626'}
			/>
		</View>
	);

	return (
		<View className="p-2 rounded-2xl border border-gray mb-2">
			<View className="flex w-full items-center justify-between flex-row">
				<View className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
					<Text className="text-white">{index + 1}</Text>
				</View>
				<Text className="flex-1 ml-2 text-[16px]">
					Loại câu hỏi:{' '}
					<Text className="uppercase text-gray">
						{' '}
						{question.question_type}
					</Text>
				</Text>
				<Text className="text-gray">
					{question.question_time} giây - {question.question_point}{' '}
					điểm
				</Text>
			</View>
			<View className="mt-2 overflow-hidden">
				<RenderHTML
					defaultTextProps={{
						style: {
							width: '100%',
							color: 'black',
							fontSize: 16,
							fontWeight: '500',
						},
					}}
					contentWidth={width}
					source={{ html: question.question_excerpt }}
				/>
			</View>
			<View className="mt-6">
				{question.question_answer_ids.map((answer, index) => {
					return (
						<View
							key={index}
							className="flex flex-row items-center justify-start"
						>
							{question.correct_answer_ids.length > 0
								? renderAnswerIcon(
										question.correct_answer_ids.some(
											(answer_correct) =>
												answer_correct._id ===
												answer._id
										)
									)
								: renderAnswerIcon(answer.correct)}
							<RenderHTML
								defaultTextProps={{
									style: {
										color: 'black',
										fontSize: 16,
									},
								}}
								contentWidth={width}
								source={{ html: answer.text }}
							/>
						</View>
					);
				})}
			</View>
			<View>
				<TouchableOpacity
					className="flex items-center justify-end flex-row"
					onPress={() => {
						setActionQuizType('edit');
						router.push({
							pathname: '/(quiz)/edit_quiz_question',
							params: {
								quizId: quizId,
								questionId: question._id,
							},
						});
					}}
				>
					<Text className="text-gray">Chỉnh sửa</Text>
				</TouchableOpacity>
				<TouchableOpacity
					className="flex items-center justify-end flex-row"
					onPress={() => setShowExpain(!showExpain)}
				>
					<Text className="text-gray">Xem giải thích</Text>
				</TouchableOpacity>
			</View>
			{showExpain && (
				<View className="overflow-hidden">
					<Text className="mb-2 font-semibold">Giải thích:</Text>
					<RenderHTML
						defaultViewProps={{}}
						defaultTextProps={{
							style: {
								width: '100%',
								color: 'black',
								fontSize: 14,
							},
						}}
						contentWidth={width}
						source={{
							html:
								question.question_explanation ||
								'Chưa có giải thích cho câu hỏi này',
						}}
					/>
				</View>
			)}
		</View>
	);
};

export default QuestionOverview;

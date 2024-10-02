import { View, Text } from 'react-native';
import React from 'react';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
const QuestionOverview = ({ question, index }) => {
	const { width } = useWindowDimensions();
	return (
		<View className="p-2 rounded-2xl border border-gray">
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
			<View className="mt-2">
				<RenderHTML
					defaultTextProps={{
						style: {
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
							{/* {question.correct_answer_ids.length > 0 &&
								question.correct_answer_ids.includes(
									answer.id
								) && (
									<View className="mr-2">
										<AntDesign
											name="checkcircle"
											size={18}
											color="#4cd137"
										/>
									</View>
								)} */}
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
		</View>
	);
};

export default QuestionOverview;

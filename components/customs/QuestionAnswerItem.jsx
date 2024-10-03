import { Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import React from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { View } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { useQuestionProvider } from '@/contexts/QuestionProvider';
const QuestionAnswerItem = ({ answer, color, onPress, isCorrect }) => {
	const { width } = useWindowDimensions();
	return (
		<TouchableOpacity
			onPress={() => {
				onPress();
			}}
			className="p-4 rounded-xl w-full mb-3 flex flex-row items-center justify-between"
			style={{ backgroundColor: color }}
		>
			<RenderHTML
				defaultViewProps={{}}
				defaultTextProps={{
					style: {
						color: 'white',
						fontSize: 14,
						fontWeight: '400',
					},
				}}
				contentWidth={width}
				source={{
					html: answer,
				}}
			/>

			{/* <Text className="text-white text-center">{answer}</Text> */}
			<View className="">
				{isCorrect && <Entypo name="check" size={20} color="white" />}
			</View>
		</TouchableOpacity>
	);
};

export default QuestionAnswerItem;

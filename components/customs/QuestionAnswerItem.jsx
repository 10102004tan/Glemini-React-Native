import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { View } from 'react-native';
const QuestionAnswerItem = ({ answer, color, onPress, isCorrect }) => {
	return (
		<TouchableOpacity
			onPress={() => {
				onPress();
			}}
			className="p-4 rounded-xl w-full mb-3 flex flex-row items-center justify-between"
			style={{ backgroundColor: color }}
		>
			<Text className="text-white text-center">{answer}</Text>
			<View className="">
				{isCorrect && <Entypo name="check" size={20} color="white" />}
			</View>
		</TouchableOpacity>
	);
};

export default QuestionAnswerItem;

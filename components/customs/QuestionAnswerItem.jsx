import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const QuestionAnswerItem = ({ answer, color }) => {
	return (
		<TouchableOpacity
			className="p-4 rounded-xl w-full mb-3"
			style={{ backgroundColor: color }}
		>
			<Text className="text-white text-center">{answer}</Text>
		</TouchableOpacity>
	);
};

export default QuestionAnswerItem;

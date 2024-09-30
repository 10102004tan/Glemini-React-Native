import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const QuizzCreateAction = ({ title, icon, otherStyles = '', onPress }) => {
	return (
		<TouchableOpacity
			onPress={() => {
				onPress();
			}}
			className={`p-4 bg-overlay rounded-xl flex items-center justify-center flex-col ${otherStyles}`}
		>
			<View className="mb-2">{icon && icon}</View>
			<Text>{title}</Text>
		</TouchableOpacity>
	);
};

export default QuizzCreateAction;
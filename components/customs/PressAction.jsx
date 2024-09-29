import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const PressAction = ({ icon, title, onPress }) => {
	return (
		<View className="flex items-center justify-center">
			<TouchableOpacity
				className="flex mb-2 items-center justify-center w-[60px] h-[60px] bg-white rounded-full"
				onPress={() => {
					onPress();
				}}
			>
				{icon}
			</TouchableOpacity>
			<Text className="text-white text-sm text-center">{title}</Text>
		</View>
	);
};

export default PressAction;

import { View, Text } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

const Button = ({
	text,
	onPress,
	otherStyles,
	textStyles,
	icon,
	disabled = false,
	type = 'fill',
	loading = false,
}) => {
	return (
		<TouchableOpacity
			onPress={() => {
				onPress();
			}}
			className={`p-2 rounded-xl bg-blue-500 ${otherStyles}`}
		>
			<Text className={`text-white ${textStyles} font-pregular`}>
				{text}
			</Text>
		</TouchableOpacity>
	);
};

export default Button;

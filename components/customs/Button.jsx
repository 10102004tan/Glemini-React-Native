import { View, Text } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useAppProvider } from '@/contexts/AppProvider';

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
	const { theme } = useAppProvider();
	return (
		<TouchableOpacity
			onPress={() => {
				onPress();
			}}
			className={`p-2 rounded-xl bg-primary flex-row flex items-center justify-start ${otherStyles}`}
		>

			
			{icon}
			<Text
				className={`ml-2 ${textStyles}`}
				style={{ color: theme.background }}
			>
				{text}
			</Text>
		</TouchableOpacity>
	);
};

export default Button;

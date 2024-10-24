import { View, Text } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useAppProvider } from '@/contexts/AppProvider';

const Button = ({
	text = '',
	onPress = () => {},
	otherStyles = '',
	textStyles = '',
	icon = null,
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
			className={`p-2 rounded-xl flex items-center justify-start flex-row bg-primary ${otherStyles}`}
		>
			{icon && <View className="mr-2">{icon}</View>}
			<Text className={`text-white ${textStyles}`}>{text}</Text>
		</TouchableOpacity>
	);
};

export default Button;

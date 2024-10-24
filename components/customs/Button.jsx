import { View, Text } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useAppProvider } from '@/contexts/AppProvider';
import SpinningIcon from '../loadings/SpinningIcon';

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
				if (!loading) {
					onPress();
				}
			}}
			className={`p-2 rounded-xl flex items-center justify-start flex-row bg-primary ${otherStyles}`}
		>
			{loading ? (
				<View className="mr-2">
					<SpinningIcon />
				</View>
			) : (
				icon && <View className="mr-2">{icon}</View>
			)}
			<Text className={`text-white ${textStyles}`}>{text}</Text>
		</TouchableOpacity>
	);
};

export default Button;

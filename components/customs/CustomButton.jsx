import { Text, TouchableOpacity, View } from 'react-native';
import LottieView from 'lottie-react-native';

export default function CustomButton({
	onPress = () => {},
	title,
	bg = 'bg-black',
	color = 'text-white',
	disabled = false,
	size=16,
	padding = 2,
	...props
}) {
	return (
		<TouchableOpacity disabled={disabled} onPress={onPress} {...props}>
			<View
				className={
					`py-${padding} rounded border justify-center items-center ` + bg
				}
			>
				{!disabled ? (
					<Text className={`text-center text-[${size}px] ` + color}>
						{title}
					</Text>
				) : (
					<LottieView
						loop={disabled}
						autoPlay={disabled}
						style={{
							width: 50,
							height: 40,
						}}
						source={require('@/assets/jsons/loading.json')}
					/>
				)}
			</View>
		</TouchableOpacity>
	);
}

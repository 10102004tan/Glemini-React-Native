import { Animated, Text, View } from 'react-native';
import Wrapper from '../../components/customs/Wrapper';
import Button from '../../components/customs/Button';
import { useRef, useState } from 'react';

export default function HomeScreen() {
	// Animation
	const moveAnim = useRef(new Animated.Value(0)).current;
	const [moveValue, setMoveValue] = useState(300);
	const startAnimation = () => {
		if (moveValue === 300) {
			setMoveValue(0);
		} else {
			setMoveValue(300);
		}

		Animated.timing(moveAnim, {
			toValue: moveValue,
			duration: 1000,
			useNativeDriver: true,
		}).start();
	};

	return (
		<Wrapper>
			<Animated.View
				style={{
					transform: [{ translateX: moveAnim }],
				}}
			>
				<Text className="text-white text-center text-2xl uppercase font-pregular">
					Welcome to the app
				</Text>
			</Animated.View>

			<Button
				onPress={startAnimation}
				text={'Click me'}
				otherStyles={'mt-4 p-4'}
				textStyles={'text-center'}
			/>
		</Wrapper>
	);
}

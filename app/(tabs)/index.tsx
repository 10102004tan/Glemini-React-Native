import { Animated, Text, View } from 'react-native';
import Wrapper from '../../components/customs/Wrapper';
import Button from '../../components/customs/Button';
import Field from '../../components/customs/Field';
import { useRef, useState } from 'react';
import { useAppProvider } from '@/contexts/AppProvider';

export default function HomeScreen() {
	const { theme } = useAppProvider();
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
				<Text
					style={{ color: theme.text }}
					className={`text-center text-2xl uppercase font-pregular`}
				>
					Welcome to the app
				</Text>
			</Animated.View>
			<Text
				style={{ color: theme.text }}
				className={`text-xl mt-2 text-center font-pregular`}
			>
				View Components
			</Text>

			<Button
				onPress={startAnimation}
				text={'Button'}
				otherStyles={'mt-4 p-4 bg-black'}
				textStyles={'text-center'}
			/>

			<Field
				wrapperStyles={'mt-4'}
				type={'text'}
				value={''}
				onChange={() => {}}
				label={'Label'}
				placeholder={'Placeholder'}
			/>
		</Wrapper>
	);
}

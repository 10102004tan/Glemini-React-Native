import { Animated, Text, View } from 'react-native';
import Wrapper from '../../components/customs/Wrapper';
import Button from '../../components/customs/Button';
import Field from '../../components/customs/Field';
import { useRef, useState } from 'react';
import { useAppProvider } from '@/contexts/AppProvider';
import { useUserProvider } from '@/contexts/UserProvider';
import { useRouter } from 'expo-router';
import RichTextEditor from '../../components/customs/RichTextEditor';

export default function HomeScreen() {
	const { theme } = useAppProvider();
	const { switchUserType, user } = useUserProvider();
	const router = useRouter();
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
					className={`text-center text-2xl uppercase`}
				>
					Welcome to the app
				</Text>
			</Animated.View>
			<Text
				style={{ color: theme.text }}
				className={`text-xl mt-2 text-center`}
			>
				View Components
			</Text>

			<Button
				onPress={startAnimation}
				text={'Button'}
				otherStyles={'mt-4 p-4 bg-black'}
				textStyles={'text-center'}
			/>

			<Button
				onPress={switchUserType}
				text={user.user_type}
				otherStyles={'mt-4 p-4'}
				textStyles={'text-center'}
			/>

			<Button
				onPress={() => {
					router.push('/quiz/create');
				}}
				text={'Create Quizz'}
				otherStyles={'mt-4 p-4'}
				textStyles={'text-center'}
			/>
			<Button
				onPress={() => {
					router.push('/quiz/edit_quiz_question');
				}}
				text={'Quizz'}
				otherStyles={'mt-4 p-4'}
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

import { Animated, Text, View } from 'react-native';
import Wrapper from '../../../components/customs/Wrapper';
import Button from '../../../components/customs/Button';
import Field from '../../../components/customs/Field';
import { useContext, useRef, useState } from 'react';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
	const router = useRouter();
	return (
		<Wrapper>
			<Button
				onPress={() => {
					router.replace('(app)/(quiz)/overview');
				}}
				text={'Create Quizz'}
				otherStyles={'mt-4 p-4'}
				textStyles={'text-center'}
			/>
			<Button
				onPress={() => {
					router.push('/(app)/(home)/teacher_home_screen');
				}}
				text={'Quizz'}
				otherStyles={'mt-4 p-4'}
				textStyles={'text-center'}
			/>
		</Wrapper>
	);
}

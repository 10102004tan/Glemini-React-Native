import { Animated, Text, View } from 'react-native';
import Wrapper from '../../../components/customs/Wrapper';
import Button from '../../../components/customs/Button';
import Field from '../../../components/customs/Field';
import { useRef, useState } from 'react';
import { useAppProvider } from '@/contexts/AppProvider';
import { useUserProvider } from '@/contexts/UserProvider';
import { useRouter } from 'expo-router';
import RichTextEditor from '../../../components/customs/RichTextEditor';

export default function HomeScreen() {
	const router = useRouter();
	return (
		<Wrapper>
			<Button
				onPress={() => {
					router.replace('/(app)/(quiz)/edit_quiz_question');
				}}
				text={'Create Quizz'}
				otherStyles={'mt-4 p-4'}
				textStyles={'text-center text-white'}
			/>
			<Button
				onPress={() => {
					router.push('/(app)/(quiz)/create_title');
				}}
				text={'Quizz'}
				otherStyles={'mt-4 p-4'}
				textStyles={'text-center text-white'}
			/>
			<Button
				onPress={() => {
					router.push('/(app)/(quiz)/1');
				}}
				text={'Quizz overview'}
				otherStyles={'mt-4 p-4'}
				textStyles={'text-center text-white'}
			/>
			<Button
				onPress={() => {
					router.push('/(app)/(quiz)/list');
				}}
				text={'List quizzes'}
				otherStyles={'mt-4 p-4'}
				textStyles={'text-center text-white'}
			/>
			<Button
				onPress={() => {
					router.push('/(app)/(play)/single');
				}}
				text={'Single'}
				otherStyles={'mt-4 p-4'}
				textStyles={'text-center text-white'}
			/>
		</Wrapper>
	);
}

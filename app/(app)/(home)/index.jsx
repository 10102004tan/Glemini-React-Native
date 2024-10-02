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
<<<<<<< HEAD
    <Wrapper>
      <Button
        onPress={() => {
          router.replace("(app)/(quiz)/overview");
        }}
        text={"Create Quizz"}
        otherStyles={"mt-4 p-4"}
        textStyles={"text-center"}
      />
      <Button
        onPress={() => {
          router.push("/(app)/(home)/teacher_home_screen");
        }}
        text={"Quizz"}
        otherStyles={"mt-4 p-4"}
        textStyles={"text-center"}
      />
=======
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
>>>>>>> 578809ec55e9c50c3fc545477018fc7196e302d2
      <Button
        onPress={() => {
          router.push("(app)/(quiz)/(detail)/detail_quizz");
        }}
        text={"Quizz Detail"}
        otherStyles={"mt-4 p-4"}
        textStyles={"text-center"}
      />
      <Button
        onPress={() => {
          router.push("(app)/(quiz)/(detail)/detail_quizz_collection");
        }}
        text={"Quizz Detail Collection"}
        otherStyles={"mt-4 p-4"}
        textStyles={"text-center"}
      />
<<<<<<< HEAD
    </Wrapper>
  );
=======
		</Wrapper>
	);
>>>>>>> 578809ec55e9c50c3fc545477018fc7196e302d2
}

import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Wrapper from '../../../components/customs/Wrapper';
import { router } from 'expo-router';
import { useQuizProvider } from '../../../contexts/QuizProvider';
const ListQuizz = () => {
	const { quizzes } = useQuizProvider();
	return (
		<Wrapper>
			{quizzes.length > 0 &&
				quizzes.map((quiz) => (
					<TouchableOpacity
						key={quiz._id}
						onPress={() => {
							router.push('(app)/(quiz)/' + quiz._id);
						}}
					>
						<Text>{quiz.quiz_name}</Text>
					</TouchableOpacity>
				))}
		</Wrapper>
	);
};

export default ListQuizz;

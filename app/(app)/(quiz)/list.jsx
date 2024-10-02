import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import Wrapper from '../../../components/customs/Wrapper';
import { useQuizProvider } from '../../../contexts/QuizProvider';
import { router } from 'expo-router';
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

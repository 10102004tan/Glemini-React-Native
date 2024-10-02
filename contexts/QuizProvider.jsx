import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserProvider } from './UserProvider';
const API_URL = 'http://192.168.1.8:8000/api/v1/quizzes';
const QuizContext = createContext();

const QuizProvider = ({ children }) => {
	const [selectedQuiz, setSelectedQuiz] = useState({});
	const [currentQuizQuestion, setCurrentQuizQuestion] = useState([]);
	const [quizzes, setQuizzes] = useState([]);
	const [createQuestionType, setCreateQuestionType] = useState('multiple');
	const [actionQuizType, setActionQuizType] = useState('create');
	const { user } = useUserProvider();
	const [needUpdate, setNeedUpdate] = useState(false);

	// Get all quizzes of the user
	const fetchQuizzes = async () => {
		const response = await fetch(`${API_URL}/get-by-user`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-id': user._id,
				authorization: user.accessToken,
			},
			body: JSON.stringify({ user_id: user._id }),
		});
		const data = await response.json();
		if (data.statusCode === 200) {
			setQuizzes(data.metadata);
		}
	};
	// Get all questions of the selected quiz
	const fetchQuestions = async () => {
		const response = await fetch(`${API_URL}/get-questions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-id': user._id,
				authorization: user.accessToken,
			},
			body: JSON.stringify({ quiz_id: selectedQuiz._id }),
		});
		const data = await response.json();
		if (data.statusCode === 200) {
			console.log(data.metadata);
			setCurrentQuizQuestion(data.metadata);
		}
	};

	// Get all quizzes of the user
	useEffect(() => {
		if (user) {
			fetchQuizzes();
		}
	}, [user]);

	// If NeedUpdate is true, fetch quizzes again
	useEffect(() => {
		if (needUpdate) {
			fetchQuizzes();
			setNeedUpdate(false);
		}
	}, [needUpdate]);

	// Get all questions of the selected quiz
	useEffect(() => {
		if (user && selectedQuiz._id) {
			fetchQuestions();
		}
	}, [selectedQuiz, user]);

	return (
		<QuizContext.Provider
			value={{
				selectedQuiz,
				setSelectedQuiz,
				quizzes,
				setQuizzes,
				needUpdate,
				setNeedUpdate,
				currentQuizQuestion,
				setCurrentQuizQuestion,
				actionQuizType,
				setActionQuizType,
			}}
		>
			{children}
		</QuizContext.Provider>
	);
};

export const useQuizProvider = () => {
	return useContext(QuizContext);
};

export default QuizProvider;

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './AuthContext';
const API_URL = 'http://192.168.1.8:8000/api/v1/quizzes';
const QuizContext = createContext();

const QuizProvider = ({ children }) => {
	const [selectedQuiz, setSelectedQuiz] = useState({});
	const [currentQuizQuestion, setCurrentQuizQuestion] = useState([]);
	const [quizzes, setQuizzes] = useState([]);
	const [actionQuizType, setActionQuizType] = useState('create');
	// const [createQuestionType, setCreateQuestionType] = useState('multiple');
	const { userData } = useAuthContext();
	const [needUpdate, setNeedUpdate] = useState(false);

	// Get all quizzes of the user
	const fetchQuizzes = async () => {
		const response = await fetch(`${API_URL}/get-by-user`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-id': userData._id,
				authorization: userData.accessToken,
			},
			body: JSON.stringify({ user_id: userData._id }),
		});
		const data = await response.json();
		// console.log(data);
		if (data.statusCode === 200) {
			setQuizzes(data.metadata);
		}
	};
	// Get all questions of the selected quiz
	const fetchQuestions = async () => {
		console.log('first');
		const response = await fetch(`${API_URL}/get-questions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-id': userData._id,
				authorization: userData.accessToken,
			},
			body: JSON.stringify({ quiz_id: selectedQuiz._id }),
		});
		const data = await response.json();
		console.log(data.metadata);
		if (data.statusCode === 200) {
			setCurrentQuizQuestion(data.metadata);
		} else {
			setCurrentQuizQuestion([]);
		}
	};

	// Get all quizzes of the user
	useEffect(() => {
		if (userData) {
			fetchQuizzes();
		}
	}, [userData]);

	// If NeedUpdate is true, fetch quizzes again
	// useEffect(() => {
	// 	if (needUpdate) {
	// 		fetchQuizzes();
	// 		setNeedUpdate(false);
	// 	}
	// }, [needUpdate]);

	// Get all questions of the selected quiz
	useEffect(() => {
		console.log(selectedQuiz._id);
		if (userData && selectedQuiz._id) {
			fetchQuizzes();
			fetchQuestions();
		}
	}, [selectedQuiz, userData]);

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

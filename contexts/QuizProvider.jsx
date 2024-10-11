import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './AuthContext';
import { API_URL, API_VERSION, END_POINTS } from '../configs/api.config';
import { router } from 'expo-router';

const QuizContext = createContext();

const QuizProvider = ({ children }) => {
	const [quizzes, setQuizzes] = useState([]);
	const [needUpdate, setNeedUpdate] = useState(false);
	const [quizFetching, setQuizFetching] = useState(false);
	const [questionFetching, setQuestionFetching] = useState(false);
	const [actionQuizType, setActionQuizType] = useState('create');
	const [isSave, setIsSave] = useState(false);
	const { userData } = useAuthContext();

	// Get all quizzes of the user
	const fetchQuizzes = async () => {
		setQuizFetching(true);
		const response = await fetch(
			`${API_URL}${API_VERSION.V1}${END_POINTS.GET_QUIZ_BY_USER}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-client-id': userData._id,
					authorization: userData.accessToken,
				},
				body: JSON.stringify({ user_id: userData._id }),
			}
		);
		const data = await response.json();

		if (data.statusCode === 200) {
			setQuizzes(data.metadata);
			setQuizFetching(false);
		}
	};

	// Get Quiz Published
	const getQuizzesPublished = async (subject_id) => {
		subject_id = subject_id === 'all'  ? null : subject_id;

		const response = await fetch(
			`${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_PUBLISHED}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-client-id': userData._id,
					authorization: userData.accessToken,

				},
				body: JSON.stringify({ subject_id: subject_id }),
			}
		);

		const data = await response.json();
		if (data.statusCode === 200) {
			setQuizzes(data.metadata)
		}
	};

	// Delete quiz
	const deleteQuiz = async (quizId) => {
		const response = await fetch(
			`${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_DELETE}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-client-id': userData._id,
					authorization: userData.accessToken,
				},
				body: JSON.stringify({ quiz_id: quizId }),
			}
		);

		const data = await response.json();
		if (data.statusCode === 200) {
			setNeedUpdate(true);
		}
	};

	// Update quiz
	const updateQuiz = async (quiz) => {
		const response = await fetch(
			`${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_UPDATE}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-client-id': userData._id,
					authorization: userData.accessToken,
				},
				body: JSON.stringify(quiz),
			}
		);

		const data = await response.json();
		// console.log(JSON.stringify(data, null, 2));
		if (data.statusCode === 200) {
			setNeedUpdate(true);
			setIsSave(false);
		}
	};

	// Update quiz if need
	useEffect(() => {
		if (needUpdate) {
			fetchQuizzes();
			setNeedUpdate(false);
		}
	}, [needUpdate]);

	// Get all quizzes of the user
	useEffect(() => {
		if (userData) {
			fetchQuizzes();
		}
	}, [userData]);

	return (
		<QuizContext.Provider
			value={{
				actionQuizType,
				setActionQuizType,
				quizzes,
				setQuizzes,
				needUpdate,
				setNeedUpdate,
				quizFetching,
				questionFetching,
				deleteQuiz,
				updateQuiz,
				setQuestionFetching,
				setQuizFetching,
				isSave,
				setIsSave,
				getQuizzesPublished
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

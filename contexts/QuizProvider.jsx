import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './AuthContext';
import { API_URL, API_VERSION, END_POINTS } from '../configs/api.config';
import { router } from 'expo-router';

const QuizContext = createContext();

const QuizProvider = ({ children }) => {
	const [quizzes, setQuizzes] = useState([]); // By User
	const [filterQuizzes, setFilterQuizzes] = useState([]); // Get Publish
	const [bannerQuizzes, setBannerQuizzes] = useState([]); // Banner
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
		// console.log(data);
		if (data.statusCode === 200) {
			setQuizzes(data.metadata);
			setQuizFetching(false);
		}
	};

	// Get Quiz Published
	const getQuizzesPublished = async (subject_id) => {
		subject_id = subject_id === 'all' ? '' : subject_id;
		const response = await fetch(
			`${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_PUBLISHED}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-client-id': userData._id,
					authorization: userData.accessToken,
				},
				body: JSON.stringify({ subjectId: subject_id }),
			}
		);

		const data = await response.json();
		if (data.statusCode === 200) {
			setFilterQuizzes(data.metadata);
		} else {
			setFilterQuizzes([]);
		}
	};

	// Get 3 item load to banner
	const getQuizzesBanner = async () => {
		const response = await fetch(
			`${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_BANNER}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-client-id': userData._id,
					authorization: userData.accessToken,
				},
			}
		);

		const data = await response.json();
		if (data.statusCode === 200) {
			setBannerQuizzes(data.metadata);
		} else {
			setBannerQuizzes([]);
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
				getQuizzesPublished,
				filterQuizzes,
				bannerQuizzes,
				getQuizzesBanner,
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

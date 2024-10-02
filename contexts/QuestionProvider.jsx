import { View, Text } from 'react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useUserProvider } from './UserProvider';
const QuestionContext = createContext();
const API_URL = 'http://192.168.1.8:8000/api/v1/questions';
const QuestionProvider = ({ children }) => {
	const { user } = useUserProvider();
	const [questions, setQuestions] = useState([]);
	const [updateQuestionId, setUpdateQuestionId] = useState(null);

	const getCurrentUpdateQuestion = async () => {
		const response = await fetch(API_URL + '/get-details', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-id': user._id,
				authorization: user.accessToken,
			},
			body: JSON.stringify({ question_id: updateQuestionId }),
		});
		const data = await response.json();
		if (data.statusCode === 200) {
			setQuestion(data.metadata);

			router.push('/(app)/(quiz)/edit_quiz_question');
		} else {
			// Alert to user here
			console.log('Error when get question details');
		}
	};

	useEffect(() => {
		if (updateQuestionId) {
			getCurrentUpdateQuestion();
		}
	}, [updateQuestionId]);

	const [question, setQuestion] = useState({
		question_excerpt: '<div>Nội dung câu hỏi</div>',
		question_description: '',
		question_image: '',
		question_audio: '',
		question_video: '',
		question_point: 1,
		question_time: 30,
		question_explanation: '',
		question_type: 'multiple',
		correct_answer_ids: [],
		question_answer_ids: [
			{
				id: 1,
				text: 'Ấn vào để chỉnh sửa đáp án',
				image: '',
				correct: false,
			},
			{
				id: 2,
				text: 'Ấn vào để chỉnh sửa đáp án',
				image: '',
				correct: false,
			},
			{
				id: 3,
				text: 'Ấn vào để chỉnh sửa đáp án',
				image: '',
				correct: false,
			},
			{
				id: 4,
				text: 'Ấn vào để chỉnh sửa đáp án',
				image: '',
				correct: false,
			},
		],
	});

	// Reset lại mảng câu hỏi
	const resetQuestion = () => {
		setQuestion({
			question_excerpt: '<div>Nội dung câu hỏi</div>',
			question_description: '',
			question_image: '',
			question_audio: '',
			question_video: '',
			question_point: 1,
			question_time: 30,
			question_explanation: '',
			question_type: 'multiple',
			correct_answer_ids: [],
			question_answer_ids: [
				{
					id: 1,
					text: 'Ấn vào để chỉnh sửa đáp án',
					image: '',
					correct: false,
				},
				{
					id: 2,
					text: 'Ấn vào để chỉnh sửa đáp án',
					image: '',
					correct: false,
				},
				{
					id: 3,
					text: 'Ấn vào để chỉnh sửa đáp án',
					image: '',
					correct: false,
				},
				{
					id: 4,
					text: 'Ấn vào để chỉnh sửa đáp án',
					image: '',
					correct: false,
				},
			],
		});
	};

	// Xóa một đáp án đã tạo
	const deleteAnswer = (id) => {
		if (question.question_answer_ids.length > 1) {
			const newAnswers = question.question_answer_ids.filter(
				(answer) => answer._id !== id
			);
			setQuestion({ ...question, question_answer_ids: newAnswers });
		}
	};

	// Đánh dấu đáp án chính xác
	const markCorrectAnswer = (id, isMultiple) => {
		// Cập nhật lại question.answers nếu chỉ được chọn 1 đáp án
		const resetAnswers = !isMultiple
			? question.question_answer_ids.map((answer) => ({
					...answer,
					correct: false,
				}))
			: question.question_answer_ids;

		console.log(id);
		// Cập nhật lại question.answers
		const updatedAnswers = resetAnswers.map((answer) =>
			answer._id === id ? { ...answer, correct: !answer.correct } : answer
		);

		console.log(updatedAnswers);
		setQuestion({ ...question, question_answer_ids: updatedAnswers });
	};

	// Đặt lại đánh dấu cho tất cả các đáp án đã đánh dấu chính xác
	const resetMarkCorrectAnswer = () => {
		const resetAnswers = question.question_answer_ids.map((answer) => ({
			...answer,
			correct: false,
		}));
		setQuestion({ ...question, question_answer_ids: resetAnswers });
	};

	const findAnswer = (id) => {
		return question.question_answer_ids.find((answer) => answer._id === id);
	};

	// Thêm một đáp án mới
	const addAnswer = () => {
		const newAnswers = [
			...question.question_answer_ids,
			{
				_id:
					question.question_answer_ids[
						question.question_answer_ids.length - 1
					]._id + 1,
				text: 'Ấn vào để chỉnh sửa đáp án',
				image: '',
				correct: false,
			},
		];
		setQuestion({ ...question, question_answer_ids: newAnswers });
	};

	// Chỉnh sửa nội dung của đáp án
	const editAnswerContent = (id, content) => {
		const newAnswers = question.question_answer_ids.map((answer) => {
			if (answer._id === id) {
				return { ...answer, text: content };
			}
			return answer;
		});
		console.log(newAnswers);
		setQuestion({ ...question, question_answer_ids: newAnswers });
	};

	// Cập nhật thời gian cho câu hỏi
	const updateQuestionTime = (time) => {
		setQuestion({ ...question, question_time: time });
	};

	// Cập nhật điểm cho câu hỏi
	const updateQuestionPoint = (point) => {
		setQuestion({ ...question, question_point: point });
	};

	// Kiểm tra nếu đáp án là đáp án chính xác
	const checkCorrectAnswer = (id) => {
		return question.correct_answer_ids.some((answer) => answer._id === id);
	};

	// Lưu câu hỏi đã tạo lên server
	const saveQuestion = async (quizId) => {
		try {
			// Gọi API lưu câu hỏi
			const response = await fetch(API_URL + '/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-client-id': user._id,
					authorization: user.accessToken,
				},
				body: JSON.stringify({ ...question, quiz_id: quizId }),
			});
			const data = await response.json();
			if (data.statusCode === 200) {
				console.log('Lưu câu hỏi thành công');
				// Alert to user here
				// Lưu câu hỏi vào mảng các câu hỏi
				setQuestions([...questions, question]);
				resetQuestion();
				router.replace('/(app)/(quiz)/' + quizId);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const editQuestion = async (quizId, questionId) => {
		try {
			console.log('Chaysdf');
			// Gọi API cập nhật câu hỏi
			const response = await fetch(API_URL + '/update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					authorization: user.accessToken,
					'x-client-id': user._id,
				},
				body: JSON.stringify({ ...question, quiz_id: quizId }),
			});
			const data = await response.json();
			if (data.statusCode === 200) {
				console.log('Cập nhật câu hỏi thành công');
				// Alert to user here

				// Cập nhật lại câu hỏi vào mảng câu hỏi
				const newQuestions = questions.map((q) => {
					if (q.id === questionId) {
						return question;
					}
					return q;
				});

				setQuestions(newQuestions);
				resetQuestion();
				router.replace('/(app)/(quiz)/' + quizId);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<QuestionContext.Provider
			value={{
				questions,
				setQuestions,
				question,
				setQuestion,
				resetQuestion,
				deleteAnswer,
				markCorrectAnswer,
				addAnswer,
				findAnswer,
				resetMarkCorrectAnswer,
				editAnswerContent,
				saveQuestion,
				updateQuestionTime,
				updateQuestionPoint,
				editQuestion,
				updateQuestionId,
				checkCorrectAnswer,
				setUpdateQuestionId,
			}}
		>
			{children}
		</QuestionContext.Provider>
	);
};

export const useQuestionProvider = () => {
	return useContext(QuestionContext);
};

export default QuestionProvider;

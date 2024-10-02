import { View, Text } from 'react-native';
import React, { createContext, useContext, useState } from 'react';
import { router } from 'expo-router';
const QuestionContext = createContext();
const API_URL = 'http://192.168.1.8:8000/api/v1/questions';
const QuestionProvider = ({ children }) => {
	const [questions, setQuestions] = useState([]);
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
		question_answer_ids: [],
		answers: [
			{
				id: 1,
				text: 'Đáp án 1',
				image: '',
				correct: false,
			},
			{
				id: 2,
				text: 'Đáp án 2',
				image: '',
				correct: false,
			},
			{
				id: 3,
				text: 'Đáp án 3',
				image: '',
				correct: false,
			},
			{
				id: 4,
				text: 'Đáp án 4',
				image: '',
				correct: false,
			},
		],
	});

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
			question_answer_ids: [],
			answers: [
				{
					id: 1,
					text: 'Đáp án 1',
					image: '',
					correct: false,
				},
				{
					id: 2,
					text: 'Đáp án 2',
					image: '',
					correct: false,
				},
				{
					id: 3,
					text: 'Đáp án 3',
					image: '',
					correct: false,
				},
				{
					id: 4,
					text: 'Đáp án 4',
					image: '',
					correct: false,
				},
			],
		});
	};

	// Xóa một đáp án đã tạo
	const deleteAnswer = (id) => {
		if (question.answers.length > 1) {
			const newAnswers = question.answers.filter(
				(answer) => answer.id !== id
			);
			setQuestion({ ...question, answers: newAnswers });
		}
	};

	// Đánh dấu đáp án chính xác
	const markCorrectAnswer = (id, isMultiple) => {
		// Cập nhật lại question.answers nếu chỉ được chọn 1 đáp án
		const resetAnswers = !isMultiple
			? question.answers.map((answer) => ({ ...answer, correct: false }))
			: question.answers;

		// Cập nhật lại question.answers
		const updatedAnswers = resetAnswers.map((answer) =>
			answer.id === id ? { ...answer, correct: !answer.correct } : answer
		);

		setQuestion({ ...question, answers: updatedAnswers });
	};

	// Đặt lại đánh dấu cho tất cả các đáp án đã đánh dấu chính xác
	const resetMarkCorrectAnswer = () => {
		const resetAnswers = question.answers.map((answer) => ({
			...answer,
			correct: false,
		}));
		setQuestion({ ...question, answers: resetAnswers });
	};

	const findAnswer = (id) => {
		return question.answers.find((answer) => answer.id === id);
	};

	// Thêm một đáp án mới
	const addAnswer = () => {
		const newAnswers = [
			...question.answers,
			{
				id: question.answers[question.answers.length - 1].id + 1,
				text:
					'Đáp án ' +
					(question.answers[question.answers.length - 1].id + 1),
				image: '',
				correct: false,
			},
		];
		setQuestion({ ...question, answers: newAnswers });
	};

	// Chỉnh sửa nội dung của đáp án
	const editAnswerContent = (id, content) => {
		const newAnswers = question.answers.map((answer) => {
			if (answer.id === id) {
				return { ...answer, text: content };
			}
			return answer;
		});
		setQuestion({ ...question, answers: newAnswers });
	};

	// Cập nhật thời gian cho câu hỏi
	const updateQuestionTime = (time) => {
		setQuestion({ ...question, question_time: time });
	};

	// Cập nhật điểm cho câu hỏi
	const updateQuestionPoint = (point) => {
		setQuestion({ ...question, question_point: point });
	};

	// Lưu câu hỏi đã tạo lên server
	const saveQuestion = async (quizId) => {
		try {
			// Gọi API lưu câu hỏi
			const response = await fetch(API_URL + '/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					authorization:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjZmYTZiZWQyN2JlMTgxNzk0N2I0MjgxIiwidXNlcl9lbWFpbCI6ImRhdDYxMjIyQGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6InN0dWRlbnQiLCJpYXQiOjE3Mjc3NjcwMDQsImV4cCI6MTcyNzkzOTgwNH0.72gyEpHKg_0c58-yMopm2BX0RVEu5apeqqx_Fdhl70k',
					'x-client-id': '66fa6bed27be1817947b4281',
				},
				body: JSON.stringify({ ...question, quiz_id: quizId }),
			});
			const data = await response.json();
			console.log(data);
			if (data.statusCode === 200) {
				console.log('Lưu câu hỏi thành công');
				// Alert to user here
				router.replace('/(app)/(quiz)/' + quizId);
			}

			// Lưu câu hỏi vào mảng các câu hỏi
			setQuestions([...questions, question]);
			resetQuestion();
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

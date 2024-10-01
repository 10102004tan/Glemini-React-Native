import { View, Text } from 'react-native';
import React, { createContext, useContext, useState } from 'react';
const QuestionContext = createContext();
const QuestionProvider = ({ children }) => {
	const [questions, setQuestions] = useState([]);

	const [question, setQuestion] = useState({
		question_excerpt: 'Nội dung câu hỏi',
		question_description: '',
		question_image: '',
		question_audio: '',
		question_video: '',
		question_point: 1,
		question_time: 30,
		question_explanation: '',
		question_type: '',
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
			question_excerpt: 'Nội dung câu hỏi',
			question_description: '',
			question_image: '',
			question_audio: '',
			question_video: '',
			question_point: 1,
			question_time: 30,
			question_explanation: '',
			question_type: '',
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

	const deleteAnswer = (id) => {
		if (question.answers.length > 1) {
			const newAnswers = question.answers.filter(
				(answer) => answer.id !== id
			);
			setQuestion({ ...question, answers: newAnswers });
		}
	};

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

	const editAnswerContent = (id, content) => {
		const newAnswers = question.answers.map((answer) => {
			if (answer.id === id) {
				return { ...answer, text: content };
			}
			return answer;
		});
		setQuestion({ ...question, answers: newAnswers });
	};

	return (
		<QuestionContext.Provider
			value={{
				question,
				setQuestion,
				resetQuestion,
				deleteAnswer,
				markCorrectAnswer,
				addAnswer,
				findAnswer,
				resetMarkCorrectAnswer,
				editAnswerContent,
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

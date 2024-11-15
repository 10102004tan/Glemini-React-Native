import React, { useEffect, useState, useCallback, useReducer } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Button from '../../../components/customs/Button';
import ResultSingle from '../(result)/single';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAppProvider } from '@/contexts/AppProvider';
import Toast from 'react-native-toast-message-custom';
import { Audio } from 'expo-av';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useQuestionProvider } from '@/contexts/QuestionProvider';
import { useResultProvider } from '@/contexts/ResultProvider';

// Reducer to manage game state
const initialState = {
	currentQuestionIndex: 0,
	selectedAnswers: [],
	correctCount: 0,
	wrongCount: 0,
	score: 0,
	isCompleted: false,
	isCorrect: false,
	isChosen: false,
	showCorrectAnswer: false,
	buttonText: 'Confirm',
	buttonColor: 'bg-white',
	buttonTextColor: 'text-black',
	isProcessing: false,
};

function gameReducer(state, action) {
	switch (action.type) {
		case 'SET_ANSWER':
			return { ...state, selectedAnswers: action.payload, isChosen: true, buttonColor: 'bg-[#0D70D2]', buttonTextColor: 'text-white' };
		case 'RESET':
			return initialState;
		case 'SUBMIT_CORRECT':
			return {
				...state,
				isCorrect: true,
				correctCount: state.correctCount + 1,
				score: state.score + action.payload.points,
				buttonColor: 'bg-[#4CAF50]',
				buttonText: `+${action.payload.points}`,
				showCorrectAnswer: true,
			};
		case 'SUBMIT_INCORRECT':
			return {
				...state,
				isCorrect: false,
				wrongCount: state.wrongCount + 1,
				buttonColor: 'bg-[#F44336]',
				buttonText: 'Incorrect',
				showCorrectAnswer: true,
			};
		case 'NEXT_QUESTION':
			return {
				...state,
				currentQuestionIndex: state.currentQuestionIndex + 1,
				selectedAnswers: [],
				isChosen: false,
				showCorrectAnswer: false,
				buttonText: 'Confirm',
				buttonColor: 'bg-white',
				buttonTextColor: 'text-black',
			};
		case 'COMPLETE':
			return { ...state, isCompleted: true };
		case 'PROCESSING':
			return { ...state, isProcessing: action.payload };
		case 'SET_CURRENT_QUESTION_INDEX':
			return {
				...state,
				currentQuestionIndex: action.payload,
			};
		default:
			return state;
	}
}

const SinglePlay = () => {
	const { quizId, exerciseId, type } = useLocalSearchParams();
	const { i18n } = useAppProvider();
	const { questions, fetchQuestions, saveQuestionResult } = useQuestionProvider();
	const { result, fetchResultData } = useResultProvider()
	const { completed } = useResultProvider();
	const [state, dispatch] = useReducer(gameReducer, initialState);
	const [sound, setSound] = useState(null);
	const [resultId, setResultId] = useState(null);

	useEffect(() => {
		if (quizId) {
			fetchQuestions(quizId)
		}
	}, [quizId]);

	useEffect(() => {
		if (quizId && type && exerciseId) {
			fetchResultData({ quizId, exerciseId, type });
		} else if (quizId && type) {
			fetchResultData({ quizId, type });
		}
	}, [exerciseId, quizId, type])


	useEffect(() => {
		if (result && result._id) {
			const answeredQuestionsCount = result.result_questions?.length || 0;
			const nextIndex = answeredQuestionsCount < questions.length ? answeredQuestionsCount : 0;
			dispatch({ type: 'SET_CURRENT_QUESTION_INDEX', payload: nextIndex });
		}
	}, [result]);


	// useEffect(() => {
	//     if (sound) return () => sound.unloadAsync();
	// }, [sound]);

	// const playSound = useCallback(async (isCorrectAnswer) => {
	//     const soundPath = isCorrectAnswer ? require('@/assets/sounds/correct.mp3') : require('@/assets/sounds/incorrect.mp3');
	//     const { sound } = await Audio.Sound.createAsync(soundPath);
	//     setSound(sound);
	//     await sound.playAsync();
	// }, []);

	const handleAnswerPress = useCallback((answerId) => {
		dispatch({
			type: 'SET_ANSWER',
			payload: state.selectedAnswers.includes(answerId)
				? state.selectedAnswers.filter(id => id !== answerId)
				: [...state.selectedAnswers, answerId],
		});
	}, [state.selectedAnswers]);

	const handleSubmit = useCallback(async () => {
		if (state.isProcessing) return;

		dispatch({ type: 'PROCESSING', payload: true });

		if (state.selectedAnswers.length === 0) {
			Toast.show({
				type: 'error',
				text1: `${i18n.t('play.single.errorTitle')}`,
				text2: `${i18n.t('play.single.errorText')}`,
				visibilityTime: 1000,
				autoHide: true,
			});
			dispatch({ type: 'PROCESSING', payload: false });
			return;
		}

		const currentQuestion = questions[state.currentQuestionIndex];
		const correctAnswerIds = currentQuestion.correct_answer_ids.map(answer => answer._id);
		const isAnswerCorrect = state.selectedAnswers.length === correctAnswerIds.length &&
			state.selectedAnswers.every(answerId => correctAnswerIds.includes(answerId));

		// await playSound(isAnswerCorrect);

		dispatch({
			type: isAnswerCorrect ? 'SUBMIT_CORRECT' : 'SUBMIT_INCORRECT',
			payload: { points: currentQuestion.question_point },
		});

		saveQuestionResult(
			exerciseId, quizId,
			currentQuestion._id,
			state.selectedAnswers,
			isAnswerCorrect,
			currentQuestion.question_point
		);

		setTimeout( async () => {
			dispatch({ type: 'PROCESSING', payload: false });
			if (state.currentQuestionIndex < questions.length - 1) {
				dispatch({ type: 'NEXT_QUESTION' });
			} else {
				dispatch({ type: 'COMPLETE' });
				dispatch({ type: 'COMPLETE' });
				
				const completedResult = await completed(exerciseId, quizId);

				if (completedResult && completedResult._id) {
					setResultId(completedResult._id);
				}
			}
		}, 2000);
	}, [state, questions, completed, saveQuestionResult, exerciseId, quizId, i18n]);

	const handleRestart = () => {
		dispatch({ type: 'RESET' });
		setResultId(null);
	};

	if (state.isCompleted && resultId) {
		console.log('Quiz completed:', state.isCompleted, 'Result ID:', resultId);
		return (
			<ResultSingle
				resultId={resultId}
				handleRestart={handleRestart}

			/>
		);
	}

	return (
		<View className="flex-1">
			<View className="flex-row px-5 pt-10 pb-3 bg-black">
				<Button
					text={i18n.t('play.single.buttonQuit')}
					onPress={() => { router.back(); }}
					loading={false}
					type="fill"
					otherStyles="bg-[#F41D1D]"
					textStyles="font-medium text-sm text-white"
				/>
			</View>
			<View className="flex-1 bg-[#1C2833] px-5 py-4 justify-between">
				<Text className="text-lg bg-[#484E54] rounded text-white px-[10px] py-1 font-pregular self-start">
					{`${i18n.t('play.single.score')}: ${state.score}`}
				</Text>
				<View className="bg-[#484E54] rounded-lg px-3 py-10">
					<Text className="text-sm font-pregular text-slate-200 absolute top-2 left-2">
						{`${i18n.t('play.single.questionCouter')} ${state.currentQuestionIndex + 1} / ${questions.length}`}
					</Text>
					<ScrollView className="h-32" showsVerticalScrollIndicator={false}>
						<Text className="text-2xl font-bold text-white">
							{questions[state.currentQuestionIndex]?.question_excerpt || ''}
						</Text>
					</ScrollView>
				</View>
				<View>
					{questions[state.currentQuestionIndex]?.question_answer_ids.map((answer, index) => {
						let backgroundColor = '#484E54';
						if (state.showCorrectAnswer) {
							const correctIds = questions[state.currentQuestionIndex].correct_answer_ids.map(a => a._id);
							if (correctIds.includes(answer._id)) backgroundColor = '#4CAF50';
							else if (state.selectedAnswers.includes(answer._id)) backgroundColor = '#F44336';
						} else if (state.selectedAnswers.includes(answer._id)) {
							backgroundColor = '#0D70D2';
						}
						return (
							<TouchableOpacity
								key={index}
								onPress={() => handleAnswerPress(answer._id)}
								className='p-6 my-1 rounded-lg'
								style={{
									backgroundColor,
								}}
								disabled={state.showCorrectAnswer}
							>
								<Text className="text-white text-lg font-bold">{answer.text}</Text>
							</TouchableOpacity>
						);
					})}
				</View>
				<Button
					text={state.buttonText}
					onPress={handleSubmit}
					type="fill"
					loading={state.isProcessing}
					otherStyles={`p-5 ${state.buttonColor}`}
					textStyles={`mx-auto text-lg mx-auto ${state.buttonTextColor}`}
				/>
			</View>
		</View>
	);
};

export default SinglePlay;

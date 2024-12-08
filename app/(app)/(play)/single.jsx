import React, { useEffect, useState, useCallback, useReducer } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Animated } from 'react-native';
import Button from '../../../components/customs/Button';
import ResultSingle from '../(result)/single';
import { useAppProvider } from '@/contexts/AppProvider';
import Toast from 'react-native-toast-message-custom';
import { Audio } from 'expo-av';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuestionProvider } from '@/contexts/QuestionProvider';
import { useResultProvider } from '@/contexts/ResultProvider';
import { Easing } from 'react-native';

// Reducer to manage game state
const initialState = {
	currentQuestionIndex: 0,
	selectedAnswers: [],
	inputAnswers: [],
	correctCount: 0,
	wrongCount: 0,
	score: 0,
	isCompleted: false,
	isCorrect: false,
	isChosen: false,
	showCorrectAnswer: false,
	buttonText: 'Xác nhận',
	buttonColor: 'bg-white',
	buttonTextColor: 'text-black',
	isProcessing: false,
};

function gameReducer(state, action) {
	switch (action.type) {
		case 'SET_ANSWER':
			return {
				...state,
				selectedAnswers: action.payload,
				isChosen: true,
				buttonColor: 'bg-[#0D70D2]',
				buttonTextColor: 'text-white'
			};
		case 'SET_BOX_ANSWER': // New case to handle box answers
			return {
				...state,
				inputAnswers: [action.payload],
				isChosen: true,
				buttonColor: 'bg-[#0D70D2]',
				buttonTextColor: 'text-white'
			};
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
				buttonText: 'Sai rồi!!',
				showCorrectAnswer: true,
			};
		case 'NEXT_QUESTION':
			return {
				...state,
				currentQuestionIndex: state.currentQuestionIndex + 1,
				selectedAnswers: [],
				inputAnswers: [],
				isChosen: false,
				showCorrectAnswer: false,
				buttonText: 'Xác nhận',
				buttonColor: 'bg-white',
				buttonTextColor: 'text-black',
			};
		case 'SET_PREVIOUS_RESULT':
			return {
				...state,
				score: action.payload.score,
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
	const { result, fetchResultData } = useResultProvider();
	const { completed } = useResultProvider();
	const [state, dispatch] = useReducer(gameReducer, initialState);
	const [sound, setSound] = useState(null);
	const [resultId, setResultId] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (quizId) {
			fetchQuestions(quizId);
		}
	}, [quizId]);

	useEffect(() => {
		const loadData = async () => {
			setIsLoading(true); // Set loading state to true before starting data fetch
			
			try {
				if (quizId && type && exerciseId) {
					await fetchResultData({ quizId, exerciseId, type });
				} else if (quizId && type) {
					await fetchResultData({ quizId, type });
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false); // Set loading state to false after data fetch completes
			}
		};
	
		loadData();
	}, [exerciseId, quizId, type]);
	

	useEffect(() => {
		if (result && result._id) {
			const answeredQuestionsCount = result.result_questions?.length || 0;
			const nextIndex = answeredQuestionsCount < questions.length ? answeredQuestionsCount : 0;
			const previousScore = result.result_questions?.reduce((total, question) => {
				return total + (question.correct ? question.score : 0);
			}, 0) || 0;
			dispatch({ type: 'SET_CURRENT_QUESTION_INDEX', payload: nextIndex });
			dispatch({ type: 'SET_PREVIOUS_RESULT', payload: { score: previousScore } });
		}
	}, [result, questions]);

	const handleAnswerPress = useCallback((answerId) => {
		const currentQuestion = questions[state.currentQuestionIndex];
		const questionType = currentQuestion?.question_type;

		if (questionType === 'single') {
			dispatch({
				type: 'SET_ANSWER',
				payload: [answerId],
			});
		} else if (questionType === 'multiple') {
			dispatch({
				type: 'SET_ANSWER',
				payload: state.selectedAnswers.includes(answerId)
					? state.selectedAnswers.filter((id) => id !== answerId)
					: [...state.selectedAnswers, answerId],
			});
		}
		// Handling box input
		else if (questionType === 'box') {
			dispatch({
				type: 'SET_BOX_ANSWER',
				payload: answerId,
			});
		}
	}, [state.selectedAnswers, questions, state.currentQuestionIndex]);

	const handleSubmit = useCallback(async () => {
		if (state.isProcessing) return;

		dispatch({ type: 'PROCESSING', payload: true });

		// Show error if no answer is provided
		if ((state.selectedAnswers.length === 0 && state.inputAnswers.length === 0)) {
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
		const questionType = currentQuestion.question_type;
		let isAnswerCorrect = false;

		// Determine correctness based on question type
		if (questionType === 'box') {
			const normalizeText = (text) => {
				// Loại bỏ khoảng trắng thừa và chuyển về chữ thường
				return text
					.toLowerCase() // Chuyển về chữ thường
					.replace(/\s+/g, '') // Loại bỏ khoảng trắng thừa giữa các từ
					.trim();
			};

			const correctTextAnswers = currentQuestion.correct_answer_ids.map(a => normalizeText(a.text));
			const userAnswer = normalizeText(state.inputAnswers[0] || 'Không có đáp án');

			isAnswerCorrect = correctTextAnswers.includes(userAnswer);

		} else {
			const correctAnswerIds = currentQuestion.correct_answer_ids.map(answer => answer._id);
			isAnswerCorrect = state.selectedAnswers.length === correctAnswerIds.length &&
				state.selectedAnswers.every(answerId => correctAnswerIds.includes(answerId));
		}

		// await playSound(isAnswerCorrect);

		dispatch({
			type: isAnswerCorrect ? 'SUBMIT_CORRECT' : 'SUBMIT_INCORRECT',
			payload: { points: currentQuestion.question_point },
		});

		saveQuestionResult(
			exerciseId, quizId,
			currentQuestion._id,
			questionType === 'box' ? state.inputAnswers : state.selectedAnswers,
			isAnswerCorrect,
			currentQuestion.question_point,
			currentQuestion.question_type
		);

		setTimeout(async () => {
			dispatch({ type: 'PROCESSING', payload: false });
			if (state.currentQuestionIndex < questions.length - 1) {
				dispatch({ type: 'NEXT_QUESTION' });
			} else {
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
					onPress={() => {
						Alert.alert(
							i18n.t('play.single.titleQuizOut'),
							i18n.t('play.single.textQuizOut'),
							[
								{ text: i18n.t('play.single.btnCancel'), style: "cancel" },
								{
									text: i18n.t('play.single.buttonQuit'), onPress: async () => {
										router.back()
									},
								}
							]
						);
					}}
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
				<View className="bg-[#484E54] rounded-lg px-3 py-10 mt-2">
					<Text className="text-sm font-pregular text-slate-200">
						{`${i18n.t('play.single.questionCouter')} ${state.currentQuestionIndex + 1} / ${questions.length}`}
					</Text>
					<ScrollView className="h-32" showsVerticalScrollIndicator={false}>
						<Text className="text-2xl font-bold text-white leading-9">
							{questions[state.currentQuestionIndex]?.question_excerpt}
						</Text>
					</ScrollView>
				</View>
				<ScrollView className="flex-1 mt-4">
					{
					isLoading ? 
					<>
					<SkeletonLoader/>
					<SkeletonLoader/>
					<SkeletonLoader/>
					<SkeletonLoader/>
					</>
					:
					questions[state.currentQuestionIndex]?.question_answer_ids.map((answer, index) => {
						let backgroundColor = '#484E54';
						if (state.showCorrectAnswer) {
							const correctIds = questions[state.currentQuestionIndex].correct_answer_ids.map(a => a._id);
							if (correctIds.includes(answer._id)) backgroundColor = '#4CAF50';
							else if (state.selectedAnswers.includes(answer._id)) backgroundColor = '#F44336';
						} else if (state.selectedAnswers.includes(answer._id)) {
							backgroundColor = '#0D70D2';
						}
						// Check if question type is "box"
						const isBoxQuestion = questions[state.currentQuestionIndex]?.question_type === 'box';

						if (isBoxQuestion) {
							return (
								<View key={index} className='my-3'>
									<TextInput
										placeholder={'Nhập câu trả lời'}
										value={state.inputAnswers[0] || ''}
										onChangeText={(text) => handleAnswerPress(text)}
										className="p-4 rounded-lg bg-[#484E54] text-white"
										placeholderTextColor="#B0B0B0"
									/>
								</View>
							);
						}

						// Render normal options for single/multiple type
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
					})
					}
				</ScrollView>
				<Button
					text={state.buttonText}
					onPress={handleSubmit}
					loading={state.isProcessing}
					type="fill"
					otherStyles={`${state.buttonColor} py-5`}
					textStyles={`${state.buttonTextColor} font-medium text-lg mx-auto`}
					disabled={state.isCompleted || !state.isChosen}
				/>
			</View>
		</View>
	);
};

const SkeletonLoader = () => {
    const shimmer = new Animated.Value(0);

    useEffect(() => {
        const shimmerAnimation = Animated.loop(
            Animated.timing(shimmer, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        shimmerAnimation.start();
        return () => shimmerAnimation.stop();
    }, [shimmer]);

    const translateX = shimmer.interpolate({
        inputRange: [0, 1],
        outputRange: [-200, 200], // Adjust range as needed for skeleton width
    });

    return (
        <View className="bg-[#484E54] rounded-lg px-3 py-6 mt-2">
            <View className="w-full h-6 bg-slate-700 rounded overflow-hidden relative">
                <Animated.View
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#6b7280',
                        transform: [{ translateX }],
                        opacity: 0.4,
                    }}
                />
            </View>
        </View>
    );
};

export default SinglePlay;

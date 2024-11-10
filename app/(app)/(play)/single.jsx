import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import Button from '../../../components/customs/Button';
import ResultSingle from '../(result)/single';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAppProvider } from '@/contexts/AppProvider';
import Toast from 'react-native-toast-message-custom';
import { Audio } from 'expo-av';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useQuestionProvider } from '@/contexts/QuestionProvider';
import { useResultProvider } from '@/contexts/ResultProvider';

const SinglePlay = () => {
	const { quizId, exerciseId } = useLocalSearchParams()
	const { i18n } = useAppProvider();
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswers, setSelectedAnswers] = useState([]);
	const [correctCount, setCorrectCount] = useState(0);
	const [wrongCount, setWrongCount] = useState(0);
	const [score, setScore] = useState(0);
	const [isCompleted, setIsCompleted] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);
	const [isChosen, setIsChosen] = useState(false);
	const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
	const [buttonText, setButtonText] = useState(i18n.t('play.single.buttonConfirm'));
	const [buttonColor, setButtonColor] = useState('bg-white');
	const [buttonTextColor, setButtonTextColor] = useState('text-black');
	const { userData } = useAuthContext();
	const [isProcessing, setIsProcessing] = useState(false);
	const [sound, setSound] = useState(null);
	const { questions, fetchQuestions, saveQuestionResult } = useQuestionProvider()
	const { completed, fetchResultData, result } = useResultProvider()

	useEffect(() => {
		fetchResultData(quizId, exerciseId);
	}, [exerciseId, quizId])

	useEffect(() => {
		fetchQuestions(quizId);
		if (result) {
			const answeredQuestionsCount = result.result_questions?.length || 0;
			setCurrentQuestionIndex(answeredQuestionsCount < questions?.length ? answeredQuestionsCount : 0);
		} else {
			setCurrentQuestionIndex(0);
		}
	}, [quizId, result]);


	const playSound = async (isCorrectAnswer) => {
		let soundPath = isCorrectAnswer ? require('@/assets/sounds/correct.mp3') : require('@/assets/sounds/incorrect.mp3');
		const { sound } = await Audio.Sound.createAsync(soundPath);
		setSound(sound);
		await sound.playAsync();
	};

	useEffect(() => {
		return sound
			? () => {
				sound.unloadAsync();
			}
			: undefined;
	}, [sound]);

	const handleAnswerPress = (answerId) => {
		if (questions[currentQuestionIndex].question_type === 'single') {
			setSelectedAnswers([answerId]);
			setIsChosen(true);
			setButtonColor('bg-[#0D70D2]');
			setButtonTextColor('text-white');
		} else {
			if (selectedAnswers.includes(answerId)) {
				setSelectedAnswers(selectedAnswers.filter((id) => id !== answerId));
			} else {
				setSelectedAnswers([...selectedAnswers, answerId]);
			}
		}
	};

	const handleSubmit = async () => {
		if (isProcessing) return;
		setIsProcessing(true);

		if (selectedAnswers.length === 0) {
			Toast.show({
				type: 'error',
				text1: `${i18n.t('play.single.errorTitle')}`,
				text2: `${i18n.t('play.single.errorText')}`,
				visibilityTime: 1000,
				autoHide: true,
			});
			setIsProcessing(false);
			return;
		}

		const currentQuestion = questions[currentQuestionIndex];
		const correctAnswerIds = currentQuestion.correct_answer_ids.map(answer => answer._id);

		let isAnswerCorrect;

		if (currentQuestion.question_type === 'single') {
			isAnswerCorrect = selectedAnswers[0] === correctAnswerIds[0];
		} else {
			isAnswerCorrect =
				selectedAnswers.length === correctAnswerIds.length &&
				selectedAnswers.every((answerId) => correctAnswerIds.includes(answerId));
		}

		await playSound(isAnswerCorrect);

		if (isAnswerCorrect) {
			setIsCorrect(true);
			setCorrectCount(correctCount + 1);
			setScore(score + currentQuestion.question_point);
			setButtonColor('bg-[#4CAF50]');
			setButtonText(`+${currentQuestion.question_point}`);
		} else {
			setIsCorrect(false);
			setWrongCount(wrongCount + 1);
			setButtonColor('bg-[#F44336]');
			setButtonTextColor('text-white')
			setButtonText(i18n.t('play.single.incorrect'));
		}

		saveQuestionResult(
			exerciseId, quizId,
			currentQuestion._id,
			selectedAnswers,
			isAnswerCorrect,
			currentQuestion.question_point
		);

		setShowCorrectAnswer(true);

		setTimeout(() => {
			setIsProcessing(false);
			if (currentQuestionIndex < questions.length - 1) {
				setCurrentQuestionIndex(currentQuestionIndex + 1);
				setSelectedAnswers([]);
				setIsChosen(false);
				setShowCorrectAnswer(false);
				setButtonText(i18n.t('play.single.buttonConfirm'));
				setButtonColor('bg-white');
				setButtonTextColor('text-black');
			} else {
				setIsCompleted(true);
				completed(exerciseId, quizId);
			}
		}, 2000);
	};

	const handleRestart = () => {
		setIsCorrect(false);
		setCurrentQuestionIndex(0);
		setCorrectCount(0);
		setWrongCount(0);
		setScore(0);
		setIsCompleted(false);
		setSelectedAnswers([]);
		setIsChosen(false);
		setShowCorrectAnswer(false);
		setButtonText(i18n.t('play.single.buttonConfirm'));
		setButtonColor('bg-white');
		setButtonTextColor('text-black');
	};

	if (isCompleted) {
		return (
			<ResultSingle
				quizId={quizId}
				correctCount={correctCount}
				wrongCount={wrongCount}
				score={score}
				totalQuestions={questions.length}
				handleRestart={handleRestart}
				exerciseId={exerciseId}
			/>
		);
	}

	return (
		<View className="flex-1">
			<View className="flex-row px-5 pt-10 pb-3 bg-black">
				<Button
					text={i18n.t('play.single.buttonQuit')}
					onPress={() => { router.back() }}
					loading={false}
					type="fill"
					otherStyles={'bg-[#F41D1D]'}
					textStyles={'font-medium text-sm text-white'}
				/>
			</View>

			<View className="flex-1 bg-[#1C2833] px-5 py-4 justify-between">
				<Text className="text-lg bg-[#484E54] rounded text-white px-[10px] py-1 font-pregular self-start">
					{`${i18n.t('play.single.score')}: ${score}`}
				</Text>
				<View className="bg-[#484E54] rounded-lg px-3 py-10">
					<Text className="text-sm font-pregular text-slate-200 absolute top-2 left-2">
						{`${i18n.t('play.single.questionCouter')} ` + (currentQuestionIndex + 1) + " / " + questions.length}
					</Text>

					<ScrollView
						className='h-32'
						showsVerticalScrollIndicator={false}
					>
						<Text className='text-2xl font-bold text-white'>
						{questions[currentQuestionIndex]?.question_excerpt || ''}
						</Text>
					</ScrollView>
				</View>

				<View>
					{questions[currentQuestionIndex]?.question_answer_ids.map((answer, index) => {
						let backgroundColor = '#484E54'; // Màu mặc định

						if (showCorrectAnswer) {
							if (questions[currentQuestionIndex].question_type === 'single') {
								if (answer._id === questions[currentQuestionIndex].correct_answer_ids[0]._id) {
									backgroundColor = '#4CAF50'; // Green - Đúng
								} else if (answer._id === selectedAnswers[0]) {
									backgroundColor = '#F44336'; // Red - Sai
								}
							} else {
								if (questions[currentQuestionIndex].correct_answer_ids.map(answer => answer._id).includes(answer._id)) {
									backgroundColor = '#4CAF50'; // Green - Đúng
								} else if (selectedAnswers.includes(answer._id)) {
									backgroundColor = '#F44336'; // Red - Sai
								}
							}
						} else if (selectedAnswers.includes(answer._id)) {
							backgroundColor = '#0D70D2'; // Màu xanh khi người dùng chọn
						}

						return (
							<TouchableOpacity
								key={index}
								onPress={() => handleAnswerPress(answer._id)}
								style={{
									backgroundColor,
									padding: 10,
									marginVertical: 5,
									borderRadius: 5,
								}}
								disabled={showCorrectAnswer} // Vô hiệu hóa khi đã hiển thị kết quả
							>
								<Text className="text-white font-pregular text-lg m-4">
									{answer.text}
								</Text>
							</TouchableOpacity>
						);
					})}
				</View>


				<Button
					text={buttonText}
					onPress={handleSubmit}
					type="fill"
					otherStyles={`${buttonColor} p-4`}
					textStyles={`text-white ${buttonTextColor} mx-auto text-lg`}
					disabled={!isChosen || showCorrectAnswer}
				/>
			</View>
		</View>
	);
};

export default SinglePlay;

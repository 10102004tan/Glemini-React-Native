import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import Button from '../../../components/customs/Button';
import ResultSingle from '../(result)/single';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAppProvider } from '@/contexts/AppProvider';
import Toast from 'react-native-toast-message';
import { API_URL, API_VERSION, END_POINTS } from '../../../configs/api.config';
import RenderHTML from 'react-native-render-html';
import { Audio } from 'expo-av';
import { truncateDescription } from '@/utils'
import { useNavigation, useRoute } from '@react-navigation/native';

const SinglePlay = () => {
	const route = useRoute();
	const navigation = useNavigation()
	const { quiz } = route.params;
	const { i18n } = useAppProvider();
	const { width } = useWindowDimensions();
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
	const [questions, setQuestions] = useState([]);
	const [sound, setSound] = useState(null);

	useEffect(() => {
		const fetchQuestions = async () => {
			try {
				const res = await fetch(API_URL + API_VERSION.V1 + END_POINTS.GET_QUIZ_QUESTIONS, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'x-client-id': userData._id,
						authorization: userData.accessToken,
					},
					body: JSON.stringify({
						quiz_id: quiz._id,
					}),
				});

				const data = await res.json();
				setQuestions(data.metadata);
			} catch (error) {
				console.error('Lỗi khi lấy câu hỏi:', error);
			}
		};
		fetchQuestions();
	}, [userData]);

	const saveQuestionResult = async (questionId, answerId, correct, score) => {
		await fetch(API_URL + API_VERSION.V1 + END_POINTS.RESULT_SAVE_QUESTION, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-id': userData._id,
				authorization: userData.accessToken,
			},
			body: JSON.stringify({
				exercise_id: null,
				user_id: userData._id,
				quiz_id: questions[currentQuestionIndex].quiz_id,
				question_id: questionId,
				answer: answerId,
				correct,
				score,
			}),
		});
	};

	const completed = async () => {
		try {
			await fetch(API_URL + API_VERSION.V1 + END_POINTS.RESULT_COMPLETED, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-client-id': userData._id,
					authorization: userData.accessToken,
				},
				body: JSON.stringify({
					exercise_id: null,
					user_id: userData._id,
					quiz_id: questions[0].quiz_id,
					status: 'completed',
				}),
			});
		} catch (error) {
			console.error('Lỗi khi cập nhật trạng thái hoàn thành:', error);
		}
	};

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
			});
			setIsProcessing(false);
			return;
		}

		const currentQuestion = questions[currentQuestionIndex];
		const correctAnswerIds = currentQuestion.correct_answer_ids.map(answer => answer._id);
		// console.log(selectedAnswers, correctAnswerIds);

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
				completed();
			}
		}, 1500);
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
				quizId={quiz._id}
				correctCount={correctCount}
				wrongCount={wrongCount}
				score={score}
				totalQuestions={questions.length}
				handleRestart={handleRestart}
			/>
		);
	}

	return (
		<View className="flex-1">
			<View className="flex-row justify-between items-center px-5 pt-10 pb-3 bg-black">
				<Text className="font-bold text-lg text-white">{truncateDescription(quiz.quiz_name, 20)}</Text>
				<Button
					text={i18n.t('play.single.buttonQuit')}
					onPress={() => { navigation.popToTop() }}
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
						style={{ maxHeight: 100 }}
						showsVerticalScrollIndicator={false}
					>
						<RenderHTML
							defaultTextProps={{
								style: {
									color: 'white',
									fontSize: 25,
									fontWeight: '700',
								},
							}}
							contentWidth={width}
							source={{
								html: questions[currentQuestionIndex]?.question_excerpt,
							}}
						/>
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

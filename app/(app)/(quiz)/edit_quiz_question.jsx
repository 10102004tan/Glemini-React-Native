import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '../../../constants/Colors';
import { useAppProvider } from '../../../contexts/AppProvider';
import { useQuestionProvider } from '../../../contexts/QuestionProvider';
import Overlay from '../../../components/customs/Overlay';
import Wrapper from '../../../components/customs/Wrapper';
import QuestionAnswerItem from '../../../components/customs/QuestionAnswerItem';
import Button from '../../../components/customs/Button';
import QuestionEditBoard from '../../../components/customs/QuestionEditBoard';
import BottomSheet from '../../../components/customs/BottomSheet';
import { Points, Times, Status } from '../../../constants';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { useQuizProvider } from '../../../contexts/QuizProvider';
import { useGlobalSearchParams } from 'expo-router';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { useAuthContext } from '@/contexts/AuthContext';
const MAX_ANSWER = 8;

const EditQuizQuestion = () => {
	const [pointBotttomSheetVisible, setPointBotttomSheetVisible] =
		useState(false); // bottom sheet để chọn số điểm
	const [timeBotttomSheetVisible, setTimeBotttomSheetVisible] =
		useState(false); // bottom sheet để chọn số điểm
	const [selectedPoint, setSelectedPoint] = useState(1); // số điểm được chọn
	const [selectedTime, setSelectedTime] = useState(30); // thời gian được chọn
	const [mutipleChoice, setMutipleChoice] = useState(true); // cho phép chọn nhiều đáp án
	const [showQuestionBoard, setShowQuestionBoard] = useState(false); // hiển thị giải thích cho câu hỏi
	const [editorType, setEditorType] = useState(''); // loại editor
	const [editorContent, setEditorContent] = useState(''); // nội dung của editor
	const { actionQuizType } = useQuizProvider();
	const {
		question,
		addAnswer,
		resetMarkCorrectAnswer,
		saveQuestion,
		updateQuestionTime,
		updateQuestionPoint,
		editQuestion,
		setQuestion,
		selectQuestionType,
	} = useQuestionProvider();
	const [answerEditSelected, setAnswerEditSelected] = useState(0); // đáp án được chọn
	const { width } = useWindowDimensions();
	const { quizId, questionId } = useGlobalSearchParams();
	const { userData } = useAuthContext();

	// Lấy type của câu hỏi hiện tại để xác định loại câu hỏi
	useEffect(() => {
		console.log("test::edit-quiz-question");
		if (question) {
			if (question.question_type === 'multiple') {
				setMutipleChoice(true);
			} else if (question.question_type === 'single') {
				setMutipleChoice(false);
			}
		}
	}, [question]);

	// Khi người dùng chuyển từ chế độ chọn nhiều câu hỏi sang một câu hỏi thì bỏ chọn tất cả
	useEffect(() => {
		if (!mutipleChoice) {
			resetMarkCorrectAnswer();
			selectQuestionType('single');
		} else {
			selectQuestionType('multiple');
		}
	}, [mutipleChoice]);

	// Lấy thông tin của câu hỏi hiện tại
	const getCurrentUpdateQuestion = async () => {
		const response = await fetch(
			`${API_URL}${API_VERSION.V1}${END_POINTS.GET_QUESTION_DETAIL}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-client-id': userData._id,
					authorization: userData.accessToken,
				},
				body: JSON.stringify({ question_id: questionId }),
			}
		);
		const data = await response.json();
		if (data.statusCode === 200) {
			setQuestion(data.metadata);
		} else {
			// Alert to user here
			console.log('Error when get question details');
		}
	};

	useEffect(() => {
		if (actionQuizType === 'edit') {
			getCurrentUpdateQuestion();
		}
	}, [quizId, questionId, actionQuizType]);

	// Đóng edit board
	const closeEditBoard = () => {
		setShowQuestionBoard(false);
		setAnswerEditSelected(0);
		setEditorContent('');
		setEditorType('');
		setPointBotttomSheetVisible(false);
		setTimeBotttomSheetVisible(false);
	};

	return (
		<Wrapper>
			{/* Overlay */}
			{(showQuestionBoard ||
				pointBotttomSheetVisible ||
				timeBotttomSheetVisible) && (
				<Overlay
					onPress={() => {
						closeEditBoard();
					}}
					type
				/>
			)}
			{/* Bottom Sheet Point */}
			<BottomSheet visible={pointBotttomSheetVisible}>
				<View className="flex flex-col items-start justify-start">
					<Text className="font-semibold text-gray">
						Chọn số điểm
					</Text>
					<View className="flex items-center justify-start flex-row mt-4">
						<ScrollView>
							{Points.questionPoints.map((point, index) => {
								return (
									<TouchableOpacity
										key={index}
										className="flex flex-row items-center justify-start p-2 mb-2 rounded-xl bg-overlay"
										onPress={() => {
											setSelectedPoint(point);
											updateQuestionPoint(point);
											setPointBotttomSheetVisible(false);
										}}
									>
										<Text className="ml-2">
											{point} điểm
										</Text>
									</TouchableOpacity>
								);
							})}
						</ScrollView>
					</View>
				</View>
			</BottomSheet>
			{/* Bottom Sheet Time */}
			<BottomSheet visible={timeBotttomSheetVisible}>
				<View className="flex flex-col items-start justify-start">
					<Text className="font-semibold text-gray">
						Chọn thời gian
					</Text>
					<View className="flex items-center justify-start flex-row mt-4">
						<ScrollView>
							{Times.questionTimes.map((time, index) => {
								return (
									<TouchableOpacity
										key={index}
										className="flex flex-row items-center justify-start p-2 mb-2 rounded-xl bg-overlay"
										onPress={() => {
											setSelectedTime(time);
											updateQuestionTime(time);
											setTimeBotttomSheetVisible(false);
										}}
									>
										<Text className="ml-2">
											{time} giây
										</Text>
									</TouchableOpacity>
								);
							})}
						</ScrollView>
					</View>
				</View>
			</BottomSheet>
			{/* Explain Quesion Box */}
			<QuestionEditBoard
				handleClose={() => {
					closeEditBoard();
				}}
				mutipleChoice={mutipleChoice}
				answerEditSelected={answerEditSelected}
				visible={showQuestionBoard}
				type={editorType}
				content={editorContent}
			/>
			<View className="flex flex-row items-center justify-start p-4">
				<TouchableOpacity
					className="px-4 py-2 rounded-xl bg-overlay flex items-center justify-center flex-row"
					onPress={() => {
						setTimeBotttomSheetVisible(true);
					}}
				>
					<Text className="mr-2">{selectedTime} giây</Text>
					<Entypo name="time-slot" size={15} color="black" />
				</TouchableOpacity>
				<TouchableOpacity
					className="ml-2 px-4 py-2 rounded-xl bg-overlay flex items-center justify-center flex-row"
					onPress={() => {
						setPointBotttomSheetVisible(true);
					}}
				>
					<Text className="mr-2">{selectedPoint} điểm</Text>
					<AntDesign name="checkcircleo" size={15} color="black" />
				</TouchableOpacity>
			</View>
			{/* Edit View */}
			<View className="flex-1 bg-primary p-4">
				<ScrollView>
					<View className="border border-gray overflow-hidden rounded-2xl min-h-[140px] max-h-[400px] flex items-center justify-center p-4">
						<TouchableOpacity
							className={'overflow-hidden'}
							onPress={() => {
								setEditorType(Status.quiz.QUESTION);
								setEditorContent(question.question_excerpt);
								setShowQuestionBoard(true);
							}}
						>
							<RenderHTML
								defaultViewProps={{}}
								defaultWebViewProps={{}}
								defaultTextProps={{
									style: { color: 'white' },
								}}
								contentWidth={width}
								source={{
									html:
										question.question_excerpt ===
										'<div></div>'
											? '<div>Chỉnh sửa câu hỏi của bạn</div>'
											: question.question_excerpt,
								}}
							/>
						</TouchableOpacity>
						{/* <TouchableOpacity className="absolute top-4 right-4">
							<FontAwesome name="image" size={20} color="white" />
						</TouchableOpacity> */}
					</View>
					<View className="flex items-center justify-between mt-4 flex-row">
						<TouchableOpacity
							onPress={() => setMutipleChoice(!mutipleChoice)}
							className="flex items-center justify-center flex-row bg-overlay py-2 px-4 rounded-xl"
							style={
								mutipleChoice
									? { backgroundColor: '#0BCA5E' }
									: {}
							}
						>
							<Text className="text-white">Nhiều lựa chọn</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className="flex items-center justify-center flex-row bg-overlay py-2 px-4 rounded-xl"
							onPress={() => {
								setShowQuestionBoard(true);
								setEditorContent(question.question_explanation);
								setEditorType(Status.quiz.EXPLAINATION);
							}}
						>
							<Text className="text-white">Thêm giải thích</Text>
						</TouchableOpacity>
					</View>
					{/* Answers */}
					<View className="mt-4 flex items-center justify-center flex-col">
						{question.question_answer_ids.map((answer, index) => {
							return (
								<QuestionAnswerItem
									onPress={() => {
										setEditorType(Status.quiz.ANSWER);
										setEditorContent(answer.text);
										setAnswerEditSelected(answer._id);
										setShowQuestionBoard(true);
									}}
									isCorrect={answer.correct}
									key={index}
									answer={answer.text}
									color={Colors.answerColors[index]}
								/>
							);
						})}
					</View>
					<View className="flex items-center justify-between mt-4 flex-row">
						<TouchableOpacity
							className="flex items-center justify-center flex-row bg-overlay py-2 px-4 rounded-xl"
							onPress={() => {
								if (
									question.question_answer_ids.length <
									MAX_ANSWER
								) {
									addAnswer();
								} else {
									// Alert to user here
								}
							}}
						>
							<Text className="text-white">Thêm phương án</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
			{/* Button */}
			<View className="p-4">
				<Button
					onPress={() => {
						if (actionQuizType === 'create') {
							saveQuestion(quizId);
						} else if (actionQuizType === 'edit') {
							editQuestion(quizId, question._id);
						}
					}}
					text={
						actionQuizType === 'create'
							? 'Thêm câu hỏi'
							: 'Lưu câu hỏi'
					}
					otherStyles={'p-4 justify-center'}
					textStyles={'text-center'}
				/>
			</View>
		</Wrapper>
	);
};

export default EditQuizQuestion;

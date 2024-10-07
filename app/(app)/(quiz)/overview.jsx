import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Wrapper from '../../../components/customs/Wrapper';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Button from '../../../components/customs/Button';
import Overlay from '../../../components/customs/Overlay';
import BottomSheet from '../../../components/customs/BottomSheet';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import QuestionOverview from '../../../components/customs/QuestionOverview';
import { useQuestionProvider } from '../../../contexts/QuestionProvider';
import { useQuizProvider } from '../../../contexts/QuizProvider';
import { useAuthContext } from '../../../contexts/AuthContext';
import { API_URL, END_POINTS, API_VERSION } from '@/configs/api.config';
import { useAppProvider } from '@/contexts/AppProvider';
import Field from '@/components/customs/Field';
import { SelectList } from 'react-native-dropdown-select-list';
import { useSubjectProvider } from '@/contexts/SubjectProvider';
import { convertSubjectData } from '@/utils';

const QuizzOverViewScreen = () => {
	const router = useRouter();
	const [
		visibleCreateQuestionBottomSheet,
		setVisibleCreateQuestionBottomSheet,
	] = useState(false);
	const [visibleEditQuizBottomSheet, setVisibleEditQuizBottomSheet] =
		useState(false);

	const { setIsHiddenNavigationBar } = useAppProvider();
	const { id } = useGlobalSearchParams();
	const { userData } = useAuthContext();

	const [quizName, setQuizName] = useState('');
	const [quizDescription, setQuizDescription] = useState('');
	const [quizStatus, setQuizStatus] = useState('');
	const [quizSubject, setQuizSubject] = useState('');

	const {
		selectedQuiz,
		setSelectedQuiz,
		currentQuizQuestion,
		setActionQuizType,
		quizFetching,
		deleteQuiz,
		questionFetching,
		updateQuiz,
	} = useQuizProvider();
	const { resetQuestion } = useQuestionProvider();

	const fetchQuiz = async () => {
		// console.log('Detail quizz Id: ' + id);
		const response = await fetch(
			`${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_DETAIL}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-client-id': userData._id,
					authorization: userData.accessToken,
				},
				body: JSON.stringify({ quiz_id: id }),
			}
		);

		const data = await response.json();
		// console.log(data);
		if (data.statusCode === 200) {
			setSelectedQuiz(data.metadata);
		}
	};

	const handleUpdateQuiz = async () => {
		const quiz = {
			quiz_id: selectedQuiz._id,
			quiz_name: quizName,
			quiz_description: quizDescription,
			quiz_status: quizStatus,
			quiz_subject: quizSubject,
		};

		updateQuiz(quiz);
		handleCloseBottomSheet();
		setQuizName('');
		setQuizDescription('');
		setQuizStatus('');
		setQuizSubject('');
		fetchQuiz();
	};

	// Lưu dữ liệu của quiz hiện tại cho các biến dùng để chỉnh sửa
	useEffect(() => {
		if (selectedQuiz) {
			setQuizName(selectedQuiz.quiz_name);
			setQuizDescription(selectedQuiz.quiz_description);
		}
	}, [selectedQuiz]);

	useEffect(() => {
		// Lấy dữ liệu của quiz hiện tại
		if (id) {
			fetchQuiz();
		}
	}, [id]);

	// Lấy danh sách câu hỏi của bộ quiz hiện tại
	const createQuestion = () => {
		handleCloseBottomSheet();
		router.replace('(app)/(quiz)/edit_quiz_question');
	};

	const handleShowCreateQuizQuestionBottomSheet = () => {
		setActionQuizType('create');
		resetQuestion();
		setIsHiddenNavigationBar(true);
		setVisibleCreateQuestionBottomSheet(true);
	};

	const handleShowBottomSheetEditQuiz = () => {
		setVisibleEditQuizBottomSheet(true);
		setIsHiddenNavigationBar(true);
	};

	const handleCloseBottomSheet = () => {
		setIsHiddenNavigationBar(false);
		setVisibleEditQuizBottomSheet(false);
		setVisibleCreateQuestionBottomSheet(false);
	};

	const { subjects } = useSubjectProvider();
	const subjectsData = convertSubjectData(subjects);
	const views = [
		{ key: '1', value: 'Công khai' },
		{ key: '2', value: 'Chỉ mình tôi' },
	];

	return (
		<Wrapper>
			{/* Overlay */}
			{(visibleCreateQuestionBottomSheet ||
				visibleEditQuizBottomSheet) && (
				<Overlay onPress={handleCloseBottomSheet} />
			)}
			{/* Bottom Sheet Create */}
			<BottomSheet visible={visibleCreateQuestionBottomSheet}>
				<View className="flex flex-col items-start justify-start">
					<Text className="text-lg">Chọn loại câu hỏi</Text>
					<View className="mt-4">
						<Text className="text-sm text-gray">Đánh giá</Text>
						<View className="flex flex-col items-start justify-start mt-2">
							<TouchableOpacity
								className="flex flex-row items-center justify-start"
								onPress={createQuestion}
							>
								<MaterialCommunityIcons
									name="checkbox-outline"
									size={20}
									color="black"
								/>
								<Text className="ml-2">Nhiều lựa chọn</Text>
							</TouchableOpacity>
							<TouchableOpacity className="flex flex-row items-center justify-start mt-1">
								<MaterialCommunityIcons
									name="checkbox-blank-outline"
									size={20}
									color="black"
								/>
								<Text className="ml-2">Điền vào chỗ trống</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View className="mt-4">
						<Text className="text-sm text-gray">Tư duy</Text>
						<View className="flex flex-col items-start justify-start mt-2">
							<TouchableOpacity className="flex flex-row items-center justify-start">
								<MaterialCommunityIcons
									name="text"
									size={20}
									color="black"
								/>
								<Text className="ml-2">Tự luận</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</BottomSheet>

			{/* Bottom Sheet Edit */}
			<BottomSheet visible={visibleEditQuizBottomSheet}>
				<View className="flex flex-col items-start justify-start">
					<View className="w-full">
						<Field
							wrapperStyles="w-full"
							label={'Tên'}
							value={quizName}
							onChange={(text) => setQuizName(text)}
							placeholder={'Nhập tên của bộ Quiz'}
						/>
					</View>
					<View className="w-full mt-4">
						<Field
							wrapperStyles="w-full"
							label={'Mô tả'}
							value={quizDescription}
							onChange={(text) => setQuizDescription(text)}
							placeholder={'Thêm mô tả cho bộ quiz này'}
						/>
					</View>
					<View className="w-full mt-4">
						<Text className="text-gray mb-1">
							Lĩnh vực, môn học
						</Text>
						<SelectList
							setSelected={(key, val) => setQuizSubject(key)}
							data={subjectsData}
							searchPlaceholder="Tìm kiếm môn học, lĩnh vực"
						/>
					</View>
					<View className="w-full mt-4">
						<Text className="text-gray mb-1">Chế độ hiển thị</Text>
						<SelectList
							setSelected={(val) => setQuizStatus(val)}
							data={views}
							searchPlaceholder="Chế độ hiển thị"
						/>
					</View>
					<View className="flex items-center justify-end mt-4 flex-row w-full">
						<Button
							text="Lưu"
							onPress={() => {
								handleUpdateQuiz();
							}}
							otherStyles="p-4 justify-center w-1/3 mr-2"
							textStyles="text-white"
						/>
						<Button
							text="Hủy bỏ"
							onPress={() => {
								handleCloseBottomSheet();
							}}
							otherStyles="p-4 justify-center w-1/3 bg-red-500"
							textStyles="text-white"
						/>
					</View>
				</View>
			</BottomSheet>

			<ScrollView className="mb-[100px]">
				{quizFetching ? (
					<Text>Loading</Text>
				) : (
					<>
						<View className="p-4 flex items-center justify-center flex-col">
							<TouchableOpacity className="flex items-center justify-center flex-col rounded-2xl bg-overlay w-full min-h-[120px]">
								<Ionicons
									name="image-outline"
									size={24}
									color="black"
								/>
								<Text className="text-center mt-1">
									Thêm hình ảnh
								</Text>
							</TouchableOpacity>
						</View>
						{/* Quiz infor */}
						<View className="mt-4 p-4">
							<View className="flex items-center justify-between flex-row">
								<View>
									<Text className="text-lg">
										{quizName || 'Tên bộ quiz'}
									</Text>
									<Text className="text-gray">
										{quizDescription ||
											'Thêm mô tả cho bộ quiz này'}
									</Text>
								</View>
								<View className="flex items-center flex-row justify-center">
									<TouchableOpacity
										onPress={() => {
											handleShowBottomSheetEditQuiz();
										}}
									>
										<MaterialIcons
											name="edit"
											size={24}
											color="black"
										/>
									</TouchableOpacity>

									<TouchableOpacity
										onPress={() => {
											deleteQuiz(selectedQuiz._id);
											router.replace('(app)/(quiz)/list');
										}}
									>
										<MaterialIcons
											name="delete"
											size={24}
											color="black"
										/>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</>
				)}
				{/* Quiz Questions */}
				{questionFetching ? (
					<Text>Loading</Text>
				) : (
					<View className="mt-2 p-4">
						<Text className="mb-2">Chỉnh sửa câu hỏi</Text>
						{currentQuizQuestion.length > 0 &&
							currentQuizQuestion.map((question, index) => {
								return (
									<QuestionOverview
										key={index}
										question={question}
										index={index}
									/>
								);
							})}
					</View>
				)}
			</ScrollView>
			<View className="p-4 absolute bg-white bottom-0 w-full">
				<Button
					onPress={handleShowCreateQuizQuestionBottomSheet}
					text={'Tạo câu hỏi'}
					otherStyles={'p-4 justify-center'}
					textStyles={'text-center'}
				/>
			</View>
		</Wrapper>
	);
};

export default QuizzOverViewScreen;

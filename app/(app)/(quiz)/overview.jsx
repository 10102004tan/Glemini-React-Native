import { View, Text, TouchableOpacity, Image } from 'react-native';
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
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';

import {
	MultipleSelectList,
	SelectList,
} from 'react-native-dropdown-select-list';
import { useSubjectProvider } from '@/contexts/SubjectProvider';
import { convertSubjectData } from '@/utils';
import QuestionOverviewSkeleton from '@/components/loadings/QuestionOverviewSkeleton';
import QuizInforSkeleton from '@/components/loadings/QuizInforSkeleton';
import { Feather } from '@expo/vector-icons';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';

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
	const [quizId, setQuizId] = useState('');
	const [quizName, setQuizName] = useState('');
	const [quizDescription, setQuizDescription] = useState('');
	const [quizStatus, setQuizStatus] = useState('');
	const [quizSubjects, setQuizSubjects] = useState([]);
	const [quizThumbnail, setQuizThumbnail] = useState('');
	const [currentQuizQuestion, setCurrentQuizQuestion] = useState([]);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

	const {
		setActionQuizType,
		quizFetching,
		deleteQuiz,
		questionFetching,
		updateQuiz,
		setQuestionFetching,
		isSave,
	} = useQuizProvider();
	const { resetQuestion } = useQuestionProvider();

	// Lưu thông tin của quiz khi người dùng ấn nút lưu trên thanh header
	useEffect(() => {
		if (isSave) {
			handleUpdateQuiz(id);
		}
	}, [isSave]);

	// Lấy thông tin của quiz hiện tại
	const fetchQuiz = async () => {
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
		if (data.statusCode === 200) {
			setQuizId(data.metadata._id);
			setQuizThumbnail(data.metadata.quiz_thumb);
			setQuizName(data.metadata.quiz_name);
			setQuizDescription(data.metadata.quiz_description);
			setQuizStatus(data.metadata.quiz_status);
			setQuizSubjects(data.metadata.subject_ids);
		}
	};

	// Lấy danh sách các câu hỏi thuộc quiz hiện tại
	const fetchQuestions = async () => {
		setQuestionFetching(true);
		const response = await fetch(
			`${API_URL}${API_VERSION.V1}${END_POINTS.GET_QUIZ_QUESTIONS}`,
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
		// console.log(data.metadata);
		if (data.statusCode === 200) {
			setCurrentQuizQuestion(data.metadata);
		} else {
			setCurrentQuizQuestion([]);
		}
		setQuestionFetching(false);
	};

	// Cập nhật thông tin của quiz
	const handleUpdateQuiz = async (id) => {
		const quiz = {
			quiz_id: id,
			quiz_name: quizName,
			quiz_description: quizDescription,
			quiz_status: quizStatus,
			quiz_subjects: quizSubjects,
			quiz_thumb: quizThumbnail,
		};

		updateQuiz(quiz);
		// handleCloseBottomSheet();
	};

	useEffect(() => {
		// Lấy dữ liệu của quiz hiện tại
		// console.log(id);
		if (id) {
			fetchQuiz();
			fetchQuestions();
		}
	}, [id]);

	// Lấy danh sách câu hỏi của bộ quiz hiện tại
	const createQuestion = () => {
		handleCloseBottomSheet();
		router.push({
			pathname: '(app)/(quiz)/edit_quiz_question',
			params: { quizId: id },
		});
	};

	// Hiển thị bottom sheet tạo câu hỏi
	const handleShowCreateQuizQuestionBottomSheet = () => {
		setActionQuizType('create');
		resetQuestion();
		setIsHiddenNavigationBar(true);
		setVisibleCreateQuestionBottomSheet(true);
	};

	// Hiển thị bottom sheet chỉnh sửa thông tin quiz
	const handleShowBottomSheetEditQuiz = () => {
		setVisibleEditQuizBottomSheet(true);
		setIsHiddenNavigationBar(true);
	};

	// Đóng bottom sheet
	const handleCloseBottomSheet = () => {
		setIsHiddenNavigationBar(false);
		setVisibleEditQuizBottomSheet(false);
		setVisibleCreateQuestionBottomSheet(false);
	};

	// Lấy dữ liệu môn học
	const { subjects } = useSubjectProvider();
	const subjectsData = convertSubjectData(subjects);

	// Chế độ hiển thị của quiz
	const views = [
		{ key: '1', value: 'Công khai', data_value: 'published' },
		{ key: '2', value: 'Chỉ mình tôi', data_value: 'unpublished' },
	];

	// Hàm tải ảnh lên server
	const uploadImage = async (imageUri) => {
		const formData = new FormData();
		formData.append('quiz_image', {
			uri: imageUri,
			name: 'photo.jpg',
			type: 'image/jpeg',
		});

		const response = await fetch(
			`${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_UPLOAD_IMAGE}`,
			{
				method: 'POST',
				body: formData,
				headers: {
					'Content-Type': 'multipart/form-data',
					'x-client-id': userData._id,
					authorization: userData.accessToken,
				},
			}
		);

		const data = await response.json();
		return data.url; // URL của ảnh trên server
	};

	// Hàm chọn ảnh từ thư viện
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled && result.assets.length > 0) {
			const imageUri = result.assets[0].uri;
			console.log(imageUri);

			// Tải ảnh lên server và lấy URL của ảnh
			const imageUrl = await uploadImage(imageUri);
			setQuizThumbnail(imageUrl);
		}
	};

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
						<MultipleSelectList
							defaultOption={{
								key: '670241a2b71c3303d716e00e',
								value: 'Khác',
							}}
							setSelected={(key, val) => setQuizSubjects(key)}
							data={subjectsData}
							// onSelect={() => console.log('runn')}
							searchPlaceholder="Tìm kiếm môn học, lĩnh vực"
						/>
					</View>
					<View className="w-full mt-4">
						<Text className="text-gray mb-1">Chế độ hiển thị</Text>
						<SelectList
							defaultOption={
								quizStatus === 'unpublished'
									? views[1]
									: views[0]
							}
							setSelected={(key, val) => setQuizStatus(key)}
							data={views}
							searchPlaceholder="Chế độ hiển thị"
						/>
					</View>
					{/* <View className="flex items-center justify-end mt-4 flex-row w-full">
						<Button
							text="Lưu"
							onPress={() => {
								setQuizFetching(true);
								handleUpdateQuiz(id);
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
					</View> */}
				</View>
			</BottomSheet>

			{/* Confirm dialog */}
			<ConfirmDialog
				title={'Chờ đã'}
				visible={showConfirmDialog}
				onCancel={() => setShowConfirmDialog(false)}
				onConfirm={() => {
					deleteQuiz(id);
					setShowConfirmDialog(false);
					router.back('(app)/(quiz)/list');
				}}
				message={'Bạn chắc chắn muốn xóa bộ quiz này?'}
			/>

			<ScrollView className="mb-[100px]">
				{quizFetching ? (
					<QuizInforSkeleton />
				) : (
					<>
						<View className="p-4 flex items-center justify-center flex-col">
							{quizThumbnail ? (
								<>
									<Image
										className="w-full max-h-[300px] h-[260px] rounded-2xl"
										source={{ uri: quizThumbnail }}
									></Image>
								</>
							) : (
								<TouchableOpacity
									className="flex items-center justify-center flex-col rounded-2xl bg-overlay w-full min-h-[120px]"
									onPress={() => {
										pickImage();
									}}
								>
									<Ionicons
										name="image-outline"
										size={24}
										color="black"
									/>
									<Text className="text-center mt-1">
										Thêm hình ảnh
									</Text>
								</TouchableOpacity>
							)}
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
										className="p-2 rounded-full bg-primary w-10 flex items-center justify-center h-10"
										onPress={() => {
											handleShowBottomSheetEditQuiz();
										}}
									>
										<Feather
											name="edit-3"
											size={20}
											color="white"
										/>
									</TouchableOpacity>

									<TouchableOpacity
										className="ml-2 p-2 rounded-full bg-primary w-10 flex items-center justify-center h-10"
										onPress={() => {
											setShowConfirmDialog(true);
										}}
									>
										<FontAwesome
											name="trash-o"
											size={20}
											color="white"
										/>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</>
				)}
				{/* Quiz Questions */}
				{questionFetching ? (
					<>
						<View className="mt-2 p-4">
							<QuestionOverviewSkeleton />
						</View>
					</>
				) : (
					<View className="mt-2 p-4">
						<Text className="mb-2">Chỉnh sửa câu hỏi</Text>
						{currentQuizQuestion.length > 0 &&
							currentQuizQuestion.map((question, index) => {
								return (
									<QuestionOverview
										key={index}
										quizId={quizId}
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

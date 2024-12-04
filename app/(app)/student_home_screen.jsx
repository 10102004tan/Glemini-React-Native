import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, ScrollView, RefreshControl } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Images } from '@/constants';
import { useAppProvider } from '@/contexts/AppProvider';
import { useQuizProvider } from '@/contexts/QuizProvider';
import QuizItem from '@/components/customs/QuizItem';
import QuizModal from '@/components/modals/QuizModal';
import NotificationIcon from "@/components/customs/NotificationIcon";
import { AuthContext } from "@/contexts/AuthContext";
import { useResultProvider } from '@/contexts/ResultProvider';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message-custom';
import Lottie from '@/components/loadings/Lottie';
import AntDesign from "@expo/vector-icons/AntDesign";

const StudentHomeScreen = () => {
	const { i18n } = useAppProvider();
	const { fetchResultData } = useResultProvider();
	const { filterQuizzes, getQuizzesPublished, bannerQuizzes, getQuizzesBanner } = useQuizProvider();
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedQuiz, setSelectedQuiz] = useState(null);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const width = Dimensions.get('window').width;
	const carouselHeight = width * 2 / 3;
	const { numberOfUnreadNoti } = useContext(AuthContext);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			await getQuizzesPublished();
			await getQuizzesBanner();
			setLoading(false);
		};

		fetchData();
	}, [])

	const onRefresh = async () => {
		setRefreshing(true);
		await getQuizzesPublished();
		await getQuizzesBanner();
		setRefreshing(false);
	};

	const handlePressQuizItem = (quiz) => {
		setSelectedQuiz(quiz);
		setModalVisible(true);
	};

	const handleNavigateToQuiz = async () => {
		setModalVisible(false);
		const fetchedResult = await fetchResultData({ quizId: selectedQuiz._id, type: 'publish' });

		if (fetchedResult) {
			Toast.show({
				type: 'info',
				text1: 'Bạn đã chơi bộ câu hỏi này.'
			});
			router.push({
				pathname: '/(home)/activity',
			});
		} else {
			router.push({
				pathname: '(play)/single',
				params: { quizId: selectedQuiz._id, type: 'publish' }
			});
		}
	};

	return (
		<View className='flex-1 pt-10'>
			<View className={"flex-row justify-end"}>
				<NotificationIcon numberOfUnreadNoti={numberOfUnreadNoti} color={"black"} />
			</View>

			{loading ? (
				<Lottie
					source={require('@/assets/jsons/loading.json')}
					width={150}
					height={150}
				/>
			) : (
				<ScrollView
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
					className='mb-20'>
					<View className={bannerQuizzes.length > 0 ? `flex h-[${carouselHeight}px]` : `hidden`}>
						<Carousel
							loop
							width={width}
							height={carouselHeight}
							autoPlay={true}
							data={bannerQuizzes}
							mode='parallax'
							scrollAnimationDuration={2500}
							renderItem={({ item, index }) => (
								<TouchableOpacity onPress={() => handlePressQuizItem(item)}>
									<View className='absolute z-10 top-5 left-5 px-3 py-1 rounded bg-blue-500/80'>
										<Text className='text-xl font-bold text-white'>{index + 1}</Text>
									</View>
									<Image
										source={item.quiz_thumb ? { uri: item.quiz_thumb } : Images.banner1}
										className="w-full h-full rounded-2xl"
										style={{ resizeMode: 'cover' }}
									/>
								</TouchableOpacity>
							)}
						/>
					</View>
					{
						filterQuizzes && filterQuizzes.length > 0 ? (
							<View className="px-4 mt-4 flex-1">
								{/* Display subjects and their quizzes */}
								{
									filterQuizzes.map(({ subject, quizzes }) => {
										return (
											<View key={subject._id} className="mb-4">
												<View className='flex-row justify-between mb-2'>
													<Text className="text-xl font-bold">{i18n.t(`subjects.${subject.name}`)}</Text>

													<TouchableOpacity className={"flex-row items-center rounded gap-1"} onPress={() => {
														router.push({
															pathname: '/(home)/search',
															params: { subjectId: subject._id }
														});
													}}>
														<AntDesign name={"search1"} size={20} color={"black"} />
														<Text className="text-base">{i18n.t('student_homepage.btnSeeMore')}</Text>
													</TouchableOpacity>
												</View>
												{/* Horizontal ScrollView to display quizzes in rows of two items each */}
												<ScrollView horizontal showsHorizontalScrollIndicator={false} className='w-full'>
													{quizzes.map((quiz) => (
														<View key={quiz._id} className="flex-row px-[6px]">
															<TouchableOpacity onPress={() => handlePressQuizItem(quiz)} className="flex-1 w-40">
																<QuizItem quiz={quiz} />
															</TouchableOpacity>
														</View>
													))}
												</ScrollView>
											</View>
										);
									})
								}
							</View>
						) : (
							// Empty state
							<Lottie
								source={require('@/assets/jsons/empty.json')}
								width={150}
								height={150}
								text={i18n.t('student_homepage.emptyList')}
							/>
						)}
				</ScrollView>
			)}

			{/* Quiz Modal */}
			<QuizModal
				visible={modalVisible}
				onClose={() => setModalVisible(false)}
				onStartQuiz={handleNavigateToQuiz}
				quiz={selectedQuiz}
			/>
		</View>
	);
};

export default StudentHomeScreen;
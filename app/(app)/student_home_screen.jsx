import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, ScrollView, FlatList, Pressable } from 'react-native';
import Wrapper from '@/components/customs/Wrapper';
import Carousel from 'react-native-reanimated-carousel';
import { Images } from '@/constants';
import { useAppProvider } from '@/contexts/AppProvider';
import { useSubjectProvider } from '@/contexts/SubjectProvider';
import { useQuizProvider } from '@/contexts/QuizProvider';
import QuizItem from '@/components/customs/QuizItem';
import { useNavigation } from '@react-navigation/native';
import QuizModal from '@/components/modals/QuizModal';
import NotificationIcon from "@/components/customs/NotificationIcon";
import { AuthContext } from "@/contexts/AuthContext";
import { useResultProvider } from '@/contexts/ResultProvider';
import { router, useFocusEffect } from 'expo-router';
import LottieView from 'lottie-react-native';

const StudentHomeScreen = () => {
	const { i18n } = useAppProvider();
	const { fetchResultData } = useResultProvider();
	const { filterQuizzes, getQuizzesPublished, bannerQuizzes, getQuizzesBanner } = useQuizProvider();
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedQuiz, setSelectedQuiz] = useState(null);
	const width = Dimensions.get('window').width;
	const carouselHeight = width * 2 / 3;
	const { numberOfUnreadNoti } = useContext(AuthContext);

	useFocusEffect(
		useCallback(() => {
			getQuizzesPublished();
			getQuizzesBanner();
		}, [])
	)

	const handlePressQuizItem = (quiz) => {
		setSelectedQuiz(quiz);
		setModalVisible(true);
	};

	const handleNavigateToQuiz = async () => {
		setModalVisible(false);
		const fetchedResult = await fetchResultData({ quizId: selectedQuiz._id, type: 'publish' });

		if (fetchedResult) {
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
			{filterQuizzes && filterQuizzes.length > 0 ?
				<ScrollView
					showsVerticalScrollIndicator={false}
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
							renderItem={({ item }) => (
								<TouchableOpacity onPress={() => handlePressQuizItem(item)}>
									<Image
										source={item.quiz_thumb ? { uri: item.quiz_thumb } : Images.banner1}
										className="w-full h-full rounded-2xl"
										style={{ resizeMode: 'cover' }}
									/>
								</TouchableOpacity>
							)}
						/>
					</View>

					{/* Quizzes List */}
					<View className="px-4 mt-4 flex-1">
						{/* Display subjects and their quizzes */}
						{
							filterQuizzes.map(({ subject, quizzes }) => {
								return (
									<View key={subject._id} className="mb-4">
										<View className='flex-row justify-between mb-1'>
											<Text className="text-xl font-bold">{subject.name}</Text>
											<TouchableOpacity onPress={() => {
												router.push({
													pathname: '/(home)/search',
													params: { subjectId: subject._id }
												})
											}}>
												<Text className="text-base">Xem thêm</Text>
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
								)
							})
						}
					</View>

				</ScrollView>
				:
				<View className='flex-1 items-center justify-center'>
					<LottieView
						source={require('@/assets/jsons/loading.json')}
						autoPlay
						loop
						style={{ width: 150, height: 150 }}
					/>
				</View>
			}

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

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, ScrollView } from 'react-native';
import Wrapper from '@/components/customs/Wrapper';
import Carousel from 'react-native-reanimated-carousel';
import { Images } from '@/constants';
import { useAppProvider } from '@/contexts/AppProvider';
import { useSubjectProvider } from '@/contexts/SubjectProvider';
import { useQuizProvider } from '@/contexts/QuizProvider';
import QuizItem from '@/components/customs/QuizItem';
import { useNavigation } from '@react-navigation/native';
import QuizModal from '@/components/modals/QuizModal';
import LottieView from 'lottie-react-native';
import { router, useFocusEffect } from 'expo-router';
import NotificationIcon from "@/components/customs/NotificationIcon";
import { AuthContext } from "@/contexts/AuthContext";

const StudentHomeScreen = () => {
	const { i18n } = useAppProvider();
	const { subjects } = useSubjectProvider();
	const { filterQuizzes, getQuizzesPublished, bannerQuizzes, getQuizzesBanner } = useQuizProvider();
	const [selectedSubject, setSelectedSubject] = useState('all');
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedQuiz, setSelectedQuiz] = useState(null);
	const width = Dimensions.get('window').width;
	const carouselHeight = width * 2 / 3;
	const { numberOfUnreadNoti } = useContext(AuthContext);


	useEffect(() => {
		getQuizzesPublished(selectedSubject);

	}, [selectedSubject])

	useFocusEffect(
		useCallback(() => {
			setSelectedSubject('all')
			getQuizzesPublished(selectedSubject);
			getQuizzesBanner();
		}, [])
	);

	const handlePressQuizItem = (quiz) => {
		setSelectedQuiz(quiz);
		setModalVisible(true);
	};

	const handleNavigateToQuiz = () => {
		setModalVisible(false);

		router.push({
			pathname: '(play)/single',
			params: { quizId: selectedQuiz._id }
		})

	};

	return (
		<View className='flex-1 pt-10'>
			<ScrollView
				showsVerticalScrollIndicator={false}
				className='mb-20'>
				<View className={"flex-row justify-end"}>
					<NotificationIcon numberOfUnreadNoti={numberOfUnreadNoti} color={"black"} />
				</View>
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
							<TouchableOpacity onPress={() => {
								handlePressQuizItem(item)
							}}>
								<Image
									source={item.quiz_thumb ? { uri: item.quiz_thumb } : Images.banner1}
									className="w-full h-full rounded-2xl"
									style={{ resizeMode: 'cover' }}
								/>
							</TouchableOpacity>
						)}
					/>
				</View>

				<View className='px-4 mt-1'>
					<Text className='text-2xl font-bold'>{i18n.t('student_homepage.explore')}</Text>
				</View>

				<View className='h-10 px-4 mt-2'>
					<ScrollView className='flex gap-2 h-full' showsHorizontalScrollIndicator={false} horizontal>
						<TouchableOpacity
							onPress={() => setSelectedSubject('all')}
							className=' rounded-lg my-auto'
							style={{
								borderColor: selectedSubject === 'all' ? '#00cec9' : '#b9c3c3',
								backgroundColor: selectedSubject === 'all' ? '#00cec9' : '#dfe6e9',
								elevation: selectedSubject === 'all' ? 3 : 0,
							}}
						>
							<Text className='p-2' style={{ color: selectedSubject === 'all' ? '#fff' : '#000' }}>{i18n.t('student_homepage.categoryAll')}</Text>
						</TouchableOpacity>
						{subjects?.map((subject) => (
							<TouchableOpacity
								key={subject._id}
								onPress={() => setSelectedSubject(subject._id)}
								className='rounded-lg my-auto'
								style={{
									borderColor: selectedSubject === subject._id ? '#00cec9' : '#b9c3c3',
									backgroundColor: selectedSubject === subject._id ? '#00cec9' : '#dfe6e9',
									elevation: selectedSubject === subject._id ? 3 : 0,
								}}
							>
								<Text className='p-2' style={{ color: selectedSubject === subject._id ? '#fff' : '#000' }}>
									{subject.name}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>

				<View className='px-4 pt-4 flex gap-2'>
					{filterQuizzes?.length > 0 ? (
						filterQuizzes.map((quiz) => (
							<TouchableOpacity key={quiz._id} onPress={() => handlePressQuizItem(quiz)}>
								<QuizItem quiz={quiz} />
							</TouchableOpacity>
						))
					) : (
						<View className='w-11/12 h-96 flex items-center justify-center'>
							<LottieView
								source={require('@/assets/jsons/not-found.json')}
								autoPlay
								loop
								style={{
									width: width * 2 / 3,
									height: carouselHeight,
								}}
							/>
						</View>
					)}
				</View>
			</ScrollView>

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

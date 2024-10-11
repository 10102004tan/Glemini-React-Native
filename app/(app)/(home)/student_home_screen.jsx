import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, ScrollView } from 'react-native';
import Wrapper from '@/components/customs/Wrapper';
import Carousel from 'react-native-reanimated-carousel';
import { Images } from '@/constants';
import { useAppProvider } from '@/contexts/AppProvider';
import { useSubjectProvider } from '@/contexts/SubjectProvider';
import { useQuizProvider } from '@/contexts/QuizProvider';

const StudentHomeScreen = () => {
	const { i18n } = useAppProvider();
	const { subjects } = useSubjectProvider();
	const { getQuizzesPublished } = useQuizProvider();

	const dataSet = [Images.banner1, Images.banner2, Images.banner3];
	const width = Dimensions.get('window').width;
	const carouselHeight = width * 2 / 3;

	const [selectedSubject, setSelectedSubject] = useState('all');
	const [filteredQuizzes, setFilteredQuizzes] = useState([]);

	useEffect(() => {
		const quizzes = getQuizzesPublished(selectedSubject);
		setFilteredQuizzes(quizzes);
	}, [selectedSubject, getQuizzesPublished]);
	console.log(filteredQuizzes);

	return (
		<Wrapper>
			<View style={{ marginTop: 24, height: carouselHeight }}>
				<Carousel
					loop
					width={width}
					height={carouselHeight}
					autoPlay={true}
					data={dataSet}
					mode='parallax'
					scrollAnimationDuration={2500}
					renderItem={({ item }) => (
						<Image
							source={item}
							className="w-full h-full rounded-2xl"
							style={{ resizeMode: 'cover' }}
						/>
					)}
				/>
			</View>

			<View className='px-4 mt-1'>
				<Text className='text-2xl font-bold'>{i18n.t('student_homepage.explore')}</Text>
			</View>

			<View className='h-10 px-4'>
				<ScrollView
					className='flex gap-2 h-full'
					showsHorizontalScrollIndicator={false}
					horizontal
				>
					<TouchableOpacity
						onPress={() => setSelectedSubject('all')}
						className=' rounded-lg my-auto'
						style={{
							borderColor: selectedSubject === 'all' ? '#3498db' : '#b9c3c3',
							backgroundColor: selectedSubject === 'all' ? '#3498db' : '#e0e0e0',
							elevation: selectedSubject === 'all' ? 3 : 0,
						}}
					>
						<Text className='p-2' style={{ color: selectedSubject === 'all' ? '#fff' : '#000' }}>Tất cả</Text>
					</TouchableOpacity>
					{subjects?.map((subject) => (
						<TouchableOpacity
							key={subject._id}
							onPress={() => setSelectedSubject(subject._id)}
							className=' rounded-lg my-auto'
							style={{
								borderColor: selectedSubject === subject._id ? '#3498db' : '#b9c3c3',
								backgroundColor: selectedSubject === subject._id ? '#3498db' : '#e0e0e0',
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

			<View style={{ paddingHorizontal: 16, marginTop: 16 }}>
				{filteredQuizzes.length > 0 ? (
					filteredQuizzes.map((quiz) => (
						<View key={quiz._id} style={{ marginBottom: 16 }}>
							<Text>{quiz.quiz_name}</Text>
						</View>
					))
				) : (
					<Text>Không có quiz nào được tìm thấy</Text>
				)}
			</View>
		</Wrapper>
	);
};

export default StudentHomeScreen;

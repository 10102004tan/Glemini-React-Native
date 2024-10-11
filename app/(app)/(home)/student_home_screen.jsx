import { View, Text, Dimensions, Image } from 'react-native';
import React, { useState } from 'react';
import Wrapper from '@/components/customs/Wrapper';
import Carousel from 'react-native-reanimated-carousel';
import { Images } from '@/constants';
import { useAppProvider } from '@/contexts/AppProvider';
import { useQuizProvider } from '@/contexts/QuizProvider';

const StudentHomeScreen = () => {
	const { i18n } = useAppProvider();

	const [loading, setLoading] = useState(true); 
	const dataSet = [Images.banner1, Images.banner2, Images.banner3];
	const width = Dimensions.get('window').width;

	const onImageLoad = () => {
		setLoading(false);
	};

	return (
		<Wrapper>
			<View className='mt-6'>
				<Carousel
					loop
					width={width}
					height={width * 2 / 3}
					autoPlay={true}
					data={dataSet}
					mode='parallax'
					scrollAnimationDuration={2500}
					renderItem={({ item }) => (
						<Image
							source={item}
							className="w-full h-full rounded-2xl"
							style={{ resizeMode: 'cover' }}
							onLoad={onImageLoad}
						/>
					)}
				/>
			</View>

			<View className='px-4'>
				<Text className='text-2xl font-bold'>{i18n.t('student_homepage.exprole')}</Text>
			</View>
		</Wrapper>
	);
};

export default StudentHomeScreen;

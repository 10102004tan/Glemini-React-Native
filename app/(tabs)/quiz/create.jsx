import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import Wrapper from '../../../components/customs/Wrapper';
import { Images } from '../../../constants';
import Field from '../../../components/customs/Field';
import AntDesign from '@expo/vector-icons/AntDesign';
import PressAction from '../../../components/customs/PressAction';
import Ionicons from '@expo/vector-icons/Ionicons';
import BottomSheet from '../../../components/customs/BottomSheet';
import { useAppProvider } from '../../../contexts/AppProvider';
import QuizzCreateAction from '../../../components/customs/QuizzCreateAction';
import { useRouter } from 'expo-router';
import Overlay from '../../../components/customs/Overlay';

const CreateQuizzScreen = () => {
	const { isHiddenNavigationBar, setIsHiddenNavigationBar } =
		useAppProvider();
	const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
	const router = useRouter();

	const handleCreateQuiz = () => {
		setIsHiddenNavigationBar(true);
		setVisibleBottomSheet(true);
	};

	const handleCloseBottomSheet = () => {
		setIsHiddenNavigationBar(false);
		setVisibleBottomSheet(false);
	};

	return (
		<Wrapper>
			{/* Overlay */}
			{visibleBottomSheet && <Overlay onPress={handleCloseBottomSheet} />}

			{/* Bottom Sheet */}
			<BottomSheet visible={visibleBottomSheet}>
				<View className="flex flex-col items-start justify-start">
					<Text className="text-lg">Tạo bài kiểm tra với AI</Text>
					<View className="flex items-center justify-start flex-row mt-4">
						<QuizzCreateAction
							title={'Tạo bài kiểm tra'}
							icon={
								<Ionicons
									name="documents-outline"
									size={24}
									color="black"
								/>
							}
						/>
						<QuizzCreateAction
							otherStyles="ml-2"
							title={'Tạo từ văn bản'}
							icon={
								<Ionicons
									name="text-outline"
									size={24}
									color="black"
								/>
							}
						/>
					</View>
					<Text className="text-lg mt-8">Tạo thủ công</Text>
					<View className="flex items-center justify-start flex-row mt-4">
						<QuizzCreateAction
							title={'Tải lên mẫu'}
							icon={
								<Ionicons
									name="documents-outline"
									size={24}
									color="black"
								/>
							}
						/>
						<QuizzCreateAction
							onPress={() => router.push('/quiz/create_title')}
							otherStyles="ml-2"
							title={'Tạo bằng tay'}
							icon={
								<Ionicons
									name="hand-left-outline"
									size={24}
									color="black"
								/>
							}
						/>
					</View>
				</View>
			</BottomSheet>

			{/* Header */}
			<View className="px-4 py-6 bg-primary rounded-b-3xl">
				{/* Teacher Info */}
				<View className="flex flex-row items-center justify-start">
					<Image source={Images.woman} />
					<View className="ml-3 max-w-[330px]">
						<Text className="text-lg font-pmedium text-white">
							Tên của giáo viên
						</Text>
						<Text className="text-white">Mô tả về giáo viên </Text>
					</View>
				</View>

				{/* Search */}
				<Field
					icon={<AntDesign name="search1" size={24} color="black" />}
					inputStyles="bg-white"
					placeholder={'Tìm kiếm một bài kiểm tra hoặc bài học'}
				/>

				{/* Actions */}
				<View className="flex flex-row items-center justify-between mt-6">
					<PressAction
						onPress={handleCreateQuiz}
						title={'Tạo Quiz'}
						icon={<AntDesign name="plus" size={24} color="black" />}
					/>
					<PressAction
						title={'Thư viện của tôi'}
						icon={
							<Ionicons
								name="library-outline"
								size={24}
								color="black"
							/>
						}
					/>
					<PressAction
						title={'Báo cáo'}
						icon={
							<Ionicons
								name="analytics-outline"
								size={24}
								color="black"
							/>
						}
					/>
				</View>
			</View>
		</Wrapper>
	);
};

export default CreateQuizzScreen;

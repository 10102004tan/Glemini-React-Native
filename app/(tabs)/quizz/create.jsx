import { View, Text, Image } from 'react-native';
import React from 'react';
import Wrapper from '../../../components/customs/Wrapper';
import { Images } from '../../../constants';
import Field from '../../../components/customs/Field';
import AntDesign from '@expo/vector-icons/AntDesign';
import PressAction from '../../../components/customs/PressAction';
import Ionicons from '@expo/vector-icons/Ionicons';
import BottomSheet from '../../../components/customs/BottomSheet';
import { useAppProvider } from '../../../contexts/AppProvider';
const CreateQuizzScreen = () => {
	const { setIsShowBottomSheet, isShowBottomSheet } = useAppProvider();
	const handleCreateQuiz = () => {
		setIsShowBottomSheet(true);
	};

	return (
		<Wrapper>
			{/* Overlay */}
			{isShowBottomSheet && (
				<View className="absolute top-0 left-0 bottom-0 right-0 bg-overlay z-50"></View>
			)}
			{/* Bottom Sheet */}
			<BottomSheet />
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
				{/* Search  */}
				<Field
					icon={<AntDesign name="search1" size={24} color="black" />}
					inputStyles="bg-white"
					placeholder={'Tìm kiếm một bài kiểm tra hoặc bài học'}
				/>
				{/* Actions */}
				<View className="flex flex-row items-center justify-between mt-6">
					<PressAction
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

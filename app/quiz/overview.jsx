import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Wrapper from '../../components/customs/Wrapper';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Button from '../../components/customs/Button';
import { useAppProvider } from '../../contexts/AppProvider';
import Overlay from '../../components/customs/Overlay';
import BottomSheet from '../../components/customs/BottomSheet';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';

const QuizzOverViewScreen = () => {
	const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
	const { isShowBottomSheet, setIsShowBottomSheet } = useAppProvider();

	const createQuestion = () => {
		router.push('quiz/editquizquestion');
	};

	const handleCreateQuizQuestion = () => {
		setIsShowBottomSheet(true);
		setVisibleBottomSheet(true);
	};

	const handleCloseBottomSheet = () => {
		setIsShowBottomSheet(false);
		setVisibleBottomSheet(false);
	};

	return (
		<Wrapper>
			{/* Overlay */}
			{visibleBottomSheet && <Overlay onPress={handleCloseBottomSheet} />}
			{/* Bottom Sheet */}
			<BottomSheet visible={visibleBottomSheet}>
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

			<View className="flex flex-row items-center justify-between p-4">
				{/* Back */}
				<TouchableOpacity>
					<Ionicons name="arrow-back" size={24} color="black" />
				</TouchableOpacity>
				{/* Save Quiz */}
				<TouchableOpacity className="flex items-center justify-center flex-row px-4 py-2 bg-primary rounded-xl">
					<Ionicons name="save-outline" size={24} color="white" />
					<Text className="ml-2 text-white">Lưu bài quiz</Text>
				</TouchableOpacity>
			</View>
			<View className="p-4 flex items-center justify-center flex-col">
				<TouchableOpacity className="flex items-center justify-center flex-col rounded-2xl bg-overlay w-full min-h-[120px]">
					<Ionicons name="image-outline" size={24} color="black" />
					<Text className="text-center mt-1">Thêm hình ảnh</Text>
				</TouchableOpacity>
			</View>
			{/* Quiz infor */}
			<View className="mt-4 p-4">
				<View className="flex items-center justify-between flex-row">
					<View>
						<Text className="text-lg">Quizz Name</Text>
						<Text className="text-gray">Quizz Description</Text>
					</View>
					<TouchableOpacity>
						<MaterialIcons name="edit" size={24} color="black" />
					</TouchableOpacity>
				</View>
			</View>
			{/* Quiz Questions */}
			<View className="p-4 absolute bottom-0 w-full">
				<Button
					onPress={handleCreateQuizQuestion}
					text={'Tạo câu hỏi'}
					otherStyles={'p-4'}
					textStyles={'text-center'}
				/>
			</View>
		</Wrapper>
	);
};

export default QuizzOverViewScreen;
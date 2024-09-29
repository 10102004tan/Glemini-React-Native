import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Wrapper from '../../components/customs/Wrapper';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Button from '../../components/customs/Button';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const EditQuizQuestion = () => {
	return (
		<Wrapper>
			<View className="flex flex-row items-center justify-between p-4">
				<TouchableOpacity>
					<Ionicons name="arrow-back" size={24} color="black" />
				</TouchableOpacity>
				<Text className="ml-4 px-4 py-2 rounded-xl bg-overlay">
					Nhiều lựa chọn
				</Text>
			</View>
			<View className="flex flex-row items-center justify-start p-4">
				<TouchableOpacity className="px-4 py-2 rounded-xl bg-overlay flex items-center justify-center flex-row">
					<Text className="mr-2">30 giây</Text>
					<Entypo name="time-slot" size={15} color="black" />
				</TouchableOpacity>
				<TouchableOpacity className="ml-2 px-4 py-2 rounded-xl bg-overlay flex items-center justify-center flex-row">
					<Text className="mr-2">1 điểm</Text>
					<AntDesign name="checkcircleo" size={15} color="black" />
				</TouchableOpacity>
			</View>
			{/* Edit View */}
			<View className="flex-1 bg-primary p-4">
				<View className="border border-gray rounded-2xl h-[140px] flex items-center justify-center">
					<TouchableOpacity onPress={() => {}}>
						<Text className="text-white">
							Nhập câu hỏi của bạn tại đây
						</Text>
					</TouchableOpacity>
					<TouchableOpacity className="absolute top-4 right-4">
						<FontAwesome name="image" size={20} color="white" />
					</TouchableOpacity>
				</View>
				<View className="flex items-center justify-between mt-4 flex-row">
					<TouchableOpacity className="flex items-center justify-center flex-row bg-overlay py-2 px-4 rounded-xl">
						<Text className="text-white">Nhiều lựa chọn</Text>
					</TouchableOpacity>
					<TouchableOpacity className="flex items-center justify-center flex-row bg-overlay py-2 px-4 rounded-xl">
						<Text className="text-white">Thêm giải thích</Text>
					</TouchableOpacity>
				</View>
				{/* Answers */}
				<View className="mt-4 flex items-center justify-center flex-col">
					<View className="p-4 rounded-xl bg-blue-400 w-full">
						<Text className="text-white text-center">
							Đáp án thứ 1
						</Text>
					</View>
					<View className="p-4 rounded-xl bg-green-500 w-full mt-3">
						<Text className="text-white text-center">
							Đáp án thứ 2
						</Text>
					</View>
					<View className="p-4 rounded-xl bg-yellow-400 w-full mt-3">
						<Text className="text-white text-center">
							Đáp án thứ 3
						</Text>
					</View>
					<View className="p-4 rounded-xl bg-red-400 w-full mt-3">
						<Text className="text-white text-center">
							Đáp án thứ 3
						</Text>
					</View>
				</View>
				<View className="flex items-center justify-between mt-4 flex-row">
					<TouchableOpacity className="flex items-center justify-center flex-row bg-overlay py-2 px-4 rounded-xl">
						<Text className="text-white">Thêm phương án</Text>
					</TouchableOpacity>
				</View>
			</View>
			{/* Button */}
			<View className="p-4">
				<Button
					text={'Lưu câu hỏi'}
					otherStyles={'p-4'}
					textStyles={'text-center'}
				/>
			</View>
		</Wrapper>
	);
};

export default EditQuizQuestion;

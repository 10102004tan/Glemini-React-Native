import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Wrapper from '../../components/customs/Wrapper';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';

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
			<View className="flex flex-row items-center justify-between p-4">
				<TouchableOpacity className="px-4 py-2 rounded-xl bg-overlay flex items-center justify-center flex-row">
					<Text className="">30 giây</Text>
					<Entypo name="time-slot" size={18} color="black" />
				</TouchableOpacity>
			</View>
		</Wrapper>
	);
};

export default EditQuizQuestion;

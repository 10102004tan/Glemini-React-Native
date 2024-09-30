import { View, Text, TouchableOpacity, ScrollView, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '../../../constants/Colors';
import { useAppProvider } from '../../../contexts/AppProvider';
import ExplainQuestionBoard from '../../../components/customs/ExplainQuestionBoard';
import Overlay from '../../../components/customs/Overlay';
import Wrapper from '../../../components/customs/Wrapper';

const MAX_ANSWER = 8;

const EditQuizQuestion = () => {
	const [amountAnswer, setAmountAnswer] = useState([1, 2, 3, 4]);
	const [pointBotttomSheetVisible, setPointBotttomSheetVisible] =
		useState(false); // bottom sheet để chọn số điểm
	const { isHiddenNavigationBar } = useAppProvider();
	const [selectedPoint, setSelectedPoint] = useState(1); // số điểm được chọn
	const [selectedTime, setSelectedTime] = useState(30); // thời gian được chọn
	const [mutipleChoice, setMutipleChoice] = useState(false); // cho phép chọn nhiều đáp án
	const [questionExplain, setQuestionExplain] = useState({
		text: '',
		image: '',
	}); // giải thích cho câu hỏi
	const [showExplain, setShowExplain] = useState(false); // hiển thị giải thích cho câu hỏi

	return (
		<Wrapper>
			{/* Overlay */}
			{showExplain && (
				<Overlay
					onPress={() => {
						setShowExplain(false);
					}}
				/>
			)}
			{/* Explain Quesion Box */}
			<ExplainQuestionBoard visible={showExplain} />
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
					<TouchableOpacity
						onPress={() => setMutipleChoice(!mutipleChoice)}
						className="flex items-center justify-center flex-row bg-overlay py-2 px-4 rounded-xl"
						style={
							mutipleChoice ? { backgroundColor: '#0BCA5E' } : {}
						}
					>
						<Text className="text-white">Nhiều lựa chọn</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className="flex items-center justify-center flex-row bg-overlay py-2 px-4 rounded-xl"
						onPress={() => {
							setShowExplain(!showExplain);
						}}
					>
						<Text className="text-white">Thêm giải thích</Text>
					</TouchableOpacity>
				</View>
				{/* Answers */}
				<ScrollView>
					<View className="mt-4 flex items-center justify-center flex-col">
						{amountAnswer.map((e, index) => {
							return (
								<QuestionAnswerItem
									key={index}
									answer={'Đáp án thứ ' + (index + 1)}
									color={Colors.answerColors[index]}
								/>
							);
						})}
					</View>
				</ScrollView>
				<View className="flex items-center justify-between mt-4 flex-row">
					<TouchableOpacity
						className="flex items-center justify-center flex-row bg-overlay py-2 px-4 rounded-xl"
						onPress={() => {
							if (amountAnswer.length < MAX_ANSWER) {
								setAmountAnswer([
									...amountAnswer,
									amountAnswer.length + 1,
								]);
							} else {
								// Alert to user here
							}
						}}
					>
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

import React, { useEffect } from 'react';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import RichTextEditor from './RichTextEditor';
import { Status } from '../../constants';
import { View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Button from '../../components/customs/Button';
import { useQuestionProvider } from '../../contexts/QuestionProvider';

const QuestionEditBoard = ({
	content = '',
	visible = false,
	handleClose = () => {},
	type = '',
	answerEditSelected = 0,
	mutipleChoice = false,
}) => {
	// Tạo hiệu ứng chuyển động
	const translateY = useSharedValue(1000);
	useEffect(() => {
		if (visible) {
			translateY.value = withTiming(0, { duration: 400 });
		} else {
			translateY.value = withTiming(1000, { duration: 500 });
		}
	}, [visible]);
	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: translateY.value }],
		};
	});

	const { deleteAnswer, markCorrectAnswer, checkCorrectAnswer } =
		useQuestionProvider();

	return (
		<Animated.View
			style={[animatedStyle]}
			className="rounded-2xl border border-gray flex items-center justify-center max-h-[460px] absolute z-20 top-[5%]
      left-[5%] right-[50%] w-[90%] bg-white"
		>
			{/* Dùng để chỉnh sửa câu hỏi, đáp án của quiz */}
			<RichTextEditor
				focus={visible}
				typingType={type}
				content={content}
				selectedAnswer={answerEditSelected}
			/>
			{/* Đánh dấu đáp án chính xác của bộ quiz */}
			{type === Status.quiz.ANSWER && (
				<View className="flex flex-1 items-start justify-start flex-col w-full p-4">
					<Button
						onPress={() => {
							markCorrectAnswer(
								answerEditSelected,
								mutipleChoice
							);
							handleClose();
						}}
						otherStyles="bg-success"
						text={
							!checkCorrectAnswer(answerEditSelected)
								? 'Đánh dấu là đáp án chính xác'
								: 'Bỏ đánh dấu là đáp án chính xác'
						}
						icon={
							<Feather
								name="check-circle"
								size={18}
								color="white"
							/>
						}
					/>
					<Button
						onPress={() => {
							if (answerEditSelected !== 0) {
								deleteAnswer(answerEditSelected);
								handleClose();
							}
						}}
						otherStyles="bg-error mt-2 justify-center"
						text="Loại bỏ đáp án này"
						icon={
							<Feather name="trash-2" size={18} color="white" />
						}
					/>
				</View>
			)}
		</Animated.View>
	);
};

export default QuestionEditBoard;

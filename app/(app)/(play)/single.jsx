import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Button from '../../../components/customs/Button'; // Sử dụng Button tùy chỉnh
import ResultSingle from '../(result)/single'; // Import component kết quả

const SinglePlay = () => {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [score, setScore] = useState(0);
	const [isCompleted, setIsCompleted] = useState(false);
	const [isChosen, setIsChosen] = useState(false);
	const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
	const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
	const [buttonText, setButtonText] = useState('Xác nhận'); 
	const [buttonColor, setButtonColor] = useState('bg-white'); 
	const [buttonTextColor, setButtonTextColor] = useState('text-black'); 

	// Danh sách câu hỏi
	const questions = [
		{
			question: 'What is the capital of France?',
			answers: ['Paris', 'London', 'Berlin', 'Rome'],
			correctAnswer: 'Paris',
		},
		{
			question: 'Who wrote "Hamlet"?',
			answers: ['Shakespeare', 'Tolstoy', 'Hemingway', 'Austen'],
			correctAnswer: 'Shakespeare',
		},
		{
			question: 'What is the largest planet in our solar system?',
			answers: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
			correctAnswer: 'Jupiter',
		},
	];

	const handleAnswerPress = (answer) => {
		setSelectedAnswer(answer);
		setIsChosen(true);
		setButtonColor('bg-[#0D70D2]'); // Chuyển sang nền xanh dương khi chọn đáp án
		setButtonTextColor('text-white'); // Chuyển chữ thành trắng khi chọn đáp án
	};

	const handleSubmit = () => {
		if (selectedAnswer === null) {
			Alert.alert('Vui lòng chọn đáp án!!');
			return;
		}

		const correctAnswer = questions[currentQuestionIndex].correctAnswer;

		// Kiểm tra câu trả lời đúng sai và cập nhật trạng thái
		if (selectedAnswer === correctAnswer) {
			setScore(score + 10);
			setIsAnswerCorrect(true);
			setButtonColor('bg-[#4CAF50]');
			setButtonText('+10 điểm!');
		} else {
			setIsAnswerCorrect(false);
			setButtonColor('bg-[#F44336]');
			setButtonText('Sai rồi!!');
		}

		setShowCorrectAnswer(true);

		// Sau một khoảng thời gian ngắn, chuyển sang câu tiếp theo
		setTimeout(() => {
			if (currentQuestionIndex < questions.length - 1) {
				setCurrentQuestionIndex(currentQuestionIndex + 1);
				setSelectedAnswer(null);
				setIsChosen(false);
				setShowCorrectAnswer(false);
				setIsAnswerCorrect(null);
				setButtonText('Xác nhận');
				setButtonColor('bg-white');
				setButtonTextColor('text-black');
			} else {
				setIsCompleted(true);
			}
		}, 1500);
	};

	const handleRestart = () => {
		setCurrentQuestionIndex(0);
		setScore(0);
		setIsCompleted(false);
		setSelectedAnswer(null);
		setIsChosen(false);
		setIsAnswerCorrect(null);
		setShowCorrectAnswer(false);
		setButtonText('Xác nhận');
		setButtonColor('bg-white');
		setButtonTextColor('text-black');
	};

	if (isCompleted) {
		// Hiển thị kết quả khi hoàn thành
		return (
			<ResultSingle
				score={score}
				handleRestart={handleRestart}
				questions={questions}
			/>
		);
	}

	return (
		<View className="flex-1">
			{/* Hiển thị thông tin cơ bản */}
			<View className="flex-row justify-between items-center px-5 pt-10 pb-3 bg-black">
				<Text className="font-bold text-lg text-white">
					Tiêu đề bộ câu đố
				</Text>
				<Button
					text="Kết thúc"
					onPress={() => console.log('Button pressed!!')}
					loading={false}
					type="fill"
					otherStyles={'bg-[#F41D1D]'}
					textStyles={'font-medium text-sm text-white'}
				/>
			</View>

			{/* Tương tác người dùng */}
			<View className="flex-1 bg-[#1C2833] px-5 py-4 justify-between">
				<Text className="text-lg bg-[#484E54] rounded text-white px-[10px] py-1 font-pregular self-start">
					{`Điểm: ${score}`}
				</Text>
				<View className="bg-[#484E54] rounded-lg px-3 py-10">
					<Text className="text-2xl font-pregular text-white">
						{questions[currentQuestionIndex].question}
					</Text>
				</View>

				<View>
					{questions[currentQuestionIndex].answers.map(
						(answer, index) => {
							// Tạo điều kiện để hiển thị màu nền dựa trên kết quả đúng/sai
							let backgroundColor = '#484E54'; // Mặc định
							if (showCorrectAnswer) {
								if (
									answer ===
									questions[currentQuestionIndex]
										.correctAnswer
								) {
									backgroundColor = '#4CAF50'; // Xanh lá nếu là đáp án đúng
								} else if (answer === selectedAnswer) {
									backgroundColor = '#F44336'; // Đỏ nếu là đáp án sai
								}
							} else if (selectedAnswer === answer) {
								backgroundColor = '#0D70D2'; // Màu khi người dùng chọn
							}

							return (
								<TouchableOpacity
									key={index}
									onPress={() => handleAnswerPress(answer)}
									style={{
										backgroundColor,
										padding: 10,
										marginVertical: 5,
										borderRadius: 5,
									}}
									disabled={showCorrectAnswer} // Vô hiệu hóa nút khi đang hiển thị đáp án đúng
								>
									<Text className="text-white font-pregular text-lg m-4">
										{answer}
									</Text>
								</TouchableOpacity>
							);
						}
					)}
				</View>

				<Button
					text={buttonText} // Text của button thay đổi dựa vào kết quả
					onPress={handleSubmit}
					type="fill"
					otherStyles={`${buttonColor} p-4`} // Màu nền của button
					textStyles={`${buttonTextColor} text-center text-lg`} // Màu chữ của button
					disabled={!isChosen || showCorrectAnswer} // Vô hiệu hóa nút nếu chưa chọn câu hoặc đang hiển thị đáp án
				/>
			</View>
		</View>
	);
};

export default SinglePlay;

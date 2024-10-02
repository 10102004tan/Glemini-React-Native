import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Button from '../../../components/customs/Button'; // Sử dụng Button tùy chỉnh
import ResultSingle from '../(result)/single'; // Import component kết quả

const SinglePlay = () => {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [correctCount, setCorrectCount] = useState(0); // Số câu đúng
	const [wrongCount, setWrongCount] = useState(0); // Số câu sai
	const [score, setScore] = useState(0); // Điểm
	const [isCompleted, setIsCompleted] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);
	const [isChosen, setIsChosen] = useState(false);
	const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
	const [buttonText, setButtonText] = useState('Xác nhận');
	const [buttonColor, setButtonColor] = useState('bg-white');
	const [buttonTextColor, setButtonTextColor] = useState('text-black');

	// Danh sách câu hỏi
	const [questions, setQuestions] = useState([
		{
			_id: 1,
			quiz_id: 1,
			question_excerpt: 'Thủ đô của Pháp là gì?',
			question_description: 'Đây là một câu hỏi kiểm tra kiến thức.',
			question_image: '',
			question_audio: '',
			question_video: '',
			question_point: 10,
			question_time: 10,
			question_explanation: 'Thủ đô của Pháp là Paris.',
			question_type: 'single',
			question_answer_ids: [
				{ _id: 1, text: "Paris", image: null },
				{ _id: 2, text: "Hà Nội", image: null },
				{ _id: 3, text: "London", image: null },
				{ _id: 4, text: "Tokyo", image: null },
			],
			question_correct: 1,
		},
		{
			_id: 2,
			quiz_id: 2,
			question_excerpt: 'Hành tinh lớn nhất trong hệ Mặt Trời là gì?',
			question_description: 'Đây là một câu hỏi kiểm tra kiến thức.',
			question_image: '',
			question_audio: '',
			question_video: '',
			question_point: 1,
			question_time: 10,
			question_explanation: 'Hành tinh lớn nhất trong hệ Mặt Trời là Sao Mộc.',
			question_type: 'single',
			question_answer_ids: [
				{ _id: 1, text: "Trái Đất", image: null },
				{ _id: 2, text: "Sao Hỏa", image: null },
				{ _id: 3, text: "Sao Mộc", image: null },
				{ _id: 4, text: "Sao Thổ", image: null },
			],
			question_correct: 3,
		},
		{
			_id: 3,
			quiz_id: 3,
			question_excerpt: 'Ai là người sáng lập ra nước Việt Nam Dân chủ Cộng hòa?',
			question_description: 'Câu hỏi lịch sử Việt Nam.',
			question_image: '',
			question_audio: '',
			question_video: '',
			question_point: 10,
			question_time: 10,
			question_explanation: 'Người sáng lập ra nước Việt Nam Dân chủ Cộng hòa là Chủ tịch Hồ Chí Minh.',
			question_type: 'single',
			question_answer_ids: [
				{ _id: 1, text: "Chủ tịch Hồ Chí Minh", image: null },
				{ _id: 2, text: "Lê Duẩn", image: null },
				{ _id: 3, text: "Phạm Văn Đồng", image: null },
				{ _id: 4, text: "Võ Nguyên Giáp", image: null },
			],
			question_correct: 1,
		},
		{
			_id: 4,
			quiz_id: 4,
			question_excerpt: 'Quốc gia nào có diện tích lớn nhất thế giới?',
			question_description: 'Câu hỏi địa lý.',
			question_image: '',
			question_audio: '',
			question_video: '',
			question_point: 5,
			question_time: 10,
			question_explanation: 'Quốc gia có diện tích lớn nhất thế giới là Nga.',
			question_type: 'single',
			question_answer_ids: [
				{ _id: 1, text: "Hoa Kỳ", image: null },
				{ _id: 2, text: "Trung Quốc", image: null },
				{ _id: 3, text: "Canada", image: null },
				{ _id: 4, text: "Nga", image: null },
			],
			question_correct: 4,
		},
		{
			_id: 5,
			quiz_id: 5,
			question_excerpt: 'Loài động vật nhanh nhất trên cạn là gì?',
			question_description: 'Câu hỏi về thế giới động vật.',
			question_image: '',
			question_audio: '',
			question_video: '',
			question_point: 8,
			question_time: 10,
			question_explanation: 'Loài động vật nhanh nhất trên cạn là báo.',
			question_type: 'single',
			question_answer_ids: [
				{ _id: 1, text: "Báo", image: null },
				{ _id: 2, text: "Sư tử", image: null },
				{ _id: 3, text: "Ngựa", image: null },
				{ _id: 4, text: "Chó sói", image: null },
			],
			question_correct: 1,
		},
	]);

	const saveQuestionResult = async (questionId, answerId, correct, score) => {
		try {
		  const response = await fetch('http://localhost:3000/api/v1/result/save-question', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			  exercise_id: null, // Nếu có exercise_id, truyền vào đây
			  user_id: '66fc2879dc333e9e009d7e35', // Giả sử user_id là 1, bạn có thể thay đổi để lấy từ context hoặc state
			  quiz_id: questions[currentQuestionIndex].quiz_id,
			  question_id: questionId,
			  answer: answerId,
			  correct,
			  score,
			}),
		  });
	  
		  const data = await response.json();
		  if (!response.ok) {
			throw new Error(data.message || 'Có lỗi xảy ra khi lưu kết quả.');
		  }
		  console.log('Kết quả đã được lưu:', data);
		} catch (error) {
		  console.error('Lỗi khi lưu kết quả:', error);
		}
	  };
	  

	const handleAnswerPress = (answerId) => {
		setSelectedAnswer(answerId);
		setIsChosen(true);
		setButtonColor('bg-[#0D70D2]');
		setButtonTextColor('text-white');
	};

	const handleSubmit = () => {
		if (selectedAnswer === null) {
			Alert.alert('Vui lòng chọn đáp án!!');
			return;
		}

		const currentQuestion = questions[currentQuestionIndex];
		const correctAnswerId = currentQuestion.question_correct;

		if (selectedAnswer === correctAnswerId) {
			setIsCorrect(true);
			setCorrectCount(correctCount + 1); // Tăng số câu đúng
			setScore(score + currentQuestion.question_point); // Cộng thêm điểm
			setButtonColor('bg-[#4CAF50]');
			setButtonText(`+${currentQuestion.question_point} điểm!`);
		} else {
			setIsCorrect(false);
			setWrongCount(wrongCount + 1); // Tăng số câu sai
			setButtonColor('bg-[#F44336]');
			setButtonText('Sai rồi!!');
		}

		 // Gọi API để lưu kết quả
		 saveQuestionResult(
			currentQuestion._id,
			selectedAnswer,
			isCorrect,
			currentQuestion.question_point
		  );

		setShowCorrectAnswer(true);

		setTimeout(() => {
			if (currentQuestionIndex < questions.length - 1) {
				setCurrentQuestionIndex(currentQuestionIndex + 1);
				setSelectedAnswer(null);
				setIsChosen(false);
				setShowCorrectAnswer(false);
				setButtonText('Xác nhận');
				setButtonColor('bg-white');
				setButtonTextColor('text-black');
			} else {
				setIsCompleted(true);
			}
		}, 1500);
	};

	const handleRestart = () => {
		setIsCorrect(false)
		setCurrentQuestionIndex(0);
		setCorrectCount(0);
		setWrongCount(0);
		setScore(0); // Đặt lại điểm
		setIsCompleted(false);
		setSelectedAnswer(null);
		setIsChosen(false);
		setShowCorrectAnswer(false);
		setButtonText('Xác nhận');
		setButtonColor('bg-white');
		setButtonTextColor('text-black');
	};

	if (isCompleted) {
		return (
			<ResultSingle
				correctCount={correctCount}
				wrongCount={wrongCount}
				score={score}
				totalQuestions={questions.length}
				handleRestart={handleRestart}
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
					{`Điểm: ${score}`} {/* Hiển thị điểm */}
				</Text>
				<View className="bg-[#484E54] rounded-lg px-3 py-10">
					<Text className="text-sm font-pregular text-slate-200">
						{"Câu hỏi số:  " + (currentQuestionIndex + 1) + " / " + questions.length}
					</Text>
					<Text className="text-2xl font-pregular text-white">
						{questions[currentQuestionIndex].question_excerpt}
					</Text>
				</View>

				<View>
					{questions[currentQuestionIndex].question_answer_ids.map((answer, index) => {
						let backgroundColor = '#484E54';
						if (showCorrectAnswer) {
							if (answer._id === questions[currentQuestionIndex].question_correct) {
								backgroundColor = '#4CAF50'; 
							} else if (answer._id === selectedAnswer) {
								backgroundColor = '#F44336'; 
							}
						} else if (selectedAnswer === answer._id) {
							backgroundColor = '#0D70D2'; 
						}

						return (
							<TouchableOpacity
								key={index}
								onPress={() => handleAnswerPress(answer._id)}
								style={{
									backgroundColor,
									padding: 10,
									marginVertical: 5,
									borderRadius: 5,
								}}
								disabled={showCorrectAnswer}
							>
								<Text className="text-white font-pregular text-lg m-4">
									{answer.text}
								</Text>
							</TouchableOpacity>
						);
					})}
				</View>

				<Button
					text={buttonText}
					onPress={handleSubmit}
					type="fill"
					otherStyles={`${buttonColor} p-4`}
					textStyles={`${buttonTextColor} mx-auto text-lg`}
					disabled={!isChosen || showCorrectAnswer}
				/>
			</View>
		</View>
	);
};

export default SinglePlay;

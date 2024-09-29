import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Wrapper from '../../components/customs/Wrapper';
import Button from '../../components/customs/Button'; // Sử dụng Button tùy chỉnh

const SinglePlay = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

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
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      Alert.alert('Vui lòng chọn dáp án!!');
      return;
    }

    // Check if the selected answer is correct
    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    // Move to the next question or end the quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null); // Reset answer for the next question
    } else {
      setIsCompleted(true); // End the quiz
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsCompleted(false);
    setSelectedAnswer(null);
  };

  if (isCompleted) {
    return (
      <Wrapper>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>
          Quiz Completed! Your score: {score}/{questions.length}
        </Text>
        <Button
          text="Restart Quiz"
          onPress={handleRestart}
          type="fill"
          otherStyles={{ marginVertical: 10 }}
        />
      </Wrapper>
    );
  }

  return (
    <View className="flex-1">
      {/* Hiển thị thông tin cơ bản */}
      <View className="flex-row justify-between items-center px-5 pt-10 pb-3 bg-black">
        <Text className='font-bold text-lg text-white '>Title Quiz</Text>
        <Button
          text="Kết thúc"
          onPress={() => console.log('Button pressed!')}
          loading={false}
          type="fill"
          otherStyles={'bg-[#F41D1D]'}
          textStyles={'font-medium text-sm text-white'}
        />
      </View>

      {/* Tương tác người dùng */}
      <View className="flex-1 bg-[#1C2833] px-5 py-4 justify-between">
          <Text className="text-lg bg-[#484E54] rounded text-white px-[10px] py-1 self-start">
            {`Điểm: ${score}`}
          </Text>
          <View className='bg-[#484E54] rounded-lg px-3 py-10'>
          <Text className='text-2xl  text-white'> {questions[currentQuestionIndex].question}
          </Text>
          </View>
        <View>

           
          {questions[currentQuestionIndex].answers.map((answer, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleAnswerPress(answer)}
              style={{
                backgroundColor:
                  selectedAnswer === answer ? '#0D70D2' : '#484E54',
                padding: 10,
                marginVertical: 5,
                borderRadius: 5,
              }}
            >
              <Text className='text-white text-lg m-4'>{answer}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          text="Xác nhận"
          onPress={handleSubmit}
          type="fill"
          otherStyles={'bg-[#0D70D2] p-4'}
          textStyles={'text-center text-lg text-white font-bold'}
        />
      </View>
    </View>
  );
};

export default SinglePlay;

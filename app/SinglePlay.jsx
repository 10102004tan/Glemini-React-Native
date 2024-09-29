import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Wrapper from '../components/customs/Wrapper';
import Button from '../components/customs/Button'; // Sử dụng Button tùy chỉnh

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
      Alert.alert('Please select an answer');
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
    <View className="flex-1 p-4 mt-[40px]">
      {/* Phần trên hiển thị title và button */}
      <View className="flex-row justify-between items-center mb-4">
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Title Quiz</Text>
        <Button
          text="Submit"
          onPress={() => console.log('Button pressed!')}
          loading={false}
          type="fill"
          otherStyles={{ marginVertical: 10 }}
          textStyles={{ fontSize: 18 }}
        />
      </View>

      {/* Phần dưới hiển thị câu hỏi và lựa chọn */}
      <View className="flex-[9]">
        <Text className="text-xl mb-2">
          {`Question ${currentQuestionIndex + 1} of ${questions.length}`}
        </Text>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>
          {questions[currentQuestionIndex].question}
        </Text>
        {questions[currentQuestionIndex].answers.map((answer, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleAnswerPress(answer)}
            style={{
              backgroundColor:
                selectedAnswer === answer ? '#4CAF50' : '#f1f1f1',
              padding: 10,
              marginVertical: 5,
              borderRadius: 5,
            }}
          >
            <Text style={{ fontSize: 18 }}>{answer}</Text>
          </TouchableOpacity>
        ))}

        <Button
          text="Submit Answer"
          onPress={handleSubmit}
          type="fill"
          otherStyles={{ marginVertical: 10 }}
        />
      </View>
    </View>
  );
};

export default SinglePlay;

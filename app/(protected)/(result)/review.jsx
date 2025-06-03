import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Modal, TouchableOpacity } from 'react-native';
import Button from '@/components/customs/Button';
import { useAppProvider } from '@/contexts/AppProvider';
import Icon from 'react-native-vector-icons/AntDesign';
import QuestionResultItem from '@/components/customs/QuestionResultItem';
import { useGlobalSearchParams, useRouter } from 'expo-router';

const ResultReview = () => {
  const router = useRouter();
  const { result } = useGlobalSearchParams();
  const resultData = JSON.parse(result);
  const { i18n } = useAppProvider();

  // console.log("RESULT DATA")
  // console.log(resultData)

  // Trạng thái để lưu chỉ số câu hỏi được chọn và trạng thái hiển thị của Modal
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (index) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedIndex(null);
  };

  const currentQuestion = resultData.result_questions[selectedIndex];
  console.log(currentQuestion);

  const goToNextQuestion = () => {
    if (selectedIndex < resultData.result_questions.length - 1) {
      setSelectedIndex((prevIndex) => prevIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (selectedIndex > 0) {
      setSelectedIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Hàm chuẩn hóa chuỗi văn bản
  const normalizeText = (text) => {
    return text
      .toLowerCase() // Chuyển về chữ thường
      .replace(/\s+/g, ' ') // Loại bỏ khoảng trắng thừa giữa các từ
      .trim(); // Loại bỏ khoảng trắng đầu và cuối
  };

  return (
    <View
      style={{
        paddingBottom: 20,
        flex: 1,
        backgroundColor: '#f8fafc',
        paddingHorizontal: 20,
        paddingTop: 40,
      }}
    >
      <View style={{ flexDirection: 'column' }}>
        <View style={{ alignItems: 'flex-end' }}>
          <Button
            text={<Icon name="close" size={20} />}
            onPress={() => {
              router.back();
            }}
            loading={false}
            type="fill"
            otherStyles={'bg-slate-300 rounded-full'}
            textStyles={'text-sm text-black'}
          />
        </View>
        <Text
          style={{
            fontSize: 24,
            lineHeight: 32,
            color: '#1e293b',
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          {i18n.t('result.review.title')}
        </Text>
      </View>
      <ScrollView style={{ paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
        {resultData &&
          resultData.result_questions.map((question, index) => (
            <TouchableOpacity key={index} onPress={() => openModal(index)}>
              <QuestionResultItem question={question} />
            </TouchableOpacity>
          ))}
      </ScrollView>

      {/* Modal hiển thị thông tin chi tiết */}
      {currentQuestion && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <View
              style={{
                backgroundColor: '#fff',
                padding: 20,
                borderRadius: 6,
                borderLeftWidth: 8,
                borderColor: currentQuestion.correct ? '#22c55e' : '#ef4444',
                width: '90%',
              }}
            >
              <View style={{ alignItems: 'flex-end' }}>
                <Button
                  text={<Icon name="close" size={20} />}
                  onPress={closeModal}
                  loading={false}
                  type="fill"
                  otherStyles={'bg-slate-300/50 rounded-full'}
                  textStyles={'text-sm text-black/50'}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  marginBottom: 20,
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    lineHeight: 24,
                    fontFamily: 'Poppins-Regular, sans-serif',
                  }}
                >
                  {i18n.t('result.review.indexQuestion')} {selectedIndex + 1}
                </Text>
                <Text
                  style={{
                    backgroundColor: '#e2e8f0',
                    borderRadius: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    fontFamily: 'Poppins-Regular, sans-serif',
                    color: '#64748b',
                  }}
                >
                  {currentQuestion.question_id.question_point} {i18n.t('result.review.point')}
                </Text>
              </View>

              <View style={{ display: 'flex' }}>
                <Text
                  style={{
                    fontSize: 18,
                    lineHeight: 28,
                    fontFamily: 'Poppins-Regular, sans-serif',
                    marginBottom: 16,
                    borderBottomWidth: 1,
                    color: '#cbd5e1',
                  }}
                >
                  {currentQuestion.question_id.question_excerpt}
                </Text>

                {currentQuestion &&
                  currentQuestion.question_id.question_answer_ids.map((answer, ansIndex) => {
                    if (currentQuestion.question_id.question_type === 'box') {
                      const correctTextAnswers = normalizeText(
                        currentQuestion.question_id.correct_answer_ids[0].text,
                      );
                      const userAnswerText = normalizeText(answer.text);

                      const isAnswerCorrect = correctTextAnswers.includes(userAnswerText);

                      return (
                        <View
                          key={ansIndex}
                          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                        >
                          <View
                            style={{ width: 12, height: 12, borderRadius: 999, marginRight: 8 }}
                          />
                          <Text
                            style={{
                              fontSize: 16,
                              lineHeight: 24,
                              color: isAnswerCorrect ? '#22c55e' : '#ef4444',
                            }}
                          >
                            {answer.text}
                          </Text>
                        </View>
                      );
                    } else {
                      // Kiểm tra xem đây có phải là câu trả lời của người dùng hay không
                      const isUserAnswer = currentQuestion.answer.some(
                        (userAns) => userAns._id === answer._id,
                      );
                      // Kiểm tra xem đây có phải là câu trả lời đúng hay không
                      const isCorrectAnswer = currentQuestion.question_id.correct_answer_ids.some(
                        (correctAns) => correctAns._id === answer._id,
                      );

                      const bulletStyle =
                        isCorrectAnswer && isUserAnswer
                          ? 'bg-yellow-500' // Cả câu trả lời của bạn và câu trả lời đúng
                          : isCorrectAnswer
                            ? 'bg-green-500' // Chỉ là câu trả lời đúng
                            : isUserAnswer
                              ? 'bg-red-500' // Chỉ là câu trả lời của bạn
                              : 'bg-slate-400/50'; // Các câu trả lời khác

                      const textStyle =
                        isCorrectAnswer && isUserAnswer
                          ? 'text-yellow-500 font-semibold' // Cả câu trả lời của bạn và câu trả lời đúng
                          : isCorrectAnswer
                            ? 'text-green-500 font-semibold' // Chỉ là câu trả lời đúng
                            : isUserAnswer
                              ? 'text-red-500 font-regular' // Chỉ là câu trả lời của bạn
                              : 'text-slate-400 font-regular'; // Các câu trả lời khác

                      return (
                        <View
                          key={ansIndex}
                          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                        >
                          <View className={`w-3 h-3 rounded-full mr-2 ${bulletStyle}`} />
                          <Text className={`text-base ${textStyle}`}>{answer.text}</Text>
                        </View>
                      );
                    }
                  })}
              </View>

              {!currentQuestion.correct && (
                <View className="mt-4">
                  <Text className="text-base text-slate-600 font-pregular">
                    {i18n.t('result.review.userAnswer')}{' '}
                    {currentQuestion && typeof currentQuestion.answer === 'string'
                      ? currentQuestion.answer
                      : currentQuestion.answer.map((userAns) => userAns.text).join(', ') ||
                        i18n.t('result.review.noAnswer')}
                  </Text>
                </View>
              )}
              <View>
                <Text className="text-base text-slate-600 font-pregular mt-4 underline">
                  {i18n.t('result.review.explanation')}
                </Text>
                <Text className="text-sm text-slate-600/90 font-pextralight">
                  {currentQuestion.question_id.question_explanation ||
                    i18n.t('result.review.textExplanation')}
                </Text>
              </View>

              <View className="mt-4 flex flex-row items-center justify-center">
                <Button
                  text={i18n.t('result.review.btnNext')}
                  onPress={goToPreviousQuestion}
                  loading={false}
                  type="fill"
                  otherStyles={`bg-pink-600 rounded-lg px-4 ${selectedIndex === 0 ? 'opacity-50' : ''}`}
                  textStyles={'text-base font-pregular'}
                  disabled={selectedIndex === 0}
                />

                <Button
                  text={i18n.t('result.review.btnPrev')}
                  onPress={goToNextQuestion}
                  loading={false}
                  type="fill"
                  otherStyles={`bg-pink-600 rounded-lg px-4  ml-3 ${resultData && selectedIndex === resultData.result_questions.length - 1 ? 'opacity-50' : ''}`}
                  textStyles={'text-base font-pregular'}
                  disabled={selectedIndex === resultData.result_questions.length - 1}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default ResultReview;

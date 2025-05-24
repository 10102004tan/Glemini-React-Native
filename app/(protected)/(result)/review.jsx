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
   console.log(currentQuestion)

   const goToNextQuestion = () => {
      if (selectedIndex < resultData.result_questions.length - 1) {
         setSelectedIndex(prevIndex => prevIndex + 1);
      }
   };

   const goToPreviousQuestion = () => {
      if (selectedIndex > 0) {
         setSelectedIndex(prevIndex => prevIndex - 1);
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
      <View className='flex-1 bg-slate-50 px-5 pb-4 pt-10'>
         <View className='flex-col'>
            <View className='items-end'>
               <Button
                  text={<Icon name='close' size={20} />}
                  onPress={() => {
                     router.back()
                  }}
                  loading={false}
                  type="fill"
                  otherStyles={'bg-slate-300 rounded-full'}
                  textStyles={'text-sm text-black'}
               />
            </View>
            <Text className='text-2xl text-slate-800 font-semibold text-center'>{i18n.t('result.review.title')}</Text>
         </View>
         <ScrollView className='py-4' showsVerticalScrollIndicator={false}>
            {resultData && resultData.result_questions.map((question, index) => (
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
               <View className='flex-1 justify-center items-center bg-black/50'>
                  <View className={`bg-white p-5 rounded-md w-11/12 border-l-8 ${currentQuestion.correct ? ' border-green-500' : ' border-red-500'}`}>
                     <View className='items-end'>
                        <Button
                           text={<Icon name='close' size={20} />}
                           onPress={closeModal}
                           loading={false}
                           type="fill"
                           otherStyles={'bg-slate-300/50 rounded-full'}
                           textStyles={'text-sm text-black/50'}
                        />
                     </View>

                     <View className='flex-row justify-start mb-4 items-center gap-4'>
                        <Text className='text-xl font-pregular'>{i18n.t('result.review.indexQuestion')} {selectedIndex + 1}</Text>
                        <Text className='bg-slate-200 rounded-md px-3 py-1 font-pregular text-slate-500'>{currentQuestion.question_id.question_point} {i18n.t('result.review.point')}</Text>
                     </View>

                     <View className='flex'>
                        <Text className='text-lg font-pregular mb-4 border-b-[1px] border-slate-300'>
                           {currentQuestion.question_id.question_excerpt}
                        </Text>

                        {currentQuestion && currentQuestion.question_id.question_answer_ids.map((answer, ansIndex) => {
                           if (currentQuestion.question_id.question_type === 'box') {
                              const correctTextAnswers = normalizeText(currentQuestion.question_id.correct_answer_ids[0].text);
                              const userAnswerText = normalizeText(answer.text);

                              const isAnswerCorrect = correctTextAnswers.includes(userAnswerText);

                              return (
                                 <View key={ansIndex} className='flex-row items-center mb-2'>
                                    <View className={`w-3 h-3 rounded-full mr-2`} />
                                    <Text className={`text-base ${isAnswerCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                       {answer.text}
                                    </Text>
                                 </View>
                              );
                           } else {
                              // Kiểm tra xem đây có phải là câu trả lời của người dùng hay không
                              const isUserAnswer = currentQuestion.answer.some(userAns => userAns._id === answer._id);
                              // Kiểm tra xem đây có phải là câu trả lời đúng hay không
                              const isCorrectAnswer = currentQuestion.question_id.correct_answer_ids.some(
                                 correctAns => correctAns._id === answer._id
                              );

                              const bulletStyle = isCorrectAnswer && isUserAnswer
                                 ? 'bg-yellow-500' // Cả câu trả lời của bạn và câu trả lời đúng
                                 : isCorrectAnswer
                                    ? 'bg-green-500' // Chỉ là câu trả lời đúng
                                    : isUserAnswer
                                       ? 'bg-red-500' // Chỉ là câu trả lời của bạn
                                       : 'bg-slate-400/50'; // Các câu trả lời khác

                              const textStyle = isCorrectAnswer && isUserAnswer
                                 ? 'text-yellow-500 font-semibold' // Cả câu trả lời của bạn và câu trả lời đúng
                                 : isCorrectAnswer
                                    ? 'text-green-500 font-semibold' // Chỉ là câu trả lời đúng
                                    : isUserAnswer
                                       ? 'text-red-500 font-regular' // Chỉ là câu trả lời của bạn
                                       : 'text-slate-400 font-regular'; // Các câu trả lời khác

                              return (
                                 <View key={ansIndex} className='flex-row items-center mb-2'>
                                    <View className={`w-3 h-3 rounded-full mr-2 ${bulletStyle}`} />
                                    <Text className={`text-base ${textStyle}`}>
                                       {answer.text}
                                    </Text>
                                 </View>
                              );
                           }
                        })}

                     </View>

                     {!currentQuestion.correct && (
                        <View className='mt-4'>
                           <Text className='text-base text-slate-600 font-pregular'>
                              {i18n.t('result.review.userAnswer')} {currentQuestion && (typeof currentQuestion.answer) === 'string' ? currentQuestion.answer : currentQuestion.answer.map(userAns => userAns.text).join(', ') || i18n.t('result.review.noAnswer')}
                           </Text>
                        </View>
                     )}
                     <View>
                        <Text className='text-base text-slate-600 font-pregular mt-4 underline'>
                           {i18n.t('result.review.explanation')}
                        </Text>
                        <Text className='text-sm text-slate-600/90 font-pextralight'>
                           {currentQuestion.question_id.question_explanation || i18n.t('result.review.textExplanation')}
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

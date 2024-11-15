import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, ScrollView, Alert, AppState } from 'react-native';
import Button from '../../../components/customs/Button';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAppProvider } from '@/contexts/AppProvider';
import Toast from 'react-native-toast-message-custom';
import { API_URL, API_VERSION, END_POINTS } from '../../../configs/api.config';
import RenderHTML from 'react-native-render-html';
import { Audio } from 'expo-av';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import RealtimeResult from '../(result)/realtime';
import socket from '@/utils/socket';
import RankBoard from '@/components/customs/RankBoard';
import Overlay from '@/components/customs/Overlay';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import { sortRankBoardDesc } from '../../../utils';
const RealtimePlay = () => {
   const { quizId, roomId, roomCode, createdUserId } = useGlobalSearchParams();
   const { i18n } = useAppProvider();
   const { width } = useWindowDimensions();
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
   const [selectedAnswers, setSelectedAnswers] = useState([]);
   const [correctCount, setCorrectCount] = useState(0);
   const [wrongCount, setWrongCount] = useState(0);
   const [score, setScore] = useState(0);
   const [isCompleted, setIsCompleted] = useState(false);
   const [isCorrect, setIsCorrect] = useState(false);
   const [isChosen, setIsChosen] = useState(false);
   const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
   const [buttonText, setButtonText] = useState(i18n.t('play.single.buttonConfirm'));
   const [buttonColor, setButtonColor] = useState('bg-white');
   const [buttonTextColor, setButtonTextColor] = useState('text-black');
   const { userData } = useAuthContext();
   const [isProcessing, setIsProcessing] = useState(false);
   const [questions, setQuestions] = useState([]);
   const [sound, setSound] = useState(null);
   const { processAccessTokenExpired } = useAuthContext();
   const [questionTimeCountDown, setQuestionTimeCountDown] = useState(questions.length > 0 ? questions[0].question_time : 30);
   const [rankData, setRankData] = useState([]);
   const [showRankBoard, setShowRankBoard] = useState(false);
   const router = useRouter();
   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
   const [confirmFn, setConfirmFn] = useState('close');
   const [alertMessage, setAlertMessage] = useState('');
   const [loading, setLoading] = useState(true);

   const SHOW_RANK_BOARD_TIME = 2000;
   const HIDDEN_RANK_BOARD_TIME = 6000;
   const QUESTION_RESET_TIME = 8000;

   // Lấy câu hỏi của bộ quiz
   useEffect(() => {
      const fetchQuestions = async () => {
         const res = await fetch(API_URL + API_VERSION.V1 + END_POINTS.GET_QUIZ_QUESTIONS, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-client-id': userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({
               quiz_id: quizId,
            }),
         });

         const data = await res.json();
         // console.log(data)
         if (data.statusCode !== 200) {
            if (data.statusCode === 404 && data.message === 'Access denied') {
               Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: "Không thể truy cập bài thi này.",
               });
               await processAccessTokenExpired();
            } else if (data.message === "expired") {
               await processAccessTokenExpired();
            }
         } else {
            setQuestions(data.metadata);
            setQuestionTimeCountDown(data.metadata[0].question_time);
         }
      };
      if (quizId) {
         fetchQuestions();
      }
   }, [quizId]);

   // Lắng nghe khi người dùng thoát ra khỏi ứng dụng
   useEffect(() => {
      const handleAppStateChange = (nextAppState) => {
         if (nextAppState === 'background' || nextAppState === 'inactive') {
            // Gửi sự kiện thoát phòng đến server
            console.log('User has left the app');
            socket.emit('leaveRoom', { roomCode: roomCode, user: userData });
         }
      };

      const subscription = AppState.addEventListener('change', handleAppStateChange);

      return () => {
         subscription.remove();
      };
   }, []);

   // Lắng nghe sự kiện khi chủ phòng kết thúc  phòng chơi
   useEffect(() => {
      socket.on('quizEnded', () => {
         setConfirmFn('endquiz')
         setShowConfirmDialog(true);
         setAlertMessage('Phòng thi đã kết thúc. Bạn sẽ được chuyển tới màn hình kết quả');
      });

      // Cập nhật bảng xếp hạng của người chơi
      socket.on('updateRanking', (rank) => {
         console.log(JSON.stringify(rank, null, 2));
         setRankData(sortRankBoardDesc(rank));
      });

      return () => {
         socket.off('quizEnded');
         socket.off('updateRanking');
      };
   }, []);

   // Kiểm tra xem người dùng có đang làm giở câu hỏi nào không
   useEffect(() => {
      // Lấy dữ liệu từ local storage

      const getData = async () => {
         setLoading(true);
         try {
            const value = await AsyncStorage.getItem("User_" + userData._id + "_Room_" + roomCode + "_Doing");
            const correct = await AsyncStorage.getItem("User_" + userData._id + "_Room_" + roomCode + "_CorrectPercent");
            const wrong = await AsyncStorage.getItem("User_" + userData._id + "_Room_" + roomCode + "_WrongPercent");

            if (value !== null && correct !== null && wrong !== null) {
               await AsyncStorage.removeItem("User_" + userData._id + "_Room_" + roomCode + "_Doing");
               await AsyncStorage.removeItem("User_" + userData._id + "_Room_" + roomCode + "_CorrectPercent");
               await AsyncStorage.removeItem("User_" + userData._id + "_Room_" + roomCode + "_WrongPercent");
               // Người dùng đã thoát ra khỏi phòng thi và đang làm câu hỏi nào đó
               const data = JSON.parse(value);
               const correctData = JSON.parse(correct);
               const wrongData = JSON.parse(wrong);

               // Cho người dùng tiếp tục làm câu hỏi đó
               const index = questions.findIndex(question => question._id === data);

               if (index > -1) {
                  setCurrentQuestionIndex(index + 1);
                  setQuestionTimeCountDown(questions[index + 1].question_time);
               } else {
                  setCurrentQuestionIndex(0);
                  setQuestionTimeCountDown(questions[0].question_time);
               }
               const response = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.RESULT_RANK}`, {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                     'x-client-id': userData._id,
                     authorization: userData.accessToken,
                  },
                  body: JSON.stringify({
                     room_id: roomId,
                     user_id: userData._id,
                     quiz_id: quizId,
                  }),
               });

               const resData = await response.json();
               if (resData.statusCode === 200) {
                  const currentData = resData.metadata.rank.filter(rank => rank.user_id._id === userData._id);
                  console.log("correct: " + correctData)
                  console.log("wrong: " + wrongData)
                  setScore(currentData[0].userScore);
                  setCorrectCount(correctData);
                  setWrongCount(wrongData);
               }
            }

         } catch (error) {
            // error reading value
         } finally {
            setLoading(false);
         }
      }

      if (questions.length > 0) {
         getData();
      }
   }, [questions])


   // Hàm xử lý lưu kết quả của người dùng sau khi làm xong câu hỏi
   const saveQuestionResult = async (questionId, answerId, correct, score) => {
      try {
         const response = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_UPDATE_RESULT}`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-client-id': userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({
               room_id: roomId,
               user_id: userData._id,
               quiz_id: quizId,
               question_id: questionId,
               answer: answerId,
               correct,
               score,
            }),
         })

         const data = await response.json();
         if (data.statusCode !== 200) {
            Toast.show({
               type: 'error',
               text1: 'Lỗi khi lưu kết quả câu hỏi.',
               text2: data.message,
            });
         } else {
            console.log("Save question result successfully")
            // emit event to server
            socket.emit('submitAnswer', {
               roomCode: roomCode,
               userId: userData._id,
               quizId: quizId,
               roomId: roomId,
            });
         }
      } catch (error) {
         Toast.show({
            type: 'error',
            text1: 'Lỗi khi lưu kết quả câu hỏi.',
            text2: { error }
         });
      }
   };

   // Hàm xử lý khi người dùng đã hoàn thành bộ câu hỏi
   const completed = async () => {
      try {
         const data = await fetch(API_URL + API_VERSION.V1 + END_POINTS.RESULT_COMPLETED, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-client-id': userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({
               room_id: roomId,
               user_id: userData._id,
               quiz_id: quizId,
               status: 'completed',
            }),
         });

         const dataRes = await data.json();
         console.log(dataRes)
         if (dataRes.statusCode !== 200) {
            Toast.show({
               type: 'error',
               text1: 'Lỗi khi cập nhật trạng thái hoàn thành.',
               text2: dataRes.message,
            });
         } else {
            setIsCompleted(true);
            await AsyncStorage.removeItem("User_" + userData._id + "_Room_" + roomCode + "_Doing");
            await AsyncStorage.removeItem("User_" + userData._id + "_Room_" + roomCode + "_CorrectPercent");
            await AsyncStorage.removeItem("User_" + userData._id + "_Room_" + roomCode + "_WrongPercent");
         }
      } catch (error) {
         Toast.show({
            type: 'error',
            text1: 'Lỗi khi cập nhật trạng thái hoàn thành.',
            text2: { error }
         });
      }
   };

   const playSound = async (isCorrectAnswer) => {
      let soundPath = isCorrectAnswer ? require('@/assets/sounds/correct.mp3') : require('@/assets/sounds/incorrect.mp3');
      const { sound } = await Audio.Sound.createAsync(soundPath);
      setSound(sound);
      await sound.playAsync();
   };

   useEffect(() => {
      return sound
         ? () => {
            sound.unloadAsync();
         }
         : undefined;
   }, [sound]);


   // Hàm cập nhật thời gian đếm ngược cho mỗi câu hỏi
   useEffect(() => {
      let interval = null;
      if (!isProcessing && !isCompleted && !showConfirmDialog) {
         interval = setInterval(() => {
            setQuestionTimeCountDown(prevTime => {
               if (prevTime > 0) {
                  return prevTime - 1;
               } else {
                  clearInterval(interval);
                  handleSubmit();
                  return 30;
               }
            });
         }, 1000);
      }

      return () => clearInterval(interval);
   }, [isProcessing, questionTimeCountDown]);



   // Hàm xử lý khi người dùng vào đáp án trả lời câu hỏi
   const handleAnswerPress = (answerId) => {
      if (questions[currentQuestionIndex].question_type === 'single') {
         setSelectedAnswers([answerId]);
         setIsChosen(true);
         setButtonColor('bg-[#0D70D2]');
         setButtonTextColor('text-white');
      } else {
         if (selectedAnswers.includes(answerId)) {
            setSelectedAnswers(selectedAnswers.filter((id) => id !== answerId));
         } else {
            setSelectedAnswers([...selectedAnswers, answerId]);
         }
      }
   };

   // Hàm sử lý khi người dùng xác nhận câu trả lời
   const handleSubmit = async () => {
      if (!isProcessing) {
         setIsProcessing(true);
         const currentQuestion = questions[currentQuestionIndex];
         const correctAnswerIds = currentQuestion.correct_answer_ids.map(answer => answer._id);

         let isAnswerCorrect = false;

         if (currentQuestion.question_type === 'single') {
            isAnswerCorrect = selectedAnswers[0] === correctAnswerIds[0];
         } else {
            isAnswerCorrect =
               selectedAnswers.length === correctAnswerIds.length &&
               selectedAnswers.every((answerId) => correctAnswerIds.includes(answerId));
         }

         await playSound(isAnswerCorrect);

         if (isAnswerCorrect) {
            setIsCorrect(true);
            setCorrectCount(correctCount + 1);
            setScore(score + currentQuestion.question_point);
            setButtonColor('bg-[#4CAF50]');
            setButtonText(`+ ${currentQuestion.question_point}`);
         } else {
            setIsCorrect(false);

            setWrongCount(wrongCount + 1);
            setButtonColor('bg-[#F44336]');
            setButtonTextColor('text-white')
            setButtonText(i18n.t('play.single.incorrect'));
         }

         saveQuestionResult(
            currentQuestion._id,
            selectedAnswers,
            isAnswerCorrect,
            currentQuestion.question_point
         );

         // Lưu câu hỏi hiện tại của người dùng đang làm vào local storage
         // Nếu người dùng có lỡ thoát ra vào lại thì cho phép làm tiếp từ vị trí câu hỏi đó
         await AsyncStorage.setItem("User_" + userData._id + "_Room_" + roomCode + "_Doing", JSON.stringify(currentQuestion._id));

         await AsyncStorage.setItem("User_" + userData._id + "_Room_" + roomCode + "_CorrectPercent", JSON.stringify(correctCount + 1));

         await AsyncStorage.setItem("User_" + userData._id + "_Room_" + roomCode + "_WrongPercent", JSON.stringify(wrongCount + 1));

         // emit event to server
         socket.emit('submitAnswer', {
            roomCode: roomCode,
            userId: userData._id,
            quizId: quizId,
            roomId: roomId,
         });

         setShowCorrectAnswer(true);
         setTimeout(() => {
            setShowRankBoard(true);
         }, SHOW_RANK_BOARD_TIME);

         setTimeout(() => {
            setShowRankBoard(false);
         }, HIDDEN_RANK_BOARD_TIME);

         setTimeout(() => {
            setIsProcessing(false);
            if (currentQuestionIndex < questions.length - 1) {
               setCurrentQuestionIndex(currentQuestionIndex + 1);
               setSelectedAnswers([]);
               setIsChosen(false);
               setShowCorrectAnswer(false);
               setButtonText(i18n.t('play.single.buttonConfirm'));
               setButtonColor('bg-white');
               setButtonTextColor('text-black');
               setQuestionTimeCountDown(questions[currentQuestionIndex + 1].question_time);
               // setQuestionTimeCountDown(500);
            } else {
               completed();
            }
         }, QUESTION_RESET_TIME);
      }
   };

   const handleRestart = () => {
      setIsCorrect(false);
      setCurrentQuestionIndex(0);
      setCorrectCount(0);
      setWrongCount(0);
      setScore(0);
      setIsCompleted(false);
      setSelectedAnswers([]);
      setIsChosen(false);
      setShowCorrectAnswer(false);
      setButtonText(i18n.t('play.single.buttonConfirm'));
      setButtonColor('bg-white');
      setButtonTextColor('text-black');
      setQuestionTimeCountDown(-1);
   };

   // Nếu đã hoàn thành thì trả về component kết quả
   if (isCompleted) {
      return (
         <RealtimeResult
            quizId={quizId}
            correctCount={correctCount}
            wrongCount={wrongCount}
            score={score}
            totalQuestions={questions.length}
            handleRestart={handleRestart}
            roomCode={roomCode}
            rankBoardData={rankData}
            createdUserId={createdUserId}
            roomId={roomId}
         />
      );
   }

   // Xử lý khi đang tải dữ liệu
   if (loading) {
      return <Text>Loading</Text>
   }

   return (
      <View className="flex-1 relative">
         <Overlay visible={showRankBoard} onPress={() => { }} />
         <RankBoard users={rankData} visible={showRankBoard} currentUser={userData} createdUser={createdUserId} />

         <ConfirmDialog
            disableCancel={true}
            title={"Thông báo"}
            visible={showConfirmDialog}
            onCancel={() => {
               setShowConfirmDialog(false);
               setConfirmFn('close');
            }}
            onConfirm={() => {
               setShowConfirmDialog(false);
               setConfirmFn('close');
               if (confirmFn === 'endquiz') {
                  completed();
                  socket.emit('leaveRoom', { roomCode: roomCode, user: userData });
                  setIsCompleted(true);
               }
            }}
            message={alertMessage}
         />

         <View className="flex-row justify-between items-center px-5 pt-10 pb-3 bg-black">
            <Button
               text={i18n.t('play.single.buttonQuit')}
               onPress={() => {
                  Alert.alert('Thông báo', 'Bạn có chắc chắn muốn thoát phòng? Kết quả sẽ lưu lại dựa trên số câu hỏi đã hoàn thành', [
                     {
                        text: 'Hủy',
                        onPress: () => { }
                     },
                     {
                        text: 'Thoát',
                        onPress: () => {
                           completed();
                           setIsCompleted(true);
                           socket.emit('leaveRoom', { roomCode: roomCode, user: userData });
                           router.replace({
                              pathname: '/(app)/(home)',
                              params: {}
                           })
                        }
                     }
                  ])
               }}
               loading={false}
               type="fill"
               otherStyles={'bg-[#F41D1D]'}
               textStyles={'font-medium text-sm text-white'}
            />
         </View>

         <View className="flex-1 bg-[#1C2833] px-5 py-4 justify-between">
            <View className="flex-row items-center justify-between">
               <Text className="bg-[#484E54] rounded-2xl text-white p-3 self-start">
                  {`${i18n.t('play.single.score')}: ${score}`}
               </Text>
               <Text className="p-3 bg-[#484E54] rounded-2xl text-white self-start">
                  Thời gian còn lại: {questionTimeCountDown}
               </Text>
            </View>
            <View className="bg-[#fff] rounded-2xl p-4 py-10">
               <Text className="text-sm font-semibold text-black absolute top-2 left-2">
                  {`${i18n.t('play.single.questionCouter')} ` + (currentQuestionIndex + 1) + " / " + questions.length}
               </Text>

               <ScrollView
                  style={{ maxHeight: 200 }}
                  showsVerticalScrollIndicator={false}
               >
                  <RenderHTML
                     defaultViewProps={{}}
                     defaultTextProps={{
                        style: {
                           color: 'black',
                           fontSize: 25,
                           fontWeight: '400',
                        },
                     }}
                     contentWidth={width}
                     source={{
                        html: questions[currentQuestionIndex]?.question_excerpt || ''
                     }}
                  />
               </ScrollView>
            </View>
            <View>
               {questions[currentQuestionIndex]?.question_answer_ids.map((answer, index) => {
                  let backgroundColor = '#484E54'; // Màu mặc định

                  if (showCorrectAnswer) {
                     if (questions[currentQuestionIndex].question_type === 'single') {
                        if (answer._id === questions[currentQuestionIndex].correct_answer_ids[0]._id) {
                           backgroundColor = '#4CAF50'; // Green - Đúng
                        } else if (answer._id === selectedAnswers[0]) {
                           backgroundColor = '#F44336'; // Red - Sai
                        }
                     } else {
                        if (questions[currentQuestionIndex].correct_answer_ids.map(answer => answer._id).includes(answer._id)) {
                           backgroundColor = '#4CAF50'; // Green - Đúng
                        } else if (selectedAnswers.includes(answer._id)) {
                           backgroundColor = '#F44336'; // Red - Sai
                        }
                     }
                  } else if (selectedAnswers.includes(answer._id)) {
                     backgroundColor = '#0D70D2'; // Màu xanh khi người dùng chọn
                  }

                  return (
                     <TouchableOpacity
                        key={index}
                        onPress={() => handleAnswerPress(answer._id)}
                        style={{
                           backgroundColor,
                           padding: 8,
                           marginVertical: 5,
                           borderRadius: 20,
                        }}
                        disabled={showCorrectAnswer} // Vô hiệu hóa khi đã hiển thị kết quả
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
               otherStyles={`${buttonColor} p-4 `}
               textStyles={`text-white ${buttonTextColor} mx-auto text-lg`}
               disabled={!isChosen || showCorrectAnswer}
            />
         </View>
      </View>
   );
};

export default RealtimePlay;

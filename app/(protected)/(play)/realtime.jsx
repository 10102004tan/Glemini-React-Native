import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Alert,
  AppState,
  TextInput,
  Animated,
  Easing,
  Image,
} from 'react-native';
import Button from '../../../components/customs/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppProvider } from '@/contexts/AppProvider';
import Toast from 'react-native-toast-message-custom';
import { API_VERSION, END_POINTS } from '../../../configs/api.config';
import api from '@/libs/axios';
import RenderHTML from 'react-native-render-html';
import { Audio } from 'expo-av';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import RealtimeResult from '../(result)/realtime';
import socket from '@/libs/socket';
import RankBoard from '@/components/customs/RankBoard';
import Overlay from '@/components/customs/Overlay';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import { sortRankBoardDesc } from '../../../utils';
import { AntDesign } from '@expo/vector-icons';
import OrderInput from '@/components/customs/OrderInput';
import Onechoice from '@/components/customs/Onechoice';
import FillInTheBlank from '@/components/customs/FillInTheBlank';
import MatchItems from '@/components/customs/MatchItems';
import MultipleChoice from '@/components/customs/MultipleChoice';
import ScaleTouchable from '@/components/customs/ScaleTouchable';
import ThoBayMauGif from '@/assets/images/congratulations.1.webp';
import InCorrectGif from '@/assets/images/incorrect.1.webp';
import { shuffleArray } from '@/utils';

const RealtimePlay = () => {
  const { quizId, roomId, roomCode, createdUserId } = useGlobalSearchParams();
  const { i18n } = useAppProvider();
  const { width } = useWindowDimensions();
  const { user } = useAuthStore();
  const router = useRouter();

  // Animation values
  const questionAnim = useRef(new Animated.Value(0)).current;
  const optionsAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;

  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [arrayAnswer, setArrayAnswer] = useState([]);
  const [isNext, setIsNext] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isChosen, setIsChosen] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [buttonText, setButtonText] = useState(i18n.t('play.single.buttonConfirm'));
  const [buttonColor, setButtonColor] = useState('bg-white');
  const [buttonTextColor, setButtonTextColor] = useState('text-black');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sound, setSound] = useState(null);
  const [questionTimeCountDown, setQuestionTimeCountDown] = useState(30);
  const [rankData, setRankData] = useState([]);
  const [showRankBoard, setShowRankBoard] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmFn, setConfirmFn] = useState('close');
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [score, setScore] = useState(0);

  const SHOW_RANK_BOARD_TIME = 2000;
  const HIDDEN_RANK_BOARD_TIME = 6000;
  const QUESTION_RESET_TIME = 8000;

  const currentQuestion = questions[currentQuestionIndex];

  // Animate in on question change
  useEffect(() => {
    questionAnim.setValue(0);
    optionsAnim.setValue(0);
    buttonAnim.setValue(0);
    Animated.timing(questionAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
    Animated.timing(optionsAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
    Animated.spring(buttonAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
    }).start();
  }, [currentQuestionIndex]);

  // Animate modal result
  useEffect(() => {
    if (isNext) {
      modalAnim.setValue(0);
      Animated.timing(modalAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();
    }
  }, [isNext]);

    // Lấy câu hỏi của bộ quiz và ranking data
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.post(API_VERSION.V1 + END_POINTS.GET_QUIZ_QUESTIONS, {
          quiz_id: quizId,
        });

        const data = res.data;
        if (data.statusCode !== 200) {
          if (data.statusCode === 404 && data.message === 'Access denied') {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Không thể truy cập bài thi này.',
            });
          }
        } else {
          // Chuyển đổi format từ v1 sang v2 để tương thích với components
          const convertedQuestions = data.metadata.map((question, index) => ({
            id: question._id,
            question: question.question_excerpt,
            type: question.question_type,
            options: question.question_answer_ids.map(answer => ({
              id: answer._id,
              text: answer.text,
              image: answer.image || '',
            })),
            correctAnswers: question.correct_answer_ids.map(answer => answer._id),
            question_point: question.question_point,
            question_time: question.question_time,
            image: question.question_image || '',
          }));

          // Xáo trộn đáp án của từng câu hỏi
          const shuffledQuestions = convertedQuestions.map((q) => {
            if (Array.isArray(q.options)) {
              return {
                ...q,
                options: shuffleArray(q.options),
              };
            }
            return q;
          });

          setQuestions(shuffledQuestions);
          setQuestionTimeCountDown(shuffledQuestions[0]?.question_time || 30);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

        const fetchInitialRanking = async () => {
      try {
        console.log('Fetching initial ranking...');
        const response = await api.post(`${API_VERSION.V1}${END_POINTS.RESULT_RANK}`, {
          room_id: roomId,
          user_id: user.user_id,
          quiz_id: quizId,
        });

        const data = response.data;
        if (data.statusCode === 200) {
          console.log('Initial ranking data:', data.metadata);
          // Xử lý format ranking data
          if (data.metadata && data.metadata.rank && Array.isArray(data.metadata.rank)) {
            setRankData(data.metadata.rank);
          } else if (Array.isArray(data.metadata)) {
            setRankData(data.metadata);
          } else {
            setRankData([]);
          }
        } else {
          console.log('Initial ranking API returned non-200 status:', data.statusCode);
        }
      } catch (error) {
        console.error('Error fetching initial ranking:', error);
        // Không hiển thị Toast error cho initial ranking fetch
      }
    };

    if (quizId) {
      fetchQuestions();
      if (roomId && user.user_id) {
        fetchInitialRanking();
      }
    }
  }, [quizId, roomId, user.user_id]);

  // Lắng nghe khi người dùng thoát ra khỏi ứng dụng
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        console.log('User has left the app');
        socket.emit('leaveRoom', { roomCode: roomCode, user: user });
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  // Lắng nghe sự kiện khi chủ phòng kết thúc phòng chơi
  useEffect(() => {
    socket.on('quizEnded', () => {
      setConfirmFn('endquiz');
      setShowConfirmDialog(true);
      setAlertMessage('Phòng thi đã kết thúc. Bạn sẽ được chuyển tới màn hình kết quả');
    });

    // Cập nhật bảng xếp hạng của người chơi
    socket.on('updateRanking', (rank) => {
      console.log('Received ranking data:', JSON.stringify(rank, null, 2));
      // Backend trả về object có rank array, cần extract ra
      if (rank && rank.rank && Array.isArray(rank.rank)) {
        setRankData(rank.rank);
      } else if (Array.isArray(rank)) {
        setRankData(rank);
      } else {
        console.log('Invalid ranking data format:', rank);
        setRankData([]);
      }
    });

    // Lắng nghe sự kiện khi user join room
    socket.on('userJoined', (data) => {
      console.log('User joined room event:', data);
    });

    // Lắng nghe danh sách user cập nhật
    socket.on('updateUserList', (users) => {
      console.log('User list updated:', users);
    });

    return () => {
      socket.off('quizEnded');
      socket.off('updateRanking');
      socket.off('userJoined');
      socket.off('updateUserList');
    };
  }, []);

  // Debug khi rankData thay đổi
  useEffect(() => {
    console.log('RankData changed:', rankData);
    console.log('RankData type:', typeof rankData);
    console.log('RankData is array:', Array.isArray(rankData));
  }, [rankData]);

      // Authenticate socket và join room khi component mount
  useEffect(() => {
    if (user && user.accessToken && roomCode) {
      console.log('Setting up socket connection...');
      authenticateSocket(user.accessToken, user.refreshToken);

      // Join room khi vào màn hình chơi
      setTimeout(() => {
        console.log('Joining room:', roomCode);
        socket.emit('joinRoom', { roomCode, user });
      }, 1000);
    }
  }, [user, roomCode]);

  // Thêm useEffect riêng để đảm bảo join room sau khi socket đã connect
  useEffect(() => {
    const joinRoomIfConnected = () => {
      console.log('Checking socket status:', {
        connected: socket.connected,
        hasUser: !!user,
        hasRoomCode: !!roomCode,
        roomCode: roomCode
      });

      if (socket.connected && user && roomCode) {
        console.log('Socket connected, joining room:', roomCode);
        socket.emit('joinRoom', { roomCode, user });
      } else {
        console.log('Cannot join room:', {
          socketConnected: socket.connected,
          hasUser: !!user,
          hasRoomCode: !!roomCode
        });
      }
    };

    // Kiểm tra ngay lập tức
    joinRoomIfConnected();

    // Lắng nghe sự kiện connect để join room
    socket.on('connect', () => {
      console.log('Socket connected, joining room:', roomCode);
      joinRoomIfConnected();
    });

    return () => {
      socket.off('connect');
    };
  }, [socket.connected, user, roomCode]);

  // Lắng nghe socket connect/disconnect
  useEffect(() => {
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socket.on('reconnect', () => {
      console.log('Socket reconnected, rejoining room:', roomCode);
      if (user && user.accessToken) {
        authenticateSocket(user.accessToken, user.refreshToken);
        setTimeout(() => {
          socket.emit('joinRoom', { roomCode, user });
        }, 500);
      }
    });

    return () => {
      socket.off('disconnect');
      socket.off('error');
      socket.off('reconnect');
    };
  }, [user, roomCode]);

  // Hàm xử lý lưu kết quả của người dùng sau khi làm xong câu hỏi
  const saveQuestionResult = async (questionId, answerId, correct, score, questionType) => {
    try {
      const response = await api.post(`${API_VERSION.V1}${END_POINTS.ROOM_UPDATE_RESULT}`, {
        room_id: roomId,
        user_id: user.user_id,
        quiz_id: quizId,
        question_id: questionId,
        answer: answerId,
        correct,
        score,
        question_type: questionType,
      });

      const data = response.data;
      if (data.statusCode !== 200) {
        console.log('Save question result failed with status:', data.statusCode);
        Toast.show({
          type: 'error',
          text1: 'Lỗi khi lưu kết quả câu hỏi.',
          text2: data.message,
        });
      } else {
        console.log('Save question result successfully');
        // emit event to server
        const submitData = {
          roomCode: roomCode,
          userId: user.user_id,
          quizId: quizId,
          roomId: roomId,
          point: currentQuestion.question_point,
          isCorrect: correct,
        };
        console.log('Emitting submitAnswer:', submitData);
        socket.emit('submitAnswer', submitData);
      }
    } catch (error) {
      console.error('Error in saveQuestionResult:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi khi lưu kết quả câu hỏi.',
        text2: { error },
      });
    }
  };

  // Hàm xử lý khi người dùng đã hoàn thành bộ câu hỏi
  const completed = async () => {
    try {
      console.log('Calling completed API...');
      const data = await api.post(API_VERSION.V1 + END_POINTS.RESULT_COMPLETED, {
        room_id: roomId,
        user_id: user.user_id,
        quiz_id: quizId,
        status: 'completed',
      });

      const dataRes = data.data;
      console.log('Completed API response:', dataRes);
      if (dataRes.statusCode !== 200) {
        console.log('Completed API returned non-200 status:', dataRes.statusCode);
        Toast.show({
          type: 'error',
          text1: 'Lỗi khi cập nhật trạng thái hoàn thành.',
          text2: dataRes.message,
        });
      } else {
        console.log('Completed API successful');
        setIsCompleted(true);
        await AsyncStorage.removeItem('User_' + user.user_id + '_Room_' + roomCode + '_Doing');
        await AsyncStorage.removeItem(
          'User_' + user.user_id + '_Room_' + roomCode + '_CorrectPercent',
        );
        await AsyncStorage.removeItem(
          'User_' + user.user_id + '_Room_' + roomCode + '_WrongPercent',
        );
      }
    } catch (error) {
      console.error('Error in completed function:', error);

      // Xử lý lỗi cụ thể
      if (error.response?.status === 400 && error.response?.data?.message === 'Result not found') {
        Toast.show({
          type: 'warn',
          text1: 'Bạn chưa làm câu nào nên không có kết quả để nộp.',
          visibilityTime: 2000,
          autoHide: true,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi khi cập nhật trạng thái hoàn thành.',
          text2: error.message || 'Vui lòng thử lại sau.',
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    }
  };

  const playSound = async (isCorrectAnswer) => {
    let soundPath = isCorrectAnswer
      ? require('@/assets/sounds/correct.mp3')
      : require('@/assets/sounds/incorrect.mp3');
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
    if (!isProcessing && !isCompleted && !showConfirmDialog && !isNext) {
      interval = setInterval(() => {
        setQuestionTimeCountDown((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(interval);
            handleCheck(arrayAnswer);
            return 30;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isProcessing, questionTimeCountDown, isNext]);

  const handleClickOption = (option) => {
    if (!currentQuestion) return;

    switch (currentQuestion.type) {
      case 'single':
        if (option === null) {
          setArrayAnswer([]);
          setIsChosen(false);
        } else {
          setArrayAnswer([option]);
          setIsChosen(true);
          setButtonColor('bg-[#0D70D2]');
          setButtonTextColor('text-white');
        }
        break;
      case 'multiple':
        setArrayAnswer((prev) => {
          const newAnswers = prev.includes(option)
            ? prev.filter((id) => id !== option)
            : [...prev, option];
          setIsChosen(newAnswers.length > 0);
          if (newAnswers.length > 0) {
            setButtonColor('bg-[#0D70D2]');
            setButtonTextColor('text-white');
          } else {
            setButtonColor('bg-white');
            setButtonTextColor('text-black');
          }
          return newAnswers;
        });
        break;
      case 'fill':
        console.log('Fill question answer:', option);
        setArrayAnswer(option);
        setIsChosen(true);
        setButtonColor('bg-[#0D70D2]');
        setButtonTextColor('text-white');
        break;
      case 'order':
        setArrayAnswer((prev) => {
          const newAnswers = prev.includes(option)
            ? prev.filter((id) => id !== option)
            : [...prev, option];
          setIsChosen(newAnswers.length > 0);
          if (newAnswers.length > 0) {
            setButtonColor('bg-[#0D70D2]');
            setButtonTextColor('text-white');
          } else {
            setButtonColor('bg-white');
            setButtonTextColor('text-black');
          }
          return newAnswers;
        });
        break;
      default:
        break;
    }
  };

  const renderOptions = () => {
    if (!currentQuestion) return null;

    const { options, type, image = '', question } = currentQuestion;

    switch (type) {
      case 'single':
        return (
          <View
            style={{
              flexWrap: 'wrap',
              gap: 10,
              justifyContent: 'center',
              alignItems: 'center',
              height: 600,
            }}
          >
            <Onechoice
              options={options}
              onClick={handleClickOption}
              image={image}
              selectedAnswers={arrayAnswer}
              showCorrectAnswer={showCorrectAnswer}
              correctAnswers={currentQuestion.correctAnswers}
            />
          </View>
        );
      case 'multiple':
        return (
          <View
            style={{
              flexWrap: 'wrap',
              gap: 10,
              justifyContent: 'center',
              alignItems: 'center',
              height: 600,
            }}
          >
            <MultipleChoice
              options={options}
              onClick={handleClickOption}
              image={image}
              selectedAnswers={arrayAnswer}
              showCorrectAnswer={showCorrectAnswer}
              correctAnswers={currentQuestion.correctAnswers}
            />
          </View>
        );
      case 'fill':
        return (
          <FillInTheBlank
            options={options}
            onClick={handleClickOption}
            image={image}
            question={question}
            selectedAnswers={arrayAnswer}
            showCorrectAnswer={showCorrectAnswer}
            correctAnswers={currentQuestion.correctAnswers}
          />
        );
      case 'order':
        return (
          <OrderInput
            options={options}
            onClick={handleClickOption}
            selectedAnswers={arrayAnswer}
            showCorrectAnswer={showCorrectAnswer}
            correctAnswers={currentQuestion.correctAnswers}
          />
        );
      default:
        return null;
    }
  };

  const handleCheck = async (arrayAnswer) => {
    if (!currentQuestion || arrayAnswer.length === 0) return;

    setIsNext(true);
    setIsProcessing(true);

    try {
            // Kiểm tra đáp án đúng
      let isAnswerCorrect = false;

      if (currentQuestion.type === 'fill') {
        // Xử lý câu hỏi fill
        const normalizeText = (text) => {
          if (!text || typeof text !== 'string') return '';
          return text.toLowerCase().replace(/\s+/g, '').trim();
        };

                // Lấy correct answers từ correctAnswers hoặc correct_answer_ids
        let correctTextAnswers = [];
        if (currentQuestion.correctAnswers && Array.isArray(currentQuestion.correctAnswers)) {
          correctTextAnswers = currentQuestion.correctAnswers.map((a) =>
            normalizeText(a.text || a),
          );
        } else if (currentQuestion.correct_answer_ids && Array.isArray(currentQuestion.correct_answer_ids)) {
          correctTextAnswers = currentQuestion.correct_answer_ids.map((a) =>
            normalizeText(a.text || a),
          );
        }

        const userAnswer = normalizeText(arrayAnswer || '');
        console.log('Fill question check:', {
          correctTextAnswers,
          userAnswer,
          arrayAnswer,
          currentQuestion: {
            type: currentQuestion.type,
            correctAnswers: currentQuestion.correctAnswers,
            correct_answer_ids: currentQuestion.correct_answer_ids
          }
        });
        isAnswerCorrect = correctTextAnswers.includes(userAnswer);
      } else {
        // Xử lý các loại câu hỏi khác
        const correctAnswerIds = currentQuestion.correctAnswers;
        if (currentQuestion.type === 'single') {
          isAnswerCorrect = arrayAnswer[0] === correctAnswerIds[0];
        } else {
          isAnswerCorrect =
            arrayAnswer.length === correctAnswerIds.length &&
            arrayAnswer.every((answerId) => correctAnswerIds.includes(answerId));
        }
      }

      setIsCorrect(isAnswerCorrect);

      if (isAnswerCorrect) {
        setCorrectCount(prev => prev + 1);
        setScore(prev => prev + currentQuestion.question_point);
      } else {
        setWrongCount(prev => prev + 1);
      }

      await playSound(isAnswerCorrect);

      // Lưu kết quả
      saveQuestionResult(
        currentQuestion.id,
        currentQuestion.type === 'fill' ? arrayAnswer : arrayAnswer,
        isAnswerCorrect,
        currentQuestion.question_point,
        currentQuestion.type,
      );

                  // Hiển thị bảng xếp hạng
      setTimeout(async () => {
        console.log('Showing rank board, current rankData:', rankData);
        console.log('RankData length:', rankData?.length || 0);

        // Nếu rankData trống, thử lấy từ API
        if (!rankData || rankData.length === 0) {
          try {
            console.log('Fetching ranking from API...');
            const response = await api.post(`${API_VERSION.V1}${END_POINTS.RESULT_RANK}`, {
              room_id: roomId,
              user_id: user.user_id,
              quiz_id: quizId,
            });

            const data = response.data;
            if (data.statusCode === 200) {
              console.log('API ranking data:', data.metadata);
              // Xử lý format ranking data
              if (data.metadata && data.metadata.rank && Array.isArray(data.metadata.rank)) {
                setRankData(data.metadata.rank);
              } else if (Array.isArray(data.metadata)) {
                setRankData(data.metadata);
              } else {
                setRankData([]);
              }
            } else {
              console.log('Ranking API returned non-200 status:', data.statusCode);
            }
          } catch (error) {
            console.error('Error fetching ranking:', error);
            // Không hiển thị Toast error cho ranking fetch
          }
        } else {
          console.log('Using existing rankData for display');
        }

        setShowRankBoard(true);
      }, SHOW_RANK_BOARD_TIME);

      // Tự động ẩn bảng xếp hạng sau một thời gian
      setTimeout(() => {
        setShowRankBoard(false);
      }, HIDDEN_RANK_BOARD_TIME);

    } catch (error) {
      console.error('Error checking answer:', error);
    }
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionTimeCountDown(questions[currentQuestionIndex + 1]?.question_time || 30);
    } else {
      await completed();
    }

    setArrayAnswer([]);
    setIsNext(false);
    setIsProcessing(false);
    setIsChosen(false);
    setShowCorrectAnswer(false);
    setButtonText(i18n.t('play.single.buttonConfirm'));
    setButtonColor('bg-white');
    setButtonTextColor('text-black');
  };

  const handleRestart = () => {
    setIsCorrect(false);
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setScore(0);
    setIsCompleted(false);
    setArrayAnswer([]);
    setIsChosen(false);
    setShowCorrectAnswer(false);
    setButtonText(i18n.t('play.single.buttonConfirm'));
    setButtonColor('bg-white');
    setButtonTextColor('text-black');
    setQuestionTimeCountDown(questions[0]?.question_time || 30);
  };

  // Function để kiểm tra và join room thủ công
  const checkAndJoinRoom = () => {
    console.log('Manual check and join room...');
    console.log('Socket status:', {
      connected: socket.connected,
      id: socket.id,
      hasUser: !!user,
      hasRoomCode: !!roomCode
    });

    if (user && user.accessToken) {
      authenticateSocket(user.accessToken, user.refreshToken);

      if (socket.connected && roomCode) {
        console.log('Manually joining room:', roomCode);
        socket.emit('joinRoom', { roomCode, user });
      } else {
        console.log('Socket not ready for manual join');
      }
    }
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
  if (loading || !questions.length) {
    return (
      <View className="flex-1 justify-center items-center bg-[#1C2833]">
        <Text className="text-white text-lg">Đang tải câu hỏi...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 relative">
      <Overlay visible={showRankBoard} onPress={() => {}} />
      <RankBoard
        users={rankData}
        visible={showRankBoard}
        currentUser={user}
        createdUser={createdUserId}
        onClose={() => setShowRankBoard(false)}
      />

      {/* Debug info */}
      {__DEV__ && (
        <View className="absolute top-20 left-4 right-4 bg-black bg-opacity-50 p-2 rounded">
          <Text className="text-white text-xs">
            RankData length: {rankData?.length || 0}
          </Text>
          <Text className="text-white text-xs">
            RoomCode: {roomCode}
          </Text>
          <Text className="text-white text-xs">
            Socket: {socket.connected ? 'Connected' : 'Disconnected'}
          </Text>
          <TouchableOpacity
            onPress={checkAndJoinRoom}
            className="bg-blue-500 p-1 rounded mt-1"
          >
            <Text className="text-white text-xs text-center">Rejoin Room</Text>
          </TouchableOpacity>
        </View>
      )}

      <ConfirmDialog
        disableCancel={true}
        title={'Thông báo'}
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
            socket.emit('leaveRoom', { roomCode: roomCode, user: user });
            setIsCompleted(true);
          }
        }}
        message={alertMessage}
      />

      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-10 pb-3 bg-black">
        <Button
          text={i18n.t('play.single.buttonQuit')}
          onPress={() => {
            Alert.alert(
              'Thông báo',
              'Bạn có chắc chắn muốn thoát phòng? Kết quả sẽ lưu lại dựa trên số câu hỏi đã hoàn thành',
              [
                {
                  text: 'Hủy',
                  onPress: () => {},
                },
                {
                  text: 'Thoát',
                  onPress: async () => {
                    const exitRoom = await api.post(`${API_VERSION.V1}${END_POINTS.ROOM_REMOVE_USER}`, {
                      room_code: roomCode,
                      user_id: user.user_id,
                    });

                    const data = exitRoom.data;
                    if (data.statusCode === 200) {
                      completed();
                      setIsCompleted(true);
                      socket.emit('leaveRoom', { roomCode: roomCode, user: user });
                    } else {
                      Alert.alert('Thông báo', 'Không thể thoát khỏi phòng chơi');
                    }
                  },
                },
              ],
            );
          }}
          loading={false}
          type="fill"
          otherStyles={'bg-[#F41D1D]'}
          textStyles={'font-medium text-sm text-white'}
        />

        {/* Progress bar */}
        <View className="flex-1 mx-4">
          <View className="bg-[#484E54] rounded-full h-2 overflow-hidden">
            <View
              className="bg-[#0D70D2] h-2 rounded-full"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </View>
        </View>

        {/* Score and Timer */}
        <View className="flex-row items-center gap-2">
          <Text className="bg-[#484E54] rounded-lg text-white px-2 py-1 text-xs">
            {score}
          </Text>
          <Text className="bg-[#484E54] rounded-lg text-white px-2 py-1 text-xs">
            {questionTimeCountDown}s
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 bg-[#1C2833] px-5 py-4">
        {!isNext ? (
          <View key={currentQuestionIndex}>
            <Animated.Text
              className="text-white text-lg font-bold mb-4"
              style={{
                opacity: questionAnim,
                transform: [
                  {
                    translateX: questionAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-40, 0],
                    }),
                  },
                ],
              }}
            >
              {currentQuestion.type === 'fill' ? 'Điền vào chỗ trống' : currentQuestion.question}
            </Animated.Text>

            <Animated.View
              style={{
                opacity: optionsAnim,
                transform: [
                  {
                    scale: optionsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
              }}
            >
              {renderOptions()}
            </Animated.View>
          </View>
        ) : (
          <Animated.View
            className="items-center justify-center py-8"
            style={{
              opacity: modalAnim,
              transform: [
                {
                  translateY: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }),
                },
                { scale: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
              ],
            }}
          >
            <Image
              source={isCorrect ? ThoBayMauGif : InCorrectGif}
              resizeMode="contain"
              style={{ width: 150, height: 150, borderRadius: 8, marginBottom: 10 }}
            />
            <View className="bg-white rounded-lg p-4 min-w-[200px]">
              <Text className="text-center text-lg font-bold">
                {isCorrect ? 'Chính xác! 🎉' : 'Sai rồi! 😔'}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Button */}
        {!isNext && (
          <Animated.View
            className="mt-4"
            style={{
              opacity: buttonAnim,
              transform: [
                {
                  translateY: buttonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
                { scale: buttonAnim },
              ],
            }}
          >
            <ScaleTouchable
              onPress={() => handleCheck(arrayAnswer)}
              disabled={!isChosen || arrayAnswer.length === 0}
            >
              <View className={`${buttonColor} py-4 px-6 rounded-lg`}>
                <Text className={`${buttonTextColor} text-center text-lg font-bold`}>
                  {buttonText}
                </Text>
              </View>
            </ScaleTouchable>
          </Animated.View>
        )}
      </View>

      {/* Modal result */}
      {isNext && (
        <Animated.View
          className={`absolute bottom-0 left-0 right-0 p-5 ${
            isCorrect ? 'bg-green-100' : 'bg-red-100'
          }`}
          style={{
            transform: [
              {
                translateY: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }),
              },
            ],
          }}
        >
          <Text
            className={`text-2xl font-bold text-center mb-4 ${
              isCorrect ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isCorrect ? 'Chính xác!' : 'Sai rồi!'}
          </Text>
          <ScaleTouchable onPress={handleNext}>
            <View className={`${isCorrect ? 'bg-green-500' : 'bg-red-500'} py-3 px-6 rounded-lg`}>
              <Text className="text-white text-center text-lg font-bold">
                Tiếp tục
              </Text>
            </View>
          </ScaleTouchable>
        </Animated.View>
      )}
    </View>
  );
};

export default RealtimePlay;

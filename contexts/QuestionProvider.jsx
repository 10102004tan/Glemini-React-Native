import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { router, useRouter } from 'expo-router';
import { useAuthContext } from './AuthContext';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { Alert } from 'react-native';
import api from '@/libs/axios';
import { useAuthStore } from '@/store/useAuthStore';
const QuestionContext = createContext();
const QuestionProvider = ({ children }) => {
  const [isChangeData, setIsChangeData] = useState(false);
  const [question, setQuestion] = useState({
    question_excerpt: '',
    question_description: '',
    question_image: '',
    question_audio: '',
    question_video: '',
    question_point: 1,
    question_time: 30,
    question_explanation: '',
    question_type: 'multiple',
    correct_answer_ids: [],
    question_answer_ids: [
      {
        _id: 1,
        text: 'Ấn vào để chỉnh sửa đáp án',
        image: '',
        correct: false,
      },
      {
        _id: 2,
        text: 'Ấn vào để chỉnh sửa đáp án',
        image: '',
        correct: false,
      },
      {
        _id: 3,
        text: 'Ấn vào để chỉnh sửa đáp án',
        image: '',
        correct: false,
      },
      {
        _id: 4,
        text: 'Ấn vào để chỉnh sửa đáp án',
        image: '',
        correct: false,
      },
    ],
  });
  const [questions, setQuestions] = useState([]);
  const { user } = useAuthStore();
  const router = useRouter();

  // Helper function to compare IDs with flexible type handling
  const isIdMatch = (id1, id2) => {
    console.log(`🔍 isIdMatch debug: "${id1}" (${typeof id1}) vs "${id2}" (${typeof id2})`);

    if (id1 === id2) {
      console.log(`  ✅ Exact match: ${id1} === ${id2}`);
      return true;
    }
    if (id1 == null || id2 == null) {
      console.log(`  ❌ Null check failed: ${id1} || ${id2}`);
      return false;
    }

    // Convert to string and compare
    const str1 = id1.toString();
    const str2 = id2.toString();
    if (str1 === str2) {
      console.log(`  ✅ String match: "${str1}" === "${str2}"`);
      return true;
    }

    // For MongoDB ObjectIDs (24-character hex strings), ONLY use exact string comparison
    if (str1.length === 24 && str2.length === 24) {
      console.log(`  ❌ ObjectID mismatch: ${str1} !== ${str2}`);
      return false;
    }

    // For shorter numeric IDs, try number comparison
    const num1 = parseInt(id1);
    const num2 = parseInt(id2);
    if (!isNaN(num1) && !isNaN(num2) && num1 === num2) {
      console.log(`  ✅ Number match: ${num1} === ${num2}`);
      return true;
    }

    console.log(`  ❌ No match found`);
    return false;
  };

  // Get questions from quiz - UPDATED TO V2
  const fetchQuestions = async (quizId) => {
    console.log('🔍 Frontend - Fetching questions for quiz:', quizId);
    setQuestions([]);
    try {
      // V2 API - RESTful approach
      const url = `${API_VERSION.V2}${END_POINTS.V2.QUIZ_QUESTIONS}/${quizId}/questions`;
      console.log('📡 Frontend - V2 URL:', url);

      const response = await api.post(url, { quiz_id: quizId });
      const data = response.data;

      console.log('📊 Frontend - V2 Response:', JSON.stringify(data, null, 2));
      console.log('📊 Frontend - V2 Response message:', data.message);
      console.log('📊 Frontend - V2 Response metadata:', data.metadata);

      if (
        data.message === 'Get questions successfully' ||
        data.message === 'Get questions by quiz successfully'
      ) {
        // Handle both possible response structures
        const questions = data.metadata?.items || data.metadata || [];
        console.log('✅ Frontend - V2 Success, questions count:', questions.length);
        console.log('✅ Frontend - V2 Questions data:', questions);
        setQuestions(questions);
      } else {
        console.log('⚠️ Frontend - V2 unexpected message:', data.message);
        console.log('⚠️ Frontend - V2 Full response:', data);
        setQuestions([]);
      }
    } catch (error) {
      console.error('❌ Frontend - Error fetching questions with V2:', error);
      console.log('🔄 Frontend - Falling back to V1...');

      // Fallback to V1 if V2 fails
      try {
        const v1Url = API_URL + API_VERSION.V1 + END_POINTS.GET_QUIZ_QUESTIONS;
        console.log('📡 Frontend - V1 URL:', v1Url);

        const res = await api.post(v1Url, {
          quiz_id: quizId,
        });

        const data = await res.data;
        console.log('📊 Frontend - V1 Response:', JSON.stringify(data, null, 2));

        if (data.statusCode === 200) {
          console.log('✅ Frontend - V1 Success, questions count:', data.metadata?.length || 0);
          setQuestions(data.metadata || []);
        } else {
          console.log('⚠️ Frontend - V1 failed with status:', data.statusCode);
          setQuestions([]);
        }
      } catch (v1Error) {
        console.error('❌ Frontend - Error fetching questions with V1:', v1Error);
        Toast.show({
          type: 'error',
          text1: 'Lỗi khi lấy câu hỏi',
          text2: v1Error.message,
          visibilityTime: 1000,
          autoHide: true,
        });
        setQuestions([]);
      }
    }
  };


  // Lấy nội dung câu hỏi từ file template docx
  const getQuestionFromTemplateFile = async (questionData, quizId) => {
    setQuestions([]); // Reset mảng câu hỏi

    const insertDatas = questionData.map((question) => {
      console.log('🔍 Processing template question:', question);

      let processedAnswers = [];
      const questionType = question.questionType || 'single';

      // Xử lý theo từng loại câu hỏi
      switch (questionType) {
        case 'single':
        case 'multiple':
          // Câu hỏi trắc nghiệm - legacy format
          if (typeof question.answers[0] === 'string') {
            processedAnswers = question.answers.map((answer, index) => ({
              _id: index + 1,
              text: answer,
              image: '',
              correct:
                questionType === 'single'
                  ? answer[0] === question.correctAnswer
                  : (question.correctAnswers || []).includes(answer[0]),
            }));
          } else {
            // New format with answer objects
            processedAnswers = question.answers.map((answer, index) => ({
              _id: index + 1,
              text: typeof answer === 'string' ? answer : answer.answer || answer.answerName,
              image: '',
              correct: answer.correct || false,
            }));
          }
          break;

        case 'fill':
          // Câu hỏi điền từ
          processedAnswers = question.answers.map((answer, index) => ({
            _id: answer.position || index + 1,
            text: typeof answer === 'string' ? answer : answer.answer,
            image: '',
            correct: true, // Tất cả đáp án điền từ đều đúng
            position: answer.position || index + 1,
          }));
          break;

        case 'order':
          // Câu hỏi sắp xếp
          processedAnswers = question.answers.map((answer, index) => ({
            _id: index + 1,
            text: typeof answer === 'string' ? answer : answer.answer,
            image: '',
            correct: true, // Tất cả đều đúng, chỉ khác thứ tự
            position: answer.position || index + 1,
          }));
          break;

        case 'match':
          // Câu hỏi nối cặp
          processedAnswers = question.answers.map((answer, index) => ({
            _id: index + 1,
            text: typeof answer === 'string' ? answer : answer.answer,
            image: '',
            correct: true, // Tất cả đều đúng, chỉ khác cặp nối
            matchPair: answer.matchPair || '',
          }));
          break;

        default:
          // Fallback cho format cũ
          processedAnswers = question.answers.map((answer, index) => ({
            _id: index + 1,
            text: answer,
            image: '',
            correct: answer[0] === question.correctAnswer,
          }));
      }

      const q = {
        quiz_id: quizId,
        question_excerpt: question.question,
        question_type: questionType,
        question_explanation: question.explanation || '',
        question_description: '',
        question_image: question.image || '',
        question_audio: '',
        question_video: '',
        question_point: 1,
        question_time: 30,
        question_answer_ids: processedAnswers,
      };

      return q;
    });

    console.log('🤖 Generated questions from template:', JSON.stringify(insertDatas, null, 2));

    const data = await saveQuestions(insertDatas);
    if (data) {
      router.replace({
        pathname: '/(protected)/(quiz)/overview/',
        params: { id: quizId },
      });
    } else {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi lưu câu hỏi từ template. Vui lòng thử lại!');
    }
  };

  // Hàm tạo các câu hỏi được generate từ AI
  const generateQuestionsFromGemini = async (questionData, quizId) => {
    setQuestions([]); // Reset mảng câu hỏi

    const insertDatas = questionData.map((question) => {
      // Xử lý theo từng loại câu hỏi
      let processedAnswers = [];

      switch (question.questionType) {
        case 'single':
        case 'multiple':
          // Câu hỏi trắc nghiệm - giữ nguyên cấu trúc
          processedAnswers = question.answers.map((answer, index) => ({
            _id: index + 1,
            text: answer.answerName,
            image: '',
            correct: answer.isCorrect || false,
          }));
          break;

        case 'fill':
          // Câu hỏi điền từ - chuyển đổi cấu trúc
          processedAnswers = question.answers.map((answer, index) => ({
            _id: answer.position || index + 1,
            text: answer.answerName,
            image: '',
            correct: true, // Tất cả đáp án điền từ đều đúng
            position: answer.position || index + 1,
          }));
          break;

        case 'order':
          // Câu hỏi sắp xếp - sử dụng position
          processedAnswers = question.answers.map((answer, index) => ({
            _id: index + 1,
            text: answer.answerName,
            image: '',
            correct: true, // Tất cả đều đúng, chỉ khác thứ tự
            position: answer.position || index + 1,
          }));
          break;

        case 'match':
          // Câu hỏi nối cặp - sử dụng matchPair
          processedAnswers = question.answers.map((answer, index) => ({
            _id: index + 1,
            text: answer.answerName,
            image: '',
            correct: true, // Tất cả đều đúng, chỉ khác cặp nối
            matchPair: answer.matchPair || '',
          }));
          break;

        default:
          // Fallback cho các loại câu hỏi không xác định
          processedAnswers = question.answers.map((answer, index) => ({
            _id: index + 1,
            text: answer.answerName,
            image: '',
            correct: answer.isCorrect || false,
          }));
      }

      const q = {
        quiz_id: quizId,
        question_excerpt: question.questionName,
        question_type: question.questionType,
        question_explanation: question.questionExplanation || '',
        question_description: '',
        question_image: question.questionImage || '',
        question_audio: '',
        question_video: '',
        question_point: 1,
        question_time: 30,
        question_answer_ids: processedAnswers,
      };

      return q;
    });

    console.log('🤖 Generated questions from AI:', JSON.stringify(insertDatas, null, 2));

    const data = await saveQuestions(insertDatas);

    if (data) {
      router.replace({
        pathname: '/(protected)/(quiz)/overview',
        params: { id: quizId },
      });
    } else {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi lưu câu hỏi từ AI. Vui lòng thử lại!');
    }
  };

  // Reset lại mảng câu hỏi
  const resetQuestion = () => {
    setQuestion({
      question_excerpt: '',
      question_description: '',
      question_image: '',
      question_audio: '',
      question_video: '',
      question_point: 1,
      question_time: 30,
      question_explanation: '',
      question_type: 'multiple',
      correct_answer_ids: [],
      question_answer_ids: [
        {
          _id: 1,
          text: 'Ấn vào để chỉnh sửa đáp án',
          image: '',
          correct: false,
        },
        {
          _id: 2,
          text: 'Ấn vào để chỉnh sửa đáp án',
          image: '',
          correct: false,
        },
        {
          _id: 3,
          text: 'Ấn vào để chỉnh sửa đáp án',
          image: '',
          correct: false,
        },
        {
          _id: 4,
          text: 'Ấn vào để chỉnh sửa đáp án',
          image: '',
          correct: false,
        },
      ],
    });
  };

  // Chọn loại câu hỏi
  const selectQuestionType = (type) => {
    return setQuestion({ ...question, question_type: type });
  };

  // Tạo mẫu câu hỏi dạng box
  const createBoxQuestion = () => {
    const boxQuestion = {
      question_excerpt: '',
      question_description: '',
      question_image: '',
      question_audio: '',
      question_video: '',
      question_point: 1,
      question_time: 30,
      question_explanation: '',
      question_type: 'box',
      correct_answer_ids: [],
      question_answer_ids: [
        {
          _id: 1,
          text: 'Answer1, Answer2, Answer3, Answer4',
          image: '',
          correct: true,
        },
      ],
    };
    setQuestion(boxQuestion);
  };

  // Tạo mẫu câu hỏi dạng blank
  const createBlankQuestion = () => {
    const blankQuestion = {
      question_excerpt: '',
      question_description: '',
      question_image: '',
      question_audio: '',
      question_video: '',
      question_point: 1,
      question_time: 30,
      question_explanation: '',
      question_type: 'blank',
      correct_answer_ids: [],
      question_answer_ids: [
        {
          _id: 1,
          text: 'Đán án của câu hỏi',
          image: '',
          correct: true,
        },
      ],
    };
    setQuestion(blankQuestion);
  };

  // Xóa một đáp án đã tạo
  const deleteAnswer = (id) => {
    if (question.question_answer_ids.length > 1) {
      const newAnswers = question.question_answer_ids.filter(
        (answer) => !isIdMatch(answer._id, id),
      );
      setQuestion({ ...question, question_answer_ids: newAnswers });
    }
  };

  // Xóa một câu hỏi - UPDATED TO V2
  const deleteQuestion = async (quizId, questionId) => {
    try {
      // V2 API - RESTful DELETE
      const response = await api.delete(
        `${API_VERSION.V2}${END_POINTS.V2.QUESTION_DELETE}/${questionId}`,
      );
      const data = response.data;

      if (data.message === 'Delete question successfully') {
        const newQuestions = questions.filter((question) => question._id !== questionId);
        setQuestions(newQuestions);
        setIsChangeData(true);
        router.back();
        return true;
      }
    } catch (error) {
      console.error('Error deleting question with V2:', error);
      // Fallback to V1 if V2 fails
      const body = { question_id: questionId, quiz_id: quizId };
      const response = await api.post(`${API_VERSION.V1}${END_POINTS.QUESTION_DELETE}`, body);
      const data = response.data;
      console.log(data);
      if (data.statusCode === 200) {
        const newQuestions = questions.filter((question) => question._id !== questionId);
        setQuestions(newQuestions);
        setIsChangeData(true);
        router.back();
        return true;
      } else {
        console.log('Error when delete question');
      }
    }
    return false;
  };

  // Đánh dấu đáp án chính xác
  const markCorrectAnswer = (id, isMultiple) => {
    // Nếu không cho phép chọn nhiều đáp án, reset các đáp án về false
    const resetAnswers = isMultiple
      ? question.question_answer_ids
      : question.question_answer_ids.map((answer) => ({
        ...answer,
        correct: false,
      }));

    // Cập nhật câu trả lời có id tương ứng với việc đánh dấu đúng/sai
    const updatedAnswers = resetAnswers.map((answer) =>
      isIdMatch(answer._id, id) ? { ...answer, correct: !answer.correct } : answer,
    );

    // console.log(updatedAnswers);

    // Cập nhật lại state với các câu trả lời mới
    setQuestion({ ...question, question_answer_ids: updatedAnswers });
  };

  // Đặt lại đánh dấu cho tất cả các đáp án đã đánh dấu chính xác
  const resetMarkCorrectAnswer = () => {
    const resetAnswers = question.question_answer_ids.map((answer) => ({
      ...answer,
      correct: false,
    }));
    setQuestion({ ...question, question_answer_ids: resetAnswers });
  };

  const findAnswer = (id) => {
    return question.question_answer_ids.find((answer) => isIdMatch(answer._id, id));
  };

  // Thêm một đáp án mới
  const addAnswer = () => {
    const newAnswers = [
      ...question.question_answer_ids,
      {
        _id: question.question_answer_ids[question.question_answer_ids.length - 1]._id + 1,
        text: 'Ấn vào để chỉnh sửa đáp án',
        image: '',
        correct: false,
      },
    ];
    setQuestion({ ...question, question_answer_ids: newAnswers });
  };

  // Chỉnh sửa nội dung của đáp án
  const editAnswerContent = useCallback((id, content) => {
    console.log('🔥 === EDIT ANSWER CONTENT DEBUG ===');
    console.log('🎯 Target ID:', id, 'Type:', typeof id);
    console.log('📝 New content:', content);
    console.log('📋 Current question structure:');
    console.log('  - Has question_answer_ids:', !!question.question_answer_ids);
    console.log('  - Has options:', !!question.options);
    console.log('  - question_answer_ids length:', question.question_answer_ids?.length || 0);
    console.log('  - options length:', question.options?.length || 0);

    setQuestion((prevQuestion) => {
      console.log('📋 Previous question structure:', {
        hasV1: !!prevQuestion.question_answer_ids,
        hasV2: !!prevQuestion.options,
        v1Length: prevQuestion.question_answer_ids?.length || 0,
        v2Length: prevQuestion.options?.length || 0,
      });

      // Handle V1 format (question_answer_ids)
      if (prevQuestion.question_answer_ids) {
        console.log('📋 Processing V1 format (question_answer_ids):');
        prevQuestion.question_answer_ids.forEach((answer, index) => {
          console.log(
            `  [${index}] ID: ${answer._id} (${typeof answer._id}) - Text: "${answer.text}"`,
          );
        });

        const newAnswers = prevQuestion.question_answer_ids.map((answer, index) => {
          const isMatch = isIdMatch(answer._id, id);
          console.log(`🔍 [${index}] Checking ${answer._id} vs ${id} = ${isMatch}`);

          if (isMatch) {
            console.log(`✅ [${index}] UPDATING: "${answer.text}" → "${content}"`);
            return { ...answer, text: content };
          } else {
            console.log(`⏭️ [${index}] KEEPING: "${answer.text}"`);
            return answer;
          }
        });

        console.log('🆕 New V1 answers after edit:');
        newAnswers.forEach((answer, index) => {
          console.log(`  [${index}] ID: ${answer._id} - Text: "${answer.text}"`);
        });

        return { ...prevQuestion, question_answer_ids: newAnswers };
      }

      // Handle V2 format (options)
      if (prevQuestion.options) {
        console.log('📋 Processing V2 format (options):');
        prevQuestion.options.forEach((option, index) => {
          console.log(
            `  [${index}] ID: ${option.id} (${typeof option.id}) - Text: "${option.text}"`,
          );
        });

        const newOptions = prevQuestion.options.map((option, index) => {
          const isMatch = isIdMatch(option.id, id);
          console.log(`🔍 [${index}] Checking ${option.id} vs ${id} = ${isMatch}`);

          if (isMatch) {
            console.log(`✅ [${index}] UPDATING: "${option.text}" → "${content}"`);
            return { ...option, text: content };
          } else {
            console.log(`⏭️ [${index}] KEEPING: "${option.text}"`);
            return option;
          }
        });

        console.log('🆕 New V2 options after edit:');
        newOptions.forEach((option, index) => {
          console.log(`  [${index}] ID: ${option.id} - Text: "${option.text}"`);
        });

        return { ...prevQuestion, options: newOptions };
      }

      console.log('❌ No answers/options found to update!');
      console.log('🔥 ================================');
      return prevQuestion;
    });
  }, []);

  // Cập nhật thời gian cho câu hỏi
  const updateQuestionTime = (time) => {
    setQuestion({ ...question, question_time: time });
  };

  // Cập nhật điểm cho câu hỏi
  const updateQuestionPoint = (point) => {
    setQuestion({ ...question, question_point: point });
  };

  // Kiểm tra nếu đáp án là đáp án chính xác
  const checkCorrectAnswer = (id) => {
    let correctAnswer = question.question_answer_ids.find(
      (answer) => isIdMatch(answer._id, id) && answer.correct === true,
    );
    return correctAnswer;
    //		return question.question_answer_ids.some((answer) => answer._id === id);
  };

  // Lưu câu hỏi đã tạo lên server
  const saveQuestion = async (quizId) => {
    try {
      if (question.question_excerpt === '') {
        alert('Nội dung câu hỏi không được để trống');
        return;
      }

      // Process question_answer_ids for match questions
      let processedAnswers = question.question_answer_ids;

      if (question.question_type === 'match') {
        console.log('🔗 Processing match question for save (create)');
        console.log('🔗 Original answers:', JSON.stringify(processedAnswers, null, 2));

        // KEEP ALL answers - no filtering, ensure proper structure
        processedAnswers = processedAnswers.map((answer) => {
          const processedAnswer = {
            ...answer,
            attributes: answer.attributes || {},
            correct: true, // Match questions have all options as correct
          };

          if (answer.attributes?.match) {
            console.log(`🔗 Real pair: "${answer.text}" -> "${answer.attributes.match}"`);
          } else {
            console.log(`🔗 Default option: "${answer.text}" (no match)`);
          }

          return processedAnswer;
        });

        console.log(
          '🔗 Processed answers (all options preserved):',
          JSON.stringify(processedAnswers, null, 2),
        );
      }

      // V2 API - Create question with V1 structure (temporary compatibility)
      const questionData = {
        quiz_id: quizId,
        question_excerpt: question.question_excerpt,
        question_description: question.question_description || '',
        question_audio: question.question_audio || '',
        question_image: question.question_image || '',
        question_video: question.question_video || '',
        question_point: question.question_point || 1,
        question_time: question.question_time || 30,
        question_explanation: question.question_explanation || '',
        question_type: question.question_type || 'single',
        question_answer_ids: processedAnswers,
      };

      const createUrl = `${API_VERSION.V2}${END_POINTS.V2.QUESTION_CREATE}`;
      console.log('=== DEBUG CREATE QUESTION ===');
      console.log('API_VERSION.V2:', API_VERSION.V2);
      console.log('END_POINTS.V2.QUESTION_CREATE:', END_POINTS.V2.QUESTION_CREATE);
      console.log('Full URL:', createUrl);
      console.log('Question data:', questionData);
      console.log('=============================');
      const response = await api.post(createUrl, questionData);
      const data = response.data;

      console.log('V2 Create Question Response:', data);
      if (data.message === 'Create question successfully') {
        console.log('Lưu câu hỏi thành công');
        setQuestions([...questions, data.metadata]);
        resetQuestion();
        setIsChangeData(true);
        router.back();
      }
    } catch (error) {
      console.log('Error creating question:', error);
      if (error.response) {
        console.log('Response error:', error.response.data);
      }
    }
  };

  // Lưu một danh sách câu hỏi
  const saveQuestions = async (questions) => {
    try {
      // Gọi API lưu câu hỏi
      const body = { questions };
      const response = await api.post(`${API_VERSION.V1}${END_POINTS.QUESTION_CREATE_MANY}`, body);
      const data = response.data;
      console.log(JSON.stringify(data, null, 2));
      if (data.statusCode === 200) {
        console.log('Lưu câu hỏi thành công');
        setQuestions(data.metadata);
        setIsChangeData(true);
        resetQuestion();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Cập nhật câu hỏi
  const editQuestion = async (quizId, questionId) => {
    console.log('🔥 === EDIT QUESTION DEBUG ===');
    console.log('📋 quizId:', quizId, 'Type:', typeof quizId);
    console.log('📋 questionId:', questionId, 'Type:', typeof questionId);
    console.log('📋 question data:', JSON.stringify(question, null, 2));

    try {
      // Process question_answer_ids for match questions
      let processedAnswers = question.question_answer_ids;

      if (question.question_type === 'match') {
        console.log('🔗 Processing match question for save');
        console.log('🔗 Original answers:', JSON.stringify(processedAnswers, null, 2));

        // KEEP ALL answers - no filtering, ensure proper structure
        processedAnswers = processedAnswers.map((answer) => {
          const processedAnswer = {
            ...answer,
            attributes: answer.attributes || {},
            correct: true, // Match questions have all options as correct
          };

          if (answer.attributes?.match) {
            console.log(`🔗 Real pair: "${answer.text}" -> "${answer.attributes.match}"`);
          } else {
            console.log(`🔗 Default option: "${answer.text}" (no match)`);
          }

          return processedAnswer;
        });

        console.log(
          '🔗 Processed answers (all options preserved):',
          JSON.stringify(processedAnswers, null, 2),
        );
      }

      // V2 API - Update question with V1 structure (temporary compatibility)
      const questionData = {
        quiz_id: quizId,
        question_excerpt: question.question_excerpt,
        question_description: question.question_description || '',
        question_audio: question.question_audio || '',
        question_image: question.question_image || '',
        question_video: question.question_video || '',
        question_point: question.question_point || 1,
        question_time: question.question_time || 30,
        question_explanation: question.question_explanation || '',
        question_type: question.question_type || 'single',
        question_answer_ids: processedAnswers,
      };

      const updateUrl = `${API_VERSION.V2}${END_POINTS.V2.QUESTION_UPDATE}/${questionId}`;
      console.log('=== DEBUG UPDATE QUESTION ===');
      console.log('API_VERSION.V2:', API_VERSION.V2);
      console.log('END_POINTS.V2.QUESTION_UPDATE:', END_POINTS.V2.QUESTION_UPDATE);
      console.log('questionId:', questionId);
      console.log('Full URL:', updateUrl);
      console.log('Question data:', questionData);
      console.log('=============================');
      const response = await api.put(updateUrl, questionData);
      const data = response.data;

      console.log('V2 Update Question Response:', data);
      if (data.message === 'Update question successfully') {
        console.log('Cập nhật câu hỏi thành công');
        // Cập nhật lại câu hỏi vào mảng câu hỏi
        const newQuestions = questions.map((q) => {
          if (q._id === questionId) {
            return data.metadata;
          }
          return q;
        });
        console.log('Updated questions:', JSON.stringify(newQuestions, null, 2));
        setQuestions(newQuestions);
        resetQuestion();
        setIsChangeData(true);
        router.back();
      }
    } catch (error) {
      console.log('Error updating question:', error);
      if (error.response) {
        console.log('Response error:', error.response.data);
      }
    }
  };

  // Lưu kết quả mỗi câu
  const saveQuestionResult = async (
    exerciseId,
    quizId,
    questionId,
    answerId,
    correct,
    score,
    questionType,
  ) => {
    const body = {
      exercise_id: exerciseId,
      user_id: user.user_id,
      quiz_id: quizId,
      question_id: questionId,
      answer: answerId,
      correct,
      score,
      question_type: questionType,
    };
    await api.post(`${API_VERSION.V1}${END_POINTS.RESULT_SAVE_QUESTION}`, body);
  };


  return (
    <QuestionContext.Provider
      value={{
        questions,
        setQuestions,
        question,
        setQuestion,
        resetQuestion,
        deleteAnswer,
        markCorrectAnswer,
        addAnswer,
        findAnswer,
        resetMarkCorrectAnswer,
        editAnswerContent,
        saveQuestion,
        updateQuestionTime,
        updateQuestionPoint,
        editQuestion,
        checkCorrectAnswer,
        getQuestionFromTemplateFile,
        selectQuestionType,
        createBoxQuestion,
        createBlankQuestion,
        generateQuestionsFromGemini,
        deleteQuestion,
        isChangeData,
        setIsChangeData,
        fetchQuestions,
        saveQuestionResult,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestionProvider = () => {
  return useContext(QuestionContext);
};

export default QuestionProvider;

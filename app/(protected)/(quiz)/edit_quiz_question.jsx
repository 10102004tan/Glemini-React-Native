import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Colors } from '../../../constants/Colors';
import { useQuestionProvider } from '../../../contexts/QuestionProvider';
import Overlay from '../../../components/customs/Overlay';
import Wrapper from '../../../components/customs/Wrapper';
import QuestionAnswerItem from '../../../components/customs/QuestionAnswerItem';
import Button from '../../../components/customs/Button';
import QuestionEditBoard from '../../../components/customs/QuestionEditBoard';
import BottomSheet from '../../../components/customs/BottomSheet';
import { Points, Times, Status } from '../../../constants';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { useQuizProvider } from '../../../contexts/QuizProvider';
import { useGlobalSearchParams, useLocalSearchParams, useRouter } from 'expo-router';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import api from '@/libs/axios';
import { useAuthContext } from '@/contexts/AuthContext';
import QuestionEditScreenSkeleton from '../../../components/loadings/QuestionEditScreenSkeleton';
import { useAppProvider } from '@/contexts/AppProvider';
import { useAuthStore } from '@/store/useAuthStore';
import {
  SingleMultipleEditor,
  FillInBlankEditor,
  OrderEditor,
  MatchEditor,
} from '../../../components/customs/QuestionTypeEditors';

const MAX_ANSWER = 8;

// V2 Question Types with better UX
const QUESTION_TYPES = [
  { id: 'single', name: 'Một đáp án', icon: '🔘', description: 'Chọn 1 đáp án đúng' },
  { id: 'multiple', name: 'Nhiều đáp án', icon: '☑️', description: 'Chọn nhiều đáp án đúng' },
  { id: 'fill', name: 'Điền từ', icon: '📝', description: 'Điền từ vào chỗ trống' },
  { id: 'order', name: 'Sắp xếp', icon: '🔢', description: 'Sắp xếp theo thứ tự' },
  { id: 'match', name: 'Nối cặp', icon: '🔗', description: 'Nối các cặp tương ứng' },
];

const EditQuizQuestion = () => {
  const { i18n } = useAppProvider();
  const [pointBotttomSheetVisible, setPointBotttomSheetVisible] = useState(false);
  const [timeBotttomSheetVisible, setTimeBotttomSheetVisible] = useState(false);
  const [questionTypeBottomSheetVisible, setQuestionTypeBottomSheetVisible] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(1);
  const [selectedTime, setSelectedTime] = useState(30);
  const [selectedQuestionType, setSelectedQuestionType] = useState('single');
  const [mutipleChoice, setMutipleChoice] = useState(false);
  const [showQuestionBoard, setShowQuestionBoard] = useState(false);
  const [editorType, setEditorType] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const { actionQuizType } = useQuizProvider();
  const {
    question,
    addAnswer,
    resetMarkCorrectAnswer,
    saveQuestion,
    updateQuestionTime,
    updateQuestionPoint,
    editQuestion,
    setQuestion,
    selectQuestionType,
    deleteQuestion,
  } = useQuestionProvider();

  // Helper function to compare IDs (copied from QuestionProvider)
  const isIdMatch = (id1, id2) => {
    if (id1 === id2) return true;
    if (id1 == null || id2 == null) return false;

    const str1 = id1.toString();
    const str2 = id2.toString();
    if (str1 === str2) return true;

    if (str1.length === 24 && str2.length === 24) return false;

    const num1 = parseInt(id1);
    const num2 = parseInt(id2);
    if (!isNaN(num1) && !isNaN(num2) && num1 === num2) return true;

    return false;
  };

  // Helper function to detect V1 vs V2 format
  const isV1Format = (questionObj) => {
    return questionObj?.question_excerpt !== undefined;
  };

  const [answerEditSelected, setAnswerEditSelected] = useState(0);
  const { width } = useWindowDimensions();
  const globalParams = useGlobalSearchParams();
  const localParams = useLocalSearchParams();
  const router = useRouter();

  // Get params from router - try multiple approaches
  let quizId = globalParams.quizId || localParams.quizId;
  let questionId = globalParams.questionId || localParams.questionId;

  // Handle "null" string case
  if (quizId === 'null' || quizId === null) {
    quizId = null;
  }
  if (questionId === 'null' || questionId === null) {
    questionId = null;
  }

  // Also try to get from URL search params
  if (!quizId || !questionId) {
    const urlParams = new URLSearchParams(window?.location?.search || '');
    if (!quizId) quizId = urlParams.get('quizId');
    if (!questionId) questionId = urlParams.get('questionId');
  }
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  // Debug log for params
  useEffect(() => {
    console.log('🔥 === EDIT QUIZ QUESTION PARAMS DEBUG ===');
    console.log('📋 globalParams:', globalParams);
    console.log('📋 localParams:', localParams);

    // Try to access the params object directly
    if (globalParams.params) {
      console.log('📋 params type:', typeof globalParams.params);
      console.log('📋 params string representation:', String(globalParams.params));

      // If it's actually an object (not a string)
      if (typeof globalParams.params === 'object') {
        console.log('📋 params is object, checking for quizId...');
        console.log('📋 params keys:', Object.keys(globalParams.params));
        console.log('📋 params.quizId:', globalParams.params.quizId);

        if (globalParams.params.quizId) {
          quizId = globalParams.params.quizId;
          console.log('🔧 Found quizId in params object:', quizId);
        }
      }

      // If it's a string, try to parse
      if (typeof globalParams.params === 'string' && globalParams.params !== '[object Object]') {
        try {
          const parsedParams = JSON.parse(globalParams.params);
          console.log('📋 Parsed params object:', parsedParams);
          if (parsedParams.quizId) {
            quizId = parsedParams.quizId;
            console.log('🔧 Found quizId in parsed params:', quizId);
          }
        } catch (e) {
          console.log('❌ Failed to parse params:', e.message);
        }
      }
    }

    console.log('📋 Final quizId:', quizId, 'Type:', typeof quizId);
    console.log('📋 Final questionId:', questionId, 'Type:', typeof questionId);
    console.log('📋 actionQuizType:', actionQuizType);

    // If still no params, log an error
    if (!quizId || !questionId) {
      // console.error('❌ Missing required params!');
      // console.error('❌ quizId:', quizId);
      // console.error('❌ questionId:', questionId);
    }

    console.log('🔥 =========================================');
  }, [quizId, questionId, actionQuizType, globalParams, localParams]);

  // Update multiple choice based on question type
  useEffect(() => {
    if (question) {
      // Handle both V1 (question_type) and V2 (type) formats
      const questionType = question.type || question.question_type || 'single';
      const isMultiple = ['multiple', 'fill', 'order', 'match'].includes(questionType);

      if (mutipleChoice !== isMultiple) {
        setMutipleChoice(isMultiple);
      }
      setSelectedQuestionType(questionType);

      console.log('📋 Question type updated:', {
        questionType,
        isMultiple,
        hasV1Type: !!question.question_type,
        hasV2Type: !!question.type,
      });
    }
  }, [question]);

  // Handle question type change with V2 support
  const handleQuestionTypeChange = (newType) => {
    setSelectedQuestionType(newType);
    selectQuestionType(newType);

    // Reset answers when changing type
    if (newType !== question?.question_type) {
      resetMarkCorrectAnswer();
    }

    // Update multiple choice setting
    const isMultiple = ['multiple', 'fill', 'order', 'match'].includes(newType);
    setMutipleChoice(isMultiple);

    setQuestionTypeBottomSheetVisible(false);
  };

  // V2 API - Get question details
  const getCurrentUpdateQuestion = async () => {
    try {
      console.log('🔍 Fetching question details for ID:', questionId);

      // Try V2 first, fallback to V1 if needed
      let response;
      let questionData;

      try {
        response = await api.get(`${API_VERSION.V2}/questions/${questionId}`);
        console.log('✅ V2 API Response:', response.data);

        if (response.data.message === 'Get question successfully') {
          questionData = response.data.metadata;
          console.log('📝 V2 Question Data:', questionData);
        }
      } catch (v2Error) {
        console.log('⚠️ V2 API failed, trying V1:', v2Error.message);

        // Fallback to V1 API
        response = await api.post(`${API_VERSION.V1}${END_POINTS.GET_QUESTION_DETAIL}`, {
          question_id: questionId,
        });
        console.log('✅ V1 API Response:', response.data);

        if (response.data.statusCode === 200) {
          const v1Data = response.data.metadata;
          // Convert V1 to V2 format
          questionData = {
            id: v1Data._id,
            question: v1Data.question_excerpt,
            description: v1Data.question_description,
            audio: v1Data.question_audio,
            image: v1Data.question_image,
            video: v1Data.question_video,
            point: v1Data.question_point,
            time: v1Data.question_time,
            explanation: v1Data.question_explanation,
            type: v1Data.question_type,
            options:
              v1Data.question_answer_ids?.map((answer) => {
                const baseOption = {
                  id: answer._id,
                  text: answer.text,
                  image: answer.image || '',
                  correct:
                    v1Data.correct_answer_ids?.some(
                      (correctAnswer) => correctAnswer._id === answer._id,
                    ) || false,
                  attributes: answer.attributes || {},
                };

                // For match questions, extract match pair data
                if (v1Data.question_type === 'match') {
                  if (answer.attributes?.match) {
                    // V1 format with attributes.match - only use matchPair for consistency
                    baseOption.matchPair = answer.attributes.match;
                    // DON'T create items array to avoid conflicts with getQuestionData
                  } else if (answer.items && answer.items.length >= 2) {
                    // V2 format with items array
                    baseOption.items = answer.items;
                    baseOption.matchPair = answer.items[1]?.text || '';
                  }
                }

                // For fill/order questions, extract position
                if (['fill', 'order'].includes(v1Data.question_type)) {
                  baseOption.position = answer.attributes?.position || answer.position;
                }

                return baseOption;
              }) || [],
          };
          console.log('🔄 Converted V1 to V2:', questionData);
        }
      }

      if (questionData) {
        // Always convert to V1 format for QuestionProvider compatibility
        let v1QuestionData;

        if (questionData.question !== undefined) {
          // It's V2 format, convert to V1
          console.log('🔄 Converting V2 to V1 format for QuestionProvider');
          v1QuestionData = {
            _id: questionData.id,
            question_excerpt: questionData.question,
            question_description: questionData.description || '',
            question_audio: questionData.audio || '',
            question_image: questionData.image || '',
            question_video: questionData.video || '',
            question_point: questionData.point || 1,
            question_time: questionData.time || 30,
            question_explanation: questionData.explanation || '',
            question_type: questionData.type || 'single',
            question_answer_ids:
              questionData.options?.map((option) => {
                const answer = {
                  _id: option.id,
                  text: option.text,
                  image: option.image || '',
                  correct: option.correct || false,
                  attributes: option.attributes || {},
                };

                // For match questions, preserve match data
                if (questionData.type === 'match') {
                  if (option.matchPair) {
                    // Has matchPair field
                    answer.attributes.match = option.matchPair;
                  } else if (option.items && option.items.length >= 2) {
                    // Has items array
                    answer.attributes.match = option.items[1]?.text || '';
                  }
                }

                // For fill/order questions, preserve position
                if (['fill', 'order'].includes(questionData.type)) {
                  if (option.position) {
                    answer.attributes.position = option.position;
                  }
                }

                return answer;
              }) || [],
            correct_answer_ids:
              questionData.options
                ?.filter((option) => option.correct)
                .map((option) => ({
                  _id: option.id,
                })) || [],
          };
        } else {
          // It's already V1 format
          v1QuestionData = questionData;
        }

        console.log(
          '📝 Final V1 Question Data for Provider:',
          JSON.stringify(v1QuestionData, null, 2),
        );

        // Special debug for match questions
        if (v1QuestionData.question_type === 'match') {
          console.log('🔗 MATCH QUESTION DEBUG:');
          v1QuestionData.question_answer_ids?.forEach((answer, index) => {
            console.log(`  Answer ${index + 1}:`, {
              id: answer._id,
              text: answer.text,
              attributes: answer.attributes,
              hasMatch: !!answer.attributes?.match,
            });
          });
        }

        setQuestion(v1QuestionData);
        setSelectedQuestionType(v1QuestionData.question_type || 'single');
        setSelectedPoint(v1QuestionData.question_point || 1);
        setSelectedTime(v1QuestionData.question_time || 30);

        // If we don't have quizId from params, try to get it from question data
        if (!quizId && v1QuestionData.quiz_id) {
          console.log('🔧 Setting quizId from question data:', v1QuestionData.quiz_id);
          quizId = v1QuestionData.quiz_id;
        }

        setLoading(false);
      } else {
        console.error('Failed to fetch question data');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (actionQuizType === 'edit' && questionId) {
      getCurrentUpdateQuestion();
    } else {
      setLoading(false);
    }
  }, []);

  // Close edit board
  const closeEditBoard = () => {
    setShowQuestionBoard(false);
    setAnswerEditSelected(0);
    setEditorContent('');
    setEditorType('');
    setPointBotttomSheetVisible(false);
    setTimeBotttomSheetVisible(false);
    setQuestionTypeBottomSheetVisible(false);
  };

  // Render question type selector
  const renderQuestionTypeSelector = () => {
    const currentType = QUESTION_TYPES.find((type) => type.id === selectedQuestionType);

    return (
      <TouchableOpacity
        className="flex flex-row items-center justify-between p-4 rounded-xl bg-gray-700 border-2 border-gray-600"
        onPress={() => setQuestionTypeBottomSheetVisible(true)}
      >
        <View className="flex flex-row items-center">
          <Text className="text-2xl mr-3">{currentType?.icon}</Text>
          <View>
            <Text className="font-semibold text-white text-base">{currentType?.name}</Text>
            <Text className="text-sm text-gray-300">{currentType?.description}</Text>
          </View>
        </View>
        <Entypo name="chevron-down" size={22} color="white" />
      </TouchableOpacity>
    );
  };

  // Question data management functions
  const addQuestionOption = () => {
    if (questionData.options.length < MAX_ANSWER) {
      addAnswer();
    }
  };

  const editQuestionOption = (option, index) => {
    setEditorType(Status.quiz.ANSWER);
    setEditorContent(option.text);
    setAnswerEditSelected(option.id || option._id);
    setShowQuestionBoard(true);
  };

  const deleteQuestionOption = (optionId) => {
    // Remove answer from question state directly
    const updatedAnswers = (question.question_answer_ids || []).filter(
      (answer) => !isIdMatch(answer._id, optionId),
    );
    setQuestion((prev) => ({
      ...prev,
      question_answer_ids: updatedAnswers,
    }));
  };

  // Fill in blank specific functions
  const addBlankAnswer = (text) => {
    const newId = Date.now();
    const currentAnswers = question.question_answer_ids || [];
    const nextPosition = currentAnswers.length + 1;

    const newOption = {
      _id: newId,
      text: text,
      position: nextPosition, // Add position field for fill questions
      correct: true, // Fill in blanks are typically correct
      image: '',
      attributes: {
        position: nextPosition, // Save position in attributes for backend
      },
    };

    console.log('🎯 === ADD BLANK ANSWER DEBUG ===');
    console.log('🎯 New ID:', newId, 'Type:', typeof newId);
    console.log('🎯 New option:', newOption);
    console.log('🎯 Next position:', nextPosition);
    console.log('🎯 ================================');

    // Update question state directly for fill type
    const updatedAnswers = [...currentAnswers, newOption];
    setQuestion((prev) => ({
      ...prev,
      question_answer_ids: updatedAnswers,
    }));
  };

  const editBlankAnswer = (option, index) => {
    setEditorType(Status.quiz.ANSWER);
    setEditorContent(option.text);
    setAnswerEditSelected(option.id || option._id);
    setShowQuestionBoard(true);
  };

  const deleteBlankAnswer = (optionId) => {
    // Remove answer from question state directly
    const updatedAnswers = (question.question_answer_ids || []).filter(
      (answer) => !isIdMatch(answer._id, optionId),
    );
    setQuestion((prev) => ({
      ...prev,
      question_answer_ids: updatedAnswers,
    }));
  };

  // Order specific functions
  const addOrderItem = (text) => {
    const newId = Date.now();
    const currentAnswers = question.question_answer_ids || [];
    const nextPosition = currentAnswers.length + 1;

    const newOption = {
      _id: newId,
      text: text,
      correct: true, // Order items are typically all correct
      image: '',
      position: nextPosition, // Add position field for order questions
      attributes: {
        position: nextPosition, // Save position in attributes for backend
      },
    };

    console.log('🎯 === ADD ORDER ITEM DEBUG ===');
    console.log('🎯 New ID:', newId, 'Type:', typeof newId);
    console.log('🎯 New option:', newOption);
    console.log('🎯 Next position:', nextPosition);
    console.log('🎯 ==============================');

    // Update question state directly for order type
    const updatedAnswers = [...currentAnswers, newOption];
    setQuestion((prev) => ({
      ...prev,
      question_answer_ids: updatedAnswers,
    }));
  };

  const editOrderItem = (option, index) => {
    console.log('🎯 === EDIT ORDER ITEM DEBUG ===');
    console.log('🎯 option:', option);
    console.log('🎯 option.id:', option.id, 'Type:', typeof option.id);
    console.log('🎯 option._id:', option._id, 'Type:', typeof option._id);
    console.log('🎯 Will use ID:', option.id || option._id);
    console.log('🎯 Current question answers:');
    (question.question_answer_ids || []).forEach((answer, idx) => {
      console.log(`  [${idx}] ID: ${answer._id} (${typeof answer._id}) - Text: "${answer.text}"`);
    });
    console.log('🎯 ===============================');

    setEditorType(Status.quiz.ANSWER);
    setEditorContent(option.text);
    setAnswerEditSelected(option.id || option._id);
    setShowQuestionBoard(true);
  };

  const deleteOrderItem = (optionId) => {
    // Remove answer from question state directly
    const updatedAnswers = (question.question_answer_ids || []).filter(
      (answer) => !isIdMatch(answer._id, optionId),
    );
    setQuestion((prev) => ({
      ...prev,
      question_answer_ids: updatedAnswers,
    }));
  };

  const reorderItems = (newOptions) => {
    // Update question state with new order and position
    const updatedAnswers = newOptions.map((option, index) => ({
      ...option,
      _id: option._id || option.id,
      order: index + 1, // Add order field for tracking
      position: index + 1, // Add position field for order questions
      attributes: {
        ...option.attributes,
        position: index + 1, // Save position in attributes for backend
      },
    }));
    setQuestion((prev) => ({
      ...prev,
      question_answer_ids: updatedAnswers,
    }));
  };

  // Match specific functions
  const addMatchPair = ({ left, right }) => {
    const timestamp = Date.now();

    console.log('🎯 ===== ADD MATCH PAIR DEBUG =====');
    console.log('🎯 Input: left =', left, ', right =', right);
    console.log('🎯 Current question state BEFORE adding:');
    console.log('🎯   - question_excerpt:', question.question_excerpt);
    console.log('🎯   - question_type:', question.question_type);
    console.log('🎯   - question_answer_ids length:', question.question_answer_ids?.length || 0);
    console.log('🎯   - correct_answer_ids length:', question.correct_answer_ids?.length || 0);

    // Debug existing data
    console.log('🎯 EXISTING question_answer_ids:');
    (question.question_answer_ids || []).forEach((answer, index) => {
      console.log(`🎯   [${index}] "${answer.text}" (ID: ${answer._id})`);
    });

    console.log('🎯 EXISTING correct_answer_ids:');
    (question.correct_answer_ids || []).forEach((correct, index) => {
      console.log(`🎯   [${index}] ID: ${correct._id}`);
    });

    // Create left answer (will be added to correct_answer_ids)
    const leftOption = {
      _id: timestamp,
      text: left,
      image: '',
      correct: true,
    };

    // Create right answer (will NOT be added to correct_answer_ids)
    const rightOption = {
      _id: timestamp + 1,
      text: right,
      image: '',
      correct: true,
    };

    console.log('🎯 New options being added:', { leftOption, rightOption });

    // IMPORTANT: Preserve existing answers and correct answers
    const currentAnswers = question.question_answer_ids || [];
    const currentCorrectAnswers = question.correct_answer_ids || [];

    // Add BOTH to question_answer_ids
    const updatedAnswers = [...currentAnswers, leftOption, rightOption];

    // Add ONLY LEFT to correct_answer_ids (IMPORTANT: Only left items!)
    const updatedCorrectAnswers = [...currentCorrectAnswers, { _id: leftOption._id }];

    // DEBUG: Verify we're not adding right option
    if (updatedCorrectAnswers.some((correct) => correct._id === rightOption._id)) {
      console.error('🚨 ERROR: Right option accidentally added to correct_answer_ids!');
    }

    console.log('🎯 ===== ADDING LOGIC =====');
    console.log('🎯 Adding to question_answer_ids:', [leftOption._id, rightOption._id]);
    console.log('🎯 Adding to correct_answer_ids:', [leftOption._id]);
    console.log('🎯 NOT adding to correct_answer_ids:', [rightOption._id]);

    console.log('🎯 Updated answers array AFTER adding:');
    updatedAnswers.forEach((answer, index) => {
      console.log(`🎯   [${index}] ID: ${answer._id}, Text: "${answer.text}"`);
    });

    console.log('🎯 Updated correct_answer_ids AFTER adding:');
    updatedCorrectAnswers.forEach((correct, index) => {
      console.log(`🎯   [${index}] ID: ${correct._id}`);
    });

    setQuestion((prev) => {
      const newQuestion = {
        ...prev,
        question_answer_ids: updatedAnswers,
        correct_answer_ids: updatedCorrectAnswers,
      };

      console.log('🎯 Final question state AFTER setQuestion:');
      console.log('🎯   - Total answers:', newQuestion.question_answer_ids?.length || 0);
      console.log('🎯   - Total correct answers:', newQuestion.correct_answer_ids?.length || 0);

      return newQuestion;
    });

    console.log('🎯 ==============================');
  };

  const editMatchPair = (optionId, pairIndex) => {
    // Find the specific pair to edit
    const option = (question.question_answer_ids || []).find((answer) =>
      isIdMatch(answer._id, optionId),
    );

    if (option) {
      // V2 format: has items array
      if (option.items && option.items[pairIndex * 2]) {
        setEditorType(Status.quiz.ANSWER);
        setEditorContent(option.items[pairIndex * 2].text);
        setAnswerEditSelected(optionId);
        setShowQuestionBoard(true);
      }
      // V1 format: has text field
      else if (option.text) {
        setEditorType(Status.quiz.ANSWER);
        setEditorContent(option.text);
        setAnswerEditSelected(optionId);
        setShowQuestionBoard(true);
      }
    }
  };

  const deleteMatchPair = (leftOptionId, rightOptionId, pairIndex) => {
    console.log('🎯 === DELETE MATCH PAIR DEBUG (backend structure) ===');
    console.log('🎯 Deleting pair:', { leftOptionId, rightOptionId, pairIndex });

    // Delete both left and right answers from question_answer_ids
    let updatedAnswers = (question.question_answer_ids || []).filter((answer) => {
      const answerId = answer._id;
      return answerId !== leftOptionId && answerId !== rightOptionId;
    });

    // Remove left answer from correct_answer_ids
    let updatedCorrectAnswers = (question.correct_answer_ids || []).filter((correct) => {
      const correctId = correct._id;
      return correctId !== leftOptionId;
    });

    // For legacy method: if no rightOptionId, just delete the single option
    if (!rightOptionId && leftOptionId) {
      updatedAnswers = (question.question_answer_ids || []).filter(
        (answer) => answer._id !== leftOptionId,
      );
    }

    console.log('🎯 Updated answers after deletion:', updatedAnswers.length);
    console.log('🎯 Updated correct answers after deletion:', updatedCorrectAnswers.length);

    setQuestion((prev) => ({
      ...prev,
      question_answer_ids: updatedAnswers,
      correct_answer_ids: updatedCorrectAnswers,
    }));
  };

  // Render answers based on question type
  const renderAnswerSection = () => {
    const questionData = getQuestionData();

    switch (selectedQuestionType) {
      case 'single':
      case 'multiple':
        return (
          <SingleMultipleEditor
            options={questionData.options}
            questionType={selectedQuestionType}
            onAddOption={addQuestionOption}
            onEditOption={editQuestionOption}
            onDeleteOption={deleteQuestionOption}
            maxOptions={MAX_ANSWER}
          />
        );

      case 'fill':
        return (
          <FillInBlankEditor
            options={questionData.options}
            question={questionData.question}
            onAddBlank={addBlankAnswer}
            onEditBlank={editBlankAnswer}
            onDeleteBlank={deleteBlankAnswer}
          />
        );

      case 'order':
        return (
          <OrderEditor
            options={questionData.options}
            onAddItem={addOrderItem}
            onEditItem={editOrderItem}
            onDeleteItem={deleteOrderItem}
            onReorderItems={reorderItems}
          />
        );

      case 'match':
        // For V1 format, use correct_answer_ids
        // For V2 format, fallback to empty array (will use fallback logic)
        const correctAnswersForEdit = isV1Format(question)
          ? question.correct_answer_ids || []
          : question.correctAnswers || [];

        console.log('🔧 Edit page correctAnswers:', {
          isV1: isV1Format(question),
          correctAnswersLength: correctAnswersForEdit.length,
          questionKeys: Object.keys(question),
        });

        return (
          <MatchEditor
            options={questionData.options}
            correctAnswers={correctAnswersForEdit}
            onAddPair={addMatchPair}
            onEditPair={editMatchPair}
            onDeletePair={deleteMatchPair}
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <QuestionEditScreenSkeleton />;
  }

  // Handle both V1 and V2 data structures safely
  const getQuestionData = () => {
    console.log('🔄 === GET QUESTION DATA DEBUG ===');

    if (!question) {
      console.log('🔄 No question data available');
      return { question: '', options: [], explanation: '', id: null };
    }

    console.log('🔄 Question type check:');
    console.log('🔄   - Has question_excerpt?', !!question.question_excerpt, '(V1 format)');
    console.log('🔄   - Has question?', !!question.question, '(V2 format)');
    console.log('🔄   - question_type:', question.question_type);

    // If it's V1 format, convert to V2
    if (question.question_excerpt !== undefined) {
      console.log('🔄 Converting V1 to V2 format...');
      console.log(
        '🔄 Raw question_answer_ids:',
        question.question_answer_ids?.length || 0,
        'items',
      );

      const convertedOptions =
        question.question_answer_ids?.map((answer, index) => {
          console.log(`🔄 Processing answer [${index}]:`, {
            id: answer._id,
            text: answer.text,
            hasAttributes: !!answer.attributes,
            hasMatch: !!answer.attributes?.match,
            hasItems: !!answer.items,
            match: answer.attributes?.match,
            items: answer.items,
          });

          const baseOption = {
            id: answer._id,
            _id: answer._id, // Keep both for compatibility - SAME VALUE
            text: answer.text,
            position: answer.position,
            order: answer.order,
            correct:
              question.correct_answer_ids?.some((correctAnswer) =>
                isIdMatch(correctAnswer._id, answer._id),
              ) || false,
          };

          // For match questions, include match pair data
          if (question.question_type === 'match') {
            if (answer.attributes?.match) {
              // V1 format with attributes.match - only use matchPair
              baseOption.matchPair = answer.attributes.match;
              console.log(
                `🔄   [${index}] V1 format: "${answer.text}" -> "${answer.attributes.match}"`,
              );
              // DON'T create items array - let MatchEditor handle display logic
            } else if (answer.items && answer.items.length >= 2) {
              // V2 format with items array - keep as is
              baseOption.items = answer.items;
              baseOption.matchPair = answer.items[1]?.text || '';
              console.log(`🔄   [${index}] V2 format: ${answer.items.length} items`);
            } else {
              console.log(`🔄   [${index}] No match data found - default option`);
            }
          }

          // For fill/order questions, include position
          if (['fill', 'order'].includes(question.question_type)) {
            baseOption.position = answer.attributes?.position || answer.position;
          }

          console.log(`🔄   [${index}] Final converted option:`, {
            id: baseOption.id,
            text: baseOption.text,
            matchPair: baseOption.matchPair,
            hasItems: !!baseOption.items,
            itemsLength: baseOption.items?.length || 0,
          });

          return baseOption;
        }) || [];

      const result = {
        question: question.question_excerpt || '',
        explanation: question.question_explanation || '',
        options: convertedOptions,
        id: question._id,
      };

      console.log('🔄 Final V1->V2 conversion result:');
      console.log('🔄   - Total options:', result.options.length);
      console.log('🔄   - Match pairs found:');
      result.options.forEach((option, index) => {
        if (option.matchPair) {
          console.log(`🔄     [${index}] "${option.text}" -> "${option.matchPair}"`);
        } else if (option.items?.length >= 2) {
          console.log(`🔄     [${index}] V2 items: ${option.items.length} items`);
        } else {
          console.log(`🔄     [${index}] "${option.text}" (no match data)`);
        }
      });

      console.log('🔄 ================================');
      return result;
    }

    // If it's V2 format, use directly
    console.log('🔄 Using V2 format directly');
    const result = {
      question: question.question || '',
      explanation: question.explanation || '',
      options: question.options || [],
      id: question.id,
    };

    console.log('🔄 ================================');
    return result;
  };

  const questionData = getQuestionData();

  return (
    <Wrapper>
      {/* Overlay */}
      <Overlay
        onPress={closeEditBoard}
        visible={
          showQuestionBoard ||
          pointBotttomSheetVisible ||
          timeBotttomSheetVisible ||
          questionTypeBottomSheetVisible
        }
      />

      {/* Question Type Bottom Sheet */}
      <BottomSheet
        visible={questionTypeBottomSheetVisible}
        onClose={() => setQuestionTypeBottomSheetVisible(false)}
      >
        <View className="flex flex-col items-start justify-start">
          <Text className="font-semibold text-gray mb-4">Chọn loại câu hỏi</Text>
          <ScrollView className="w-full max-h-80">
            {QUESTION_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                className={`flex flex-row items-center justify-start p-4 mb-2 rounded-xl ${
                  selectedQuestionType === type.id ? 'bg-blue-100 border-blue-300' : 'bg-overlay'
                } border-2`}
                onPress={() => handleQuestionTypeChange(type.id)}
              >
                <Text className="text-2xl mr-3">{type.icon}</Text>
                <View className="flex-1">
                  <Text
                    className={`font-semibold ${selectedQuestionType === type.id ? 'text-blue-700' : 'text-gray'}`}
                  >
                    {type.name}
                  </Text>
                  <Text
                    className={`text-sm ${selectedQuestionType === type.id ? 'text-blue-600' : 'text-gray-500'}`}
                  >
                    {type.description}
                  </Text>
                </View>
                {selectedQuestionType === type.id && (
                  <AntDesign name="checkcircle" size={20} color="#2563eb" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </BottomSheet>

      {/* Point Bottom Sheet */}
      <BottomSheet
        visible={pointBotttomSheetVisible}
        onClose={() => setPointBotttomSheetVisible(false)}
      >
        <View className="flex flex-col items-start justify-start">
          <Text className="font-semibold text-gray">{i18n.t('edit_quiz_screen.choosePoint')}</Text>
          <View className="flex items-center justify-start flex-row mt-4">
            <ScrollView>
              {Points.questionPoints.map((point, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex flex-row items-center justify-start p-3 mb-2 rounded-xl bg-overlay"
                  onPress={() => {
                    setSelectedPoint(point);
                    updateQuestionPoint(point);
                    setPointBotttomSheetVisible(false);
                  }}
                >
                  <Text className="ml-2">
                    {point} {i18n.t('edit_quiz_screen.point')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </BottomSheet>

      {/* Time Bottom Sheet */}
      <BottomSheet
        visible={timeBotttomSheetVisible}
        onClose={() => setTimeBotttomSheetVisible(false)}
      >
        <View className="flex flex-col items-start justify-start">
          <Text className="font-semibold text-gray">{i18n.t('edit_quiz_screen.chooseTime')}</Text>
          <View className="flex items-center justify-start flex-row mt-4">
            <ScrollView>
              {Times.questionTimes.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex flex-row items-center justify-start p-3 mb-2 rounded-xl bg-overlay"
                  onPress={() => {
                    setSelectedTime(time);
                    updateQuestionTime(time);
                    setTimeBotttomSheetVisible(false);
                  }}
                >
                  <Text className="ml-2">
                    {time} {i18n.t('edit_quiz_screen.second')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </BottomSheet>

      {/* Question Edit Board */}
      <QuestionEditBoard
        handleClose={closeEditBoard}
        closeEditBoard={closeEditBoard}
        mutipleChoice={mutipleChoice}
        answerEditSelected={answerEditSelected}
        visible={showQuestionBoard}
        type={editorType}
        content={editorContent}
        questionType={selectedQuestionType}
      />

      {/* Header Section */}
      <View className="bg-gray-800 border-b border-gray-700">
        {/* Question Type & Settings */}
        <View className="flex flex-row items-center justify-between p-4">
          {/* Question Type Selector */}
          <View className="flex-1 mr-3">{renderQuestionTypeSelector()}</View>

          {/* Settings */}
          <View className="flex flex-row items-center space-x-3">
            <TouchableOpacity
              className="px-4 py-2.5 rounded-xl bg-blue-600 border border-blue-500 flex items-center justify-center shadow-sm"
              onPress={() => setPointBotttomSheetVisible(true)}
            >
              <Text className="text-white text-sm font-medium">⭐ {selectedPoint}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-4 py-2.5 rounded-xl bg-green-600 border border-green-500 flex items-center justify-center shadow-sm"
              onPress={() => setTimeBotttomSheetVisible(true)}
            >
              <Text className="text-white text-sm font-medium">⏱️ {selectedTime}s</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 bg-primary">
        <ScrollView className="px-4 py-6" showsVerticalScrollIndicator={false}>
          {/* Question Section */}
          <View className="mb-6">
            <Text className="text-white font-bold text-lg mb-3">📝 Nội dung câu hỏi</Text>
            <TouchableOpacity
              className="bg-gray-800 border-2 border-gray-600 rounded-2xl min-h-[120px] p-4 flex items-center justify-center"
              onPress={() => {
                setEditorType(Status.quiz.QUESTION);
                setEditorContent(questionData.question);
                setShowQuestionBoard(true);
              }}
            >
              <RenderHTML
                defaultViewProps={{}}
                defaultWebViewProps={{}}
                defaultTextProps={{
                  style: { color: 'white', textAlign: 'center' },
                }}
                contentWidth={width - 64}
                source={{
                  html:
                    questionData.question === ''
                      ? `<div style="color: #9CA3AF; font-style: italic;">Nhấn để thêm câu hỏi...</div>`
                      : questionData.question,
                }}
              />
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View className="flex flex-row items-center justify-between mb-6">
            {(selectedQuestionType === 'single' || selectedQuestionType === 'multiple') && (
              <TouchableOpacity
                onPress={() => {
                  handleQuestionTypeChange(
                    selectedQuestionType === 'single' ? 'multiple' : 'single',
                  );
                }}
                className={`flex items-center justify-center flex-row py-3 px-5 rounded-xl border-2 ${
                  mutipleChoice ? 'bg-green-600 border-green-500' : 'bg-gray-700 border-gray-600'
                }`}
              >
                <Text className="text-white font-medium">
                  {mutipleChoice ? '☑️ Nhiều đáp án' : '🔘 Một đáp án'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="flex items-center justify-center flex-row bg-purple-600 border-2 border-purple-500 py-3 px-5 rounded-xl"
              onPress={() => {
                setShowQuestionBoard(true);
                setEditorContent(questionData.explanation);
                setEditorType(Status.quiz.EXPLAINATION);
              }}
            >
              <Text className="text-white font-medium">💡 Thêm giải thích</Text>
            </TouchableOpacity>
          </View>

          {/* Question Type Specific Editor */}
          {renderAnswerSection()}

          {/* Delete Question Button */}
          {actionQuizType === 'edit' && (
            <View className="flex items-center justify-center mt-8 mb-6">
              <TouchableOpacity
                className="flex items-center justify-center flex-row bg-red-500 py-3 px-6 rounded-xl border-2 border-red-400 shadow-sm"
                onPress={() => {
                  deleteQuestion(quizId, questionData.id);
                }}
              >
                <AntDesign name="delete" size={18} color="white" />
                <Text className="text-white ml-2 font-semibold">Xóa câu hỏi</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Save Button - Fixed at bottom */}
      <View className="bg-gray-800 border-t border-gray-700 p-4">
        <TouchableOpacity
          className={`py-4 px-6 rounded-xl border-2 flex items-center justify-center ${
            actionQuizType === 'create'
              ? 'bg-blue-600 border-blue-500'
              : 'bg-green-600 border-green-500'
          }`}
          onPress={() => {
            console.log('🎯 Using quizId:', quizId);

            if (actionQuizType === 'create') {
              saveQuestion(quizId);
            } else if (actionQuizType === 'edit') {
              editQuestion(quizId, questionData.id);
            }
          }}
        >
          <Text className="text-white font-bold text-lg">
            {actionQuizType === 'create' ? '✨ Tạo câu hỏi' : '💾 Lưu câu hỏi'}
          </Text>
        </TouchableOpacity>
      </View>
    </Wrapper>
  );
};

export default EditQuizQuestion;

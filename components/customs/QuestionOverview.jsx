import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useQuizProvider } from '@/contexts/QuizProvider';
import { useRouter } from 'expo-router';
import { useAppProvider } from '@/contexts/AppProvider';
import QuestionTypeDisplay from './QuestionTypeDisplay';
import { createDisplayPairs } from '@/utils/matchQuestionUtils';
const QuestionOverview = ({ quizId = null, question = {}, index = 0, editable = true }) => {
  const { isEdited } = useQuizProvider();
  const [showExpain, setShowExpain] = useState(false);
  const { width } = useWindowDimensions();
  const { setActionQuizType } = useQuizProvider();
  const router = useRouter();
  const { i18n } = useAppProvider();

  // Debug log để kiểm tra dữ liệu
//   console.log(`🎯 QuestionOverview ${index + 1}:`, JSON.stringify(question, null, 2));

  // Check if it's V1 or V2 structure
  const isV1 = question.question_excerpt !== undefined;
  const isV2 = question.question !== undefined;

//   console.log(`📋 Question structure:`, {
//     isV1,
//     isV2,
//     hasV1Fields: !!question.question_excerpt && !!question.question_answer_ids,
//     hasV2Fields: !!question.question && !!question.options,
//   });

  const renderAnswerIcon = (correct) => (
    <View className="mr-2">
      <AntDesign
        name={correct ? 'checkcircle' : 'closecircle'}
        size={18}
        color={correct ? '#4cd137' : '#F22626'}
      />
    </View>
  );

  // Early return if question data is not available
  if (!question || (!question.id && !question._id)) {
    console.log('⚠️ QuestionOverview: No question data available');
    return (
      <View className="p-2 rounded-2xl border border-gray mb-2 bg-white overflow-hidden">
        <Text className="text-gray">Loading question...</Text>
      </View>
    );
  }

  // Handle both V1 and V2 data structures
  const questionData = isV1
    ? {
        id: question._id,
        question: question.question_excerpt,
        type: question.question_type,
        time: question.question_time,
        point: question.question_point,
        explanation: question.question_explanation,
        options:
          question.question_answer_ids?.map((answer) => ({
            id: answer._id,
            text: answer.text,
            correct:
              question.correct_answer_ids?.some(
                (correctAnswer) => correctAnswer._id === answer._id,
              ) || false,
            // Include match pair info for match questions
            matchPair: answer.attributes?.match || answer.matchPair || '',
            position: answer.attributes?.position || answer.position,
            // For V2 format, also include items
            items: answer.items || [],
          })) || [],
      }
    : question || {};

  // Debug for match questions specifically - AFTER questionData is defined
  if (questionData?.type === 'match') {
    // console.log('🔍 MATCH QUESTION DEBUG:');
    // console.log('🔍 Raw question keys:', Object.keys(question || {}));
    // console.log('🔍 Has correct_answer_ids?', !!question?.correct_answer_ids);
    // console.log('🔍 Has correctAnswers?', !!question?.correctAnswers);
    // console.log('🔍 question.correct_answer_ids:', question?.correct_answer_ids);
    // console.log('🔍 question.correctAnswers:', question?.correctAnswers);
  }

  return (
    <View className="p-2 rounded-2xl border border-gray mb-2 bg-white overflow-hidden">
      <View className="flex w-full items-center justify-between flex-row">
        <View className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Text className="text-white">{index + 1}</Text>
        </View>
        <View className="flex-1 ml-2 flex-row items-center">
          <Text className="text-[16px] mr-2">{i18n.t('overview_quiz_screen.questionType')}:</Text>
          <QuestionTypeDisplay type={questionData.type || 'single'} size={16} />
        </View>
        <Text className="text-gray">
          {questionData.time || 30} {i18n.t('overview_quiz_screen.second')} -{' '}
          {questionData.point || 1} {i18n.t('overview_quiz_screen.point')}
        </Text>
      </View>
      <View className="mt-2 overflow-hidden max-w-[400px]">
        <RenderHTML
          defaultTextProps={{
            style: {
              width: '100%',
              color: 'black',
              fontSize: 16,
              fontWeight: '500',
            },
          }}
          contentWidth={width}
          source={{ html: questionData.question || 'No question text available' }}
        />
      </View>
      <View className="mt-6">
        {(questionData.options || []).length > 0 ? (
          questionData.type === 'match' ? (
            // Special rendering for match questions using utility function
            <View>
              <Text className="font-semibold mb-2 text-blue-600">🔗 Nối cặp:</Text>
              {(() => {
                // For V1 format, get correct answers from correct_answer_ids
                // For V2 format, try to get from question.correctAnswers or fallback to empty
                const correctAnswers = isV1
                  ? question.correct_answer_ids || []
                  : question.correctAnswers || questionData.correctAnswers || [];

                // console.log('🔄 Overview correctAnswers source:', {
                //   isV1,
                //   isV2,
                //   v1CorrectAnswers: question.correct_answer_ids?.length || 0,
                //   v2CorrectAnswers: question.correctAnswers?.length || 0,
                //   finalCorrectAnswers: correctAnswers.length,
                // });

                const pairs = createDisplayPairs(questionData.options, correctAnswers);

                return pairs.map((pair, pairIndex) => (
                  <View
                    key={pair.id}
                    className="flex flex-row items-center justify-between max-w-[340px] mb-2 p-2 bg-blue-50 rounded-lg"
                  >
                    <View className="flex-1">
                      <RenderHTML
                        defaultTextProps={{
                          style: {
                            color: 'black',
                            fontSize: 16,
                            fontWeight: '500',
                          },
                        }}
                        contentWidth={width * 0.4}
                        source={{ html: pair.left || 'No answer text' }}
                      />
                    </View>
                    <Text className="mx-2 text-blue-600 font-bold">→</Text>
                    <View className="flex-1">
                      <RenderHTML
                        defaultTextProps={{
                          style: {
                            color: pair.right === '[Chưa có cặp]' ? 'red' : 'blue',
                            fontSize: 16,
                            fontWeight: '500',
                          },
                        }}
                        contentWidth={width * 0.4}
                        source={{ html: pair.right || 'No match pair' }}
                      />
                    </View>
                  </View>
                ));
              })()}
            </View>
          ) : questionData.type === 'order' ? (
            // Special rendering for order questions
            <View>
              <Text className="font-semibold mb-2 text-orange-600">🔢 Thứ tự đúng:</Text>
              {questionData.options
                .sort((a, b) => (a.position || 0) - (b.position || 0))
                .map((option, index) => (
                  <View
                    key={index}
                    className="flex flex-row items-center justify-start max-w-[340px] mb-1"
                  >
                    <View className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center mr-2">
                      <Text className="text-white text-sm font-bold">
                        {option.position || index + 1}
                      </Text>
                    </View>
                    <RenderHTML
                      defaultTextProps={{
                        style: {
                          color: 'black',
                          fontSize: 16,
                        },
                      }}
                      contentWidth={width}
                      source={{ html: option.text || 'No answer text' }}
                    />
                  </View>
                ))}
            </View>
          ) : questionData.type === 'fill' ? (
            // Special rendering for fill questions
            <View>
              <Text className="font-semibold mb-2 text-purple-600">📝 Điền từ:</Text>
              {questionData.options
                .sort((a, b) => (a.position || 0) - (b.position || 0))
                .map((option, index) => (
                  <View
                    key={index}
                    className="flex flex-row items-center justify-start max-w-[340px] mb-1"
                  >
                    <View className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center mr-2">
                      <Text className="text-white text-sm font-bold">
                        {option.position || index + 1}
                      </Text>
                    </View>
                    <Text className="text-purple-600 font-semibold mr-2">
                      Từ {option.position || index + 1}:
                    </Text>
                    <RenderHTML
                      defaultTextProps={{
                        style: {
                          color: 'black',
                          fontSize: 16,
                          fontWeight: '500',
                        },
                      }}
                      contentWidth={width}
                      source={{ html: option.text || 'No answer text' }}
                    />
                  </View>
                ))}
            </View>
          ) : (
            // Default rendering for single/multiple choice
            questionData.options.map((option, index) => (
              <View key={index} className="flex flex-row items-center justify-start max-w-[340px]">
                {renderAnswerIcon(option.correct)}
                <RenderHTML
                  defaultTextProps={{
                    style: {
                      color: 'black',
                      fontSize: 16,
                    },
                  }}
                  contentWidth={width}
                  source={{ html: option.text || 'No answer text' }}
                />
              </View>
            ))
          )
        ) : (
          <Text className="text-gray">No options available</Text>
        )}
      </View>
      <View>
        {isEdited && editable && (
          <TouchableOpacity
            className="flex items-center justify-end flex-row"
            onPress={() => {
              setActionQuizType('edit');
              // Try using query string format instead of params object
              router.push(
                `(protected)/(quiz)/edit_quiz_question?quizId=${quizId}&questionId=${questionData.id}`,
              );
            }}
          >
            <Text className="text-gray">{i18n.t('overview_quiz_screen.edit')}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="flex items-center justify-end flex-row"
          onPress={() => setShowExpain(!showExpain)}
        >
          <Text className="text-gray">{i18n.t('overview_quiz_screen.viewExplain')}</Text>
        </TouchableOpacity>
      </View>
      {showExpain && (
        <View className="overflow-hidden">
          <Text className="mb-2 font-semibold">{i18n.t('overview_quiz_screen.explanation')}:</Text>
          <RenderHTML
            defaultViewProps={{}}
            defaultTextProps={{
              style: {
                width: '100%',
                color: 'black',
                fontSize: 14,
              },
            }}
            contentWidth={width}
            source={{
              html: questionData.explanation || 'Chưa có giải thích cho câu hỏi này',
            }}
          />
        </View>
      )}
    </View>
  );
};

export default QuestionOverview;

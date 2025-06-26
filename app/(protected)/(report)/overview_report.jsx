import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useResultProvider } from '@/contexts/ResultProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import { useAppProvider } from '@/contexts/AppProvider';

export default function DetailReport() {
  const { i18n } = useAppProvider();
  const { resultId } = useLocalSearchParams();
  const { overViewData, fetchOverViewData } = useResultProvider();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setIsFetching(true);
    fetchOverViewData(resultId).then(() => setIsFetching(false));
  }, [resultId]);

  if (isFetching) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <LottieView
          source={require('@/assets/jsons/splash.json')}
          autoPlay
          loop
          style={{ width: 250, height: 250 }}
        />
      </View>
    );
  }

  const correctCount = overViewData.result_questions?.filter((q) => q.correct)?.length;
  const incorrectCount = overViewData.result_questions?.length - correctCount;

  return (
    <>
      <View
        style={{
          paddingTop: 40,
          paddingBottom: 8,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#991b1b',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={'white'} />
        </TouchableOpacity>
        <View style={{ marginLeft: 32 }}>
          <Text style={{ fontSize: 20, lineHeight: 28, fontStyle: 'bold', color: '#f1f5f9' }}>
            {overViewData.user_id?.user_fullname}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, lineHeight: 20, color: '#f1f5f9' }}>
              {moment(overViewData.updatedAt).format('MMMM Do YYYY | h:mm A')}
            </Text>
          </View>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, padding: 20 }}>
        {overViewData.result_questions && overViewData.result_questions?.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              height: 24,
              borderRadius: 999,
              overflow: 'hidden',
              marginBottom: 8,
            }}
          >
            <View
              style={{
                flex: correctCount / overViewData.result_questions?.length,
                backgroundColor: '#22c55e',
              }}
            />
            <View
              style={{
                flex: incorrectCount / overViewData.result_questions?.length,
                backgroundColor: '#ef4444',
              }}
            />
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              backgroundColor: 'rgb(34 197 94 / 0.2)',
              color: '#22c55e',
              fontStyle: 'bold',
              padding: 4,
            }}
          >{`${correctCount} đúng`}</Text>
          <Text
            style={{
              color: '#ef4444',
              fontStyle: 'bold',
              padding: 4,
              backgroundColor: 'rgb(239 68 68 / 0.2)',
            }}
          >{`${incorrectCount} sai`}</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            marginBottom: 8,
          }}
        >
          <View>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              {`${Math.floor((correctCount / overViewData.result_questions?.length) * 100, 2)}% `}
            </Text>
            <Text style={{ fontWeight: 500 }}>
              {i18n.t('report.reportOverview.questionCorrect')}
            </Text>
          </View>
          <View>
            <Text style={{ textAlign: 'center', fontWeight: 700, marginBottom: 4 }}>
              {`${correctCount}/${overViewData.result_questions?.length}`}
            </Text>
            <Text style={{ fontWeight: 500 }}>{i18n.t('report.reportOverview.point')}</Text>
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          {overViewData.result_questions?.map((question, index) => (
            <View
              key={question._id}
              className={`mb-3 p-2 rounded-lg ${question.correct ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'} border-[1px]`}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: 8 }}>
                  <Text
                    style={{
                      color: '#f1f5f9',
                      fontWeight: 600,
                      backgroundColor: '#334155',
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 8,
                    }}
                  >
                    {`${i18n.t('report.reportOverview.titleQues')} ${index + 1}`}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 8,
                      backgroundColor: question.correct ? '#22c55e' : '#ef4444',
                    }}
                  >
                    <Text
                      style={{
                        color: '#fff',
                        width: 48,
                        fontSize: 14,
                        lineHeight: 20,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      {question.correct
                        ? i18n.t('report.reportOverview.typeCorrect')
                        : i18n.t('report.reportOverview.typeIncorrect')}
                    </Text>
                  </View>
                </View>
                <Text>
                  {question.correct ? question.score : '0'}{' '}
                  {i18n.t('report.reportOverview.infoScore')}
                </Text>
              </View>

              <Text
                style={{
                  fontWeight: 500,
                  paddingBottom: 16,
                  fontSize: 16,
                  lineHeight: 24,
                }}
              >
                {question.question_id.question_excerpt}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 24,
                  marginTop: 8,
                  fontWeight: 600,
                }}
              >{`${overViewData.user_id?.user_fullname}`}</Text>
              <Text
                style={{
                  fontWeight: 500,
                  borderBottomWidth: 1,
                  borderBottomColor: question.correct ? '#22c55e' : '#ef4444',
                  color: question.correct ? '#22c55e' : '#ef4444',
                  paddingBottom: 16,
                }}
              >
                {question.question_id.question_type === 'box'
                  ? question.answer
                  : question.answer?.map((userAns) => userAns.text).join(', ')}
              </Text>
              <Text style={{ marginTop: 8, fontSize: 16, lineHeight: 24 }}>
                {i18n.t('report.reportOverview.infoAnswerCorrect')}
              </Text>
              <Text style={{ fontWeight: 500 }}>
                {question.question_id.correct_answer_ids?.map((userAns) => userAns.text).join(', ')}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

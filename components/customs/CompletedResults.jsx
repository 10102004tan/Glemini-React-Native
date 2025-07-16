import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Dimensions, FlatList, Image, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import SkeletonList from '../loadings/SkeletonListActivity';
import Lottie from '../loadings/Lottie';
import { Images } from '@/constants';
import { useState } from 'react';
import ResultReview from '@/app/(protected)/(result)/review';
import ScaleTouchable from './ScaleTouchable';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


const CompletedResults = ({
  results,
  refreshing,
  onRefresh,
  i18n,
  fetchResetResultOfQuiz,
  screenWidth
}) => {
  const itemWidth = screenWidth / 2 - 20;

  const router = useRouter();
  const [reviewingResult, setReviewingResult] = useState(null);

  if (refreshing || !results) {
    return <SkeletonList count={6} />;
  }

  if (results.length === 0) {
    return (
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View
          style={{
            height: 400,
          }}
        >
          <Lottie
            source={require('@/assets/jsons/empty.json')}
            width={150}
            height={150}
            text={i18n.t('activity.emptyActivity')}
          />
        </View>
      </ScrollView>
    );
  }
  return (
    <>
    <FlatList
      showsVerticalScrollIndicator={false}
      data={results}
      renderItem={({ item }) => (
        <ScaleTouchable
          onPress={() => {
            if (item.type === 'publish' && !item.room_id && !item.exercise_id) {
              Alert.alert(
                i18n.t('activity.titleQuestionReplayQUiz'),
                i18n.t('activity.textQuestionReplayQuiz'),
                [
                  { text: i18n.t('activity.btnCancel'), style: 'cancel' },
                  {
                    text: i18n.t('activity.btnReadResult'),
                    onPress: async () => {
                      setReviewingResult(item);
                    },
                  },
                  {
                    text: i18n.t('activity.btnContinute'),
                    onPress: async () => {
                      await fetchResetResultOfQuiz(item._id);
                      router.push({
                        pathname: '(play)/demo',
                        params: { quizId: item.quiz_id._id, type: 'publish' },
                      });
                    },
                  },
                ],
              );
            } else {
              setReviewingResult(item);     
            }
          }}
        >
          <ResultCompletedItem result={item} i18n={i18n} itemWidth={itemWidth} />
        </ScaleTouchable>
      )}
      keyExtractor={(item) => item._id}
      numColumns={2}
      columnWrapperStyle="flex-row justify-between"
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
    {reviewingResult !== null && (
  <ResultReview
    visible={true}
    result={reviewingResult}
    onClose={() => setReviewingResult(null)}
  />
)}

    </>
  );
};

const ResultCompletedItem = ({ result, i18n, itemWidth }) => {
  const correctCount = result.result_questions.filter((q) => q.correct === true).length;
  const totalQuestions = result.result_questions?.length || 0;
  const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

  const accuracyColor =
    accuracy < 40 ? '#F87171' : accuracy < 70 ? '#FACC15' : '#4ADE80';
  const accuracyTextColor =
    accuracy < 40 ? '#7F1D1D' : accuracy < 70 ? '#92400E' : '#065F46';

  const badgeEmoji = accuracy >= 90 ? '🏆' : accuracy >= 70 ? '🔥' : accuracy >= 40 ? '💪' : '🧠';

  // Thời gian hoàn thành
  const completedTime = result.createdAt ? dayjs(result.createdAt).fromNow() : '';

  return (
    <View
      style={{
        width: itemWidth,
        margin: 6,
        backgroundColor: '#ECFDF5',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 2,
        borderBottomWidth: 5,
        borderColor: '#A7F3D0',
      }}
    >
      {/* Hình ảnh đại diện */}
      <Image
        source={result.quiz_id?.quiz_thumb ? { uri: result.quiz_id.quiz_thumb } : Images.banner1}
        style={{
          width: '100%',
          height: 112,
          resizeMode: 'cover',
        }}
      />
      {/* Chip loại */}
      <View
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          backgroundColor: '#22C55E',
          borderRadius: 9999,
          paddingHorizontal: 8,
          paddingVertical: 4,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <FontAwesome6 name="chalkboard-user" size={12} color="#fff" />
        <Text style={{ color: '#fff', fontSize: 12, marginLeft: 4, fontWeight: '600' }}>
          {result.exercise_id?._id
            ? i18n.t('activity.exercise')
            : result.room_id
            ? i18n.t('activity.room')
            : i18n.t('activity.publish')}
        </Text>
      </View>
      {/* Chip số câu */}
      <View
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          backgroundColor: '#FDE68A',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 9999,
        }}
      >
        <Text style={{ fontSize: 12, color: '#92400E', fontWeight: '600' }}>
          {result.quiz_id?.questionCount} 🎮 
        </Text>
      </View>
      {/* Cảnh báo chưa hoàn thành */}
      {totalQuestions < result.quiz_id?.questionCount && (
        <View style={{ position: 'absolute', top: 40, right: 10 }}>
          <MaterialCommunityIcons name="clock-alert-outline" size={22} color="#DC2626" />
        </View>
      )}
      {/* Nội dung chi tiết */}
      <View style={{ padding: 12 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: '#064E3B',
          }}
        >
          {(result.exercise_id?.name?.length > 15
            ? result.exercise_id?.name.slice(0, 15) + '...'
            : result.exercise_id?.name) || result.room_id?.room_code}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#047857',
            marginTop: 2,
            fontWeight: '600',
          }}
        >
          {result.quiz_id?.quiz_name?.length > 18
            ? result.quiz_id?.quiz_name.slice(0, 18) + '...'
            : result.quiz_id?.quiz_name}
        </Text>
        {/* Thời gian hoàn thành */}
        {completedTime && (
          <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
            {completedTime}
          </Text>
        )}
        <Text style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginTop: 2 }}>
          👤 {result.quiz_id?.user_id?.user_fullname}
        </Text>
        {/* Độ chính xác */}
        <View
          style={{
            marginTop: 12,
            backgroundColor: accuracyColor,
            borderWidth: 1,
            borderColor: accuracyColor,
            borderBottomWidth: 2,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 9999,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.85,
          }}
        >
          <Text
            style={{
              color: accuracyTextColor,
              fontSize: 13,
              fontWeight: '600',
            }}
          >
            {badgeEmoji} {accuracy.toFixed(0)}% chính xác
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CompletedResults;
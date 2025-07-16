import ResultReview from '@/app/(protected)/(result)/review';
import { Images } from '@/constants';
import { useState } from 'react';
import moment from 'moment';
import ScaleTouchable from './ScaleTouchable';
import socket from '@/libs/socket';
const { useResultProvider } = require('@/contexts/ResultProvider');
const { useAuthStore } = require('@/store/useAuthStore');
const { FontAwesome6 } = require('@expo/vector-icons');
const { useRouter } = require('expo-router');
const { View, Image, ScrollView, RefreshControl, FlatList, Pressable, Dimensions, Text, Alert } = require('react-native');
const { default: SkeletonList } = require('../loadings/SkeletonListActivity');
const { default: Lottie } = require('../loadings/Lottie');

const DoingResults = ({
  results,
  refreshing,
  onRefresh,
  i18n,
  screenWidth
}) => {
      const itemWidth = screenWidth / 2 - 20;

  // const { userData } = useAuthContext();
  const { user } = useAuthStore();
  const router = useRouter();
  const { completed } = useResultProvider();
  const [reviewingResult, setReviewingResult] = useState([]);


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
            Alert.alert(
              i18n.t('activity.titleQuestionContinuteQUiz'),
              i18n.t('activity.textQuestionContinuteQuiz'),
              [
                { text: i18n.t('activity.btnCancel'), style: 'cancel' },
                {
                  text: i18n.t('activity.btnContinute'),
                  onPress: async () => {
                    const indexQuestion = item.result_questions?.length || 0;
                    if (item.type === 'publish') {
                      router.push({
                        //(play)/single
                        pathname: '(play)/demo',
                        params: { quizId: item.quiz_id?._id, type: 'publish', indexQuestion },
                      });
                    } else if (item.type === 'exercise') {
                      const now = moment();
                      const deadline = moment(item.exercise_id?.date_end);
                      if (now.isBefore(deadline)) {
                        router.push({
                          //(play)/single
                          pathname: '/(protected)/(play)/demo',
                          params: {
                            quizId: item.quiz_id?._id,
                            exerciseId: item.exercise_id?._id,
                            type: item.type,
                            indexQuestion
                          },
                        });
                      } else {
                        Toast.show({
                          type: 'info',
                          text1: i18n.t('activity.notiDL'),
                          visibilityTime: 2000,
                        });

                        const completedResult = await completed(
                          item.exercise_id?._id,
                          item.quiz_id?._id,
                        );
                        
                        if (completedResult) {
                          setReviewingResult(completedResult);
                        }
                      }
                    } else if (item.type === 'room') {
                      socket.emit('joinRoom', { roomCode: item.room_id.room_code, user });
                      router.push({
                        //(play)/realtime
                        pathname: '/(protected)/(play)/realtime',
                        params: {
                          roomCode: item.room_id.room_code,
                          quizId: item.quiz_id._id,
                          roomId: item.room_id._id,
                          createdUserId: item.room_id.user_created_id,
                        },
                      });
                    }
                  },
                },
              ],
            );
          }}
        >
          <ResultDoingItem result={item} i18n={i18n} itemWidth={itemWidth}/>
        </ScaleTouchable>
      )}
      keyExtractor={(item) => item._id}
      numColumns={2}
      columnWrapperStyle={{ flexDirection: 'row', justifyContent: 'space-between' }}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
    {reviewingResult && reviewingResult.length > 0 &&
        <ResultReview
          visible={true}
          result={reviewingResult}
          onClose={() => setReviewingResult([])}
        />
    }
    </>
  );
};  

const ResultDoingItem = ({ result, i18n, itemWidth }) => {
  return (
    <View
      style={{
        margin: 6,
        backgroundColor: '#F0FDF4', // nền sáng nhẹ
        borderRadius: 25,
        overflow: 'hidden',
        width: itemWidth,
        borderWidth: 2,
        borderBottomWidth:4,
        borderColor: '#A7F3D0',
      }}
    >
      {/* Ảnh đại diện quiz */}
      <Image
        source={result.quiz_id?.quiz_thumb ? { uri: result.quiz_id?.quiz_thumb } : Images.banner1}
        style={{
          width: '100%',
          height: 112,
          resizeMode: 'cover',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      />

      {/* Chip loại quiz */}
      <View
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          backgroundColor: '#4ADE80', // xanh lá tươi
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 9999,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <FontAwesome6 name="chalkboard-user" size={12} color="#fff" />
        <Text style={{ color: '#fff', marginLeft: 6, fontSize: 12, fontWeight: '600' }}>
          {result.exercise_id?._id
            ? i18n.t('activity.exercise')
            : result.room_id
            ? i18n.t('activity.room')
            : i18n.t('activity.publish')}
        </Text>
      </View>

      {/* Số câu hỏi */}
      <View
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          backgroundColor: '#FACC15', // vàng chanh nhạt
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 9999,
        }}
      >
        <Text style={{ color: '#92400E', fontWeight: '600', fontSize: 12 }}>
          {result.quiz_id?.questionCount}🎯 
        </Text>
      </View>

      <View style={{ padding: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#065F46' }}>
          {(result.exercise_id?.name?.length > 20
            ? result.exercise_id?.name.substring(0, 20) + '...'
            : result.exercise_id?.name) || result.room_id?.room_code}
        </Text>

        <Text style={{ fontSize: 14, color: '#047857', marginTop: 4, fontWeight: '600' }}>
          {result.quiz_id?.quiz_name.length > 20
            ? result.quiz_id?.quiz_name.substring(0, 20) + '...'
            : result.quiz_id?.quiz_name}
        </Text>

        <Text style={{ fontSize: 12, color: '#10B981', marginTop: 2 }}>
          {result.type !== 'publish'
            ? `Hạn: ${moment(result.exercise_id?.date_end).format('DD/MM/YYYY')}`
            : 'Không thời hạn'}
        </Text>

        {/* Tiến độ */}
        <View
          style={{
            marginTop: 8,
            backgroundColor: '#A7F3D0',
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 9999,
            alignSelf: 'flex-start',
          }}
        >
          <Text style={{ color: '#065F46', fontSize: 12, fontWeight: '600' }}>
            {result.result_questions?.length}/{result.quiz_id?.questionCount} câu hỏi
          </Text>
        </View>
      </View>
    </View>
  );
};





export default DoingResults;
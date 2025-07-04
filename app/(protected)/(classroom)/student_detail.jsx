import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  RefreshControl,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { Images } from '@/constants';
import Toast from 'react-native-toast-message-custom';
import { useResultProvider } from '@/contexts/ResultProvider';
import Lottie from '@/components/loadings/Lottie';
import { useAppProvider } from '@/contexts/AppProvider';
import SkeletonClassroomCard from '@/components/loadings/SkeletonClassroomCard';
import MainLayout from '@/components/layouts/MainLayout';
import ScaleTouchable from '@/components/customs/ScaleTouchable';

const StudentDetail = () => {
  const { i18n, moment } = useAppProvider();
  const { classroomId } = useLocalSearchParams();
  const { classroom, fetchClassroom } = useClassroomProvider();
  const { fetchResultData } = useResultProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadClassroom = async () => {
        setIsLoading(true);
        try {
          await fetchClassroom(classroomId);
        } catch (error) {
          console.error('Error fetching classroom:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadClassroom();
    }, [classroomId])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClassroom(classroomId);
    setRefreshing(false);
  };

  const startQuiz = async (quizId, exerciseId) => {
    const fetchedResult = await fetchResultData({ quizId, exerciseId, type: 'exercise' });
    if (fetchedResult) {
      router.push({ pathname: '/(home)/activity' });
    } else {
      router.push({
        pathname: '(play)/demo',
        params: { quizId, exerciseId, type: 'exercise' },
      });
    }
  };

  return (
    <MainLayout>
      <Text style={{ fontSize: 22, fontWeight: '600', color: '#34D399', marginBottom: 12 }}>
        {i18n.t('classroom.student.title')}
      </Text>

      {isLoading || refreshing ? (
        [...Array(5)].map((_, index) => <SkeletonClassroomCard key={index} />)
      ) : classroom.exercises && classroom.exercises.length > 0 ? (
        <FlatList
          data={classroom.exercises}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => {
            const now = moment();
            const end = moment(item.date_end);
            const start = moment(item.date_start);
            const isExpired = end.isBefore(now);
            const isNotStartedYet = start.isAfter(now);

            const status = isExpired
              ? { color: '#DC2626', label: '🔒 Hết hạn' }
              : isNotStartedYet
                ? { color: '#F59E0B', label: '⏳ Sắp mở' }
                : {
                  color: '#22C55E',
                  label: '🟢 Đang mở',
                  sub: `${end.fromNow()} (${end.format('HH:mm DD/MM')})`,
                };

            return (
              <ScaleTouchable onPress={() => {
                if (isExpired) {
                  Toast.show({
                    type: 'error',
                    text1: i18n.t('classroom.student.notiDL'),
                    text2: i18n.t('classroom.student.notiChildDL'),
                    position: 'top',
                    visibilityTime: 1000,
                  });
                } else if (isNotStartedYet) {
                  Toast.show({
                    type: 'warn',
                    text1: i18n.t('classroom.student.notiStart'),
                    text2: i18n.t('classroom.student.notiChildStart'),
                    position: 'top',
                    visibilityTime: 1000,
                  });
                } else {
                  startQuiz(item.quiz_id._id, item._id);
                }
              }}>
                <View
                  style={{
                    backgroundColor: isExpired ? '#FEE2E2' : isNotStartedYet ? '#FEF9C3' : '#DCFCE7',
                    borderRadius: 18,
                    padding: 16,
                    marginBottom: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: '#34D399',
                    borderRightWidth: 4,
                    borderBottomWidth: 4,
                    opacity: isExpired || isNotStartedYet ? 0.5 : 1,
                  }}
                >
                  <Image
                    source={
                      item.quiz_id?.quiz_thumb
                        ? { uri: item.quiz_id.quiz_thumb }
                        : Images.banner1
                    }
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 16,
                      borderWidth: 2,
                      borderColor: '#34D399',
                    }}
                  />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>
                      🧠 {item.quiz_id.quiz_name}
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: 600, color: '#374151', marginTop: 2 }}>
                      🎯 {item.name}
                    </Text>
                    <View style={{ marginTop: 6 }}>
                      <Text style={{ fontWeight: 600, color: status.color }}>{status.label}</Text>
                      {status.sub && (
                        <Text style={{ fontSize: 11, color: status.color }}>{status.sub}</Text>
                      )}
                    </View>
                  </View>
                </View>
              </ScaleTouchable>
            );
          }}
        />
      ) : (
        <Lottie
          source={require('@/assets/jsons/empty.json')}
          width={250}
          height={250}
          text={i18n.t('classroom.student.emptyExercise')}
        />
      )}
    </MainLayout>
  );
};

export default StudentDetail;

import { View, Text, Dimensions, Animated, TouchableOpacity, Easing, Alert, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import RankBoardUserItem from '@/components/customs/RankBoardUserItem';
import { useQuestionProvider } from '@/contexts/QuestionProvider';
import QuestionOverview from '@/components/customs/QuestionOverview';
import { API_VERSION, END_POINTS } from '@/configs/api.config';
import api from '@/libs/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { FlatList } from 'react-native-gesture-handler';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import socket from '@/libs/socket';
import { sortRankBoardDesc } from '../../../utils';
import { useAppProvider } from '@/contexts/AppProvider';
import { CommonActions, useNavigation } from '@react-navigation/native';

const TeacherRoomWaitResultScreen = () => {
  const [translateValue] = useState(new Animated.Value(0));
  const screenWidth = Dimensions.get('window').width;
  const [tabResult, setTabResult] = useState('rankboard');
  const [rankBoardTransform] = useState(new Animated.Value(0));
  const [questionBoardTransform] = useState(new Animated.Value(screenWidth));
  const { getQuestionsByQuizId } = useQuestionProvider();

  const { quizId, users, roomCode, roomTime, createdAt } = useGlobalSearchParams();
  const joinedUsers = JSON.parse(users);
  const [questions, setQuestions] = useState([]);
  const { user } = useAuthStore();
  const [rankData, setRankData] = useState([]);
  const [accuracy, setAccuracy] = useState(0);
  const animatedWidthGreen = useRef(new Animated.Value(50)).current;
  const animatedWidthRed = useRef(new Animated.Value(50)).current;
  const router = useRouter();
  const navigation = useNavigation();
  const { i18n } = useAppProvider();

  useEffect(() => {
    Animated.timing(animatedWidthGreen, {
      toValue: accuracy > 0 ? accuracy : 50,
      duration: 500,
      useNativeDriver: false,
    }).start();

    Animated.timing(animatedWidthRed, {
      toValue: accuracy > 0 ? 100 - accuracy : 50,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [accuracy]);

  const greenWidth = animatedWidthGreen.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const redWidth = animatedWidthGreen.interpolate({
    inputRange: [0, 100],
    outputRange: ['100%', '0%'],
  });

  useEffect(() => {
    const fetchQuestion = async () => {
      const response = await api.post(`${API_VERSION.V1}${END_POINTS.GET_QUIZ_QUESTIONS}`, {
        quiz_id: quizId,
      });

      const data = response.data;
      if (data.statusCode === 200) {
        setQuestions(data.metadata);
      }
    };

    if (quizId) {
      fetchQuestion();
    }
  }, [quizId]);

  useEffect(() => {
    socket.on('updateRanking', (rank) => {
      setRankData(sortRankBoardDesc(rank));
    });

    socket.on('updateStats', (rank) => {
      setAccuracy(Math.round((rank.correct_answer / rank.total_answer) * 100) || 0);
    });

    return () => {
      socket.off('updateRanking');
      socket.off('updateStats');
    };
  }, []);

  useEffect(() => {
    Animated.timing(translateValue, {
      toValue: tabResult === 'rankboard' ? 0 : (screenWidth * 90) / 100 / 2,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(rankBoardTransform, {
      toValue: tabResult === 'question' ? -1.0 * screenWidth : 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();

    Animated.timing(questionBoardTransform, {
      toValue: tabResult === 'question' ? 0 : screenWidth,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
  }, [tabResult]);

  const handleDone = () => {
    Alert.alert(i18n.t('room_wait.alert'), i18n.t('room_wait.exitRoomConfirmation'), [
      {
        text: i18n.t('room_wait.cancel'),
        onPress: () => {},
      },
      {
        text: i18n.t('room_wait.leave'),
        onPress: async () => {
          const response = await api.post(`${API_VERSION.V1}${END_POINTS.ROOM_UPDATE_STATUS}`, {
            room_code: roomCode,
            status: 'completed',
          });
          const data = response.data;
          if (data.statusCode === 200) {
            socket.emit('endQuiz', { roomCode: roomCode, user: user });
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: '(homev2)' }],
              })
            );
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kết quả phòng chơi</Text>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Icon name="close-circle" size={24} color="#ef4444" />
          <Text style={styles.doneButtonText}>{i18n.t('room_wait_result.done')}</Text>
        </TouchableOpacity>
      </View>

      {/* Room Code Card */}
      <View style={styles.roomCodeCard}>
        <View style={styles.roomCodeContent}>
          <Text style={styles.roomCodeLabel}>{i18n.t('room_item.roomCode')}</Text>
          <Text style={styles.roomCodeText}>{roomCode}</Text>
        </View>
        <TouchableOpacity style={styles.copyButton}>
          <Feather name="copy" size={20} color="#38bdf8" />
        </TouchableOpacity>
      </View>

      {/* Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressBarWrapper}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressGreen, { width: greenWidth }]} />
            <Animated.View style={[styles.progressRed, { width: redWidth }]} />
          </View>
          <View style={styles.progressCenter}>
            <View style={[styles.progressCircle, accuracy > 50 && styles.progressCircleGreen]}>
              <Text style={styles.progressPercent}>{accuracy}%</Text>
              <Text style={styles.progressLabel}>{i18n.t('room_wait_result.correctPercent')}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setTabResult('rankboard')}
          >
            <Text style={[styles.tabText, tabResult === 'rankboard' && styles.tabTextActive]}>
              <Icon2 name="trophy" size={16} color={tabResult === 'rankboard' ? '#facc15' : '#64748b'} />
              {' '}{i18n.t('room_wait_result.rankboard')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setTabResult('question')}
          >
            <Text style={[styles.tabText, tabResult === 'question' && styles.tabTextActive]}>
              <Icon2 name="format-list-bulleted" size={16} color={tabResult === 'question' ? '#38bdf8' : '#64748b'} />
              {' '}{i18n.t('room_wait_result.question')}
            </Text>
          </TouchableOpacity>
          <Animated.View
            style={[
              styles.tabIndicator,
              { transform: [{ translateX: translateValue }] }
            ]}
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Rank Board */}
        <Animated.View
          style={[
            styles.contentPanel,
            { transform: [{ translateX: rankBoardTransform }] }
          ]}
        >
          <View style={styles.rankHeader}>
            <Icon name="people" size={16} color="#38bdf8" />
            <Text style={styles.rankHeaderText}>
              {joinedUsers.length - 1} {i18n.t('room_wait_result.userJoined')}
            </Text>
          </View>

          <ScrollView style={styles.rankList} showsVerticalScrollIndicator={false}>
            {user && rankData.rank && rankData.rank.length > 0 ? (
              rankData.rank.map((rank, index) => {
                if (user.user_id !== rank.user_id._id) {
                  return (
                    <View key={index} style={styles.rankItem}>
                      <View style={styles.rankPosition}>
                        <Text style={styles.rankNumber}>{index + 1}</Text>
                        {index === 0 && <Icon2 name="trophy" size={16} color="#facc15" />}
                        {index === 1 && <Icon2 name="trophy" size={16} color="#c0c0c0" />}
                        {index === 2 && <Icon2 name="trophy" size={16} color="#cd7f32" />}
                      </View>

                      <View style={styles.userInfo}>
                        <View style={styles.userAvatar}>
                          <Text style={styles.userAvatarText}>
                            {(rank.user_id.user_fullname || 'U').charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.userDetails}>
                          <Text style={styles.userName}>{rank.user_id.user_fullname}</Text>
                          <Text style={styles.userScore}>
                            <Icon name="star" size={12} color="#facc15" /> {rank.userScore} điểm
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }
              })
            ) : (
              <View style={styles.emptyRanking}>
                <Icon2 name="trophy-outline" size={32} color="#64748b" />
                <Text style={styles.emptyText}>Chưa có dữ liệu xếp hạng</Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>

        {/* Question Board */}
        <Animated.View
          style={[
            styles.contentPanel,
            { transform: [{ translateX: questionBoardTransform }] }
          ]}
        >
          <FlatList
            style={styles.questionList}
            data={questions}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) => (
              <QuestionOverview question={item} index={index} quizId={quizId} editable={false} />
            )}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    color: '#38bdf8',
    fontWeight: '800',
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  doneButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  roomCodeCard: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roomCodeContent: {
    flex: 1,
  },
  roomCodeLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
  roomCodeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  copyButton: {
    padding: 8,
  },
  progressCard: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    position: 'relative',
    minHeight: 100,
  },
  progressBarWrapper: {
    position: 'relative',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    height: 16,
    backgroundColor: '#334155',
    borderRadius: 8,
    overflow: 'hidden',
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
  progressGreen: {
    backgroundColor: '#22c55e',
    height: 16,
  },
  progressRed: {
    backgroundColor: '#ef4444',
    height: 16,
  },
  progressCenter: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{ translateX: -40 }, { translateY: -40 }],
    zIndex: 2,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e293b',
    borderWidth: 4,
    borderColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircleGreen: {
    borderColor: '#22c55e',
  },
  progressPercent: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  progressLabel: {
    color: '#94a3b8',
    fontSize: 10,
    textAlign: 'center',
  },
  tabContainer: {
    marginBottom: 20,
  },
  tabBar: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    flexDirection: 'row',
    position: 'relative',
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    width: '50%',
    height: 2,
    backgroundColor: '#38bdf8',
    borderRadius: 1,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  contentPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
  },
  rankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rankHeaderText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  rankList: {
    flex: 1,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  rankPosition: {
    width: 30,
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  userScore: {
    color: '#94a3b8',
    fontSize: 12,
  },
  emptyRanking: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  questionList: {
    flex: 1,
    borderRadius: 16,
  },
});

export default TeacherRoomWaitResultScreen;

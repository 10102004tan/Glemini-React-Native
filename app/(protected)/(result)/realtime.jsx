import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppProvider } from '@/contexts/AppProvider';
import { API_VERSION, END_POINTS } from '../../../configs/api.config';
import api from '@/libs/axios';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import socket from '@/libs/socket';
import { CommonActions, useNavigation } from '@react-navigation/native';

const RealtimeResult = ({
  correctCount,
  wrongCount,
  score,
  totalQuestions,
  handleRestart,
  quizId,
  roomCode,
  rankBoardData,
  createdUserId,
  roomId,
}) => {
  const { i18n } = useAppProvider();
  const { user } = useAuthStore();
  const navigation = useNavigation();
  const router = useRouter();
  const correctPercentage = (correctCount / totalQuestions) * 100;
  const [resultData, setResultData] = useState([]);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    const fetchResultData = async () => {
      try {
        const res = await api.post(API_VERSION.V1 + END_POINTS.RESULT_REVIEW, {
          quiz_id: quizId,
          user_id: user.user_id,
          room_id: roomId,
          type: 'room',
        });

        const data = res.data;
        console.log('📊 API Response:', JSON.stringify(data, null, 2));
        console.log('📊 Metadata:', JSON.stringify(data.metadata, null, 2));
        setResultData(data.metadata);
      } catch (error) {
        console.error('Lỗi khi lấy câu hỏi:', error);
      }
    };
    if (user) {
      fetchResultData();
    }
  }, [user]);

  const playCompletedSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(require('@/assets/sounds/completed.mp3'));
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Lỗi khi phát âm thanh:', error);
    }
  };

  useEffect(() => {
    playCompletedSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const handleQuit = () => {
    Alert.alert('Thông báo', 'Bạn có chắc muốn thoát khỏi phòng?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Thoát',
        onPress: () => {
          socket.emit('leaveRoom', { roomCode, user: user });
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: '(homev2)' }],
            })
          );
        },
      },
    ]);
  };

  const handleReview = () => {
    console.log('🔍 Review Data:', JSON.stringify(resultData, null, 2));
    console.log('🔍 Result Questions:', resultData?.result_questions);

    if (!resultData || !resultData.result_questions) {
      Alert.alert(
        '📊 Không có kết quả',
        !resultData
          ? 'Bạn chưa làm câu nào nên không có kết quả để xem lại.'
          : 'Không có dữ liệu kết quả để xem lại'
      );
      return;
    }

    router.push({
      pathname: '/(result)/review',
      params: {
        result: JSON.stringify(resultData),
      },
    });
  };

  const sortedRankData = rankBoardData?.rank
    ? rankBoardData.rank
        .filter(rank => rank.user_id._id !== createdUserId)
        .sort((a, b) => (b.userScore || 0) - (a.userScore || 0))
    : [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>{i18n.t('result.single.textResult')}</Text>

      {/* Avatar */}
      <View style={styles.profile}>
        <Image source={{ uri: user.user_avatar }} style={styles.avatar} />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.username}>{user.user_fullname}</Text>
          <Text style={styles.desc}>
            <Icon name="person-outline" size={16} color="#38bdf8" />{' '}
            {i18n.t('result.single.textDesc')}
          </Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressCard}>
        <Text style={styles.label}>Tiến trình</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressGreen, { width: `${correctPercentage}%` }]} />
        </View>
        <Text style={styles.percent}>{correctPercentage.toFixed(0)}%</Text>
      </View>

      {/* Score Boxes */}
      <View style={styles.row}>
        <ResultBox
          label={i18n.t('result.single.score')}
          value={score}
          icon={<Icon2 name="star-circle" size={32} color="#facc15" />}
        />
        <ResultBox
          label={i18n.t('result.single.totalQuestions')}
          value={totalQuestions}
          icon={<Icon2 name="format-list-bulleted" size={32} color="#38bdf8" />}
        />
      </View>

      <View style={styles.row}>
        <ResultBox
          label={i18n.t('result.single.correct')}
          value={correctCount}
          icon={<Icon2 name="check-circle" size={32} color="#22c55e" />}
        />
        <ResultBox
          label={i18n.t('result.single.incorrect')}
          value={wrongCount}
          icon={<Icon2 name="close-circle" size={32} color="#ef4444" />}
        />
      </View>

      {/* Ranking Section */}
      <View style={styles.rankingCard}>
        <Text style={styles.rankingTitle}>
          <Icon2 name="trophy" size={20} color="#facc15" /> {i18n.t('room_wait_result.rankboard')}
        </Text>
        <ScrollView style={styles.rankingList} showsVerticalScrollIndicator={false}>
          {sortedRankData.length > 0 ? (
            sortedRankData.map((rank, index) => {
              const isCurrentUser = user.user_id === rank.user_id._id;
              const userName = rank.user_id.user_fullname || 'Unknown User';
              const userAvatar = rank.user_id.user_avatar || 'https://ui-avatars.com/api/?name=User&size=128';
              const userScore = rank.userScore || 0;

              return (
                <View
                  key={index}
                  style={[
                    styles.rankingItem,
                    isCurrentUser && styles.currentUserRank,
                  ]}
                >
                  {/* Rank Position */}
                  <View style={styles.rankPosition}>
                    <Text style={styles.rankNumber}>{index + 1}</Text>
                    {index === 0 && <Icon2 name="trophy" size={16} color="#facc15" />}
                    {index === 1 && <Icon2 name="trophy" size={16} color="#c0c0c0" />}
                    {index === 2 && <Icon2 name="trophy" size={16} color="#cd7f32" />}
                  </View>

                  {/* User Info */}
                  <View style={styles.userInfo}>
                    <Image source={{ uri: userAvatar }} style={styles.userAvatar} />
                    <View style={styles.userDetails}>
                      <Text style={styles.userName}>{userName}</Text>
                      <Text style={styles.userDesc}>
                        <Icon name="star" size={12} color="#facc15" /> {userScore} điểm
                      </Text>
                    </View>
                  </View>

                  {/* Score */}
                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>{userScore}</Text>
                    <Text style={styles.scoreLabel}>điểm</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyRanking}>
              <Icon2 name="trophy-outline" size={32} color="#64748b" />
              <Text style={styles.emptyText}>Chưa có dữ liệu xếp hạng</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <GameButton
          title={i18n.t('result.single.buttonReview')}
          color="#10b981"
          borderColor="#047857"
          onPress={handleReview}
        />
        <GameButton
          title={i18n.t('result.single.buttonQuit')}
          color="#3b82f6"
          borderColor="#1d4ed8"
          onPress={handleQuit}
        />
      </View>

      <View style={styles.replayBtn}>
        <GameButton
          title="Chơi lại"
          color="#9333ea"
          borderColor="#6b21a8"
          onPress={() => handleRestart()}
        />
      </View>
    </View>
  );
};

const ResultBox = ({ label, value, icon }) => (
  <View style={styles.resultBox}>
    <View>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={styles.resultValue}>{value}</Text>
    </View>
    <View>{icon}</View>
  </View>
);

const GameButton = ({ title, color, borderColor, textColor = '#fff', onPress }) => (
  <Pressable
    onPress={onPress}
    style={[
      styles.gameButton,
      { backgroundColor: color, borderColor: borderColor, shadowColor: borderColor },
    ]}>
    <Text style={[styles.gameButtonText, { color: textColor }]}>{title}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    color: '#38bdf8',
    fontWeight: '800',
    marginBottom: 16,
    alignSelf: 'center',
  },
  profile: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#38bdf8',
  },
  username: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  desc: {
    color: '#94a3b8',
    marginTop: 4,
    fontSize: 14,
  },
  progressCard: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  label: {
    color: '#38bdf8',
    fontSize: 16,
    textAlign: 'right',
    marginBottom: 10,
  },
  progressBar: {
    height: 14,
    backgroundColor: '#334155',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressGreen: {
    backgroundColor: '#22c55e',
    height: 14,
  },
  percent: {
    marginTop: 8,
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  resultBox: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultLabel: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
  },
  resultValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  rankingCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    marginBottom: 20,
    maxHeight: 300,
  },
  rankingTitle: {
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: '800',
    padding: 16,
    paddingBottom: 8,
    textAlign: 'center',
  },
  rankingList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#475569',
  },
  currentUserRank: {
    borderColor: '#38bdf8',
    borderWidth: 2,
    backgroundColor: '#1e3a8a',
  },
  rankPosition: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
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
    borderWidth: 2,
    borderColor: '#38bdf8',
    marginRight: 10,
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
  userDesc: {
    color: '#94a3b8',
    fontSize: 11,
  },
  scoreContainer: {
    alignItems: 'center',
    marginLeft: 10,
  },
  scoreText: {
    color: '#facc15',
    fontSize: 16,
    fontWeight: '800',
  },
  scoreLabel: {
    color: '#94a3b8',
    fontSize: 9,
  },
  emptyRanking: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  gameButton: {
    flex: 1,
    paddingVertical: 14,
    marginHorizontal: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderBottomWidth: 6,
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 6,
    elevation: 5,
  },
  gameButtonText: {
    fontSize: 15,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  replayBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default RealtimeResult;

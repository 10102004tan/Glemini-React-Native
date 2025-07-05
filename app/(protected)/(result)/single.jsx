import React, { useEffect, useState } from 'react';
import { View, Text, Image, Alert, Pressable, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppProvider } from '@/contexts/AppProvider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useResultProvider } from '@/contexts/ResultProvider';
import { useAuthStore } from '@/store/useAuthStore';
import MainLayout from '@/components/layouts/MainLayout';
import Loading from '@/components/customs/Loading';
import ResultReview from './review';
import { CommonActions, useNavigation } from '@react-navigation/native';

const ResultSingle = () => {
  const { i18n } = useAppProvider();
  const { user } = useAuthStore();
  const router = useRouter();
  const navigation = useNavigation();
  const { fetchOverViewData, overViewData } = useResultProvider();
  const [isLoading, setIsLoading] = useState(false);
  const { resultID, quizId, exerciseId, type } = useLocalSearchParams();
  const [showReviewModal, setShowReviewModal] = useState(false);



  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (resultID) {
          fetchOverViewData(resultID);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();

    console.log('🚀 Loaded result data for:', { overViewData });

  }, [resultID]);

  const correctCount = overViewData.result_questions?.filter((q) => q.correct)?.length || 0;
  const incorrectCount = overViewData.result_questions?.filter((q) => q.correct === false)?.length || 0;
  const correctPercentage = overViewData.result_questions
    ? (correctCount / overViewData.result_questions.length) * 100
    : 0;

  const handleRestart = (quizId, exerciseId = null, type) => {
    Alert.alert(i18n.t('result.single.titleQuizOut'), i18n.t('result.single.textQuizOut'), [
      { text: i18n.t('result.single.btnCancel'), style: 'cancel' },
      {
        text: i18n.t('result.single.btnContinute'),
        onPress: () => {
          console.log('🚀 Restarting quiz with:', { quizId, exerciseId, type });
          router.replace({
            pathname: '(play)/demo',
            params: { quizId, exerciseId, type },
          });
        }
      },
    ])
  }

  if (isLoading || !overViewData?.result_questions) {
    return (
      <MainLayout>
        <Loading duration={3000} message="Đang tải, chờ xíu bạn nhé..." />
      </MainLayout>
    );
  }


  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>{i18n.t('result.single.textResult')}</Text>

      {/* Avatar */}
      <View style={styles.profile}>
        <Image source={{ uri: user.user_avatar }} style={styles.avatar} />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.username}>{user.fullname}</Text>
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
          value={correctCount}
          icon={<Icon2 name="star-circle" size={32} color="#facc15" />}
        />
        <ResultBox
          label={i18n.t('result.single.totalQuestions')}
          value={overViewData.result_questions?.length}
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
          value={incorrectCount}
          icon={<Icon2 name="close-circle" size={32} color="#ef4444" />}
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <GameButton
          title={i18n.t('result.single.buttonReplay')}
          color="#9333ea"
          borderColor="#6b21a8"
          onPress={() => handleRestart(quizId, exerciseId, type)}
        />
        <GameButton
          title={i18n.t('result.single.buttonPlayNewQuiz')}
          color="#f59e0b"
          borderColor="#b45309"
          textColor="#1e293b"
          onPress={() => router.push({ pathname: '/(protected)/search-recent' })}
        />
      </View>

      <View style={styles.reviewBtn}>
        <GameButton
          title={i18n.t('result.single.buttonReview')}
          color="#10b981"
          borderColor="#047857"
          onPress={() => setShowReviewModal(true)}
        />
      </View>

      <View style={[styles.reviewBtn, { bottom: 90 }]}>
        <GameButton
          title={i18n.t('result.single.buttonQuit')}
          color="#3b82f6"
          borderColor="#1d4ed8"
          onPress={() =>
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: '(homev2)' }],
              })
            )}
        />
      </View>

      <ResultReview
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        result={overViewData}
      />


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
  reviewBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default ResultSingle;

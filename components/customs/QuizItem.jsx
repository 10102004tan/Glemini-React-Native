import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { useAppProvider } from '@/contexts/AppProvider';
import moment from 'moment';
import { SimpleLineIcons } from '@expo/vector-icons';

function QuizItem({ quiz }) {
  const { i18n } = useAppProvider();

  return (
    <View style={styles.container}>
      {/* Thumbnail */}
      <View>
        <Image
          src={
            quiz.quiz_thumb ||
            'https://elearningindustry.com/wp-content/uploads/2021/10/Shareable-Quizzes-In-Online-Training-7-Reasons.jpg'
          }
          className="w-full h-[100px] rounded-[12px]"
          style={styles.image}
        />

        {/* Overlay Tags */}
        <Text style={styles.dateTag}>
          {moment(quiz.createdAt).fromNow()}
        </Text>

        <Text style={styles.qsTag}>
          🎯 {quiz.total_questions} Qs
        </Text>

        <View style={styles.turnTag}>
          <SimpleLineIcons name="game-controller" size={12} color="#000" />
          <Text style={styles.turnText}>{quiz.quiz_turn}</Text>
        </View>
      </View>

      {/* Quiz info */}
      <View style={styles.infoBox}>
        <Text style={styles.quizName}>
          {quiz.quiz_name.length > 20 ? quiz.quiz_name.slice(0, 15) + '...' : quiz.quiz_name}
        </Text>
        <View style={styles.userBox}>
          <Image
            className="w-[24px] h-[24px] rounded-full object-cover"
            src={
              quiz.user?.user_avatar
                ?.replace('h_100', 'h_40')
                ?.replace('w_100', 'w_40')
            }
          />
          <Text style={styles.username}>{quiz.user?.user_fullname}</Text>
        </View>
      </View>
    </View>
  );
}

export default QuizItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F4FF',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderBottomWidth: 4,
    borderColor: '#93c5fd',
  },
  image: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  dateTag: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#93c5fd',
    fontSize: 10,
    fontWeight: '500',
    color: '#111',
  },
  qsTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(96,165,250,0.95)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  turnTag: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#93c5fd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  turnText: {
    marginLeft: 4,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  infoBox: {
    paddingTop: 8,
    paddingHorizontal: 2,
  },
  quizName: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  userBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  username: {
    fontSize: 10,
    fontWeight: '600',
    color: '#93c5fd',
  },
});

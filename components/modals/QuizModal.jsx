import React from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { AntDesign, Ionicons, Entypo } from '@expo/vector-icons';
import ScaleTouchable from '../customs/ScaleTouchable';

const { width } = Dimensions.get('window');

const QuizModal = ({ visible, onClose, onStartQuiz, quiz }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Quiz Image */}
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri:
                  quiz?.quiz_thumb ||
                  'https://elearningindustry.com/wp-content/uploads/2021/10/Shareable-Quizzes-In-Online-Training-7-Reasons.jpg',
              }}
              style={styles.image}
            />

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text>❌</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.quizTitle}>{quiz?.quiz_name}</Text>

            <Text style={styles.authorLabel}>
              👤 Tác giả:{' '}
              <Text style={styles.authorName}>
                {quiz?.user_fullname || quiz?.user?.user_fullname}
              </Text>
            </Text>

            <View style={styles.descriptionBox}>
              <Text style={styles.descTitle}>📝 Mô tả</Text>
              <Text style={styles.descText}>
                {quiz?.quiz_description
                  ? quiz.quiz_description.slice(0, 60) + '...'
                  : 'Không có mô tả cho bộ câu hỏi này.'}
              </Text>
            </View>

            <ScaleTouchable onPress={onStartQuiz}>
              <View style={styles.playButton} >
              <Ionicons name="play" size={18} color="white" />
              <Text style={styles.playButtonText}>Bắt đầu luyện tập</Text>
            </View>
            </ScaleTouchable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default QuizModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.5)', // nền sáng mờ
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#aaa',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderColor: '#93c5fd',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderBottomWidth: 2,
    borderColor: '#c7d2fe',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#93c5fd',
    borderBottomWidth: 4,
    elevation: 3,
    shadowColor: '#00000020',
  },
  content: {
    padding: 16,
  },
  quizTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3B82F6', // xanh dương sáng
    textAlign: 'center',
    marginBottom: 10,
  },
  authorLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
    textAlign: 'center',
  },
  authorName: {
    fontWeight: '700',
    color: '#10B981', // xanh lá sáng
  },
  descriptionBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  descTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
    fontSize: 14,
  },
  descText: {
    color: '#4B5563',
    fontSize: 13,
    lineHeight: 18,
  },
  playButton: {
    flexDirection: 'row',
    backgroundColor: '#F59E0B', // cam sáng
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: '#D97706',
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  playButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
    marginLeft: 8,
    textTransform: 'uppercase',
  },
});



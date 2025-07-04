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

const GameModal = ({ visible, onClose, onStartQuiz, quiz }) => {
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
              <AntDesign name="close" size={20} color="#333" />
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

export default GameModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB', // màu xám nhạt
    borderBottomWidth: 5,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 20,
    elevation: 3,
  },
  content: {
    padding: 16,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  authorLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  authorName: {
    fontWeight: '600',
    color: '#1E40AF',
  },
  descriptionBox: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  descTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#374151',
  },
  descText: {
    color: '#4B5563',
    fontSize: 13,
  },
  playButton: {
    flexDirection: 'row',
    backgroundColor: '#F45', // hồng nhạt hơn
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: '#F63', // viền màu hồng gốc
    elevation: 2,
  },
  playButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});

import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import React from 'react';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import { useAppProvider } from '@/contexts/AppProvider';
import { useAuthStore } from '@/store/useAuthStore';
import ScaleTouchable from './ScaleTouchable';

const ClassroomCard = ({ classroom }) => {
  const { user } = useAuthStore();
  const { i18n } = useAppProvider();
  const { removeClassroom } = useClassroomProvider();

  return (
    <View style={styles.cardContainer}>
      {/* Icon Game-like / badge trái */}
      <View style={styles.leftAccent}>
        <Text style={styles.iconText}>🏫</Text>
      </View>

      {/* Nội dung lớp */}
      <View style={styles.infoWrapper}>
        <Text style={styles.className}>{classroom.class_name}</Text>
        <Text style={styles.textLine}>
          {user.user_role === 'teacher'
            ? `${i18n.t('classroom.textSubject')} ${i18n.t(`subjects.${classroom.subject.name}`)}`
            : `${i18n.t('classroom.textTeacher')} ${classroom.user_id.user_fullname}`}
        </Text>
        <Text style={styles.textLine}>{classroom.school?.school_name || 'No data'}</Text>
        <Text style={styles.studentText}>
          👥 {classroom.students?.length} {i18n.t('classroom.textStudent')}
        </Text>
      </View>

      {/* Nút dots */}
      {user.user_role === 'teacher' && (
        <ScaleTouchable
          onPress={() => {
            Alert.alert(
              i18n.t('classroom.teacher.titleQuestionContinuteQUiz'),
              i18n.t('classroom.teacher.textQuestionContinuteQuiz'),
              [
                { text: i18n.t('classroom.teacher.btnCancel'), style: 'cancel' },
                {
                  text: i18n.t('classroom.teacher.btnContinute'),
                  onPress: () => {
                    removeClassroom(classroom._id);
                  },
                },
              ],
            );
          }}
        >
          <View style={styles.moreButton}>

          <Entypo name="dots-three-horizontal" size={18} color="#4B5563" />
          </View>
        </ScaleTouchable>
      )}
    </View>
  );
};

export default ClassroomCard;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#58CC02',
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    shadowColor: '#000',
    marginVertical: 8,
    alignItems: 'center',
    elevation: 4,
    position: 'relative',
  },
  leftAccent: {
    backgroundColor: '#FCD34D',
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  iconText: {
    fontSize: 20,
  },
  infoWrapper: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  textLine: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  studentText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  moreButton: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderColor: '#D1D5DB',
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

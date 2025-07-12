import {
  View,
  Text,
  FlatList,
  Image,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useAppProvider } from '@/contexts/AppProvider';
import { router, useFocusEffect } from 'expo-router';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import Toast from 'react-native-toast-message-custom';
import LottieView from 'lottie-react-native';
import ScaleTouchable from '@/components/customs/ScaleTouchable';
import Loading from '@/components/customs/Loading';
import MainLayout from '@/components/layouts/MainLayout';

const { width } = Dimensions.get('window');

const avatarPlaceholder = require('@/assets/images/icon.png');

const BackButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.backBtn}>
    <AntDesign name="arrowleft" size={24} color="#388E3C" />
  </TouchableOpacity>
);

const TeacherHeader = ({ classroom, isLoading }) => (
  <View style={styles.teacherHeaderWrap}>
    <View style={styles.teacherAvatarWrap}>
      <Text style={styles.teacherAvatar}>🏫</Text>
    </View>
    <Text style={styles.classNameTextGreen}>{isLoading ? '' : classroom.class_name}</Text>
    <Text style={styles.teacherName}>{classroom?.user_id?.user_fullname || ''}</Text>
    <Text style={styles.teacherEmail}>{classroom?.user_id?.user_email || ''}</Text>
    {/* School, District, Province Info */}
    {classroom?.school && (
      <View style={styles.schoolInfoWrap}>
        <AntDesign name="home" size={14} color="#388E3C" style={{ marginRight: 4 }} />
        <Text style={styles.schoolInfoText}>
          {classroom.school.school_name}
          {classroom.school.district?.district_name ? `, ${classroom.school.district.district_name}` : ''}
          {classroom.school.province?.province_name ? `, ${classroom.school.province.province_name}` : ''}
        </Text>
      </View>
    )}
  </View>
);

const ExerciseCard = ({ item, index, moment }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      delay: index * 80,
      useNativeDriver: true,
    }).start();
  }, []);
  const endDate = moment(item.date_end);
  const now = moment();
  const isExpired = endDate.isBefore(now);
  return (
    <Animated.View style={[
      styles.exerciseGridCard,
      { backgroundColor: isExpired ? '#FFD6D6' : '#E6FFE6', borderColor: isExpired ? '#CC0000' : '#1CBF60' },
      { opacity: fadeAnim, transform: [{ scale: fadeAnim }] }
    ]}>
      <View style={styles.exerciseIconWrap}>
        <Image source={item.quiz_id?.quiz_thumb ? { uri: item.quiz_id.quiz_thumb } : quizIcon} style={styles.exerciseIcon} />
        <View style={styles.exerciseIconBadge}>
          <AntDesign name="star" size={14} color="#FFD600" />
        </View>
      </View>
      <Text style={styles.exerciseGridTitle}>{item.name}</Text>
      <View style={styles.exerciseGridRow}>
        <AntDesign name="calendar" size={14} color="#388E3C" style={{ marginRight: 4 }} />
        <Text style={styles.exerciseGridDate}>{endDate.format('MMM D')}</Text>
      </View>
      <View style={styles.exerciseGridRow}>
        <AntDesign name="checkcircle" size={14} color="#388E3C" style={{ marginRight: 4 }} />
        <Text style={styles.exerciseGridTime}>{endDate.fromNow(true) ? `In ${endDate.fromNow(true)}` : ''}</Text>
      </View>
    </Animated.View>
  );
};

const StudentItem = ({ item, index, confirmDeleteStudent, styles, avatarPlaceholder }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      delay: index * 60,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View style={[styles.studentCardGaming, { opacity: fadeAnim, transform: [{ scale: fadeAnim }] }]}>
      <View style={styles.studentInfoRowGaming}>
        <View style={styles.avatarBadgeWrap}>
          <Image source={item.user_avatar ? { uri: item.user_avatar } : avatarPlaceholder} style={styles.avatarGaming} />
          <View style={styles.avatarBadge}><AntDesign name="user" size={14} color="#fff" /></View>
        </View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.studentNameGaming}>{item.user_fullname}</Text>
          <Text style={styles.studentEmailGaming}>{item.user_email}</Text>
        </View>
        <TouchableOpacity onPress={() => confirmDeleteStudent(item._id)} style={styles.deleteBtnGaming}>
          <AntDesign name="delete" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const TeacherDetail = () => {
  const route = useRoute();
  const { classroomId } = route.params;
  const [showBottomSheet, setShowBottomSheet] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);
  const { i18n, moment } = useAppProvider();
  const { classroom, fetchClassroom, removeStudent, addStudent } = useClassroomProvider();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [index, setIndex] = useState(0); // 0: Exercises, 1: Students

  // Modal animation
  const modalScale = useRef(new Animated.Value(0.8)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

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
  }, [classroomId]))

  const handleCloseBottomSheet = () => {
    setShowBottomSheet(0);
  };

  const confirmDeleteStudent = (studentId) => {
    setStudentToRemove(studentId);
    setModalVisible(true);
    Animated.parallel([
      Animated.spring(modalScale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(modalOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const handleDeleteStudent = async () => {
    if (studentToRemove) {
      await removeStudent(classroomId, studentToRemove);
      fetchClassroom(classroomId);
      Toast.show({
        type: 'success',
        text1: 'Xóa thành công!',
        visibilityTime: 1000,
        autoHide: true,
      });
    }
    Animated.timing(modalOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setModalVisible(false);
      modalScale.setValue(0.8);
    });
  };

  const handleAddStudent = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      setEmail('');
      Toast.show({
        type: 'warn',
        text1: `${i18n.t('play.single.errorTitle')}`,
        text2: email ? `"${email}" không hợp lệ. 🤨` : `Vui lòng nhập Email 🤨`,
        visibilityTime: 1000,
        autoHide: true,
      });
      return;
    }
    try {
      await addStudent(classroomId, email);
      setEmail('');
      setShowBottomSheet(0);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error adding student',
        text2: error.message,
        visibilityTime: 1000,
        autoHide: true,
      });
    }
  };

  // --- UI RENDERING ---
  // Exercises grid (2 columns)
  const renderExercisesGrid = () => (
    <FlatList
      key={index === 0 ? 'exercises-grid' : 'students-list'} // Force remount when switching numColumns
      data={classroom.exercises || []}
      keyExtractor={item => item._id}
      numColumns={2}
      columnWrapperStyle={styles.exerciseGridRowWrap}
      renderItem={({ item, index }) => (
        <ExerciseCard item={item} index={index} moment={moment} />
      )}
      ListEmptyComponent={<View style={styles.emptyLottieWrap}><LottieView source={require('@/assets/jsons/empty.json')} autoPlay loop style={{ width: 180, height: 180 }} /><Text style={{ fontSize: 16, fontWeight: 600, color: '#1CBF60' }}>Không có bài tập</Text></View>}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          <TeacherHeader classroom={classroom} isLoading={isLoading} />
          <View style={styles.tabSwitchWrapGreen}>
            <TouchableOpacity
              style={[styles.tabSwitchBtnGreen, index === 0 && styles.tabSwitchBtnActiveGreen]}
              onPress={() => setIndex(0)}
            >
              <Text style={[styles.tabSwitchTextGreen, index === 0 && styles.tabSwitchTextActiveGreen]}>Exercises</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabSwitchBtnGreen, index === 1 && styles.tabSwitchBtnActiveGreen]}
              onPress={() => setIndex(1)}
            >
              <Text style={[styles.tabSwitchTextGreen, index === 1 && styles.tabSwitchTextActiveGreen]}>Students</Text>
            </TouchableOpacity>
          </View>
        </>
      }
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );

  // Students list
  const renderStudentsList = () => (
    <FlatList
      key={index === 0 ? 'exercises-grid' : 'students-list'}
      data={classroom.students || []}
      keyExtractor={(student) => student._id}
      renderItem={({ item, index }) => (
        <StudentItem item={item} index={index} confirmDeleteStudent={confirmDeleteStudent} styles={styles} avatarPlaceholder={avatarPlaceholder} />
      )}
      ListEmptyComponent={<View style={styles.emptyLottieWrap}><LottieView source={require('@/assets/jsons/empty.json')} autoPlay loop style={{ width: 180, height: 180 }} /><Text style={{ fontSize: 16, fontWeight: 600, color: '#1CBF60' }}>Học sinh trống</Text></View>}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          <TeacherHeader classroom={classroom} isLoading={isLoading} />
          <View style={styles.tabSwitchWrapGreen}>
            <TouchableOpacity
              style={[styles.tabSwitchBtnGreen, index === 0 && styles.tabSwitchBtnActiveGreen]}
              onPress={() => setIndex(0)}
            >
              <Text style={[styles.tabSwitchTextGreen, index === 0 && styles.tabSwitchTextActiveGreen]}>Exercises</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabSwitchBtnGreen, index === 1 && styles.tabSwitchBtnActiveGreen]}
              onPress={() => setIndex(1)}
            >
              <Text style={[styles.tabSwitchTextGreen, index === 1 && styles.tabSwitchTextActiveGreen]}>Students</Text>
            </TouchableOpacity>
          </View>
        </>
      }
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );

  if (isLoading) {
    return <MainLayout>
      <Loading />
    </MainLayout>
  }

  return (
    <View style={styles.rootGreen}>
      <BackButton onPress={() => router.back()} />
      {index === 0 ? renderExercisesGrid() : renderStudentsList()}
      {/* Floating Add Student Button */}
      {showBottomSheet === 0 && (
        <TouchableOpacity
          style={styles.fabAddStudent}
          onPress={() => setShowBottomSheet(1)}
          activeOpacity={0.8}
        >
          <AntDesign name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Modal Add Student Options (Bottom) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showBottomSheet === 1}
        onRequestClose={handleCloseBottomSheet}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBottomSheetContainer]}>
            <View style={[styles.modalBottomSheetContent]}>
              <TouchableOpacity style={styles.modalSheetCloseBtn} onPress={handleCloseBottomSheet}>
                <AntDesign name="close" size={22} color="#999" />
              </TouchableOpacity>
              <Text style={styles.modalSheetTitle}>{i18n.t('classroom.teacher.titleBtsAddStudent')}</Text>
              <ScaleTouchable
                onPress={() => {
                  setShowBottomSheet(0);
                  router.push({ pathname: '/(classroom)/upload_excel', params: { classroomId: classroom._id } });
                }}
              >
                <View style={styles.modalSheetBtnExcel}>
                  <Text style={styles.modalSheetBtnText}>Excel</Text>
                </View>
              </ScaleTouchable>
              <View style={styles.modalSheetDivider} />
              <ScaleTouchable onPress={() => setShowBottomSheet(2)}>
                <View style={styles.modalSheetBtnEmail}>
                  <Text style={styles.modalSheetBtnText}>{i18n.t('classroom.teacher.btnSave')}</Text>
                </View>
              </ScaleTouchable>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal Add Student by Email (Bottom) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showBottomSheet === 2}
        onRequestClose={handleCloseBottomSheet}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBottomSheetContainer}>
            <View style={styles.modalBottomSheetContent}>
              <TouchableOpacity style={styles.modalSheetCloseBtn} onPress={handleCloseBottomSheet}>
                <AntDesign name="close" size={22} color="#888" />
              </TouchableOpacity>
              <Text style={styles.modalSheetTitle}>{i18n.t('classroom.teacher.btsTitleAddStudent')}</Text>
              <View style={{ paddingTop: 20, width: '100%' }}>
                <Text style={styles.modalSheetLabel}>{i18n.t('classroom.teacher.btsTitleEmail')}</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder={i18n.t('classroom.teacher.btsPlaceholder')}
                  style={styles.modalSheetInput}
                />
              </View>
              <View style={styles.modalSheetBtnRow}>
                <ScaleTouchable onPress={handleCloseBottomSheet}>
                  <View style={styles.modalSheetBtnCancel}>
                    <Text style={styles.modalSheetBtnCancelText}>{i18n.t('classroom.teacher.btnCancel')}</Text>
                  </View>
                </ScaleTouchable>
                <ScaleTouchable onPress={() => { handleAddStudent() }}>
                  <View style={styles.modalSheetBtnSave}>
                    <Text style={styles.modalSheetBtnSaveText}>{i18n.t('classroom.teacher.btnSave')}</Text>
                  </View>
                </ScaleTouchable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* Confirmation Modal for Student Deletion (remains as before) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ scale: modalScale }], opacity: modalOpacity }]}>
            <Text style={styles.modalTitle}>{i18n.t('classroom.teacher.titleDelStudent') || 'Remove student?'}</Text>
            <Text style={styles.modalText}>{i18n.t('classroom.teacher.textDelStudent') || 'Are you sure you want to remove this student?'}</Text>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>{i18n.t('classroom.teacher.btnCancel') || 'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteStudent} style={styles.removeBtn}>
                <Text style={styles.removeBtnText}>{i18n.t('classroom.teacher.btnDel') || 'Remove'}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  rootGreen: {
    flex: 1,
    backgroundColor: '#C6E5B6',
    minHeight: '100%',
    paddingHorizontal: 12,
    paddingTop: 50,
    paddingBottom: 0,
  },
  backBtn: {
    position: 'absolute',
    left: 20,
    top: 32,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 99,
    borderWidth: 2,
    borderColor: '#1CBF60',
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  teacherHeaderWrap: {
    backgroundColor: '#6DD47E',
    borderRadius: 22,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1CBF60',
    borderBottomWidth: 4,
    paddingTop: 48,
    paddingBottom: 18,
    marginBottom: 12,
    position: 'relative',
  },
  teacherAvatarWrap: {
    backgroundColor: '#fff',
    borderRadius: 99,
    padding: 4,
    marginBottom: 8,
    marginTop: -36,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  teacherAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 40,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
    lineHeight: 72,
  },
  classNameTextGreen: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginTop: 2,
    marginBottom: 2,
    textAlign: 'center',
  },
  teacherName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1B5E20',
    textAlign: 'center',
    marginBottom: 1,
  },
  teacherEmail: {
    fontSize: 14,
    color: '#388E3C',
    textAlign: 'center',
    marginBottom: 2,
  },
  tabSwitchWrapGreen: {
    flexDirection: 'row',
    backgroundColor: '#A3ECA3',
    borderRadius: 24,
    padding: 6,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  tabSwitchBtnGreen: {
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  tabSwitchBtnActiveGreen: {
    backgroundColor: '#C6F6C6',
  },
  tabSwitchTextGreen: {
    fontSize: 19,
    fontWeight: '600',
    color: '#388E3C',
  },
  tabSwitchTextActiveGreen: {
    color: '#1B5E20',
  },
  exerciseGridWrap: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 24,
  },
  exerciseGridRowWrap: {
    flex: 1,
    justifyContent: 'space-around',
    marginBottom: 18,
  },
  exerciseGridCard: {
    backgroundColor: '#E6FFE6',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#1CBF60',
    borderBottomWidth: 3,
    padding: 18,
    marginBottom: 0,
    width: (width - 48) / 2,
    marginHorizontal: 0,
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  exerciseIconWrap: {
    position: 'relative',
    marginBottom: 8,
  },
  exerciseIcon: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#B6F5B6',
    borderWidth: 1.5,
    borderColor: '#1CBF60',
    resizeMode: 'cover',
  },
  exerciseIconBadge: {
    borderWidth: 1,
    borderLeftWidth: 0.5,
    borderColor: '#1CBF60',
    position: 'absolute',
    right: -10,
    top: -10,
    backgroundColor: '#fff',
    borderRadius: 99,
    padding: 3,
    elevation: 2,
  },
  exerciseGridTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#222',
    marginBottom: 4,
  },
  exerciseGridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  exerciseGridDate: {
    fontSize: 15,

    fontWeight: '600',
  },
  exerciseGridTime: {
    fontSize: 15,

    fontWeight: 'bold',
  },
  // Custom Student Card
  studentCardCustom: {
    backgroundColor: '#E6FFE6',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  studentInfoRowCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCustom: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F3F4F6',
  },
  studentNameCustom: {
    fontSize: 18,
    fontWeight: '800',
    color: '#222',
    marginBottom: 2,
  },
  studentEmailCustom: {
    fontSize: 15,
    color: '#388E3C',
  },
  deleteBtnCustom: {
    backgroundColor: '#FFE5E0',
    borderRadius: 99,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  fabAddStudent: {
    position: 'absolute',
    right: 28,
    bottom: 5,
    backgroundColor: '#1CBF60',
    borderRadius: 32,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 20,
  },
  schoolInfoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
    justifyContent: 'center',
  },
  schoolInfoText: {
    fontSize: 13,
    color: '#388E3C',
    textAlign: 'center',
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  sheetLabel: {
    paddingBottom: 8,
    marginTop: 12,
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
  },
  sheetInput: {
    borderWidth: 1,
    borderColor: '#B4E1FA',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    fontSize: 16,
    backgroundColor: '#F3F4F6',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 20,
    width: width * 0.8,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 18,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  cancelBtn: {
    backgroundColor: '#B4E1FA',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginRight: 8,
  },
  cancelBtnText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
  removeBtn: {
    backgroundColor: '#FF5A36',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginLeft: 8,
  },
  removeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyLottieWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  studentCardGaming: {
    backgroundColor: '#FFF9C4',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#FFD600',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderBottomWidth: 4,
    borderColor: '#FFD600',
  },
  studentInfoRowGaming: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarGaming: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFDE7',
    borderWidth: 2,
    borderColor: '#FFD600',
  },
  avatarBadgeWrap: {
    position: 'relative',
    marginRight: 0,
  },
  avatarBadge: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    backgroundColor: '#7C5CFA',
    borderRadius: 99,
    padding: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  studentNameGaming: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  studentEmailGaming: {
    fontSize: 15,
    color: '#7C5CFA',
    fontWeight: 'bold',
  },
  deleteBtnGaming: {
    backgroundColor: '#FF5A36',
    borderRadius: 99,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    elevation: 3,
    shadowColor: '#FF5A36',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  // BottomSheet gaming styles
  sheetGamingContent: {
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    borderRadius: 24,
    padding: 24,
    margin: 8,
    shadowColor: '#FFD600',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  sheetGamingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetGamingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7C5CFA',
  },
  sheetGamingBtnExcel: {
    backgroundColor: '#1CBF60',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  sheetGamingBtnEmail: {
    backgroundColor: '#FFD600',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  sheetGamingBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  sheetGamingDivider: {
    height: 1,
    backgroundColor: '#FFE082',
    borderRadius: 99,
    width: 160,
    marginVertical: 12,
  },
  sheetGamingLabel: {
    fontSize: 16,
    color: '#7C5CFA',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sheetGamingInput: {
    borderWidth: 2,
    borderColor: '#FFD600',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    fontSize: 16,
    backgroundColor: '#FFFDE7',
    marginBottom: 8,
  },
  sheetGamingBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 0,
    marginTop: 18,
  },
  sheetGamingBtnCancel: {
    marginRight: 12,
    backgroundColor: '#E0E7FF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sheetGamingBtnCancelText: {
    color: '#7C5CFA',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sheetGamingBtnSave: {
    marginLeft: 12,
    backgroundColor: '#7C5CFA',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sheetGamingBtnSaveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalSheetContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    marginHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
    minWidth: 280,
    maxWidth: 400,
    alignSelf: 'center',
    position: 'relative',
  },
  modalSheetCloseBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 99,
    borderWidth: 1,
    borderBottomWidth: 2,
    borderColor: '#DDD',

  },
  modalSheetTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginBottom: 18,
    textAlign: 'center',
  },
  modalSheetBtnExcel: {
    backgroundColor: '#5ABF60',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1CAE60',
    borderBottomWidth: 4,
    marginTop: 10,
    marginBottom: 10,
    width: 200,
  },
  modalSheetBtnEmail: {
    backgroundColor: '#7C5CFA',
    borderColor: '#5C4BF5',
    borderWidth: 1,
    borderBottomWidth: 4,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 10,
    width: 200,
  },
  modalSheetBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingVertical: 4,
  },
  modalSheetDivider: {
    height: 1,
    backgroundColor: '#5ABF60',
    borderRadius: 99,
    width: 200,
    marginVertical: 14,
  },
  modalSheetLabel: {
    fontSize: 16,
    color: '#7C5CFA',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'left',
  },
  modalSheetInput: {
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
    marginBottom: 8,
  },
  modalSheetBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 0,
    marginTop: 24,
    gap: 12,
  },
  modalSheetBtnCancel: {
    backgroundColor: '#E0E7FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A0A7FF',
    borderBottomWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalSheetBtnCancelText: {
    color: '#A0A7FF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSheetBtnSave: {
    marginLeft: 12,
    backgroundColor: '#7C5CFA',
    borderColor: '#5C4BF5',
    borderWidth: 1,
    borderBottomWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalSheetBtnSaveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalBottomSheetContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  modalBottomSheetContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    paddingTop: 70,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -8 },
    elevation: 10,
    minHeight: 220,
    maxWidth: 500,
  },
});

export default TeacherDetail;

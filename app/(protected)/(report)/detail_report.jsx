import { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, TouchableOpacity, ScrollView, Image, Alert, StyleSheet, Animated } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useResultProvider } from '@/contexts/ResultProvider';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment';
import Lottie from '@/components/loadings/Lottie';
import { Modalize } from 'react-native-modalize';
import { useQuestionProvider } from '@/contexts/QuestionProvider';
import QuestionOverview from '@/components/customs/QuestionOverview';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useAppProvider } from '@/contexts/AppProvider';
import ResultReview from '../(result)/review';


// Duolingo-style Animated Report Card
function AnimatedReportCard({ result, onPress, index }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const correctCount = result.result_questions.filter((q) => q.correct).length;
  const incorrectCount = result.result_questions.length - correctCount;
  const percent = result.result_questions.length > 0 ? correctCount / result.result_questions.length : 0;

  return (
    <Animated.View style={[styles.studentCard, { opacity: fadeAnim, transform: [{ translateY }] }]}> 
      <View style={styles.studentRow}>
        <Image source={{ uri: result.user_id.user_avatar }} style={styles.studentAvatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.studentName}>{result.user_id.user_fullname}</Text>
          <Text style={styles.studentEmail}>{result.user_id.user_email}</Text>
        </View>
      </View>
      <View style={styles.studentProgressBarBg}>
        <Animated.View style={[styles.studentProgressBarFill, { width: `${percent * 100}%` }]} />
      </View>
      <View style={styles.studentStatsRow}>
        <View style={styles.studentStatBoxGreen}>
          <MaterialCommunityIcons name="check" size={22} color="#fff" />
          <Text style={styles.studentStatBoxText}>{correctCount}</Text>
        </View>
        <View style={styles.studentStatBoxRed}>
          <MaterialCommunityIcons name="close" size={22} color="#fff" />
          <Text style={styles.studentStatBoxText}>{incorrectCount}</Text>
        </View>
        <View style={styles.studentStatBoxBlue}>
          <Text style={styles.studentStatBoxQ}>Q</Text>
          <Text style={styles.studentStatBoxText}>{result.result_questions.length}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.studentButton} onPress={onPress} activeOpacity={0.85}>
        <Text style={styles.studentButtonText}>Xem báo cáo</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Report Summary Card
function ReportSummaryCard({ quizName, quizThumb, className, assignmentName, status, endTime, onDownload, onViewQuestions }) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeaderRow}>
        <View style={styles.summaryQuizRow}>
          {quizThumb ? (
            <Image source={{ uri: quizThumb }} style={styles.summaryQuizImg} />
          ) : null}
          <View style={styles.duoQuizBadge}><Text style={styles.duoQuizBadgeText}>{quizName}</Text></View>
        </View>
        <TouchableOpacity style={styles.summaryDownloadBtn} onPress={onDownload}>
          <MaterialCommunityIcons name="download" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Class and Assignment Row */}
      <View style={styles.summaryClassRow}>
        {assignmentName ? <View style={styles.summaryAssignmentBadge}><Text style={styles.summaryAssignmentText}>{assignmentName}</Text></View> : null}
        {className ? <View style={styles.summaryClassBadge}><Text style={styles.summaryClassText}>{className}</Text></View> : null}
      </View>
      <View style={styles.summaryStatusRow}>
        <View style={[styles.summaryStatusBadge, status === 'Đã hoàn thành' ? styles.statusActive : styles.statusEnded]}>
          <Text style={styles.summaryStatusText}>{status}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.summaryViewBtn} onPress={onViewQuestions}>
        <Text style={styles.summaryViewBtnText}>Xem danh sách câu hỏi</Text>
        <MaterialCommunityIcons name="menu-right" size={22} color="#22c55e" />
      </TouchableOpacity>
    </View>
  );
}

export default function DetailReport() {
  const { i18n } = useAppProvider();
  const modal = createRef();
  const { reportId, type } = useLocalSearchParams();
  const { reportData, fetchReportDetail } = useResultProvider();
  const { fetchQuestions, questions } = useQuestionProvider();
  const [showModal, setShowModal] = useState(false);
  const [overViewData, setOverViewData] = useState(null);


  useFocusEffect(
    useCallback(() => {
      fetchReportDetail(reportId, type);
    }, [reportId]),
  );

  const getStatus = () => {
    const currentDate = new Date();
    const endDate = new Date(reportData.date_end);
    return currentDate < endDate;
  };

  const onOpen = () => {
    if (modal.current) {
      modal.current.open();
    }
  };

  const downloadExcel = async () => {
    if (!reportData.result_ids) return;
    const data = reportData.result_ids.map((result) => ({
      'Họ và tên': result.user_id.user_fullname,
      Email: result.user_id.user_email,
      'Trạng thái': 'Hoàn thành',
      'Điểm số': result.result_questions.filter((q) => q.correct).length + ' điểm',
      'Tổng câu hỏi': result.result_questions.length + ' câu',
    }));
    const title = [['Báo cáo Kết quả Quiz']];
    const headers = [['Họ và tên', 'Email', 'Trạng thái', 'Điểm số', 'Tổng câu hỏi']];
    const sheetData = [...title, [], ...headers, ...data.map(Object.values)];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Results');
    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
    const fileUri = `${FileSystem.cacheDirectory}${reportData.name || reportData.room_code}_report.xlsx`;
    try {
      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  };

  useEffect(() => {
    if (reportData) {
      fetchQuestions(reportData.quiz_id?._id);
    }
  }, [reportData]);

  return (
    <View style={styles.screenBg}>
      {/* Report Summary Card */}
      {reportData.quiz_id && (
        <ReportSummaryCard
          quizName={reportData.quiz_id.quiz_name || 'Quiz'}
          quizThumb={reportData.quiz_id.quiz_thumb}
          className={reportData.classroom_id?.class_name || ''}
          assignmentName={reportData.name || ''}
          status={getStatus() ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
          endTime={moment(reportData.date_end).format('MMM D, YYYY | h:mm A')}
          onDownload={downloadExcel}
          onViewQuestions={onOpen}
        />
      )}
      {/* Student Cards */}
      {reportData.result_ids && reportData.result_ids.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          {reportData.result_ids?.map((result, idx) => (
            <AnimatedReportCard
              key={result._id}
              result={result}
              index={idx}
              onPress={() => {
    setOverViewData(result);
    setShowModal(true); // Mở ResultReview modal
  }}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Lottie source={require('@/assets/jsons/empty.json')} width={200} height={200} text={'Chưa có học sinh nào tham gia'} />
        </View>
      )}
      {/* Modal vẫn giữ nguyên */}
      <Modalize
        ref={modal}
        snapPoint={500}
        modalStyle={styles.modalStyle}
        avoidKeyboardLikeIOS={true}
        withHandle={false}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{i18n.t('report.reportDetail.titleQuiz')}</Text>
          {questions?.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {questions.map((question, index) => (
                <QuestionOverview key={index} question={question} index={index} />
              ))}
            </ScrollView>
          ) : (
            <Lottie source={require('@/assets/jsons/empty.json')} width={150} height={150} />
          )}
        </View>
      </Modalize>
      {showModal && <ResultReview
  visible={showModal}
  onClose={() => {
    setShowModal(false);
    setOverViewData(null); // reset lại nếu cần
  }}
  result={overViewData}
/>}

    </View>
  );
}

const styles = StyleSheet.create({
  screenBg: {
    flex: 1,
    backgroundColor: '#f0f9ff', // 💡 Tươi sáng, tone xanh sáng
  },

  // === Summary Card ===
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#22c55e',
    borderBottomWidth: 2,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryQuizRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryQuizImg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 10,
  },
  duoQuizBadge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  duoQuizBadgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  summaryDownloadBtn: {
    backgroundColor: '#0ea5e9',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0284c7',
    borderBottomWidth: 3,
  },

  // === Class & Assignment Badge ===
  summaryClassRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  summaryAssignmentBadge: {
    backgroundColor: '#f59e0b',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  summaryAssignmentText: {
    color: '#fff',
    fontWeight: '600',
  },
  summaryClassBadge: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  summaryClassText: {
    color: '#fff',
    fontWeight: '800',
  },

  // === Status Row ===
  summaryStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryStatusBadge: {
    backgroundColor: '#bbf7d0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  summaryStatusText: {
    color: '#15803d',
    fontWeight: '600',
  },
  summaryTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryTimeText: {
    marginLeft: 4,
    color: '#64748b',
  },
  summaryViewBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0fbe6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderColor: '#22c55e',
    alignSelf: 'flex-start',
  },
  summaryViewBtnText: {
    color: '#16a34a',
    fontWeight: 'bold',
    marginRight: 4,
  },

  // === Student Report Cards ===
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0f2fe',
  },
  studentName: {
    fontWeight: '800',
    fontSize: 15,
    color: '#0f172a',
  },
  studentEmail: {
    fontSize: 12,
    color: '#64748b',
  },
  studentProgressBarBg: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    marginVertical: 8,
  },
  studentProgressBarFill: {
    height: 10,
    backgroundColor: '#22c55e',
    borderRadius: 8,
  },
  studentStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  studentStatBoxGreen: {
    backgroundColor: '#22c55e',
    width: 54,
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 3,
    borderColor: '#15803d',
  },
  studentStatBoxRed: {
    backgroundColor: '#ef4444',
    width: 54,
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#b91c1c',
    borderBottomWidth: 3,
  },
  
  studentStatBoxBlue: {
    backgroundColor: '#3b82f6',
    width: 54,
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderBottomWidth: 3,
  },
  studentStatBoxQ: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  studentStatBoxText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  studentButton: {
    marginTop: 8,
    backgroundColor: '#0ea5e9',
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0284c7',
    borderBottomWidth: 3,
  },
  studentButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },

  // Modal
  modalStyle: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#fff',
    padding: 16,
  },
  modalContent: {
    paddingBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#16a34a',
    marginBottom: 16,
  },
});


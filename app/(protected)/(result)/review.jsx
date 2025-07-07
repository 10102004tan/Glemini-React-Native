import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const ResultReview = ({ result, visible, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [reviewData, setReviewData] = useState(null);
  const params = useLocalSearchParams();
  const router = useRouter();

  // Xử lý dữ liệu từ navigation params
  useEffect(() => {
    if (params.result) {
      try {
        const parsedResult = JSON.parse(params.result);
        console.log('📊 Parsed Result:', JSON.stringify(parsedResult, null, 2));
        setReviewData(parsedResult);
      } catch (error) {
        console.error('❌ Error parsing result:', error);
        console.log('❌ Raw result:', params.result);
      }
    }
  }, [params.result]);

  // Sử dụng dữ liệu từ props hoặc từ navigation params
  const finalResult = result || reviewData;

  // Kiểm tra null safety cho result
  if (!finalResult || !finalResult.result_questions) {
    console.log('❌ No valid result data:', { finalResult, result, reviewData });
    return (
      <Modal visible={visible || !!params.result} animationType="slide" onRequestClose={onClose || (() => router.back())} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ alignItems: 'flex-end' }}>
              <TouchableOpacity onPress={onClose || (() => router.back())} style={styles.closeButton}>
                <Text>❌</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.questionBox}>
              <Text style={styles.title}>📊 Không có kết quả</Text>
              <Text style={styles.questionText}>
                {!finalResult
                  ? 'Bạn chưa làm câu nào nên không có kết quả để hiển thị.'
                  : 'Không thể tải dữ liệu kết quả. Vui lòng thử lại sau.'
                }
              </Text>
              {__DEV__ && (
                <>
                  <Text style={styles.explanationText}>
                    Debug Info:
                  </Text>
                  <Text style={styles.explanationText}>
                    Has result prop: {!!result}
                  </Text>
                  <Text style={styles.explanationText}>
                    Has reviewData: {!!reviewData}
                  </Text>
                  <Text style={styles.explanationText}>
                    Has params.result: {!!params.result}
                  </Text>
                  <Text style={styles.explanationText}>
                    Final result: {JSON.stringify(finalResult, null, 2)}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  const currentQuestion = finalResult.result_questions[selectedIndex];
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateScale = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const goToNextQuestion = () => {
    if (finalResult && finalResult.result_questions && selectedIndex < finalResult.result_questions.length - 1) {
      setSelectedIndex((prev) => prev + 1);
      animateScale();
    }
  };

  const goToPreviousQuestion = () => {
    if (selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
      animateScale();
    }
  };

  const renderAnswer = (q) => {
    const qType = q.question_id.question_type;
    const correctAns = q.question_id.correct_answer_ids || [];
    const userAns = q.answer || [];

    if (qType === 'single' || qType === 'multiple') {
      return (
        <View style={{ gap: 12 }}>
          {q.question_id.question_answer_ids.map((ans, i) => {
            const isUser = userAns.some((u) => u._id === ans._id);
            const isCorrect = correctAns.some((c) => c._id === ans._id);

            let borderColor = '#334155';
            let shadowColor = '#000';
            if (isCorrect && isUser) {
              borderColor = '#facc15';
              shadowColor = '#facc15';
            } else if (isCorrect) {
              borderColor = '#22c55e';
              shadowColor = '#22c55e';
            } else if (isUser) {
              borderColor = '#ef4444';
              shadowColor = '#ef4444';
            }

            return (
              <View
                key={i}
                style={[
                  styles.answerBox,
                  {
                    borderColor,
                    shadowColor,
                  },
                ]}
              >
                <Text style={styles.answerText}>{ans.text}</Text>
              </View>
            );
          })}
        </View>
      );
    }

    if (qType === 'fill' || qType === 'order') {
      const fullAnswers = q.question_id.question_answer_ids || [];

      return (
        <View>
          {/* 1. Đáp án có thể chọn */}
          <Text style={styles.sectionLabel}>📚 Các đáp án có thể chọn:</Text>
          <View style={styles.tokenWrap}>
            {fullAnswers.map((a, i) => (
              <Text key={i} style={[styles.choiceOption, { color: '#facc15' }]}>{a.text}</Text>
            ))}
          </View>

          {/* 3. Phần đã có sẵn */}
          <Text style={styles.sectionLabel}>📌 Câu trả lời của bạn:</Text>
          <View style={styles.tokenWrap}>
            {userAns.length > 0 ? (
              userAns.map((a, i) => (
                <Text key={i} style={[styles.choiceOption, { color: '#f472b6' }]}>{a.text}</Text>
              ))
            ) : (
              <Text style={styles.noAnswer}>Không có</Text>
            )}
          </View>

          <Text style={styles.sectionLabel}>✅ Đáp án đúng:</Text>
          <View style={styles.tokenWrap}>
            {correctAns.length > 0 ? (
              correctAns.map((a, i) => (
                <Text key={i} style={[styles.choiceOption, { color: '#22c55e' }]}>{a.text}</Text>
              ))
            ) : (
              <Text style={styles.noAnswer}>Chưa có đáp án chuẩn</Text>
            )}
          </View>
        </View>
      );
    }


    return <Text style={{ color: '#fff' }}>Không xác định loại câu hỏi</Text>;
  };

  return (
    <Modal visible={visible || !!params.result} animationType="slide" onRequestClose={onClose || (() => router.back())} transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.containerScroll}>
            <View style={{ alignItems: 'flex-end' }}>
              <TouchableOpacity onPress={onClose || (() => router.back())} style={styles.closeButton}>
                <Text>❌</Text>
              </TouchableOpacity>
            </View>

            {currentQuestion ? (
              <Animated.View style={[styles.questionBox, { transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.header}>
                  <Text style={styles.title}>🧠 Câu {selectedIndex + 1}</Text>
                  <Text style={styles.points}>({currentQuestion.question_id.question_point} điểm)</Text>
                  <Text style={currentQuestion.correct ? styles.correctMark : styles.wrongMark}>
                    {currentQuestion.correct ? '✅ Đúng' : '❌ Sai'}
                  </Text>
                </View>

                <Text style={styles.questionText}>
                  {currentQuestion.question_id.question_excerpt}
                </Text>

                {renderAnswer(currentQuestion)}

                <View style={styles.explanation}>
                  <Text style={styles.sectionLabel}>📖 Giải thích:</Text>
                  <Text style={styles.explanationText}>
                    {currentQuestion.question_id.question_explanation || 'Không có giải thích chi tiết.'}
                  </Text>
                </View>
              </Animated.View>
            ) : (
              <Text style={{ color: 'white' }}>Không tìm thấy câu hỏi</Text>
            )}

            <View style={styles.navButtons}>
              <TouchableOpacity
                onPress={goToPreviousQuestion}
                disabled={selectedIndex === 0}
                style={[
                  styles.navButton,
                  selectedIndex === 0 && styles.disabledButton,
                ]}
              >
                <Text style={styles.navText}>← Trước</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={goToNextQuestion}
                disabled={selectedIndex === (finalResult?.result_questions?.length || 0) - 1}
                style={[
                  styles.navButton,
                  selectedIndex === (finalResult?.result_questions?.length || 0) - 1 && styles.disabledButton,
                ]}
              >
                <Text style={styles.navText}>Tiếp →</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>

  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    width: '100%',
    maxHeight: '90%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderBottomWidth: 4,
    borderColor: '#6366f1',
  },
  containerScroll: {
    paddingBottom: 24,
  },
  closeButton: {
    backgroundColor: '#334155',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#6366f1',
    borderBottomWidth: 4,
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  questionBox: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  title: {
    color: '#fbbf24',
    fontSize: 20,
    fontWeight: '900',
  },
  points: {
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
  correctMark: {
    color: '#22c55e',
    fontWeight: '800',
    fontSize: 13,

  },
  wrongMark: {
    color: '#ef4444',
    fontWeight: '800',
    fontSize: 13,

  },
  questionText: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  answerBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: '#1e293b',
  },
  answerText: {
    color: '#f8fafc',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionLabel: {
    color: '#38bdf8',
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
  },
  tokenWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  noAnswer: {
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  choiceOption: {
    fontWeight: '800',
    fontSize: 16,
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  explanation: {
    marginTop: 24,
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 8,
  },
  explanationText: {
    color: '#cbd5e1',
    marginTop: 4,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  navButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: '#6366f1',
  },
  disabledButton: {
    opacity: 0.4,
  },
  navText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


export default ResultReview;

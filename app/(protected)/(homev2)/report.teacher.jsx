import { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useResultProvider } from '@/contexts/ResultProvider';
import { AuthContext } from '@/contexts/AuthContext';
import LockFeature from '@/components/customs/LockFeature';
import { Feather, FontAwesome } from '@expo/vector-icons';
import debounce from 'lodash/debounce';
import Toast from 'react-native-toast-message-custom';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import { Picker } from '@react-native-picker/picker';
import { useAppProvider } from '@/contexts/AppProvider';
import MainLayout from '@/components/layouts/MainLayout';

export default function Report() {
  const { i18n } = useAppProvider();
  const { fetchResultsForTeacher } = useResultProvider();
  const { classrooms } = useClassroomProvider();
  const [typeFilter, setTypeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermMockup, setSearchTermMockup] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [resultsData, setResultsData] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  // Local state for modal filter values
  const [modalClassFilter, setModalClassFilter] = useState('');
  const [modalTypeFilter, setModalTypeFilter] = useState('');
  const [modalSortOrder, setModalSortOrder] = useState('newest');

  // Debounced search handler
  const handleSearchChange = useCallback(
    debounce((term) => {
      setSearchTerm(term);
    }, 1000),
    [],
  );

  // Function to fetch results with filters and pagination
  const loadResults = async (overridePage = 1, append = false) => {
    try {
      const newResults = await fetchResultsForTeacher(
        overridePage,
        sortOrder,
        searchTerm,
        classFilter,
        typeFilter,
      );

      if (newResults?.results) {
        if (newResults.results.length > 0) {
          if (append) {
            setResultsData((prevResults) => [...prevResults, ...newResults.results]);
          } else {
            setResultsData(newResults.results);
          }
          setHasMoreData(true);
        } else {
          if (!append) {
            setResultsData([]);
          }
          setHasMoreData(false);
        }
      } else {
        Toast.show({ type: 'error', text1: 'Dữ liệu trả về không đúng cấu trúc mong đợi' });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Có lỗi xảy ra khi tải dữ liệu' });
    }
  };

  useEffect(() => {
    setPage(1);
    loadResults(1, false); // Reset results rather than appending
  }, [searchTerm, classFilter, sortOrder, typeFilter]);

  const handleLoadMore = async () => {
    if (isFetchingMore || !hasMoreData) return;

    setIsFetchingMore(true);
    const nextPage = page + 1;
    await loadResults(nextPage, true);
    setPage(nextPage);
    setIsFetchingMore(false);
  };

  // Open modal: sync modal state with current filter state
  const openFilterModal = () => {
    setModalClassFilter(classFilter);
    setModalTypeFilter(typeFilter);
    setModalSortOrder(sortOrder);
    setFilterModalVisible(true);
  };

  // Apply filters from modal
  const handleApplyFilters = () => {
    setClassFilter(modalClassFilter);
    setTypeFilter(modalTypeFilter);
    setSortOrder(modalSortOrder);
    setPage(1);
    setFilterModalVisible(false);
  };

  // Reset Filters (from modal)
  const handleResetFilters = () => {
    setModalClassFilter('');
    setModalTypeFilter('');
    setModalSortOrder('newest');
  };

  // Duolingo-style Report Item
  const renderItem = ({ item }) => {
    const totalQuestions =
      item.results?.reduce((acc, result) => acc + (result.result_questions?.length || 0), 0) || 0;
    const correctAnswers =
      item.results?.reduce(
        (acc, result) => acc + (result.result_questions?.filter((q) => q.correct).length || 0),
        0,
      ) || 0;
    const completionPercentage =
      totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    let badgeColor = '#22c55e';
    if (completionPercentage < 30) badgeColor = '#f87171'; // đỏ
    else if (completionPercentage < 65) badgeColor = '#facc15'; // vàng

    // Chọn icon theo loại report
    const typeIcon = item.type === 'room' ? (
      <Feather name="zap" size={32} color="#22c55e" />
    ) : (
      <FontAwesome name="book" size={32} color="#3b82f6" />
    );

    return (
      <Pressable
        onPress={() => {
          router.push({
            pathname: '(report)/detail_report',
            params: { reportId: item.id, type: item.type },
          });
        }}
        key={item.id}
        style={({ pressed }) => [
          styles.duoCard,
          pressed && { transform: [{ scale: 0.97 }], shadowOpacity: 0.18 },
        ]}
      >
        <View style={styles.duoIconBox}>{typeIcon}</View>
        <View style={styles.duoInfoBox}>
          <Text style={styles.duoTitle}>{item.identifier}</Text>
          <Text style={styles.duoType}>
            {item.type === 'room' ? i18n.t('report.realtime') : i18n.t('report.exercise')}
            {item.class_name ? ` · ${item.class_name}` : ''}
          </Text>
          <View style={styles.duoUserRow}>
            <Feather name="users" size={16} color={'#64748b'} />
            <Text style={styles.duoUserText}>
              {item.results?.length} {i18n.t('report.userJoin')}
            </Text>
          </View>
        </View>
        <View style={styles.duoRightBox}>
          <View style={[styles.duoBadge, { backgroundColor: badgeColor }]}> 
            <Text style={styles.duoBadgeText}>{completionPercentage}%</Text>
          </View>
          <Feather name="chevron-right" size={28} color="#a3a3a3" style={{ marginTop: 8 }} />
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>{i18n.t('report.title')}</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={openFilterModal}
          >
            <Feather name="sliders" size={22} color="#fff" />
            <Text style={styles.filterButtonText}>{i18n.t('report.filter')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder={i18n.t('report.placeholderSearch')}
            value={searchTermMockup}
            onChangeText={(text) => {
              setSearchTermMockup(text);
              handleSearchChange(text);
            }}
            style={styles.searchInput}
            placeholderTextColor="#94a3b8"
          />
        </View>
        <FlatList
          style={styles.list}
          showsVerticalScrollIndicator={false}
          data={resultsData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            isFetchingMore ? <ActivityIndicator size="large" color="#22c55e" /> : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{i18n.t('report.emptyReport')}</Text>
            </View>
          }
        />
        {/* Filter Modal (Bottom Sheet Style) */}
        <Modal
          visible={filterModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                activeOpacity={0.7}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>×</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{i18n.t('report.filter')}</Text>
              <View style={styles.modalPickerContainer}>
                <Text style={styles.modalLabel}>{i18n.t('report.optionClass')}</Text>
                <View style={styles.modalPickerBox}>
                  <Picker
                    selectedValue={modalClassFilter}
                    onValueChange={(itemValue) => setModalClassFilter(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label={i18n.t('report.optionClass')} value="" />
                    {classrooms.map((cls) => (
                      <Picker.Item key={cls._id} label={cls.class_name} value={cls.class_name} />
                    ))}
                  </Picker>
                </View>
                <Text style={styles.modalLabel}>{i18n.t('report.optionType')}</Text>
                <View style={styles.modalPickerBox}>
                  <Picker
                    selectedValue={modalTypeFilter}
                    onValueChange={(itemValue) => setModalTypeFilter(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label={i18n.t('report.optionType')} value="" />
                    <Picker.Item label={i18n.t('report.realtime')} value="room" />
                    <Picker.Item label={i18n.t('report.exercise')} value="exercise" />
                  </Picker>
                </View>
                <View style={styles.modalSortRow}>
                  <TouchableOpacity
                    style={[
                      styles.sortButton,
                      modalSortOrder === 'newest' && styles.sortButtonActive,
                    ]}
                    onPress={() => setModalSortOrder('newest')}
                  >
                    <Text
                      style={[
                        styles.sortButtonText,
                        modalSortOrder === 'newest' && styles.sortButtonTextActive,
                      ]}
                    >
                      {i18n.t('report.optionNew')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.sortButton,
                      modalSortOrder === 'oldest' && styles.sortButtonActive,
                    ]}
                    onPress={() => setModalSortOrder('oldest')}
                  >
                    <Text
                      style={[
                        styles.sortButtonText,
                        modalSortOrder === 'oldest' && styles.sortButtonTextActive,
                      ]}
                    >
                      {i18n.t('report.optionOld')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.modalResetButton}
                  onPress={handleResetFilters}
                >
                  <Text style={styles.modalResetButtonText}>{i18n.t('report.btnFresh')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalApplyButton}
                  onPress={handleApplyFilters}
                >
                  <Text style={styles.modalApplyButtonText}>{i18n.t('report.btnApply') || 'Áp dụng'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f7fb',
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#16a34a', 
    letterSpacing: 0.5,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderColor: '#16a34a',
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#1cb760',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    color: '#334155',
    borderWidth: 1,
    borderBottomWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  cardPressable: {
    marginBottom: 14,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderBottomWidth: 2,
    borderColor: '#1cb760',
    shadowColor: '#1cb760',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardTypeContainer: {
    width: '28%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 8,
  },
  cardTypeText: {
    color: '#fff',
    backgroundColor: '#1cb760',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    overflow: 'hidden',
  },
  cardInfoContainer: {
    width: '72%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  cardInfoTextContainer: {
    width: '80%',
  },
  cardTitle: {
    color: '#1f2937',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardSubtitle: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 2,
  },
  cardUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  cardUserText: {
    color: '#64748b',
    marginLeft: 8,
    fontSize: 13,
  },
  cardCompletionContainer: {
    width: '20%',
    alignItems: 'center',
  },
  completionText: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    textAlign: 'center',
    overflow: 'hidden',
  },
  completionGreen: {
    backgroundColor: '#d1fae5',
    color: '#059669',
  },
  completionYellow: {
    backgroundColor: '#fef9c3',
    color: '#eab308',
  },
  completionRed: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1cb760',
    marginBottom: 18,
    textAlign: 'center',
  },
  modalPickerContainer: {
    marginBottom: 18,
  },
  modalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  modalPickerBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  picker: {
    width: '100%',
    color: '#334155',
  },
  modalSortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  sortButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sortButtonActive: {
    backgroundColor: '#1cb760',
    borderColor: '#1cb760',
  },
  sortButtonText: {
    color: '#334155',
    fontWeight: 'bold',
    fontSize: 15,
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  modalResetButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 2,
    borderColor: '#e5e7eb',
  },
  modalResetButtonText: {
    color: '#1cb760',
    fontWeight: '600',
    fontSize: 16,
  },
  modalApplyButton: {
    flex: 1,
    backgroundColor: '#1cb760',
    borderWidth: 1,
    borderBottomWidth: 2,
    borderColor: '#16a34a',
    borderRadius: 16,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  modalApplyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16, // more space from top
    right: 20, // more space from right
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderBottomWidth: 0,
    borderColor: '#e5e7eb',
    // Add a slight scale effect on press (handled inline)
  },
  modalCloseButtonText: {
    fontSize: 30,
    color: '#1cb760',
    fontWeight: '900',
    textAlign: 'center',
    // Add a playful font if available
    fontFamily: 'Poppins-Bold',
    letterSpacing: 1,
  },
  duoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 24,
    marginBottom: 16,
    padding: 18,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: '#bbf7d0',
  },
  duoIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#bbf7d0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  duoInfoBox: {
    flex: 1,
    justifyContent: 'center',
  },
  duoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#16a34a',
    marginBottom: 2,
  },
  duoType: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  duoUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duoUserText: {
    color: '#64748b',
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
  },
  duoRightBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  duoBadge: {
    minWidth: 48,
    minHeight: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  duoBadgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});

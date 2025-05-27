import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Pressable, ActivityIndicator, FlatList } from "react-native";
import { router } from "expo-router";
import { useResultProvider } from "@/contexts/ResultProvider";
import { AuthContext } from "@/contexts/AuthContext";
import LockFeature from "@/components/customs/LockFeature";
import { Feather, FontAwesome } from "@expo/vector-icons";
import debounce from 'lodash/debounce';
import Toast from "react-native-toast-message-custom";
import { useClassroomProvider } from "@/contexts/ClassroomProvider";
import { Picker } from '@react-native-picker/picker';
import { useAppProvider } from "@/contexts/AppProvider";
import MainLayout from "@/components/layouts/MainLayout";

export default function Report() {
   const { i18n } = useAppProvider()
   // const { teacherStatus } = useContext(AuthContext);
   const { fetchResultsForTeacher } = useResultProvider();
   const { classrooms } = useClassroomProvider();
   const [typeFilter, setTypeFilter] = useState("");
   const [searchTerm, setSearchTerm] = useState("");
   const [searchTermMockup, setSearchTermMockup] = useState("");
   const [classFilter, setClassFilter] = useState("");
   const [sortOrder, setSortOrder] = useState("newest");
   const [page, setPage] = useState(1);
   const [isFetchingMore, setIsFetchingMore] = useState(false);
   const [resultsData, setResultsData] = useState([]);
   const [hasMoreData, setHasMoreData] = useState(true);

   // Debounced search handler
   const handleSearchChange = useCallback(
      debounce((term) => {
         setSearchTerm(term);
      }, 200),
      []
   );

   // Function to fetch results with filters and pagination
   const loadResults = async (overridePage = 1, append = false) => {
      try {
         const newResults = await fetchResultsForTeacher(overridePage, sortOrder, searchTerm, classFilter, typeFilter);

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

   const handleSortOrderToggle = () => {
      setSortOrder((prevOrder) => (prevOrder === 'newest' ? 'oldest' : 'newest'));
      setPage(1);
   };

   // Reset Filters
   const handleResetFilters = () => {
      setSearchTermMockup("");
      setSearchTerm("");
      setClassFilter("");
      setTypeFilter("");
      setSortOrder("newest");
      setPage(1);
      setHasMoreData(true);

      loadResults(1).then(() => handleLoadMore());
   };

   const renderItem = ({ item }) => {
      // Tính tổng số câu hỏi từ tất cả kết quả
      const totalQuestions = item.results?.reduce((acc, result) => acc + (result.result_questions?.length || 0), 0) || 0;

      // Tính tổng số câu trả lời đúng từ tất cả kết quả
      const correctAnswers = item.results?.reduce((acc, result) =>
         acc + (result.result_questions?.filter(q => q.correct).length || 0), 0
      ) || 0;

      // Tính tỷ lệ hoàn thành
      const completionPercentage = totalQuestions > 0
         ? Math.round((correctAnswers / totalQuestions) * 100)
         : 0;

      return (
         <Pressable
            onPress={() => {
               router.push({
                  pathname: '(report)/detail_report',
                  params: { reportId: item.id, type: item.type },
               });
            }}
            key={item.id}
         >
            <View
               style={{
                  dísplay: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'between',
                  backgroundColor: 'transparent',
                  borderRadius: 6,
                  marginBottom: 8
               }}
            >
               <View
                  style={{
                     display: 'flex',
                     flexDirection: 'row',
                     width: '100%'
                  }}>
                  <View
                     style={{
                        width: '1/3', // Adjusted to fit the layout 33.33% (checking)
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 10
                     }}
                  >
                     <Text
                        style={{
                           color: '#fff',
                           padding: 12,
                           backgroundColor: '#000',
                           borderRadius: 6,
                           width: '100%',
                           textAlign: 'center',
                        }}>
                        {item.type === 'room' ? i18n.t('report.realtime') : i18n.t('report.exercise')}
                     </Text>
                  </View>
                  <View
                     style={{
                        width: '2/3', // Adjusted to fit the layout 66.67% (checking)
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: '#e5e7eb',
                     }}
                  >
                     <View
                        style={{
                           width: '80%'
                        }}>
                        <Text
                           style={{
                              color: '#1f2937',
                              fontSize: 16,
                              lineHeight: 24,
                              fontWeight: 'bold'
                           }}
                        >
                           {item.identifier}
                        </Text>
                        <Text
                           style={{
                              color: '#64748b'
                           }}>
                           {item.class_name || item.description}
                        </Text>
                        <View
                           style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                           }}>
                           <Feather name="users" size={16} color={'gray'} />
                           <Text style={{ color: '#64748b', marginLeft: 8 }}>
                              {item.results?.length} {i18n.t('report.userJoin')}
                           </Text>
                        </View>
                     </View>
                     <View style={{ width: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Text className={`${completionPercentage < 30 ? 'bg-red-500/50 text-red-500' : completionPercentage < 65 ? 'bg-yellow-500/40 text-yellow-500' : 'bg-green-500/50 text-green-500'} px-1 py-2 w-12 text-center rounded-md font-bold`}>
                           {completionPercentage}%
                        </Text>
                     </View>
                  </View>
               </View>
            </View>
         </Pressable>
      );
   };

   return (
      <MainLayout>
         <View
            style={{ flex: 1, backgroundColor: '#fff', marginTop: 20 }}
         >
            <View className="shadow-lg" style={{
               paddingHorizontal: 16,
               paddingTop: 8,
               paddingBottom: 16,
            }}>
               <View
                  style={{
                     display: 'flex',
                     flexDirection: 'row',
                     alignItems: 'center',
                     borderRadius: 6,
                     marginBottom: 16,
                     gap: 16
                  }}>
                  <TextInput
                     placeholder={i18n.t('report.placeholderSearch')}
                     value={searchTermMockup}
                     onChangeText={(text) => {
                        setSearchTermMockup(text);
                        handleSearchChange(text);
                     }}
                     style={{
                        flex: 1,
                        padding: 12,
                        color: '#334155',
                        borderWidth: 1,
                        borderRadius: 8
                     }}
                  />
                  <TouchableOpacity
                     style={{
                        padding: 16,
                        borderWidth: 1,
                        borderRadius: 8,
                        backgroundColor: '#000',
                     }}
                     onPress={handleResetFilters}
                  >
                     <Text style={{ color: '#f8fafc' }}>{i18n.t('report.btnFresh')}</Text>
                  </TouchableOpacity>
               </View>
               <View
                  style={{
                     display: 'flex',
                     flexDirection: 'row',
                     alignItems: 'center',
                     justifyContent: 'space-around',
                     gap: 16,
                     marginBottom: 16,
                  }}>
                  <View
                     style={{ flex: 1, borderWidth: 1, borderRadius: 8, backgroundColor: 'transparent' }}>
                     <Picker
                        selectedValue={classFilter}
                        onValueChange={(itemValue) => setClassFilter(itemValue)}
                     >
                        <Picker.Item label={i18n.t('report.optionClass')} value="" />
                        {classrooms.map((cls) => (
                           <Picker.Item key={cls._id} label={cls.class_name} value={cls.class_name} />
                        ))}
                     </Picker>
                  </View>

                  <View
                     style={{ flex: 1, borderWidth: 1, borderRadius: 8, backgroundColor: 'transparent' }}>
                     <Picker
                        selectedValue={typeFilter}
                        onValueChange={(itemValue) => setTypeFilter(itemValue)}
                     >
                        <Picker.Item label={i18n.t('report.optionType')} value="" />
                        <Picker.Item label={i18n.t('report.realtime')} value="room" />
                        <Picker.Item label={i18n.t('report.exercise')} value="exercise" />
                     </Picker>
                  </View>

                  <TouchableOpacity
                     style={{ backgroundColor: 'transparent', borderRadius: 8, borderWidth: 1, padding: 16, minWidth: 100 }}
                     onPress={handleSortOrderToggle}
                  >
                     <Text style={{ color: '#334155', textAlign: 'center' }}>{sortOrder === "newest" ? i18n.t('report.optionNew') : i18n.t('report.optionOld')}</Text>
                  </TouchableOpacity>
               </View>
               <View style={{ width: '100%', height: 1, backgroundColor: '#cbd5e1' }} />
            </View>
            <View style={{ paddingHorizontal: 16, paddingBottom: 80 }}>
               <FlatList
                  style={{ marginBottom: 80 }}
                  showsVerticalScrollIndicator={false}
                  data={resultsData}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                  onEndReached={handleLoadMore}
                  onEndReachedThreshold={0.1}
                  ListFooterComponent={isFetchingMore ? <ActivityIndicator size="large" color="#0000ff" /> : null}
                  ListEmptyComponent={
                     <View
                        style={{ display: flex, alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
                        <Text style={{ color: '#64748b' }}>{i18n.t('report.emptyReport')}</Text>
                     </View>
                  }
               />
            </View>
         </View>
      </MainLayout>

   );
}
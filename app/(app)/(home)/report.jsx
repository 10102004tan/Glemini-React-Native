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

export default function ReportScreen() {
   const {i18n} = useAppProvider()
   const { teacherStatus } = useContext(AuthContext);
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


   if (teacherStatus === 'pedding' || teacherStatus === 'rejected') {
      return <LockFeature />;
   }

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
            <View className="flex-row items-center justify-between bg-transparent rounded-md mb-2">
               <View className='flex-row w-full'>
                  <View className='w-1/3 flex items-center justify-center px-5'>
                     <Text className='text-white p-3 bg-black rounded-md w-full text-center'>
                        {item.type === 'room' ? i18n.t('report.realtime') : i18n.t('report.exercise')}
                     </Text>
                  </View>
                  <View className='w-2/3 h-auto flex-row items-center py-5 border-b-[1px] border-slate-300'>
                     <View className='w-4/5'>
                        <Text className="text-slate-500 text-base font-bold">{item.identifier}</Text>
                        <Text className="text-slate-500">{item.class_name || item.description}</Text>
                        <View className="flex-row items-center">
                           <Feather name="users" size={16} color={'gray'} />
                           <Text className='ml-2 text-slate-500'>
                              {item.results?.length} {i18n.t('report.userJoin')}
                           </Text>
                        </View>
                     </View>
                     <View className='w-1/5 flex items-center'>
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
      <View className="flex-1 bg-white mb-20">
         <View className="px-4 pt-2 pb-4 shadow-lg">
            <View className="flex-row items-center rounded-md mb-4 gap-4">
               <TextInput
                  placeholder={i18n.t('report.placeholderSearch')}
                  value={searchTermMockup}
                  onChangeText={(text) => {
                     setSearchTermMockup(text);
                     handleSearchChange(text);
                  }}
                  className="flex-1 p-3 text-slate-700 border-[1px] rounded-lg"
               />
               <TouchableOpacity
                  className="bg-black p-4 border-[1px] rounded-lg"
                  onPress={handleResetFilters}
               >
                  <Text className="text-slate-50 ">{i18n.t('report.btnFresh')}</Text>
               </TouchableOpacity>
            </View>
            <View className="flex-row gap-4 justify-around items-center mb-4">
               <View className='flex-1 bg-transparent rounded-lg border-[1px]'>
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

               <View className='flex-1 bg-transparent rounded-lg border-[1px]'>
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
                  className="bg-transparent px-4 py-4 min-w-[100px] border-[1px] rounded-lg"
                  onPress={handleSortOrderToggle}
               >
                  <Text className="text-gray-700 text-center">{sortOrder === "newest" ? i18n.t('report.optionNew') : i18n.t('report.optionOld')}</Text>
               </TouchableOpacity>
            </View>
            <View className='w-full h-[1px] bg-slate-300' />
         </View>
         <View className='px-4 mb-20'>
            <FlatList
               className='mb-20'
               showsVerticalScrollIndicator={false}
               data={resultsData}
               renderItem={renderItem}
               keyExtractor={(item) => item.id}
               onEndReached={handleLoadMore}
               onEndReachedThreshold={0.1}
               ListFooterComponent={isFetchingMore ? <ActivityIndicator size="large" color="#0000ff" /> : null}
               ListEmptyComponent={
                  <View className="flex items-center justify-center mt-10">
                     <Text className="text-slate-500">{i18n.t('report.emptyReport')}</Text>
                  </View>
               }
            />
         </View>
      </View>
   );
}

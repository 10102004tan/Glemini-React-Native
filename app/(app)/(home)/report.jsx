import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Pressable, ActivityIndicator, FlatList } from "react-native";
import { router } from "expo-router";
import { useResultProvider } from "@/contexts/ResultProvider";
import { AuthContext } from "@/contexts/AuthContext";
import LockFeature from "@/components/customs/LockFeature";
import { Feather, FontAwesome } from "@expo/vector-icons";
import debounce from 'lodash/debounce';
import { SelectList } from "react-native-dropdown-select-list";
import { useClassroomProvider } from "@/contexts/ClassroomProvider";
import Toast from "react-native-toast-message-custom";

export default function ReportScreen() {
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
    const [selectListKey, setSelectListKey] = useState(0);
    const [selectListKey2, setSelectListKey2] = useState(1);
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
        loadResults();
    }, [searchTerm, classFilter, sortOrder, typeFilter])

    const handleLoadMore = async () => {
        if (isFetchingMore || !hasMoreData) return;
        setIsFetchingMore(true);
        const nextPage = page + 1;
        await loadResults(nextPage, true);
        setPage(nextPage);
        setIsFetchingMore(false);
    };

    // Toggle function for sorting order
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
        setSelectListKey2(selectListKey2 + 1);
        setSelectListKey(selectListKey + 1);
        loadResults(1);
    };

    if (teacherStatus === 'pending' || teacherStatus === 'rejected') {
        return <LockFeature />;
    }

    const renderItem = ({ item }) => (
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
                            {item.type === 'room' ? 'Trực tiếp' : 'Bài tập'}
                        </Text>
                    </View>
                    <View className='w-2/3 h-auto flex-row items-center py-5 border-b-[1px] border-slate-300'>
                        <View className='w-4/5'>
                            <Text className="text-slate-500 text-base font-bold">{item.identifier}</Text>
                            <Text className="text-slate-500">{item.class_name || item.description}</Text>
                            <View className="flex-row items-center">
                                <Feather name="users" size={16} color={'gray'} />
                                <Text className='ml-2 text-slate-500'>
                                    {item.results?.length} người tham gia
                                </Text>
                            </View>
                        </View>
                        <View className='w-1/5 flex items-center'>
                            <Text className='bg-red-500/50 text-red-500 px-1 py-2 rounded-md font-bold'>100%</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    );

    return (
        <View className="flex-1 bg-white mb-20">
            <View className="px-4 py-2 shadow-lg">
                <View className="flex-row items-center bg-gray-100 rounded-md mb-4">
                    <TextInput
                        placeholder="Tìm kiếm"
                        value={searchTermMockup}
                        onChangeText={(text) => {
                            setSearchTermMockup(text);
                            handleSearchChange(text);
                        }}
                        className="flex-1 px-4 text-slate-700 border-[1px] rounded-lg py-2"
                    />
                    <TouchableOpacity
                        className=" p-4"
                        onPress={handleResetFilters}
                    >
                        <FontAwesome name="remove" color={'red'} size={25} />
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-between items-center mb-4">
                    <SelectList
                        key={selectListKey}
                        data={classrooms.map((cls) => ({
                            key: cls._id,
                            value: cls.class_name,
                        }))}
                        save="value"
                        setSelected={setClassFilter}
                        placeholder="Lớp"
                        value={classFilter}
                    />
                    <SelectList
                        key={selectListKey2}
                        data={[
                            { key: 'room', value: 'Trực tiếp' },
                            { key: 'exercise', value: 'Bài tập' }
                        ]}
                        setSelected={setTypeFilter}
                        placeholder="Loại"
                        value={typeFilter}
                    />

                    <TouchableOpacity
                        className="bg-transparent border-[1px] px-4 py-[12px] rounded-lg"
                        onPress={handleSortOrderToggle}
                    >
                        <Text className="text-gray-700">{sortOrder === "newest" ? "Mới nhất" : "Cũ nhất"}</Text>
                    </TouchableOpacity>
                </View>
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
                            <Text className="text-slate-500">Không có dữ liệu để hiển thị</Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
}

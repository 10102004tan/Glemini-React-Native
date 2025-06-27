import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import api from '@/libs/axios';
import { API_VERSION, END_POINTS } from '@/configs/api.config';
import { useAuthStore } from '@/store/useAuthStore';
import { FlashList } from '@shopify/flash-list';
import QuizCard from '@/components/customs/QuizCard';
import QuizItemSkeleton from '@/components/customs/QuizItemSkeleton';
import QuizListSkeleton from '@/components/customs/QuizListSkeleton';
import { useQuizStore } from '@/store/useQuizStore';
import { Modalize } from 'react-native-modalize';
import BottomSheet from '@/components/customs/BottomSheet';
import RNPickerSelect from 'react-native-picker-select';
import { useSubjectProvider } from '@/contexts/SubjectProvider';
import { FlatList } from 'react-native-gesture-handler';
import { SelectList } from 'react-native-dropdown-select-list';
import ListSubject from '@/components/customs/ListSubject';

const MapSortOptions = {
  'createdAt-desc': 'Mới nhất',
  'createdAt-asc': 'Cũ nhất',
  'quiz_name-desc': 'Tên A-Z',
  'quiz_name-asc': 'Tên Z-A',
  'quiz_turn-desc': 'Chơi nhiều nhất',
  'quiz_turn-asc': 'Chơi ít nhất',
};
const Search = () => {
  const {
    data: quizzes,
    isLoading: loading,
    isRefetching,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    key,
    setKey,
    fetchQuizRecents,
    quizRecents,
    setIsRefetching,
    filter,
  } = useQuizStore();

  const { keyword, homeSubjectIdSelected } = useLocalSearchParams();
  const { subjects } = useSubjectProvider();
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [currentQuizSelected, setCurrentQuizSelected] = useState(null);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  useEffect(() => {
    filter.subjectIds = homeSubjectIdSelected ? [homeSubjectIdSelected] : [];
    setSelectedSubjects(filter.subjectIds);
    setKey(keyword);
    refetch();
  }, []);

  const handlePressQuizItem = useCallback((quiz) => {
    setIsOpenDetail(true);
    setCurrentQuizSelected(quiz);
  }, []);

  const renderItem = useCallback(({ item }) => {
    return (
      <QuizCard
        onPress={() => handlePressQuizItem(item)}
        quiz_thumb={item.quiz_thumb}
        quiz_name={item.quiz_name}
        quiz_turn={item.quiz_turn}
        createdAt={item.createdAt}
        question_count={item.question_count}
        user_avatar={item.user_avatar}
        user_fullname={item.user_fullname}
      />
    );
  }, []);

  const ListFooterComponent = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View style={{ paddingVertical: 30 }}>
          <ActivityIndicator size={40} color="black" />
        </View>
      );
    }
    return null;
  }, []);

  const ListEmpty = useCallback(() => {
    if ((quizzes.length === 0 && !loading) || (quizzes.length === 0 && !isRefetching)) {
      return (
        <View
          style={{
            paddingTop: 60,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#000',
            }}
          >
            No results found
          </Text>
        </View>
      );
    }
    return (
      <View>
        <QuizListSkeleton />
      </View>
    );
  }, [quizzes.length, loading, isRefetching]);

  const handleRefresh = () => {
    setIsRefetching(true);
    refetch().then(() => {
      setIsRefetching(false);
    });
  };

  const handleOpenFilter = useCallback(() => {
    if (isOpenFilter) {
      return;
    }
    setIsOpenFilter(true);
  });

  const handleApplyFilter = useCallback(() => {
    refetch();
    setIsOpenFilter(false);
  }, [refetch]);

  const handleSelectSubject = useCallback(
    (subjectId) => {
      let newSubjects;
      if (selectedSubjects.includes(subjectId)) {
        newSubjects = selectedSubjects.filter((id) => id !== subjectId);
      } else {
        newSubjects = [...selectedSubjects, subjectId];
      }
      filter.subjectIds = newSubjects;
      setSelectedSubjects(newSubjects);
    },
    [selectedSubjects, filter],
  );

  const StackHeaderRight = useCallback(() => {
    return (
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          marginBottom: 10,
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: '#FFF',
          paddingHorizontal: 15,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#E5E5E5',
        }}
      >
        <TextInput
          onChangeText={(text) => {
            setKey(text);
          }}
          value={key}
          keyboardType="default"
          onBlur={refetch}
          // onSubmitEditing={refetch}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Search"
          style={{
            paddingHorizontal: 5,
            paddingVertical: 10,
            width: 250,
          }}
        />
        {/* icon search */}
        <Feather onPress={handleOpenFilter} name="filter" size={24} color="black" />
      </View>
    );
  }, [key, refetch, handleOpenFilter]);

  const onEndReached = useCallback(() => {
    console.log('onEndReached');
    if (hasNextPage() && !isFetchingNextPage) {
      console.log('fetchNextPage');
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}
    >
      <Stack.Screen
        options={{
          headerTitle: '',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          animation: 'slide_from_bottom',
          headerRight: StackHeaderRight,
        }}
      />

      <FlashList
        data={quizzes}
        renderItem={renderItem}
        onEndReached={onEndReached}
        numColumns={2}
        onEndReachedThreshold={0.1}
        estimatedItemSize={100}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmpty}
        onRefresh={handleRefresh}
        refreshing={isRefetching}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
      />

      {/* modal */}
      <BottomSheet
        visible={isOpenFilter}
        onClose={() => {
          setIsOpenFilter(false);
        }}
        bottomSheetTitle="Bộ lọc"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              paddingBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#E5E5E5',
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 14, marginBottom: 5, fontWeight: 'bold' }}>Chủ đề</Text>
            <ListSubject
              subjects={subjects}
              onSelect={handleSelectSubject}
              selectedSubjects={selectedSubjects}
            />
          </View>

          <View
            style={{
              paddingBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#E5E5E5',
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 14, marginBottom: 5, fontWeight: 'bold' }}>Sắp xếp theo</Text>
            <SelectList
              defaultOption={{
                key: filter.sort || 'createdAt-desc',
                value: MapSortOptions[`${filter.sort}-${filter.order}`] || 'Mới nhất',
              }}
              search={false}
              save={'key'}
              inputStyles={{
                fontSize: 12,
                color: '#000',
                paddingHorizontal: 5,
              }}
              boxStyles={{
                borderWidth: 1,
                borderColor: '#E5E5E5',
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 10,
              }}
              dropdownStyles={{
                borderWidth: 1,
                borderColor: '#E5E5E5',
                borderRadius: 8,
              }}
              dropdownTextStyles={{
                fontSize: 12,
                color: '#000',
              }}
              setSelected={(val) => {
                console.log('Selected sort option:', val);
                const [sort, order] = val.split('-');
                filter.sort = sort;
                filter.order = order;
                console.log('Updated filter:', filter);
              }}
              data={[
                { key: 'createdAt-desc', value: 'Mới nhất' },
                { key: 'createdAt-asc', value: 'Cũ nhất' },
                { key: 'quiz_name-desc', value: 'Tên A-Z' },
                { key: 'quiz_name-asc', value: 'Tên Z-A' },
                { key: 'quiz_turn-desc', value: 'Chơi nhiều nhất' },
                { key: 'quiz_turn-asc', value: 'Chơi ít nhất' },
              ]}
              arrowicon={<AntDesign name="down" size={12} color={'black'} />}
            />
          </View>

          <View>
            <TouchableOpacity
              style={{
                backgroundColor: '#4f46e5',
                borderRadius: 8,
                paddingVertical: 15,
                paddingHorizontal: 20,
                alignItems: 'center',
              }}
              onPress={handleApplyFilter}
            >
              <Text style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 'bold' }}>Áp dụng</Text>
            </TouchableOpacity>

            {/* clear filter */}
            <TouchableOpacity
              style={{
                marginTop: 10,
                backgroundColor: '#f3f3f3',
                borderRadius: 8,
                paddingVertical: 15,
                paddingHorizontal: 20,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#E5E5E5',
                borderRadius: 8,
              }}
              onPress={() => {
                setSelectedSubjects([]);
                filter.subjectIds = [];
                filter.sort = 'createdAt';
                filter.order = 'desc';
                refetch();
                setIsOpenFilter(false);
              }}
            >
              <Text
                style={{ fontSize: 12, color: '#000', fontWeight: 'bold', textAlign: 'center' }}
              >
                Xoá bộ lọc
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </BottomSheet>

      <BottomSheet visible={isOpenDetail} bottomSheetTitle="Chi tiết" onClose={() => setIsOpenDetail(false)}>
        <QuizDetailBottomSheet quiz={currentQuizSelected} />
      </BottomSheet>
    </View>
  );
};

const QuizDetailBottomSheet = ({ quiz }) => {
  if (!quiz) {
    return null;
  }
  return (
    <View>
      <Image
        source={{ uri: quiz.quiz_thumb || 'https://via.placeholder.com/150' }}
        style={{ width: '100%', height: 200, borderRadius: 10, marginBottom: 10 }}
        resizeMode="cover"
      />
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{quiz.quiz_name}</Text>
      <Text style={{ fontSize: 14, color: '#555', marginBottom: 10 }}>{quiz.description ? quiz.description : "Không có thông tin chi tiết"}</Text>
      <Text style={{ fontSize: 14, marginBottom: 5 }}>
        Số câu hỏi: <Text style={{ fontWeight: 'bold' }}>{quiz.question_count}</Text>
      </Text>
      <Text style={{ fontSize: 14, marginBottom: 5 }}>
        Lượt chơi: <Text style={{ fontWeight: 'bold' }}>{quiz.quiz_turn}</Text>
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#4f46e5',
          borderRadius: 8,
          paddingVertical: 10,
          alignItems: 'center',
        }}
        onPress={() => {}}
      >
        <Text style={{ fontSize: 14, color: '#fff', fontWeight: 'bold' }}>
          Làm bài quiz
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Search;

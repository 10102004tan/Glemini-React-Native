import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import MainLayout from '../layouts/MainLayout';
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
const MyLibrary = () => {
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

  const { subjects } = useSubjectProvider();
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [currentQuizSelected, setCurrentQuizSelected] = useState(null);
  const [isOpenDetail, setIsOpenDetail] = useState(false);

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
  const onEndReached = useCallback(() => {
    console.log('onEndReached');
    if (hasNextPage() && !isFetchingNextPage) {
      console.log('fetchNextPage');
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  return (
    <MainLayout>
      <FlashList
        data={quizzes}
        renderItem={renderItem}
        onEndReached={onEndReached}
        numColumns={2}
        onEndReachedThreshold={0.1}
        estimatedItemSize={100}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmpty}
        ListHeaderComponent={() => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
              gap: 10,
            }}
          >
            <TextInput
              value={key}
              onChangeText={(text) => setKey(text)}
              keyboardType="default"
              onBlur={refetch}
              onSubmitEditing={refetch}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Tìm kiếm quiz..."
              style={{
                flex: 1,
                height: 50,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 5,
                backgroundColor: '#fff',
              }}
            />
            <TouchableOpacity
              onPress={handleOpenFilter}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                borderRadius: 5,
                backgroundColor: '#f0f0f0',
              }}
            >
              <Feather name="filter" size={20} color="black" />
              <Text style={{ marginLeft: 5 }}>Bộ lọc</Text>
            </TouchableOpacity>
          </View>
        )}
        onRefresh={handleRefresh}
        refreshing={isRefetching}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
      />
    </MainLayout>
  );
};

export default MyLibrary;

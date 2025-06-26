import { Stack } from 'expo-router';
import { Text, View, TextInput } from 'react-native';
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

const Search = () => {
  const {
    data: quizzes,
    isLoading: loading,
    isRefetching,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useQuizStore();

  useEffect(() => {
    refetch();
  }, []);

  const renderItem = useCallback(({ item }) => {
    return (
      <QuizCard
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

  const renderHeader = useCallback(() => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 15,
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 10,
              marginLeft: 15,
            }}
          >
            Recently searched
          </Text>

          <AntDesign name="delete" size={20} color="black" />
        </View>

        <View
          style={{
            marginBottom: 14,
            flexWrap: 'wrap',
            flexDirection: 'row',
          }}
        >
          {['Community', 'Classroom', 'Teacher', 'Student', 'Game online'].map((item, index) => (
            <Text
              key={index}
              style={{
                fontSize: 14,
                fontWeight: '400',
                marginBottom: 10,
                marginLeft: 15,
                paddingVertical: 5,
                paddingHorizontal: 20,
                backgroundColor: '#fff',
                borderRadius: 20,
                width: 'auto',
                color: '#000',
                borderWidth: 1,
                borderColor: '#E5E5E5',
              }}
            >
              {item}
            </Text>
          ))}
        </View>
      </View>
    );
  }, []);

  const ListFooterComponent = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator size={30} color="black" />
        </View>
      );
    }
    return null;
  }, []);

  const ListEmpty = useCallback(() => {
    if (quizzes.length === 0 && !loading) {
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
      <View
        style={{
          paddingTop: 60,
        }}
      >
        <QuizListSkeleton />
      </View>
    );
  }, []);

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
          headerRight: () => (
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
                placeholder="Search"
                style={{
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                  width: 250,
                }}
              />
              {/* icon search */}
              <Feather name="filter" size={24} color="black" />
            </View>
          ),
        }}
      />

      <FlashList
        data={quizzes}
        renderItem={renderItem}
        onEndReached={onEndReached}
        numColumns={2}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={renderHeader}
        estimatedItemSize={100}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmpty}
        onRefresh={refetch}
        refreshing={isRefetching}
      />
    </View>
  );
};

export default Search;

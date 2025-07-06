import { router, Stack } from 'expo-router';
import { Text, View, TextInput, Touchable, TouchableOpacity } from 'react-native';
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

const SearchRecent = () => {
  const { refetch, fetchQuizRecents, quizRecents, clearQuizRecents } = useQuizStore();
  const [key, setKey] = useState('');

  useEffect(() => {
    fetchQuizRecents();
  }, []);

  const handleRedirectSearch = () => {
    router.push({
      pathname: '/(protected)/search',
      params: {
        keyword: key,
      },
    });
  };

  const handleItemRecentPress = (item) => {
    router.push({
      pathname: '/(protected)/search',
      params: {
        keyword: item,
      },
    });
  };

  const handleClearRecents = async () => {
    try {
      const response = await api.delete('/v2/quizzes/recent-search');
      if (response.data.metadata === 1) {
        clearQuizRecents();
      }
    } catch (error) {
      console.log('Error clearing recent searches:', error);
    }
  };

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
          keyboardType="default"
          onChangeText={(text) => setKey(text)}
          value={key}
          onBlur={handleRedirectSearch}
          // onSubmitEditing={refetch}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Tìm kiếm"
          style={{
            paddingHorizontal: 5,
            paddingVertical: 10,
            width: 300,
          }}
        />
        {/* icon search */}
        {/* <Feather name="filter" size={24} color="black" /> */}
      </View>
    );
  }, [key]);

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
          animation: 'simple_push',
          headerRight: StackHeaderRight,
        }}
      />

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
            Tìm kiếm gần đây
          </Text>

          <AntDesign onPress={handleClearRecents} name="delete" size={20} color="black" />
        </View>

        <View
          style={{
            marginBottom: 14,
            flexWrap: 'wrap',
            flexDirection: 'row',
          }}
        >
          {quizRecents.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleItemRecentPress(item)}>
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
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default SearchRecent;

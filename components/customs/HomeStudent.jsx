import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  RefreshControl,
  TextInput,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Images } from '@/constants';
import { useAppProvider } from '@/contexts/AppProvider';
import { useQuizProvider } from '@/contexts/QuizProvider';
import QuizItem from '@/components/customs/QuizItem';
import QuizModal from '@/components/modals/QuizModal';
import { useResultProvider } from '@/contexts/ResultProvider';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message-custom';
import Lottie from '@/components/loadings/Lottie';
import AntDesign from '@expo/vector-icons/AntDesign';
import NotificationCard from '@/components/customs/NotificationCard';
import AnimatedQuizItem from '@/components/customs/AnimatedQuizItem';
import ScaleTouchable from '@/components/customs/ScaleTouchable';
import MainLayout from '../layouts/MainLayout';
import TestThoBayMau from './TestThoBayMau';
import SearchQuizBar from './SearchQuizBar';
import BannerSkeleton from './BannerSkeleton';
import Banners from './Banners';
import CollectionQuizListSkeleton from './CollectionQuizListSkeleton';
import { API_VERSION, END_POINTS } from '@/configs/api.config';
import api from '@/libs/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { isLoading } from 'expo-font';

const width = Dimensions.get('window').width;

const HomeStudent = () => {
  const { user } = useAuthStore();
  const { i18n } = useAppProvider();
  const { fetchResultData } = useResultProvider();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFetch, setIsFetch] = useState(false);
  const carouselHeight = (width * 2) / 3;

  const { isBannerFetching } =
    useQuizProvider();

  const [filterQuizzes, setFilterQuizzes] = useState([]);
  const [bannerQuizzes, setBannerQuizzes] = useState([]);

  const fetchAllQuizzes = async () => {
    setLoading(true);
    try {
      await Promise.all([getQuizzesPublished(), getQuizzesBanner()]);
    } catch (error) {
      console.error('❌ Lỗi khi fetch dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllQuizzes();
  }, []);



  const getQuizzesPublished = async () => {
    const response = await api.post(`${API_VERSION.V1}${END_POINTS.QUIZ_PUBLISHED}`, {
      user_id: user.user_id,
    });

    const data = response.data;

    if (data.statusCode === 200) {
      setFilterQuizzes(data.metadata);
    } else {
      setFilterQuizzes([]);
    }
    setLoading(false);

  };

  const getQuizzesBanner = async () => {
    const response = await api.post(`${API_VERSION.V1}${END_POINTS.QUIZ_BANNER}`, {
      user_id: user.user_id,
    });
    const data = response.data;
    if (data.statusCode === 200) {
      setBannerQuizzes(data.metadata);
    } else {
      setBannerQuizzes([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllQuizzes();
    setRefreshing(false);
  };


  const handlePressQuizItem = (quiz) => {
    setSelectedQuiz(quiz);
    setModalVisible(true);
  };

  const handleNavigateToQuiz = async () => {
    setModalVisible(false);
    const fetchedResult = await fetchResultData({ quizId: selectedQuiz._id, type: 'publish' });

    if (fetchedResult) {
      Toast.show({
        type: 'info',
        text1: 'Bạn đã chơi bộ câu hỏi này.',
      });
      router.push({
        pathname: '/(home)/activity',
      });
    } else {
      router.push({
        pathname: '(play)/demo',
        params: { quizId: selectedQuiz._id, type: 'publish' },
      });
    }
  };

  const toggleFetch = () => {
    setIsFetch((prev) => !prev);
  };

  return (
    <MainLayout>
      <View style={{ paddingTop: 20 }}>
        <SearchQuizBar />
        <ScrollView
          style={{ borderTopWidth: 1, borderTopColor: '#E5E7EB' }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* Banner Section */}
          <Banners
            onPress={handlePressQuizItem}
            bannerQuizzes={bannerQuizzes}
            isBannerFetching={loading || refreshing}
          />

          {filterQuizzes && filterQuizzes.length > 0 && !loading ? (
            <View className="px-2 mt-4 flex-1">
              {/* Display subjects and their quizzes */}
              {filterQuizzes.map(({ subject, quizzes }) => {
                return (
                  <View key={subject._id} className="mb-4">
                    <View className="flex-row justify-between items-center mb-2 px-1">
                      {/* Tên môn học */}
                      <Text className="text-xl font-bold text-blue-800">
                        {i18n.t(`subjects.${subject.name}`)}
                      </Text>

                      <ScaleTouchable
                        onPress={() => {
                          toggleFetch();
                          router.push({
                            pathname: '/search',
                            params: { homeSubjectIdSelected: subject._id, load: isFetch },
                          });
                        }}
                      >
                        <View className="flex-row items-center bg-blue-100 px-2 py-1 rounded-lg shadow-sm border border-b-2 border-blue-200">
                          <AntDesign name="search1" size={16} color="#2563EB" />
                          <Text className="text-sm font-medium text-blue-600 ml-1">
                            {i18n.t('student_homepage.btnSeeMore')}
                          </Text>
                        </View>
                      </ScaleTouchable>
                    </View>

                    {/* Horizontal ScrollView to display quizzes in rows of two items each */}
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className="w-full"
                    >
                      {quizzes.map((quiz, index) => (
                        <AnimatedQuizItem key={quiz._id} delay={index * 100}>
                          <View className="flex-row px-[6px]">
                            <ScaleTouchable onPress={() => handlePressQuizItem(quiz)}>
                              <View className="w-40">
                                <QuizItem quiz={quiz} />
                              </View>
                            </ScaleTouchable>
                          </View>
                        </AnimatedQuizItem>
                      ))}

                    </ScrollView>
                  </View>
                );
              })}
            </View>
          ) : loading ? (
            <CollectionQuizListSkeleton />
          ) : (
            <Lottie
              source={require('@/assets/jsons/empty.json')}
              width={150}
              height={150}
              text={i18n.t('student_homepage.emptyList')}
            />
          )}
        </ScrollView>

        {/* Quiz Modal */}
        <QuizModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onStartQuiz={handleNavigateToQuiz}
          quiz={selectedQuiz}
        />
      </View>
    </MainLayout>
  );
};

export default HomeStudent;

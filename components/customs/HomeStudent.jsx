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
import NotificationIcon from '@/components/customs/NotificationIcon';
import { AuthContext } from '@/contexts/AuthContext';
import { useResultProvider } from '@/contexts/ResultProvider';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message-custom';
import Lottie from '@/components/loadings/Lottie';
import AntDesign from '@expo/vector-icons/AntDesign';
import NotificationCard from '@/components/customs/NotificationCard';
import MainLayout from '../layouts/MainLayout';
import TestThoBayMau from './TestThoBayMau';
import SearchQuizBar from './SearchQuizBar';
import BannerSkeleton from './BannerSkeleton';
import Banners from './Banners';
import CollectionQuizListSkeleton from './CollectionQuizListSkeleton';

const width = Dimensions.get('window').width;

const HomeStudent = () => {
  const { i18n } = useAppProvider();
  const { fetchResultData } = useResultProvider();
  const { filterQuizzes, getQuizzesPublished, bannerQuizzes, getQuizzesBanner, isBannerFetching } =
    useQuizProvider();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFetch, setIsFetch] = useState(false);
  const carouselHeight = (width * 2) / 3;

  useEffect(() => {
    (async () => {
      setLoading(true);
      getQuizzesPublished().then(() => {
        if (filterQuizzes && filterQuizzes.length > 0) {
          setLoading(false);
        }
      });
      getQuizzesBanner();
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    getQuizzesPublished().then(() => {
      if (filterQuizzes && filterQuizzes.length > 0) {
        setLoading(false);
      }
      setRefreshing(false);
    });
    getQuizzesBanner();
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
      <View
        style={{
          //className='flex-1 pt-10'
          flex: 1,
          paddingTop: 30,
        }}
      >
        <SearchQuizBar />
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* Banner Section */}
          <Banners
            onPress={handlePressQuizItem}
            bannerQuizzes={bannerQuizzes}
            isBannerFetching={isBannerFetching}
          />

          {filterQuizzes && filterQuizzes.length > 0 && !loading ? (
            <View className="px-4 mt-4 flex-1">
              {/* Display subjects and their quizzes */}
              {filterQuizzes.map(({ subject, quizzes }) => {
                return (
                  <View key={subject._id} className="mb-4">
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-xl font-bold">
                        {i18n.t(`subjects.${subject.name}`)}
                      </Text>

                      <TouchableOpacity
                        className={'flex-row items-center rounded gap-1'}
                        onPress={() => {
                          toggleFetch();
                          router.push({
                            pathname: '/search',
                            params: { homeSubjectIdSelected: subject._id, load: isFetch },
                          });
                        }}
                      >
                        <AntDesign name={'search1'} size={20} color={'black'} />
                        <Text className="text-base">{i18n.t('student_homepage.btnSeeMore')}</Text>
                      </TouchableOpacity>
                    </View>
                    {/* Horizontal ScrollView to display quizzes in rows of two items each */}
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className="w-full"
                    >
                      {quizzes.map((quiz) => (
                        <View key={quiz._id} className="flex-row px-[6px]">
                          <TouchableOpacity
                            onPress={() => handlePressQuizItem(quiz)}
                            className="flex-1 w-40"
                          >
                            <QuizItem quiz={quiz} />
                          </TouchableOpacity>
                        </View>
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

import { View, Text, Image, TouchableOpacity, ScrollView, FlatList, Dimensions, RefreshControl } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Wrapper from '../../components/customs/Wrapper';
import AntDesign from '@expo/vector-icons/AntDesign';
import PressAction from '../../components/customs/PressAction';
import Ionicons from '@expo/vector-icons/Ionicons';
import BottomSheet from '../../components/customs/BottomSheet';
import { useAppProvider } from '../../contexts/AppProvider';
import { useRouter } from 'expo-router';
import Overlay from '../../components/customs/Overlay';
import LockFeature from '@/components/customs/LockFeature';
import { AuthContext, useAuthContext } from '@/contexts/AuthContext';
import QuizzCreateAction from '../../components/customs/QuizCreateAction';
import { useQuizProvider } from '@/contexts/QuizProvider';
import NotificationIcon from "@/components/customs/NotificationIcon";
import socket from '@/utils/socket';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import Lottie from '@/components/loadings/Lottie';
import Carousel from 'react-native-reanimated-carousel';
import CardQuiz from '@/components/customs/CardQuiz';
import CardRoomItem from '@/components/customs/CardRoomItem';
import QuizCardSkeleton from '@/components/loadings/QuizCardSkeleton';
import { I18n } from 'i18n-js';


const TeacherHomeScreen = () => {
   const { teacherStatus, userData: { user_fullname, user_avatar, user_email, _id, accessToken }, numberOfUnreadNoti } = useContext(AuthContext);
   const { setIsHiddenNavigationBar } = useAppProvider();
   const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
   const { setActionQuizType } = useQuizProvider();
   const router = useRouter();
   const [recentCreatedRooms, setRecentCreatedRooms] = useState([]);
   const [isFetching, setIsFetching] = useState(true);
   const { userData } = useAuthContext();
   const [users, setUsers] = useState([]);
   const width = Dimensions.get('window').width;
   const carouselHeight = width * 2 / 3;
   const [newQuizzes, setNewQuizzes] = useState([]);
   const [refreshing, setRefreshing] = useState(false);
   const { i18n } = useAppProvider();

   const onRefresh = () => {
      setRefreshing(true);
      fetchRecentCreatedRooms();
      fetchNewQuizzes();
      setRefreshing(false);
   }

   const fetchNewQuizzes = async () => {
      try {
         const fetchNewQuizzes = async () => {
            const response = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.GET_NEWEST_QUIZZES}`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'x-client-id': _id,
                  authorization: accessToken,
               },
               body: JSON.stringify({
                  user_id: _id,
               }),
            })

            const data = await response.json();
            console.log(data)
            if (data.statusCode === 200) {
               setNewQuizzes(data.metadata);
            }
         }

         if (userData) {
            fetchNewQuizzes();
         }
      } catch (error) {
         console.log(error)
      } finally {
         // setIsFetching(false);
      }
   }


   const fetchRecentCreatedRooms = async () => {
      try {
         // setIsFetching(true);
         const response = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_LIST}`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-client-id': _id,
               authorization: accessToken,
            },
            body: JSON.stringify({
               user_created_id: _id,
            }),
         });
         const data = await response.json();
         if (data.statusCode === 200) {
            setRecentCreatedRooms(data.metadata);
         } else {
            alert('Lỗi khi lấy danh sách phòng chơi');
         }
      } catch (error) {
         console.log(error)
      } finally {
         // setIsFetching(false);
      }
   }

   useEffect(() => {
      if (userData) {
         setIsFetching(true);
         fetchRecentCreatedRooms();
         fetchNewQuizzes();
         setIsFetching(false);
      }
   }, [userData])


   const handleCreateQuiz = () => {
      setIsHiddenNavigationBar(true);
      setVisibleBottomSheet(true);
   };

   const handleCloseBottomSheet = () => {
      setIsHiddenNavigationBar(false);
      setVisibleBottomSheet(false);
   };

   useEffect(() => {
      socket.on('joinRoom', (data) => {
         console.log(data)
         // alert('Join room success');
         setUsers([...data]);
      });
   }, [])


   if (teacherStatus === 'pedding' || teacherStatus === 'rejected') {
      return <LockFeature />;
   }

   return (
      <Wrapper>
         {/* Overlay */}
         {
            <Overlay
               onPress={handleCloseBottomSheet}
               visible={visibleBottomSheet}
            />
         }

         {/* Bottom Sheet */}
         <BottomSheet
            visible={visibleBottomSheet}
            onClose={handleCloseBottomSheet}
         >
            <View className="flex flex-col items-start justify-start">
               <Text className="text-lg">{i18n.t('teacher_homepage.createQuizWithAi')}</Text>
               <View className="flex items-center justify-start flex-row mt-4">
                  <QuizzCreateAction
                     handlePress={() => {
                        setActionQuizType('ai/prompt');
                        handleCloseBottomSheet();
                        router.push('/(app)/(quiz)/create_title');
                     }}
                     otherStyles="ml-2"
                     title={i18n.t('teacher_homepage.createFromText')}
                     icon={
                        <Ionicons
                           name="text-outline"
                           size={24}
                           color="black"
                        />
                     }
                  />
               </View>
               <Text className="text-lg mt-8">{i18n.t('teacher_homepage.createWithHand')}</Text>
               <View className="flex items-center justify-start flex-row mt-4">
                  <QuizzCreateAction
                     handlePress={() => {
                        setActionQuizType('template');
                        handleCloseBottomSheet();
                        router.push('/(app)/(quiz)/create_title');
                     }}
                     title={i18n.t('teacher_homepage.uploadTemplate')}
                     icon={
                        <Ionicons
                           name="documents-outline"
                           size={24}
                           color="black"
                        />
                     }
                  />
                  <QuizzCreateAction
                     handlePress={() => {
                        setActionQuizType('create');
                        handleCloseBottomSheet();
                        router.push('(app)/(quiz)/create_title');
                     }}
                     otherStyles="ml-2"
                     title={i18n.t('teacher_homepage.createWithHand')}
                     icon={
                        <Ionicons
                           name="hand-left-outline"
                           size={24}
                           color="black"
                        />
                     }
                  />
               </View>
            </View>
         </BottomSheet>

         <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
         >
            <ScrollView
               showsHorizontalScrollIndicator={false}
               showsVerticalScrollIndicator={false}
            >
               {/* Header */}
               <View className="px-4 py-6 bg-primary rounded-b-3xl pt-[40px]">
                  {/* Teacher Info */}
                  <View className={"flex flex-row justify-between"}>
                     <View className="flex flex-row items-center justify-start mb-3">
                        <Image
                           className={'w-[50px] h-[50px] rounded-full'}
                           src={user_avatar}
                        />
                        <View className="ml-3 max-w-[330px]">
                           <Text className="text-lg font-pmedium text-white">
                              {user_fullname}
                           </Text>
                           <Text className="text-white">{user_email}</Text>
                        </View>
                     </View>
                     <NotificationIcon numberOfUnreadNoti={numberOfUnreadNoti} />
                  </View>

                  {/* <View className="w-full h-[1px] rounded-xl mt-3 bg-white"></View> */}

                  {/* Actions */}
                  <View className="flex flex-row items-center justify-between mt-6">
                     <PressAction
                        onPress={handleCreateQuiz}
                        title={i18n.t('teacher_homepage.createQuizButtonTitle')}
                        icon={<AntDesign name="plus" size={24} color="black" />}
                     />
                     <PressAction
                        onPress={() => {
                           router.push('/(app)/(home)/libraly');
                        }}
                        title={i18n.t('teacher_homepage.myLibraryButtonTitle')}
                        icon={
                           <Ionicons
                              name="library-outline"
                              size={24}
                              color="black"
                           />
                        }
                     />
                     <PressAction
                        onPress={() => {
                           router.push('/(app)/(home)/report');
                        }}
                        title={i18n.t('teacher_homepage.reportButtonTitle')}
                        icon={
                           <Ionicons
                              name="analytics-outline"
                              size={24}
                              color="black"
                           />
                        }
                     />
                  </View>
               </View>
               {/* Recent created quizzes */}
               <View className="">
                  <View className="flex flex-row items-center justify-between px-4 mt-4">
                     <Text className="text-lg font-semibold">{i18n.t('teacher_homepage.createdRecentQuizzes')}</Text>
                     <TouchableOpacity onPress={() => router.push('/(app)/(home)/libraly')}>
                        <Text className="text-blue-600">{i18n.t('teacher_homepage.viewAll')}</Text>
                     </TouchableOpacity>
                  </View>
                  <View className={`h-[${carouselHeight}px]`}>
                     {
                        newQuizzes.length > 0 ? <>
                           <Carousel
                              loop
                              width={width}
                              height={carouselHeight}
                              autoPlay={false}
                              data={newQuizzes}
                              mode='parallax'
                              scrollAnimationDuration={2000}
                              renderItem={({ item }) => (
                                 <CardQuiz showCheck={false} quiz={item} type='vertical' routerPath='/(app)/(quiz)/overview' params={{ id: item._id }} />
                              )}
                           />
                        </>
                           : <>
                              {isFetching ? <Carousel
                                 loop
                                 width={width}
                                 height={carouselHeight}
                                 autoPlay={false}
                                 data={[1, 2, 3]}
                                 mode='parallax'
                                 scrollAnimationDuration={2000}
                                 renderItem={({ item }) => (
                                    <QuizCardSkeleton />
                                 )}
                              /> : <View className="w-full h-[400px] flex items-center justify-center">
                                 <Lottie
                                    source={require('@/assets/jsons/empty.json')}
                                    width={250}
                                    height={250}
                                    text={i18n.t('teacher_homepage.noTestsCreated')}
                                 />
                              </View>}
                           </>
                     }
                  </View>
               </View>
               {/* Recent created room */}
               <View className={`mb-[100px]`}>
                  <View className="flex flex-row items-center justify-between px-4 mt-4">
                     <Text className="text-lg font-semibold">{i18n.t('teacher_homepage.createdRecentRooms')}</Text>
                     <TouchableOpacity onPress={() => router.push('/(app)/(room)/list')}>
                        <Text className="text-blue-600">{i18n.t('teacher_homepage.viewAll')}</Text>
                     </TouchableOpacity>
                  </View>
                  <View className={`h-[${carouselHeight}px]`}>
                     {
                        recentCreatedRooms.length > 0 ? <>
                           <Carousel
                              loop
                              width={width}
                              height={carouselHeight}
                              autoPlay={false}
                              data={recentCreatedRooms}
                              mode='parallax'
                              scrollAnimationDuration={2000}
                              renderItem={({ item }) => (
                                 <CardRoomItem room={item} />
                              )}
                           />
                        </>
                           : <>
                              {isFetching ? <Carousel
                                 loop
                                 width={width}
                                 height={carouselHeight}
                                 autoPlay={false}
                                 data={[1, 2, 3]}
                                 mode='parallax'
                                 scrollAnimationDuration={2000}
                                 renderItem={({ item }) => (
                                    <CardRoomItem room={item} />
                                 )}
                              /> : <View className="w-full h-[400px] flex items-center justify-center">
                                 <Lottie
                                    source={require('@/assets/jsons/empty.json')}
                                    width={250}
                                    height={250}
                                    text={i18n.t('teacher_homepage.noRoomsCreated')}
                                 />
                              </View>}
                           </>
                     }
                  </View>
               </View>
            </ScrollView>
         </RefreshControl>
      </Wrapper >
   );
};

export default TeacherHomeScreen;

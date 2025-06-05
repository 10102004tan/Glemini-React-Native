import MainLayout from '@/components/layouts/MainLayout';
import { useAuthStore } from '@/store/useAuthStore';
import HomeStudent from '@/components/customs/HomeStudent';
import HomeTeacher from '@/components/customs/HomeTeacher';
import { Image, Pressable, Text, View, Animated, Easing, TextInput } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { useState, useRef, useEffect } from 'react';
import ThoBayMauGif from '@/assets/images/congratulations.1.webp';
import InCorrectGif from '@/assets/images/incorrect.1.webp';
import api from '@/libs/axios';
import OrderInput from '@/components/customs/OrderInput';
import Onechoice from '@/components/customs/Onechoice';
import FillInTheBlank from '@/components/customs/FillInTheBlank';
import MatchItems from '@/components/customs/MatchItems';
import MultipleChoice from '@/components/customs/MultipleChoice';
import { Feather } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useStore } from 'zustand';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import Toast from 'react-native-toast-message';
import { Link, router } from 'expo-router';

export default function Home() {
  const { user } = useAuthStore();
  const data = [
    {
      id: 1,
      name: 'THPT Nguyễn Huệ',
      image: 'https://i.imgur.com/1z5Z5zF.png',
      description:
        'Trường THPT Nguyễn Huệ là một trong những trường trung học phổ thông hàng đầu tại Việt Nam, nổi tiếng với chất lượng giáo dục và đội ngũ giảng viên xuất sắc.',
      address: '123 Đường Nguyễn Huệ, Quận 1, TP.HCM',
      phone: '0123456789',
    },
    {
      id: 2,
      name: 'THPT Lê Quý Đôn',
      image: 'https://i.imgur.com/1z5Z5zF.png',
      description:
        'Trường THPT Lê Quý Đôn là một trong những trường trung học phổ thông hàng đầu tại Việt Nam, nổi tiếng với chất lượng giáo dục và đội ngũ giảng viên xuất sắc.',
      address: '456 Đường Lê Quý Đôn, Quận 3, TP.HCM',
      phone: '0987654321',
    },
    {
      id: 3,
      name: 'THPT Trần Phú',
      image: 'https://i.imgur.com/1z5Z5zF.png',
      description:
        'Trường THPT Trần Phú là một trong những trường trung học phổ thông hàng đầu tại Việt Nam, nổi tiếng với chất lượng giáo dục và đội ngũ giảng viên xuất sắc.',
      address: '789 Đường Trần Phú, Quận 5, TP.HCM',
      phone: '0123456789',
    },
    {
      id: 4,
      name: 'THPT Nguyễn Thị Minh Khai',
      image: 'https://i.imgur.com/1z5Z5zF.png',
      description:
        'Trường THPT Nguyễn Thị Minh Khai là một trong những trường trung học phổ thông hàng đầu tại Việt Nam, nổi tiếng với chất lượng giáo dục và đội ngũ giảng viên xuất sắc.',
      address: '321 Đường Nguyễn Thị Minh Khai, Quận 7, TP.HCM',
      phone: '0987654321',
    },
    {
      id: 5,
      name: 'THPT Võ Thị Sáu',
      image: 'https://i.imgur.com/1z5Z5zF.png',
      description:
        'Trường THPT Võ Thị Sáu là một trong những trường trung học phổ thông hàng đầu tại Việt Nam, nổi tiếng với chất lượng giáo dục và đội ngũ giảng viên xuất sắc.',
      address: '654 Đường Võ Thị Sáu, Quận 9, TP.HCM',
      phone: '0123456789',
    },
    {
      id: 6,
      name: 'THPT Nguyễn Trãi',
      image: 'https://i.imgur.com/1z5Z5zF.png',
      description:
        'Trường THPT Nguyễn Trãi là một trong những trường trung học phổ thông hàng đầu tại Việt Nam, nổi tiếng với chất lượng giáo dục và đội ngũ giảng viên xuất sắc.',
      address: '987 Đường Nguyễn Trãi, Quận 11, TP.HCM',
      phone: '0987654321',
    },
    {
      id: 7,
      name: 'THPT Phan Đình Phùng',
      image: 'https://i.imgur.com/1z5Z5zF.png',
      description:
        'Trường THPT Phan Đình Phùng là một trong những trường trung học phổ thông hàng đầu tại Việt Nam, nổi tiếng với chất lượng giáo dục và đội ngũ giảng viên xuất sắc.',
      address: '159 Đường Phan Đình Phùng, Quận 12, TP.HCM',
      phone: '0123456789',
    },
    {
      id: 8,
      name: 'THPT Nguyễn Huệ',
      image: 'https://i.imgur.com/1z5Z5zF.png',
      description:
        'Trường THPT Nguyễn Huệ là một trong những trường trung học phổ thông hàng đầu tại Việt Nam, nổi tiếng với chất lượng giáo dục và đội ngũ giảng viên xuất sắc.',
      address: '123 Đường Nguyễn Huệ, Quận 1, TP.HCM',
      phone: '0123456789',
    },
    {
      id: 9,
      name: 'THPT Lê Quý Đôn',
      image: 'https://i.imgur.com/1z5Z5zF.png',
      description:
        'Trường THPT Lê Quý Đôn là một trong những trường trung học phổ thông hàng đầu tại Việt Nam, nổi tiếng với chất lượng giáo dục và đội ngũ giảng viên xuất sắc.',
      address: '456 Đường Lê Quý Đôn, Quận 3, TP.HCM',
      phone: '0987654321',
    },
    {
      id: 10,
      name: 'THPT Trần Phú',
      image: 'https://i.imgur.com/1z5Z5zF.png',
      description:
        'Trường THPT Trần Phú là một trong những trường trung học phổ thông hàng đầu tại Việt Nam, nổi tiếng với chất lượng giáo dục và đội ngũ giảng viên xuất sắc.',
      address: '789 Đường Trần Phú, Quận 5, TP.HCM',
      phone: '0123456789',
    },
  ];
  return (
    <>
      {user.user_role === 'user' ? <HomeStudent /> : <HomeTeacher />}
      {/* <School/> */}
      {/* <Profile/> */}
    </>
  );
}

const Play = () => {
  // Animation values
  const questionAnim = useRef(new Animated.Value(0)).current;
  const optionsAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;
  const [data, setData] = useState([]);

  // const data = [
  //   {
  //     id: 1,
  //     question: 'What is the capital of France?',
  //     options: [
  //       {
  //         id: 1,
  //         text: 'Paris',
  //         image:
  //           'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS77FladSUDfZrsWEf9Vf1RSh752wuXXE52ig&s',
  //       },
  //       {
  //         id: 2,
  //         text: 'London',
  //         image:
  //           'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS77FladSUDfZrsWEf9Vf1RSh752wuXXE52ig&s',
  //       },
  //       {
  //         id: 3,
  //         text: 'Berlin',
  //         image:
  //           'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS77FladSUDfZrsWEf9Vf1RSh752wuXXE52ig&s',
  //       },
  //       {
  //         id: 4,
  //         text: 'Madrid',
  //         image:
  //           'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS77FladSUDfZrsWEf9Vf1RSh752wuXXE52ig&s',
  //       },
  //     ],
  //     type: 'single',
  //   },
  //   {
  //     id: 2,
  //     question: 'The capital of France is ___ and it is known for the ___ Tower.',
  //     // đục lỗ
  //     type: 'fill',
  //     image:
  //       'https://cdn3d.iconscout.com/3d/free/preview/free-duolingo-3d-icon-download-in-png-blend-fbx-gltf-file-formats--logo-brand-social-media-and-pack-logos-icons-9940806.png?f=webp&h=700',
  //     options: [
  //       {
  //         id: 1,
  //         position: 1,
  //         text: 'Paris',
  //       },
  //       {
  //         id: 2,
  //         position: 2,
  //         text: 'Eiffel',
  //       },
  //       {
  //         id: 3,
  //         position: 3,
  //         text: 'Tower',
  //       },
  //       {
  //         id: 4,
  //         position: 4,
  //         text: 'France',
  //       },
  //     ],
  //   },
  //   // xắp xếp theo thứ tự
  //   {
  //     id: 3,
  //     question: 'Arrange the planets in order of their distance from the sun.',
  //     type: 'order',
  //     options: [
  //       {
  //         id: 1,
  //         text: 'Mercury',
  //       },
  //       {
  //         id: 2,
  //         text: 'Venus',
  //       },
  //       {
  //         id: 3,
  //         text: 'Earth',
  //       },
  //       {
  //         id: 4,
  //         text: 'Mars',
  //       },
  //       {
  //         id: 5,
  //         text: 'Jupiter',
  //       },
  //       {
  //         id: 6,
  //         text: 'Saturn',
  //       },
  //       {
  //         id: 7,
  //         text: 'Uranus',
  //       },
  //       {
  //         id: 8,
  //         text: 'Neptune',
  //       },
  //     ],
  //   },
  //   {
  //     id: 4,
  //     question: 'Match the following countries with their capitals.',
  //     type: 'match',
  //     options: [
  //       {
  //         id: 1,
  //         items: [
  //           {
  //             text: 'France',
  //           },
  //           {
  //             text: 'Paris',
  //           },
  //           {
  //             text: 'Germany',
  //           },
  //           {
  //             text: 'Berlin',
  //           },
  //           {
  //             text: 'Spain',
  //           },
  //           {
  //             text: 'Madrid',
  //           },
  //         ],
  //       },
  //       {
  //         id: 2,
  //         items: [
  //           {
  //             text: 'Italy',
  //           },
  //           {
  //             text: 'Rome',
  //           },
  //           {
  //             text: 'Japan',
  //           },
  //           {
  //             text: 'Tokyo',
  //           },
  //           {
  //             text: 'USA',
  //           },
  //           {
  //             text: 'Washington D.C.',
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     id: 1,
  //     question: 'What is the capital of France?',
  //     options: [
  //       {
  //         id: 1,
  //         text: 'Paris',
  //         image:
  //           'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS77FladSUDfZrsWEf9Vf1RSh752wuXXE52ig&s',
  //       },
  //       {
  //         id: 2,
  //         text: 'London',
  //         image:
  //           'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS77FladSUDfZrsWEf9Vf1RSh752wuXXE52ig&s',
  //       },
  //       {
  //         id: 3,
  //         text: 'Berlin',
  //         image:
  //           'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS77FladSUDfZrsWEf9Vf1RSh752wuXXE52ig&s',
  //       },
  //     ],
  //     type: 'single',
  //   },
  // ];

  const [index, setIndex] = useState(0);
  const [isNext, setIsNext] = useState(false);
  const item = data[index];
  const [isCorrect, setIsCorrect] = useState(false);

  // Animate in on question change
  useEffect(() => {
    questionAnim.setValue(0);
    optionsAnim.setValue(0);
    buttonAnim.setValue(0);
    Animated.timing(questionAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
    Animated.timing(optionsAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
    Animated.spring(buttonAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
    }).start();
  }, [index]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.post('/v2/quizzes/683e465299f227ed48405984/questions');
        const data = response.data;
        const { items } = data.metadata;
        console.log('Fetched data:', items);
        setData(items);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Animate modal result
  useEffect(() => {
    if (isNext) {
      modalAnim.setValue(0);
      Animated.timing(modalAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();
    }
  }, [isNext]);

  const handleClickOption = (option) => {
    // handle click option
    console.log('Option clicked: ', option);
    // setIsNext(true);
  };

  const renderOptions = () => {
    const { options, type, image = '', question } = item;
    switch (type) {
      case 'single':
        return (
          <View
            style={{
              flexWrap: 'wrap',
              gap: 10,
              justifyContent: 'center',
              alignItems: 'center',
              height: 600,
            }}
          >
            <Onechoice options={options} onClick={handleClickOption} image={image} />
          </View>
        );
      case 'multiple':
        return (
          <View
            style={{
              flexWrap: 'wrap',
              gap: 10,
              justifyContent: 'center',
              alignItems: 'center',
              height: 600,
            }}
          >
            <MultipleChoice options={options} onClick={handleClickOption} image={image} />
          </View>
        );
      case 'fill':
        return (
          <FillInTheBlank
            options={options}
            onClick={handleClickOption}
            image={image}
            question={question}
          />
        );
      case 'order':
        return <OrderInput options={options} onClick={handleClickOption} />;
      case 'match':
        return <MatchItems options={options} onClick={handleClickOption} />;
      default:
        return null;
    }
  };

  const handleCheck = async () => {
    setIsNext(true);
    try {
      const body = {
        questionId: item.id,
        answersId: ['683e45e599f227ed48405981'],
      };
      const response = await api.post('/v2/questions/check', body);
      const data = response.data;
      const { isCorrect = true } = data.metadata;
      setIsCorrect(isCorrect);
    } catch (error) {
      console.error('Error checking answer:', error);
    }
  };

  const handleNext = () => {
    if (index < data.length - 1) {
      setIndex(index + 1);
    } else {
      alert('Game Over');
      setIndex(0);
    }
    setIsNext(false);
  };

  if (!data.length) {
    return (
      <MainLayout>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <>
      <MainLayout>
        {/* header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          {/* exit icon */}
          <AntDesign name="close" size={24} color="black" />

          {/* bars process */}
          <View
            style={{
              padding: 10,
              backgroundColor: '#f0f0f0',
              borderRadius: 10,
              flex: 1,
              position: 'relative',
              height: 20,
              overflow: 'hidden',
              zIndex: 0,
            }}
          >
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '50%',
                height: '100%',
                backgroundColor: '#000',
                zIndex: 999,
              }}
            ></View>
          </View>
        </View>
        {/* content game */}
        <View>
          {!isNext ? (
            <View key={index} style={{ marginBottom: 20 }}>
              <Animated.Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  opacity: questionAnim,
                  transform: [
                    {
                      translateX: questionAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-40, 0],
                      }),
                    },
                  ],
                }}
              >
                {item.type === 'fill' ? 'Fill in the blank ' : item.question}
              </Animated.Text>
              <Animated.View
                style={{
                  opacity: optionsAnim,
                  transform: [
                    {
                      scale: optionsAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1],
                      }),
                    },
                  ],
                }}
              >
                {renderOptions()}
              </Animated.View>
            </View>
          ) : (
            <Animated.View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
                marginBottom: 20,
                flexDirection: 'row',
                opacity: modalAnim,
                transform: [
                  {
                    translateY: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }),
                  },
                  { scale: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
                ],
              }}
            >
              <Image
                source={isCorrect ? ThoBayMauGif : InCorrectGif}
                resizeMode="contain"
                style={{ width: 150, height: 150, borderRadius: 8, marginBottom: 10 }}
              />
              <View
                style={{
                  width: 200,
                  minHeight: 60,
                  borderColor: '#eee',
                  borderWidth: 2,
                  padding: 10,
                  borderStyle: 'solid',
                  borderRadius: 8,
                }}
              >
                <Text>
                  {isCorrect
                    ? 'Congratulations! You answered correctly.'
                    : 'Sorry, your answer is incorrect. Please try again.'}
                </Text>
              </View>
            </Animated.View>
          )}
          {/* button confirm */}
          {!isNext && (
            <Animated.View
              style={{
                opacity: buttonAnim,
                transform: [
                  {
                    translateY: buttonAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                  { scale: buttonAnim },
                ],
              }}
            >
              <Pressable onPress={handleCheck}>
                <Text
                  style={{
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    padding: 10,
                    borderRadius: 8,
                    textAlign: 'center',
                    fontSize: 18,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    borderTopWidth: 2,
                    borderColor: '#eee',
                    borderBottomWidth: 4,
                    borderStyle: 'solid',
                    shadowColor: '#000',
                  }}
                >
                  Confirm
                </Text>
              </Pressable>
            </Animated.View>
          )}
        </View>
      </MainLayout>
      {/* modal result */}
      {isNext &&
        (isCorrect ? (
          <Animated.View
            style={{
              position: 'absolute',
              zIndex: 1000,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#d7ffb8',
              justifyContent: 'center',
              padding: 20,
              transform: [
                {
                  translateY: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }),
                },
              ],
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#4CAF50',
                // color: isCorrect ? '#4CAF50' : '#F44336',
                marginBottom: 20,
              }}
            >
              Correct!
            </Text>
            <Pressable onPress={handleNext}>
              <Text
                style={{
                  backgroundColor: '#4CAF50',
                  // backgroundColor: isCorrect ? '#4CAF50' : '#F44336',
                  color: '#fff',
                  padding: 10,
                  borderRadius: 8,
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  borderTopWidth: 2,
                  borderColor: '#eee',
                  borderBottomWidth: 4,
                  borderStyle: 'solid',
                  shadowColor: '#000',
                }}
              >
                Confirm
              </Text>
            </Pressable>
          </Animated.View>
        ) : (
          <Animated.View
            style={{
              position: 'absolute',
              zIndex: 1000,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#FFCDD2',
              justifyContent: 'center',
              padding: 20,
              transform: [
                {
                  translateY: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }),
                },
              ],
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#F44336',
                marginBottom: 20,
              }}
            >
              Incorrect!
            </Text>
            <Pressable onPress={handleNext}>
              <Text
                style={{
                  backgroundColor: '#F44336',
                  // backgroundColor: isCorrect ? '#4CAF50' : '#F44336',
                  color: '#fff',
                  padding: 10,
                  borderRadius: 8,
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  borderTopWidth: 2,
                  borderColor: '#eee',
                  borderBottomWidth: 4,
                  borderStyle: 'solid',
                  shadowColor: '#000',
                }}
              >
                Confirm
              </Text>
            </Pressable>
          </Animated.View>
        ))}
    </>
  );
};



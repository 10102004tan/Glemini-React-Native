import MainLayout from '@/components/layouts/MainLayout';
import { useAuthStore } from '@/store/useAuthStore';
import HomeStudent from '@/components/customs/HomeStudent';
import HomeTeacher from '@/components/customs/HomeTeacher';
import { Image, Pressable, Text, View, Animated, Easing } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { useState, useRef, useEffect } from 'react';
import ThoBayMauGif from '@/assets/images/congratulations.1.webp';
import InCorrectGif from '@/assets/images/incorrect.1.webp';
import api from '@/libs/axios';

export default function Home() {
  const { user } = useAuthStore();
  return (
    <>
      {/* {user.user_role === 'user' ? <HomeStudent /> : <HomeTeacher />} */}
      <Play /> 
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
      const response = await api.post("/v2/quizzes/683e465299f227ed48405984/questions")
      const data = response.data;
      const {items} = data.metadata;
      console.log('Fetched data:', items);
      setData(items);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
   }
    fetchData();
  },[]);

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

  const renderOptions = (options, type, image) => {
    switch (type) {
      case 'single':
        return (
          <View
            style={{
              height: 600,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                flexDirection: options.length < 4 ? 'column' : 'row',
                flexWrap: options.length < 4 ? 'nowrap' : 'wrap',
                width: '100%',
                gap: 10,
              }}
            >
              {options.map((option, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => handleClickOption(option)}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    marginVertical: 5,
                    backgroundColor: '#fff',
                    shadowColor: '#000',
                    borderColor: '#e5e5e5',
                    borderWidth: 2,
                    borderBottomWidth: 4,
                    borderStyle: 'solid',
                    width: options.length < 4 ? '100%' : '48%',
                    minHeight: options.length < 4 ? 60 : 200,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {option.image && options.length === 4 ? (
                    <View
                      style={{
                        minHeight: options.length < 4 ? 60 : 200,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Image
                        source={{ uri: option.image }}
                        style={{
                          width: 150,
                          height: 150,
                          borderRadius: 8,
                          marginBottom: 10,
                        }}
                      />
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 18,
                          color: '#4B4B4B',
                        }}
                      >
                        {option.text}
                      </Text>
                    </View>
                  ) : (
                    <Pressable onPress={() => handleClickOption(option)}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 18,
                          color: '#4B4B4B',
                        }}
                      >
                        {option.text}
                      </Text>
                    </Pressable>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        );
      case "multiple":
        return (
           <View
            style={{
              height: 600,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                flexDirection: options.length < 4 ? 'column' : 'row',
                flexWrap: options.length < 4 ? 'nowrap' : 'wrap',
                width: '100%',
                gap: 10,
              }}
            >
              {options.map((option, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => handleClickOption(option)}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    marginVertical: 5,
                    backgroundColor: '#fff',
                    shadowColor: '#000',
                    borderColor: '#e5e5e5',
                    borderWidth: 2,
                    borderBottomWidth: 4,
                    borderStyle: 'solid',
                    width: options.length < 4 ? '100%' : '48%',
                    minHeight: options.length < 4 ? 60 : 200,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {option.image && options.length === 4 ? (
                    <View
                      style={{
                        minHeight: options.length < 4 ? 60 : 200,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Image
                        source={{ uri: option.image }}
                        style={{
                          width: 150,
                          height: 150,
                          borderRadius: 8,
                          marginBottom: 10,
                        }}
                      />
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 18,
                          color: '#4B4B4B',
                        }}
                      >
                        {option.text}
                      </Text>
                    </View>
                  ) : (
                    <Pressable onPress={() => handleClickOption(option)}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 18,
                          color: '#4B4B4B',
                        }}
                      >
                        {option.text}
                      </Text>
                    </Pressable>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        )
        case 'fill':
        return (
          <View style={{}}>
            {/* image */}
            {image && (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <Image
                  source={{ uri: image }}
                  style={{ width: 150, height: 150, borderRadius: 8, marginBottom: 10 }}
                />
              </View>
            )}
            {/* fill in the blank */}
            {/* question */}
            <Text
              style={{
                fontSize: 18,
                color: '#4B4B4B',
                marginBottom: 10,
              }}
            >
              The capital of France is ___ and it is known for the ___ Tower.
            </Text>

            {/* list fill */}
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {options.map((option, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => handleClickOption(option)}
                  style={{
                    padding: 8,
                    borderRadius: 15,
                    backgroundColor: '#fff',
                    shadowColor: '#000',
                    borderColor: '#e5e5e5',
                    borderWidth: 2,
                    borderBottomWidth: 4,
                    borderStyle: 'solid',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 16,
                      color: '#4B4B4B',
                    }}
                  >
                    {option.text}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        );
      case 'order':
        return (
          <View>
            {/* order input */}
            <View
              style={{
                minHeight: 60,
                flexDirection: 'row',
                borderTopWidth: 2,
                borderColor: '#e5e5e5',
                borderBottomWidth: 2,
                borderStyle: 'solid',
                marginBottom: 20,
              }}
            ></View>

            {/* options */}
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {options.map((option, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => handleClickOption(option)}
                  style={{
                    padding: 8,
                    borderRadius: 15,
                    backgroundColor: '#fff',
                    shadowColor: '#000',
                    borderColor: '#e5e5e5',
                    borderWidth: 2,
                    borderBottomWidth: 4,
                    borderStyle: 'solid',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 16,
                      color: '#4B4B4B',
                    }}
                  >
                    {option.text}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        );
      case 'match':
        return (
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {options.map((option, idx) => (
              <View
                key={idx}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  marginVertical: 5,
                  width: '48%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                }}
              >
                {option.items.map((item, itemIdx) => (
                  <Pressable
                    key={itemIdx}
                    onPress={() => handleClickOption(item)}
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      backgroundColor: '#fff',
                      shadowColor: '#000',
                      borderColor: '#e5e5e5',
                      borderWidth: 2,
                      width: '100%',
                      borderBottomWidth: 4,
                      borderStyle: 'solid',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 16,
                        color: '#4B4B4B',
                      }}
                    >
                      {item.text}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  const handleCheck = async() => {
    setIsNext(true);
    try {
      const body = {
        questionId: item.id,
        answersId: ["683e45e599f227ed48405981"], 
      }
      const response = await api.post("/v2/questions/check", body);
      const data = response.data;
      const {isCorrect=true} = data.metadata;
      setIsCorrect(isCorrect);
    } catch (error) {
      console.error('Error checking answer:', error);
    }
  }

  const handleNext = () => {
   if (index < data.length - 1) {
                setIndex(index + 1);
              } else {
                alert('Game Over');
                setIndex(0);
              }
              setIsNext(false);
  }

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
                {item.question}
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
                {renderOptions(item.options, item.type, item?.image)}
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
                source={
                  isCorrect ? ThoBayMauGif : InCorrectGif
                }
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
      {isNext && (
        isCorrect ? (
          <Animated.View
          style={{
            position: 'absolute',
            zIndex: 1000,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#d7ffb8",
            justifyContent: 'center',
            padding: 20,
            transform: [
              { translateY: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }) },
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
          <Pressable
            onPress={handleNext}
          >
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
        ):(
          <Animated.View
          style={{
            position: 'absolute',
            zIndex: 1000,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#FFCDD2",
            justifyContent: 'center',
            padding: 20,
            transform: [
              { translateY: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }) },
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
          <Pressable
            onPress={handleNext}
          >
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
        )
      )}
    </>
  );
};

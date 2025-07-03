import { Image, Pressable, Text, View, Animated, Easing, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import ThoBayMauGif from '@/assets/images/congratulations.1.webp';
import InCorrectGif from '@/assets/images/incorrect.1.webp';
import api from '@/libs/axios';
import OrderInput from '@/components/customs/OrderInput';
import Onechoice from '@/components/customs/Onechoice';
import FillInTheBlank from '@/components/customs/FillInTheBlank';
import MatchItems from '@/components/customs/MatchItems';
import MultipleChoice from '@/components/customs/MultipleChoice';
import MainLayout from '@/components/layouts/MainLayout';
import { useLocalSearchParams } from 'expo-router';
import { useQuestionProvider } from '@/contexts/QuestionProvider';

const Play = () => {
    // Animation values
    const questionAnim = useRef(new Animated.Value(0)).current;
    const optionsAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;
    const modalAnim = useRef(new Animated.Value(0)).current;
    const [data, setData] = useState([]);
    // State management
    const [index, setIndex] = useState(0);
    const [isNext, setIsNext] = useState(false);
    const item = data[index];
    const [isCorrect, setIsCorrect] = useState(false);
    const { quizId, exerciseId, type } = useLocalSearchParams();
    const [arrayAnswer, setArrayAnswer] = useState([]);


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
        const fetchData = async (quizId) => {
            try {
                const response = await api.post(`/v2/quizzes/683e465299f227ed48405984/questions`);
                const data = response.data;
                const { items } = data.metadata;
                console.log('Fetched data:', items);
                setData(items);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (quizId) {
            fetchData(quizId);
        }
    }, [quizId]);

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

    useEffect(() => {
        console.log('Current arrayAnswer:', arrayAnswer);
    }, [arrayAnswer]);

    const handleClickOption = (option) => {
        console.log('Option clicked:', option);
        console.log('Item type:', item.type);


        switch (item.type) {
            case 'single':
                if (option === null) {
                    setArrayAnswer([]);
                } else {
                    setArrayAnswer([option]);
                }
                break;

            case 'multiple':
                // option là 1 id
                setArrayAnswer((prev) =>
                    prev.includes(option)
                        ? prev.filter((id) => id !== option)
                        : [...prev, option]
                );

                break;

            case 'fill':                
                setArrayAnswer(option);
                break;

            case 'order':
                // option là 1 mảng sắp xếp lại các id
                setArrayAnswer((prev) =>
                    prev.includes(option)
                        ? prev.filter((id) => id !== option)
                        : [...prev, option]
                );

                break;

            case 'match':
                // option là 1 mảng các cặp ghép
                setArrayAnswer(option); // dạng: [{ left: id1, right: id2 }, ...]
                console.log('Current arrayAnswer:', arrayAnswer);
                break;

            default:
                break;
        }
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
                () => {
                    console.log('Match options:', options);
                // return <MatchItems options={options} onClick={handleClickOption} />;
                }
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
        setArrayAnswer([]);
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

export default Play;
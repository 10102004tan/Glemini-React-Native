import { Image, Text, View, Animated, Easing } from 'react-native';
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
import { router, useLocalSearchParams } from 'expo-router';
import Loading from '@/components/customs/Loading';
import { useAuthStore } from '@/store/useAuthStore';
import { API_VERSION, END_POINTS } from '@/configs/api.config';
import { useResultProvider } from '@/contexts/ResultProvider';
import ScaleTouchable from '@/components/customs/ScaleTouchable';
import { shuffleArray } from '@/utils';

const Play = () => {
    // Animation values
    const questionAnim = useRef(new Animated.Value(0)).current;
    const optionsAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;
    const modalAnim = useRef(new Animated.Value(0)).current;
    const [data, setData] = useState([]);
    const { user } = useAuthStore();
    // State management
    const [index, setIndex] = useState(0);
    const [isNext, setIsNext] = useState(false);
    const [resultID, setResultID] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const item = data[index];
    const [isCorrect, setIsCorrect] = useState(false);
    const { quizId, exerciseId, type } = useLocalSearchParams();
    const [arrayAnswer, setArrayAnswer] = useState([]);
    const { completed } = useResultProvider();
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
                const response = await api.post(`/v2/quizzes/${quizId}/questions`);
                const data = response.data;
                let { items } = data.metadata;
                // 🔀 Xáo trộn đáp án của từng câu hỏi
                items = items.map((q) => {
                    if (Array.isArray(q.options
                    )) {
                        return {
                            ...q,
                            options: shuffleArray(q.options),
                        };
                    }
                    return q;
                });

                console.log('Fetched shuffled questions:', items);
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

    const handleClickOption = (option) => {
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
                // setArrayAnswer(option); // dạng: [{ left: id1, right: id2 }, ...]
                // console.log('Current arrayAnswer:', arrayAnswer);
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

    const handleCheck = async (arrayAnswer) => {
        setIsNext(true);
        try {
            const body = {
                questionId: item.id,
                answerIds: arrayAnswer,
            };
            const response = await api.post(`${API_VERSION.V2}${END_POINTS.V2.QUESTION_CHECK}`, body);

            const data = response.data;
            // console.log('Check answer response::=>>>>', data.metadata);

            const { isCorrect = true } = data.metadata;
            setIsCorrect(isCorrect);

            // 👇 Lưu lại kết quả từng câu
            const params = {
                exercise_id: exerciseId,
                user_id: user.user_id,
                quiz_id: quizId,
                question_id: item.id,
                answer: arrayAnswer,
                correct: isCorrect,
                score: isCorrect ? item.question_point : 0,
            };
            console.log('📋 Saving question result:', params);
            await api.post(`${API_VERSION.V1}${END_POINTS.RESULT_SAVE_QUESTION}`, params);

        } catch (error) {
            console.error('Error checking answer:', error);
        }
    };

    const handleNext = async () => {
        if (index < data.length - 1) {
            setIndex(index + 1);
        } else {
            setIndex(0);
            const completedResult = await completed(exerciseId, quizId);
            if (completedResult?._id) {
                setResultID(completedResult._id);
                setIsCompleted(true);
            }
        }
        setArrayAnswer([]);
        setIsNext(false);
    };

    if (!data.length) {
        return (
            <Loading duration={3000} message={'Đang tải câu hỏi .....'} />
        );
    }


    if (isCompleted && resultID) {
        return (
            <View
                style={{
                    position: 'absolute',
                    zIndex: 10000,
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // lớp phủ mờ
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                }}
            >
                <View
                    style={{
                        width: '90%',
                        backgroundColor: '#ffffff',
                        padding: 28,
                        borderRadius: 28,
                        alignItems: 'center',
                        borderColor: '#16a34a',
                        borderWidth: 1,
                        borderBottomWidth: 5,
                        shadowColor: '#22c55e',
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.4,
                        shadowRadius: 16,
                        elevation: 8,
                    }}
                >
                    <Image
                        source={ThoBayMauGif}
                        style={{ width: 150, height: 150, marginBottom: 10 }}
                        resizeMode="contain"
                    />

                    <Text
                        style={{
                            fontSize: 28,
                            fontWeight: '800',
                            color: '#22c55e',
                            marginBottom: 8,
                            textAlign: 'center',
                        }}
                    >
                        Bạn đã hoàn thành! 🎉
                    </Text>

                    <Text
                        style={{
                            color: '#333',
                            fontSize: 16,
                            textAlign: 'center',
                            marginBottom: 20,
                        }}
                    >
                        Tuyệt vời! Bạn đã hoàn thành tất cả câu hỏi trong bài Quiz này.
                    </Text>

                    <ScaleTouchable
                        onPress={() => {
                            router.push({
                                pathname: '(result)/single',
                                params: { resultID, exerciseId, quizId, type },
                            });
                        }}

                    >
                        <View style={{
                            backgroundColor: '#22c55e',
                            paddingVertical: 14,
                            paddingHorizontal: 30,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderBottomWidth: 4,
                            borderColor: '#16a34a',
                            shadowColor: '#16a34a',
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.4,
                            shadowRadius: 12,
                            elevation: 5,
                        }}>
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: 18,
                                    fontWeight: '800',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Xem kết quả
                            </Text>
                        </View>
                    </ScaleTouchable>
                </View>
            </View>
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
                            <ScaleTouchable
                                onPress={() => handleCheck(arrayAnswer)}
                                disabled={arrayAnswer.length === 0}>
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
                            </ScaleTouchable>
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
                        <ScaleTouchable onPress={handleNext}>
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
                        </ScaleTouchable>
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
                        <ScaleTouchable onPress={handleNext}>
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
                        </ScaleTouchable>
                    </Animated.View>
                ))}
        </>
    );
};

export default Play;
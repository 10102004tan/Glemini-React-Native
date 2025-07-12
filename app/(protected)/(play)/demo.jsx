import { Image, Text, View, Animated, Easing, StyleSheet, ScrollView, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import ThoBayMauGif from '@/assets/images/congratulations.1.webp';
import InCorrectGif from '@/assets/images/incorrect.1.webp';
import images from '@/constants/images';
import api from '@/libs/axios';
import OrderInput from '@/components/customs/OrderInput';
import Onechoice from '@/components/customs/Onechoice';
import FillInTheBlank from '@/components/customs/FillInTheBlank';
import MatchItems from '@/components/customs/MatchItems';
import MultipleChoice from '@/components/customs/MultipleChoice';
import MainLayout from '@/components/layouts/MainLayout';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import Loading from '@/components/customs/Loading';
import { useAuthStore } from '@/store/useAuthStore';
import { API_VERSION, END_POINTS } from '@/configs/api.config';
import { useResultProvider } from '@/contexts/ResultProvider';
import ScaleTouchable from '@/components/customs/ScaleTouchable';
import { shuffleArray } from '@/utils';
import { CommonActions } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
    const navigation = useNavigation();
    const [isNext, setIsNext] = useState(false);
    const [resultID, setResultID] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const item = data[index];
    const [isCorrect, setIsCorrect] = useState(false);
    const [randomImage, setRandomImage] = useState(null);
    const { quizId, exerciseId, type, indexQuestion } = useLocalSearchParams();
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
        const i = parseInt(indexQuestion);
        if (!isNaN(i)) {
            setIndex(i);
        }
    }, [indexQuestion]);

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
            setRandomImage(
                isCorrect
                    ? images.congratulations[Math.floor(Math.random() * images.congratulations.length)]
                    : images.incorrects[Math.floor(Math.random() * images.incorrects.length)]
            );


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

    // Animated progress bar fill
    const progress = data.length > 0 ? (index + 1) / data.length : 0;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 400,
            useNativeDriver: false, // width cannot use native driver
            easing: Easing.out(Easing.cubic),
        }).start();
    }, [progress]);

    // Exit Game handler
    const handleExitGame = () => {
        Alert.alert(
            'Thoát game',
            'Bạn có chắc chắn muốn thoát không?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Thoát',
                    style: 'destructive',
                    onPress: () => {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: '(homev2)' }],
                            })
                        );
                    },
                },
            ]
        );
    };

    // Helper to get question type info (label, color, bg, icon)
    const getQuestionTypeInfo = (type) => {
        switch (type) {
            case 'single':
                return {
                    label: 'Trắc nghiệm 1 đáp án',
                    color: '#43a047',
                    bg: '#e8f5e9',
                    icon: <MaterialCommunityIcons name='checkbox-marked-circle-outline' size={18} color='#43a047' style={{ marginRight: 6 }} />
                };
            case 'multiple':
                return {
                    label: 'Trắc nghiệm nhiều đáp án',
                    color: '#1976d2',
                    bg: '#e3f2fd',
                    icon: <MaterialCommunityIcons name='checkbox-multiple-marked-outline' size={18} color='#1976d2' style={{ marginRight: 6 }} />
                };
            case 'fill':
                return {
                    label: 'Điền vào chỗ trống',
                    color: '#f57c00',
                    bg: '#fff3e0',
                    icon: <MaterialCommunityIcons name='form-textbox' size={18} color='#f57c00' style={{ marginRight: 6 }} />
                };
            case 'order':
                return {
                    label: 'Sắp xếp thứ tự',
                    color: '#8e24aa',
                    bg: '#f3e5f5',
                    icon: <MaterialCommunityIcons name='format-list-numbered' size={18} color='#8e24aa' style={{ marginRight: 6 }} />
                };
            case 'match':
                return {
                    label: 'Ghép cặp',
                    color: '#d32f2f',
                    bg: '#ffebee',
                    icon: <MaterialCommunityIcons name='link-variant' size={18} color='#d32f2f' style={{ marginRight: 6 }} />
                };
            default:
                return { label: '', color: '#333', bg: '#eee', icon: null };
        }
    };

    // Diverse congratulation and encouragement messages
    const correctMessages = [
        "Awesome! You got it right!",
        "Correct! You're amazing!",
        "Well done! That's the right answer!",
        "You're making great progress!",
        "Fantastic! Keep it up!",
        "You chose the right answer, great job!",
        "Spot on! You're so smart!",
    ];
    const incorrectMessages = [
        "Don't worry, try again!",
        "Just a little mistake, keep going!",
        "No problem, you'll do better next time!",
        "Almost there, don't give up!",
        "Give it another shot, you can do it!",
        "Mistakes are normal, keep moving forward!",
        "Keep trying, you'll succeed!",
    ];

    function getRandomMessage(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

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
        <MainLayout>
            {/* Fixed Header */}
            <View style={styles.headerContainer}>
                {/* Exit Game button */}
                <ScaleTouchable onPress={handleExitGame} >
                    <View style={styles.exitButton}>
                        <AntDesign name="close" size={24} color="black" />
                    </View>
                </ScaleTouchable>
                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                        <Animated.View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: progressAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '100%'],
                                    }),
                                },
                            ]}
                        />
                    </View>
                    <Text style={styles.progressText}>{`${index + 1} / ${data.length}`}</Text>
                </View>
            </View>

            {/* Game Content */}
            <View style={styles.contentContainer}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                    {!isNext ? (
                        <View key={index} style={{ marginBottom: 20 }}>
                            {(() => {
                                const typeInfo = getQuestionTypeInfo(item.type);
                                return (
                                    <View style={[styles.questionTypeBadge, { backgroundColor: typeInfo.bg, borderColor: typeInfo.color }]}>
                                        {typeInfo.icon}
                                        <Text style={[styles.questionTypeBadgeText, { color: typeInfo.color }]}>{typeInfo.label}</Text>
                                    </View>
                                );
                            })()}
                            <Animated.Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: '600',
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
                                {item.type === 'fill' ? '' : item.question}
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
                            {randomImage && (
                                <Image
                                    source={randomImage}
                                    resizeMode="contain"
                                    style={{ width: 150, height: 150, borderRadius: 8, marginTop: 100 }}
                                />
                            )}

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
                                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>
                                    {isCorrect
                                        ? getRandomMessage(correctMessages)
                                        : getRandomMessage(incorrectMessages)}
                                </Text>
                            </View>
                        </Animated.View>
                    )}
                </ScrollView>
            </View>

            {/* Fixed Confirm Button */}
            {!isNext && (
                <View style={styles.confirmButtonContainer}>
                    {(() => {
                        const isConfirmDisabled = arrayAnswer.length === 0;
                        return (
                            <ScaleTouchable
                                onPress={() => handleCheck(arrayAnswer)}
                                disabled={isConfirmDisabled}
                                style={{ opacity: isConfirmDisabled ? 0.6 : 1 }}
                            >
                                <Text
                                    style={[
                                        styles.confirmButton,
                                        isConfirmDisabled && styles.confirmButtonDisabled,
                                    ]}
                                >
                                    Confirm
                                </Text>
                            </ScaleTouchable>
                        );
                    })()}
                </View>
            )}

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
                                fontWeight: '800',
                                color: '#4CAF50',
                                marginBottom: 20,
                            }}
                        >
                            Correct!
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '800',
                                color: '#4CAF50',
                                marginBottom: 20,
                            }}
                        >
                            {item.question_explanation || 'Câu hỏi này chưa có giải thích.'}
                        </Text>

                        <ScaleTouchable onPress={handleNext}>
                            <Text
                                style={[styles.confirmButton, { backgroundColor: '#4CAF50', borderColor: '#81C784' }]}
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
                                fontWeight: '600',
                                color: '#F44336',
                                marginBottom: 20,
                            }}
                        >
                            Incorrect!
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                                color: '#F44336',
                                marginBottom: 20,
                            }}
                        >
                            {item.question_explanation || 'Câu hỏi này chưa có giải thích.'}
                        </Text>

                        <ScaleTouchable onPress={handleNext}>
                            <Text
                                style={[styles.confirmButtonRed]}
                            >
                                Confirm
                            </Text>
                        </ScaleTouchable>
                    </Animated.View>
                ))}
        </MainLayout>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: '#fff',
        zIndex: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    exitButton: {
        marginRight: 12,
        padding: 8,
    },
    progressBarContainer: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    progressBarBackground: {
        flex: 1,
        height: 16,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 8,
    },
    progressBarFill: {
        height: 16,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        minWidth: 48,
        textAlign: 'right',
    },
    contentContainer: {
        flex: 1,
        paddingTop: 8,
        paddingBottom: 80,
    },
    confirmButtonContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#eee',
        zIndex: 20,
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        padding: 14,
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        textTransform: 'uppercase',
        borderWidth: 1,
        borderBottomWidth: 3,
        borderColor: '#81C784', // lighter green
        borderStyle: 'solid',
        shadowColor: '#000',
    },
    confirmButtonDisabled: {
        backgroundColor: '#cccccc',
        color: '#888888',
        borderColor: '#e0e0e0', // lighter gray
        borderWidth: 1,
        borderBottomWidth: 3,
    },
    confirmButtonRed: {
        backgroundColor: '#F44336',
        color: '#fff',
        borderColor: '#FF7961',
        borderWidth: 1,
        borderBottomWidth: 3,
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        textTransform: 'uppercase',
        padding: 14,
    },
    questionTypeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginBottom: 8,
        borderWidth: 1.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    questionTypeBadgeText: {
        fontSize: 15,
        fontWeight: '700',
    },
});

export default Play;
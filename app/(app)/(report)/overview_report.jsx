import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useResultProvider } from "@/contexts/ResultProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import LottieView from "lottie-react-native";

export default function DetailReport() {
    const { resultId } = useLocalSearchParams();
    const { overViewData, fetchOverViewData } = useResultProvider();
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        setIsFetching(true);
        fetchOverViewData(resultId).then(() => setIsFetching(false));
    }, [resultId]);
    

    if (isFetching) {
        return (
            <View className='flex-1 items-center justify-center'>
                <LottieView
                    source={require('@/assets/jsons/splash.json')}
                    autoPlay
                    loop
                    style={{ width: 250, height: 250 }}
                />
            </View>
        );
    }
    

    const correctCount = overViewData.result_questions?.filter(q => q.correct)?.length;
    const incorrectCount = overViewData.result_questions?.length - correctCount;

    return (
        <>
            <View className="pt-10 pb-2 px-5 flex-row items-center bg-red-800 ">
                <TouchableOpacity onPress={() => { router.back() }}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={'white'} />
                </TouchableOpacity>
                <View className='ml-8'>
                    <Text className="text-xl font-bold text-slate-100">{overViewData.user_id?.user_fullname}</Text>
                    <View className='flex-row items-center'>
                        <Text className="text-sm text-slate-50">
                            {moment(overViewData.updatedAt).format("MMMM Do YYYY | h:mm A")}
                        </Text>
                    </View>
                </View>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                className='flex-1 p-5' >
                {
                    overViewData.result_questions && overViewData.result_questions?.length > 0 &&
                    <View className="flex-row h-6 rounded-full overflow-hidden mb-2">
                        <View style={{ flex: correctCount / overViewData.result_questions?.length }} className="bg-green-500" />
                        <View style={{ flex: incorrectCount / overViewData.result_questions?.length }} className="bg-red-500" />
                    </View>
                }

                <View className="flex-row justify-between mb-2">
                    <Text className="text-green-500 font-bold p-1 bg-green-500/20">{`${correctCount} đúng`}</Text>
                    <Text className="text-red-500 font-bold p-1 bg-red-500/20">{`${incorrectCount} sai`}</Text>
                </View>

                <View className="flex-row justify-between mb-2 px-4">
                    <View>
                        <Text className="text-center font-bold mb-1">
                            {`${Math.floor((correctCount / overViewData.result_questions?.length * 100), 2)}% `}
                        </Text>
                        <Text className='font-medium'>Câu đúng</Text>
                    </View>
                    <View>
                        <Text className="text-center font-bold mb-1">
                            {`${correctCount}/${overViewData.result_questions?.length}`}
                        </Text>
                        <Text className='font-medium'>Điểm</Text>
                    </View>
                </View>

                <View className='mb-5'>
                    {overViewData.result_questions?.map((question, index) => (
                        <View key={question._id} className={`mb-3 p-2 rounded-lg ${question.correct ? "bg-green-500/20 border-green-500" : "bg-red-500/20 border-red-500"} border-[1px]`}>
                            <View className="flex-row justify-between items-center mb-2">
                                <View className='flex-row justify-start gap-2'>
                                    <Text className="text-slate-100 font-semibold bg-slate-700 px-3 py-2 rounded-lg">{`Câu hỏi ${index + 1}`}</Text>
                                    <View className={`px-3 py-2 rounded-lg ${question.correct ? "bg-green-500" : "bg-red-500"}`}>
                                        <Text className="text-white font-semibold text-sm w-10 text-center">{question.correct ? "Đúng" : "Sai"}</Text>
                                    </View>
                                </View>
                                <Text>
                                    {question.correct ? question.score : '0'} pts | 1 secs
                                </Text>
                            </View>

                            <Text className="font-medium text-base pb-4">{question.question_id.question_excerpt}</Text>
                            <Text className="text-base mt-2 font-semibold ">{`${overViewData.user_id?.user_fullname}`}</Text>
                            <Text className={`${question.correct ? "text-green-500" : "text-red-500"} font-medium border-b-[1px] pb-4 ${question.correct ? "border-green-500" : "border-red-500"}`}>
                                {
                                    question.question_id.question_type === 'box' ?
                                    question.answer
                                    :
                                    question.answer?.map(userAns => userAns.text).join(', ')
                                }
                            </Text>
                            <Text className="text-base mt-2">Câu trả lời chính xác</Text>
                            <Text className="font-medium">
                                {question.question_id.correct_answer_ids?.map(userAns => userAns.text).join(', ')}

                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </>
    );
}

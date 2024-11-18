import { createRef, useCallback, useEffect } from "react";
import { View, Text, Pressable, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useResultProvider } from "@/contexts/ResultProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import LottieView from "lottie-react-native";
import { Modalize } from "react-native-modalize";
import { useQuestionProvider } from "@/contexts/QuestionProvider";
import QuestionOverview from "@/components/customs/QuestionOverview";
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Lottie from "@/components/loadings/Lottie";

export default function DetailReport() {
    const modal = createRef();
    const { reportId, type } = useLocalSearchParams();
    const { reportData, fetchReportDetail } = useResultProvider();
    const { fetchQuestions, questions } = useQuestionProvider();

    useFocusEffect(
        useCallback(() => {
            fetchReportDetail(reportId, type);
        }, [reportId])
    );

    const getStatus = () => {
        const currentDate = new Date();
        const endDate = new Date(reportData.date_end);
        return currentDate < endDate;
    };

    const onOpen = () => {
        if (modal.current) {
            modal.current.open();
        }
    };

    const downloadExcel = async () => {
        if (!reportData.result_ids) return;

        // Prepare data for Excel
        const data = reportData.result_ids.map((result) => ({
            "Họ và tên": result.user_id.user_fullname,
            "Email": result.user_id.user_email,
            "Trạng thái": 'Hoàn thành',
            "Điểm số": result.result_questions.filter(q => q.correct).length + " điểm",
            "Tổng câu hỏi": result.result_questions.length + " câu",
        }));

        // Add Title Row
        const title = [["Báo cáo Kết quả Quiz"]];
        const headers = [["Họ và tên", "Email", "Trạng thái", "Điểm số", "Tổng câu hỏi"]];

        // Combine title, headers, and data into one sheet
        const sheetData = [...title, [], ...headers, ...data.map(Object.values)];

        // Create worksheet and workbook
        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Results");

        // Write the Excel file to the file system
        const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
        const fileUri = `${FileSystem.cacheDirectory}${reportData.name || reportData.room_code}_report.xlsx`;

        // Save and share
        try {
            await FileSystem.writeAsStringAsync(fileUri, wbout, { encoding: FileSystem.EncodingType.Base64 });
            await Sharing.shareAsync(fileUri);
        } catch (error) {
            console.error("Error downloading Excel:", error);
        }
    };

    useEffect(() => {
        if (reportData) {
            fetchQuestions(reportData.quiz_id?._id);
        }
    }, [reportData])

    return (
        <View className="flex-1 bg-slate-50">
            <View className="mx-4 my-3 p-3 rounded-md border-[1px] border-slate-300 flex-col">
                <View className='border-b-[1px] border-slate-300 pb-3 flex-row justify-between items-center'>
                    <View>
                        <Text className='text-black text-base font-bold'>{reportData.quiz_id?.quiz_name}</Text>
                        <Text className={`font-medium ${getStatus() ? 'text-green-500' : 'text-red-500'}`}>
                            {getStatus() ? 'Đang diễn ra' : 'Đã kết thúc'}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        Alert.alert(
                            "Tải file báo cáo?",
                            "Bạn có muốn tiếp tục tải file báo cáo này?",
                            [
                                { text: "Hủy", style: "cancel" },
                                {
                                    text: "Tiếp tục", onPress: () => {
                                        downloadExcel()
                                    }
                                },
                            ]
                        );
                    }}>
                        <LottieView
                            source={require('@/assets/jsons/download.json')}
                            autoPlay
                            loop
                            style={{ width: 40, height: 40 }}
                        />
                    </TouchableOpacity>
                </View>
                <View className='mt-2 flex-row justify-between items-center'>
                    <View className='flex-row gap-1 items-center'>
                        <MaterialCommunityIcons name="clock-time-four-outline" size={20} color={'gray'} />
                        <Text>{moment(reportData.date_end).format("MMMM Do YYYY | h:mm A")}</Text>
                    </View>
                    <TouchableOpacity className='flex-row items-center' onPress={onOpen}>
                        <Text className='px-1 py-1 bg-green-500/60 rounded-lg'>Xem quiz</Text>
                        <MaterialCommunityIcons name="menu-right" size={30} />
                    </TouchableOpacity>
                </View>
            </View>
            <View className='flex-1 p-3'>
                <Text className='text-base font-semibold'>Chú thích</Text>
                <View className='w-full flex-row items-center justify-around my-1'>
                    <View className='flex-row items-center gap-2'>
                        <View className='w-6 h-6 rounded-full bg-green-500' />
                        <Text className='text-green-500'>Chính xác </Text>
                    </View>
                    <View className='flex-row items-center gap-2'>
                        <View className='w-6 h-6 bg-red-500' />
                        <Text className='text-red-500'>Không chính xác</Text>
                    </View>
                </View>
                <Text className='text-base font-semibold my-1'>Danh sách người dùng đã tham gia</Text>
                <View className='flex-1'>
                    {
                        reportData.result_ids && reportData.result_ids.length > 0 ?
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                className="mx-4">
                                {reportData.result_ids?.map((result) => {
                                    const correctCount = result.result_questions.filter(q => q.correct).length;
                                    const incorrectCount = result.result_questions.length - correctCount;

                                    return (
                                        <Pressable key={result._id} onPress={() => {
                                            router.push({
                                                pathname: '/(report)/overview_report',
                                                params: {
                                                    resultId: result._id,
                                                }
                                            });
                                        }}>
                                            <View className="flex-row items-center p-3 my-2 border rounded-lg border-slate-300 bg-white">
                                                <Image source={{ uri: result.user_id.user_avatar }} className="w-12 h-12 rounded-full mr-4" />
                                                <View className="flex-1">
                                                    <Text className="text-sm font-bold mb-1">{result.user_id.user_fullname}</Text>
                                                    <View className="h-4 flex-row w-full rounded-md overflow-hidden">
                                                        <View style={{ flex: correctCount / result.result_questions.length }} className="bg-green-500" />
                                                        <View style={{ flex: incorrectCount / result.result_questions.length }} className="bg-red-500" />
                                                    </View>
                                                </View>
                                            </View>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>
                            :
                            <Lottie
                                source={require('@/assets/jsons/empty.json')}
                                width={200}
                                height={200}
                                text={'Chưa có học sinh nào tham gia'}
                            />
                    }
                </View>
            </View>
            <Modalize
                ref={modal}
                snapPoint={500}
                modalStyle={{ zIndex: 1000, elevation: 10, padding: 10 }}
                avoidKeyboardLikeIOS={true}
                withHandle={false}
                scrollViewProps={{ showsVerticalScrollIndicator: false }}>
                <View className="p-4">
                    <Text className="text-lg font-bold mb-3">Câu hỏi trong Quiz</Text>
                    {questions?.length > 0 ? (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {
                                questions.map((question, index) => (
                                    <QuestionOverview
                                        key={index}
                                        question={question}
                                        index={index}
                                    />
                                ))
                            }
                        </ScrollView>
                    ) : (
                        <Lottie
                            source={require('@/assets/jsons/empty.json')}
                            width={150}
                            height={150}
                        />
                    )}
                </View>
            </Modalize>
        </View>
    );
}

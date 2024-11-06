import { useCallback, useContext } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { useFocusEffect } from "expo-router";
import { useResultProvider } from "@/contexts/ResultProvider";
import { AuthContext } from "@/contexts/AuthContext";
import LockFeature from "@/components/customs/LockFeature";

export default function ReportScreen() {
    const { teacherStatus } = useContext(AuthContext);
    const { results, fetchResults } = useResultProvider();

    useFocusEffect(
        useCallback(() => {
            fetchResults();
        }, [])
    );

    if (teacherStatus === 'pedding' || teacherStatus === 'rejected') {
        return <LockFeature />;
    }

    return (
        <View className="flex-1 bg-white mb-20">
            <View className="px-4 py-2">
                <View className="flex-row items-center bg-gray-100 p-2 rounded-md mb-4">
                    <TextInput
                        placeholder="Tìm kiếm"
                        className="flex-1 px-4 text-gray-700 border-[1px] rounded-lg py-2"
                    />
                </View>
                <View className="flex-row justify-between">
                    <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-full">
                        <Text className="text-gray-700">Loại báo cáo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-full">
                        <Text className="text-gray-700">Lọc theo lớp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-full">
                        <Text className="text-gray-700">Lọc theo ngày</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* Results List */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="px-4">
                {results.map((result, index) => (
                    <View
                        key={index}
                        className="flex-row items-center justify-between p-4 bg-red-500/30 rounded-md shadow mb-4"
                    >
                        <View className="flex-row items-center">
                            <Text className="bg-black text-white px-2 py-1 rounded-md mr-4">Trực tiếp</Text>
                            <View>
                                <Text className="font-bold text-lg">{result.title}</Text>
                                <Text className="text-gray-500">Completed {result.date}</Text>
                                <Text className="text-gray-500">
                                    <Text className="font-bold">{result.participants}</Text> người tham gia
                                </Text>
                            </View>
                        </View>
                        <Text
                            className={`text-white px-3 py-1 rounded-md ${result.score < 50 ? 'bg-red-500' : 'bg-green-500'}`}
                        >
                            {result.score}%
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

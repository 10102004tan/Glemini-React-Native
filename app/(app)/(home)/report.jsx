import { useCallback, useContext } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useResultProvider } from "@/contexts/ResultProvider";
import { AuthContext } from "@/contexts/AuthContext";
import LockFeature from "@/components/customs/LockFeature";
import { Feather } from "@expo/vector-icons";

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
            <View className="px-4 py-2 shadow-lg">
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
                {results.map((result) => (
                    <Pressable onPress={() => { router.push(
                        {
                            pathname: '(report)/detail_report', 
                            params: { reportId: result.id, type: result.type }
                        })
                    }} key={result.id}>
                        <View className="flex-row items-center justify-betwee bg-transparent rounded-md mb-2"
                        >
                            <View className='flex-row w-full'>
                                <View className='w-1/3 flex items-center justify-center px-5'>
                                    <Text className='text-white p-3 bg-black rounded-md w-full text-center'>{result.type === 'room' ? 'Trực tiếp' : 'Bài tập'}</Text>
                                </View>
                                <View className='w-2/3 h-auto flex-row items-center py-5 border-b-[1px] border-slate-300'>
                                    <View className='w-4/5'>
                                        <Text className="text-slate-500 text-base font-bold">{result.identifier}</Text>
                                        <Text className="text-slate-500">{result.class_name || result.description}</Text>
                                        <View className="flex-row items-center">
                                            <Feather name="users" size={16} color={'gray'} />
                                            <Text className='ml-2 text-slate-500'>
                                                {result.results?.length} người tham gia

                                            </Text>
                                        </View>
                                    </View>
                                    <View className='w-1/5 flex items-center'>
                                        <Text className='bg-red-500/50 text-red-500 px-1 py-2 rounded-md font-bold'>100%</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}

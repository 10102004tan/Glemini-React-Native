import { Images } from "@/constants";
import { AuthContext } from "@/contexts/AuthContext";
import { useResultProvider } from "@/contexts/ResultProvider";
import { useFocusEffect } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useCallback, useState } from "react";
import { View, Text, Dimensions, FlatList, Image } from "react-native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / 2 - 16;

export default function ActivityScreen() {
    const { results, fetchResults } = useResultProvider();

    useFocusEffect(
        useCallback(() => {
            fetchResults();
            setIndex(0)
        }, [])
    );

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'doing', title: 'Đang thực hiện' },
        { key: 'completed', title: 'Đã hoàn thành' },
    ]);

    return (
        <View className="flex-1 mb-20 bg-slate-50">
            <TabView
                navigationState={{ index, routes }}
                renderScene={SceneMap({
                    doing: () => <DoingResults results={results.doing} />,
                    completed: () => <CompletedResults results={results.completed} />,
                })}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        className='bg-[#813b3b] text-white'
                        indicatorStyle={{ backgroundColor: 'white' }}
                    />
                )}
            />
        </View>
    );
}

const ResultCompletedItem = ({ result }) => {
    // Đếm số câu trả lời đúng
    const correctCount = result.result_questions.filter(q => q.correct).length;
    const totalQuestions = result.quiz_id?.questionCount || 0;

    // Tính độ chính xác
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    return (
        <View style={{ width: itemWidth }} className="m-2 bg-slate-200/50 rounded-lg border-slate-200 border-b-[6px] overflow-hidden">
            <Image
                source={result.quiz_id?.quiz_thumb ? { uri: result.quiz_id?.quiz_thumb } : Images.banner1}
                className="w-full h-28"
                style={{ resizeMode: 'cover' }}
            />
            <View className='bg-black/50 px-1 rounded-lg absolute top-2 left-2 flex-row items-center'>
                <FontAwesome6 name="chalkboard-user" color='white' />
                <Text className="text-sm text-slate-50 ml-1">Được giao</Text>
            </View>
            <View className='bg-slate-400/80 px-1 rounded-md absolute top-20 right-2 flex-row items-center'>
                <Text className="text-sm text-slate-50 ml-1">{totalQuestions} Qs</Text>
            </View>
            <View className='px-4 py-2'>
                <Text className="text-base font-pmedium">
                    {result.exercise_id?.name}
                </Text>
                <Text className="text-xl font-light">
                    {result.quiz_id?.quiz_name}
                </Text>
                <Text className="text-xs font-light">
                    bởi: {result.quiz_id?.user_id?.user_fullname}
                </Text>

                <Text className={`${accuracy < 40 ? 'bg-red-600': accuracy < 70 ? 'bg-yellow-400' : 'bg-green-500' } text-sm mt-4 font-light text-slate-50 rounded-full px-2`}>
                    {accuracy.toFixed(0)}% độ chính xác
                </Text>
            </View>
        </View>
    );
};

const ResultDoingItem = ({ result }) => (
    <View style={{ width: itemWidth }} className="m-2 bg-slate-200/70 rounded-lg border-slate-200 border-b-[6px] overflow-hidden">
        <Image
            source={result.quiz_id?.quiz_thumb ? { uri: result.quiz_id?.quiz_thumb } : Images.banner1}
            className="w-full h-28"
            style={{ resizeMode: 'cover' }}
        />

        <View className='bg-black/50 px-1 rounded-lg absolute top-2 left-2 flex-row items-center'>
            <FontAwesome6 name="chalkboard-user" color='white' />
            <Text className="text-sm text-slate-50 ml-1">{result.exercise_id?._id ? 'Được giao' : 'Công khai'}</Text>
        </View>
        <View className='bg-slate-400/80 px-1 rounded-md absolute top-20 right-2 flex-row items-center'>
            <Text className="text-sm text-slate-50 ml-1">{result.quiz_id?.questionCount} Qs</Text>
        </View>
        <View className='px-4 py-2'>
            <Text className="text-base font-pmedium">
                {result.exercise_id?.name}
            </Text>
            <Text className="text-xl font-light">
                {result.quiz_id?.quiz_name}
            </Text>
            <Text className="text-xs font-light">
                bởi: {result.quiz_id?.user_id?.user_fullname}
            </Text>

            <Text className="text-sm mt-4 font-light text-center text-slate-50 bg-violet-300 rounded-full px-2">
                {result.result_questions.length}/{result.quiz_id?.questionCount} câu hỏi
            </Text>
        </View>
    </View>
);

const CompletedResults = ({ results }) => {
    if (!results.length) {
        return <View className='h-full flex items-center justify-center'>
            <LottieView
                source={require('@/assets/jsons/not-found.json')}
                autoPlay
                loop
                style={{
                    width: 300,
                    height: 300,
                }}
            />
        </View>
    }
    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={results}
            renderItem={({ item }) => <ResultCompletedItem result={item} />}
            keyExtractor={item => item._id}
            numColumns={2}
            columnWrapperStyle="flex-row justify-between"
        />
    );
};

const DoingResults = ({ results }) => {
    if (!results.length) {
        return <View className='h-full flex items-center justify-center'>
            <LottieView
                source={require('@/assets/jsons/not-found.json')}
                autoPlay
                loop
                style={{
                    width: 300,
                    height: 300,
                }}
            />
        </View>
    }
    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={results}
            renderItem={({ item }) => <ResultDoingItem result={item} />}
            keyExtractor={item => item._id}
            numColumns={2}
            columnWrapperStyle="flex-row justify-between"
        />
    );
};

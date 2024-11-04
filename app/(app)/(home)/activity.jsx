import { Images } from "@/constants";
import { AuthContext } from "@/contexts/AuthContext";
import { useResultProvider } from "@/contexts/ResultProvider";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { View, Text, Dimensions, FlatList, Image } from "react-native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / 2 - 16;

const ResultItem = ({ result }) => (
    <View style={{ width: itemWidth }} className="m-2 bg-slate-200/70 rounded-lg overflow-hidden">
        <Image
            source={Images.banner1}
            className="w-full h-28 rounded-b-[40px]"
            style={{ resizeMode: 'cover' }}
        />
        <View className='bg-slate-400/40 px-1 rounded-lg absolute top-2 left-2 flex-row items-center'>
            <FontAwesome6 name="chalkboard-user" color='white' />
            <Text className="text-sm text-slate-50 ml-1">Được giao</Text>
        </View>
        <View className='bg-slate-400/60 px-1 rounded-md absolute top-20 right-2 flex-row items-center'>
            <Text className="text-sm text-slate-50 ml-1">{ result.quiz_id.questionCount } Qs</Text>
        </View>
        <View className='px-4 py-2'>
            <Text className="text-xl font-light">
                {result.quiz_id?.quiz_name}
            </Text>
            <Text className="text-xs font-light">
                bởi: {result.quiz_id?.user_id?.user_fullname}
            </Text>
        </View>
    </View>
);

const CompletedResults = ({ results }) => (
    <FlatList
        data={results}
        renderItem={({ item }) => <ResultItem result={item} />}
        keyExtractor={item => item._id}
        numColumns={2}
        columnWrapperStyle="flex-row justify-between"
    />
);

const DoingResults = ({ results }) => (
    <FlatList
        data={results}
        renderItem={({ item }) => <ResultItem result={item} />}
        keyExtractor={item => item._id}
        numColumns={2}
        columnWrapperStyle="flex-row justify-between"
    />
);

export default function ActivityScreen() {
    const { results, fetchResults } = useResultProvider();

    useFocusEffect(
        useCallback(() => {
            fetchResults();
            setIndex(0)
        }, [])
    );

    const [index, setIndex] = React.useState(0);
    const [routes] = useState([
        { key: 'doing', title: 'Đang thực hiện' },
        { key: 'completed', title: 'Đã hoàn thành' },
    ]);

    return (
        <View className="flex-1 bg-slate-50">
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

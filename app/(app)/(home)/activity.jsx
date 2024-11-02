import { AuthContext } from "@/contexts/AuthContext";
import { useResultProvider } from "@/contexts/ResultProvider";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useContext } from "react";
import { View, Text, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const CompletedResults = ({ results }) => (
    <View className="flex-1 p-4 bg-white">
        {results.map(result => (
            <Text key={result._id}>
                Quiz ID: {result.quiz_id?.quiz_name} - Score: {result.result_questions.reduce((total, question) => total + question.score, 0)}
            </Text>
        ))}
    </View>
);

const DoingResults = ({ results }) => (
    <View className="flex-1 p-4 bg-white">
        {results.map(result => (
            <Text key={result._id}>Quiz ID: {result.quiz_id?.quiz_name}</Text>
        ))}
    </View>
);

export default function ActivityScreen() {
    const { results, fetchResults } = useResultProvider();

    useFocusEffect(
        useCallback(() => {
            fetchResults();
        }, [])
    );

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'doing', title: 'Đang thực hiện' },
        { key: 'completed', title: 'Đã hoàn thành' },
    ]);


    return (
        <View className="flex-1">
            <TabView
                navigationState={{ index, routes }}
                renderScene={
                    SceneMap({
                        doing: () => <DoingResults results={results.doing} />,
                        completed: () => <CompletedResults results={results.completed} />,
                    })
                }
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

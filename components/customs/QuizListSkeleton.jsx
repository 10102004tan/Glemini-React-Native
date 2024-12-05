import {View} from "react-native";
import QuizItemSkeleton from "@/components/customs/QuizItemSkeleton";

export default function QuizListSkeleton(){
    return (
        <View className={"flex-row flex-wrap px-1"}>
            {
                Array.from({length:10}).map((_,index)=>(
                    <View className={"mb-3 w-1/2"} key={index}>
                        <QuizItemSkeleton />
                    </View>
                ))
            }
        </View>
    )
}
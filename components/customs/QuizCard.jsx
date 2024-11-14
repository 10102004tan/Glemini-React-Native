import {Image, Text, TouchableOpacity, View} from "react-native";

import moment from "moment/moment";
import React, {memo} from "react";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

const QuizCard = memo(({
                           quiz_thumb,
                           quiz_name,
                           quiz_turn,
                           onPress,
                           createdAt,
                           question_count,
                           user_avatar,
                           user_fullname
                       }) => (
    <TouchableOpacity className={"flex-1 mx-1 mb-3 shadow px-2 bg-white pb-2 rounded"} onPress={onPress}>
        <View>
            <Image
                src={(quiz_thumb ? quiz_thumb : "https://elearningindustry.com/wp-content/uploads/2021/10/Shareable-Quizzes-In-Online-Training-7-Reasons.jpg")}
                className={"w-full h-[100px] rounded-b-[10px]"} alt={quiz_name}/>
            <Text
                className={"absolute p-2 rounded bg-white opacity-80 text-[10px] bottom-[5px] right-[5px]"}>{moment(createdAt).fromNow()}</Text>
            <Text
                className={"absolute p-2 rounded bg-blue-500 text-white opacity-80 border-white text-[10px] top-[5px] left-[5px]"}>{question_count}</Text>
            <View className={"flex-row items-center gap-1 rounded bg-white absolute bottom-[5px] left-[8px] py-[2px] px-2"}>
                <SimpleLineIcons name={"game-controller"} size={12} color={"#000"}/>
                <Text className={"text-[12px] font-semibold text-gray my-1"}>{quiz_turn}</Text>
            </View>
        </View>
        <View className={"p-2"}>
            <Text>{(quiz_name.length > 25 ? quiz_name.substring(0, 25) + "..." : quiz_name)}</Text>
            <View className={"flex-row gap-2 items-center mt-3"}>
                <Image className={"w-[20px] h-[20px] rounded-full object-cover"}
                       src={user_avatar.replace("h_100", "h_30").replace("w_100", "w_30")}/>
                <Text className={"text-[10px]"}>{user_fullname}</Text>
            </View>
        </View>
    </TouchableOpacity>
));

export default QuizCard;
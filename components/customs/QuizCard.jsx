import {Image, Text, TouchableOpacity, View} from "react-native";

import moment from "moment/moment";
import React, {memo} from "react";

const QuizCard= memo(({quiz_thumb, quiz_name, quiz_turn,onPress,createdAt,question_count})=>(
    <TouchableOpacity className={"flex-1 mx-1 mb-3 shadow px-1 pb-2 rounded"} onPress={onPress}>
        <View>
            <Image src={(quiz_thumb ? quiz_thumb : "https://elearningindustry.com/wp-content/uploads/2021/10/Shareable-Quizzes-In-Online-Training-7-Reasons.jpg")} className={"w-full h-[100px] rounded-b-[10px]"} alt={quiz_name}/>
               <Text className={"absolute p-2 rounded bg-white opacity-80 text-[10px] bottom-[5px] right-[5px]"}>{moment(createdAt).fromNow()}</Text>
               <Text className={"absolute p-2 rounded bg-blue-500 text-white opacity-80 border-white text-[10px] top-[5px] left-[5px]"}>{question_count}</Text>
        </View>
        <View className={"p-2"}>
            <Text>{quiz_name}</Text>
            <Text>Lượt chơi : {quiz_turn}</Text>
        </View>
    </TouchableOpacity>
));

export default QuizCard;
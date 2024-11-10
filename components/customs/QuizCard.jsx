import {Image, Text, TouchableOpacity, View} from "react-native";
import moment from "moment/moment";
import React from "react";

export default function QuizCard({quiz_thumb, quiz_name, quiz_turn,onPress,createdAt}) {
    return (
        <TouchableOpacity className={"flex-1 mx-1 mb-3 shadow px-1 pb-2 rounded"} onPress={onPress}>
            <View>
                <Image src={(quiz_thumb ? quiz_thumb : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh6bHzd2uppe-_V6EDiOfPEQa2fmIJDBWY3M80ivU0qJojhVdZJHOCMSvppIZx6w4gAQU&usqp=CAU")} className={"w-full h-[100px] rounded-b-[10px]"} alt={quiz_name}/>
                <Text className={"absolute p-2 rounded bg-white opacity-80 text-[10px] bottom-[5px] right-[5px]"}>{moment(createdAt).fromNow()}</Text>
            </View>
            <View className={"p-2"}>
                <Text>{quiz_name}</Text>
                <Text>Lượt chơi : {quiz_turn}</Text>
            </View>
        </TouchableOpacity>
    )
}
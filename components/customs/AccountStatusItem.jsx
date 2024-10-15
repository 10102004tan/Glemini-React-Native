import { useState } from "react";
import { Text, View } from "react-native";

export default function AccoutntStatusItem({status}){
    let text;
    let color;
    if (status === "active")
    {
        text = "Da xac thuc"
        color = "bg-green-500"
    }
    else if (status === "inactive"){
        text = "Cho duyet ho so"
        color = "bg-yellow-500"
    }
    else{
        text = "Bi tu choi"
        color = "bg-red-500"
    }
    return(
        <View className="flex flex-row gap-2 items-center">
            <View className={"w-[10px] h-[10px] rounded-full "+ color}></View>
            <Text className="text-[12px]">{text}</Text>
        </View>
    )
}
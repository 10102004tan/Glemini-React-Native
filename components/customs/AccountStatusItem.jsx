import { useState } from "react";
import { Text, View } from "react-native";

export default function AccoutntStatusItem({status}){
    return(
        <View className="flex flex-row gap-2 items-center mt-1">
            <View className="w-[10px] h-[10px] rounded-full bg-yellow-500"></View>
            <Text className="text-[12px]">Chờ duyệt hồ sơ</Text>
        </View>
    )
}
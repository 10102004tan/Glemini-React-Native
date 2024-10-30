import {Text, TouchableOpacity, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {router} from "expo-router";

export default function NotificationIcon({numberOfUnreadNoti,color="white"}) {
    return (
        <TouchableOpacity onPress={()=>{
            router.push({
                pathname:'(app)/notification',
            })
        }}>
            <View className={"mr-2"}>
                {
                    numberOfUnreadNoti > 0 && <Text className={'text-center absolute z-50 right-0 top-0 h-[18px] w-[18px] rounded-full text-white bg-red-600 text-[12px]'}>{(numberOfUnreadNoti > 9 ? "9+" : numberOfUnreadNoti)}</Text>
                }
                <Ionicons size={32} color={color} name={'notifications-outline'}/>
            </View>
        </TouchableOpacity>
    )
}
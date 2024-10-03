import { Text, View } from "react-native";
import { useLocalSearchParams,useGlobalSearchParams } from "expo-router";
import CustomInput from "@/components/customs/CustomInput";
import { useState } from "react";

export default function ProfileEditScreen(){
    const {title} = useLocalSearchParams();
    
    return (
        <View className="px-3 bg-white mt-2 h-[100%]">
            <CustomInput  label='Mật khẩu cũ' secure/>
            <CustomInput label='Mật khẩu mới' secure/>
            <CustomInput label='Nhập lại mật khẩu mới' secure/>
        </View>
    )
}
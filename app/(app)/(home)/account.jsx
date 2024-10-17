import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useContext, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { AuthContext } from "@/contexts/AuthContext";
import AccoutntStatusItem from "@/components/customs/AccountStatusItem";
import {useAppProvider} from "@/contexts/AppProvider";

export default function AccountScreen() {
    const {userData:{user_fullname,user_email,user_type,user_avatar},userData,teacherStatus} = useContext(AuthContext);
    const {i18n} = useAppProvider();
    return (
        <View className="bg-white h-[100%] px-[20px]">
            <View>
                <View className="flex flex-row gap-2 p-3 border-[1px] mt-3 border-[#eee] rounded">
                    <Image src={user_avatar} className="w-[60px] h-[60px] object-cover rounded-full" />
                    <View className="flex-1">
                        <Text className="font-semibold text-[14px]">{user_fullname}</Text>
                        <Text className="text-gray text-[12px]">{user_email}</Text>
                        {user_type === "teacher" && (<AccoutntStatusItem status={teacherStatus}/>)}
                    </View>
                    <Link href={'(app)/profile'}>
                        <View className="flex flex-row items-center">
                            <FontAwesome name="edit" size={16} color="black" />
                            <Text className="ms-2 text-[12px]">{i18n.t("account.buttonEdit")}</Text>
                        </View>
                    </Link>
                </View>
            </View>
        </View>
    )
}


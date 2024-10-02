import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useContext } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { AuthContext } from "@/contexts/AuthContext";

export default function AccountScreen() {
    const {userData:{user_fullname,user_email},userData} = useContext(AuthContext);
    console.log(userData);
    return (
        <View className="bg-white h-[100%] px-[20px]">
            <View>
                <View className="flex flex-row gap-2 p-3 border-[1px] mt-3 border-[#eee] rounded">
                    <Image src={'https://cdn-icons-png.flaticon.com/512/25/25231.png'} className="w-[60px] h-[60px] object-cover rounded-full" />
                    <View className="flex-1">
                        <Text className="font-semibold text-[14px]">{user_fullname}</Text>
                        <Text className="text-gray text-[12px]">{user_email}</Text>
                    </View>
                    <Link href={'(app)/profile'}>
                        <View className="flex flex-row items-center">
                            <FontAwesome name="edit" size={16} color="black" />
                            <Text className="ms-2 text-[12px]">Chỉnh sửa</Text>
                        </View>
                    </Link>
                </View>
            </View>
        </View>
    )
}
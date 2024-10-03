import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function LockFeature(){
    return(
        <View className="flex flex-col items-center justify-center h-[100%]">
            <Text className="text-[18px] font-semibold">Bạn chưa sử dụng được tính năng này</Text>
            <View className="flex flex-row gap-1">
                <Text className="text-[14px] text-gray">Xem trạng thái hồ sơ của bạn</Text>
                <Link href={'(app)/account'}>
                    <Text className="text-[14px] font-semibold text-blue-500">Tại đây</Text>
                </Link>
            </View>
        </View>
    )
}
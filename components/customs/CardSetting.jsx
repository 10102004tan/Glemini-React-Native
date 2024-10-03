import { FontAwesome } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function CardSetting({ isActice, title, description }) {
    return (
        <View className="flex flex-row justify-between py-3 border-b-[1px] border-b-[#eee] mb-3">
            <Text>{title}</Text>
            <View className="flex flex-row gap-2 items-center">
                <Text className={(isActice ? "text-[#e36334]" : "text-[#8d8c8c]")}>{description}</Text>
                <FontAwesome name="chevron-right" size={16} color="black" />
            </View>
        </View>
    )
}
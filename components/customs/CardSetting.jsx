import { FontAwesome } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function CardSetting({ isActice, title, description, onPress }) {
    return (
        <TouchableOpacity onPress={onPress}>
             <View className="flex flex-row justify-between py-3 border-b-[1px] border-b-[#eee] mb-3">
                <Text>{title}</Text>
                <View className="flex flex-row gap-2 items-center">
                    <Text className={(isActice ? "text-[#e36334]" : "text-[#8d8c8c]")}>{description}</Text>
                    <FontAwesome name="chevron-right" size={16} color="black" />
                </View>
            </View>
        </TouchableOpacity>

    )
}
import { Pressable,Text,Image,View } from "react-native";

export default function InputImage({ logo, title, desc,onPress,onLongPress }) {
    return (
        <Pressable onLongPress={onLongPress} onPress={onPress}>
            <Text className="font-semibold">*{title}</Text>
            <View className="flex flex-row">
                <Image className="mr-4 w-[80px] mt-2 mb-3 h-[80px] rounded-[10px] bg-slate-200" source={{ uri: logo }} />
                <View className="w-[160px] mt-3">
                    <Text>
                        {desc}
                    </Text>
                </View>
            </View>
        </Pressable>
    )
}
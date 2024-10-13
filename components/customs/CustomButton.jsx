import {Text, TouchableOpacity, View} from "react-native";

export default function CustomButton({onPress,title,bg,color, ...props }) {
    return (
        <TouchableOpacity onPress={onPress} {...props}>
            <View className=' bg-black py-3 rounded'>
                <Text className="text-white text-center text-[16px]">{title}</Text>
            </View>
        </TouchableOpacity>
    )
}
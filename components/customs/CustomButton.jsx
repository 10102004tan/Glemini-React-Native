import { Pressable, Text, View } from "react-native";

export default function CustomButton({onPress,bg,color, ...props }) {
    return (
        <Pressable onPress={onPress}>
            <View className=' bg-black py-3 rounded'>
                <Text className="text-white text-center text-[16px]">Đăng nhập</Text>
            </View>
        </Pressable>
    )
}
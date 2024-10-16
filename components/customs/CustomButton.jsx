import {Text, TouchableOpacity, View} from "react-native";

export default function CustomButton({onPress,title,bg="bg-black",color="text-white", ...props }) {
    return (
        <TouchableOpacity onPress={onPress} {...props}>
            <View className={'py-3 rounded border '+bg}>
                <Text className={"text-center text-[16px] "+color}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}
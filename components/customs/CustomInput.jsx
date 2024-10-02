import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { FontAwesome } from '@expo/vector-icons';


export default function CustomInput({ value, label = "Title", icon, secure = false, ...props }) {
    const [isFocus, setIsFocus] = useState(false);
    const [isSecure, setIsSecure] = useState(true);
    return (
        <View className="mb-[20px]">
            <Text className={(isFocus ? "text-blue-500" : "text-black")}>{label}</Text>
            <View className={"flex flex-row w-[100%] items-center justify-between p-2 border rounded " + (isFocus ? "border-blue-500" : "border-black")}>
                <TextInput secureTextEntry={(!secure?secure : isSecure)} className="flex-1" onBlur={() => { setIsFocus(false) }} onFocus={() => { setIsFocus(true) }} value={value} {...props} />
                {
                    secure && (
                        <View className="px-2 flex flex-row items-center justify-center">
                            <FontAwesome size={16} onPress={() => {
                                setIsSecure(!isSecure)
                            }} name={(isSecure ? 'eye-slash':'eye')} />
                        </View>
                    )
                }

            </View>
        </View>
    )
}
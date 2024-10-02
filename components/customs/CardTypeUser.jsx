import { Text, View,Pressable,Image } from "react-native";

export default  function CardTypeUser({ type, description, image, onPress }){
    return (
        <Pressable onPress={onPress}>
            <View className="p-3 rounded-[10px] shadow-lg bg-[#eee] flex flex-row mb-4">
                <Image className="w-[60px] h-[60px] rounded-full mr-3" src={image} alt="user" />
                <View>
                    <Text className="text-[16px] font-semibold">{type}</Text>
                    <Text className="text-[14px] text-gray-400 w-[250px]">{description}</Text>
                </View>
            </View>
        </Pressable>
    )
}
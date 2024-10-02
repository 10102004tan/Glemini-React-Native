import { useContext } from "react";
import { Text, View ,Button, TouchableOpacity} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";

export default function SettingsScreen() {
    const { signOut } = useContext(AuthContext);
    return (
        <View className="px-2 mt-3 h-[100%]">
            <TouchableOpacity onPress={signOut}>
                <Text className="py-4 w-[100%] border shadow text-center">Đăng xuất</Text>
            </TouchableOpacity>
        </View>
    )
}
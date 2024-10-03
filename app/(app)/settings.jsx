import { useContext } from "react";
import { Text, View ,Button, TouchableOpacity} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import CardSetting from "@/components/customs/CardSetting";
import { useAppProvider } from "@/contexts/AppProvider";

export default function SettingsScreen() {
    const { signOut } = useContext(AuthContext);
    const {i18n} = useAppProvider();
    return (
        <View className="px-2 mt-3 h-[100%]">
            <View>
                <CardSetting title={i18n.t('language.changeLanguage')} description={i18n.t('language.edit')} isActice={true} />
            </View>
            <TouchableOpacity onPress={signOut}>
                <Text className="py-4 w-[100%] border shadow text-center">{i18n.t('logout.title')}</Text>
            </TouchableOpacity>
        </View>
    )
}
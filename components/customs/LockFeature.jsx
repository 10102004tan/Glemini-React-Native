import { Link } from "expo-router";
import { Text, View } from "react-native";
import {useAppProvider} from "@/contexts/AppProvider";

export default function LockFeature(){
    const {i18n} = useAppProvider();
    return(
        <View className="flex flex-col items-center justify-center h-[100%]">
            <Text className="text-[18px] font-semibold">{i18n.t("lockFeature.title")}</Text>
            <View className="flex flex-row gap-1">
                <Text className="text-[14px] text-gray">{i18n.t("lockFeature.desc")}</Text>
                <Link href={'(app)/account'}>
                    <Text className="text-[14px] font-semibold text-blue-500">{i18n.t("lockFeature.button")}</Text>
                </Link>
            </View>
        </View>
    )
}
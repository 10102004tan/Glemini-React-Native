import {Text, View} from "react-native";
import LottieView from "lottie-react-native";
import {useAppProvider} from "@/contexts/AppProvider";

export default function NotificationEmpty(){
    const {i18n} = useAppProvider();
    return (
        <View className={"justify-center items-center h-[100%]"}>
            <LottieView
                loop={true}
                autoPlay={true}
                style={{
                    width: 200,
                    height: 200,
                }}
                source={require('@/assets/jsons/empty.json')}
            />
            <Text>{i18n.t("notification.emptyNotification")}</Text>
        </View>
    )
}
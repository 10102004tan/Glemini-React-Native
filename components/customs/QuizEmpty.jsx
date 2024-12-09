import { RefreshControl, ScrollView, Text, View } from "react-native";
import LottieView from "lottie-react-native";
import { useAppProvider } from "@/contexts/AppProvider";

export default function QuizEmpty({ onRefresh }) {
  const { i18n } = useAppProvider();
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }
    >
      <View className={"justify-center items-center h-[90%]"}>
        <LottieView
          loop={true}
          autoPlay={true}
          style={{
            width: 200,
            height: 200,
          }}
          source={require("@/assets/jsons/empty.json")}
        />
        <Text>{i18n.t("empty.title")}</Text>
      </View>
    </ScrollView>
  );
}

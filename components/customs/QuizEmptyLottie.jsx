import { Text, View } from "react-native";
import LottieView from "lottie-react-native";

export default function QuizEmptyLottie() {
  return (
    <View className={"justify-center items-center h-[90%]"}>
      <LottieView
        loop={true}
        autoPlay={true}
        style={{
          width: 200,
          height: 200,
        }}
        source={require("@/assets/jsons/quiz_empty.json")}
      />
      <Text>Chưa có quizzes nào!!!</Text>
    </View>
  );
}

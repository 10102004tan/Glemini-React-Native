import SkeletonPlaceholder from "react-native-skeleton-placeholder-v2";
import { View } from "react-native";

export default function QuizItemSkeleton() {
    return (
        <View className={"px-1"}>
            <View className={"px-2 pb-3 bg-white rounded"}>
                <SkeletonPlaceholder borderRadius={4}>
                    <SkeletonPlaceholder.Item flexDirection="column">
                        <SkeletonPlaceholder.Item height={80} width={"100%"} style={{ borderBottomEndRadius: 10 }} />
                        <SkeletonPlaceholder.Item width={"80%"} height={15} marginTop={5} borderRadius={2} />
                        <SkeletonPlaceholder.Item flexDirection={"row"} alignItems={"center"} marginTop={10}>
                            <SkeletonPlaceholder.Item width={30} height={30} borderRadius={100} />
                            <SkeletonPlaceholder.Item height={10} width={"50%"} marginLeft={10} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
            </View>
        </View>
    )
}
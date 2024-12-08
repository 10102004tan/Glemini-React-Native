import {View} from "react-native";
import QuizItemSkeleton from "@/components/customs/QuizItemSkeleton";
import SkeletonPlaceholder from "react-native-skeleton-placeholder-v2";

export default function NotificationListSkelaton(){
    return (
        <View>
            {
                Array.from({length:10}).map((_,index)=>(
                    <SkeletonPlaceholder borderRadius={4} key={index}>
                        <SkeletonPlaceholder.Item flexDirection="column" marginBottom={10}>
                            <SkeletonPlaceholder.Item height={80} width={"100%"} style={{borderBottomEndRadius:10}}/>
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder>
                ))
            }
        </View>
    )
}

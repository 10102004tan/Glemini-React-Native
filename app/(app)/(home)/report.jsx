import LockFeature from "@/components/customs/LockFeature";
import { AuthContext } from "@/contexts/AuthContext";
import { useResultProvider } from "@/contexts/ResultProvider";
import { useContext } from "react";
import { View, Text } from "react-native";

export default function ReportScreen() {
    const { teacherStatus } = useContext(AuthContext);
    const { results, fetchResults } = useResultProvider()

    if (teacherStatus === 'pedding' || teacherStatus === 'rejected') {
        return (
            <LockFeature />
        )
    }
    return (
        <View className='flex-1 bg-white/90 mb-20'>
            <Text>Report Screen</Text>
        </View>
    )
}
import LockFeature from "@/components/customs/LockFeature";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";
import { View,Text } from "react-native";

export default function ReportScreen(){
	const {teacherStatus} = useContext(AuthContext);

    if (teacherStatus === 'inactive') {
		return (
			<LockFeature/>
		)
	}
    return (
        <View>
            <Text>Report Screen</Text>
        </View>
    )
}
import { Redirect, Slot } from "expo-router";
import { useContext } from "react";
import { ScrollView, View } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";

export default function AuthLayout(){
	const{userData} = useContext(AuthContext);
    if (userData){
        return <Redirect href={'/(home)'}/>;
    }
    return (
        <ScrollView className="bg-white">
			<View className="mt-[100px] bg-white min-h-[700px] rounded-tl-[14px] rounded-[14px] px-4">
				<Slot/>
			</View>
		</ScrollView>
    )
}
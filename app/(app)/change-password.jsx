import { useContext } from "react";
import { View,Text,Button } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";

export default function ChangePasswordScreen(){
    const {changePassword} = useContext(AuthContext);
    return (
        <View>
            <Text>Change Password</Text>
            <Button onPress={()=>{
                changePassword({oldPassword:"1",newPassword:"12"});
            }} title="Xac nhan doi mat khau"/>
        </View>
    )
} 
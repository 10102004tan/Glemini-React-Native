import {useContext, useState} from "react";
import { View,Text,Button } from "react-native";
import CustomInput from "@/components/customs/CustomInput";
import {AuthContext} from "@/contexts/AuthContext";
import CustomButton from "@/components/customs/CustomButton";
import Toast from "react-native-toast-message";
import {useAppProvider} from "@/contexts/AppProvider";

export default function ChangePasswordScreen(){
    const {changePassword} = useContext(AuthContext);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const {i18n} = useAppProvider();

    const handleSubmit = async () => {
        if (newPassword.length < 8 || oldPassword.length < 8){
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Password must be at least 8 characters"
            })

            return;
        }

        if (newPassword !== confirmPassword){
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Password does not match"
            })

            return;
        }

        await changePassword({newPassword, oldPassword})
            .then((res)=>{
                setNewPassword("");
                setOldPassword("");
                setConfirmPassword("");
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: res
                })
            }).catch((err)=>{
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: err.message,
                    visibilityTime:2000
                })
            });

    }

    return (
        <View className={"px-3 pt-3 bg-white h-[100%]"}>
            <View>
                <CustomInput secure={true} label={i18n.t("profile.oldPassword")} value={oldPassword.trim()} onChangeText={setOldPassword} />
                <CustomInput secure={true} label={i18n.t("profile.newPassword")} value={newPassword.trim()} onChangeText={setNewPassword} />
                <CustomInput secure={true} label={i18n.t("profile.confirmPassword")} value={confirmPassword.trim()} onChangeText={setConfirmPassword} />
                <CustomButton title={i18n.t("profile.save")} onPress={handleSubmit} />
            </View>
        </View>
    )
} 
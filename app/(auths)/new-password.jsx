import {Text, View} from "react-native";
import CustomInput from "@/components/customs/CustomInput";
import {useContext, useState} from "react";
import {AuthContext} from "@/contexts/AuthContext";
import {useAppProvider} from "@/contexts/AppProvider";
import CustomButton from "@/components/customs/CustomButton";
import {router, useLocalSearchParams} from "expo-router";
import Toast from "react-native-toast-message-custom";

export default function NewPasswordScreen() {
    const {resetPassword} = useContext(AuthContext);
    const {i18n} = useAppProvider();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const {email,otp} = useLocalSearchParams();
    const handleResetPw =  async () => {

        //validate password
        if (!password){
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Password is required',
                visibilityTime: 2000,
            });
            return;
        }
        if (password.length < 8){
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Password must be at least 8 characters',
                visibilityTime: 2000,
            });
            return;
        }

        if (!confirmPassword){
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Confirm password is required',
                visibilityTime: 2000,
            });
            return;
        }

        if (confirmPassword.length < 8){
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Password must be at least 8 characters',
                visibilityTime: 2000,
            });

            return;
        }

        if (password !== confirmPassword){
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Password and confirm password must be the same',
                visibilityTime: 2000,
            });

            return;
        }

        await resetPassword({email,otp,password}).then((res)=>{
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: res.message,
                visibilityTime: 2000,
                onHide:()=>{
                    router.replace({
                        pathname:"/(auths)/sign-in"
                    });
                }
            });

        }).catch((e)=>{
           Toast.show({
                type: 'error',
                text1: 'Error',
                text2: e.message,
                visibilityTime: 2000,
           })
        });
    }
    return (
        <View>
            <View>
                <CustomInput value={password.trim()} onChangeText={setPassword} secure={true} label={i18n.t("resetPassword.password")}/>
                <CustomInput value={confirmPassword.trim()} onChangeText={setConfirmPassword} secure={true} label={i18n.t("resetPassword.confirmPassword")}/>
                <CustomButton title={i18n.t("resetPassword.submit")} onPress={handleResetPw}/>
            </View>
        </View>
    )
}
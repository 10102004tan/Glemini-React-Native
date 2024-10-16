import CustomButton from "@/components/customs/CustomButton";
import CustomInput from "@/components/customs/CustomInput";
import { useAppProvider } from "@/contexts/AppProvider";
import {View, Text, TouchableOpacity} from "react-native";
import {useContext, useEffect, useState} from "react";
import ReactNativeOtpTextinput from "react-native-otp-textinput/index";
import OTPTextView from "react-native-otp-textinput";
import {Link, router} from "expo-router";
import {AuthContext} from "@/contexts/AuthContext";
import {validateEmail} from "@/utils";
import Toast from "react-native-toast-message";

const COUNT_INPUT = 5;
const COUNT_RESEND = 30;
export default function ForgotPasswordScreen() {
    const {i18n} = useAppProvider();
    const [isSendEmail, setIsSendEmail] = useState(true);
    const {forgotPassword,verifyOTP} = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [disableResend, setDisableResend] = useState(false);
    const [countResend, setCountResend] = useState(0);

    useEffect(()=>{
        console.log(countResend)
        if (isSendEmail) return;
        let interval = setInterval(() => {
            setCountResend(lastTimerCount => {
                if (countResend === 0) {
                    clearInterval(interval)
                    setDisableResend(false);
                    return;
                }
                return lastTimerCount - 1
            })
        }, 1000) //each count lasts for a second
        //cleanup the interval on complete
        return () => clearInterval(interval);
    },[countResend]);

    const handleSendEmail = async () => {
        if (!email || !validateEmail(email)){
            console.log("Email is invalid");
            return;
        }
        await forgotPassword({
            email,
        }).then((res)=>{
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: res.message,
                visibilityTime: 2000,
            })
            setIsSendEmail(false);
            setCountResend(COUNT_RESEND);
            setDisableResend(true);
        }).catch(e=>{
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: e.message,
                visibilityTime: 2000,
            })
        });
    }

    const handleSendOTP = async () => {
        if (otp.length < 5){
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'OTP must be 5 characters',
                visibilityTime: 2000,
            })
            return;
        }
        // fetch to endpoint verify otp
        await verifyOTP({email,otp})
            .then((res)=>{
                console.log(res);
                router.replace({
                    pathname:"/(auths)/new-password",
                    params:{otp,email}
                });
            })
            .catch(e=>{
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
            <Text className="my-4 text-[20px] text-center font-bold">
                {i18n.t('forgetPassword.title')}
            </Text>
            <View >
                {
                    isSendEmail ? (
                        <View>
                            <CustomInput onChangeText={setEmail} value={email} label={i18n.t('forgetPassword.email')} />
                            <Link className={"mb-3 text-center"} href={"/(auths)/sign-in"}>
                                <Text className={"text-[16px] text-gray"}>Back to sign in</Text>
                            </Link>
                            <CustomButton onPress={handleSendEmail} title={i18n.t('forgetPassword.send')} />
                        </View>
                    ) : (
                        <View>
                            <OTPTextView handleTextChange={setOtp} inputCount={COUNT_INPUT}/>
                            <View className={"flex-row mb-4 mt-3 justify-center"}>
                                <Text className={"text-gray"}>If you didn’t receive a code, </Text>
                                <TouchableOpacity disabled={disableResend} onPress={handleSendEmail}>
                                    <Text className={"font-semibold " +(!disableResend ? "text-orange-600":"text-gray")}>{(disableResend ? `Resend (${countResend})`:"Resend")}</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={()=>setIsSendEmail(true)}>
                                <Text className={"mb-3 text-center font-semibold"}>Change Email</Text>
                            </TouchableOpacity>
                            <CustomButton onPress={handleSendOTP} title={i18n.t('forgetPassword.send')} />
                        </View>
                    )
                }

            </View>
            <View className={"mt-[100px]"}>
                <Text className={"mb-4 text-gray text-center"}>
                    Do you have account?
                </Text>
                <CustomButton onPress={()=>{
                    router.push({
                        pathname:"/(auths)/(sign-up)/"
                    })
                }} bg={'bg-white'} color={"text-black"} title={i18n.t('signUp.signUp')} />
            </View>
        </View>
    )
}
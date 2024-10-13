import CustomButton from "@/components/customs/CustomButton";
import CustomInput from "@/components/customs/CustomInput";
import { useAppProvider } from "@/contexts/AppProvider";
import { View, Text } from "react-native";
import {useState} from "react";
import ReactNativeOtpTextinput from "react-native-otp-textinput/index";

const COUNT_INPUT = 5;
export default function ForgotPasswordScreen() {
    const {i18n} = useAppProvider();
    const [isSendEmail, setIsSendEmail] = useState(true);

    const handleSendEmail = () => {
        setIsSendEmail(false);
    }

    return (
        <View>
            <Text className="mb-3 text-[20px]">
                {i18n.t('forgetPassword.title')}
            </Text>
            <View >
                {
                    isSendEmail ? (<CustomInput label={i18n.t('forgetPassword.email')} />) : (
                        <View className={"mb-3"}>
                            <Text>Nhập mã </Text>
                            <ReactNativeOtpTextinput inputCount={COUNT_INPUT} />
                        </View>
                    )
                }
                <CustomButton onPress={handleSendEmail} title={i18n.t('forgetPassword.send')} />
            </View>
        </View>
    )
}
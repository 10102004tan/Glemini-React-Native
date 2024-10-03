import { Image, View, Text, Pressable, Alert } from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import CardTypeUser from "../../../components/customs/CardTypeUser";
import { useAppProvider } from "@/contexts/AppProvider";


const SignInChooseType = () => {
    const {i18n} = useAppProvider();
    return (
        <View className="flex h-[80%]">
            <Text className="text-[24px] mt-[20px] mb-[100px]">{i18n.t('signUp.choice.title')}</Text>
            <View>
                <CardTypeUser onPress={() => {router.push({pathname:'/sign-up',params:{type:'student'}})}} type={i18n.t('signUp.choice.student')} image={'https://cdn-icons-png.flaticon.com/512/354/354637.png'} description={i18n.t('signUp.choice.studentDescription')} />
                <CardTypeUser onPress={()=>{router.push({pathname:'/sign-up',params:{type:'teacher'}})}} type={i18n.t('signUp.choice.teacher')} image={'https://cdn-icons-png.flaticon.com/512/1995/1995574.png'} description={i18n.t('signUp.choice.teacherDescription')} />
            </View>
        </View>
    )
}

export default SignInChooseType;
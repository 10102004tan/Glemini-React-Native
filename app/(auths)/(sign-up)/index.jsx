import { Image, View, Text, Pressable, Alert } from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import CardTypeUser from "../../../components/customs/CardTypeUser";


const SignInChooseType = () => {

    return (
        <View className="flex h-[80%]">
            <Text className="text-[24px] mt-[20px] mb-[100px]">Bạn đang sử dụng Quiz ở đâu ?</Text>
            <View>
                <CardTypeUser onPress={() => {router.push({pathname:'/sign-up',params:{type:'student'}})}} type={'Học sinh'} image={'https://cdn-icons-png.flaticon.com/512/354/354637.png'} description={'Tham gia các hoạt động lớp học vui nhộn'} />
                <CardTypeUser onPress={()=>{router.push({pathname:'/sign-up',params:{type:'teacher'}})}} type={'Giáo viên'} image={'https://cdn-icons-png.flaticon.com/512/1995/1995574.png'} description={'Quản lý các bài kiểm tra, lớp học và kết quả'} />
            </View>
        </View>
    )
}

export default SignInChooseType;
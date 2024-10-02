import { useContext, useEffect, useState } from "react";
import { Alert, Text, View, Image, Pressable } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
    const { userData: { accessToken, _id }, signOut, processAccessTokenExpired } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [info, setInfo] = useState(null);
    const [avatar, setAvatar] = useState(null);




    useEffect(() => {
        fetchDataProfile();
    }, [accessToken]);


    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        })

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const fetchDataProfile = async () => {
        fetch('http://10.0.106.188:3000/api/v1/me', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${accessToken}`,
                'x-client-id': _id
            },
        })
            .then((response) => response.json())
            .then(async (data) => {
                if (data.message === 'expired') {
                    setIsLoading(true);
                    await processAccessTokenExpired();
                }
                setInfo(data);
                setIsLoading(false);
            }).catch((error) => {
                console.log(error);
            });
    }

    if (isLoading) {
        return (
            <View className="h-[100%] bg-white">
                <Text>Loading...</Text>
            </View>
        )
    }

    return (
        <View className="bg-white h-[100%]">
            <View className="mb-3 h-[200px] bg-[#431244] flex justify-center items-center relative">
                <Pressable onPress={pickImageAsync}>
                    <Image className="w-[50px] h-[50px] rounded-full bg-white" source={{ uri: (avatar ? avatar : 'https://cdn-icons-png.flaticon.com/512/25/25231.png') }} alt="avatar" />
                    <View className="w-[50px] h-[50px] absolute text-center flex justify-center  bg-[#00000045] rounded-full items-center">
                        <Text className="text-white absolute bottom-0">Sửa</Text>
                    </View>
                </Pressable>
            </View>
            <View className="px-3">
                <CardSetting title="Họ và tên" description="Chỉnh sửa ngay" isActice={true} />
                <CardSetting title="Trường" description="Chỉnh sửa ngay" />
                <CardSetting title="Email" description="Chỉnh sửa ngay" />
                <CardSetting title="Mật khẩu" description="Chỉnh sửa ngay" />
                <Pressable >
                    <View className="py-3 border mt-5">
                        <Text className="text-center">Lưu</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    )

}

function CardSetting({ isActice, title, description }) {
    return (
        <View className="flex flex-row justify-between py-3 border-b-[1px] border-b-[#eee] mb-3">
            <Text>{title}</Text>
            <View className="flex flex-row gap-2 items-center">
                <Text className={(isActice ? "text-[#e36334]" : "text-[#8d8c8c]")}>{description}</Text>
                <FontAwesome name="chevron-right" size={16} color="black" />
            </View>
        </View>
    )
}


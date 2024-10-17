import { useContext, useEffect, useState } from 'react';
import {Alert, Text, View, Image, Pressable, TouchableOpacity} from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Link, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import CardSetting from '@/components/customs/CardSetting';
import { useAppProvider } from '@/contexts/AppProvider';
import PROFCODE from "../../utils/ProfCode";
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import CustomButton from "@/components/customs/CustomButton";

export default function ProfileScreen() {
	const {
		userData: { accessToken, _id, user_type,user_avatar },setUserData,userData
	} = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(false);
	const [disable, setDisable] = useState(false);
	const [avatar, setAvatar] = useState({
		uri: user_avatar,
		type: 'image/png',
		name: 'avatar.png',
	});
	const [isEditAvatar, setIsEditAvatar] = useState(false);
	const { i18n } = useAppProvider();
	// formData



	const pickImageAsync = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			setAvatar((prevAvatar) => ({
				...prevAvatar,
				uri: result.assets[0].uri,
				type: result.assets[0].type,
				name: result.assets[0].fileName
			}));
			setIsEditAvatar(true);
		}
	};

	const updateAvatarHandler = async () => {
		setDisable(true)
		const body = new FormData();
		body.append('avatar', {
			uri: avatar.uri,
			type: `${avatar.type}/${avatar.name.split(".")[1]}`,
			name: avatar.name,
		});

		try {
			const res = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.PROFILE_EDIT}`, {
				method: 'PUT',
				headers: {
					'authorization': `${accessToken}`,
					'Content-Type': 'multipart/form-data',
					'x-client-id': `${_id}`,
				},
				body: body,
			});

			const data = await res.json();
			if (data.statusCode === 200) {
				setIsEditAvatar(false);
				const dataStore = { ...userData,user_avatar:data.metadata.user_avatar};
				await AsyncStorage.setItem("userData", JSON.stringify(dataStore));
				setUserData(dataStore);
				Toast.show({
					type: 'success',
					text1: 'Success',
					text2: 'Update avatar successfully'
				})
			}
			setDisable(false)
		}catch (error) {
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2: 'Update avatar failed'
			});
			setDisable(false)
		}

	};

	if (isLoading) {
		return (
			<View className="h-[100%] bg-white">

			</View>
		);
	}

	return (
		<View className="bg-white h-[100%]">
			<View className="mb-3 h-[200px] bg-[#431244] flex justify-center items-center relative">
				<Pressable onPress={pickImageAsync}>
					<Image
						className="w-[50px] h-[50px] rounded-full bg-white"
						source={{
							uri: avatar
								? avatar.uri
								: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
						}}
						alt="avatar"
					/>
					<View className="w-[50px] h-[50px] absolute text-center flex justify-center  bg-[#00000045] rounded-full items-center">
						<Text className="text-white absolute bottom-0">
							{i18n.t('profile.edit')}
						</Text>
					</View>
				</Pressable>
			</View>
			<View className="px-3">
				<CardSetting
					onPress={() => {
						router.push({
							pathname: '/profile-edit',
							params: { title: i18n.t("profile.info") },
						});
					}}
					title={i18n.t("profile.info")}
					description={i18n.t('profile.editNow')}
					isActice={true}
				/>
				<CardSetting
					onPress={() => {
						router.push({
							pathname: '/change-password',
						});
					}}
					title={i18n.t('profile.password')}
					description={i18n.t('profile.editNow')}
				/>
				{user_type === "teacher" && (<CardSetting onPress={()=>{router.push({pathname:'/profile-auth'})}} title={i18n.t('profile.infoAuth')} description={i18n.t('profile.editNow')} />)}
				{isEditAvatar && (<CustomButton disabled={disable} bg={"bg-white"} color={"text-black"} onPress={updateAvatarHandler} title={i18n.t('profile.save')} />)}

			</View>
		</View>
	);

}

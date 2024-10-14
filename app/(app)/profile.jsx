import { useContext, useEffect, useState } from 'react';
import { Alert, Text, View, Image, Pressable } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Link, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import CardSetting from '@/components/customs/CardSetting';
import { useAppProvider } from '@/contexts/AppProvider';
import PROFCODE from "../../utils/ProfCode";
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';

export default function ProfileScreen() {
	const {
		userData: { accessToken, _id },
		signOut,
		processAccessTokenExpired,
	} = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(false);
	const [avatar, setAvatar] = useState({
		uri: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
		tyle: 'image/png',
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

	updateAvatarHandler = async () => {
		let formData = new FormData();
		formData.append('user_avatar', {
			uri: avatar.uri,
			type: avatar.type,
			name: avatar.fileName,
		});

		fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.PROFILE_EDIT}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'multipart/form-data',
				authorization: `${accessToken}`,
				'x-client-id': _id,
			},
			body: formData
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.statusCode === 200) {
					Alert.alert('Notification', 'Update successfully');
				}
				console.log(data);
			})
			.catch((error) => {
				console.log(error.message);
			});
	};

	if (isLoading) {
		return (
			<View className="h-[100%] bg-white">
				<Text>Loading...</Text>
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
							params: { title: 'Thong tin ca nhan' },
						});
					}}
					title={"Thông tin cá nhân"}
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
				<CardSetting onPress={()=>{router.push({pathname:'/profile-auth'})}} title={i18n.t('profile.infoAuth')} description={i18n.t('profile.editNow')} />
				{isEditAvatar && (<Pressable onPress={updateAvatarHandler}>
					<View className="py-3 border mt-5">
						<Text className="text-center">{i18n.t('profile.save')}</Text>
					</View>
				</Pressable>)}

			</View>
		</View>
	);

}

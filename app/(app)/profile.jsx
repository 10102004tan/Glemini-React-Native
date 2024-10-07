import { useContext, useEffect, useState } from 'react';
import { Alert, Text, View, Image, Pressable } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Link, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import CardSetting from '@/components/customs/CardSetting';
import { useAppProvider } from '@/contexts/AppProvider';

export default function ProfileScreen() {
	const {
		userData: { accessToken, _id },
		signOut,
		processAccessTokenExpired,
	} = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(false);
	const [info, setInfo] = useState(null);
	const [avatar, setAvatar] = useState(null);
	const { i18n } = useAppProvider();

	useEffect(() => {
		fetchDataProfile();
	}, [accessToken]);

	const pickImageAsync = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			setAvatar(result.assets[0].uri);
		}
	};

	const fetchDataProfile = async () => {
		fetch('http://10.0.106.188:3000/api/v1/me', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				authorization: `${accessToken}`,
				'x-client-id': _id,
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
			})
			.catch((error) => {
				console.log(error);
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
								? avatar
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
							params: { title: 'Họ và tên' },
						});
					}}
					title={i18n.t('profile.fullname')}
					description={i18n.t('profile.editNow')}
					isActice={true}
				/>
				<CardSetting
					onPress={() => {
						router.push({
							pathname: '/profile-edit',
							params: { title: 'Trường' },
						});
					}}
					title={i18n.t('profile.school')}
					description={i18n.t('profile.editNow')}
				/>
				<CardSetting
					onPress={() => {
						router.push({
							pathname: '/profile-edit',
							params: { title: 'Email' },
						});
					}}
					title={i18n.t('profile.email')}
					description={i18n.t('profile.editNow')}
				/>
				<CardSetting
					onPress={() => {
						router.push({
							pathname: '/profile-edit',
							params: { title: 'Mật khẩu' },
						});
					}}
					title={i18n.t('profile.password')}
					description={i18n.t('profile.editNow')}
				/>
				<Pressable>
					<View className="py-3 border mt-5">
						<Text className="text-center">{i18n.t('profile.save')}</Text>
					</View>
				</Pressable>
			</View>
		</View>
	);

}

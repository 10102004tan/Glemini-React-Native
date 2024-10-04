import { Redirect, Stack } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Text, TouchableOpacity } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

export default function AppRootLayout() {
	const { userData, isLoading, fetchStatus } = useContext(AuthContext);
	const { title } = useGlobalSearchParams();

	useEffect(() => {
		if (userData) {
			fetchStatus();
		}
	}, [userData]);

	if (isLoading) {
		return <Text>Loading...</Text>;
	}

	if (!userData) {
		return <Redirect href={'/(auths)/sign-in'} />;
	}

	return (
		<Stack>
			<Stack.Screen
				name="(home)"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="profile"
				options={{
					headerTitle: 'Thông tin cá nhân',
				}}
			/>

			<Stack.Screen
				name="profile-edit"
				options={{
					headerTitle: title,
					headerRight: () => (
						<FontAwesome
							onPress={() => {}}
							name="save"
							size={24}
							color="black"
						/>
					),
				}}
			/>

			<Stack.Screen
				name="settings"
				options={{
					headerTitle: 'Cài đặt',
				}}
			/>

			<Stack.Screen
				name="(quiz)/list"
				options={{
					headerTitle: 'Danh sách các quiz',
					// headerRight: () => {
					// 	return <Text>Hello</Text>;
					// },
				}}
			/>

			<Stack.Screen
				name="(quiz)/overview"
				options={{
					headerTitle: 'Chi tiết',
					headerRight: () => {
						return (
							<TouchableOpacity className="flex items-center justify-center flex-row px-4 py-2 bg-primary rounded-xl">
								<Ionicons
									name="save-outline"
									size={24}
									color="white"
								/>
								<Text className="ml-2 text-white">
									Lưu bài quiz
								</Text>
							</TouchableOpacity>
						);
					},
				}}
			/>

			<Stack.Screen
				name="(quiz)/detail_quiz"
				options={{
					headerTitle: 'Chi tiết Quiz Thu Vien',
				}}
			/>

			<Stack.Screen
				name="(quiz)/create_title"
				options={{
					headerTitle: 'Chi tiết Quiz Thu Vien',
				}}
			/>
		</Stack>
	);
}

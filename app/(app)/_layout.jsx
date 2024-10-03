import { Redirect, Stack } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Text } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function AppRootLayout() {
	const { userData, isLoading, fetchStatus } = useContext(AuthContext);
	const {title} = useGlobalSearchParams();

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
						<FontAwesome onPress={()=>{}} name="save" size={24} color="black" />
					),
				}}
			/>

			<Stack.Screen
				name="settings"
				options={{
					headerTitle: 'Cài đặt',
				}}
			/>

		</Stack>
	);
}

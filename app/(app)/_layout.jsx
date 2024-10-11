import { Redirect, Stack } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Text, TouchableOpacity } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import ResultReview from './(result)/review';
import { useAppProvider } from '@/contexts/AppProvider';


export default function AppRootLayout() {
	const { userData, isLoading, fetchStatus } = useContext(AuthContext);
	const {i18n} = useAppProvider();
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
    return <Redirect href={"/(auths)/sign-in"} />;
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
					headerTitle: i18n.t('profile.title'),
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
					headerTitle: i18n.t('settings.title'),
				}}
			/>

			<Stack.Screen
				name="(quiz)/list"
				options={{
					headerTitle: 'Danh sách các quiz',
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
					headerTitle: '',
				}}
			/>

			<Stack.Screen
				name="(quiz)/edit_quiz_question"
				options={{
					headerTitle: '',
					headerRight: () => {
						return (
							<View className="flex flex-row items-center justify-between">
								<Text className="ml-4 px-4 py-2 rounded-xl bg-overlay">
									Loại câu hỏi
								</Text>
							</View>
						);
					},
				}}
			/>

			<Stack.Screen
				name="(play)/single"
				options={{
					headerShown: false,
				}}
			/>

			<Stack.Screen
				name="(result)/review"
				options={{
					headerShown: false,
				}}
			/>
		</Stack>
	);
}

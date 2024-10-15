import { Redirect, Stack } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Alert, Text, TouchableOpacity } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import ResultReview from './(result)/review';
import { useAppProvider } from '@/contexts/AppProvider';
import { useQuizProvider } from '@/contexts/QuizProvider';
import AntDesign from '@expo/vector-icons/AntDesign';
import SpinningIcon from '@/components/loadings/SpinningIcon';
import Toast from 'react-native-toast-message';

export default function AppRootLayout() {
	const { userData, isLoading, fetchStatus, setTeacherStatus } =
		useContext(AuthContext);
	const { isSave, setIsSave } = useQuizProvider();
	const { i18n, socket } = useAppProvider();
	const { title } = useGlobalSearchParams();

	useEffect(() => {
		if (userData) {
			fetchStatus();
		}
	}, [userData]);

	socket.on('update-status', ({ user_id, teacher_status }) => {
		if (userData._id === user_id) {
			setTeacherStatus(teacher_status);
		}
	});

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
					headerTitle: i18n.t('profile.title'),
				}}
			/>

			<Stack.Screen
				name="change-password"
				options={{
					headerTitle: i18n.t('profile.title'),
				}}
			/>

			<Stack.Screen
				name="profile-edit"
				options={{
					headerTitle: title,
				}}
			/>

			<Stack.Screen
				name="profile-auth"
				options={{
					headerTitle: i18n.t('profile.infoAuth'),
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
							<TouchableOpacity
								className="flex items-center justify-center flex-row px-4 py-2 bg-primary rounded-xl"
								onPress={() => {
									if (!isSave) {
										setIsSave(true);
									}
								}}
							>
								{isSave ? (
									<SpinningIcon />
								) : (
									<Ionicons
										name="save"
										size={20}
										color="white"
									/>
								)}
								<Text className="ml-2 text-white">Lưu</Text>
							</TouchableOpacity>
						);
					},
				}}
			/>

			<Stack.Screen
				name="(quiz)/demo_create_quiz_by_template"
				options={{
					headerTitle: 'Tải file câu hỏi',
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

			<Stack.Screen
				name="(collection)/detail_collection"
				options={{
					headerTitle: 'Quay lại bộ sưu tập',
				}}
			/>
		</Stack>
	);
}

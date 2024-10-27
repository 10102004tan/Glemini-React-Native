import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect, useRef, useState} from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import Providers from '@/contexts/Providers';
import { Text, View, Button, Platform } from 'react-native';
import * as Application from 'expo-application';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// Bỏ qua cảnh báo chứa chuỗi "defaultProps"
LogBox.ignoreLogs(['defaultProps']);
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';




Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

async function sendPushNotification(expoPushToken) {
	const message = {
		to: expoPushToken,
		sound: 'default',
		title: 'Original Title',
		body: 'And here is the body!',
		data: { someData: 'goes here' },
	};

	await fetch('https://exp.host/--/api/v2/push/send', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Accept-encoding': 'gzip, deflate',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(message),
	});
}

function handleRegistrationError(errorMessage) {
	alert(errorMessage);
	throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	if (Device.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			handleRegistrationError('Permission not granted to get push token for push notification!');
			return;
		}
		const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
		if (!projectId) {
			handleRegistrationError('Project ID not found');
		}
		try {
			const pushTokenString = (
				await Notifications.getExpoPushTokenAsync({
					projectId,
				})
			).data;
			console.log(pushTokenString);
			return pushTokenString;
		} catch (e) {
			handleRegistrationError(`${e}`);
		}
	} else {
		handleRegistrationError('Must use physical device for push notifications');
	}
}


export default function RootLayout() {
	const [loaded] = useFonts({
		'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
		'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
		'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
		'Poppins-ExtraLight': require('../assets/fonts/Poppins-ExtraLight.ttf'),
		'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
		'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
		'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
		'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
		'Poppins-Thin': require('../assets/fonts/Poppins-Thin.ttf'),
	});



	const [expoPushToken, setExpoPushToken] = useState('');
	const [notification, setNotification] = useState();
	const notificationListener = useRef();
	const responseListener = useRef();

	useEffect(() => {
		registerForPushNotificationsAsync()
			.then(token => setExpoPushToken(token ?? ''))
			.catch((error) => setExpoPushToken(`${error}`));

		notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
			setNotification(notification);
		});

		responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
			console.log(response);
		});

		return () => {
			notificationListener.current &&
			Notifications.removeNotificationSubscription(notificationListener.current);
			responseListener.current &&
			Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<GestureHandlerRootView>
			<Providers>
				<Slot />
				<Toast />
			</Providers>
		</GestureHandlerRootView>
	);
}


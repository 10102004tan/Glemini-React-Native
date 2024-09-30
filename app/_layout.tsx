import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import AppProvider from '@/contexts/AppProvider';
import UserProvider from '@/contexts/UserProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
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

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<ThemeProvider
			value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
		>
			<AppProvider>
				<UserProvider>
					<GestureHandlerRootView>
						<Stack initialRouteName="quiz/edit_quiz_question.jsx">
							<Stack.Screen
								name="(tabs)"
								options={{ headerShown: false }}
							/>
							<Stack.Screen
								name="quiz/create_title"
								options={{ headerShown: false }}
							/>
							<Stack.Screen
								name="quiz/overview"
								options={{ headerShown: false }}
							/>
							<Stack.Screen
								name="quiz/edit_quiz_question"
								options={{ headerShown: false }}
							/>
							<Stack.Screen
							name="play/single"
							options={{ headerShown: false }}
							/>
							<Stack.Screen
							name="result/single"
							options={{ headerShown: false }}
							/>
							<Stack.Screen name="+not-found" />
						</Stack>
					</GestureHandlerRootView>
				</UserProvider>
			</AppProvider>
		</ThemeProvider>
	);
}

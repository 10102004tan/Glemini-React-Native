import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import AppProvider from '@/contexts/AppProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import Toast from 'react-native-toast-message';
import QuestionProvider from '@/contexts/QuestionProvider';
import QuizProvider from '@/contexts/QuizProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// Bỏ qua cảnh báo chứa chuỗi "defaultProps"
LogBox.ignoreLogs(['defaultProps']);

export default function RootLayout() {
  const [loaded] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
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
		<GestureHandlerRootView>
			<AppProvider>
				<AuthProvider>
					<QuizProvider>
						<QuestionProvider>
							<Slot />
						</QuestionProvider>
					</QuizProvider>
				</AuthProvider>
				<Toast/>
			</AppProvider>
		</GestureHandlerRootView>
	);
}

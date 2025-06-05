import { useFonts } from 'expo-font';
import { Redirect, Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import Toast from 'react-native-toast-message-custom';
import ToastV2 from 'react-native-toast-message';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import {
  Dimensions,
  FlatList,
  LogBox,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Providers from '@/contexts/Providers';
import * as Notifications from 'expo-notifications';
import { Image, Animated } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';
import ModalContainer from '@/components/customs/ModalContainer';

// SplashScreen.preventAutoHideAsync();
// LogBox.ignoreLogs(["defaultProps"]);

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });
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

  const { checkAuth} = useAuthStore();
    useEffect(() => {
      checkAuth().catch((error) => {
        if (error.message === 'Network Error') {
          Alert.alert(
            '[DEV] lỗi kết nối mạng',
            'Thay đổi ip hoặc thử lại sau',
            // hidden buttons
            [],
          );
        }
      });
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
    <GestureHandlerRootView
    style={{ flex: 1 }}>
      <Providers>
        <Slot />
        <Toast />
        <ToastV2 />
        <ModalContainer />
      </Providers>
    </GestureHandlerRootView>
  );
}

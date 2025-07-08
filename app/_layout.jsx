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
// import * as TaskManager from 'expo-task-manager';
import { useAuthStore } from '@/store/useAuthStore';
import ModalContainer from '@/components/customs/ModalContainer';
import { NotificationProvider } from '@/contexts/NotificationContext';

// SplashScreen.preventAutoHideAsync();
LogBox.ignoreLogs(['defaultProps']);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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

    'Quicksand-Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Light': require('../assets/fonts/Quicksand-Light.ttf'),
    'Quicksand-Medium': require('../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Providers>
        <NotificationProvider>
          <Slot />
          <Toast />
          <ToastV2 />
          <ModalContainer />
        </NotificationProvider>
      </Providers>
    </GestureHandlerRootView>
  );
}

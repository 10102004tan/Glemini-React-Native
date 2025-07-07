import { Redirect, router, Stack } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Text, TouchableOpacity } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import AppProvider, { useAppProvider } from '@/contexts/AppProvider';
import { useQuizProvider } from '@/contexts/QuizProvider';
import SpinningIcon from '@/components/loadings/SpinningIcon';
import { useAuthStore } from '@/store/useAuthStore';
import * as SecureStore from 'expo-secure-store';
import socket from '@/libs/socket';
import Toast from 'react-native-toast-message';
import { useModal } from '@/store/useModal';
import { useNotification } from '@/contexts/NotificationContext';

export default function AppRootLayout() {
  const { isSave, setIsSave } = useQuizProvider();
  const { i18n } = useAppProvider();
  const { title } = useGlobalSearchParams();
  const { openBottomSheetMoreOptions, openBottomSheetSaveToLibrary, closeBottomSheet } =
    useAppProvider();
  const { showModal, hideModal } = useModal();

  const { isSignedIn, user, signOut, error } = useAuthStore();
  const { expoPushToken, sendPushTokenToServer } = useNotification();

  if (!isSignedIn && !user) {
    return <Redirect href={'/login'} />;
  }

  useEffect(() => {
    socket.connect();
    socket.on('connect', async () => {
      const token = await SecureStore.getItemAsync('Authorization');
      const xClientId = await SecureStore.getItemAsync('x-client-id');
      console.log('[(protected)/_layout] connected to socket server');
      socket.emit('authentication', {
        authorization: token,
        xClientId,
      });
    });

    socket.on('ping', () => {
      console.log('ping from socket server');
      socket.emit('pong', {
        timestamp: Date.now(),
      });
    });

    socket.on('unauthorized', async () => {
      console.log('[(protected)/_layout] : socket jwt unauthorized');
      socket.disconnect();
      // remove token from local storage
      await SecureStore.deleteItemAsync('Authorization');
      // set isSignedIn to false
      // useAuthStore.setState({ isSignedIn: false, user: null })
      console.log('disconnected from socket server');
    });

    socket.on('updateRole', (data) => {
      showModal({
        title: 'Thông báo cập nhật',
        content:
          "Tài khoản của bạn đã được kích hoạt thành công! Vui lòng nhấn nút 'Đăng nhập lại' để đến truy cập tài nguyên.",
        buttonLeft: {
          text: 'Đăng nhập lại',
          onPress: () => {
            signOut().then(() => {
              if (!error) {
                hideModal();
                router.push('/(auth)/login');
              }
            });
          },
        },
      });
    });

    return () => {
      socket.off('connect');
      socket.off('ping');
      socket.off('unauthorized');
      socket.off('react-native');
      socket.disconnect();
      console.log('disconnected from socket server');
    };
  }, [socket]);

  useEffect(() => {
    if (
      isSignedIn &&
      user &&
      user.user_role === 'user' &&
      user?.status_teacher_verified === 'active'
    ) {
      showModal({
        title: 'Thông báo',
        content:
          "Tài khoản của bạn đã được kích hoạt thành công! Vui lòng nhấn nút 'Đăng nhập lại' để đến truy cập tài nguyên.",
        buttonLeft: {
          text: 'Đăng nhập lại',
          onPress: () => {
            signOut({
              deviceToken: expoPushToken || null,
            }).then(() => {
              if (!error) {
                hideModal();
                router.push({
                  pathname: '/(auth)/login',
                });
              }
            });
          },
        },
      });
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    if (expoPushToken && user) {
      sendPushTokenToServer(user.user_id);
    }
  }, [user, expoPushToken]);

  return (
    <Stack>
      <Stack.Screen
        name="(home)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="(homev2)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="pw-change"
        options={{
          headerTitle: i18n.t('profile.title'),
          animation: 'fade_from_bottom',
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
          headerTitle: i18n.t('overview_quiz_screen.detail'),
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
                {isSave ? <SpinningIcon /> : <Ionicons name="save" size={20} color="white" />}
                <Text className="ml-2 text-white">
                  {i18n.t('overview_quiz_screen.btnSaveDetail')}
                </Text>
              </TouchableOpacity>
            );
          },
        }}
      />

      <Stack.Screen
        name="(quiz)/create_quiz_by_template"
        options={{
          headerTitle: 'Tải file câu hỏi',
        }}
      />

      <Stack.Screen
        name="(quiz)/detail_quiz"
        options={{
          headerTitle: i18n.t('overview_quiz_screen.back'),
          headerRight: () => {
            return (
              <View className="flex flex-row items-center justify-between">
                <TouchableOpacity onPress={openBottomSheetMoreOptions}>
                  <Entypo name="dots-three-vertical" size={24} color="black" />
                </TouchableOpacity>
              </View>
            );
          },
        }}
      />

      <Stack.Screen
        name="(quiz)/create_title"
        options={{
          headerTitle: '',
        }}
      />

      <Stack.Screen
        name="check/[value]"
        options={{
          headerShown: false,
          headerTitle: '',
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
        name="(report)/detail_report"
        options={{
          headerTitle: i18n.t('report.reportDetail.title'),
        }}
      />

      <Stack.Screen
        name="(report)/overview_report"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="(classroom)/teacher_detail"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="(teacher)/teacher_room_wait"
        options={{
          headerShown: false,
          // headerTitle: "Chi tiết lớp học",
        }}
      />

      <Stack.Screen
        name="(teacher)/teacher_room_wait_result"
        options={{
          headerShown: false,
          // headerTitle: "Chi tiết lớp học",
        }}
      />

      <Stack.Screen
        name="(room)/scanner"
        options={{
          headerShown: false,
          // headerTitle: "Chi tiết lớp học",
        }}
      />

      <Stack.Screen
        name="(room)/list"
        options={{
          headerTitle: i18n.t('room_item.listRoom'),
        }}
      />

      <Stack.Screen
        name="(play)/realtime"
        options={{
          headerShown: false,
          // headerTitle: "Chi tiết lớp học",
        }}
      />

      <Stack.Screen
        name="(play)/demo"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(result)/single"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="(classroom)/student_detail"
        options={{
          headerTitle: i18n.t('classroom.student.titleScreen'),
        }}
      />

      <Stack.Screen
        name="(classroom)/upload_excel"
        options={{
          headerTitle: i18n.t('classroom.upload.title'),
        }}
      />

      <Stack.Screen
        name="(collection)/detail_collection"
        options={{
          headerTitle: 'Quay lại bộ sưu tập',
        }}
      />

      <Stack.Screen
        name="notification"
        options={{
          headerTitle: i18n.t('notification.title'),
        }}
      />
    </Stack>
  );
}

const ModelContent = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* Thông báo kích hoạt tài khoản thành công */}
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Tài khoản của bạn đã được kích hoạt thành công! Vui lòng nhấn nút "Đăng nhập lại" để đến
        truy cập tài nguyên.
      </Text>

      {/* button */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}
      >
        <View
          style={{
            backgroundColor: '#2196F3',
            padding: 10,
            borderRadius: 5,
            flex: 1,
            marginLeft: 5,
          }}
          onTouchEnd={() => {
            // Handle continue action
            console.log('Continue to dashboard');
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Đăng nhập lại</Text>
        </View>
      </View>
    </View>
  );
};

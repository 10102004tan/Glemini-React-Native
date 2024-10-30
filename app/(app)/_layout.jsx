import { Redirect, Stack } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Text, TouchableOpacity } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useAppProvider } from '@/contexts/AppProvider';
import { useQuizProvider } from '@/contexts/QuizProvider';
import SpinningIcon from '@/components/loadings/SpinningIcon';
import Toast from 'react-native-toast-message-custom';
import Icon from "react-native-vector-icons/Ionicons";

export default function AppRootLayout() {
   const { userData, isLoading, fetchStatus, setTeacherStatus, setNotification } =
      useContext(AuthContext);
   const { isSave, setIsSave } = useQuizProvider();
   const { i18n, socket } = useAppProvider();
   const { title } = useGlobalSearchParams();
   const {
      openBottomSheetMoreOptions,
      openBottomSheetSaveToLibrary,
      closeBottomSheet,
   } = useAppProvider();

   useEffect(() => {
      if (userData) {
         fetchStatus();
         socket.on(
            'update-status',
            ({ user_id, teacher_status, message, status }) => {
               if (userData._id === user_id) {
                  setTeacherStatus(teacher_status);
                  Toast.show({
                     type: status,
                     text1: 'Thông báo',
                     text2: message,
                     visibilityTime: 2000,
                  });
               }
            }
         );

         socket.on(`notification${userData._id}`, (noti) => {
            console.log(`TEST`, noti);
            setNotification((prev) => {
               return [noti, ...prev];
            });
         })
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
               headerShown: false
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
               headerTitle: 'Quay lại thư viện',
               headerRight: () => {
                  return (
                     <View className="flex flex-row items-center justify-between">
                        <TouchableOpacity
                           onPress={openBottomSheetMoreOptions}
                        >
                           <Entypo
                              name="dots-three-vertical"
                              size={24}
                              color="black"
                           />
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
            name="(quiz)/edit_quiz_question"
            options={{
               headerTitle: '',
               headerRight: () => {
                  return (
                     <View className="flex flex-row items-center justify-between">
                        <Text className="ml-4 px-4 py-2 rounded-xl bg-overlay">
                           Chỉnh sửa câu hỏi
                        </Text>
                     </View>
                  );
               },
            }}
         />


         <Stack.Screen
            name="(classroom)/teacher_detail"
            options={{
               headerTitle: "Chi tiết lớp học",
            }}
         />

         <Stack.Screen
            name="(classroom)/student_detail"
            options={{
               headerShown: false,
            }}
         />

         <Stack.Screen
            name="(classroom)/upload_excel"
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

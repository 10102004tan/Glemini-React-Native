import { Redirect, router, Stack } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity } from "react-native";
import { useGlobalSearchParams } from "expo-router";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import AppProvider, { useAppProvider } from "@/contexts/AppProvider";
import { useQuizProvider } from "@/contexts/QuizProvider";
import SpinningIcon from "@/components/loadings/SpinningIcon";
import { useAuthStore } from "@/store/useAuthStore";
import * as SecureStore from "expo-secure-store";
import { socket } from "@/libs/socket";

export default function AppRootLayout() {
   const { isSave, setIsSave } = useQuizProvider();
   const { i18n } = useAppProvider();
   const { title } = useGlobalSearchParams();
   const {
      openBottomSheetMoreOptions,
      openBottomSheetSaveToLibrary,
      closeBottomSheet,
   } = useAppProvider();


   const { isSignedIn, user } = useAuthStore();

  if (!isSignedIn && !user) {
    return <Redirect href={'/login'} />
  }


//   useEffect(() => {
//     socket.connect()
//     socket.on('connect', async () => {
//       const token = await SecureStore.getItemAsync('Authorization')
//       console.log('connected to socket server')
//       console.log('token', token)
//       socket.emit('authentication', {
//         Authorization: token
//       })
//       socket.on('unauthorized', async () => {
//         // console.log('authenticated')
//         console.log('unauthorized')
//         socket.disconnect()
//         // remove token from local storage
//         await SecureStore.deleteItemAsync('Authorization')
//         // set isSignedIn to false
//         setIsSignedIn(false)
//         console.log('disconnected from socket server')
//       })
//     })

//     socket.on('ping', () => {
//       console.log('ping from socket server')
//       socket.emit('pong', ({
//         timestamp: Date.now()
//       }))
//     })

//     return () => {
//       socket.off('connect')
//       socket.off('ping')
//       socket.off('unauthorized')
//       socket.disconnect()
//       console.log('disconnected from socket server')
//     }
//   }, [socket])

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
            name="profile"
            options={{
               headerTitle: i18n.t("profile.title"),
            }}
         />

         <Stack.Screen
            name="change-password"
            options={{
               headerTitle: i18n.t("profile.title"),
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
               headerTitle: i18n.t("profile.infoAuth"),
            }}
         />


         <Stack.Screen
            name="(quiz)/list"
            options={{
               headerTitle: "Danh sách các quiz",
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
                        {isSave ? (
                           <SpinningIcon />
                        ) : (
                           <Ionicons name="save" size={20} color="white" />
                        )}
                        <Text className="ml-2 text-white">{i18n.t('overview_quiz_screen.btnSaveDetail')}</Text>
                     </TouchableOpacity>
                  );
               },
            }}
         />

         <Stack.Screen
            name="(quiz)/create_quiz_by_template"
            options={{
               headerTitle: "Tải file câu hỏi",
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
               headerTitle: "",
            }}
         />

         <Stack.Screen
            name="check/[value]"
            options={{
               headerShown: false,
               headerTitle: "",
            }}
         />

         <Stack.Screen
            name="(quiz)/edit_quiz_question"
            options={{
               headerTitle: "",
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
               headerTitle: i18n.t('classroom.student.titleScreen'),
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
               headerTitle: "Quay lại bộ sưu tập",
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

import { Camera, CameraView } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import {
   Alert,
   AppState,
   Linking,
   Platform,
   SafeAreaView,
   StatusBar,
   StyleSheet,
} from "react-native";
import { Overlay } from "./overlay";
import { useEffect, useRef } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { API_URL, API_VERSION, END_POINTS } from "@/configs/api.config";
import socket from "@/utils/socket";
import { useRoomProvider } from "@/contexts/RoomProvider";


export default function Home() {
   const qrLock = useRef(false);
   const appState = useRef(AppState.currentState);
   const router = useRouter();
   const { userData } = useAuthContext();

   const { setCurrentRoom } = useRoomProvider();

   const checkRoom = async (roomCode) => {
      const res = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_DETAIL}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'x-client-id': userData._id,
            authorization: userData.accessToken,
         },
         body: JSON.stringify({
            room_code: roomCode,
         }),
      })

      const notAccepted = ['completed', 'deleted'];

      const data = await res.json();
      if (data.statusCode === 200) {
         if (notAccepted.includes(data.metadata.status)) {
            Alert.alert('Thông báo', 'Không thể tham gia vào phòng chơi lúc này !!!');
         } else if (data.metadata.status === 'doing') {
            const res = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_CHECK_USER}`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'x-client-id': userData._id,
                  authorization: userData.accessToken,
               },
               body: JSON.stringify({
                  room_code: roomCode,
                  user_id: userData._id
               }),
            });

            const dt = await res.json();
            if (dt.statusCode === 200 && dt.metadata) {
               setCurrentRoom(data.metadata._id);
               socket.emit('joinRoom', { roomCode, user: userData });
               // Người dùng đang chơi bị out, khi join lại chuyển thẳng tới màn hình chơi

               router.replace({
                  pathname: '/(play)/realtime',
                  params:
                  {
                     roomCode: data.metadata.room_code, quizId: data.metadata.quiz_id, roomId: data.metadata._id, createdUserId: data.metadata.user_created_id
                  }
               });
            } else {
               Alert.alert('Thông báo', 'Bạn đã hoàn thành phòng chơi này !!!');
            }
         } else {
            try {
               // Xóa kết quả cũ nếu có
               const responseDeleteOldResult = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.RESULT_RESET}`, {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                     'x-client-id': userData._id,
                     authorization: userData.accessToken,
                  },
                  body: JSON.stringify({
                     room_id: data.metadata._id,
                     user_id: userData._id,
                  }),
               });
            } catch (error) {
               console.log(error)
            } finally {
               const checkAdded = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_ADD_USER}`, {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                     'x-client-id': userData._id,
                     authorization: userData.accessToken,
                  },
                  body: JSON.stringify({
                     room_code: data.metadata.room_code,
                     user_id: userData._id,
                  }),
               });
               const checkData = await checkAdded.json();
               // console.log(checkData)
               if (checkData.statusCode === 200) {
                  setCurrentRoom(data.metadata._id);
                  socket.emit('joinRoom', { roomCode, user: userData });
                  router.replace({
                     pathname: '/(app)/(teacher)/teacher_room_wait',
                     params: { roomCode: roomCode }
                  });
               } else {
                  if (checkData.message === "No room found") {
                     Alert.alert('Thông báo', 'Phòng chơi không tồn tại !!!');
                  } else if (checkData.message === "Room is full") {
                     Alert.alert('Thông báo', 'Số lượng người chơi đã đầy không thể tham gia !!!');
                  } else if (checkData.message === "User already joined room") {
                     Alert.alert('Thông báo', 'Bạn đã tham gia vào phòng chơi này !!!');
                  }
               }
            }
         }
      } else {
         Alert.alert('Thông báo', 'Mã phòng không tồn tại');
      }
   }

   useEffect(() => {
      const subscription = AppState.addEventListener("change", (nextAppState) => {
         if (
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
         ) {
            qrLock.current = false;
         }
         appState.current = nextAppState;
      });

      return () => {
         subscription.remove();
      };
   }, []);

   return (
      <SafeAreaView style={StyleSheet.absoluteFillObject}>
         <Stack.Screen
            options={{
               title: "Overview",
               headerShown: false,
            }}
         />
         {Platform.OS === "android" ? <StatusBar hidden /> : null}
         <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={({ data }) => {
               if (data && !qrLock.current) {
                  qrLock.current = true;
                  setTimeout(async () => {
                     checkRoom(data);
                  }, 500);
               }
            }}
         />
         <Overlay />
      </SafeAreaView>
   );
}

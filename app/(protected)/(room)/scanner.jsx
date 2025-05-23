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


export default function Scanner() {
   const qrLock = useRef(false);
   const appState = useRef(AppState.currentState);

   const { checkRoom } = useRoomProvider();

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
                  const code = data.split('--/check/')[1];
                  qrLock.current = true;

                  if (code) {
                     setTimeout(async () => {
                        checkRoom(code);
                     }, 500);
                  }

               }
            }}
         />
         <Overlay />
      </SafeAreaView>
   );
}

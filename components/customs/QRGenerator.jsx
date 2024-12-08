import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react'
import { TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { useRef } from 'react';
import { ToastAndroid } from 'react-native';
import { APP_PORT, IP } from '../../configs/app.config';
import { API_VERSION, END_POINTS } from '@/configs/api.config';
import Toast from 'react-native-toast-message-custom';
const QRGenerator = ({ value = '', handleShareRoom = () => { } }) => {
   const deepLinkUrl = `exp://${IP}:${APP_PORT}/--/check/` + value;

   const svgRef = useRef(null);

   const saveQrToDisk = async (svgRef) => {
      if (!svgRef.current) return;

      try {
         // Request permissions
         const { status } = await MediaLibrary.requestPermissionsAsync();
         if (status !== 'granted') {
            ToastAndroid.show('Permission denied!', ToastAndroid.SHORT);
            return;
         }

         // Convert SVG to data URL
         svgRef.current.toDataURL(async (data) => {
            const filePath = `${FileSystem.cacheDirectory}some-name.png`;
            await FileSystem.writeAsStringAsync(filePath, data, {
               encoding: FileSystem.EncodingType.Base64,
            });

            // Save to media library
            const asset = await MediaLibrary.createAssetAsync(filePath);
            await MediaLibrary.createAlbumAsync('QR Codes', asset, false);

            ToastAndroid.show('Saved to gallery!', ToastAndroid.SHORT);
         });
      } catch (error) {
         console.error('Error saving QR code:', error);
         ToastAndroid.show('Failed to save QR code!', ToastAndroid.SHORT);
      }
   };


   return (
      <>
         <View className="rounded-lg p-4 border-white border mt-4">
            <QRCode
               getRef={(c) => (svgRef.current = c)}
               color="white"
               backgroundColor="black"
               size={200}
               value={deepLinkUrl}
            />
         </View>
         <View className="mt-4 w-[100%] flex items-start flex-row justify-end pt-2">
            {/* Save QR */}
            <TouchableOpacity onPress={() => {
               saveQrToDisk(svgRef)
            }} className="ml-2 p-4 rounded-xl bg-purple-500">
               <Feather name="download" size={20} color="white" />
            </TouchableOpacity>
            {/*  */}
            <TouchableOpacity onPress={() => { handleShareRoom() }} className="ml-2 p-4 rounded-xl bg-green-500">
               <MaterialCommunityIcons name="google-classroom" size={20} color="white" />
            </TouchableOpacity>
         </View >
      </>
   );
};

export default QRGenerator;

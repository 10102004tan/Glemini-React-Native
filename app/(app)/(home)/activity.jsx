import Button from "@/components/customs/Button";
import Field from "@/components/customs/Field";
import { API_URL, API_VERSION, END_POINTS } from "@/configs/api.config";
import { AuthContext, useAuthContext } from "@/contexts/AuthContext";
import { useRoomProvider } from "@/contexts/RoomProvider";
import socket from "@/utils/socket";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";

export default function ActivityScreen() {
   const [roomCode, setRoomCode] = useState(null);
   const [roomTemp, setRoomTemp] = useState(null);
   const router = useRouter();
   const { userData } = useAuthContext();

   const { currentRoom, setCurrentRoom } = useRoomProvider();

   useEffect(() => {
      const checkRoom = async () => {
         const res = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_DETAIL}`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-client-id': userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({
               room_code: roomTemp,
            }),
         })

         const notAccepted = ['doing', 'completed', 'deleted'];

         const data = await res.json();
         if (data.statusCode === 200) {
            if (notAccepted.includes(data.metadata.status)) {
               Alert.alert('Thông báo', 'Không thể tham gia vào phòng chơi lúc này !!!');
            } else {
               setCurrentRoom(data.metadata._id);
               socket.emit('joinRoom', { roomCode, user: userData });
               router.replace({
                  pathname: '/(app)/(teacher)/teacher_room_wait',
                  params: { roomCode: roomTemp }
               });
            }
            setRoomTemp(null);
         } else {
            Alert.alert('Thông báo', 'Mã phòng không tồn tại');
         }
      }

      if (roomTemp) {
         checkRoom()
      }
   }, [roomTemp])


   return (
      <View className="p-4">
         <Field placeholder="Mã phòng" wrapperStyles="mb-3" value={roomCode} onChange={(text) => {
            setRoomCode(text);
         }} />

         <Button text='JOIN' otherStyles='p-4' onPress={() => {
            setRoomTemp(roomCode);
         }} />
      </View>
   )
}

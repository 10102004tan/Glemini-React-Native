import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome6 } from '@expo/vector-icons'
import socket from '@/utils/socket'

const UserJoinedRoomItem = ({ user, roomCode, showDelete = false }) => {
   const handleDelete = () => {
      socket.emit('kickUser', { roomCode: roomCode, userId: user._id });
   }

   return (
      <View className="p-2 rounded-xl flex-row flex bg-gray items-center w-full justify-start mb-2">
         <View className="flex items-center flex-row justify-start flex-1">
            <Image className="w-[50px] h-[50px] rounded-full" source={{ uri: user.user_avatar }} />
            <Text className="ml-3 text-white">{user.user_fullname}</Text>
         </View>
         {showDelete && (
            <TouchableOpacity
               onPress={() => {
                  handleDelete();
               }}
            >
               <FontAwesome6 name="trash" size={20} color="white" />
            </TouchableOpacity>
         )}
      </View>
   )
}

export default UserJoinedRoomItem

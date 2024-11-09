import { View, Text, Image } from 'react-native'
import React from 'react'

const UserJoinedRoomItem = ({ user }) => {
   return (
      <View className="p-2 rounded-xl flex-row flex bg-gray items-center w-full justify-start mb-2">
         <Image className="w-[50px] h-[50px] rounded-full" source={{ uri: user.user_avatar }} />
         <Text className="ml-3 text-white">{user.user_fullname}</Text>
      </View>
   )
}

export default UserJoinedRoomItem

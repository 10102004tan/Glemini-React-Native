import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'

const RankBoardUserItem = ({ user, rankIndex, point }) => {
   return (
      <View className="mt-4">
         <View className="flex items-center justify-between flex-row">
            {/* <View className="w-[30px] flex items-center justify-center h-[30px] rounded-full bg-primary">
               <Text className="text-white">{rankIndex}</Text>
            </View> */}
            <View className="flex items-center justify-start flex-row flex-1 ml-4">
               <Image className="w-[50px] h-[50px] rounded-full" source={{ uri: user.user_avatar }} />
               <Text className="text-white ml-3">
                  {user.user_fullname}
               </Text>
            </View>
            <View className="flex items-center justify-start flex-row">
               <Text className="text-white">
                  {point}
               </Text>
               <TouchableOpacity className="ml-2" >
                  <AntDesign name="close" size={15} color="red" />
               </TouchableOpacity>
            </View>
         </View>
      </View>
   )
}

export default RankBoardUserItem

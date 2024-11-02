import { View, Text } from 'react-native'
import React from 'react'
import Wrapper from '@/components/customs/Wrapper'
import Feather from '@expo/vector-icons/Feather';
const TeacherRoomWaitResultScreen = () => {
   return (
      <Wrapper>
         <View className="flex-1 p-4 bg-primary">
            <View className="p-4 rounded-2xl bg-black flex flex-row items-center justify-between">
               <View >
                  <Text className="text-sm text-gray">
                     Mã tham gia
                  </Text>
                  <Text className="text-white text-lg">
                     GKPO09
                  </Text>
               </View>
               <Feather name="copy" size={20} color="white" />
            </View>
            <View className="mt-10 bg-black p-4 rounded-2xl flex items-center justify-between flex-row">
               <View className="w-2 h-8 rounded-lg bg-green-500"></View>
               <View className="w-2 h-8 rounded-lg bg-red-500"></View>

               <View className="w-[100px] h-[100px] absolute rounded-full flex items-center justify-center flex-col left-[40%] bg-white">
                  <Text className="font-semibold text-black text-3xl">
                     0%
                  </Text>
                  <Text className="text-gray text-sm">
                     Độ chính xác
                  </Text>
               </View>

               <View className="mt-4">

               </View>
            </View>
         </View>
      </Wrapper>
   )
}

export default TeacherRoomWaitResultScreen

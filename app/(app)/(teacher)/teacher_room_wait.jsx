import { View, Text, Image, ScrollView } from 'react-native'
import React from 'react'
import Wrapper from '@/components/customs/Wrapper'
import Field from '@/components/customs/Field'
import Button from '@/components/customs/Button'
import Feather from '@expo/vector-icons/Feather';
import { Images } from '@/constants'

const TeacherRoomWaitScreen = () => {
   return (
      <Wrapper>
         <View className="flex-1 p-4 bg-primary">
            <ScrollView className="">
               {/* Copy Room Code */}
               <View className="p-4 rounded-2xl bg-[#0C0C0C] w-full">
                  <View className="w-full h-[200px] bg-[rgba(117, 117, 117, 0.3)] flex items-center justify-center p-4 rounded-2xl">
                     <View className="w-full rounded-xl  bg-white">
                        <Field placeholder='Mã phòng: GKHF80' />
                     </View>
                     <Button text='Sao chép' otherStyles='p-3 mt-4 w-full flex items-center justify-center bg-[#A1732A]' textStyles='' icon={<Feather name="copy" size={20} color="white" />} />
                  </View>
               </View>
               <View className="mt-4 p-4 rounded-2xl bg-[#0C0C0C] w-full">
                  <Text className="text-white text-center">Chờ học sinh tham gia</Text>
               </View>
               <View className="mt-4 p-4 w-full">
                  {/* Student Items */}
                  <View className="p-2 rounded-xl flex-row flex items-center w-full justify-start mb-2">
                     <Image className="w-[50px] h-[50px] rounded-full" source={Images.woman} />
                     <Text className="ml-3 text-white">Nguyễn Thị Hồng</Text>
                  </View>
                  <View className="p-2 rounded-xl flex-row flex items-center w-full justify-start mb-2">
                     <Image className="w-[50px] h-[50px] rounded-full" source={Images.woman} />
                     <Text className="ml-3 text-white">Nguyễn Thị Hồng</Text>
                  </View>
                  <View className="p-2 rounded-xl flex-row flex items-center w-full justify-start mb-2">
                     <Image className="w-[50px] h-[50px] rounded-full" source={Images.woman} />
                     <Text className="ml-3 text-white">Nguyễn Thị Hồng</Text>
                  </View>
                  <View className="p-2 rounded-xl flex-row flex items-center w-full justify-start mb-2">
                     <Image className="w-[50px] h-[50px] rounded-full" source={Images.woman} />
                     <Text className="ml-3 text-white">Nguyễn Thị Hồng</Text>
                  </View>
               </View>
            </ScrollView>
         </View>
      </Wrapper>
   )
}

export default TeacherRoomWaitScreen

import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const CardQuiz = ({ quiz, type = 'horizontal', routerPath = '', params = {} }) => {
   const router = useRouter();

   if (type === 'horizontal') {
      return (
         <View className="h-[100px] w-full bg-white rounded-2xl overflow-hidden flex-row mb-3"
            style={{
               shadowColor: '#000',
               shadowOffset: {
                  width: 0,
                  height: 2,
               },
               shadowOpacity: 0.25,
               shadowRadius: 3.84,
               elevation: 5,
            }}
         >
            <TouchableOpacity
               className="w-full"
               onPress={() => {
                  router.push({
                     pathname:
                        routerPath,
                     params: params,
                  });
               }}
            >
               <View className="flex flex-row items-center justify-start">
                  <View className="flex justify-center items-center">
                     <Image
                        source={{
                           uri:
                              quiz.quiz_thumb ||
                              'https://elearningindustry.com/wp-content/uploads/2021/10/Shareable-Quizzes-In-Online-Training-7-Reasons.jpg',
                        }}
                        className="w-[100px] h-full rounded-tl-2xl rounded-bl-2xl"
                     ></Image>
                  </View>
                  <View className="flex flex-col items-start justify-start p-4 w-full">
                     <Text className="text-lg font-semibold">
                        {quiz.quiz_name}
                     </Text>
                     <Text className="text-gray mb-2 max-w-[360px] overflow-hidden ">
                        {quiz.quiz_description || 'Không có mô tả'}
                     </Text>
                     <Text className="text-green-600">
                        {quiz.quiz_status ===
                           'unpublished'
                           ? 'Riêng tư'
                           : 'Công khai'}
                     </Text>
                  </View>
               </View>
            </TouchableOpacity>
         </View >
      )
   }

   // vertical
   return (
      <View className="min-h-[100px] w-full bg-white rounded-2xl flex-row mb-3"
         style={{
            shadowColor: '#000',
            shadowOffset: {
               width: 0,
               height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
         }}
      >
         <TouchableOpacity
            className="w-full"
            onPress={() => {
               router.push({
                  pathname:
                     routerPath,
                  params: params,
               });
            }}
         >
            <View className="flex flex-col">
               <View className="flex justify-center items-center w-full">
                  <Image
                     source={{
                        uri:
                           quiz.quiz_thumb ||
                           'https://elearningindustry.com/wp-content/uploads/2021/10/Shareable-Quizzes-In-Online-Training-7-Reasons.jpg',
                     }}
                     className="w-full h-[160px] rounded-tl-2xl rounded-tr-2xl"
                  ></Image>
               </View>
               <View className="flex flex-col p-4 w-full">
                  <Text className="text-lg font-semibold mt-2">
                     {quiz.quiz_name}
                  </Text>
                  <Text className="text-gray mb-2 max-w-[360px] overflow-hidden ">
                     {quiz.quiz_description || 'Không có mô tả'}
                  </Text>
                  <Text className="text-green-600">
                     {quiz.quiz_status ===
                        'unpublished'
                        ? 'Riêng tư'
                        : 'Công khai'}
                  </Text>
               </View>
            </View>
         </TouchableOpacity>
      </View>
   )
}

export default CardQuiz

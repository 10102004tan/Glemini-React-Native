import { View, Text } from 'react-native'
import React from 'react'
import SkeletonLoading from './SkeletonLoading'

const QuizCardSkeleton = () => {
   return (
      <View
         className="w-full bg-white rounded-2xl"
         style={{
            shadowColor: "#000",
            shadowOffset: {
               width: 0,
               height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
         }}
      >
         <View
            className="w-full"
         >
            <View className="flex flex-col">
               <View className="w-full h-1/2">
                  <SkeletonLoading />
               </View>
               <View className=" p-4 w-full h-1/2">
                  <View className="mb-4 h-[30px]">
                     <SkeletonLoading />
                  </View>
                  <View className="mb-4 h-[20px] w-[90%]">
                     <SkeletonLoading />
                  </View>
                  <View className="mb-4 h-[20px] w-[60%]">
                     <SkeletonLoading />
                  </View>
               </View>
            </View>
         </View>
      </View>
   )
}

export default QuizCardSkeleton

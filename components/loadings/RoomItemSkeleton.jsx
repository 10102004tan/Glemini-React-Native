import { View, Text } from 'react-native'
import React from 'react'
import SkeletonLoading from './SkeletonLoading';

const RoomItemSkeleton = () => {
   return (
      <View
         className="flex-1 rounded-xl overflow-hidden "
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
         <View className="bg-white flex flex-row">
            <View className="w-1/2">
               <SkeletonLoading width={100} height={100} />
            </View>
            <View className="pt-8 px-4 w-1/2">
               <View className="mb-4 h-[40px]">
                  <SkeletonLoading />
               </View>
               <View className="mb-4 h-[40px]">
                  <SkeletonLoading />
               </View>
               <View className="mb-4 h-[60px]">
                  <SkeletonLoading />
               </View>
            </View>
         </View>
      </View>
   )
}

export default RoomItemSkeleton

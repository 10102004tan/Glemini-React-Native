import { View, ScrollView } from 'react-native'
import React from 'react'
import Wrapper from '../customs/Wrapper'
import SkeletonLoading from './SkeletonLoading'

const QuestionEditScreenSkeleton = () => {
   return (
      <Wrapper>
         <View className="flex flex-row items-center justify-start p-4">
            <SkeletonLoading
               styles=" w-[100px] h-8"
            />
            <SkeletonLoading
               styles="w-[100px] h-8 ml-3"
            />
         </View>
         {/* Edit View */}
         <View className="flex-1 bg-primary p-4">
            <ScrollView>
               <SkeletonLoading styles="overflow-hidden rounded-2xl min-h-[140px] max-h-[200px] flex items-center justify-center"></SkeletonLoading>
               <View className="flex items-center justify-between mt-4 flex-row">
                  <SkeletonLoading
                     styles="w-[100px] h-8"
                  />
                  <SkeletonLoading
                     styles="w-[100px] h-8"
                  />
               </View>
               {/* Answers */}
               <View className="mt-4 flex items-center justify-center flex-col">
                  {Array.from({ length: 4 }).map((_, index) => (
                     <SkeletonLoading key={index}
                        styles="flex-1 h-12 w-full mb-2"
                     />
                  ))}
               </View>
               <View className="flex items-center justify-between mt-4 flex-row">
                  <SkeletonLoading
                     styles="w-[100px] h-8"
                  />
                  <SkeletonLoading
                     styles="w-[100px] h-8"
                  />
               </View>
            </ScrollView>
         </View >
         {/* Button */}
         <SkeletonLoading styles='p-4 h-20'>
         </SkeletonLoading>
      </Wrapper >
   )
}

export default QuestionEditScreenSkeleton

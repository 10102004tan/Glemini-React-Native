import React from 'react';
import { Image, Text, View } from 'react-native';
import moment from 'moment';
import { SimpleLineIcons } from '@expo/vector-icons';

function QuizCardItem({ quiz }) {

   return (
      <View
         className="bg-[#ffeaa7] rounded-lg shadow-lg overflow-hidden mb-4"
         style={{ elevation: 4 }} // Bóng cho Android
      >
         {/* Header with Image */}
         <View>
            <Image
               src={
                  quiz.quiz_thumb ||
                  'https://elearningindustry.com/wp-content/uploads/2021/10/Shareable-Quizzes-In-Online-Training-7-Reasons.jpg'
               }
               className="w-full h-[120px] rounded-t-lg"
               alt={quiz.quiz_name}
            />
            {/* Timestamp */}
            <Text className="absolute p-2 rounded bg-white/90 text-xs bottom-2 right-2 text-black shadow-sm">
               {moment(quiz.createdAt).fromNow()}
            </Text>
            {/* Total Questions */}
            <Text className="absolute py-1 px-2 rounded bg-blue-400/80 text-xs top-2 left-2 text-white">
               {quiz.total_questions} câu hỏi
            </Text>
            {/* Game Turn */}
            <View className="absolute bottom-2 left-2 bg-white/90 rounded py-1 px-2 flex-row items-center shadow-sm">
               <SimpleLineIcons name="game-controller" size={12} color="#4A5568" />
               <Text className="ml-1 text-xs font-semibold text-gray-700">
                  {quiz.quiz_turn}
               </Text>
            </View>
         </View>

         {/* Content */}
         <View className="p-4">
            {/* Quiz Name */}
            <Text
               className="text-sm font-semibold text-gray-800"
               numberOfLines={1}
            >
               {quiz.quiz_name}
            </Text>

            {/* Author Section */}
            <View className="flex-row items-center mt-3">
               <Image
                  className="w-6 h-6 rounded-full"
                  src={quiz.user?.user_avatar
                     ?.replace('h_100', 'h_30')
                     ?.replace('w_100', 'w_30')}
               />
               <Text className="ml-2 text-xs text-black">
                  {quiz.user?.user_fullname}
               </Text>
            </View>
         </View>
      </View>
   );
}

export default QuizCardItem;

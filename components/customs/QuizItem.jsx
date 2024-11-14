import { Images } from '@/constants'
import React from 'react'
import { Image, Text, View } from 'react-native'
import { useAppProvider } from '@/contexts/AppProvider'
import { truncateDescription } from '@/utils'
import Icon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
function QuizItem({ quiz }) {
    const { i18n } = useAppProvider()
    return (
        <View className='bg-slate-100 rounded-lg'>
            <View>
                <Image src={(quiz.quiz_thumb ? quiz.quiz_thumb : "https://elearningindustry.com/wp-content/uploads/2021/10/Shareable-Quizzes-In-Online-Training-7-Reasons.jpg")} className={"w-full h-[100px] rounded-b-[10px]"} alt={quiz.quiz_name} />
                <Text className={"absolute p-2 rounded bg-white opacity-80 text-[10px] bottom-[5px] right-[5px]"}>{moment(quiz.createdAt).fromNow()}</Text>
            </View>
            <View className="p-2">
                <Text>{quiz.quiz_name}</Text>
                <Text>Lượt chơi : {quiz.quiz_turn}</Text>
            </View>
        </View>
    )
}

export default QuizItem;

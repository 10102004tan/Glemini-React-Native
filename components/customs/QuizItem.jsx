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
        <View className='bg-slate-50 rounded-lg'>
            <View>
                <Image src={(quiz.quiz_thumb ? quiz.quiz_thumb : "https://elearningindustry.com/wp-content/uploads/2021/10/Shareable-Quizzes-In-Online-Training-7-Reasons.jpg")} className={"w-full h-[100px] rounded-b-[10px]"} alt={quiz.quiz_name} />
                <Text className={"absolute p-2 rounded bg-white opacity-80 text-[10px] bottom-[5px] right-[5px]"}>{moment(quiz.createdAt).fromNow()}</Text>
            </View>
            <View className={"p-2"}>
            <Text>{(quiz.quiz_name.length > 25 ? quiz.quiz_name.substring(0, 25) + "..." : quiz.quiz_name)}</Text>
            <View className={"flex-row gap-2 items-center mt-3"}>
                <Image className={"w-[20px] h-[20px] rounded-full object-cover"}
                       src={quiz.user_id.user_avatar.replace("h_100", "h_30").replace("w_100", "w_30")}/>
                <Text className={"text-[10px]"}>{quiz.user_id.user_fullname}</Text>
            </View>
        </View>
        </View>
    )
}

export default QuizItem;

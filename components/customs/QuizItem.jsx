import React from 'react'
import { Image, Text, View } from 'react-native'
import { useAppProvider } from '@/contexts/AppProvider'
import moment from 'moment'
import { SimpleLineIcons } from '@expo/vector-icons'
function QuizItem({ quiz }) {
    const { i18n } = useAppProvider()
    return (
        <View className='bg-slate-50 rounded-lg'>
            <View>
                <Image src={(quiz.quiz_thumb || "https://elearningindustry.com/wp-content/uploads/2021/10/Shareable-Quizzes-In-Online-Training-7-Reasons.jpg")} className={"w-full h-[100px] rounded-b-[10px]"} alt={quiz.quiz_name} />
                <Text className="absolute p-2 rounded bg-white/80 text-xs bottom-1 right-1">{moment(quiz.createdAt).fromNow()}</Text>
                <Text className="absolute py-1 px-2 rounded bg-blue-300/80 text-xs top-1 left-1">{quiz.total_questions} qs</Text>
                <View className='absolute bottom-1 left-1 bg-white/80 rounded py-2 px-2 flex-row items-center'>
                <SimpleLineIcons name={"game-controller"} size={12} />
                <Text className={"ml-1 text-xs font-semibold"}>{quiz.quiz_turn}</Text>
                </View>                
            </View>
            <View className={"p-2"}>
                <Text>{(quiz.quiz_name.length > 20 ? quiz.quiz_name.substring(0, 20) + "..." : quiz.quiz_name)}</Text>
                <View className={"flex-row gap-2 items-center mt-3"}>
                    <Image className={"w-[20px] h-[20px] rounded-full object-cover"}
                        src={quiz.user?.user_avatar.replace("h_100", "h_30").replace("w_100", "w_30")} />
                    <Text className={"text-[10px]"}>{quiz.user?.user_fullname}</Text>
                </View>
            </View>
        </View>
    )
}

export default QuizItem;

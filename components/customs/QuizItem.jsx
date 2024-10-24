import { Images } from '@/constants'
import React from 'react'
import { Image, Text, View } from 'react-native'
import { useAppProvider } from '@/contexts/AppProvider'
import { truncateDescription } from '@/utils'
import Icon from 'react-native-vector-icons/Ionicons'
function QuizItem({ quiz }) {
    const { i18n } = useAppProvider()
    return (
        <View className='bg-black/10 rounded-md flex-row p-2 w-full mb-2' >
            <View className='w-2/5 overflow-hidden'>
                <Image source={quiz.quiz_thumb ? { uri: quiz.quiz_thumb } : Images.banner1}
                    className="w-full h-28 rounded-md"
                    style={{ resizeMode: 'cover' }} />
            </View>
            <View className='w-3/5 flex ml-2 items-start justify-around'>
                {/* { quiz.user_id.user_type === 'teacher' ? <Icon name='star-sharp' size={20} className='text-yellow-400 absolute top-2 right-2' /> : '' } */}
                <Text className='text-lg font-bold'>{truncateDescription(quiz.quiz_name, 30)}</Text>
                <View className='flex gap-1 items-baseline'>
                    <View className='flex-row'>
                        <Text className='text-sm font-semibold text-slate-500'>{i18n.t('student_homepage.author')} </Text>
                        <Text className='text-green-700'>{quiz.user_id.user_fullname}</Text>
                    </View>
                    <View className='flex-row'>
                        <Text className='text-sm font-semibold text-slate-500'>{i18n.t('student_homepage.turnPlay')} </Text>
                        <Text className='text-sm font-pregular text-slate-500'>{quiz.quiz_turn}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default QuizItem;

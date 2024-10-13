import React from 'react'
import { Image, Text, View } from 'react-native'

function QuizItem({ quiz }) {
    
    return (
  
            <View className='bg-slate-300/30 rounded-md flex-row p-2 w-full mb-2' >
            <View className='w-2/5 overflow-hidden'>
                <Image source={{ uri: quiz.quiz_thumb || 'https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-1/456537396_794061249555708_1663471177791048027_n.jpg?stp=dst-jpg_s200x200&_nc_cat=101&ccb=1-7&_nc_sid=50d2ac&_nc_eui2=AeFsVKryqdDFHD9LyKwncdC1HTmCAzypGDgdOYIDPKkYOI3clzOxlMLTwLW5KtwEY70jyPrCI5YMekhp1w_ex4Jg&_nc_ohc=eyXn5PYjLdcQ7kNvgFdsotm&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=A4COVmBRgOZfuOKFOuZclAs&oh=00_AYA8zKzNfJe9vsPnpwW-eW6zhp_h2K_2lbzlpiaIImOUhw&oe=66FF40CD' }}
                    className="w-auto h-28 rounded-md "
                    style={{ resizeMode: 'cover' }} />
            </View>
            <View className='w-3/5 flex ml-2 items-start justify-around'>
                <Text className='text-lg font-bold'>{quiz.quiz_name}</Text>
                <View className='flex gap-1 items-baseline'>
                    <View className='flex-row'>
                        <Text className='text-sm font-semibold text-slate-500'>Tác giả: </Text>
                        <Text className='text-green-700'>{quiz.user_id.user_fullname}</Text>
                    </View>
                    <View className='flex-row'>
                        <Text className='text-sm font-semibold text-slate-500'>Lượt chơi: </Text>
                        <Text className='text-sm font-pregular text-slate-500'>{quiz.quiz_turn}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default QuizItem
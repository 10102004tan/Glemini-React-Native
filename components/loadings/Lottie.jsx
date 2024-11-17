import LottieView from 'lottie-react-native'
import React from 'react'
import { Text, View } from 'react-native'

function Lottie({ source, width, height, text }) {
    return (
        <View className='flex-1 items-center justify-center'>
            <LottieView
                source={source}
                autoPlay
                loop
                style={{ width: width, height: height }}
            />
            <Text className='text-red-500 font-semibold'>{text || ''}</Text>
        </View>
    )
}

export default Lottie
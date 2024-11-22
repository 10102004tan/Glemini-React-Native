import React from 'react'
import { Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRGenerator = ({ value }) => {
   return (
      <View className="rounded-lg p-4 border-white border mt-4">
         <QRCode
            color='white'
            backgroundColor='black'
            size={200}
            value={value}
         />
      </View>
   )
}

export default QRGenerator

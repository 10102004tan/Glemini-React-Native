import LottieView from 'lottie-react-native';
import React from 'react';
import { Text, View } from 'react-native';

function Lottie({ source, width, height, text }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LottieView source={source} autoPlay loop style={{ width: width, height: height }} />
      <Text
        style={{
          color: '#ef4444',
          fontWeight: 600,
        }}
      >
        {text || ''}
      </Text>
    </View>
  );
}

export default Lottie;

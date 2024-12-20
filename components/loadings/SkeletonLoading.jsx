import { View, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';

const SkeletonLoading = ({ styles = '' }) => {
   const animatedValue = useRef(new Animated.Value(0)).current;

   useEffect(() => {
      Animated.loop(
         Animated.sequence([
            Animated.timing(animatedValue, {
               toValue: 1,
               duration: 1000,
               useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
               toValue: 0,
               duration: 1000,
               useNativeDriver: true,
            }),
         ])
      ).start();
   }, [animatedValue]);

   const backgroundColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['#e0e0e0', '#f0f0f0'],
   });

   return (
      <View className={`rounded-lg flex items-center justify-center overflow-hidden ${styles}`}>
         <Animated.View
            className="w-full h-full"
            style={[{ backgroundColor }]}
         ></Animated.View>
      </View>
   );
};

export default SkeletonLoading;

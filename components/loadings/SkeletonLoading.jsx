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
      <View style={[{
               borderRadius: 8,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               overflow: 'hidden',
            }, { styles }]}>
         <Animated.View
            style={[{ backgroundColor }, { width: '100%', height: '100%' }]}
         ></Animated.View>
      </View>
   );
};

export default SkeletonLoading;

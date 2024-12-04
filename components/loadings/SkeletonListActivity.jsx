import React from 'react';
import { View, Animated, Easing, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / 2 - 16; // Tính kích thước mỗi ô

const SkeletonItem = () => {
   const animation = new Animated.Value(0);

   // Tạo hiệu ứng nhấp nháy cho Skeleton
   React.useEffect(() => {
      Animated.loop(
         Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
         })
      ).start();
   }, []);

   // Hiệu ứng màu nhấp nháy
   const opacityInterpolate = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.1, 0.5],
   });

   return (
      <View className='bg-slate-100 mb-4 rounded-lg overflow-hidden mx-[2px]'>
         <Animated.View className='bg-slate-300 h-32 w-full' style={{ opacity: opacityInterpolate }} />
         <View className='p-4'>
            <Animated.View className='bg-slate-300 h-4 mb-2' style={{ opacity: opacityInterpolate }} />
            <Animated.View className='bg-slate-300 h-4 mb-2 w-3/4' style={{ opacity: opacityInterpolate }} />
            <Animated.View className='bg-slate-300 h-4 mb-2 w-1/2' style={{ opacity: opacityInterpolate }} />
         </View>
      </View>
   );
};

const SkeletonList = ({ count = 6 }) => {
   return (
      <View className='p-2'>
         {/* Sử dụng flex row và flex-wrap để tạo khoảng cách đều giữa các ô */}
         <View className='flex-row flex-wrap justify-between'>
            {Array.from({ length: count }).map((_, index) => (
               <View key={index} style={{ width: itemWidth }}>
                  <SkeletonItem />
               </View>
            ))}
         </View>
      </View>
   );
};

export default SkeletonList;

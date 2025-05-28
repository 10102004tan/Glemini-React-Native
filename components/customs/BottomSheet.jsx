import React, { useEffect } from 'react';
import Animated, {
   Easing,
   useAnimatedStyle,
   useSharedValue,
   withTiming,
} from 'react-native-reanimated';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native-gesture-handler';
const BottomSheet = ({ children, visible = false, onClose = () => { } }) => {
   const translateY = useSharedValue(300); // Chạy từ dưới lên, 300 là chiều cao khởi điểm
   useEffect(() => {
      if (visible) {
         // Khi bottom sheet xuất hiện, chạy animation từ dưới lên
         translateY.value = withTiming(0, {
            duration: 600,
            easing: Easing.out(Easing.exp),
         });
      } else {
         // Khi ẩn bottom sheet, chạy animation ngược lại xuống dưới
         translateY.value = withTiming(300, {
            duration: 600,
            easing: Easing.out(Easing.exp),
         });
      }
   }, [visible]);

   const animatedStyle = useAnimatedStyle(() => {
      return {
         transform: [{ translateY: translateY.value }],
      };
   });

   return (
      <Animated.View
         style={[animatedStyle, {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            padding: 40,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            backgroundColor: 'white'
         }]}
      >
         <TouchableOpacity
            style={{
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'flex-end',
               flexDirection: 'row',
               marginBottom: 8
            }}
            onPress={() => {
               onClose();
            }}
         >
            <AntDesign name="close" size={20} color="black" />
         </TouchableOpacity>
         {visible && children}
      </Animated.View>
   );
};

export default BottomSheet;

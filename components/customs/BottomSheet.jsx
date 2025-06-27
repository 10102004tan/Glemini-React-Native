import React, { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, View } from 'react-native';
const BottomSheet = ({ children, visible = false, onClose = () => {}, bottomSheetTitle = '' }) => {
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
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        top: 0,
        right: 0,
        zIndex: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        display: visible ? 'flex' : 'none',
        opacity: visible ? 1 : 0,
      }}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 21, // nhỏ hơn headerStack
            padding: 40,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            backgroundColor: 'white',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            shadowColor: '#000',
            elevation: 5,
            maxHeight: '99%',
            overflow: 'hidden',
          },
        ]}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: bottomSheetTitle ? 'space-between' : 'flex-end',
            alignItems: 'center',
            marginBottom: 16,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#E5E7EB',
          }}
        >
          {bottomSheetTitle && (
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{bottomSheetTitle}</Text>
          )}

          <TouchableOpacity
            onPress={() => {
              onClose();
            }}
          >
            <AntDesign name="close" size={20} color="black" />
          </TouchableOpacity>
        </View>

        {visible && children}
      </Animated.View>
    </View>
  );
};

export default BottomSheet;

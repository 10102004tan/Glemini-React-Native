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
      }),
    ).start();
  }, []);

  // Hiệu ứng màu nhấp nháy
  const opacityInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.5],
  });

  return (
    <View
      style={{
        backgroundColor: '#f1f5f9',
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
        marginHorizontal: 2,
      }}
    >
      <Animated.View
        style={{
          opacity: opacityInterpolate,
          backgroundColor: '#cbd5e1',
          height: 128,
          width: '100%',
        }}
      />
      <View style={{ padding: 16 }}>
        <Animated.View
          style={{
            opacity: opacityInterpolate,
            backgroundColor: '#cbd5e1',
            height: 16,
            marginBottom: 8,
          }}
        />
        <Animated.View
          style={{
            opacity: opacityInterpolate,
            backgroundColor: '#cbd5e1',
            height: 16,
            marginBottom: 8,
            width: '75%',
          }}
        />
        <Animated.View
          style={{
            opacity: opacityInterpolate,
            backgroundColor: '#cbd5e1',
            height: 16,
            marginBottom: 8,
            width: '50%',
          }}
        />
      </View>
    </View>
  );
};

const SkeletonList = ({ count = 6 }) => {
  return (
    <View style={{ padding: 8 }}>
      {/* Sử dụng flex row và flex-wrap để tạo khoảng cách đều giữa các ô */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
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

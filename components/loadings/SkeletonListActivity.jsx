import React from 'react';
import { View, Animated, Easing, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / 2 - 16; // Tính kích thước mỗi ô

const SkeletonItem = () => {
  const animation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerTranslate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-itemWidth, itemWidth],
  });

  return (
  <View
    style={{
      backgroundColor: '#DCFCE7', // Xanh lá nhạt
      borderWidth: 1,
      borderColor: '#BBF7D0',
      marginBottom: 16,
      borderRadius: 10,
      overflow: 'hidden',
      marginHorizontal: 4,
    }}
  >
    <View style={{ height: 110, backgroundColor: '#BBF7D0', position: 'relative' }}>
      <Animated.View
        style={{
          position: 'absolute',
          height: '100%',
          width: itemWidth * 1.5,
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          transform: [{ translateX: shimmerTranslate }],
        }}
      />
    </View>

    <View style={{ padding: 16 }}>
      {[100, 75, 50].map((w, i) => (
        <View
          key={i}
          style={{
            backgroundColor: '#BBF7D0',
            height: 16,
            marginBottom: 10,
            borderRadius: 12,
            width: `${w}%`,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Animated.View
            style={{
              position: 'absolute',
              height: '100%',
              width: itemWidth * 1.5,
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              transform: [{ translateX: shimmerTranslate }],
            }}
          />
        </View>
      ))}
    </View>
  </View>
);

};


const SkeletonList = ({ count = 6 }) => {
  return (
    <View style={{ paddingVertical: 8 }}>
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

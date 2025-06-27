import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import React, { useRef, useEffect } from 'react';

const width = Dimensions.get('window').width;
const height = (width * 2) / 3;
const BannerSkeleton = ({ w = width * 0.92, h = height }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 400],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.skeleton, { width: w, height: h }]}>
        <Animated.View style={[styles.shimmer, { transform: [{ translateX }], height: h }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  skeleton: {
    borderRadius: 18,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    backgroundColor: 'rgba(255,255,255,0.35)',
    opacity: 0.7,
  },
});

export default BannerSkeleton;

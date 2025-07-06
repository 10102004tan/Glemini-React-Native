import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const SkeletonClassroomCard = () => {
  const shimmer = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animate.start();
    return () => animate.stop();
  }, [shimmer]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.skeleton, { opacity: shimmer }]} />
      <Animated.View style={[styles.skeletonSmall, { opacity: shimmer }]} />
      <Animated.View style={[styles.skeletonSmall, { opacity: shimmer }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#dbeafe', // 💙 Nền xanh dương nhạt
    padding: 16,
    elevation: 2,
  },
  skeleton: {
    height: 40,
    borderRadius: 8,
    backgroundColor: '#93c5fd', // 💙 Shimmer xanh dương sáng
    marginBottom: 10,
  },
  skeletonSmall: {
    height: 20,
    width: '50%',
    borderRadius: 8,
    backgroundColor: '#93c5fd',
    marginBottom: 8,
  },
});

export default SkeletonClassroomCard;

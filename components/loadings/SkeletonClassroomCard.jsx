import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const SkeletonClassroomCard = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animate.start();
    return () => animate.stop();
  }, [opacity]);

  return (
    <View style={styles.container}>
      {/* Skeleton for the classroom card */}
      <Animated.View style={[styles.skeleton, { opacity }]} />
      <Animated.View style={[styles.skeletonSmall, { opacity }]} />
      <Animated.View style={[styles.skeletonSmall, { opacity }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#f3f3f3',
    padding: 16,
    elevation: 2,
  },
  skeleton: {
    height: 40,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  skeletonSmall: {
    height: 20,
    width: '50%',
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
  },
});

export default SkeletonClassroomCard;

import { View, Image, Text } from 'react-native';
import EnLoading from '../../assets/images/EnLoading.webp';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

const Loading = ({ duration = 1200, message = 'Dữ liệu đang được tải, đợi 1 xíu nhé!!' ,icon}) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration,
        useNativeDriver: false,
        easing: (t) => t,
      }),
    ).start();
  }, [progress]);

  const widthInterpolate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.messageBoxWrapper}>
        <Image source={
          icon || EnLoading
        } style={styles.image} resizeMode="contain" />
        {!!message && (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        )}
      </View>
      <View style={styles.progressBarBg}>
        <Animated.View style={[styles.progressBar, { width: widthInterpolate }]} />
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  messageBoxWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  messageBox: {
    position: 'absolute',
    top: -80,
    left: '50%',
    transform: [{ translateX: -150 }],
    minWidth: 120,
    maxWidth: 160,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  messageText: {
    color: '#111827',
    fontSize: 15,
  },
  progressBarBg: {
    width: 180,
    height: 10,
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#1cb0f6',
    borderRadius: 8,
  },
};

export default Loading;

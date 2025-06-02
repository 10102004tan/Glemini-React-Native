import { Text, View, Animated, TouchableWithoutFeedback } from 'react-native';
import React, { useRef, useEffect } from 'react';
import { useModal } from '@/store/useModal';

const ModalContainer = () => {
  const { title, content, isVisible, toggleModal, modalType, buttonLeft } = useModal();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        opacity,
      }}
    >
      {/* <TouchableWithoutFeedback onPress={toggleModal}>
                <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
            </TouchableWithoutFeedback> */}
      <Animated.View
        style={{
          width: '90%',
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 10,
          transform: [{ scale }],
        }}
      >
        {/* modal type */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <View
            style={{
              backgroundColor:
                modalType === 'info' ? '#2196F3' : modalType === 'warning' ? '#FF9800' : '#F44336',
              width: 24,
              height: 24,
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 15,
            }}
          >
            <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
              {modalType === 'info' ? 'i' : modalType === 'warning' ? '!' : 'X'}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              paddingBottom: 5,
              color: '#333',
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
              marginBottom: 10,
            }}
          >
            {title}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 16,
            color: '#333',
          }}
        >
          {content}
        </Text>

        {/* button */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 20,
          }}
        >
          <TouchableWithoutFeedback onPress={buttonLeft.onPress}>
            <View
              style={{
                backgroundColor: '#2196F3',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>{buttonLeft.text}</Text>
            </View>
          </TouchableWithoutFeedback>
          {/* Add more buttons here if needed */}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default ModalContainer;

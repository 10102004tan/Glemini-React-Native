import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { BlurView } from 'expo-blur';

const Overlay = ({ onPress = () => {}, visible = false }) => {
	const opacity = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		// Tạo hiệu ứng mờ dần khi hiển thị hoặc biến mất
		Animated.timing(opacity, {
			toValue: visible ? 1 : 0,
			duration: 300, // Thời gian hiệu ứng (300ms)
			useNativeDriver: true,
		}).start();
	}, [visible]);

	return (
		<Animated.View
			style={[styles.absolute, { opacity: opacity }]}
			pointerEvents={visible ? 'auto' : 'none'} // Chỉ cho phép chạm vào khi hiển thị
		>
			<TouchableOpacity
				style={styles.absolute}
				onPress={() => {
					onPress();
				}}
			>
				<BlurView
					intensity={90}
					tint="dark"
					style={styles.absolute}
				></BlurView>
			</TouchableOpacity>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	absolute: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 10,
	},
});

export default Overlay;

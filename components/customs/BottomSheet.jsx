import React, { useEffect } from 'react';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

const BottomSheet = ({ children, visible }) => {
	const translateY = useSharedValue(300); // Chạy từ dưới lên, 300 là chiều cao khởi điểm
	useEffect(() => {
		if (visible) {
			// Khi bottom sheet xuất hiện, chạy animation từ dưới lên
			translateY.value = withTiming(0, { duration: 300 });
		} else {
			// Khi ẩn bottom sheet, chạy animation ngược lại xuống dưới
			translateY.value = withTiming(300, { duration: 300 });
		}
	}, [visible]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: translateY.value }],
		};
	});

	return (
		<Animated.View
			className="absolute left-0 right-0 bottom-0 p-6 rounded-t-3xl bg-white z-10"
			style={[animatedStyle]}
		>
			{visible && children}
		</Animated.View>
	);
};

export default BottomSheet;

import React, { useEffect } from 'react';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native';
const BottomSheet = ({ children, visible = false, onClose = () => {} }) => {
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
		<Animated.View
			className="absolute left-0 right-0 bottom-0 p-6 rounded-t-3xl bg-white z-10"
			style={[animatedStyle]}
		>
			<TouchableOpacity
				className="flex items-center justify-end flex-row mb-2"
				onPress={() => {
					onClose();
				}}
			>
				<AntDesign name="close" size={25} color="black" />
			</TouchableOpacity>
			{visible && children}
		</Animated.View>
	);
};

export default BottomSheet;

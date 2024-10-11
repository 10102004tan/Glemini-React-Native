import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Animated } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const ConfirmDialog = ({ visible, onConfirm, onCancel, title, message }) => {
	const [showModal, setShowModal] = useState(visible);
	const scaleValue = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (visible) {
			setShowModal(true);
			Animated.spring(scaleValue, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start();
		} else {
			Animated.timing(scaleValue, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start(() => setShowModal(false));
		}
	}, [visible, scaleValue]);

	return (
		<Modal
			transparent
			visible={showModal}
			animationType="none"
			onRequestClose={onCancel}
		>
			<StyledView className="flex-1 justify-center items-center bg-black/50">
				<Animated.View style={{ transform: [{ scale: scaleValue }] }}>
					<StyledView className="w-72 p-5 bg-white rounded-lg items-center shadow-lg">
						<StyledText className="text-lg font-bold mb-3">
							{title}
						</StyledText>
						<StyledText className="text-base text-center mb-5">
							{message}
						</StyledText>
						<StyledView className="flex-row justify-between w-full">
							<StyledTouchableOpacity
								className="flex-1 bg-red-500 p-3 rounded-lg items-center mr-2"
								onPress={onCancel}
							>
								<StyledText className="text-white">
									Hủy
								</StyledText>
							</StyledTouchableOpacity>
							<StyledTouchableOpacity
								className="flex-1 bg-green-500 p-3 rounded-lg items-center ml-2"
								onPress={onConfirm}
							>
								<StyledText className="text-white">
									Xác nhận
								</StyledText>
							</StyledTouchableOpacity>
						</StyledView>
					</StyledView>
				</Animated.View>
			</StyledView>
		</Modal>
	);
};

export default ConfirmDialog;

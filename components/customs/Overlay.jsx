import { View, TouchableWithoutFeedback } from 'react-native';
import React from 'react';

const Overlay = ({ onPress }) => {
	return (
		<TouchableWithoutFeedback
			onPress={() => {
				onPress();
			}}
		>
			<View className="absolute top-0 left-0 bottom-0 right-0 bg-overlay z-10" />
		</TouchableWithoutFeedback>
	);
};

export default Overlay;

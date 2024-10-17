import {
	View,
	TouchableWithoutFeedback,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import React from 'react';
import { BlurView } from 'expo-blur';

const Overlay = ({ onPress = () => {} }) => {
	return (
		<TouchableOpacity
			className="absolute top-0 left-0 bottom-0 right-0 bg-overlay z-10"
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
	);
};

const styles = StyleSheet.create({
	absolute: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
});

export default Overlay;

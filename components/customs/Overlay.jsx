import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import React from 'react';
import { BlurView } from 'expo-blur';

const Overlay = ({ onPress }) => {
	return (
		<TouchableWithoutFeedback
			onPress={() => {
				onPress();
			}}
		>
			<View className="absolute top-0 left-0 bottom-0 right-0 bg-overlay z-10">
				<BlurView
					intensity={90}
					tint="dark"
					style={styles.absolute}
				></BlurView>
			</View>
		</TouchableWithoutFeedback>
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

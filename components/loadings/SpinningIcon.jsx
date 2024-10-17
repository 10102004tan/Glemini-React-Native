import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const SpinningIcon = () => {
	const spinValue = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.loop(
			Animated.timing(spinValue, {
				toValue: 1,
				duration: 1000,
				easing: Easing.linear,
				useNativeDriver: true,
			})
		).start();
	}, [spinValue]);

	const spin = spinValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg'],
	});

	return (
		<Animated.View style={{ transform: [{ rotate: spin }] }}>
			<AntDesign name="loading1" size={20} color="white" />
		</Animated.View>
	);
};

export default SpinningIcon;

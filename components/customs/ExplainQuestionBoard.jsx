import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { TextInput } from 'react-native';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import RichTextEditor from './RichTextEditor';

const ExplainQuestionBoard = ({ answers, visible }) => {
	const translateY = useSharedValue(1000);

	useEffect(() => {
		if (visible) {
			translateY.value = withTiming(0, { duration: 400 });
		} else {
			translateY.value = withTiming(1000, { duration: 500 });
		}
	}, [visible]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: translateY.value }],
		};
	});

	return (
		<Animated.View
			style={[animatedStyle]}
			className="rounded-2xl border border-gray flex items-center justify-center min-h-[260px] absolute z-20 top-[5%]
      left-[5%] right-[50%] w-[90%] bg-white"
		>
			<RichTextEditor />
		</Animated.View>
	);
};

export default ExplainQuestionBoard;

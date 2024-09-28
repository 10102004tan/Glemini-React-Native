import { View, Text, TextInput } from 'react-native';
import React from 'react';

const Field = ({ onChange, value, type, placeholder, label, otherStyles }) => {
	return (
		<View className="flex flex-col items-start justify-start">
			<Text className="mb-1">{label}</Text>
			<TextInput
				type={type}
				className={`p-2 rounded-xl border ${otherStyles}`}
				placeholder={placeholder}
				value={value}
				onTextInput={(e) => {
					onChange(e.nativeEvent.text);
				}}
			/>
		</View>
	);
};

export default Field;

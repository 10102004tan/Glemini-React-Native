import { View, Text, TextInput } from 'react-native';
import React from 'react';
import { useAppProvider } from '@/contexts/AppProvider';

const Field = ({
	onChange,
	value,
	type,
	placeholder,
	label,
	wrapperStyles = '',
	inputStyles = '',
}) => {
	const { theme } = useAppProvider();
	return (
		<View
			className={`flex flex-col items-start justify-center ${wrapperStyles}`}
		>
			<Text className={`mb-1 text-sm text-gray font-pregular`}>
				{label}
			</Text>
			<TextInput
				placeholderTextColor={theme.text}
				style={{ color: theme.text }}
				type={type}
				className={`px-4 py-2 rounded-xl border-gray w-full border font-pregular ${inputStyles}`}
				placeholder={placeholder}
				onTextInput={(e) => {
					onChange(e.nativeEvent.text);
				}}
			/>
		</View>
	);
};

export default Field;

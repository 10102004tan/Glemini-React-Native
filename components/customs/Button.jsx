import { View, Text } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useAppProvider } from '@/contexts/AppProvider';

const Button = ({
	text = '',
	onPress = () => {},
	otherStyles = '',
	textStyles = '',
	icon = null,
	disabled = false,
	type = 'fill',
	loading = false,
}) => {
<<<<<<< HEAD
  const { theme } = useAppProvider();
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      className={`p-2 rounded-xl bg-primary   ${otherStyles}`}
    >
      {icon}
      <Text className={`text-white ml-2 ${textStyles}`}>{text}</Text>
    </TouchableOpacity>
  );
=======
	const { theme } = useAppProvider();
	return (
		<TouchableOpacity
			onPress={() => {
				onPress();
			}}
			className={`p-2 rounded-xl flex items-center justify-start flex-row bg-primary ${otherStyles}`}
		>
			{icon && <View className="mr-2">{icon}</View>}
			<Text className={`text-white ${textStyles}`}>{text}</Text>
		</TouchableOpacity>
	);
>>>>>>> 7a60115e676432779a7bf97e5394a78179fb4b55
};

export default Button;

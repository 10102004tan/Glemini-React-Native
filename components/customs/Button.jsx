import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useAppProvider } from "@/contexts/AppProvider";

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
	const { theme } = useAppProvider();
	return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      className={`p-2 rounded-xl bg-primary flex flex-row items-center  ${otherStyles}`}
    >
      {icon}
      <Text className={`${textStyles} text-white ml-2`}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;

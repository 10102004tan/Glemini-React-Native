import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useAppProvider } from "@/contexts/AppProvider";

const Button = ({
  text = "",
  onPress = () => {},
  otherStyles = "",
  textStyles = "",
  icon = null,
  disabled = false,
  type = "fill",
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
			{icon && icon}
			<Text className={`text-white ${textStyles}`}>{text}</Text>
		</TouchableOpacity>
	);
>>>>>>> 578809ec55e9c50c3fc545477018fc7196e302d2
};

export default Button;

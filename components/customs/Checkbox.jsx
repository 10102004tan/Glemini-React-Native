// Checkbox.js
import React from "react";
import { TouchableOpacity, View } from "react-native";

const Checkbox = ({ isChecked, onToggle }) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      className="w-5 h-5 border border-gray-400 justify-center items-center mr-2"
    >
      {isChecked && <View className="w-4 h-4 bg-blue-500" />}
    </TouchableOpacity>
  );
};

export default Checkbox;

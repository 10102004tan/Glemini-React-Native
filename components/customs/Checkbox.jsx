// Checkbox.js
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const Checkbox = ({ isChecked, onToggle }) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      className="w-5 h-5 border border-gray-400 justify-center items-center mr-2"
    >
      {isChecked && <AntDesign name="check" size={16} color="black" />}
    </TouchableOpacity>
  );
};

export default Checkbox;

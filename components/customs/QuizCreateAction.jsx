import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const QuizzCreateAction = ({
   title = '',
   icon = null,
   otherStyles = '',
   handlePress = () => { },
}) => {
   return (
      <TouchableOpacity
         onPress={() => {
            handlePress();
         }}
         style={{ elevation: 5 }}
         className={`p-4 bg-white rounded-xl flex items-center justify-center flex-col ${otherStyles}`}
      >
         <View className="mb-2">{icon && icon}</View>
         <Text>{title}</Text>
      </TouchableOpacity>
   );
};

export default QuizzCreateAction;

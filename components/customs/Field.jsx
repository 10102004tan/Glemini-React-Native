import { View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React from 'react';
import { useAppProvider } from '@/contexts/AppProvider';

const Field = ({
   onChange = () => { },
   value = '',
   type = 'text',
   placeholder = '',
   label = null,
   wrapperStyles = '',
   inputStyles = '',
   icon = null,
   disabled = false,
}) => {
   const { theme } = useAppProvider();
   return (
      <View
         className={`flex flex-col items-start justify-center ${wrapperStyles} `}
      >
         {label && <Text className={`mb-1 text-sm text-gray`}>{label}</Text>}
         <View
            className={`px-4 flex flex-row items-center justify-start py-2 rounded-xl border-gray border w-full ${inputStyles}`}
         >
            {icon && <View className="mr-2">{icon}</View>}

            <TextInput
               editable={!disabled}
               className="w-full"
               value={value}
               placeholderTextColor={'#757575'}
               style={{ color: theme.text }}
               type={type}
               placeholder={placeholder}
               onChangeText={(text) => {
                  onChange(text);
               }}
            />
         </View>
      </View>
   );
};

export default Field;

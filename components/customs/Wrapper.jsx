import { View, StatusBar, SafeAreaView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import { useAppProvider } from '@/contexts/AppProvider';

const Wrapper = ({ children, className, statusTheme = 'dark-content' }) => {
   const { theme } = useAppProvider();
   return (
      <SafeAreaView
         style={{ backgroundColor: theme.background }}
         className="flex-1 relative"
      >
         <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}>
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
            <View className={`flex-1 ${className}`}>{children}</View>
            {/* </TouchableWithoutFeedback> */}
         </KeyboardAvoidingView>
         <StatusBar barStyle={statusTheme} />
      </SafeAreaView>
   );
};

export default Wrapper;

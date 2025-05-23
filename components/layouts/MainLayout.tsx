import { KeyboardAvoidingView, Platform } from "react-native"
import { ScrollView } from "react-native"
import { View, Text, TouchableOpacity, TextInput } from 'react-native'

const MainLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <KeyboardAvoidingView 
    style={{ backgroundColor: "#FFFFFF", flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 30}
    >
     <View style={{ flex: 1, paddingVertical: 20, paddingHorizontal: 10 }}>
        {children}
      </View>
    </KeyboardAvoidingView>

  )
}

export default MainLayout
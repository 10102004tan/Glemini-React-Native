import { KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView } from 'react-native';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <KeyboardAvoidingView
      style={{ backgroundColor: '#FFFFFF', flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 30}
    >
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* auth */}
        <View style={{ flex: 1, paddingVertical: 40, paddingHorizontal: 20 }}>
          {/* logo */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                borderRadius: 10,
                backgroundColor: '#EEF2FF',
                padding: 10,
                marginBottom: 10,
                shadowColor: '#000',
                textAlign: 'center',
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                color: '#3B82F6',
              }}
            >
              G
            </Text>
          </View>
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthLayout;

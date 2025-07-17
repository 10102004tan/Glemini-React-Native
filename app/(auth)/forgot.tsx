import AuthLayout from '@/components/layouts/AuthLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, TextInput } from 'react-native';
const Forgot = () => {
  const { forgotPassword } = useAuthStore();
  const [email, setEmail] = React.useState('');
  const handleForgotPassword = async () => {
    if (!email) {
      alert('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Invalid email address');
      return;
    }
    const response = await forgotPassword(email);
    if (response.success) {
      router.push({
        pathname: '/otp',
        params: { email },
      });
    } else {
      alert(response.error || 'Failed to send email, please try again');
    }
  };
  return (
    <AuthLayout>
      <View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: '600' }}>Forgot Password</Text>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>
            Enter the email you registered with and we will send you a password reset link.
          </Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <View style={{ marginBottom: 14 }}>
            <Text
              style={{
                fontSize: 16,
                color: '#374151',
                fontWeight: '600',
              }}
            >
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              returnKeyType="done"
              onSubmitEditing={handleForgotPassword}
              style={{
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginTop: 10,
                backgroundColor: '#F9FAFB',
              }}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={{ marginBottom: 14 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#4f46e5',
                borderRadius: 8,
                paddingVertical: 15,
                paddingHorizontal: 20,
                alignItems: 'center',
              }}
              onPress={handleForgotPassword}
            >
              <Text style={{ fontSize: 16, color: '#FFFFFF', fontWeight: '600' }}>Send Reset Link</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginBottom: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>
            Remembered your password?
            <Text style={{ color: '#4f46e5', fontWeight: '600' }}> Login</Text>
          </Text>
        </View>
      </View>
    </AuthLayout>
  );
};

export default Forgot;

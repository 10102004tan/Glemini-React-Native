import AuthLayout from '@/components/layouts/AuthLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, Image, FlatList, Dimensions, TouchableOpacity, TextInput } from 'react-native';

const Otp = () => {
  const { checkOtp } = useAuthStore();
  const [otp, setOtp] = React.useState('');
  const { email } = useLocalSearchParams();

  const handleOtpSubmit = async () => {
    if (!otp) {
      alert('Mã OTP không được để trống');
      return;
    }

    const response = await checkOtp(otp, email);
    if (response.success) {
      // Navigate to the next screen or show success message
      router.replace({
        pathname: '/reset',
        params: { otp, email },
      });
    } else {
      alert(response.error || 'Mã OTP không hợp lệ, vui lòng thử lại');
    }
  };

  return (
    <AuthLayout>
      <View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Nhập mã xác nhận (OTP)</Text>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>
            Vui lòng nhập mã xác nhận đã được gửi tới email của bạn.
          </Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <View style={{ marginBottom: 14 }}>
            <Text
              style={{
                fontSize: 16,
                color: '#374151',
                fontWeight: 'bold',
              }}
            >
              Mã OTP
            </Text>

            <TextInput
              value={otp}
              onChangeText={setOtp}
              autoCapitalize="none"
              autoComplete="off"
              returnKeyType="done"
              onSubmitEditing={handleOtpSubmit}
              style={{
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginTop: 10,
                backgroundColor: '#F9FAFB',
              }}
              placeholder="123456"
              placeholderTextColor="#9CA3AF"
              numberOfLines={1}
              maxLength={6}
              keyboardType="numeric"
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
              onPress={handleOtpSubmit}
            >
              <Text style={{ fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' }}>
                Gửi mã xác nhận
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </AuthLayout>
  );
};

export default Otp;

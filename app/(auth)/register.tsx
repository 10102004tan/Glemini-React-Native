import FormRegister from '@/components/customs/FormRegister';
import AuthLayout from '@/components/layouts/AuthLayout';
import { Link } from 'expo-router';
import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Dimensions, TextInput } from 'react-native';
const Register = () => {
  return (
    <AuthLayout>
      <View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Tạo tài khoản mới</Text>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>
            Chỉ cần nhập một vài thông tin cơ bản là bạn đã có thể bắt đầu hành trình học tập rồi!
          </Text>
        </View>
        {/* form input for login */}
        <FormRegister />
        <View style={{ marginBottom: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>
            Đã có tài khoản?
            <Link href={'/(auth)/login'} style={{ color: '#4F46E5', fontWeight: 'bold' }}>
              {' '}
              Đăng nhập
            </Link>
          </Text>
        </View>
      </View>
    </AuthLayout>
  );
};

export default Register;

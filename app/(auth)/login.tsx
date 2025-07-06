import AuthLayout from '@/components/layouts/AuthLayout';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import loginSchema from '@/validation/loginSchema';
import { Link, router } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import FormLogin from '@/components/customs/FormLogin';
const Login = () => {
  const { signIn, error } = useAuthStore();

  return (
    <AuthLayout>
      <View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Đăng nhập vào tài khoản</Text>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>
            Học tập miễn phí và bắt đầu hành trình phát triển kỹ năng của bạn ngay hôm nay!
          </Text>
        </View>

        {/* form input for login */}
        <FormLogin />

        <View style={{ marginBottom: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>
            Chưa có tài khoản?{' '}
            <Link href={'/(auth)/register'} style={{ color: '#4F46E5', fontWeight: 'bold' }}>
              Đăng ký
            </Link>
          </Text>
        </View>
        {/* line */}
        <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 20 }} />

        {/* Forgot password */}
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.push('/forgot')}>
            <Text style={{ fontSize: 16, color: '#4F46E5', fontWeight: 'bold' }}>
              Quên mật khẩu?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
};

export default Login;

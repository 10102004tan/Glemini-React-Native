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
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Masuk ke akun kamu</Text>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>
            Belajar gratis di Namanyajugabelajar.io, dan memulai karir yang kamu cita-citata sejak
            dalam embrio!
          </Text>
        </View>

        {/* form input for login */}
        <FormLogin />

        <View style={{ marginBottom: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>
            Don't have an account?
            <Link href={'/(auth)/register'} style={{ color: '#4F46E5', fontWeight: 'bold' }}>
              Register
            </Link>
          </Text>
        </View>
      </View>
    </AuthLayout>
  );
};

export default Login;

import AuthLayout from '@/components/layouts/AuthLayout';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import FormLogin from '@/components/customs/FormLogin';

const Login = () => {
  return (
    <AuthLayout>
      <View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: '800' }}>Welcome Back!</Text>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>
            Sign in to your ProQuiz account to continue your learning journey.
          </Text>
        </View>

        {/* form input for login */}
        <FormLogin />

        <View style={{ marginBottom: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>
            Don't have an account?
          </Text>
          <Link href={'/(auth)/register'} style={{ color: '#4F46E5' }}>
            Create new account
          </Link>
        </View>
        {/* line */}
        <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 20 }} />

        {/* Forgot password */}
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.push('/forgot')}>
            <Text style={{ fontSize: 16, color: '#4F46E5', textDecorationLine: 'underline' }}>
              Forgot your password?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
};

export default Login;

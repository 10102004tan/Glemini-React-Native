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
          <Text style={{ fontSize: 24, fontWeight: '600' }}>Create a new account</Text>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>
            It's easy! Just fill in a few details and start your learning journey with us.
          </Text>
        </View>
        {/* form input for login */}
        <FormRegister />
        <View style={{ marginBottom: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>
            Already have an account?
            <Link href={'/(auth)/login'} style={{ color: '#4F46E5', fontWeight: 'bold' }}>
              {' '}Login
            </Link>
          </Text>
        </View>
      </View>
    </AuthLayout>
  );
};

export default Register;

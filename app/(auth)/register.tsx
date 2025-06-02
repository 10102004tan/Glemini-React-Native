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
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Bikin akun baru</Text>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>
            Nggak susah kok, kamu cuma tinggal masukin beberapa data aja terus langsung jadi deh!
          </Text>
        </View>
        {/* form input for login */}
        <FormRegister />
        <View style={{ marginBottom: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>
            Sudah punya akun?
            <Link href={'/(auth)/login'} style={{ color: '#4F46E5', fontWeight: 'bold' }}>
              {' '}
              Login
            </Link>
          </Text>
        </View>
      </View>
    </AuthLayout>
  );
};

export default Register;

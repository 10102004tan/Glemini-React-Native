import AuthLayout from '@/components/layouts/AuthLayout';
import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Dimensions, TextInput } from 'react-native';
const Forgot = () => {
  return (
    <AuthLayout>
      <View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Lupa kata sandi</Text>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>
            Masukkan email yang kamu daftarkan sebelumnya, nanti kamu bakal dikirim email.
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
              Email
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginTop: 10,
                backgroundColor: '#F9FAFB',
              }}
              placeholder="email@example.com"
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
              onPress={() => {
                // handle login
              }}
            >
              <Text style={{ fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' }}>Euy!</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginBottom: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>
            Lah, inget lagi kata sandinya?
            <Text style={{ color: '#4f46e5', fontWeight: 'bold' }}>Login!</Text>
          </Text>
        </View>
      </View>
    </AuthLayout>
  );
};

export default Forgot;

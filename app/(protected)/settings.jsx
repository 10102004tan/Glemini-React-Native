import MainLayout from '@/components/layouts/MainLayout';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
export default function SettingsScreen() {
  return (
    <MainLayout>
      <TouchableOpacity
        onPress={() => {
          router.push({ pathname: '/(protected)/pw-change' });
        }}
        style={{
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <MaterialIcons name="security" size={24} color="black" />
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827' }}>
          Đổi mật khẩu
        </Text>
      </TouchableOpacity>
    </MainLayout>
  );
}

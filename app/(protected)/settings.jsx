import MainLayout from '@/components/layouts/MainLayout';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuthStore } from '@/store/useAuthStore';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
export default function SettingsScreen() {
   const { signOut } = useAuthStore();
    const { expoPushToken } = useNotification();
    const handleLogout = () => {
      signOut({
        deviceToken: expoPushToken || null,
      }).then(() => {
        router.replace('/(auth)/login');
      });
    };
  return (
    <MainLayout>

      <Stack.Screen
        options={{
          headerTitle: 'Cài đặt',
          headerTitleStyle: {
            color: '#000',
          },
        }}
      />
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
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827' }}>Đổi mật khẩu</Text>
      </TouchableOpacity>

      {/*btn logout  */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <MaterialIcons name="logout" size={24} color="black" />
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827' }}>Đăng xuất</Text>
      </TouchableOpacity>
    </MainLayout>
  );
}

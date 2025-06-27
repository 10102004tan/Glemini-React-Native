import MainLayout from '@/components/layouts/MainLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
export default function PWChange() {
  const [oldPw, setOldPw] = React.useState('');
  const [newPw, setNewPw] = React.useState('');
  const [confirmPw, setConfirmPw] = React.useState('');
  const { changePw } = useAuthStore();

  const handleChangePassword = async () => {
    if (!oldPw || !newPw || !confirmPw) {
      alert('Semua field harus diisi');
      return;
    }
    if (newPw !== confirmPw) {
      alert('Kata sandi baru dan konfirmasi tidak cocok');
      return;
    }
    const response = await changePw(oldPw, newPw);
    if (response.success) {
      alert('Đổi mật khẩu thành công!');
      //   clear input fields
      setOldPw('');
      setNewPw('');
      setConfirmPw('');
    } else {
      alert(response.error || 'Gagal mengubah kata sandi, silakan coba lagi');
    }
  };
  return (
    <MainLayout>
      <View>
        <View style={{ marginBottom: 20 }}>
          <View style={{ marginBottom: 14 }}>
            <Text
              style={{
                fontSize: 16,
                color: '#374151',
                fontWeight: 'bold',
              }}
            >
              Mật khẩu cũ
            </Text>
            <TextInput
              value={oldPw}
              onChangeText={setOldPw}
              autoCapitalize="none"
              autoComplete="off"
              returnKeyType="done"
              style={{
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginTop: 10,
                backgroundColor: '#F9FAFB',
              }}
              placeholder="********"
              secureTextEntry={true}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={{ marginBottom: 14 }}>
            <Text
              style={{
                fontSize: 16,
                color: '#374151',
                fontWeight: 'bold',
              }}
            >
              Mật khẩu mới
            </Text>
            <TextInput
              autoCapitalize="none"
              value={newPw}
              onChangeText={setNewPw}
              autoComplete="off"
              returnKeyType="done"
              style={{
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginTop: 10,
                backgroundColor: '#F9FAFB',
              }}
              placeholder="********"
              secureTextEntry={true}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={{ marginBottom: 14 }}>
            <Text
              style={{
                fontSize: 16,
                color: '#374151',
                fontWeight: 'bold',
              }}
            >
              Xác nhận mật khẩu mới
            </Text>
            <TextInput
              autoCapitalize="none"
              value={confirmPw}
              onChangeText={setConfirmPw}
              autoComplete="off"
              returnKeyType="done"
              style={{
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginTop: 10,
                backgroundColor: '#F9FAFB',
              }}
              placeholder="********"
              secureTextEntry={true}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={{ marginBottom: 14 }}>
            <TouchableOpacity
              onPress={handleChangePassword}
              style={{
                backgroundColor: '#4f46e5',
                borderRadius: 8,
                paddingVertical: 15,
                paddingHorizontal: 20,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' }}>
                Đổi mật khẩu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </MainLayout>
  );
}

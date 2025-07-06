import AccoutForm from '@/components/customs/AccountForm';
import AccoutntStatusItem from '@/components/customs/AccountStatusItem';
import Loading from '@/components/customs/Loading';
import NotificationCard from '@/components/customs/NotificationCard';
import TypeAccountField from '@/components/customs/TypeAccoutField';
import MainLayout from '@/components/layouts/MainLayout';
import { useNotification } from '@/contexts/NotificationContext';
import api from '@/libs/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

const timeOut = 1000;
const Account = () => {
  const { signOut } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [info, setInfo] = useState(null);
  const { schoolId, schoolName } = useLocalSearchParams();
  const { expoPushToken } = useNotification();

  const handleLogout = () => {
    console.log('[Account] Logging out...', expoPushToken);
    signOut({
      deviceToken: expoPushToken || null,
    }).then(() => {
      router.replace('/(auth)/login');
    });
  };

  useEffect(() => {
    setTimeout(() => {
      fetchData();
    }, timeOut);
    return () => {
      setIsLoading(true);
      setInfo(null);
    };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get('/v2/user/info');
      const { data } = response;
      if (data.metadata) {
        console.log('[Account] Data fetched successfully:', data.metadata);
        setInfo(data.metadata);
        setIsLoading(false);
      }
    } catch (error) {
      console.log('[Account] Error fetching data:', error);
      Toast.show({
        type: 'error',
        text1: 'Có lỗi xảy ra',
        text2: 'Vui lòng thử lại sau',
      });
    }
  }, []);

  if (isLoading && !info && !schoolId && !schoolName) {
    return <Loading duration={timeOut} />;
  }

  return (
    <MainLayout>
      <Stack.Screen
        options={{
          headerTitle: 'Tài khoản',
          headerTitleStyle: {
            color: '#000',
          },
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formWrapper}>
          {/* field for avatar */}
          <AccoutForm info={info} />
        </View>

        <View style={styles.formWrapper}>
          <TypeAccountField />
        </View>

        <View>
          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </Pressable>
          <Pressable style={styles.deleteBtn}>
            <Text style={styles.deleteText}>Xoá tài khoản</Text>
          </Pressable>
        </View>
      </ScrollView>
    </MainLayout>
  );
};
export default Account;

const styles = StyleSheet.create({
  formWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    marginBottom: 20,
  },
  logoutBtn: {
    marginBottom: 20,
  },
  logoutText: {
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1cb0f6',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderBottomWidth: 4,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: '#e5e5e5',
  },
  deleteBtn: {
    marginBottom: 20,
  },
  deleteText: {
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ff4b4b',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderBottomWidth: 4,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: '#e5e5e5',
  },
});

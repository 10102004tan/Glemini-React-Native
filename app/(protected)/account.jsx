import AccoutForm from '@/components/customs/AccountForm';
import AccoutntStatusItem from '@/components/customs/AccountStatusItem';
import Loading from '@/components/customs/Loading';
import NotificationCard from '@/components/customs/NotificationCard';
import MainLayout from '@/components/layouts/MainLayout';
import api from '@/libs/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

const timeOut = 1000;
const Account = () => {
  const {signOut } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [info, setInfo] = useState(null);
  const { schoolId, schoolName } = useLocalSearchParams();

  const handleLogout = async () => {
    signOut().then(() => {
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
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get('/v2/user/info')
      const { data } = response;
      if (data.metadata){
        console.log("[Account] Data fetched successfully:", data.metadata);
        setInfo(data.metadata);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("[Account] Error fetching data:", error);
      Toast.show({
        type: 'error',
        text1: 'Có lỗi xảy ra',
        text2: 'Vui lòng thử lại sau',
      });
    }
  }, []);


  if (isLoading && !info && !schoolId && !schoolName) {
    return <Loading duration={timeOut}/>;
  }



  return (
    <MainLayout>
      <Stack.Screen
        options={{
          headerTitle: 'Account',
          headerStyle: {
            backgroundColor: '#58CC02',
            paddingVertical: 10,
          },
          headerTitleStyle: {
            color: '#fff',
          }
        }}
      />

      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#e5e5e5',
          marginBottom: 20,
        }}
      >
        {/* field for avatar */}
        <AccoutForm info={info}/>

      </View>
      <View>
        <Pressable
          onPress={handleLogout}
          style={{
            marginBottom: 20,
          }}
        >
          <Text
            style={{
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
            }}
          >
            Logout
          </Text>
        </Pressable>
        <Pressable
          style={{
            marginBottom: 20,
          }}
        >
          <Text
            style={{
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
            }}
          >
            Delete
          </Text>
        </Pressable>
      </View>
    </MainLayout>
  );
};
export default Account;

import { useAuthStore } from '@/store/useAuthStore';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Dimensions, Alert,Platform  } from 'react-native';
import Toast from 'react-native-toast-message';
import { showModal } from '@/components/customs/ModalContainer';
import { useNotification } from '@/contexts/NotificationContext';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import Loading from '@/components/customs/Loading';
import ThoLoading from '../../assets/images/thobaymau.2.webp';


const { width } = Dimensions.get('window');
const Home = () => {
  const language = [
    {
      key: 'vi',
      value: 'Tiếng Việt',
    },
    {
      key: 'en',
      value: 'English',
    },
    {
      key: 'ja',
      value: '日本語',
    },
  ];
  const { message } = useLocalSearchParams();

  const banners = [
    {
      id: 1,
      title: 'Application for learning',
      image:
        'https://static.wikia.nocookie.net/smashtopia/images/4/48/The_Impossible_Quiz.png/revision/latest?cb=20240511062657',
    },
    {
      id: 2,
      title: 'Best application for learning',
      image:
        'https://files.realpython.com/media/Build-a-Quiz-Application_Watermarked.373436013115.jpg',
    },
    {
      id: 3,
      title: 'Realtime application for learning',
      image:
        'https://assets.nintendo.com/image/upload/q_auto/f_auto/ncom/software/switch/70010000041181/2b7cc83f26b36e557e8fa013db6d5a398ec18b28a9829ee173bfb500ea1372a8',
    },
  ];

  const { isLoading, isSignedIn,checkAuth } = useAuthStore();


  useEffect(() => {
    checkAuth().catch((error) => {
      if (error.message === 'Network Error') {
        Alert.alert(
          '[DEV] lỗi kết nối mạng',
          'Thay đổi ip hoặc thử lại sau',
          [],
        );
      }
    });
  }, []);

  useEffect(() => {
    if (message) {
      Toast.show({
        type: 'success',
        text1: message,
        position: 'bottom',
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  }, [message]);

  if (isLoading) {
    return (
      <Loading icon={ThoLoading} duration={1000} />
    );
  }

  if (isSignedIn) {
    return <Redirect href={'/(homev2)'} />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
      }}
    >
      {/* logo */}
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            borderRadius: 10,
            marginBottom: 10,
            shadowColor: '#000',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            textTransform: 'uppercase',
          }}
        >
          Glemini
        </Text>
      </View>

      <View style={{ marginBottom: 20, marginTop: 20 }}>
        <FlatList
          horizontal
          pagingEnabled
          data={banners}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                height: 300,
                borderRadius: 10,
                overflow: 'hidden',
                width: width - 40,
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#F3F4F6',
                }}
                resizeMode="cover"
              />

              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 10,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 14,
                  }}
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </Text>
              </View>
            </View>
          )}
          scrollEventThrottle={16}
        />
      </View>

      {/* dots */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        {banners.map((_, index) => (
          <View
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: index === 0 ? '#4f46e5' : '#D1D5DB',
              marginHorizontal: 4,
            }}
          />
        ))}
      </View>

      <View
        style={{
          alignItems: 'center',
          marginBottom: 14,
          marginHorizontal: 20,
          justifyContent: 'center',
          flexDirection: 'row',
          paddingVertical: 20,
          paddingHorizontal: 20,
          backgroundColor: '#eee',
          borderRadius: 100,
          backgroundColor: '#4f46e5',
        }}
      >
        <Link href="/login">
          <Text
            style={{
              fontSize: 16,
              textAlign: 'center',
              color: '#fff',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            Login
          </Text>
        </Link>
      </View>

      <View
        style={{
          alignItems: 'center',
          marginBottom: 14,
          marginHorizontal: 20,
          justifyContent: 'center',
          flexDirection: 'row',
          paddingVertical: 20,
          paddingHorizontal: 20,
          backgroundColor: '#eee',
          borderRadius: 100,
        }}
      >
        <Link href="/register">
          <Text
            style={{
              fontSize: 16,
              textAlign: 'center',
              color: '#000',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            Register
          </Text>
        </Link>
      </View>

      {/* language */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingVertical: 20,
        }}
      >
        {language.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              borderRadius: 8,
              paddingVertical: 5,
              paddingHorizontal: 20,
              alignItems: 'center',
              marginBottom: 20,
              borderBottomColor: '#D1D5DB',
              // check if selected
              borderBottomWidth: item.key === 'vi' ? 2 : 0,
            }}
            onPress={() => {
              // handle login
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
export default Home;

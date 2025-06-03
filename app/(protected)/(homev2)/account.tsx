import AccoutntStatusItem from '@/components/customs/AccountStatusItem';
import NotificationCard from '@/components/customs/NotificationCard';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useCallback } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
const Account = () => {
  const { user, signOut, error } = useAuthStore();

  const handleLogout = async () => {
    signOut().then(() => {
      if (!error) {
        router.push('/(auth)/login');
      }
    });
  };

  const actions = [
    {
      title: 'Change Password',
      icon: <FontAwesome name="lock" size={24} color="#4f46e5" />,
      onPress: () => {
        router.push({
          pathname: '/(protected)/change-password',
        });
      },
    },
    {
      title: 'Edit Profile',
      icon: <FontAwesome name="user" size={24} color="#4f46e5" />,
      onPress: () => {
        router.push('/(protected)/profile-edit');
      },
    },
    {
      title: user.user_role === 'teacher' ? 'Thông tin giáo viên' : 'Nâng cấp tài khoản',
      icon: <FontAwesome name="users" size={24} color="#4f46e5" />,
      onPress: () => {
        router.push({
          pathname: '/(protected)/(teacher)/verify',
        });
      },
    },
    {
      title: 'Notification',
      icon: <Entypo name="notification" size={24} color="#4f46e5" />,
      onPress: () => {
        router.push('/(protected)/notification');
      },
    },
    {
      title: 'Privacy Policy',
      icon: <FontAwesome name="shield" size={24} color="#4f46e5" />,
      onPress: () => {
        // router.push("/(protected)/(homev2)/privacy-policy");
      },
    },
    {
      title: 'Terms of Service',
      icon: <FontAwesome name="file-text" size={24} color="#4f46e5" />,
      onPress: () => {
        // router.push("/(protected)/(homev2)/terms-of-service");
      },
    },
    {
      title: 'Logout',
      icon: <FontAwesome name="sign-out" size={24} color="#4f46e5" />,
      onPress: () => {
        handleLogout();
      },
      style: {},
    },
  ];

  const renderActions = useCallback(() => {
    return actions.map((action, index) => (
      <TouchableOpacity
        key={index}
        onPress={action.onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}
      >
        {action.icon}
        <Text
          style={{
            fontSize: 16,
            color: '#374151',
            marginLeft: 10,
          }}
        >
          {action.title}
        </Text>
      </TouchableOpacity>
    ));
  }, [actions]);
  return (
    <MainLayout>
      <View
        style={{
          marginTop: 30,
        }}
      >
        {/* profile */}
        <View
          style={{
            marginHorizontal: 'auto',
            alignItems: 'center',
          }}
        >
          <Image
            source={{ uri: user?.user_avatar }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginBottom: 20,
            }}
          />
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#374151',
              marginBottom: 10,
            }}
          >
            {user?.fullname}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#6B7280',
              marginBottom: 20,
            }}
          >
            {user?.email}
          </Text>
        </View>

        {renderActions()}
      </View>
    </MainLayout>
  );
};
export default Account;

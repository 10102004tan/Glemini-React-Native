import React from 'react';
import { View, TouchableOpacity, TextInput, Text } from 'react-native';
import NotificationIcon from '@/components/customs/NotificationIcon';
import { useAuthStore } from '@/store/useAuthStore';
import { router } from 'expo-router';

const SearchQuizBar = () => {
  const { user } = useAuthStore();
  const handleRedirectSearch = () => {
    router.push({ pathname: '/(protected)/search' });
  };
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent:"space-between",
        marginBottom: 14,
        alignItems: 'center',
      }}
    >
      <View>
        <TouchableOpacity onPress={handleRedirectSearch} style={{ width: 300 }}>
          <TextInput
            editable={false}
            style={{
              borderWidth: 1,
              borderColor: '#D1D5DB',
              borderRadius: 15,
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: '#F9FAFB',
            }}
            placeholder="Gần đây có gì mới? Tìm kiếm ngay!"
            placeholderTextColor="#9CA3AF"
          />
        </TouchableOpacity>
      </View>
      <NotificationIcon numberOfUnreadNoti={user.count_notification_unread || 0} />
    </View>
  );
};
export default SearchQuizBar;

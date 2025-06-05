import FieldRow from '@/components/customs/FieldRow';
import FormTeacherPlan from '@/components/customs/FormTeacherPlan';
import UploadField from '@/components/customs/UploadField';
import MainLayout from '@/components/layouts/MainLayout';
import api from '@/libs/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';


const VerifyTeacher = () => {
  const { user } = useAuthStore();

  const renderContent = () => {
    if (user?.status_teacher_verified === 'pending') {
      return (
        <View>
          <Text
            style={{
              fontSize: 16,
              color: '#6B7280',
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            Yêu cầu xác thực của bạn đang được xử lý. Vui lòng chờ đợi.
          </Text>
        </View>
      );
    } else if (user?.status_teacher_verified === 'active') {
      return (
        <View>
          <Text
            style={{
              fontSize: 16,
              color: '#16A34A',
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            Tài khoản giáo viên của bạn đã được xác thực thành công.
          </Text>
        </View>
      );
    } else {
      return (
        <FormTeacherPlan />
      );
    }
  };
  return (
    <MainLayout>
      <Stack.Screen
        options={{
          headerTitle: 'Xác thực',
          headerTitleAlign: 'left',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
        }}
      />
      {renderContent()}
    </MainLayout>
  );
};


export default VerifyTeacher;

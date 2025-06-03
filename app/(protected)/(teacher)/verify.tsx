import MainLayout from '@/components/layouts/MainLayout';
import api from '@/libs/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Entypo } from '@expo/vector-icons';
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
import { TextInput } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

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
        <ScrollView>
          <FormVerify />
        </ScrollView>
      );
    }
  };
  return (
    <MainLayout>
      <Stack.Screen
        options={{
          headerTitle: 'Xác thực tài khoản giáo viên',
          headerTitleAlign: 'center',
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

const UploadItem = ({
  title = 'Giấy xác nhận',
  icon = <Entypo name="upload" size={24} color="#1E77CC" />,
  description = 'Tải lên ảnh căn cước công dân của bạn',
  onPress = () => {},
}) => {
  return (
    <View
      style={{
        // border line - - -
        borderColor: '#1E77CC',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 5,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          paddingVertical: 10,
          marginBottom: 10,
          color: '#1E77CC',
        }}
      >
        {title}
      </Text>
      {icon}
      <Text
        style={{
          fontSize: 12,
          color: '#6B7280',
          marginTop: 10,
        }}
      >
        ({description})
      </Text>
    </View>
  );
};

const FormVerify = () => {
  const { user } = useAuthStore();
  const verifyTeacherHandler = async () => {
    try {
      const body = {};
      const response = await api.post('/v2/auth/teacher/create', body);
      const data = response.data;
      if (data) {
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Yêu cầu xác thực đã được gửi thành công.',
        });

        // set user to verified
        useAuthStore.setState({
          user: {
            ...user,
            status_teacher_verified: 'pending',
          },
        });
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: error.response.data.message || 'Vui lòng kiểm tra lại thông tin.',
          });
        } else if (error.response.status === 401) {
          Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: 'Bạn không có quyền truy cập vào chức năng này.',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
        });
      }
    }
  };
  return (
    <View>
      {/* seaction */}
      <View>
        <View
          style={{
            marginBottom: 20,
            flexDirection: 'row',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              marginRight: 10,
              width: 40,
              height: 40,
              textAlign: 'center',
              lineHeight: 40,
              backgroundColor: '#073484',
              color: '#fff',
            }}
          >
            1
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: '#073484',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              borderBottomColor: '#073484',
              borderBottomWidth: 1,
              flex: 1,
              paddingTop: 5,
            }}
          >
            Thông tin cá nhân
          </Text>
        </View>
        <View>
          <TextInput
            placeholder="Họ và tên"
            style={{
              borderColor: '#E5E7EB',
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
            }}
          />
          <TextInput
            placeholder="Ngày sinh"
            style={{
              borderColor: '#E5E7EB',
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
            }}
          />
          <TextInput
            placeholder="Giới tính"
            style={{
              borderColor: '#E5E7EB',
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
            }}
          />

          <TextInput
            placeholder="Số điện thoại"
            style={{
              borderColor: '#E5E7EB',
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
            }}
          />
          <TextInput
            placeholder="Email liên hệ"
            style={{
              borderColor: '#E5E7EB',
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
            }}
          />
        </View>
      </View>

      <View>
        <View
          style={{
            marginBottom: 20,
            flexDirection: 'row',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              marginRight: 10,
              width: 40,
              height: 40,
              textAlign: 'center',
              lineHeight: 40,
              backgroundColor: '#073484',
              color: '#fff',
            }}
          >
            2
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: '#073484',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              borderBottomColor: '#073484',
              borderBottomWidth: 1,
              flex: 1,
              paddingTop: 5,
            }}
          >
            Giấy tờ yêu cầu
          </Text>
        </View>
        <View>
          <UploadItem />
          <UploadItem />
          <UploadItem />
        </View>
      </View>
      <Pressable
        onPress={verifyTeacherHandler}
        style={{
          backgroundColor: '#1E77CC',
          padding: 15,
          borderRadius: 5,
          marginTop: 20,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          Gửi yêu cầu xác thực
        </Text>
      </Pressable>
    </View>
  );
};

export default VerifyTeacher;

import ProfilePictureField from './ProfilePictureField';
import FieldRow from './FieldRow';
import SchoolField from './SchoolField';
import { Pressable, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';

const AccountForm = ({
  info = {
    name: '',
    email: '',
    phone: '',
    school:{
        id: '',
        name: '',
    }
  },
}) => {
  const { schoolId, schoolName } = useLocalSearchParams();
  const [dirtyNew, setDirtyNew] = useState(false);
  const {updateInfo} = useAuthStore();


  useEffect(() => {
    if (schoolId && schoolId !== info.school?.id) {
      setDirtyNew(true);
    }
  }, [info, schoolId]);

  return (
    <Formik
      initialValues={{
        name: info?.name || '',
        email: info?.email || '',
        phone: info?.phone || '',
        image: info?.image || '',
        schoolId: schoolId || info?.school?.id || '',
      }}
      onSubmit={async(values,{
        setSubmitting
      }) => {
        const updatedInfo = {
          ...values,
        };
        setSubmitting(true);
        const result =  await updateInfo(updatedInfo);
        if (result.success){
            setDirtyNew(false);
            Toast.show({
              type: 'success',
              text1: 'Cập nhật thành công',
              text2: 'Thông tin tài khoản đã được cập nhật',
            });
        }else {
            Toast.show({
              type: 'error',
                text1: 'Có lỗi xảy ra',
                text2: result.message || 'Vui lòng thử lại sau',
            });
        }
        setSubmitting(false);
      }}
      enableReinitialize
    >
      {({ values, handleChange, handleBlur, handleSubmit, setFieldValue, dirty,isSubmitting }) => (
        <View>
          <ProfilePictureField
            image={values.image}
            setImage={(img) => setFieldValue('image', img)}
          />
          <FieldRow
            label="Name"
            value={values.name}
            placeholder="Họ và tên"
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
          />
          <FieldRow
            label="Email"
            value={values.email}
            placeholder="Email"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
          />
          <FieldRow
            label="Phone"
            value={values.phone}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            onChangeText={handleChange('phone')}
            onBlur={handleBlur('phone')}
          />
          <SchoolField schoolName={
            // info.school.name ? info.school.name :  (schoolName || 'Chọn trường học')
            schoolName || info.school.name || 'Chọn trường học'
          } schoolId={schoolId} />
          <Pressable
            onPress={handleSubmit}
            android_ripple={{ color: '#ccc' }}
            style={{
              backgroundColor: (dirty || dirtyNew) ? '#58CC02' : '#f3f3f3',
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 15,
            //   opacity: (dirty || dirtyNew) ? 1 : 0.5,
              borderBottomWidth: 4,
              borderRightWidth: 2,
                borderLeftWidth: 2,
             borderTopWidth: 2,
              borderColor: '#e5e5e5',
            }}
            disabled={!(dirty || dirtyNew)}
          >
            <Text
              style={{
                textTransform: 'uppercase',
                fontSize: 16,
                fontWeight: 'bold',
                color: (dirty || dirtyNew) ? '#fff' : '#aaa',
                textAlign: 'center',
              }}
            >
              {
                isSubmitting ? 'Đang cập nhật...' : 'Cập nhật thông tin'
              }
            </Text>
          </Pressable>
        </View>
      )}
    </Formik>
  );
};

export default AccountForm;

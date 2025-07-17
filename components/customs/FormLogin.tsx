import images from '@/constants/images';
import { useAuthStore } from '@/store/useAuthStore';
import loginSchema from '@/validation/loginSchema';
import { router } from 'expo-router';
import { Formik } from 'formik';
import { Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import Toast from 'react-native-toast-message';

const FormLogin = () => {
  const { signIn, error } = useAuthStore();

  const handleLogin = async (
    values: any,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setSubmitting(true);
    const result = await signIn(values.email, values.password);
    if (result.success) {
      router.replace({
        pathname: '/(protected)/(homev2)/',
        params: {
          message: 'Login successful',
        },
      });
    } else {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Login failed',
        text2: result.error,
      });
    }
    setSubmitting(false);
  };
  return (
    <Formik
      initialValues={{ email: 'tan987@gmail.com', password: '12345678' }}
      validationSchema={loginSchema}
      onSubmit={handleLogin}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
        <View style={{ marginBottom: 20 }}>
          {/* errors */}
          {errors.email && touched.email && (
            <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email}</Text>
          )}
          <View style={{ marginBottom: 14 }}>
            <Text
              style={{
                fontSize: 16,
                color: '#374151',
                fontWeight: '600',
              }}
            >
              Email
            </Text>

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginTop: 10,
                backgroundColor: '#F9FAFB',
              }}
              onChangeText={handleChange('email')}
              value={values.email}
              placeholder="email@example.com"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {errors.password && touched.password && (
            <Text style={{ color: 'red', marginBottom: 10 }}>{errors.password}</Text>
          )}
          <View style={{ marginBottom: 14 }}>
            <Text
              style={{
                fontSize: 16,
                color: '#374151',
                fontWeight: '600',
              }}
            >
              Password
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#D1D5DB',
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: '#F9FAFB',
                marginTop: 10,
              }}
              onChangeText={handleChange('password')}
              value={values.password}
              placeholder="********"
              secureTextEntry={true}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={{ marginBottom: 14 }}>
            <TouchableOpacity
              onPress={() => handleSubmit()}
              style={{
                backgroundColor: '#4f46e5',
                borderRadius: 8,
                paddingVertical: 15,
                paddingHorizontal: 20,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 16, color: '#FFFFFF', fontWeight: '600' }}>
                {isSubmitting ? 'Loading...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Social login row */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <TouchableOpacity style={{ padding: 5, borderRadius: 50, borderWidth: 1, borderColor: '#eee', marginHorizontal: 4 }} disabled>
              <Image source={images.googleLogo} style={{ width: 32, height: 32, resizeMode: 'contain' }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 5, borderRadius: 50, borderWidth: 1, borderColor: '#eee', marginHorizontal: 4 }} disabled>
              <Image source={images.facebookLogo} style={{ width: 32, height: 32, resizeMode: 'contain' }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 10, borderRadius: 50, borderWidth: 1, borderColor: '#eee', marginHorizontal: 4 }} disabled>
              <Image source={images.zaloLogo} style={{ width: 24, height: 24, resizeMode: 'contain' }} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default FormLogin;

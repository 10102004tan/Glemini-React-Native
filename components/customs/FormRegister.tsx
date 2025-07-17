import { useAuthStore } from '@/store/useAuthStore';
import registerSchema from '@/validation/registerSchema';
import { router } from 'expo-router';
import { Formik } from 'formik';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

const FormRegister = () => {
  const { signUp } = useAuthStore();
  const handleRegister = async (
    values: { fullname: string; email: string; password: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setSubmitting(true);
    const result = await signUp(values);
    if (result.success) {
      router.replace({
        pathname: '/(auth)/',
        params: {
          message: 'Account created successfully, please login.',
        },
      });
    } else {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Registration failed',
        text2: result.error,
      });
    }
    setSubmitting(false);
  };
  return (
    <Formik
      initialValues={{
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={registerSchema}
      onSubmit={handleRegister}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
        <View style={{ marginBottom: 20 }}>
          {/* errors */}
          {errors.fullname && touched.fullname && (
            <Text style={{ color: 'red', marginBottom: 10 }}>{errors.fullname}</Text>
          )}

          <View style={{ marginBottom: 14 }}>
            <Text
              style={{
                fontSize: 16,
                color: '#374151',
                fontWeight: '600',
              }}
            >
              Full Name
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
              onChangeText={handleChange('fullname')}
              onBlur={handleBlur('fullname')}
              value={values.fullname}
              autoCapitalize="words"
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

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
              onBlur={handleBlur('email')}
              value={values.email}
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* errors */}
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
              placeholder="Enter your password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              autoCapitalize="none"
              autoComplete="password"
              secureTextEntry={true}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* errors */}
          {errors.confirmPassword && touched.confirmPassword && (
            <Text style={{ color: 'red', marginBottom: 10 }}>{errors.confirmPassword}</Text>
          )}
          <View style={{ marginBottom: 14 }}>
            <Text
              style={{
                fontSize: 16,
                color: '#374151',
                fontWeight: '600',
              }}
            >
              Confirm Password
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
              placeholder="Re-enter your password"
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
              autoCapitalize="none"
              autoComplete="password"
              secureTextEntry={true}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <Text
            style={{
              marginBottom: 14,
              fontSize: 12,
              color: '#374151',
            }}
          >
            By signing up, you agree to the Terms of Service and Privacy Policy of ProQuiz.
          </Text>

          <View style={{ marginBottom: 14 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#4f46e5',
                borderRadius: 8,
                paddingVertical: 15,
                paddingHorizontal: 20,
                alignItems: 'center',
              }}
              onPress={() => {
                handleSubmit();
              }}
            >
              <Text style={{ fontSize: 16, color: '#FFFFFF', fontWeight: '600' }}>
                {isSubmitting ? 'Registering...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default FormRegister;

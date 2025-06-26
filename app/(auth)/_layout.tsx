import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerTitle: '',
          animation: 'slide_from_right',
        }}
      />

      <Stack.Screen
        name="register"
        options={{
          headerTitle: '',
          animation: 'slide_from_right',
        }}
      />

      <Stack.Screen
        name="forgot"
        options={{
          headerTitle: '',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="reset"
        options={{
          headerTitle: '',
          animation: 'slide_from_right',
        }}
      />

      <Stack.Screen
        name="otp"
        options={{
          headerTitle: '',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}

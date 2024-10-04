import { Redirect, Stack } from "expo-router";
import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Text } from "react-native";

export default function AppRootLayout() {
  const { userData, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (!userData) {
    return <Redirect href={"/(auths)/sign-in"} />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(home)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerTitle: "Thông tin cá nhân",
        }}
      />

      <Stack.Screen
        name="settings"
        options={{
          headerTitle: "Cài đặt",
        }}
      />
    </Stack>
  );
}

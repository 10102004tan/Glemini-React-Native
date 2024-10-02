import { Redirect, Slot, Stack } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { FontAwesome } from "@expo/vector-icons";
import { View } from "react-native";

export default function AppRootLayout() {

    const { userData, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <Text>Loading...</Text>;
    }
    if (!userData) {
        return <Redirect href={'/(auths)/sign-in'} />;
    }

    return (
        <Stack>
            <Stack.Screen name="(home)" options={{
                headerShown: false
            }} />
            <Stack.Screen name="profile"
                options={{
                    headerTitle: 'Thông tin cá nhân',
                }}
            />

            <Stack.Screen name="settings"
                options={{
                    headerTitle: 'Cài đặt',
                }}
            />
        </Stack>
    )
}
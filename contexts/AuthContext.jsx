'use strict';
import { Slot } from "expo-router";
import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext();
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";

export const AuthProvider = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchAccessToken = async () => {
            const value = await AsyncStorage.getItem('userData');
            setUserData(JSON.parse(value));
            setIsLoading(false);
        };

        fetchAccessToken();
    }, []);
    const signIn = async ({ email, password }) => {
        const response = await fetch('http://10.0.106.188:3000/api/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (data.statusCode === 200) {
            const { tokens: { accessToken, refreshToken }, user: { user_type, user_fullname, _id, user_avatar,user_email } } = data.metadata;
            const dataStore = { user_type, user_fullname, _id, user_avatar, accessToken, refreshToken,user_email };
            await AsyncStorage.setItem('userData', JSON.stringify(dataStore));
            setUserData(dataStore);
            return data.message;
        }

        return data.message;

    }
    const signUp = async ({
        email,
        password,
        fullname,
        type
    }) => {
        const response = await fetch('http://10.0.106.188:3000/api/v1/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, fullname, type })
        });

        const data = await response.json();
        const { tokens: { accessToken, refreshToken }, user: { user_type, user_fullname, _id, user_avatar,user_email } } = data.metadata;
        if (data.statusCode === 200) {
            const dataStore = { user_type, user_fullname, _id, user_avatar, accessToken, refreshToken,user_email };
            await AsyncStorage.setItem('userData', JSON.stringify(dataStore));
            setUserData(dataStore);
            return 1;
        }
        return 0;
    };

    const signOut = async () => {
        const response = await fetch('http://10.0.106.188:3000/api/v1/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${userData.accessToken}`,
                'x-client-id': userData._id
            }
        });
        const data = await response.json();
        if (data.statusCode === 200) {
            await AsyncStorage.removeItem('userData');
            setUserData(null);
            Alert.alert('Logout', 'Logout successfully');
        }else{
            if (data.message === 'expired') {
                await processAccessTokenExpired();
                console.log('session expired');
            }
        }

    }

    const changePassword = async ({ oldPassword, newPassword }) => {
        if (!userData) return;
        const { accessToken, _id: user_id } = userData;
        const response = await fetch('http://10.0.106.188:3000/api/v1/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${accessToken}`,
                'x-client-id': user_id
            },
            body: JSON.stringify({ oldPassword, newPassword })
        })

        const data = await response.json();

        // if old password is incorrect
        if (data.statusCode === 400) {
            Alert.alert('Change password', data.message);
        }

        // if access token expired
        if (data.statusCode === 401) {
            processAccessTokenExpired();
            changePassword({ oldPassword, newPassword });
        }

        if (data.statusCode === 200) {
            console.log(data);
            if (data.statusCode === 200) {
                // update refresh token and access token
                const { tokens: { accessToken, refreshToken } } = data.metadata;
                const dataStore = { ...userData, accessToken, refreshToken };
                await AsyncStorage.setItem('userData', JSON.stringify(dataStore));
                setUserData(dataStore);
                Alert.alert('Change password', 'Change password successfully');
            }
        }
    }

    /**
     * @description : Xu ly khi access token het han, su dung refresh token de lay access token moi
     */
    const processAccessTokenExpired = async () => {
        const response = await fetch('http://10.0.106.188:3000/api/v1/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-refresh-token': `${userData.refreshToken}`,
                'x-client-id': userData._id
            }
        });

        const data = await response.json();
        if (data.statusCode === 200) {
            const { tokens: { accessToken, refreshToken } } = data.metadata;
            const dataStore = { ...userData, accessToken, refreshToken };
            await AsyncStorage.setItem('userData', JSON.stringify(dataStore));
            setUserData(dataStore);
        }
       
        if (data.message === 'expired') {
            await AsyncStorage.removeItem('userData');
            setUserData(null);
            Alert.alert('Session expired', 'Please login again');
        }

    };
    return (
        <AuthContext.Provider value={{
            signIn,
            signUp,
            signOut,
            isLoading,
            setUserData,
            userData,
            changePassword,
            processAccessTokenExpired
        }}>
            <Slot />
        </AuthContext.Provider>
    );
};









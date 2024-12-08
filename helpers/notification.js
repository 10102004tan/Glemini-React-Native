import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import {Platform} from "react-native";
import {Redirect, router} from "expo-router";
import {useContext, useEffect} from "react";


export async function sendPushNotification(expoPushToken) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

export function handleRegistrationError(errorMessage) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

export async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            sound:'notification.wav',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            handleRegistrationError('Permission not granted to get push token for push notification!');
            return;
        }
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            //handleRegistrationError('Project ID not found');
            console.log('Project ID not found');
        }
        try {
            return (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
        } catch (e) {
            handleRegistrationError(`${e}`);
        }
    } else {
        //handleRegistrationError('Must use physical device for push notifications');
        console.log('Must use physical device for push notifications');
    }
}

export function useNotificationObserver({setTeacherStatus}) {
    useEffect(() => {
        let isMounted = true;
        function redirect(notification) {
            const url = notification.request.content.data?.url;
            const teacherStatus = notification.request.content.data?.teacherStatus;
            if (url) {
                router.push(url);
            }
            if (teacherStatus) {
                setTeacherStatus(teacherStatus);
            }
        }

        // Check if the app was opened by a notification
        Notifications.getLastNotificationResponseAsync()
            .then(response => {
                // eslint-disable-next-line no-unused-expressions
                if (!isMounted || !response?.notification) {
                    return;

                }
                redirect(response?.notification); // Redirect to the URL in the notification
            });

        // Listen for incoming notifications while the app is in the foreground
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            redirect(response.notification);
        });

        // Clean up
        return () => {
            // eslint-disable-next-line no-unused-expressions
            isMounted = false;
            // eslint-disable-next-line no-unused-expressions
            subscription.remove();
        };
    }, []);
}
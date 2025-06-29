import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { Subscription } from 'expo-modules-core';
import { registerForPushNotificationsAsync } from '@/utils/registerForPushNotificationsAsync';
import api from '@/libs/axios';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
  sendPushTokenToServer: (userId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  // send the push token to the server
  const sendPushTokenToServer = async (userId: string) => {
    try {
      const deviceToken = expoPushToken;
      const deviceOs = Platform.OS;
      const deviceName = Constants.deviceName ?? 'unknown';
      const body = {
        userId,
        deviceToken,
        deviceOs,
        deviceName,
      };
      const response = await api.post('/v2/user/push-token', body);
      const data = response.data;
      console.log('Push token sent to server:', data);
    } catch (error) {
      console.log('Error sending push token to server:', error);
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => setExpoPushToken(token),
      (error) => setError(error),
    );

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('🔔 Notification Received: ', notification);
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(
        '🔔 Notification Response: ',
        JSON.stringify(response, null, 2),
        JSON.stringify(response.notification.request.content.data, null, 2),
      );
      // Handle the notification response here
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error, sendPushTokenToServer }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

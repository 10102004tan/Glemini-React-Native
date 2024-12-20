import { Link, Redirect, router, Tabs } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useAppProvider } from "@/contexts/AppProvider";
import { AuthContext } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import NotificationIcon from "@/components/customs/NotificationIcon";

export default function TabLayout() {
   const { isHiddenNavigationBar, i18n } = useAppProvider();
   const {
      userData: { user_type },
      numberOfUnreadNoti,
   } = useContext(AuthContext);
   return (
      <Tabs
         screenOptions={{
            tabBarStyle: {
               height: 60,
               position: "absolute",
               bottom: 10,
               borderRadius: 200,
               left: "2%",
               right: "2%",
               width: "96%",
               backgroundColor: "#fff",
               shadowOpacity: 0,
               borderTopWidth: 0,
               zIndex: isHiddenNavigationBar ? -1 : 1,
            },
            tabBarActiveTintColor: "#1C2833",
            tabBarShowLabel: false,
         }}
      >
         <Tabs.Screen
            name="index"
            options={{
               title: "Home",
               headerShown: false,
               tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon
                     name={focused ? "home" : "home-outline"}
                     color={color}
                  />
               ),
            }}
         />

         <Tabs.Screen
            name="libraly"
            options={{
               headerShown: false,
               tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon
                     name={focused ? "library-sharp" : "library-outline"}
                     color={color}
                  />
               ),
               tabBarButton: (props) => {
                  if (user_type === "student") {
                     return null;
                  } else {
                     return <TouchableOpacity {...props} />;
                  }
               },
            }}
         />

         <Tabs.Screen
            name="search"
            options={{
               title: i18n.t("search.title"),
               tabBarIcon: ({ color, focused }) => (
                  <View>
                     {
                        focused ? (
                           <Ionicons name="search" size={30} color={color} />
                        ) : (
                           <Ionicons name="search-outline" size={30} color={color} />
                        )
                     }
                  </View>
               ),
            }}
         />

         <Tabs.Screen
            name="report"
            options={{
               title: i18n.t("report.title"),
               tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon
                     name={focused ? "document-sharp" : "document-outline"}
                     color={color}
                  />
               ),
               tabBarButton: (props) => {
                  if (user_type === "student") {
                     return null;
                  } else {
                     return <TouchableOpacity {...props} />;
                  }
               },
            }}
         />

         <Tabs.Screen
            name="activity"
            options={{
               title: i18n.t('activity.title'),
               tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon
                     name={focused ? "analytics-sharp" : "analytics-outline"}
                     color={color}
                  />
               ),
               tabBarButton: (props) => {
                  if (user_type === "teacher") {
                     return null;
                  } else {
                     return <TouchableOpacity {...props} />;
                  }
               },
            }}
         />

         <Tabs.Screen
            name="classroom"
            options={{
               title: i18n.t("classroom.title"),
               tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon
                     name={focused ? "school" : "school-outline"}
                     color={color}
                  />
               ),
            }}
         />

         <Tabs.Screen
            name="account"
            options={{
               title: i18n.t("account.title"),
               tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon
                     name={focused ? "moon" : "moon-outline"}
                     color={color}
                  />
               ),
               headerRight: () => {
                  return (
                     <Link
                        style={{
                           marginRight: 20,
                        }}
                        href={{
                           pathname: "(app)/settings",
                        }}
                     >
                        <TabBarIcon name="settings" color="#1C2833" />
                     </Link>
                  );
               },
            }}
         />
      </Tabs>
   );
}

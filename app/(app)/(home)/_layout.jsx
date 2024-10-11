import { Link, Redirect, Tabs } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { TouchableOpacity } from "react-native";
import { useAppProvider } from "@/contexts/AppProvider";
import { AuthContext } from "@/contexts/AuthContext";

export default function TabLayout() {
  const { isHiddenNavigationBar, i18n } = useAppProvider();
  const {
    userData: { user_type },
  } = useContext(AuthContext);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          position: "absolute",
          bottom: 20,
          borderRadius: 200,
          backgroundColor: "#fff",
          left: "5%",
          right: "5%",
          width: "90%",
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
          title: "Thư viện của tôi",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "library-sharp" : "library-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Tìm kiếm",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "search-circle-sharp" : "search-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="report"
        options={{
          title: "Báo cáo",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "document-sharp" : "document-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="teacher_home_screen"
        options={{
          title: "Lớp học",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "people" : "people-outline"}
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
        name="student_home_screen"
        options={{
          title: "Classes",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "school" : "school-outline"}
              color={color}
            />
          )
        }}/>
			<Tabs.Screen
				name="classroom"
				options={{
					title: i18n.t('classes.title'),
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? 'school' : 'school-outline'}
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
        name="account"
        options={{
          title: "Tài khoản",
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
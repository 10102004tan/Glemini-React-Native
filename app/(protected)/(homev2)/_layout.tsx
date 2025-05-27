import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useAuthStore } from "@/store/useAuthStore";
import { Slot, Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function TabLayout() {
    const {user} = useAuthStore();
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
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
                name="classroom"
                options={{
                    title: "Classroom",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "school" : "school-outline"}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="report.teacher"
                options={{
                    title: "Report",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "document-sharp" : "document-outline"}
                            color={color}
                        />
                    ),
                    tabBarButton: (props) => (
                        user.user_role === "user" ? (
                            <TouchableOpacity {...props} />
                        ) : (
                            null
                        )
                    ),
                }}
            />

            <Tabs.Screen
                name="library.teacher"
                options={{
                    title: "Library",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "library" : "library-outline"}
                            color={color}
                        />
                    ),
                    tabBarButton: (props) => (
                        user.user_role === "teacher" ? (
                            <TouchableOpacity {...props} />
                        ) : (
                            null
                        )
                    ),
                }}
            />

            <Tabs.Screen
                name="activity.student"
                options={{
                    title: "Activity",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "analytics-sharp" : "analytics-outline"}
                            color={color}
                        />
                    ),
                    tabBarButton: (props) => (
                        user.user_role === "user" ? (
                            <TouchableOpacity {...props} />
                        ) : (
                            null
                        )
                    ),
                }}
            />

            <Tabs.Screen
                name="account"
                options={{
                    title: "Account",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "moon" : "moon-outline"}
                            color={color}
                        />
                    ),
                }}
            />

        </Tabs>
    )
}
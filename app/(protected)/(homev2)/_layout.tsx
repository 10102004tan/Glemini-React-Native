import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useAppProvider } from '@/contexts/AppProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { Link, router, Slot, Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function TabLayout() {
  const { user } = useAuthStore();
  const { isHiddenNavigationBar, i18n } = useAppProvider();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          // height: 60,
          // position: 'absolute',
          // bottom: 10,
          // borderRadius: 200,
          // left: '2%',
          // right: '2%',
          // width: '96%',
          // backgroundColor: '#fff',
          // shadowOpacity: 0,
          // borderTopWidth: 0,
          // zIndex: !isHiddenNavigationBar ? -1 : 1,
        },
        tabBarActiveTintColor: '#1C2833',
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="classroom"
        options={{
          title: 'Classroom',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'school' : 'school-outline'} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="report.teacher"
        options={{
          title: 'Report',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'document-sharp' : 'document-outline'} color={color} />
          ),
          tabBarButton: (props) =>
            user.user_role === 'teacher' ? <TouchableOpacity {...props} /> : null,
        }}
      />

      <Tabs.Screen
        name="library.teacher"
        options={{
          // title: 'Thư viện',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'library' : 'library-outline'}
              color={color}
            />
          ),
          tabBarButton: (props) =>
            user.user_role === 'teacher' ? <TouchableOpacity {...props} /> : null,
        }}
      />

      <Tabs.Screen
        name="activity.student"
        options={{
          title: 'Activity',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'analytics-sharp' : 'analytics-outline'} color={color} />
          ),
          tabBarButton: (props) =>
            user.user_role === 'user' ? <TouchableOpacity {...props} /> : null,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          headerRight: () => (
            <Link
              href={{
                pathname: '/(protected)/settings',
              }}
              style={{ marginRight: 10 }}
            >
              <Ionicons name="settings" size={24} color="black" />
            </Link>
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'moon' : 'moon-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

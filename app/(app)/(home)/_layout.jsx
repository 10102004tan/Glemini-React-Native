import { Redirect, Tabs } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useUserProvider } from '@/contexts/UserProvider';
import { TouchableOpacity } from 'react-native';
import { useAppProvider } from '@/contexts/AppProvider';

export default function TabLayout() {
	const { isHiddenNavigationBar, setIsHiddenNavigationBar } =
		useAppProvider();

	const [user, setUser] = useState({
		type: 'student',
	});

	if (!user) {
		return <Redirect href={'/sign_in'} />;
	}

	return (
		<Tabs
			screenOptions={{
				tabBarStyle: {
					height: 60,
					position: 'absolute',
					bottom: 20,
					borderRadius: 200,
					backgroundColor: '#fff',
					left: '5%',
					right: '5%',
					width: '90%',
					shadowOpacity: 0,
					borderTopWidth: 0,
					zIndex: isHiddenNavigationBar ? -1 : 1,
				},
				tabBarActiveTintColor: '#1C2833',
				headerShown: false,
				tabBarShowLabel: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? 'home' : 'home-outline'}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="teacher_home_screen"
				options={{
					title: 'Home',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? 'people' : 'people-outline'}
							color={color}
						/>
					),
					tabBarButton: (props) => {
						if (user.type === 'student') {
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
					title: 'Home',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? 'school' : 'school-outline'}
							color={color}
						/>
					),
					tabBarButton: (props) => {
						if (user.type === 'teacher') {
							return null;
						} else {
							return <TouchableOpacity {...props} />;
						}
					},
				}}
			/>
		</Tabs>
	);
}

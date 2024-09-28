import { Tabs } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useUserProvider } from '@/contexts/UserProvider';
import { Animated, TouchableOpacity } from 'react-native';
import { useAppProvider } from '@/contexts/AppProvider';

export default function TabLayout() {
	const { user } = useUserProvider();
	const { moveValue, setMoveValue, moveAnim } = useAppProvider();

	useEffect(() => {
		console.log(user);
	}, [user]);

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
					transform: [{ translateY: moveAnim }],
				},
				tabBarActiveTintColor: '#1C2833',
				headerShown: false,
				tabBarShowLabel: false,
			}}
		>
			{/* Common Tabs (hiển thị cho mọi loại người dùng) */}
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
				name="explore"
				options={{
					title: 'Explore',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? 'code-slash' : 'code-slash-outline'}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="other"
				options={{
					title: 'Other',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={
								focused
									? 'add-circle-sharp'
									: 'add-circle-outline'
							}
							color={color}
						/>
					),
				}}
			/>

			{/* Library Tab (chỉ hiển thị cho giáo viên) */}
			<Tabs.Screen
				name="library"
				options={{
					title: 'Library',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? 'library' : 'library-outline'}
							color={color}
						/>
					),
					// Ẩn tab nếu người dùng là học sinh
					tabBarButton: (props) =>
						user?.user_type === 'teacher' ? (
							<TouchableOpacity {...props} />
						) : null,
				}}
			/>

			{/* Student Tab (chỉ hiển thị cho học sinh) */}
			<Tabs.Screen
				name="student"
				options={{
					title: 'Student',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon
							name={focused ? 'school' : 'school-outline'}
							color={color}
						/>
					),
					// Ẩn tab nếu người dùng là giáo viên
					tabBarButton: (props) =>
						user?.user_type === 'student' ? (
							<TouchableOpacity {...props} />
						) : null,
				}}
			/>
		</Tabs>
	);
}

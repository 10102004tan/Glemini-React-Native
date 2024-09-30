import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserProvider } from '@/contexts/UserProvider';

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const { user } = useUserProvider();

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
					width: '90%', // Set a fixed width or percentage width
					shadowOpacity: 0, // Remove shadow on iOS
					borderTopWidth: 0, // Remove top border on TabBar
				},
				tabBarActiveTintColor: '#1C2833',
				headerShown: false,
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
		</Tabs>
	);
}

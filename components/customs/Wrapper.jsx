import { View, StatusBar, SafeAreaView } from 'react-native';
import React from 'react';
import { useAppProvider } from '@/contexts/AppProvider';

const Wrapper = ({ children }) => {
	const { theme } = useAppProvider();
	return (
		<SafeAreaView
			style={{ backgroundColor: theme.background }}
			className="mt-[40px] flex-1 relative"
		>
			<View className="flex-1">{children}</View>
			<StatusBar
				barStyle={
					theme.text === '#000' ? 'light-content' : 'dark-content'
				}
			/>
		</SafeAreaView>
	);
};

export default Wrapper;
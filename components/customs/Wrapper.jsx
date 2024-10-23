import { View, StatusBar, SafeAreaView } from 'react-native';
import React from 'react';
import { useAppProvider } from '@/contexts/AppProvider';

const Wrapper = ({ children, className }) => {
	const { theme } = useAppProvider();
	return (
		<SafeAreaView
			style={{ backgroundColor: theme.background }}
			className="flex-1 relative"
		>
			<View className={`flex-1 mt-[40px] ${className}`}>{children}</View>
			<StatusBar
				barStyle={
					theme.text === '#000' ? 'dark-content' : 'light-content'
				}
			/>
		</SafeAreaView>
	);
};

export default Wrapper;

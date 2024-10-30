import { View, StatusBar, SafeAreaView } from 'react-native';
import React from 'react';
import { useAppProvider } from '@/contexts/AppProvider';

const Wrapper = ({ children, className, statusTheme = 'dark-content' }) => {
	const { theme } = useAppProvider();
	return (
		<SafeAreaView
			style={{ backgroundColor: theme.background }}
			className="flex-1 relative"
		>
			<View className={`flex-1 ${className}`}>{children}</View>
			<StatusBar barStyle={statusTheme} />
		</SafeAreaView>
	);
};

export default Wrapper;

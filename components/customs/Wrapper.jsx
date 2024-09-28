import { View, StatusBar, SafeAreaView } from 'react-native';
import React from 'react';
import { useAppProvider } from '@/contexts/AppProvider';

const Wrapper = ({ children }) => {
	const { theme } = useAppProvider();
	return (
		<SafeAreaView className="p-4 pt-[40px] flex-1 items-center justify-center">
			<View className="">{children}</View>
			<StatusBar
				barStyle={
					theme.text === 'white' ? 'light-content' : 'dark-content'
				}
			/>
		</SafeAreaView>
	);
};

export default Wrapper;

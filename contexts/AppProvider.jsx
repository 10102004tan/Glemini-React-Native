import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

const AppContext = createContext();

// Example about a context provider in React Native
const AppProvider = ({ children }) => {
	const [theme, setTheme] = useState({
		// text: useColorScheme() === 'dark' ? '#fff' : '#000',
		// background: useColorScheme() === 'dark' ? '#000' : '#fff',
		text: '#000',
		background: '#fff',
	});

	return (
		<AppContext.Provider value={{ theme, setTheme }}>
			{children}
		</AppContext.Provider>
	);
};

export default AppProvider;

export const useAppProvider = () => {
	return useContext(AppContext);
};

import React, { createContext, useContext, useRef, useState } from 'react';
const AppContext = createContext();

// Example about a context provider in React Native
const AppProvider = ({ children }) => {
	const [theme, setTheme] = useState({
		// text: useColorScheme() === 'dark' ? '#fff' : '#000',
		// background: useColorScheme() === 'dark' ? '#000' : '#fff',
		text: '#000',
		background: '#fff',
	});

	const [isShowBottomSheet, setIsShowBottomSheet] = useState(false);

	return (
		<AppContext.Provider
			value={{
				theme,
				setTheme,
				isShowBottomSheet,
				setIsShowBottomSheet,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppProvider;

export const useAppProvider = () => {
	return useContext(AppContext);
};

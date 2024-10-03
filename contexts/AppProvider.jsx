import React, { createContext, useContext, useRef, useState } from 'react';
import { I18n } from 'i18n-js';
import en from '../languages/en.json';
import ja from '../languages/ja.json';
import vi from '../languages/vi.json';
const AppContext = createContext();

// Example about a context provider in React Native
const AppProvider = ({ children }) => {
	const [language, setLanguage] = useState('vi');
	const i18n = new I18n({
		en,
		ja,
		vi
	  });
	i18n.locale = language;
	const [theme, setTheme] = useState({
		// text: useColorScheme() === 'dark' ? '#fff' : '#000',
		// background: useColorScheme() === 'dark' ? '#000' : '#fff',
		text: '#000',
		background: '#fff',
	});

	const [isHiddenNavigationBar, setIsHiddenNavigationBar] = useState(false);

	return (
		<AppContext.Provider
			value={{
				theme,
				setTheme,
				isHiddenNavigationBar,
				setIsHiddenNavigationBar,
				language,
				i18n,
				setLanguage,
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

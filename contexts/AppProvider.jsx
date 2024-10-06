import React, { createContext, useContext, useRef, useState } from 'react';
import { I18n } from 'i18n-js';
import en from '../languages/en.json';
import ja from '../languages/ja.json';
import vi from '../languages/vi.json';
const AppContext = createContext();

// Example about a context provider in React Native
const AppProvider = ({ children }) => {
	// Dùng cho việc chuyển đổi ngôn ngữ
	const [language, setLanguage] = useState('vi');
	const i18n = new I18n({
		en,
		ja,
		vi,
	});
	i18n.locale = language;
	// Dùng cho việc chuyển đổi chủ đề
	const [theme, setTheme] = useState({
		text: '#000',
		background: '#fff',
	});
	// Dùng cho việc ẩn hiện thanh điều hướng
	const [isHiddenNavigationBar, setIsHiddenNavigationBar] = useState(false);
	// Dùng cho việc cập nhật tiêu đề trang
	const [titleCurrent, setTitleCurrent] = useState('');

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
				titleCurrent,
				setTitleCurrent,
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

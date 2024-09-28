import React, { createContext, useContext, useRef, useState } from 'react';
import { Animated, useColorScheme } from 'react-native';

const AppContext = createContext();

// Example about a context provider in React Native
const AppProvider = ({ children }) => {
	const [theme, setTheme] = useState({
		// text: useColorScheme() === 'dark' ? '#fff' : '#000',
		// background: useColorScheme() === 'dark' ? '#000' : '#fff',
		text: '#000',
		background: '#fff',
	});

	const [moveValue, setMoveValue] = useState(300);
	const moveAnim = useRef(new Animated.Value(0)).current;
	const startAnimation = () => {
		if (moveValue === 300) {
			setMoveValue(0);
		} else {
			setMoveValue(300);
		}

		Animated.timing(moveAnim, {
			toValue: moveValue,
			duration: 1000,
			useNativeDriver: true,
		}).start();
	};

	return (
		<AppContext.Provider
			value={{
				theme,
				setTheme,
				moveValue,
				setMoveValue,
				startAnimation,
				moveAnim,
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

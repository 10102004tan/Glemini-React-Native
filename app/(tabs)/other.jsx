import { View, Text } from 'react-native';
import React from 'react';
import Wrapper from '../../components/customs/Wrapper';
import { useAppProvider } from '../../contexts/AppProvider';
const other = () => {
	const { theme } = useAppProvider();
	return (
		<Wrapper>
			<Text className={`text-${theme.text} text-lg font-pregular`}>
				Something other here
			</Text>
		</Wrapper>
	);
};

export default other;

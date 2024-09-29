import { View, Text, Button } from 'react-native';
import React from 'react';
import Wrapper from '../../components/customs/Wrapper';
import { useAppProvider } from '../../contexts/AppProvider';
import { useRouter } from 'expo-router';
const other = () => {
	const router = useRouter()
	const { theme } = useAppProvider();
	return (
		<Wrapper>
			<Button onPress={() => {router.push('/play/single');}} title='Click Quiz'/>
		</Wrapper>
	);
};

export default other;

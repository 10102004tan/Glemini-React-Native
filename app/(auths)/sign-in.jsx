import { View, Text, TextInput, Button, Pressable, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import CustomInput from '../../components/customs/CustomInput';

import { Link } from 'expo-router';
import { AuthContext } from '@/contexts/AuthContext';
import { validateEmail, validatePassword } from '@/utils';
import { useAppProvider } from '@/contexts/AppProvider';

const SignInScreen = () => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const {signIn} = useContext(AuthContext);
	const {i18n} = useAppProvider();
	
	const handlerSignIn = async() => {
		if (!email || !password) {
			Alert.alert('Thông báo','Vui lòng nhập đầy đủ thông tin');
			return;
		}

		if(!validateEmail(email)){
            Alert.alert('Thông báo', 'Email không hợp lệ');
            return;
        };

		signIn({email,password}).then((res)=>{
			Alert.alert('Thông báo',res);
		});
	};

	return (
		<View>
			<Text className="mt-[30px] text-[16px]">{i18n.t('signIn.welcome')}</Text>
			<Text className="mt-3 text-[25px]">{i18n.t('signIn.startNow')}</Text>
			<View className="mt-[30px]">
				<CustomInput label={i18n.t('signIn.email')} value={email} onChangeText={setEmail} />
				<CustomInput secure={true} onChangeText={setPassword} label={i18n.t('signIn.password')} value={password} />
				<View className="flex flex-row mb-3">
					<Text className='mr-2'>{i18n.t('signIn.notHaveAccount')}</Text>
					<Link href={"/(sign-up)"}>
						<Text className="text-blue-500">{i18n.t('signIn.signUp')}</Text>
					</Link>
				</View>
				<Pressable onPress={handlerSignIn}>
					<View className=' bg-black py-3 rounded'>
						<Text className="text-white text-center text-[16px]">{i18n.t('signIn.login')}</Text>
					</View>
				</Pressable>
			</View>
		</View>
	);
};

export default SignInScreen;

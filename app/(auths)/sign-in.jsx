import { View, Text, TextInput, Button, Pressable, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import CustomInput from '../../components/customs/CustomInput';

import { Link } from 'expo-router';
import { AuthContext } from '@/contexts/AuthContext';
import { validateEmail, validatePassword } from '@/utils';
import { useAppProvider } from '@/contexts/AppProvider';
import Toast from 'react-native-toast-message';
import CustomButton from "@/components/customs/CustomButton";

const TIME_SHOW_TOAST = 1000;
const SignInScreen = () => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const {signIn} = useContext(AuthContext);
	const {i18n} = useAppProvider();
	const [disable, setDisable] = useState(false);

	const handlerValidate = () => {
		if (!email || !password) {
			Toast.show({
				type: 'error',
				text1: 'Thông báo',
				text2: 'Vui lòng nhập đầy đủ thông tin',
				visibilityTime: TIME_SHOW_TOAST,
			});
			return false;
		}
		if (!email) {
			Toast.show({
				type: 'error',
				text1: i18n.t('error.title'),
				text2: i18n.t('error.emailRequired'),
				visibilityTime: TIME_SHOW_TOAST,
				autoHide: true,
			});
			return;
		}
		if(!validateEmail(email)){
			Toast.show({
				type: 'error',
				text2: i18n.t('error.emailInvalid'),
				visibilityTime: TIME_SHOW_TOAST,
				autoHide: true,
			});
			return false;
		}
		if (!password) {
			Toast.show({
				type: 'error',
				text2: i18n.t('error.passwordRequired'),
				visibilityTime: TIME_SHOW_TOAST,
				autoHide: true,
			});
			return false;
		}
		if (!validatePassword(password)) {
			Toast.show({
				type: 'error',
				text1: i18n.t('error.title'),
				text2: i18n.t('error.passwordInvalid'),
				visibilityTime: TIME_SHOW_TOAST,
				autoHide: true,
			});
			return false;
		}

		return true;
	};

	const handlerSignIn = async() => {
		setDisable(true);
		await signIn({email,password}).then((res)=>{
			setDisable(false);
		}).catch((err)=>{
			Toast.show({
				type: 'error',
				text1: i18n.t('error.title'),
				text2: err.message,
				visibilityTime: TIME_SHOW_TOAST,
				autoHide: true,
			});
			setDisable(false);
		});
	};

	return (
		<View>
			<Text className="mt-[30px] text-[16px]">{i18n.t('signIn.welcome')}</Text>
			<Text className="mt-3 text-[25px]">{i18n.t('signIn.startNow')}</Text>
			<View className="mt-[30px]">
				<CustomInput label={i18n.t('signIn.email')} value={email.trim()} onChangeText={setEmail} />
				<CustomInput secure={true} onChangeText={setPassword} label={i18n.t('signIn.password')} value={password.trim()} />
				<View className="flex flex-row mb-3">
					<Text className='mr-2'>{i18n.t('signIn.notHaveAccount')}</Text>
					<Link href={"/(sign-up)"}>
						<Text className="text-blue-500">{i18n.t('signIn.signUp')}</Text>
					</Link>
				</View>

				<CustomButton disabled={disable} onPress={()=>{
					handlerValidate() && handlerSignIn(); // call
				}} title={i18n.t('signIn.login')} />

				<View className="mt-3">
					<Link href={"/forgot-password"}>
						<Text>{i18n.t('signIn.forgetPassword')}</Text>
					</Link>
				</View>
			</View>
		</View>
	);
};

export default SignInScreen;

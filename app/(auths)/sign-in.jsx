import { View, Text, TextInput, Button, Pressable, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import CustomInput from '../../components/customs/CustomInput';

import { Link } from 'expo-router';
import { AuthContext } from '@/contexts/AuthContext';

const SignInScreen = () => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const {signIn} = useContext(AuthContext);
	
	const handlerSignIn = async() => {
		if (!email || !password) {
			Alert.alert('Thông báo','Vui lòng nhập đầy đủ thông tin');
			return;
		}
		signIn({email,password}).then((res)=>{
			Alert.alert('Thông báo',res);
		});
	};

	return (
		<View>
			<Text className="mt-[30px] text-[16px]">Chào mừng bạn quay trở lại</Text>
			<Text className="mt-3 text-[25px]">Bắt đầu nào</Text>
			<View className="mt-[30px]">
				<CustomInput label="Email" value={email} onChangeText={setEmail} />
				<CustomInput secure={true} onChangeText={setPassword} label="Password" value={password} />
				<View className="flex flex-row mb-3">
					<Text className='mr-2'>Chưa có tài khoản ?</Text>
					<Link href={"/(sign-up)"}>
						<Text className="text-blue-500">Đăng ký ngay</Text>
					</Link>
				</View>
				<Pressable onPress={handlerSignIn}>
					<View className=' bg-black py-3 rounded'>
						<Text className="text-white text-center text-[16px]">Đăng nhập</Text>
					</View>
				</Pressable>
			</View>
		</View>
	);
};

export default SignInScreen;

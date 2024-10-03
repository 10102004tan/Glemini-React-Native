'use strict';
import { Slot } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { API_URL, END_POINTS, API_VERSION } from '../configs/api.config';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [userData, setUserData] = useState(null);
	const [teacherStatus, setTeacherStatus] = useState(null);	

	useEffect(() => {
		const fetchAccessToken = async () => {
			const value = await AsyncStorage.getItem('userData');
			setUserData(JSON.parse(value));
			setIsLoading(false);
		};

		fetchAccessToken();
	}, []);
	const signIn = async ({ email, password }) => {
		const response = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.LOGIN}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json();

		if (data.statusCode === 200) {
			const {
				tokens: { accessToken, refreshToken },
				user: {
					user_type,
					user_fullname,
					_id,
					user_avatar,
					user_email,
				},
			} = data.metadata;
			const dataStore = {
				user_type,
				user_fullname,
				_id,
				user_avatar,
				accessToken,
				refreshToken,
				user_email,
			};
			await AsyncStorage.setItem('userData', JSON.stringify(dataStore));
			setUserData(dataStore);
			return data.message;
		}

		return data.message;
	};
	const signUp = async ({ email, password, fullname, type, images }) => {

		let formData = new FormData();
		formData.append('email', email);
		formData.append('password', password);
		formData.append('fullname', fullname);
		formData.append('type', type);
		// if type = teacher => add image to form data
		if (type === 'teacher' && images.length > 0) {
			images.forEach((image, index) => {
				formData.append('images', {
					uri: image.uri,
					name: image.name,
					type: `${image.type}/${image.name.split('.')[1]}`,
				});
			});
		}

		const response = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.SIGN_UP}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			body: formData,
		});

		const data = await response.json();
		const {
			tokens: { accessToken, refreshToken },
			user: { user_type, user_fullname, _id, user_avatar, user_email ,teacher_status},
		} = data.metadata;
		if (data.statusCode === 200) {
			const dataStore = {
				user_type,
				user_fullname,
				_id,
				user_avatar,
				accessToken,
				refreshToken,
				user_email,
			};
			await AsyncStorage.setItem('userData', JSON.stringify(dataStore));
			setUserData(dataStore);
			// set teacher status
			teacher_status && setTeacherStatus(teacher_status);
			return 1;
		}

		return 0;
	};

	const signOut = async () => {
		const response = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.LOGOUT}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				authorization: `${userData.accessToken}`,
				'x-client-id': userData._id,
			},
		});
		const data = await response.json();
		if (data.statusCode === 200) {
			await AsyncStorage.removeItem('userData');
			setUserData(null);
		} else {
			if (data.message === 'expired') {
				await processAccessTokenExpired();
			}
			else {
				await AsyncStorage.removeItem('userData');
				setUserData(null);
			}
		}
	};

	const changePassword = async ({ oldPassword, newPassword }) => {
		if (!userData) return;
		const { accessToken, _id: user_id } = userData;
		const response = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.CHANGE_PASSWORD}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				authorization: `${accessToken}`,
				'x-client-id': user_id,
			},
			body: JSON.stringify({ oldPassword, newPassword }),
		});

		const data = await response.json();

		// if old password is incorrect
		if (data.statusCode === 400) {
			Alert.alert('Change password', data.message);
		}

		// if access token expired
		if (data.statusCode === 401) {
			processAccessTokenExpired();
			changePassword({ oldPassword, newPassword });
		}

		if (data.statusCode === 200) {
			if (data.statusCode === 200) {
				// update refresh token and access token
				const {
					tokens: { accessToken, refreshToken },
				} = data.metadata;
				const dataStore = { ...userData, accessToken, refreshToken };
				await AsyncStorage.setItem(
					'userData',
					JSON.stringify(dataStore)
				);
				setUserData(dataStore);
				Alert.alert('Change password', 'Change password successfully');
			}
		}
	};

	/**
	 * @description : Xu ly khi access token het han, su dung refresh token de lay access token moi
	 */
	const processAccessTokenExpired = async () => {
		const response = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.REFRESH_TOKEN}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-refresh-token': `${userData.refreshToken}`,
				'x-client-id': userData._id,
			},
		});

		const data = await response.json();
		if (data.statusCode === 200) {
			const {
				tokens: { accessToken, refreshToken },
			} = data.metadata;
			const dataStore = { ...userData, accessToken, refreshToken };
			await AsyncStorage.setItem('userData', JSON.stringify(dataStore));
			setUserData(dataStore);
		}

		if (data.message === 'expired') {
			await AsyncStorage.removeItem('userData');
			setUserData(null);
			Alert.alert('Session expired', 'Please login again');
		}
	};

	/**
	 * @description: Get status of user
	 * 
	 */

	// fetch get status when start app
	const fetchStatus = async () => {
			const response = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.USER_STATUS}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					authorization: `${userData.accessToken}`,
					'x-client-id': userData._id,
				},
			});
			const data = await response.json();
			const {statusCode,metadata:{user_status,teacher_status}} = data;
			if (statusCode !== 200) return;
			if (user_status !== "active"){
				Alert.alert('Account status', 'Your account is inactive, please contact admin', [
					{
						text: 'Thoát',
						onPress: async () => {
							await signOut();
						},
					}
				]);
				
			}
			// set teacher status
			teacher_status && setTeacherStatus(teacher_status);

	};


	return (
		<AuthContext.Provider
			value={{
				signIn,
				signUp,
				signOut,
				isLoading,
				setUserData,
				userData,
				changePassword,
				processAccessTokenExpired,
				fetchStatus,
				teacherStatus
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => {
	return useContext(AuthContext);
};

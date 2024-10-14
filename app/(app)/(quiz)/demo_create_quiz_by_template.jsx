import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { useAuthContext } from '@/contexts/AuthContext';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useQuestionProvider } from '@/contexts/QuestionProvider';
import Button from '@/components/customs/Button';
import LottieView from 'lottie-react-native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const DemoCreateQuizByTemplate = () => {
	const { id } = useGlobalSearchParams();
	const [uploadStatus, setUploadStatus] = useState(null);
	const { userData } = useAuthContext();
	const { getQuestionFromDocx } = useQuestionProvider();
	const router = useRouter();

	const pickDocument = async () => {
		let result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
		if (!result.canceled && result.assets && result.assets.length > 0) {
			const { uri, mimeType, name } = result.assets[0];

			// Kiểm tra kiểu file dựa trên mimeType hoặc phần mở rộng của tên file
			const allowedMimeTypes = [
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
				'application/msword', // .doc
				'text/markdown',
			]; // .md
			const allowedExtensions = ['.doc', '.docx', '.md'];

			// Kiểm tra mimeType hoặc phần mở rộng tên file
			const isAllowedMimeType = allowedMimeTypes.includes(mimeType);
			const isAllowedExtension = allowedExtensions.some((ext) =>
				name.toLowerCase().endsWith(ext)
			);

			if (isAllowedMimeType || isAllowedExtension) {
				uploadFile(uri, mimeType);
			} else {
				setUploadStatus(
					'Chỉ chấp nhận các file Word (.doc, .docx) hoặc Markdown (.md).'
				);
			}
		} else {
			setUploadStatus('File pick failed.');
		}
	};

	const uploadFile = async (fileUri, mimeType) => {
		const formData = new FormData();
		formData.append('file', {
			uri: fileUri,
			name: 'template_doc.docx',
			type: mimeType,
		});

		try {
			const response = await fetch(
				`${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_UPLOAD_DOC}`,
				{
					method: 'POST',
					body: formData, // Directly pass the formData object
					headers: {
						'x-client-id': userData._id,
						Authorization: userData.accessToken,
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			const data = await response.json();
			setUploadStatus(data.message);

			if (data.statusCode === 200) {
				// console.log(JSON.stringify(data, null, 2));
				getQuestionFromDocx(data.metadata, id);
				router.replace({
					pathname: '/(app)/(quiz)/overview',
					params: { id: id },
				});
			}
		} catch (error) {
			setUploadStatus('File upload failed.');
			// console.error('Upload Error:', error);
		}
	};

	// Test API
	useEffect(() => {
		const test = async () => {
			const subjects = [
				'670241a2b71c3303d716e004',
				'670241a2b71c3303d716e003',
			];
			const response = await fetch(
				`${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_FILTER}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'x-client-id': userData._id,
						Authorization: userData.accessToken,
					},
					body: JSON.stringify({
						user_id: userData._id,
						quiz_subjects: subjects,
						/**
						 * các tham số còn lại tương tự
						 * quiz_name: 'Tên bộ câu hỏi',
						 * quiz_description: 'Mô tả bộ câu hỏi',
						 * quiz_status: 'published' | 'unpublished',
						 * quiz_subjects: ['id_subject1', 'id_subject2'],
						 * start_filter_date: '2022-01-01',
						 * end_filter_date: '2022-12-31',
						 * */
					}),
				}
			);

			const data = await response.json();
			console.log(data);
		};
		if (userData) {
			test();
		}
	}, [userData]);

	async function download() {
		const filename = 'dummy.pdf';
		const result = await FileSystem.downloadAsync(
			'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
			FileSystem.documentDirectory + filename
		);

		// Log the download result
		console.log(result);

		// Save the downloaded file
		saveFile(result.uri, filename, result.headers['Content-Type']);
	}

	async function saveFile(uri, filename, mimetype) {
		if (Platform.OS === 'android') {
			const permissions =
				await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

			if (permissions.granted) {
				const base64 = await FileSystem.readAsStringAsync(uri, {
					encoding: FileSystem.EncodingType.Base64,
				});

				await FileSystem.StorageAccessFramework.createFileAsync(
					permissions.directoryUri,
					filename,
					mimetype
				)
					.then(async (uri) => {
						await FileSystem.writeAsStringAsync(uri, base64, {
							encoding: FileSystem.EncodingType.Base64,
						});
					})
					.catch((e) => console.log(e));
			} else {
				shareAsync(uri);
			}
		} else {
			shareAsync(uri);
		}
	}

	return (
		<View className="flex items-center justify-center flex-1">
			<View
				className="p-4 w-[90%] flex items-center justify-center rounded-2xl"
				style={{
					borderWidth: 2,
					borderStyle: 'dashed',
					borderColor: '#757575',
				}}
			>
				<LottieView
					source={require('@/assets/jsons/not-found.json')}
					autoPlay
					loop
					style={{
						width: 200,
						height: 200,
					}}
				/>
				<TouchableOpacity onPress={pickDocument}>
					<Text>Tải lên file chứa bộ câu hỏi của bạn</Text>
				</TouchableOpacity>
			</View>
			<View className="mt-4">
				<Text className="text-center">Tải file mẫu tại đây</Text>
				<View className="flex items-center justify-center mt-2 flex-row">
					<Button
						otherStyles="p-3"
						text="File doc, docx"
						icon={
							<SimpleLineIcons
								name="docs"
								size={18}
								color="white"
							/>
						}
					/>
					<Button
						onPress={download}
						otherStyles="ml-2 p-3"
						text="File markdown"
						icon={
							<AntDesign
								name="file-markdown"
								size={18}
								color="white"
							/>
						}
					/>
				</View>
			</View>
		</View>
	);
};

export default DemoCreateQuizByTemplate;

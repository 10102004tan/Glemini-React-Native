import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
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
import * as MediaLibrary from 'expo-media-library';
import * as IntentLauncher from 'expo-intent-launcher';
import { Platform, Linking } from 'react-native';
import { shareAsync } from 'expo-sharing';

const DemoCreateQuizByTemplate = () => {
	const { id } = useGlobalSearchParams();
	const [uploadStatus, setUploadStatus] = useState(null);
	const { userData, processAccessTokenExpired } = useAuthContext();
	const { getQuestionFromDocx } = useQuestionProvider();
	const router = useRouter();

	const openFile = async (uri) => {
		if (Platform.OS === 'android') {
			const cUri = await FileSystem.getContentUriAsync(uri);
			IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
				data: cUri,
				flags: 1,
				type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // MIME type for .docx
			}).catch((error) => {
				Alert.alert(
					'Error',
					'No application found to open this file type. Please make sure you have a suitable app installed.'
				);
				// console.error('Error opening file:', error);
			});
		} else {
			Linking.openURL(uri).catch((error) => {
				Alert.alert(
					'Error',
					'Failed to open the file. Please make sure you have a suitable app installed.'
				);
				// console.error('Error opening file:', error);
			});
		}
	};

	const pickDocument = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: '*/*',
			});
			// console.log(JSON.stringify(result, null, 2));
			if (!result.canceled && result.assets && result.assets.length > 0) {
				const { mimeType, name, size } = result.assets[0];

				// File size validation (e.g., max 5MB)
				const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
				if (size > MAX_FILE_SIZE) {
					setUploadStatus('File size exceeds the 5MB limit.');
					return;
				}

				// Allowed file types
				const allowedMimeTypes = [
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
					'application/msword', // .doc
					'text/markdown', // .md
				];

				const allowedExtensions = ['.doc', '.docx', '.md'];

				// Check mimeType or file extension
				const isAllowedMimeType = allowedMimeTypes.includes(mimeType);
				const isAllowedExtension = allowedExtensions.some((ext) =>
					name.toLowerCase().endsWith(ext)
				);

				if (isAllowedMimeType || isAllowedExtension) {
					uploadFile(result.assets[0]);
				} else {
					setUploadStatus(
						'Only Word (.doc, .docx) or Markdown (.md) files are accepted.'
					);
				}
			} else {
				setUploadStatus('File selection failed.');
			}
		} catch (error) {
			await processAccessTokenExpired();
			setUploadStatus('An error occurred while selecting the file.');
			console.error('Document Picker Error:', error);
		}
	};

	const uploadFile = async (file) => {
		try {
			console.log(JSON.stringify(file, null, 2));
			let path = `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_UPLOAD_DOC}`;

			if (file.mimeType === 'text/markdown') {
				path = `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_UPLOAD_MD}`;
			}

			const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
			const formData = new FormData();
			formData.append('file', {
				uri: file.uri,
				name: cleanFileName,
				type: file.mimeType,
			});

			// Show progress feedback
			// setUploadStatus('Uploading file...');

			const response = await fetch(path, {
				method: 'POST',
				body: formData,
				headers: {
					'x-client-id': userData._id,
					Authorization: userData.accessToken,
					'Content-Type': 'multipart/form-data',
				},
			});

			const data = await response.json();
			// console.log(JSON.stringify(data, null, 2));

			if (data.statusCode === 200) {
				setUploadStatus(data.message);
				getQuestionFromDocx(data.metadata, id);
				router.replace({
					pathname: '/(app)/(quiz)/overview',
					params: { id: id },
				});
			} else {
				throw new Error(data.message || 'File upload failed.');
			}
		} catch (error) {
			console.log(error);
			setUploadStatus('File upload failed.');
			alert('An error occurred while uploading the file.');
			// console.error('Upload Error:', error);
		}
	};

	// Hàm để xóa file
	const deleteFile = async (fileUri) => {
		try {
			// Xóa file
			await FileSystem.deleteAsync(fileUri, { idempotent: true });
			Alert.alert('Success', 'File deleted successfully!');
		} catch (error) {
			console.error('Error deleting file:', error);
			Alert.alert('Error', 'Failed to delete file');
		}
	};

	const clearTemplatedDownload = async () => {
		await deleteFile(`${FileSystem.documentDirectory}template_md.md`);
		await deleteFile(`${FileSystem.documentDirectory}template_doc.docx`);
	};

	const downloadAndOpenFile = async (type) => {
		const fileUrl =
			type === 'docx'
				? `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_GET_DOCX_TEMPLATE}`
				: `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_GET_MD_TEMPLATE}`;
		const fileName =
			type === 'docx' ? 'template_doc.docx' : 'template_md.md';
		const fileUri = `${FileSystem.documentDirectory}${fileName}`;

		try {
			// Kiểm tra xem file đã tồn tại chưa
			const fileInfo = await FileSystem.getInfoAsync(fileUri);
			if (fileInfo.exists) {
				// Nếu file đã tồn tại, mở file
				console.log('File already exists, opening file:', fileUri);
				openFile(fileUri);
				return;
			}

			// Nếu file chưa tồn tại, yêu cầu quyền truy cập Media Library
			const { status } = await MediaLibrary.requestPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert('Permission Denied', 'Cannot access Media Library');
				return;
			}

			// Tải file về bộ nhớ tạm của ứng dụng
			const downloadResult = await FileSystem.downloadAsync(
				fileUrl,
				fileUri
			);

			if (!downloadResult || !downloadResult.uri) {
				throw new Error('Failed to download file');
			}
			console.log('File downloaded to:', downloadResult.uri);
			const save = await shareAsync(downloadResult.uri);

			if (save) {
				// Mở file sau khi tải xong
				openFile(downloadResult.uri);
			}

			Alert.alert('Success', 'File downloaded and opened successfully');
		} catch (error) {
			console.error('Error:', error);
			Alert.alert(
				'Error',
				`Failed to download or open file: ${error.message}`
			);
		}
	};

	return (
		<ScrollView className="px-4">
			{/* {uploadStatus && <Text>{uploadStatus}</Text>} */}
			<View className="flex items-center justify-center flex-1">
				<View
					className="w-full p-4 flex items-center justify-center rounded-2xl"
					style={{
						borderWidth: 2,
						borderStyle: 'dashed',
						borderColor: '#757575',
					}}
				>
					<LottieView
						source={require('@/assets/jsons/clound-upload.json')}
						autoPlay
						loop
						style={{
							width: 200,
							height: 120,
						}}
					/>
					<TouchableOpacity onPress={pickDocument}>
						<Text className="font-semibold">
							Ấn vào đây để tải lên file câu hỏi của bạn
						</Text>
					</TouchableOpacity>
				</View>
				<View className="mt-4">
					<Text className="text-center font-semibold">
						Bước 1: Tải file mẫu tại đây
					</Text>
					<View className="flex items-center justify-center mt-2 flex-row">
						<Button
							onPress={() => {
								downloadAndOpenFile('docx');
							}}
							otherStyles="p-3"
							text="Tải File mẫu (docx)"
							icon={
								<SimpleLineIcons
									name="docs"
									size={18}
									color="white"
								/>
							}
						/>
						<Button
							onPress={() => {
								downloadAndOpenFile('md');
							}}
							otherStyles="p-3 ml-2"
							text="Tải File mẫu (md)"
							icon={
								<AntDesign
									name="file-markdown"
									size={18}
									color="white"
								/>
							}
						/>
					</View>
					<Text className="text-center font-semibold mt-4">
						Bước 2: Đọc các hướng dẫn tại đây
					</Text>
					{/* Docx */}
					<View>
						<Text className="text-start font-semibold mt-2 px-4">
							1. Đối với file định dạng docx:
						</Text>
						<View className="ml-4 px-4">
							<Text className="text-start mt-2">
								- File mẫu docx sẽ cung cấp cho bạn một vài mẫu
								câu hỏi đã được tạo theo đúng định dạng.
							</Text>
							<Text className="text-start mt-2">
								- Lưu ý chỉ copy và paste các câu hỏi vào file
								mẫu, không sửa đổi cấu trúc của file.
							</Text>
						</View>
						<Text className="text-start font-semibold mt-2 px-4">
							File mẫu sẽ có dạng như sau:
						</Text>
						<View
							className="mt-2 p-4 rounded-xl"
							style={{
								borderWidth: 2,
								borderStyle: 'dashed',
								borderColor: '#757575',
							}}
						>
							<Text>
								<Text className="font-semibold">Title</Text>:
								Đây sẽ là tiêu đề của bộ câu hỏi
							</Text>
							<View className="mt-2">
								<Text>
									<Text className="font-semibold">
										Question:
									</Text>{' '}
									Các câu hỏi sẽ bắt đầu bằng “Question:” sau
									đó đến nội dung của câu hỏi 1
								</Text>
								<Text>A. Đáp án thứ 1</Text>
								<Text>B. Đáp án thứ 2</Text>
								<Text>C. Đáp án thứ 3</Text>
								<Text>D. Đáp án thứ 4</Text>
								<Text className="font-semibold">
									Correct Answer: D
								</Text>
							</View>

							<View className="mt-2">
								<Text>
									<Text className="font-semibold">
										Question:
									</Text>{' '}
									Các câu hỏi sẽ bắt đầu bằng “Question:” sau
									đó đến nội dung của câu hỏi 2
								</Text>
								<Text>A. Đáp án thứ 1</Text>
								<Text>B. Đáp án thứ 2</Text>
								<Text>C. Đáp án thứ 3</Text>
								<Text>D. Đáp án thứ 4</Text>
								<Text className="font-semibold">
									Correct Answer: D
								</Text>
							</View>
						</View>
					</View>
					{/* Markdown */}
					<View>
						<Text className="text-start font-semibold mt-2 px-4">
							2. Đối với file định dạng md:
						</Text>
						<View className="ml-4 px-4"></View>
						<Text className="text-start font-semibold mt-2 px-4">
							File mẫu sẽ có dạng như sau:
						</Text>
						<View
							className="mt-2 p-4 rounded-xl"
							style={{
								borderWidth: 2,
								borderStyle: 'dashed',
								borderColor: '#757575',
							}}
						>
							<Text>
								<Text className="font-semibold">
									# Quiz Title:
								</Text>
								: Đây sẽ là tiêu đề của bộ câu hỏi
							</Text>
							<View className="mt-2">
								<Text>
									<Text className="font-semibold">
										## Question:
									</Text>{' '}
									Các câu hỏi sẽ bắt đầu bằng "## Question:”
									sau đó đến nội dung của câu hỏi
								</Text>
								<Text>- A. Đáp án thứ 1</Text>
								<Text>- B. Đáp án thứ 2</Text>
								<Text>- C. Đáp án thứ 3</Text>
								<Text>- D. Đáp án thứ 4</Text>
								<Text className="font-semibold">
									**Correct Answer:** D
								</Text>
							</View>
						</View>
					</View>
					<Text className="text-start font-semibold mt-2 px-4">
						Sau khi đã tải file và chỉnh sửa các câu hỏi, bạn hãy
						tải file lên để tạo bài kiểm tra.
					</Text>

					<Button
						onPress={() => {
							clearTemplatedDownload();
						}}
						otherStyles="p-3 mt-4 mb-4"
						text="Xóa file mẫu đã tải"
						icon={
							<SimpleLineIcons
								name="trash"
								size={18}
								color="white"
							/>
						}
					/>
				</View>
			</View>
		</ScrollView>
	);
};

export default DemoCreateQuizByTemplate;

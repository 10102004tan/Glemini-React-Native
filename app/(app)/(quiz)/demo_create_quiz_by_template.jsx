import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { useAuthContext } from '@/contexts/AuthContext';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useQuestionProvider } from '@/contexts/QuestionProvider';

const DemoCreateQuizByTemplate = () => {
	const { id } = useGlobalSearchParams();
	const [uploadStatus, setUploadStatus] = useState(null);
	const { userData } = useAuthContext();
	const { getQuestionFromDocx } = useQuestionProvider();

	const router = useRouter();

	const pickDocument = async () => {
		let result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
		if (!result.canceled && result.assets && result.assets.length > 0) {
			const { uri, mimeType } = result.assets[0]; // Lấy uri, name, và mimeType từ assets
			uploadFile(uri, mimeType);
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

	return (
		<View
			style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
		>
			<Button title="Upload File" onPress={pickDocument} />
			{uploadStatus && <Text>{uploadStatus}</Text>}
		</View>
	);
};

export default DemoCreateQuizByTemplate;

import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { useAuthContext } from '@/contexts/AuthContext';

const DemoCreateQuizByTemplate = () => {
	const [uploadStatus, setUploadStatus] = useState(null);
	const { userData } = useAuthContext();

	const pickDocument = async () => {
		let result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
		if (!result.canceled && result.assets && result.assets.length > 0) {
			const { uri, name, mimeType } = result.assets[0]; // Lấy uri, name, và mimeType từ assets
			uploadFile(uri, name, mimeType);
		} else {
			setUploadStatus('File pick failed.');
		}
	};

	const uploadFile = async (fileUri, fileName, mimeType) => {
		const formData = new FormData();
		formData.append('docs_template', {
			uri: fileUri,
			name: fileName,
			type: mimeType,
		});

		console.log(formData);

		try {
			const response = await fetch( 
				`${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_UPLOAD_DOC}`,
				{
					method: 'POST',
					body: formData,
					headers: {
						'Content-Type': 'multipart/form-data',
						'x-client-id': userData._id,
						Authorization: userData.accessToken,
					},
				}
			);

			const data = await response.json();
			console.log(data);
			setUploadStatus(data.message);
		} catch (error) {
			setUploadStatus('File upload failed.');
			console.error('Upload Error:', error);
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

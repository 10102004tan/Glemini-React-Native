import React, { useEffect, useState } from 'react';
import { Text, ScrollView, View, Keyboard } from 'react-native';
import {
	actions,
	RichEditor,
	RichToolbar,
} from 'react-native-pell-rich-editor';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useQuestionProvider } from '@/contexts/QuestionProvider';
import { Status } from '@/constants';
import { useAuthContext } from '@/contexts/AuthContext';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';

const RichTextEditor = ({
	typingType = '',
	content = '',
	selectedAnswer = 0,
	focus = false,
}) => {
	const [editorValue, setEditorValue] = useState('');
	const { question, setQuestion, editAnswerContent } = useQuestionProvider();
	const { userData, processAccessTokenExpired } = useAuthContext();
	const richText = React.useRef();

	useEffect(() => {
		if (focus) {
			richText.current.focusContentEditor();
		} else {
			richText.current.blurContentEditor();
		}
	}, [focus]);

	// Tạo các customs icon cho toolbar của RichEditor
	const handleHead = ({ tintColor }) => (
		<FontAwesome5 name="heading" size={18} color={tintColor} />
	);

	const handleImage = ({ tintColor }) => {
		return <FontAwesome name="image" size={18} color={tintColor} />;
	};

	// Cập nhật nội dung của RichEditor
	useEffect(() => {
		if (richText) {
			richText.current.setContentHTML(content);
		}
	}, [content, richText]);

	useEffect(() => {
		// console.log(editorValue);
		// Xử lý các trường hợp khác nhau của RichTextEditor
		switch (typingType) {
			// Trương hợp dùng rich text editor tạo giải thích cho câu hỏi
			case Status.quiz.EXPLAINATION:
				setQuestion({ ...question, question_explanation: editorValue });
				break;
			// Trường hợp dùng rich text editor tạo nội dung câu hỏi
			case Status.quiz.QUESTION:
				setQuestion({ ...question, question_excerpt: editorValue });
				if (editorValue === '') {
					setQuestion({
						...question,
						question_excerpt: '<div>Nội dung câu hỏi</div>',
					});
				}
				break;
			// Trường hợp dùng rich text editor tạo nội dung câu trả lời
			case Status.quiz.ANSWER:
				editAnswerContent(selectedAnswer, editorValue);
				break;

			default:
				break;
		}
	}, [editorValue]);

	// Hàm tải ảnh lên server
	const uploadImage = async (file) => {
		try {
			const formData = new FormData();

			const cleanFileName = file.fileName.replace(/[^a-zA-Z0-9.]/g, '_');

			formData.append('file', {
				uri: imageUri,
				name: cleanFileName,
				type: file.mimeType,
			});

			const response = await fetch(
				`${API_URL}${API_VERSION.V1}${END_POINTS.QUESTION_UPLOAD_IMAGE}`,
				{
					method: 'POST',
					body: formData,
					headers: {
						'Content-Type': 'multipart/form-data',
						'x-client-id': userData._id,
						authorization: userData.accessToken,
					},
				}
			);

			const data = await response.json();
			console.log(data);
			return data.metadata.url; // URL của ảnh trên server
		} catch (error) {
			if (error.message === 'Network request failed') {
				alert('Lỗi mạng, vui lòng kiểm tra kết nối và thử lại');
				await processAccessTokenExpired();
			}
		}
	};

	// Hàm chọn ảnh từ thư viện
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled && result.assets.length > 0) {
			// const imageUri = result.assets[0].uri;
			// console.log(imageUri);

			// Tải ảnh lên server và lấy URL của ảnh
			const imageUrl = await uploadImage(result.assets[0]);

			// Chèn URL ảnh vào RichEditor
			richText.current.insertImage(imageUrl);
		}
	};

	return (
		<View className="flex-1 w-full p-4 ">
			<ScrollView className="">
				<RichEditor
					defaultParagraphSeparator=""
					initialContentHTML={content}
					placeholder="Nhập giải thích cho câu hỏi ở đây ..."
					style={{ width: '100%', height: 300 }}
					ref={richText}
					onChange={(descriptionText) => {
						setEditorValue(descriptionText);
					}}
				/>
			</ScrollView>

			<RichToolbar
				editor={richText}
				actions={[
					actions.heading1,
					actions.setBold,
					actions.setItalic,
					actions.setUnderline,
					actions.insertBulletsList,
					actions.insertOrderedList,
					actions.insertLink,
					typingType !== actions.insertImage,
				]}
				iconMap={{
					[actions.heading1]: handleHead,
					[actions.insertImage]: handleImage,
				}}
				onPressAddImage={pickImage}
			/>
		</View>
	);
};

export default RichTextEditor;

import React from 'react';
import { Text, ScrollView, View } from 'react-native';
import {
	actions,
	RichEditor,
	RichToolbar,
} from 'react-native-pell-rich-editor';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';

const handleHead = ({ tintColor }) => (
	<FontAwesome5 name="heading" size={18} color={tintColor} />
);

const handleImage = ({ tintColor }) => {
	return <FontAwesome name="image" size={18} color={tintColor} />;
};

const RichTextEditor = () => {
	const richText = React.useRef();

	const uploadImage = async (imageUri) => {
		console.log('Here');
		const formData = new FormData();
		formData.append('image', {
			uri: imageUri,
			name: 'photo.jpg',
			type: 'image/jpeg',
		});

		const response = await fetch('http://192.168.1.8:3000/upload', {
			method: 'POST',
			body: formData,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		const data = await response.json();
		return data.url; // URL của ảnh trên server
	};

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled && result.assets.length > 0) {
			const imageUri = result.assets[0].uri;
			console.log(imageUri);

			// Tải ảnh lên server và lấy URL của ảnh
			const imageUrl = await uploadImage(imageUri);

			// Chèn URL ảnh vào RichEditor
			richText.current.insertImage(imageUrl);
		}
	};

	return (
		<View className="w-full h-full p-4">
			<ScrollView className="max-h-[500px]">
				<RichEditor
					placeholder="Nhập giải thích cho câu hỏi ở đây ..."
					style={{ width: '100%', height: 300 }}
					ref={richText}
					onChange={(descriptionText) => {
						console.log('descriptionText:', descriptionText);
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
					actions.insertImage,
					actions.insertLink,
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

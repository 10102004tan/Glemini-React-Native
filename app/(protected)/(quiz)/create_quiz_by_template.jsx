import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { useAuthContext } from '@/contexts/AuthContext';
import api from '@/libs/axios';
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
import { useAppProvider } from '@/contexts/AppProvider';
import { useAuthStore } from '@/store/useAuthStore';
import * as SecureStore from 'expo-secure-store';

const DemoCreateQuizByTemplate = () => {
  const { id } = useGlobalSearchParams();
  const [uploadStatus, setUploadStatus] = useState(null);
  const { processAccessTokenExpired } = useAuthContext();
  const { user } = useAuthStore(); // Use useAuthStore instead of useAuthContext
  const { getQuestionFromTemplateFile } = useQuestionProvider();
  const router = useRouter();
  const { i18n } = useAppProvider();

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
          'No application found to open this file type. Please make sure you have a suitable app installed.',
        );
        // console.error('Error opening file:', error);
      });
    } else {
      Linking.openURL(uri).catch((error) => {
        Alert.alert(
          'Error',
          'Failed to open the file. Please make sure you have a suitable app installed.',
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
          'text/plain', // .txt
        ];

        const allowedExtensions = ['.doc', '.docx', '.md', '.txt'];

        // Check mimeType or file extension
        const isAllowedMimeType = allowedMimeTypes.includes(mimeType);
        const isAllowedExtension = allowedExtensions.some((ext) =>
          name.toLowerCase().endsWith(ext),
        );

        if (isAllowedMimeType || isAllowedExtension) {
          uploadFile(result.assets[0]);
        } else {
          setUploadStatus('Only Word (.doc, .docx, .txt) or Markdown (.md) files are accepted.');
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
      console.log('📤 Starting file upload...');

      // Get authentication data from SecureStore
      const token = await SecureStore.getItemAsync('Authorization');
      const userId = await SecureStore.getItemAsync('x-client-id');

      console.log('🔍 Auth info:', {
        user: user,
        user_id: userId,
        hasToken: !!token,
        tokenLength: token?.length || 0,
        userKeys: user ? Object.keys(user) : [],
      });

      // Setup authentication headers
      if (token && userId) {
        // Use lowercase headers as defined in backend HEADER constants
        api.defaults.headers.common['authorization'] = token;
        api.defaults.headers.common['x-client-id'] = userId;

        console.log('✅ Authentication headers set:', {
          userId: userId,
          tokenPrefix: token.substring(0, 20) + '...',
        });
      } else {
        console.error('❌ Missing authentication data');
        Alert.alert('Lỗi xác thực', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        await processAccessTokenExpired();
        return;
      }

      let endpoint = '';
      switch (file.mimeType) {
        case 'text/plain':
          endpoint = END_POINTS.QUIZ_UPLOAD_TXT;
          break;
        case 'application/msword':
          endpoint = END_POINTS.QUIZ_UPLOAD_DOC;
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          endpoint = END_POINTS.QUIZ_UPLOAD_DOC;
          break;
        case 'text/markdown':
          endpoint = END_POINTS.QUIZ_UPLOAD_MD;
          break;
        default:
          throw new Error('Unsupported file type');
      }

      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: cleanFileName,
        type: file.mimeType,
      });

      console.log('📡 Uploading to:', `${API_VERSION.V1}${endpoint}`);
      console.log('📄 File info:', {
        name: cleanFileName,
        type: file.mimeType,
        size: file.size,
      });

      const response = await api.post(`${API_VERSION.V1}${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;
      console.log('✅ Upload response:', JSON.stringify(data, null, 2));

      if (data.statusCode === 200) {
        setUploadStatus(data.message);
        console.log('🎉 Upload successful, processing questions...');
        getQuestionFromTemplateFile(data.metadata, id);
      } else {
        throw new Error(data.message || 'File upload failed.');
      }
    } catch (error) {
      console.error('❌ Upload error:', error);

      if (error.response?.status === 401) {
        console.error('🔐 Authentication error');
        Alert.alert('Lỗi xác thực', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        await processAccessTokenExpired();
      } else if (error.response?.status === 400) {
        console.error('📄 File format error');
        Alert.alert('Lỗi file', error.response.data?.message || 'File không đúng định dạng');
      } else {
        console.error('🚫 General upload error');
        Alert.alert(
          'Lỗi upload',
          `Không thể upload file: ${error.message || 'Lỗi không xác định'}`,
        );
      }

      setUploadStatus('File upload failed.');
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
    // Basic templates
    await deleteFile(`${FileSystem.documentDirectory}template_md.md`);
    await deleteFile(`${FileSystem.documentDirectory}template_doc.docx`);
    await deleteFile(`${FileSystem.documentDirectory}template_txt.txt`);

    // Complete templates
    await deleteFile(`${FileSystem.documentDirectory}complete_template.md`);
    await deleteFile(`${FileSystem.documentDirectory}complete_template.txt`);

    console.log('🗑️ Cleared all downloaded templates');
  };

  const downloadAndOpenFile = async (type) => {
    let fileUrl = '';
    let fileName = '';
    switch (type) {
      case 'docx':
        fileUrl = `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_GET_DOCX_TEMPLATE}`;
        fileName = 'template_doc.docx';
        break;
      case 'md':
        fileUrl = `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_GET_MD_TEMPLATE}`;
        fileName = 'template_md.md';
        break;
      case 'txt':
        fileUrl = `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_GET_TXT_TEMPLATE}`;
        fileName = 'template_txt.txt';
        break;
      // NEW: Complete templates
      case 'complete_txt':
        fileUrl = `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_GET_COMPLETE_TXT_TEMPLATE}`;
        fileName = 'complete_template.txt';
        break;
      case 'complete_md':
        fileUrl = `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_GET_COMPLETE_MD_TEMPLATE}`;
        fileName = 'complete_template.md';
        break;
      default:
        break;
    }

    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    try {
      // Kiểm tra xem file đã tồn tại chưa
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        // Nếu file đã tồn tại, mở file
        // console.log('File already exists, opening file:', fileUri);
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
      console.log('📥 Downloading template from:', fileUrl);

      // Template routes don't require authentication, use direct download
      const downloadResult = await FileSystem.downloadAsync(fileUrl, fileUri);

      if (!downloadResult || !downloadResult.uri) {
        throw new Error('Failed to download file');
      }
      console.log('✅ File downloaded to:', downloadResult.uri);
      const save = await shareAsync(downloadResult.uri);

      if (save) {
        // Mở file sau khi tải xong
        openFile(downloadResult.uri);
      }

      Alert.alert('Success', 'File downloaded and opened successfully');
    } catch (error) {
      console.error('❌ Template download error:', error);
      Alert.alert(
        'Lỗi tải template',
        `Không thể tải template: ${error.message || 'Lỗi không xác định'}`,
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
            <Text className="font-semibold">{i18n.t('create_quiz_template.upload.prompt')}</Text>
          </TouchableOpacity>
        </View>
        <View className="mt-4">
          <Text className="text-center font-semibold">
            {i18n.t('create_quiz_template.upload.step1')}
          </Text>
          <View className="flex items-center justify-center mt-2 flex-col">
            {/* Basic Templates */}
            <Text className="text-center font-bold text-lg mb-2 text-blue-600">
              📝 Template Cơ Bản (Chỉ Single Choice)
            </Text>
            <Button
              onPress={() => {
                downloadAndOpenFile('txt');
              }}
              otherStyles="p-4 mb-2 w-full"
              text="📄 Tải Template TXT Cơ Bản"
              icon={<AntDesign name="filetext1" size={18} color="white" />}
            />
            <Button
              onPress={() => {
                downloadAndOpenFile('md');
              }}
              otherStyles="p-4 mb-2 w-full"
              text="📝 Tải Template MD Cơ Bản"
              icon={<AntDesign name="file-markdown" size={18} color="white" />}
            />

            {/* Complete Templates */}
            <Text className="text-center font-bold text-lg mt-4 mb-2 text-green-600">
              🚀 Template Hoàn Chỉnh (5 Loại Câu Hỏi)
            </Text>
            <Button
              onPress={() => {
                downloadAndOpenFile('complete_txt');
              }}
              otherStyles="p-4 mb-2 w-full bg-green-600"
              text="📄 Tải Template TXT Hoàn Chỉnh"
              icon={<AntDesign name="filetext1" size={18} color="white" />}
            />
            <Button
              onPress={() => {
                downloadAndOpenFile('complete_md');
              }}
              otherStyles="p-4 mb-2 w-full bg-green-600"
              text="📝 Tải Template MD Hoàn Chỉnh"
              icon={<AntDesign name="file-markdown" size={18} color="white" />}
            />
          </View>
          <Text className="text-center font-semibold mt-4 text-lg">
            📚 Hướng Dẫn Sử Dụng Template
          </Text>

          {/* Complete Template Guide */}
          <View className="mt-4">
            <Text className="text-start font-bold text-lg px-4 text-green-600">
              🚀 Template Hoàn Chỉnh (Khuyến nghị)
            </Text>
            <Text className="text-start mt-2 px-4 text-gray-600">
              Hỗ trợ đầy đủ 5 loại câu hỏi: Single Choice, Multiple Choice, Fill-in-blank, Order,
              Match
            </Text>

            {/* 5 Question Types Examples */}
            <View className="mt-4 px-4">
              {/* Single Choice */}
              <View className="mb-4 p-3 bg-blue-50 rounded-lg">
                <Text className="font-bold text-blue-800">1. Single Choice (Chọn 1 đáp án)</Text>
                <View className="mt-2 p-2 bg-white rounded border-l-4 border-blue-400">
                  <Text className="text-sm">Question: Thủ đô Việt Nam là gì?</Text>
                  <Text className="text-sm">Type: single</Text>
                  <Text className="text-sm">Answer: A. Hà Nội</Text>
                  <Text className="text-sm">Answer: B. TP.HCM</Text>
                  <Text className="text-sm font-bold">Correct Answer: A</Text>
                </View>
              </View>

              {/* Multiple Choice */}
              <View className="mb-4 p-3 bg-purple-50 rounded-lg">
                <Text className="font-bold text-purple-800">
                  2. Multiple Choice (Chọn nhiều đáp án)
                </Text>
                <View className="mt-2 p-2 bg-white rounded border-l-4 border-purple-400">
                  <Text className="text-sm">Question: Động vật có vú nào?</Text>
                  <Text className="text-sm">Type: multiple</Text>
                  <Text className="text-sm">Answer: A. Chó</Text>
                  <Text className="text-sm">Answer: B. Cá</Text>
                  <Text className="text-sm font-bold">Correct Answers: A, C</Text>
                </View>
              </View>

              {/* Fill in blank */}
              <View className="mb-4 p-3 bg-orange-50 rounded-lg">
                <Text className="font-bold text-orange-800">3. Fill-in-blank (Điền từ)</Text>
                <View className="mt-2 p-2 bg-white rounded border-l-4 border-orange-400">
                  <Text className="text-sm">Question: Thủ đô VN là ___ ở miền ___</Text>
                  <Text className="text-sm">Type: fill</Text>
                  <Text className="text-sm">Fill: Hà Nội (position: 1)</Text>
                  <Text className="text-sm">Fill: Bắc (position: 2)</Text>
                </View>
              </View>

              {/* Order */}
              <View className="mb-4 p-3 bg-green-50 rounded-lg">
                <Text className="font-bold text-green-800">4. Order (Sắp xếp thứ tự)</Text>
                <View className="mt-2 p-2 bg-white rounded border-l-4 border-green-400">
                  <Text className="text-sm">Question: Sắp xếp số từ nhỏ đến lớn:</Text>
                  <Text className="text-sm">Type: order</Text>
                  <Text className="text-sm">Order: 3 (position: 1)</Text>
                  <Text className="text-sm">Order: 7 (position: 2)</Text>
                </View>
              </View>

              {/* Match */}
              <View className="mb-4 p-3 bg-red-50 rounded-lg">
                <Text className="font-bold text-red-800">5. Match (Nối cặp)</Text>
                <View className="mt-2 p-2 bg-white rounded border-l-4 border-red-400">
                  <Text className="text-sm">Question: Nối quốc gia với thủ đô:</Text>
                  <Text className="text-sm">Type: match</Text>
                  <Text className="text-sm">Match: Việt Nam - Hà Nội</Text>
                  <Text className="text-sm">Match: Thái Lan - Bangkok</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Basic Template Guide */}
          <View className="mt-4">
            <Text className="text-start font-bold text-lg px-4 text-blue-600">
              📝 Template Cơ Bản
            </Text>
            <Text className="text-start mt-2 px-4 text-gray-600">
              Chỉ hỗ trợ Single Choice và Multiple Choice (format cũ)
            </Text>
            <View
              className="mt-2 mx-4 p-4 rounded-xl"
              style={{
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: '#757575',
              }}
            >
              <Text className="text-sm">Quiz Title: Tiêu đề quiz</Text>
              <Text className="text-sm">Question: Câu hỏi của bạn?</Text>
              <Text className="text-sm">Answer: A. Đáp án A</Text>
              <Text className="text-sm">Answer: B. Đáp án B</Text>
              <Text className="text-sm font-bold">Correct Answer: A</Text>
            </View>
          </View>
          <Text className="text-start font-semibold mt-2 px-4">
            {i18n.t('create_quiz_template.templates.uploadPrompt')}
          </Text>

          <Button
            onPress={() => {
              clearTemplatedDownload();
            }}
            otherStyles="p-4 mt-4 mb-4"
            text={i18n.t('create_quiz_template.buttons.clearDownload')}
            icon={<SimpleLineIcons name="trash" size={18} color="white" />}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default DemoCreateQuizByTemplate;

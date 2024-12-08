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
import { useAppProvider } from '@/contexts/AppProvider';

const DemoCreateQuizByTemplate = () => {
   const { id } = useGlobalSearchParams();
   const [uploadStatus, setUploadStatus] = useState(null);
   const { userData, processAccessTokenExpired } = useAuthContext();
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
               'text/plain', // .txt
            ];

            const allowedExtensions = ['.doc', '.docx', '.md', '.txt'];

            // Check mimeType or file extension
            const isAllowedMimeType = allowedMimeTypes.includes(mimeType);
            const isAllowedExtension = allowedExtensions.some((ext) =>
               name.toLowerCase().endsWith(ext)
            );

            if (isAllowedMimeType || isAllowedExtension) {
               uploadFile(result.assets[0]);
            } else {
               setUploadStatus(
                  'Only Word (.doc, .docx, .txt) or Markdown (.md) files are accepted.'
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
         let path = '';

         switch (file.mimeType) {
            case 'text/plain':
               path = `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_UPLOAD_TXT}`;
               break;
            case 'application/msword':
               path = `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_UPLOAD_DOC}`;
               break;
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
               path = `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_UPLOAD_DOC}`;
               break;
            case 'text/markdown':
               path = `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_UPLOAD_MD}`;
            default:
               break;
         }

         const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
         const formData = new FormData();
         formData.append('file', {
            uri: file.uri,
            name: cleanFileName,
            type: file.mimeType,
         });

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
         console.log(JSON.stringify(data, null, 2));

         if (data.statusCode === 200) {
            setUploadStatus(data.message);
            getQuestionFromTemplateFile(data.metadata, id);
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
      await deleteFile(`${FileSystem.documentDirectory}template_txt.txt`);
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
                     {i18n.t('create_quiz_template.upload.prompt')}
                  </Text>
               </TouchableOpacity>
            </View>
            <View className="mt-4">
               <Text className="text-center font-semibold">
                  {i18n.t('create_quiz_template.upload.step1')}
               </Text>
               <View className="flex items-center justify-center mt-2 flex-col">
                  <Button
                     onPress={() => {
                        downloadAndOpenFile('txt');
                     }}
                     otherStyles="p-4 mb-2 w-full"
                     text={i18n.t('create_quiz_template.buttons.downloadTxt')}
                     icon={
                        <AntDesign name="filetext1" size={18} color="white" />
                     }
                  />
                  <Button
                     onPress={() => {
                        downloadAndOpenFile('md');
                     }}
                     otherStyles="p-4 mb-2 w-full"
                     text={i18n.t('create_quiz_template.buttons.downloadMd')}
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
                  {i18n.t('create_quiz_template.upload.step2')}
               </Text>
               {/* Docx */}
               <View>
                  <Text className="text-start font-semibold mt-2 px-4">
                     {i18n.t('create_quiz_template.templates.forDocx')}
                  </Text>
                  <View className="ml-4 px-4">
                     <Text className="text-start mt-2">
                        - {i18n.t('create_quiz_template.templates.docxInstruction')}
                     </Text>
                     <Text className="text-start mt-2">
                        - {i18n.t('create_quiz_template.templates.docxNote')}
                     </Text>
                  </View>
                  <Text className="text-start font-semibold mt-2 px-4">
                     {i18n.t('create_quiz_template.templates.forTemplate')}
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
                        {i18n.t('create_quiz_template.templates.docxExampleTitle')}
                     </Text>
                     <View className="mt-2">
                        <Text>
                           {i18n.t('create_quiz_template.templates.docxExampleQuestion')}
                        </Text>
                        <Text>{i18n.t('create_quiz_template.templates.docxAnswerA')}</Text>
                        <Text>{i18n.t('create_quiz_template.templates.docxAnswerB')}</Text>
                        <Text>{i18n.t('create_quiz_template.templates.docxAnswerC')}</Text>
                        <Text>{i18n.t('create_quiz_template.templates.docxAnswerD')}</Text>
                        <Text className="font-semibold">
                           {i18n.t('create_quiz_template.templates.docxExampleAnswer')}
                        </Text>
                     </View>
                  </View>
               </View>
               {/* Markdown */}
               <View>
                  <Text className="text-start font-semibold mt-2 px-4">
                     {i18n.t('create_quiz_template.templates.forMd')}
                  </Text>
                  <View className="ml-4 px-4"></View>
                  <Text className="text-start font-semibold mt-2 px-4">
                     {i18n.t('create_quiz_template.templates.forTemplate')}
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
                        {i18n.t('create_quiz_template.templates.mdExampleTitle')}
                     </Text>
                     <View className="mt-2">
                        <Text>
                           {i18n.t('create_quiz_template.templates.mdInstruction')}
                        </Text>
                        <Text>{i18n.t('create_quiz_template.templates.mdAnswerA')}</Text>
                        <Text>{i18n.t('create_quiz_template.templates.mdAnswerB')}</Text>
                        <Text>{i18n.t('create_quiz_template.templates.mdAnswerC')}</Text>
                        <Text>{i18n.t('create_quiz_template.templates.mdAnswerD')}</Text>
                        <Text className="font-semibold">
                           {i18n.t('create_quiz_template.templates.mdExampleAnswer')}
                        </Text>
                     </View>
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

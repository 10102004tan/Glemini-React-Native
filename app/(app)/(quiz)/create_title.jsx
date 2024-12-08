import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import Wrapper from '../../../components/customs/Wrapper';
import Field from '../../../components/customs/Field';
import Button from '../../../components/customs/Button';
import { router } from 'expo-router';
import { useQuizProvider } from '../../../contexts/QuizProvider';
import { useAuthContext } from '@/contexts/AuthContext';
import { API_URL, END_POINTS, API_VERSION } from '@/configs/api.config';
import { useQuestionProvider } from '@/contexts/QuestionProvider';
import * as ImagePicker from 'expo-image-picker';
import LottieView from 'lottie-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useAppProvider } from '@/contexts/AppProvider';
const CreateTitleQuizzScreen = () => {
   const { userData, processAccessTokenExpired } = useAuthContext();
   const [quizName, setQuizName] = useState('');
   const { setNeedUpdate } = useQuizProvider();
   const { actionQuizType } = useQuizProvider();
   const [prompt, setPrompt] = useState('');
   const { generateQuestionsFromGemini } = useQuestionProvider();
   const [generating, setGenerating] = useState(false);
   const [uploadedImage, setUploadedImage] = useState(null);
   const [uploadingImage, setUploadingImage] = useState(false);
   const { i18n } = useAppProvider();

   const handleGenerateQuestionFromGemini = async (quizId) => {

      // Nếu đang xử lý không gọi lại hàm
      if (generating) {
         return;
      }

      setGenerating(true);
      // Xử lý tạo quiz từ gemini
      const response = await fetch(
         `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_GENERATE_GEMINI}`,
         {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-client-id': userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({ prompt: prompt }),
         }
      );

      const data = await response.json();
      console.log(data)
      if (data.statusCode === 200) {
         const questions = data.metadata;
         // console.log(JSON.stringify(questions, null, 2));
         // console.log(JSON.stringify(questions, null, 2));
         generateQuestionsFromGemini(questions, quizId);
      } else {
         Toast.show({
            type: 'error',
            text1: "Đã xảy ra lỗi trong quá trình xử lý, vui lòng thử lại sau ít phút!",
            visibilityTime: 1000,
            autoHide: true,
         });
      }
      setGenerating(false);
   };

   const handleGenerateQuestionFromGeminiWithImage = async (quizId) => {
      try {
         setGenerating(true);
         // Xử lý tạo quiz từ gemini
         const cleanFileName = uploadedImage.fileName.replace(/[^a-zA-Z0-9.]/g, '_');
         const formData = new FormData();
         formData.append('prompt', prompt);
         formData.append('file', {
            uri: uploadedImage.uri,
            name: cleanFileName,
            type: uploadedImage.mimeType
         });

         const response = await fetch(
            `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_GENERATE_GEMINI_IMAGE}`,
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
         // console.log(data)
         if (data.statusCode === 200) {
            const questions = data.metadata;
            // console.log(JSON.stringify(questions, null, 2));
            generateQuestionsFromGemini(questions, quizId);
         } else if (data.statusCode === 500) {
            Toast.show({
               type: 'error',
               text1: "Đã xảy ra lỗi trong quá trình xử lý, vui lòng thử lại sau ít phút!",
               visibilityTime: 1000,
               autoHide: true,
            });
         }
      } catch (error) {
         Toast.show({
            type: 'error',
            text1: "Đã xảy ra lỗi trong quá trình xử lý, vui lòng thử lại sau ít phút!",
            visibilityTime: 1000,
            autoHide: true,
         });
      } finally {
         setGenerating(false);
      }
   };

   const handleCreateQuizTitle = async () => {
      // Xử lý tạo quiz rỗng
      if (userData) {
         const response = await fetch(
            `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_CREATE}`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'x-client-id': userData._id,
                  authorization: userData.accessToken,
               },
               body: JSON.stringify({
                  user_id: userData._id,
                  quiz_name: quizName,
               }),
            }
         );
         const data = await response.json();
         // console.log(data)
         if (data.statusCode === 200) {
            setNeedUpdate(true);

            switch (actionQuizType) {
               case 'create':
                  router.replace({
                     pathname: '/(app)/(quiz)/overview/',
                     params: { id: data.metadata._id },
                  });
                  break;
               case 'template':
                  router.replace({
                     pathname:
                        '/(app)/(quiz)/create_quiz_by_template',
                     params: { id: data.metadata._id },
                  });
                  break;
               case 'ai/prompt':
                  handleGenerateQuestionFromGemini(data.metadata._id);
                  break;
               case 'ai/images':
                  handleGenerateQuestionFromGeminiWithImage(data.metadata._id);
                  break;
               default:
                  break;
            }
         } else {
            if (data.statusCode === 404 && data.message === 'Access denied') {
               await processAccessTokenExpired();
            }

            // Alert to user here
            console.log('Error when create quiz');
         }
      } else {
         console.log('User not found');
      }
   };

   // Hàm upload ảnh lên server
   // Hàm tải ảnh lên server
   const uploadImage = async (file) => {
      try {
         setUploadingImage(true);

         // console.log(JSON.stringify(file, null, 2));
         const cleanFileName = file.fileName.replace(/[^a-zA-Z0-9.]/g, '_');
         const formData = new FormData();
         formData.append('file', {
            uri: file.uri,
            name: cleanFileName,
            type: file.mimeType,
         });

         const response = await fetch(
            `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_UPLOAD_IMAGE}`,
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
         return data.metadata.url;
      } catch (error) {
         if (error.message === 'Network request failed') {
            setAlertMessage(
               'Lỗi mạng, vui lòng kiểm tra kết nối và thử lại'
            );

            setShowConfirmDialog(true);
         }
      } finally {
         setUploadingImage(false);
      }
   };

   // Hàm chọn ảnh từ thư viện
   const pickImage = async () => {
      if (!uploadingImage) {
         let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 6],
            quality: 1,
         });

         if (!result.canceled && result.assets.length > 0) {
            setUploadingImage(true);
            // Tải ảnh lên server và lấy URL của ảnh
            // const imageUrl = await uploadImage(result.assets[0]);
            console.log(result.assets[0]);
            setUploadedImage(result.assets[0]);
         }
         setUploadingImage(false);
      }
   };

   return (
      <Wrapper>
         <View className="flex-1 items-center justify-start flex">
            <View className="pt-4 px-4">
               <Field
                  label={i18n.t('create_title_quiz_screen.quizName')}
                  value={quizName}
                  onChange={(text) => setQuizName(text)}
                  placeholder={i18n.t('create_title_quiz_screen.quizNameRequest')}
                  wrapperStyles="w-full"
                  inputStyles="p-4"
               />
               {actionQuizType === 'ai/prompt' && (
                  <Field
                     label={'Promt'}
                     value={prompt}
                     onChange={(text) => setPrompt(text)}
                     placeholder={i18n.t('create_title_quiz_screen.promptRequest')}
                     wrapperStyles="w-full mt-4"
                     inputStyles="p-4"
                  />
               )}

               <View className="mt-4">
                  <Button
                     loading={generating}
                     onPress={handleCreateQuizTitle}
                     text={i18n.t('create_title_quiz_screen.startCreateQuiz')}
                     otherStyles={'p-4 justify-center'}
                     textStyles={'text-center'}
                  />
               </View>
            </View>
         </View>
      </Wrapper>
   );
};

export default CreateTitleQuizzScreen;

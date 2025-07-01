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
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/libs/axios';
import Toast from 'react-native-toast-message-custom';

const CreateTitleQuizzScreen = () => {
  const { processAccessTokenExpired } = useAuthContext();
  const { user } = useAuthStore();

  const [quizName, setQuizName] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const { setNeedUpdate } = useQuizProvider();
  const { actionQuizType } = useQuizProvider();
  const [prompt, setPrompt] = useState('');
  const { generateQuestionsFromGemini } = useQuestionProvider();
  const [generating, setGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { i18n } = useAppProvider();

  // Function to pick image for AI generation
  const pickImageForAI = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadedImage(result.assets[0]);
        Toast.show({
          type: 'success',
          text1: 'Đã chọn hình ảnh thành công!',
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi khi chọn hình ảnh!',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  // V2 API - Create Quiz with enhanced data and AI support
  const handleCreateQuizTitle = async () => {
    if (!quizName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Vui lòng nhập tên quiz!',
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    // Validate AI inputs if needed
    if (actionQuizType === 'ai/prompt' && !prompt.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Vui lòng nhập prompt để tạo câu hỏi bằng AI!',
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    if (actionQuizType === 'ai/image' && !uploadedImage) {
      Toast.show({
        type: 'error',
        text1: 'Vui lòng chọn hình ảnh để tạo câu hỏi!',
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    if (user) {
      try {
        setGenerating(true);

        // Debug user info
        console.log('👤 User info:', {
          user_id: user.user_id,
          email: user.user_email,
          isSignedIn: user ? 'Yes' : 'No',
        });

        // Use V2 API endpoint to create quiz first
        const body = {
          name: quizName.trim(),
          user_id: user.user_id,
          description: quizDescription.trim() || '',
          status: 'unpublished', // Default status
          thumb: '', // Will be updated later if needed
          subject_ids: [], // Will be set in quiz overview
        };

        const response = await api.post(`${API_VERSION.V2}/quizzes/create`, body);
        const data = response.data;

        if (data.message === 'Create quiz successfully') {
          const quizId = data.metadata._id;
          setNeedUpdate(true);

          // Handle different quiz creation types
          switch (actionQuizType) {
            case 'ai/prompt':
              // Generate questions using AI prompt
              await handleGenerateQuestionFromGemini(quizId);
              break;

            case 'ai/image':
              // Generate questions using AI image analysis
              await handleGenerateQuestionFromGeminiWithImage(quizId);
              break;

            case 'template':
              // Redirect to template upload screen
              router.replace({
                pathname: '/(protected)/(quiz)/create_quiz_by_template',
                params: { id: quizId },
              });
              break;

            case 'create':
            default:
              // Manual creation - go to overview
              router.replace({
                pathname: '/(protected)/(quiz)/overview/',
                params: { id: quizId },
              });
              break;
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'Có lỗi xảy ra khi tạo quiz!',
            visibilityTime: 2000,
            autoHide: true,
          });
        }
      } catch (error) {
        console.error('Create quiz error:', error);

        if (error.response?.status === 401) {
          await processAccessTokenExpired();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Có lỗi xảy ra khi tạo quiz!',
            text2: error.response?.data?.message || 'Vui lòng thử lại',
            visibilityTime: 2000,
            autoHide: true,
          });
        }
      } finally {
        setGenerating(false);
      }
    }
  };

  // AI Generation Functions - Now Active!
  const handleGenerateQuestionFromGemini = async (quizId) => {
    if (!prompt.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Vui lòng nhập prompt để tạo câu hỏi bằng AI!',
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    try {
      setGenerating(true);

      // Debug authentication headers
      console.log('🔐 Debug Auth Headers:', {
        Authorization: api.defaults.headers.common['Authorization'],
        'x-client-id': api.defaults.headers.common['x-client-id'],
        user: user
          ? {
              user_id: user.user_id,
              email: user.user_email,
              isSignedIn: true,
            }
          : 'NOT LOGGED IN',
      });

      // Debug user authentication state
      if (!user) {
        throw new Error('User not logged in');
      }

      // Ensure authentication headers are set
      if (!api.defaults.headers.common['Authorization'] && user) {
        console.log('⚠️ Setting up authentication headers...');
        // Try to get tokens from SecureStore
        const { getItemAsync } = await import('expo-secure-store');
        const authorization = await getItemAsync('Authorization');
        const xClientId = await getItemAsync('x-client-id');

        if (authorization && xClientId) {
          api.defaults.headers.common['Authorization'] = authorization;
          api.defaults.headers.common['x-client-id'] = xClientId;
          console.log('✅ Authentication headers set from SecureStore');
        } else {
          throw new Error('No authentication tokens found');
        }
      }

      // Call Gemini API với prompt
      console.log('📡 Calling Gemini API:', {
        url: `${API_VERSION.V1}${END_POINTS.QUIZ_GENERATE_GEMINI}`,
        prompt: prompt.trim(),
        timestamp: new Date().toISOString(),
      });

      const response = await api.post(`${API_VERSION.V1}${END_POINTS.QUIZ_GENERATE_GEMINI}`, {
        prompt: prompt.trim(),
      });

      const data = response.data;
      console.log('🤖 AI Generated Questions:', data);

      if (data.statusCode === 200 && data.metadata) {
        // Sử dụng generateQuestionsFromGemini để xử lý và lưu
        await generateQuestionsFromGemini(data.metadata, quizId);
        setNeedUpdate(true);
      } else {
        Toast.show({
          type: 'error',
          text1: 'AI không thể tạo câu hỏi!',
          text2: 'Vui lòng thử prompt khác',
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          timeout: error.config?.timeout,
        },
      });

      if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
        Toast.show({
          type: 'error',
          text1:
            error.code === 'ECONNABORTED'
              ? 'Timeout - AI đang xử lý quá lâu!'
              : 'Lỗi kết nối mạng!',
          text2: 'Vui lòng thử lại hoặc rút ngắn prompt',
          visibilityTime: 4000,
          autoHide: true,
        });
      } else if (error.response?.status === 401) {
        await processAccessTokenExpired();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi khi tạo câu hỏi bằng AI!',
          text2: error.response?.data?.message || error.message || 'Vui lòng thử lại',
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateQuestionFromGeminiWithImage = async (quizId) => {
    if (!uploadedImage) {
      Toast.show({
        type: 'error',
        text1: 'Vui lòng chọn hình ảnh để tạo câu hỏi!',
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    try {
      setGenerating(true);

      // Ensure authentication headers are set
      if (!api.defaults.headers.common['Authorization'] && user) {
        console.log('⚠️ Setting up authentication headers for image upload...');
        const { getItemAsync } = await import('expo-secure-store');
        const authorization = await getItemAsync('Authorization');
        const xClientId = await getItemAsync('x-client-id');

        if (authorization && xClientId) {
          api.defaults.headers.common['Authorization'] = authorization;
          api.defaults.headers.common['x-client-id'] = xClientId;
          console.log('✅ Authentication headers set from SecureStore');
        } else {
          throw new Error('No authentication tokens found');
        }
      }

      // Tạo FormData để upload ảnh
      const formData = new FormData();
      formData.append('file', {
        uri: uploadedImage.uri,
        type: uploadedImage.type || 'image/jpeg',
        name: uploadedImage.fileName || 'image.jpg',
      });
      formData.append('prompt', prompt.trim() || 'Tạo câu hỏi dựa trên hình ảnh này');

      // Call Gemini API với hình ảnh
      const response = await api.post(
        `${API_VERSION.V1}${END_POINTS.QUIZ_GENERATE_GEMINI_IMAGE}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const data = response.data;
      console.log('🖼️ AI Generated Questions from Image:', data);

      if (data.statusCode === 200 && data.metadata) {
        // Sử dụng generateQuestionsFromGemini để xử lý và lưu
        await generateQuestionsFromGemini(data.metadata, quizId);
        setNeedUpdate(true);
      } else {
        Toast.show({
          type: 'error',
          text1: 'AI không thể tạo câu hỏi từ hình ảnh!',
          text2: 'Vui lòng thử hình ảnh khác',
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    } catch (error) {
      console.error('AI Image Generation Error:', error);

      if (error.message === 'Network Error') {
        Toast.show({
          type: 'error',
          text1: 'Lỗi kết nối mạng!',
          text2: 'Kiểm tra kết nối internet và thử lại',
          visibilityTime: 3000,
          autoHide: true,
        });
      } else if (error.response?.status === 401) {
        await processAccessTokenExpired();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi khi tạo câu hỏi từ hình ảnh!',
          text2: error.response?.data?.message || error.message || 'Vui lòng thử lại',
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Wrapper>
      <View className="flex-1 items-center justify-start flex">
        <View className="pt-4 px-4 w-full">
          <Field
            label={i18n.t('create_title_quiz_screen.quizName')}
            value={quizName}
            onChange={(text) => setQuizName(text)}
            placeholder={i18n.t('create_title_quiz_screen.quizNameRequest')}
            wrapperStyles="w-full"
            inputStyles="p-4"
          />

          <Field
            label="Mô tả (tùy chọn)"
            value={quizDescription}
            onChange={(text) => setQuizDescription(text)}
            placeholder="Nhập mô tả cho quiz của bạn..."
            wrapperStyles="w-full mt-4"
            inputStyles="p-4"
            multiline={true}
            numberOfLines={3}
          />

          {/* AI Prompt Input */}
          {actionQuizType === 'ai/prompt' && (
            <Field
              label="Prompt AI"
              value={prompt}
              onChange={(text) => setPrompt(text)}
              placeholder="Ví dụ: Tạo câu hỏi về lịch sử Việt Nam, toán học lớp 10, tiếng Anh cơ bản..."
              wrapperStyles="w-full mt-4"
              inputStyles="p-4"
              multiline={true}
              numberOfLines={3}
            />
          )}

          {/* AI Image Input */}
          {actionQuizType === 'ai/image' && (
            <View className="w-full mt-4">
              <Text className="text-base font-medium mb-2">Hình ảnh để tạo câu hỏi</Text>

              {uploadedImage ? (
                <View className="relative">
                  <Image
                    source={{ uri: uploadedImage.uri }}
                    className="w-full h-48 rounded-xl"
                    style={{ resizeMode: 'cover' }}
                  />
                  <TouchableOpacity
                    onPress={() => setUploadedImage(null)}
                    className="absolute top-2 right-2 bg-red-500 rounded-full p-2"
                  >
                    <Text className="text-white text-xs">✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={pickImageForAI}
                  className="w-full h-32 border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center"
                >
                  <LottieView
                    source={require('@/assets/jsons/clound-upload.json')}
                    autoPlay
                    loop
                    style={{ width: 80, height: 60 }}
                  />
                  <Text className="text-gray-600 font-medium">Chọn hình ảnh</Text>
                </TouchableOpacity>
              )}

              <Field
                label="Prompt bổ sung (tùy chọn)"
                value={prompt}
                onChange={(text) => setPrompt(text)}
                placeholder="Hướng dẫn thêm cho AI về loại câu hỏi muốn tạo..."
                wrapperStyles="w-full mt-4"
                inputStyles="p-4"
                multiline={true}
                numberOfLines={2}
              />
            </View>
          )}

          <View className="mt-6">
            <Button
              loading={generating}
              onPress={handleCreateQuizTitle}
              text={
                generating
                  ? actionQuizType === 'ai/prompt'
                    ? 'AI đang tạo câu hỏi...'
                    : actionQuizType === 'ai/image'
                      ? 'AI đang phân tích hình ảnh...'
                      : 'Đang tạo quiz...'
                  : actionQuizType === 'ai/prompt'
                    ? '🤖 Tạo Quiz bằng AI'
                    : actionQuizType === 'ai/image'
                      ? '🖼️ Tạo Quiz từ Hình ảnh'
                      : actionQuizType === 'template'
                        ? '📄 Tạo Quiz từ Template'
                        : '✋ Tạo Quiz thủ công'
              }
              otherStyles={'p-4 justify-center'}
              textStyles={'text-center'}
              disabled={generating || !quizName.trim()}
            />
          </View>

          {/* Information about manual quiz creation */}
          <View className="mt-4 p-4 bg-blue-50 rounded-lg">
            <Text className="text-blue-800 text-sm text-center">
              💡 Bạn đang tạo quiz thủ công. Sau khi tạo, bạn có thể thêm câu hỏi và tùy chỉnh quiz
              theo ý muốn.
            </Text>
          </View>
        </View>
      </View>
    </Wrapper>
  );
};

export default CreateTitleQuizzScreen;

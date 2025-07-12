import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Wrapper from '../../../components/customs/Wrapper';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../../../components/customs/Button';
import Overlay from '../../../components/customs/Overlay';
import BottomSheet from '../../../components/customs/BottomSheet';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import QuestionOverview from '../../../components/customs/QuestionOverview';
import { useQuestionProvider } from '../../../contexts/QuestionProvider';
import { useQuizProvider } from '../../../contexts/QuizProvider';

import { API_URL, END_POINTS, API_VERSION } from '@/configs/api.config';
import { useAppProvider } from '@/contexts/AppProvider';
import Field from '@/components/customs/Field';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useSubjectProvider } from '@/contexts/SubjectProvider';
import { convertSubjectData } from '@/utils';
import QuestionOverviewSkeleton from '@/components/loadings/QuestionOverviewSkeleton';
import QuizInforSkeleton from '@/components/loadings/QuizInforSkeleton';
import QuestionTypeSelector from '@/components/customs/QuestionTypeSelector';
import { Feather } from '@expo/vector-icons';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import { Status } from '@/constants';
import DropDownMultipleSelect from '@/components/customs/DropDownMultipleSelect';
import SkeletonLoading from '@/components/loadings/SkeletonLoading';
import api from '@/libs/axios';
import { useAuthStore } from '@/store/useAuthStore';

const QuizzOverViewScreen = () => {
  const router = useRouter();
  const [visibleCreateQuestionBottomSheet, setVisibleCreateQuestionBottomSheet] = useState(false);
  const [visibleEditQuizBottomSheet, setVisibleEditQuizBottomSheet] = useState(false);
  const { setIsHiddenNavigationBar } = useAppProvider();
  const { id } = useGlobalSearchParams();


  const { user } = useAuthStore();
  const [quizId, setQuizId] = useState('');
  // Save init state
  const [quizName, setQuizName] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizStatus, setQuizStatus] = useState('');
  const [quizSubjects, setQuizSubjects] = useState([]);
  const [quizThumbnail, setQuizThumbnail] = useState('');
  // Save change state
  const [quizNameChange, setQuizNameChange] = useState('');
  const [quizDescriptionChange, setQuizDescriptionChange] = useState('');
  const [quizStatusChange, setQuizStatusChange] = useState('');
  const [quizSubjectsChange, setQuizSubjectsChange] = useState([]);
  const [quizThumbnailChange, setQuizThumbnailChange] = useState('');
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [confirmFn, setConfirmFn] = useState('close');
  const [uploadedImage, setUploadedImage] = useState(null);
  const { isChangeData, setIsChangeData, setQuestions } = useQuestionProvider();
  const { i18n } = useAppProvider();

  // Hàm kiểm tra xem câu hỏi có thay đổi không
  useEffect(() => {
    if (isChangeData && id) {
      // console.log("CALL WHENN OVERVIEW ID CHANGE AND ISCHANGEDATA")
      fetchQuestions();
      setIsChangeData(false);
    }
  }, [isChangeData, id]);

  // Hàm kiểm tra xem có thay đổi thông tin quiz không
  const isChange = () => {
    return (
      quizName !== quizNameChange ||
      quizDescription !== quizDescriptionChange ||
      quizStatus !== quizStatusChange ||
      quizSubjects !== quizSubjectsChange ||
      quizThumbnail !== quizThumbnailChange
    );
  };

  const {
    setActionQuizType,
    quizFetching,
    setQuizFetching,
    deleteQuiz,
    questionFetching,
    updateQuiz,
    setQuestionFetching,
    isSave,
    setIsSave,
    setIsEdited,
  } = useQuizProvider();

  const { resetQuestion, selectQuestionType, createBoxQuestion, createBlankQuestion } =
    useQuestionProvider();

  // Lấy dữ liệu môn học
  const { subjects } = useSubjectProvider();
  const subjectsData = convertSubjectData(subjects);

  useEffect(() => {
    if (id) {
      // console.log("CALL THE FIRST TIME")
      fetchQuiz();
      fetchQuestions();
    }
  }, []);

  // Lấy thông tin của quiz hiện tại
  const fetchQuiz = async () => {
    setQuizFetching(true);
    try {
      // V2 API - RESTful approach for getting quiz details
      const response = await api.get(`${API_VERSION.V2}/quizzes/${id}`);
      const data = response.data;

      if (data.message === 'Get quiz successfully') {
        const quizData = data.metadata;
        setQuizId(quizData._id);
        setQuizThumbnail(quizData.quiz_thumb);
        setQuizName(quizData.quiz_name);
        setQuizDescription(quizData.quiz_description);
        setQuizStatus(quizData.quiz_status);
        setQuizSubjects(quizData.subject_ids || []);
        setQuizNameChange(quizData.quiz_name);
        setQuizDescriptionChange(quizData.quiz_description);
        setQuizStatusChange(quizData.quiz_status);
        setQuizSubjectsChange(quizData.subject_ids || []);
        setQuizThumbnailChange(quizData.quiz_thumb);

        // V2 API now returns user_id as ObjectId string, not populated object
        const quizUserId = quizData.user_id?.toString();
        const currentUserId = user.user_id?.toString();

        console.log('🔍 OVERVIEW - Quiz owner ID:', quizUserId);
        console.log('🔍 OVERVIEW - Current user ID:', currentUserId);
        console.log('🔍 OVERVIEW - Are they equal?', quizUserId === currentUserId);

        if (quizUserId === currentUserId) {
          console.log('✅ OVERVIEW - User is OWNER');
          setIsEdited(true);
        } else {
          console.log('⚠️ OVERVIEW - User is NOT owner, checking shared users...');
          const users = quizData.shared_user_ids || [];
          console.log('🔍 OVERVIEW - Shared users:', users);

          const check = users.some((sharedUser) => {
            const sharedUserId = sharedUser.user_id?.toString();
            console.log(
              '🔍 OVERVIEW - Checking shared user:',
              sharedUserId,
              'isEdit:',
              sharedUser.isEdit,
            );
            return sharedUserId === currentUserId && sharedUser.isEdit;
          });

          console.log('🔍 OVERVIEW - Has edit permission?', check);
          setIsEdited(check);
        }
      } else {
        console.error('Failed to fetch quiz:', data.message);
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      if (error.response?.status === 401) {
        // Handle 401 error - token expired
        console.log('Token expired, redirecting to login');
      }
    } finally {
      setQuizFetching(false);
    }
  };

  // Lấy danh sách các câu hỏi thuộc quiz hiện tại
  const fetchQuestions = async () => {
    console.log('🚀 OVERVIEW - CALL FETCH QUESTION V2');
    console.log('🚀 OVERVIEW - Request URL:', `${API_VERSION.V2}/quizzes/${id}/questions`);
    console.log('🚀 OVERVIEW - Quiz ID:', id);
    console.log('🚀 OVERVIEW - Timestamp:', new Date().toISOString());
    setQuestionFetching(true);
    try {
      // V2 API - POST approach for getting quiz questions (following V1 convention)
      const response = await api.post(`${API_VERSION.V2}/quizzes/${id}/questions`, {
        quiz_id: id,
      });
      const data = response.data;

      console.log('🚀 OVERVIEW - Full API Response:', JSON.stringify(data, null, 2));
      console.log('🚀 OVERVIEW - Response status:', response.status);
      console.log('🚀 OVERVIEW - Message:', data.message);

      if (data.message === 'Get questions by quiz successfully') {
        const questionsData = data.metadata.items || [];
        console.log('🚀 OVERVIEW - Questions Data:', JSON.stringify(questionsData, null, 2));
        console.log('🚀 OVERVIEW - Number of questions:', questionsData.length);

        if (questionsData.length > 0) {
          console.log('🎯 First question structure:', JSON.stringify(questionsData[0], null, 2));
        }

        setCurrentQuizQuestion(questionsData);
        setQuestions(questionsData);
        console.log(
          '🚀 OVERVIEW - State updated - currentQuizQuestion length:',
          questionsData.length,
        );
        console.log('🚀 OVERVIEW - First question:', questionsData[0]);
      } else {
        console.error('Failed to fetch questions:', data.message);
        setCurrentQuizQuestion([]);
        setQuestions([]);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      if (error.response?.status === 401) {
        // Handle 401 error - token expired
        console.log('Token expired, redirecting to login');
      }
      setCurrentQuizQuestion([]);
      setQuestions([]);
    } finally {
      setQuestionFetching(false);
    }
  };

  // Cập nhật thông tin của quiz
  const handleUpdateQuiz = async (id, thumbnail = quizThumbnail) => {
    try {
      // V2 API - Update quiz with enhanced validation
      const quiz = {
        name: quizName,
        description: quizDescription,
        status: quizStatus,
        thumb: thumbnail,
        subject_ids: quizSubjects,
      };

      console.log('Updating quiz with V2 API:', quiz);

      const response = await api.put(`${API_VERSION.V2}/quizzes/${id}`, quiz);
      const data = response.data;

      if (data.message === 'Update quiz successfully') {
        // Reset change tracking
        setQuizNameChange(quizName);
        setQuizDescriptionChange(quizDescription);
        setQuizStatusChange(quizStatus);
        setQuizSubjectsChange(quizSubjects);
        setQuizThumbnailChange(thumbnail);
        setUploadedImage(null);

        console.log('Quiz updated successfully');
      } else {
        console.error('Failed to update quiz:', data.message);
      }
    } catch (error) {
      console.error('Error updating quiz:', error);
      if (error.response?.status === 401) {
        // Handle 401 error - token expired
        console.log('Token expired, redirecting to login');
      }
    } finally {
      setIsSave(false);
    }
  };

  // Lấy danh sách câu hỏi của bộ quiz hiện tại
  const createQuestion = (questionType) => {
    handleCloseBottomSheet();
    if (isChange()) {
      handleUpdateQuiz(id);
    }

    // V2 Question Types: single, multiple, fill, order
    // All V2 question types use selectQuestionType for consistency
    selectQuestionType(questionType);

    router.push({
      pathname: '(protected)/(quiz)/edit_quiz_question',
      params: { quizId: id },
    });
  };

  // Hiển thị bottom sheet tạo câu hỏi
  const handleShowCreateQuizQuestionBottomSheet = () => {
    setActionQuizType('create');
    resetQuestion();
    setIsHiddenNavigationBar(true);
    setVisibleCreateQuestionBottomSheet(true);
  };

  // Hiển thị bottom sheet chỉnh sửa thông tin quiz
  const handleShowBottomSheetEditQuiz = () => {
    setVisibleEditQuizBottomSheet(true);
    setIsHiddenNavigationBar(true);
  };

  // Đóng bottom sheet
  const handleCloseBottomSheet = () => {
    setIsHiddenNavigationBar(false);
    setVisibleEditQuizBottomSheet(false);
    setVisibleCreateQuestionBottomSheet(false);
  };

  // Hàm tải ảnh lên server
  const uploadImage = async (file) => {
    try {
      setUploadingImage(true);
      const cleanFileName = file.fileName.replace(/[^a-zA-Z0-9.]/g, '_');
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: cleanFileName,
        type: file.mimeType,
      });
      console.log('🔧 DEBUG - FormData object:', formData);
      console.log('🔧 DEBUG - File object:', file);
      console.log('🔧 DEBUG - Upload URL:', `${API_VERSION.V1}${END_POINTS.QUIZ_UPLOAD_IMAGE}`);

      // Use fetch instead of axios for file upload to avoid Content-Type issues
      const uploadUrl = `${api.defaults.baseURL}${API_VERSION.V1}${END_POINTS.QUIZ_UPLOAD_IMAGE}`;
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: api.defaults.headers.common['Authorization'],
          'x-client-id': api.defaults.headers.common['x-client-id'],
          // Don't set Content-Type - let browser set it with boundary
        },
      });
      const data = await response.json();
      if (data.statusCode === 200) {
        return data.metadata.url;
      } else {
        return null;
      }
    } catch (error) {
      if (error.message === 'Network request failed') {
        setAlertMessage(i18n.t('overview_quiz_screen.alertNetwork'));
        setShowConfirmDialog(true);
      }
      console.log(error);
    } finally {
      setUploadingImage(false);
    }
  };

  // Hàm chọn ảnh từ thư viện
  const pickImage = async () => {
    if (!uploadingImage) {
      setUploadingImage(true);

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setUploadedImage(result.assets[0]);
        setQuizThumbnail(null);
      }
      setUploadingImage(false);
    }
  };

  // Hàm cập nhật state khi chọn/bỏ chọn môn học
  const handleSelectSubjects = (key) => {
    if (quizSubjects.includes(key)) {
      // Nếu môn học đã được chọn, bỏ nó khỏi danh sách
      setQuizSubjects(quizSubjects.filter((item) => item !== key));
    } else {
      // Nếu chưa chọn, thêm vào danh sách
      setQuizSubjects([...quizSubjects, key]);
    }
  };

  // Lưu thông tin của quiz khi người dùng ấn nút lưu trên thanh header
  useEffect(() => {
    const handleSaveQuiz = async () => {
      if (isSave) {
        try {
          // Cập nhật lại ảnh thumbnail của quiz nếu người dùng thay đổi
          if (uploadedImage) {
            const imageUrl = await uploadImage(uploadedImage);
            if (imageUrl) {
              setQuizThumbnail(imageUrl);
              await handleUpdateQuiz(id, imageUrl);
            } else {
              setIsSave(false);
            }
          } else {
            await handleUpdateQuiz(id);
          }
        } catch (error) {
          console.error('Error saving quiz:', error);
          setIsSave(false);
        }
      }
    };

    handleSaveQuiz();
  }, [isSave]);

  return (
    <Wrapper>
      {/* Overlay */}
      <Overlay
        onPress={handleCloseBottomSheet}
        visible={visibleCreateQuestionBottomSheet || visibleEditQuizBottomSheet}
      />

      {/* Bottom Sheet Create - Updated with QuestionTypeSelector */}
      <BottomSheet visible={visibleCreateQuestionBottomSheet} onClose={handleCloseBottomSheet}>
        <QuestionTypeSelector
          onSelectType={(type) => {
            createQuestion(type);
            handleCloseBottomSheet();
          }}
          selectedType="single"
        />
      </BottomSheet>

      {/* Bottom Sheet Edit */}
      <BottomSheet visible={visibleEditQuizBottomSheet} onClose={handleCloseBottomSheet}>
        <View className="flex flex-col items-start justify-start">
          <View className="w-full">
            <Field
              wrapperStyles="w-full"
              label={i18n.t('overview_quiz_screen.quizName')}
              value={quizName}
              onChange={(text) => {
                if (text.length <= 100) {
                  setQuizName(text);
                } else {
                  setAlertMessage(i18n.t('overview_quiz_screen.alertMessageQuizName'));
                  setConfirmFn('close');
                  setShowConfirmDialog(true);
                }
              }}
              placeholder={i18n.t('overview_quiz_screen.quizName')}
            />
          </View>
          <View className="w-full mt-4">
            <Field
              wrapperStyles="w-full"
              label={i18n.t('overview_quiz_screen.quizDescription')}
              value={quizDescription}
              onChange={(text) => {
                if (text.length <= 200) {
                  setQuizDescription(text);
                } else {
                  setAlertMessage(
                    setAlertMessage(i18n.t('overview_quiz_screen.alertMessageQuizDescription')),
                  );
                  setConfirmFn('close');
                  setShowConfirmDialog(true);
                }
              }}
              placeholder={i18n.t('overview_quiz_screen.quizDescription')}
            />
          </View>
          <View className="w-full mt-4">
            <Text className="text-gray mb-1">{i18n.t('overview_quiz_screen.quizSubject')}</Text>
            {/* Mutiple Select List */}
            <DropDownMultipleSelect
              label={i18n.t('overview_quiz_screen.quizSubject')}
              data={subjectsData}
              selectedIds={quizSubjects}
              onSelected={(key) => handleSelectSubjects(key)}
            />
          </View>
          <View className="w-full mt-4">
            <Text className="text-gray mb-1">{i18n.t('overview_quiz_screen.viewMode')}</Text>

            {/* Single Select */}
            <DropDownMultipleSelect
              label={i18n.t('overview_quiz_screen.viewMode')}
              data={Status.view}
              selectedIds={quizStatus === 'published' ? ['published'] : ['unpublished']}
              onSelected={(key) => setQuizStatus(key)}
            />
          </View>
        </View>
      </BottomSheet>

      {/* Confirm dialog */}
      <ConfirmDialog
        title={i18n.t('overview_quiz_screen.notification')}
        visible={showConfirmDialog}
        onCancel={() => {
          setShowConfirmDialog(false);
          setConfirmFn('close');
        }}
        onConfirm={() => {
          if (confirmFn === 'delete') {
            deleteQuiz(id);
            setConfirmFn('close');
            router.back();
          }
          setShowConfirmDialog(false);
        }}
        message={alertMessage}
      />

      <ScrollView
        className="mb-[80px]"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {quizFetching ? (
          <>
            {/* <Text>LOADING</Text> */}
            <QuizInforSkeleton />
          </>
        ) : (
          <>
            <View className="p-4 flex items-center justify-center flex-col">
              {quizThumbnail ? (
                <>
                  <TouchableOpacity
                    className="w-full max-h-[300px] h-[260px] rounded-2xl overflow-hidden"
                    onPress={() => {
                      pickImage();
                    }}
                  >
                    {uploadingImage ? (
                      <>
                        <View className="flex-1 flex items-center justify-center w-full min-h-[120px]">
                          <SkeletonLoading styles="w-full h-full" />
                        </View>
                      </>
                    ) : (
                      <Image className="flex-1" source={{ uri: quizThumbnail }}></Image>
                    )}
                  </TouchableOpacity>
                </>
              ) : uploadedImage ? (
                <>
                  <TouchableOpacity
                    className="w-full max-h-[300px] h-[260px] rounded-2xl overflow-hidden"
                    onPress={() => {
                      pickImage();
                    }}
                  >
                    {uploadingImage ? (
                      <>
                        <View className="flex-1 flex items-center justify-center w-full min-h-[120px]">
                          <SkeletonLoading styles="w-full h-full" />
                        </View>
                      </>
                    ) : (
                      <Image className="flex-1" source={{ uri: uploadedImage.uri }}></Image>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    className="flex items-center justify-center flex-col rounded-2xl bg-overlay w-full min-h-[120px]"
                    onPress={() => {
                      pickImage();
                    }}
                  >
                    <Ionicons name="image-outline" size={24} color="black" />
                    <Text className="text-center mt-1">
                      {i18n.t('overview_quiz_screen.addImageTitle')}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            {/* Quiz infor */}
            <View className="mt-4 p-4">
              <View className="flex items-center justify-between flex-row">
                <View className="max-w-[300px]">
                  <Text className="text-lg font-semibold">
                    {(quizName.length > 25 ? quizName.substring(0, 25) + '...' : quizName) ||
                      i18n.t('overview_quiz_screen.quizName')}
                  </Text>
                  <Text className="text-gray max-w-[300px]">
                    {(quizDescription.length > 25
                      ? quizDescription.substring(0, 25) + '...'
                      : quizDescription) || i18n.t('overview_quiz_screen.quizDescription')}
                  </Text>
                </View>
                <View className="flex items-center flex-row justify-center">
                  <TouchableOpacity
                    className="p-2 rounded-full bg-primary w-10 flex items-center justify-center h-10"
                    onPress={() => {
                      handleShowBottomSheetEditQuiz();
                    }}
                  >
                    <Feather name="edit-3" size={20} color="white" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="ml-2 p-2 rounded-full bg-primary w-10 flex items-center justify-center h-10"
                    onPress={() => {
                      setConfirmFn('delete');
                      setAlertMessage(i18n.t('overview_quiz_screen.confirmDelete'));
                      setShowConfirmDialog(true);
                    }}
                  >
                    <FontAwesome name="trash-o" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        )}
        {/* Quiz Questions */}
        {questionFetching ? (
          <>
            <View className="mt-2 p-4">
              <QuestionOverviewSkeleton />
            </View>
          </>
        ) : (
          <View className="mt-2 p-4">
            <Text className="mb-2">{i18n.t('overview_quiz_screen.editQuestionTitle')}</Text>
            {console.log('🎯 Render - currentQuizQuestion length:', currentQuizQuestion.length)}
            {console.log('🎯 Render - currentQuizQuestion data:', currentQuizQuestion)}
            {currentQuizQuestion.length > 0 ? (
              currentQuizQuestion.map((question, index) => {
                console.log(`🎯 Rendering question ${index + 1}:`, question);
                return (
                  <QuestionOverview key={index} quizId={quizId} question={question} index={index} />
                );
              })
            ) : (
              <Text className="text-gray-500 text-center py-4">No questions found</Text>
            )}
          </View>
        )}
      </ScrollView>

      <View className="p-4 absolute bg-white bottom-0 w-full border-t border-gray">
        <Button
          onPress={handleShowCreateQuizQuestionBottomSheet}
          text={i18n.t('overview_quiz_screen.btnAddQuestion')}
          otherStyles={'p-4 justify-center'}
          textStyles={'text-center'}
        />
      </View>
    </Wrapper>
  );
};

export default QuizzOverViewScreen;

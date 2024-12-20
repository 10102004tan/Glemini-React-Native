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
import { useAuthContext } from '../../../contexts/AuthContext';
import { API_URL, END_POINTS, API_VERSION } from '@/configs/api.config';
import { useAppProvider } from '@/contexts/AppProvider';
import Field from '@/components/customs/Field';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useSubjectProvider } from '@/contexts/SubjectProvider';
import { convertSubjectData } from '@/utils';
import QuestionOverviewSkeleton from '@/components/loadings/QuestionOverviewSkeleton';
import QuizInforSkeleton from '@/components/loadings/QuizInforSkeleton';
import { Feather } from '@expo/vector-icons';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import { Status } from '@/constants';
import DropDownMultipleSelect from '@/components/customs/DropDownMultipleSelect';
import SkeletonLoading from '@/components/loadings/SkeletonLoading';

const QuizzOverViewScreen = () => {
   const router = useRouter();
   const [
      visibleCreateQuestionBottomSheet,
      setVisibleCreateQuestionBottomSheet,
   ] = useState(false);
   const [visibleEditQuizBottomSheet, setVisibleEditQuizBottomSheet] =
      useState(false);
   const { setIsHiddenNavigationBar } = useAppProvider();
   const { id } = useGlobalSearchParams();

   const { userData, processAccessTokenExpired } = useAuthContext();
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

   }, [isChangeData, id])



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
      setIsEdited
   } = useQuizProvider();

   const {
      resetQuestion,
      selectQuestionType,
      createBoxQuestion,
      createBlankQuestion,
   } = useQuestionProvider();

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

   // Lưu thông tin của quiz khi người dùng ấn nút lưu trên thanh header
   useEffect(() => {
      const handleSaveQuiz = async () => {
         if (isSave) {
            // console.log("CALL SAVE QUIZ")
            // Cập nhật lại ảnh thumbnail của quiz nếu người dùng thay đổi
            if (uploadedImage) {
               const imageUrl = await uploadImage(uploadedImage);
               if (imageUrl) {
                  // console.log(imageUrl)
                  setQuizThumbnail(imageUrl);
                  handleUpdateQuiz(id, imageUrl);
               } else {
                  setIsSave(false);
               }
            } else {
               handleUpdateQuiz(id);
            }
         }
      }

      handleSaveQuiz();
   }, [isSave]);

   // Lấy thông tin của quiz hiện tại
   const fetchQuiz = async () => {
      // console.log("CALL FETCH QUIZ")
      setQuizFetching(true);
      const response = await fetch(
         `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_DETAIL}`,
         {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-client-id': userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({ quiz_id: id }),
         }
      );

      const data = await response.json();
      if (data.statusCode === 200) {
         // Save init state
         setQuizId(data.metadata._id);
         setQuizThumbnail(data.metadata.quiz_thumb);
         setQuizName(data.metadata.quiz_name);
         setQuizDescription(data.metadata.quiz_description);
         setQuizStatus(data.metadata.quiz_status);
         setQuizSubjects(data.metadata.subject_ids);
         // Save change state
         setQuizNameChange(data.metadata.quiz_name);
         setQuizDescriptionChange(data.metadata.quiz_description);
         setQuizStatusChange(data.metadata.quiz_status);
         setQuizSubjectsChange(data.metadata.subject_ids);
         setQuizThumbnailChange(data.metadata.quiz_thumb);


         if (data.metadata.user_id === userData._id) {
            setIsEdited(true);
         } else {
            const users = data.metadata.shared_user_ids;
            const check = users.some(
               (user) => user.user_id === userData._id && user.isEdit
            );
            setIsEdited(check);
         }

      } else {
         if (data.statusCode === 401 && data.message === 'expired') {
            processAccessTokenExpired();
         }
      }

      setQuizFetching(false);
   };

   // Lấy danh sách các câu hỏi thuộc quiz hiện tại
   const fetchQuestions = async () => {
      console.log("CALL FETCH QUESTION")
      setQuestionFetching(true);
      const response = await fetch(
         `${API_URL}${API_VERSION.V1}${END_POINTS.GET_QUIZ_QUESTIONS}`,
         {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-client-id': userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({ quiz_id: id }),
         }
      );

      const data = await response.json();
      // console.log(data);

      if (data.statusCode === 200) {
         setCurrentQuizQuestion(data.metadata);
         setQuestions(data.metadata);
      } else {
         if (data.statusCode === 401 && data.message === 'expired') {
            processAccessTokenExpired();
         }
         setCurrentQuizQuestion([]);
      }
      setQuestionFetching(false);
   };

   // Cập nhật thông tin của quiz
   const handleUpdateQuiz = async (id, thumbnail = quizThumbnail) => {
      // console.log(quizThumbnail)
      const quiz = {
         quiz_id: id,
         quiz_name: quizName,
         quiz_description: quizDescription,
         quiz_status: quizStatus,
         quiz_subjects: quizSubjects,
         quiz_thumb: thumbnail,
      };

      // console.log(JSON.stringify(quiz, null, 2));

      const success = await updateQuiz(quiz);
      if (success) {
         handleCloseBottomSheet();
         router.back();
      } else {
         // setAlertMessage(i18n.t('overview_quiz_screen.alertNetwork'));
         // setShowConfirmDialog(true);
      }
   };

   // Lấy danh sách câu hỏi của bộ quiz hiện tại
   const createQuestion = (questionType) => {
      handleCloseBottomSheet();
      if (isChange()) {
         handleUpdateQuiz(id);
      }

      // Trạng thái câu hỏi ở đây sẽ là multiple choice hoặc single, fill in the blank, essay
      if (questionType !== 'box' && questionType !== 'blank') {
         selectQuestionType(questionType);
      } else if (questionType === 'box') {
         createBoxQuestion();
      } else if (questionType === 'blank') {
         createBlankQuestion();
      }

      router.push({
         pathname: '(app)/(quiz)/edit_quiz_question',
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
         // console.log(data)
         if (data.statusCode === 200) {
            return data.metadata.url;
         } else {
            return null;
         }
      } catch (error) {
         if (error.message === 'Network request failed') {
            setAlertMessage(
               i18n.t('overview_quiz_screen.alertNetwork')
            );

            setShowConfirmDialog(true);
         }
         console.log(error)
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

   return (
      <Wrapper>
         {/* Overlay */}
         <Overlay
            onPress={handleCloseBottomSheet}
            visible={
               visibleCreateQuestionBottomSheet ||
               visibleEditQuizBottomSheet
            }
         />

         {/* Bottom Sheet Create */}
         <BottomSheet
            visible={visibleCreateQuestionBottomSheet}
            onClose={handleCloseBottomSheet}
         >
            <View className="flex flex-col items-start justify-start">
               <Text className="text-lg">{i18n.t('overview_quiz_screen.chooseQuestionType')}</Text>
               <View className="mt-4">
                  <Text className="text-sm text-gray">{i18n.t('overview_quiz_screen.evaluation')}</Text>
                  <View className="flex flex-col items-start justify-start mt-2">
                     <TouchableOpacity
                        className="flex flex-row items-center justify-start"
                        onPress={() => {
                           createQuestion('multiple');
                        }}
                     >
                        <MaterialCommunityIcons
                           name="checkbox-outline"
                           size={20}
                           color="black"
                        />
                        <Text className="ml-2">{i18n.t('overview_quiz_screen.mutipleChoice')}</Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                        className="flex flex-row items-center justify-start mt-1"
                        onPress={() => {
                           createQuestion('box');
                        }}
                     >
                        <MaterialCommunityIcons
                           name="checkbox-blank-outline"
                           size={20}
                           color="black"
                        />
                        <Text className="ml-2">{i18n.t('overview_quiz_screen.fillInBlank')}</Text>
                     </TouchableOpacity>
                  </View>
               </View>
               <View className="mt-4">
                  <Text className="text-sm text-gray">{i18n.t('overview_quiz_screen.logical')}</Text>
                  <View className="flex flex-col items-start justify-start mt-2">
                     <TouchableOpacity
                        className="flex flex-row items-center justify-start"
                        onPress={() => {
                           createQuestion('blank');
                        }}
                     >
                        <MaterialCommunityIcons
                           name="text"
                           size={20}
                           color="black"
                        />
                        <Text className="ml-2">{i18n.t('overview_quiz_screen.blank')}</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </BottomSheet>

         {/* Bottom Sheet Edit */}
         <BottomSheet
            visible={visibleEditQuizBottomSheet}
            onClose={handleCloseBottomSheet}
         >
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
                              setAlertMessage(i18n.t('overview_quiz_screen.alertMessageQuizDescription'))
                           );
                           setConfirmFn('close');
                           setShowConfirmDialog(true);
                        }
                     }}
                     placeholder={i18n.t('overview_quiz_screen.quizDescription')}
                  />
               </View>
               <View className="w-full mt-4">
                  <Text className="text-gray mb-1">
                     {i18n.t('overview_quiz_screen.quizSubject')}
                  </Text>
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
                     selectedIds={
                        quizStatus === 'published'
                           ? ['published']
                           : ['unpublished']
                     }
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

         <ScrollView className="mb-[80px]"
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
                                 <Image
                                    className="flex-1"
                                    source={{ uri: quizThumbnail }}
                                 ></Image>
                              )}
                           </TouchableOpacity>
                        </>
                     ) : (
                        uploadedImage ? <>
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
                                 <Image
                                    className="flex-1"
                                    source={{ uri: uploadedImage.uri }}
                                 ></Image>
                              )}
                           </TouchableOpacity>
                        </> : <>
                           <TouchableOpacity
                              className="flex items-center justify-center flex-col rounded-2xl bg-overlay w-full min-h-[120px]"
                              onPress={() => {
                                 pickImage();
                              }}
                           >
                              <Ionicons
                                 name="image-outline"
                                 size={24}
                                 color="black"
                              />
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
                              {(quizName.length > 25 ? quizName.substring(0, 25) + "..." : quizName) || i18n.t('overview_quiz_screen.quizName')}
                           </Text>
                           <Text className="text-gray max-w-[300px]">
                              {(quizDescription.length > 25 ? quizDescription.substring(0, 25) + "..." : quizDescription) ||
                                 i18n.t('overview_quiz_screen.quizDescription')}
                           </Text>
                        </View>
                        <View className="flex items-center flex-row justify-center">
                           <TouchableOpacity
                              className="p-2 rounded-full bg-primary w-10 flex items-center justify-center h-10"
                              onPress={() => {
                                 handleShowBottomSheetEditQuiz();
                              }}
                           >
                              <Feather
                                 name="edit-3"
                                 size={20}
                                 color="white"
                              />
                           </TouchableOpacity>

                           <TouchableOpacity
                              className="ml-2 p-2 rounded-full bg-primary w-10 flex items-center justify-center h-10"
                              onPress={() => {
                                 setConfirmFn('delete');
                                 setAlertMessage(
                                    i18n.t('overview_quiz_screen.confirmDelete')
                                 );
                                 setShowConfirmDialog(true);
                              }}
                           >
                              <FontAwesome
                                 name="trash-o"
                                 size={20}
                                 color="white"
                              />
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
                  {currentQuizQuestion.length > 0 &&
                     currentQuizQuestion.map((question, index) => {
                        return (
                           <QuestionOverview
                              key={index}
                              quizId={quizId}
                              question={question}
                              index={index}
                           />
                        );
                     })}
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

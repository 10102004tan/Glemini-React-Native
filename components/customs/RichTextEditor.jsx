import React, { useEffect, useRef, useState } from 'react';
import { Text, ScrollView, View, Keyboard, TextInput } from 'react-native';
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
import { TouchableOpacity } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message-custom';
import { useAppProvider } from '@/contexts/AppProvider';

const RichTextEditor = ({
   questionType = '',
   typingType = '',
   content = '',
   selectedAnswer = 0,
   focus = false,
   isSave = false,
   setIsSaveData = () => { },
   closeEditBoard = () => { },
}) => {
   const [editorValue, setEditorValue] = useState('');
   const { question, setQuestion, editAnswerContent, resetQuestion } = useQuestionProvider();
   const { userData } = useAuthContext();
   const richText = useRef(null);
   const fieldRef = useRef(null);
   const { i18n } = useAppProvider();

   useEffect(() => {
      if (typingType === Status.quiz.ANSWER && questionType === 'box') {
         if (focus) {
            fieldRef.current.focus();
         } else {
            fieldRef.current.blur();
         }
      } else {
         if (richText.current) {
            if (focus) {
               richText.current.focusContentEditor();
            } else {
               richText.current.blurContentEditor();
            }
         }
      }
   }, [focus, typingType, questionType, fieldRef, richText]);

   // Tạo các customs icon cho toolbar của RichEditor
   const handleHead = ({ tintColor }) => (
      <FontAwesome5 name="heading" size={18} color={tintColor} />
   );

   const handleImage = ({ tintColor }) => {
      return <FontAwesome name="image" size={18} color={tintColor} />;
   };

   // Cập nhật nội dung của RichEditor
   useEffect(() => {
      if (typingType === Status.quiz.ANSWER && questionType === 'box') {
         setEditorValue(content)
      } else {
         if (richText) {
            richText.current.setContentHTML(content);
            editorValue !== content && setEditorValue(content);
         }
      }

   }, [content, richText, typingType, questionType]);

   useEffect(() => {
      if (isSave) {
         handleUpdateData();
      }
   }, [isSave]);

   const handleUpdateData = () => {
      switch (typingType) {
         // Trương hợp dùng rich text editor tạo giải thích cho câu hỏi
         case Status.quiz.EXPLAINATION:
            setQuestion({ ...question, question_explanation: editorValue });
            break;
         // Trường hợp dùng rich text editor tạo nội dung câu hỏi
         case Status.quiz.QUESTION:
            setQuestion({ ...question, question_excerpt: editorValue });
            break;
         // Trường hợp dùng rich text editor tạo nội dung câu trả lời
         case Status.quiz.ANSWER:
            editAnswerContent(selectedAnswer, editorValue);
            break;

         default:
            break;
      }
      setIsSaveData(false);
      closeEditBoard();
   };

   // Hàm tải ảnh lên server
   const uploadImage = async (file) => {
      try {
         // console.log(file);
         const formData = new FormData();

         const cleanFileName = file.fileName.replace(/[^a-zA-Z0-9.]/g, '_');

         formData.append('file', {
            uri: file.uri,
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

         // console.log(
         //    `${API_URL}${API_VERSION.V1}${END_POINTS.QUESTION_UPLOAD_IMAGE}`
         // );

         const data = await response.json();
         // console.log(data);
         return data.metadata.url; // URL của ảnh trên server
      } catch (error) {
         // console.log(error);
         if (error.message === 'Network request failed') {
            Toast.show({
               type: 'error',
               text1: i18n.t('rich_editor.networkErrorTitle'),
               text2: i18n.t('rich_editor.networkError'),
            });
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
         <ScrollView className="max-h-[300px]">
            {/* Question type === box use simple editor to edit value of answer */}
            {typingType === Status.quiz.ANSWER && questionType === 'box' ? <View>
               <TextInput ref={fieldRef} placeholder={i18n.t('rich_editor.enterAnswer')} value={editorValue} onChangeText={(text) => setEditorValue(text)} />
            </View> : <>
               {/* Question type === one choose or multiple choose */}
               <RichEditor
                  defaultParagraphSeparator=""
                  initialContentHTML={content}
                  placeholder={typingType === Status.quiz.ANSWER ? i18n.t('rich_editor.enterAnswer') : typingType === Status.quiz.QUESTION ? i18n.t('rich_editor.enterQuestion') : i18n.t('rich_editor.enterExplain')}
                  style={{ width: '100%', height: 300 }}
                  ref={richText}
                  onChange={(descriptionText) => {
                     setEditorValue(descriptionText);
                  }}
               />
            </>}
         </ScrollView>

         {
            !(typingType === Status.quiz.ANSWER && questionType === 'box') && <RichToolbar
               editor={richText}
               actions={[
                  actions.heading1,
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                  actions.insertBulletsList,
                  actions.insertOrderedList,
                  actions.insertLink,
                  typingType !== Status.quiz.ANSWER && typingType !== ''
                     ? actions.insertImage
                     : null,
               ]}
               iconMap={{
                  [actions.heading1]: handleHead,
                  [actions.insertImage]: handleImage,
               }}
               onPressAddImage={pickImage}
            />
         }
      </View>
   );
};

export default RichTextEditor;

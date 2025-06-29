import { View, Text, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Wrapper from '@/components/customs/Wrapper';
import Entypo from '@expo/vector-icons/Entypo';
import Button from '../../../components/customs/Button.jsx';
import { useAppProvider } from '@/contexts/AppProvider';
import BottomSheet from '@/components/customs/BottomSheet';
import Overlay from '@/components/customs/Overlay';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list';
import { useAuthContext } from '@/contexts/AuthContext';
import { router, useGlobalSearchParams } from 'expo-router';
import { useQuizProvider } from '@/contexts/QuizProvider';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config.js';
import api from '@/libs/axios';
import QuestionOverview from '@/components/customs/QuestionOverview';
import { ScrollView } from 'react-native';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.jsx';
import { collectionData } from '@/utils/index.js';
import Checkbox from '@/components/customs/Checkbox.jsx';
import CardQuiz from '@/components/customs/CardQuiz.jsx';
import EmailDialog from '@/components/dialogs/EmailDialog.jsx';
import { useClassroomProvider } from '@/contexts/ClassroomProvider.jsx';
import AssignQuizModal from '@/components/modals/AssignQuizModal.jsx';
import RoomWaitingModal from '@/components/modals/RoomWaitingModal.jsx';
import { useRoomProvider } from '@/contexts/RoomProvider.jsx';
import Toast from 'react-native-toast-message-custom';
import { useAuthStore } from '@/store/useAuthStore.js';
import Loading from '@/components/customs/Loading.jsx';

const detailquizz = () => {
  const { i18n } = useAppProvider();

  const { isEdited, setIsEdited, needUpdate, setNeedUpdate } = useQuizProvider();

  // biến cho dialog email
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  // tạo biến để lưu quiz vào bộ sưu tập
  const [addNameToCollection, setAddNameToCollection] = useState('');

  // biến để chọn các collection trong bottomsheet
  const [selectedCollection, setSelectedCollection] = useState('');
  // lưu tất cả các collections
  const [collections, setCollections] = useState([]);

  // dialog xác nhận để xóa
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Lấy dữ liệu name, description, thumb đưa vào ô thông tin
  const { addQuizToClassroom } = useClassroomProvider();
  const { createRoom } = useRoomProvider();
  const { deleteQuiz, questionFetching, setQuestionFetching, removeQuizShared } = useQuizProvider();

  const { id, user_id } = useGlobalSearchParams();
  const { user } = useAuthStore();
  const [quizId, setQuizId] = useState('');
  // Save init state
  const [quizName, setQuizName] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizStatus, setQuizStatus] = useState('');
  const [quizSubjects, setQuizSubjects] = useState([]);
  const [quizThumbnail, setQuizThumbnail] = useState('');
  const [quizTurn, setQuizTurn] = useState('');
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState([]);
  const [quiz_user, setQuizUser] = useState(null);

  //selectlist
  const [roomWatingModal, setShowRoomWaitingModal] = useState(false);

  // bottom sheet
  const {
    showBottomSheetMoreOptions,
    setShowBottomSheetMoreOptions,
    showBottomSheetSaveToLibrary,
    setShowBottomSheetSaveToLibrary,
    openBottomSheetSaveToLibrary,
    closeBottomSheet,
  } = useAppProvider();

  const [showAssignModal, setShowAssignModal] = useState(false);

  const handleAssignQuiz = async (items) => {
    await addQuizToClassroom(
      items.assignmentName,
      items.selectedClass,
      quizId,
      items.startDate,
      items.deadline,
    );
  };

  const handleCreateRoom = async (items) => {
    await createRoom(items.roomCode, quizId, user.user_id, items.userMax, items.description);
  };

  // Lấy thông tin của quiz hiện tại - UPDATED TO V2
  const fetchQuiz = async () => {
    console.log('🚀 DETAIL_QUIZ - Starting fetchQuiz...');
    console.log('🚀 DETAIL_QUIZ - Current user before API call:', user);
    setIsEdited(false);
    try {
      // V2 API - RESTful GET
      const response = await api.get(`${API_VERSION.V2}${END_POINTS.V2.QUIZ_DETAIL}/${id}`);
      const data = response.data;

      if (data.message === 'Get quiz successfully') {
        const quizData = data.metadata;

        console.log('🚀 DETAIL_QUIZ - Raw quiz data:', quizData);

        // Debug logs
        console.log('🔍 DETAIL_QUIZ - Current user from store:', user);
        console.log('🔍 DETAIL_QUIZ - Quiz user_id from API:', quizData.user_id);
        console.log('🔍 DETAIL_QUIZ - Quiz user_id type:', typeof quizData.user_id);
        // V2 API now returns user_id as ObjectId string, not populated object
        const quizUserId = quizData.user_id?.toString();
        const currentUserId = user?.user_id?.toString();

        console.log('🔍 DETAIL_QUIZ - Quiz owner ID:', quizUserId);
        console.log('🔍 DETAIL_QUIZ - Current user ID:', currentUserId);
        console.log('🔍 DETAIL_QUIZ - Are they equal?', quizUserId === currentUserId);
        console.log('🔍 DETAIL_QUIZ - About to set quiz_user to:', quizUserId);

        setQuizId(quizData._id);
        setQuizThumbnail(quizData.quiz_thumb);
        setQuizName(quizData.quiz_name);
        setQuizDescription(quizData.quiz_description);
        setQuizStatus(quizData.quiz_status);
        setQuizSubjects(quizData.subject_ids);
        setQuizTurn(quizData.quiz_turn);
        setQuizUser(quizUserId); // Set quiz_user with the correct value

        const users = quizData.shared_user_ids || [];

        if (quizUserId === currentUserId) {
          console.log('✅ DETAIL_QUIZ - User is OWNER');
          setIsEdited(true);
        } else {
          console.log('⚠️ DETAIL_QUIZ - User is NOT owner, checking shared users...');
          console.log('🔍 DETAIL_QUIZ - Shared users:', users);

          const check = users.some((sharedUser) => {
            const sharedUserId = sharedUser.user_id?.toString();
            console.log(
              '🔍 DETAIL_QUIZ - Checking shared user:',
              sharedUserId,
              'isEdit:',
              sharedUser.isEdit,
            );
            return sharedUserId === currentUserId && sharedUser.isEdit;
          });

          console.log('🔍 DETAIL_QUIZ - Has edit permission?', check);
          setIsEdited(check);
        }
      }
    } catch (error) {
      console.error('Error fetching quiz with V2:', error);
      // Fallback to V1 if V2 fails
      const body = { quiz_id: id };
      const response = await api.post(`${API_VERSION.V1}${END_POINTS.QUIZ_DETAIL}`, body);
      const data = response.data;
      if (data.statusCode === 200) {
        // Debug logs for V1
        console.log('🔍 DETAIL_QUIZ V1 - Current user from store:', user);
        console.log('🔍 DETAIL_QUIZ V1 - Quiz user_id from API:', data.metadata.user_id);
        console.log('🔍 DETAIL_QUIZ V1 - Quiz user_id type:', typeof data.metadata.user_id);
        console.log('🔍 DETAIL_QUIZ V1 - Current user.user_id:', user?.user_id);
        console.log('🔍 DETAIL_QUIZ V1 - Current user.user_id type:', typeof user?.user_id);
        console.log('🔍 DETAIL_QUIZ V1 - Are they equal?', data.metadata.user_id === user?.user_id);

        setQuizId(data.metadata._id);
        setQuizThumbnail(data.metadata.quiz_thumb);
        setQuizName(data.metadata.quiz_name);
        setQuizDescription(data.metadata.quiz_description);
        setQuizStatus(data.metadata.quiz_status);
        setQuizSubjects(data.metadata.subject_ids);
        setQuizTurn(data.metadata.quiz_turn);
        setQuizUser(data.metadata.user_id);
        const users = data.metadata.shared_user_ids;

        // Check ownership V1 - handle both string and ObjectId
        const quizUserIdV1 = data.metadata.user_id?.toString();
        const currentUserIdV1 = user?.user_id?.toString();

        if (quizUserIdV1 === currentUserIdV1) {
          console.log('✅ DETAIL_QUIZ V1 - User is OWNER');
          setIsEdited(true);
        } else {
          console.log('⚠️ DETAIL_QUIZ V1 - User is NOT owner, checking shared users...');
          console.log('🔍 DETAIL_QUIZ V1 - Shared users:', users);
          const check = users.some((us) => us.user_id?.toString() === currentUserIdV1 && us.isEdit);
          console.log('🔍 DETAIL_QUIZ V1 - Has edit permission?', check);
          setIsEdited(check);
        }
      }
    }
  };

  // Lấy danh sách các câu hỏi thuộc quiz hiện tại - UPDATED TO V2
  const fetchQuestions = async () => {
    setQuestionFetching(true);
    try {
      // V2 API - POST approach for getting quiz questions
      const response = await api.post(
        `${API_VERSION.V2}${END_POINTS.V2.QUIZ_QUESTIONS}/${id}/questions`,
        { quiz_id: id },
      );
      const data = response.data;

      if (data.message === 'Get questions by quiz successfully') {
        // Handle V2 response structure
        const questionsData = data.metadata?.items || data.metadata || [];
        setCurrentQuizQuestion(questionsData);
      } else {
        console.log('Unexpected message in detail_quiz:', data.message);
        setCurrentQuizQuestion([]);
      }
    } catch (error) {
      console.error('Error fetching questions with V2:', error);
      // Fallback to V1 if V2 fails
      const body = { quiz_id: id };
      const response = await api.post(`${API_VERSION.V1}${END_POINTS.GET_QUIZ_QUESTIONS}`, body);
      const data = response.data;
      if (data.statusCode === 200) {
        setCurrentQuizQuestion(data.metadata);
      } else {
        setCurrentQuizQuestion([]);
      }
    }
    setQuestionFetching(false);
  };

  //thêm vào bộ sưu tập
  const addQuizToCollection = async (collection_id) => {
    const collection = collections.find((col) => col.key === collection_id);
    console.log(collection);
    if (!collection.quizzes.some((quiz_id) => quiz_id === quizId)) {
      const body = {
        user_id: user.user_id,
        collection_id,
        quiz_id: quizId,
      };
      const response = await api.post(`${API_VERSION.V1}${END_POINTS.COLLECTION_ADD_QUIZ}`, body);
      const data = response.data;
      if (data.statusCode === 200) {
        getAllCollections();
      }
    }
  };

  // xóa quiz ra khỏi bộ sưu tập
  const deleteQuizInCollection = async (collection_id) => {
    const collection = collections.find((col) => col.key === collection_id);
    if (collection.quizzes.some((quiz_id) => quiz_id === quizId)) {
      const body = {
        user_id: user.user_id,
        quiz_id: quizId,
        collection_id: collection_id,
      };
      const response = await api.post(
        `${API_VERSION.V1}${END_POINTS.COLLECTION_REMOVE_QUIZ}`,
        body,
      );
      const data = response.data;
      if (data.statusCode === 200) {
        getAllCollections();
      }
    }
  };

  const getAllCollections = async () => {
    const body = { user_id: user.user_id };
    const response = await api.post(`${API_VERSION.V1}${END_POINTS.COLLECTION_GETALL}`, body);
    const data = response.data;
    console.log(data);
    if (data.statusCode === 200) {
      setCollections(collectionData(data.metadata));
      console.log(collectionData(data.metadata));
    }
  };
  useEffect(() => {
    getAllCollections();
  }, []);

  useEffect(() => {
    if (selectedCollection.length > 0) {
      addQuizToCollection(selectedCollection[0]);
    }
  }, [selectedCollection]);

  useEffect(() => {
    if (id) {
      fetchQuiz();
      fetchQuestions();
      setQuizId(id);
    }
  }, [id]);

  useEffect(() => {
    if (needUpdate) {
      setNeedUpdate(false);
      fetchQuiz();
      fetchQuestions();
    }
  }, [needUpdate]);

  //gọi hàm sao chép lại quiz
  const copyQuiz = async () => {
    const body = { quiz_id: id, user_id: user.user_id };
    const response = await api.post(`${API_VERSION.V1}${END_POINTS.COPY_QUIZ}`, body);
    const data = response.data;
    console.log(data);
    if (data.statusCode === 200) {
      Toast.show({ type: 'success', text1: 'Sao chép Quiz thành công.' });
      router.back('(app)/(home)/library');
    } else {
      Toast.show({ type: 'error', text1: 'Sao chép thất bại!!!' });
    }
  };

  if (!quizId || questionFetching || !quizName || !quizThumbnail) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <EmailDialog
        quiz_id={id}
        onSend={() => {
          console.log('Send email');
        }}
        visible={showEmailDialog}
        onClose={() => setShowEmailDialog(false)}
        onConfirm={() => {
          closeBottomSheet();
          setShowEmailDialog(false);
        }}
        message={'Bạn chắc chắn muốn chia sẻ Quiz này?'}
      />

      <ConfirmDialog
        title={i18n.t('detailQuiz.dialogTitleDelete')}
        visible={showConfirmDialog}
        onCancel={() => setShowConfirmDialog(false)}
        onConfirm={() => {
          console.log('🔍 Delete Debug - quiz_user:', quiz_user);
          console.log('🔍 Delete Debug - user.user_id:', user.user_id);
          console.log('🔍 Delete Debug - Are equal?', quiz_user === user.user_id);

          // Mình là người tạo quiz mới được xóa
          if (quiz_user === user.user_id) {
            console.log('✅ Deleting quiz as owner');
            deleteQuiz(id);
          }
          // Người khác chia sẻ cho mình thì xóa chia sẻ
          else {
            console.log('⚠️ Removing shared quiz');
            removeQuizShared(id);
          }
          setShowConfirmDialog(false);
          closeBottomSheet();
          router.back('(app)/(home)/library');
        }}
        message={i18n.t('detailQuiz.sureDelete')}
      />

      <Overlay
        onPress={closeBottomSheet}
        visible={showBottomSheetMoreOptions || showBottomSheetSaveToLibrary || showEmailDialog}
      ></Overlay>

      {/* BottomSheet lưu vào bộ sưu tập */}
      <BottomSheet visible={showBottomSheetSaveToLibrary} onClose={closeBottomSheet}>
        <View className="m-2">
          <Text className="flex text-center text-[18px] text-gray">
            {i18n.t('detailQuiz.saveToCollection.title')}
          </Text>
          <View className="w-full h-[1px] bg-gray my-2"></View>

          <View className="w-full">
            <View>
              {collections.length > 0 &&
                collections.map((collection) => {
                  return (
                    <View key={collection.key} className="flex-row mb-2">
                      <Checkbox
                        isChecked={collection.quizzes.some((quiz_id) => quiz_id === id)}
                        onToggle={() => {
                          if (collection.quizzes.some((quiz_id) => quiz_id === id)) {
                            deleteQuizInCollection(collection.key);
                          } else {
                            addQuizToCollection(collection.key);
                          }
                        }}
                      />
                      <Text>{collection.value}</Text>
                    </View>
                  );
                })}
            </View>
          </View>
        </View>
      </BottomSheet>

      {/* Bottom Sheet */}

      {/* Bottom Sheet */}
      <BottomSheet visible={showBottomSheetMoreOptions && !user_id} onClose={closeBottomSheet}>
        <Button
          text={i18n.t('detailQuiz.delete')}
          otherStyles={'m-2 flex-row p-4'}
          icon={<MaterialIcons name="delete" size={16} color="white" />}
          onPress={() => {
            setShowConfirmDialog(true);
          }}
        />
        {isEdited && quiz_user === user.user_id && (
          <Button
            text={i18n.t('detailQuiz.shareTest')}
            otherStyles={'m-2 flex-row p-4'}
            icon={<AntDesign name="sharealt" size={16} color="white" />}
            onPress={() => {
              // closeBottomSheet();
              setShowEmailDialog(true);
              setShowBottomSheetMoreOptions(false);
              setShowBottomSheetSaveToLibrary(false);
            }}
          />
        )}
        {isEdited && quiz_user === user.user_id && (
          <Button
            text={i18n.t('detailQuiz.giveHomework')}
            otherStyles={'m-2 flex-row p-4'}
            icon={<Entypo name="home" size={16} color="white" />}
            onPress={() => {
              setShowAssignModal(true);
              closeBottomSheet();
            }}
          />
        )}
        {isEdited && quiz_user === user.user_id && (
          <Button
            text={i18n.t('detailQuiz.saveToCollection.title')}
            otherStyles={'m-2 flex-row p-4'}
            icon={<Entypo name="save" size={16} color="white" />}
            onPress={() => {
              closeBottomSheet();
              openBottomSheetSaveToLibrary();
            }}
          />
        )}

        {/* Debug info */}
        {console.log('🔍 UI Debug - isEdited:', isEdited)}
        {console.log('🔍 UI Debug - quiz_user:', quiz_user)}
        {console.log('🔍 UI Debug - user.user_id:', user.user_id)}
        {console.log('🔍 UI Debug - quiz_user === user.user_id:', quiz_user === user.user_id)}
      </BottomSheet>

      <ScrollView>
        <View className="flex mx-4">
          <View className="w-full rounded-xl mt-4 flex-col">
            <View className="w-full rounded-xl flex-row">
              <CardQuiz
                type="vertical"
                routerPath="(quiz)/overview"
                params={{ id: id }}
                quiz={{
                  quiz_name: quizName,
                  quiz_thumb: quizThumbnail,
                  quiz_description: quizDescription,
                  quiz_status: quizStatus,
                }}
              />
            </View>
          </View>
        </View>

        {quiz_user !== user.user_id && (
          <Button
            text={i18n.t('library.coppyQuiz')}
            otherStyles={'flex-row p-4 w-[50%] justify-center ml-4'}
            icon={<MaterialIcons name="file-copy" size={16} color="white" />}
            onPress={() => {
              copyQuiz();
            }}
          />
        )}

        {/* Debug copy button condition */}
        {console.log('🔍 Copy Button Debug - Show copy button?', quiz_user !== user.user_id)}

        <View>
          <Text className="text-gray text-right p-4">
            {quizTurn} {i18n.t('detailQuiz.peopleJoined')}
          </Text>
        </View>

        <View className="flex m-4 ">
          {/* Quiz Questions */}
          {questionFetching ? (
            <Text>Loading</Text>
          ) : (
            <View className="mt-2 ">
              {currentQuizQuestion.length > 0 &&
                currentQuizQuestion.map((question, index) => {
                  return <QuestionOverview key={index} question={question} index={index} />;
                })}
            </View>
          )}
        </View>
      </ScrollView>

      <View className="w-full h-[1px] bg-gray"></View>
      <View className="p-2 flex-row justify-between">
        <Button
          text={i18n.t('detailQuiz.createRoom')}
          otherStyles={'p-4 flex-1 ml-2 justify-center'}
          textStyles={'text-center'}
          onPress={() => {
            setShowRoomWaitingModal(true);
            closeBottomSheet();
          }}
        />
      </View>

      <AssignQuizModal
        visible={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssignQuiz}
      />

      <RoomWaitingModal
        visible={roomWatingModal}
        onClose={() => setShowRoomWaitingModal(false)}
        onSubmit={handleCreateRoom}
      />
    </Wrapper>
  );
};

export default detailquizz;

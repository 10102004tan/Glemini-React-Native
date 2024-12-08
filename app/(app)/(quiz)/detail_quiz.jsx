import { View, Text, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Wrapper from "@/components/customs/Wrapper";
import Entypo from "@expo/vector-icons/Entypo";
import Button from "../../../components/customs/Button.jsx";
import { useAppProvider } from "@/contexts/AppProvider";
import BottomSheet from "@/components/customs/BottomSheet";
import Overlay from "@/components/customs/Overlay";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
   MultipleSelectList,
   SelectList,
} from "react-native-dropdown-select-list";
import { useAuthContext } from "@/contexts/AuthContext";
import { router, useGlobalSearchParams } from "expo-router";
import { useQuizProvider } from "@/contexts/QuizProvider";
import { API_URL, API_VERSION, END_POINTS } from "@/configs/api.config.js";
import QuestionOverview from "@/components/customs/QuestionOverview";
import { ScrollView } from "react-native";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.jsx";
import { collectionData } from "@/utils/index.js";
import Checkbox from "@/components/customs/Checkbox.jsx";
import CardQuiz from "@/components/customs/CardQuiz.jsx";
import EmailDialog from "@/components/dialogs/EmailDialog.jsx";
import { useClassroomProvider } from "@/contexts/ClassroomProvider.jsx";
import AssignQuizModal from "@/components/modals/AssignQuizModal.jsx";
import RoomWaitingModal from "@/components/modals/RoomWaitingModal.jsx";
import { useRoomProvider } from "@/contexts/RoomProvider.jsx";
import Toast from "react-native-toast-message-custom";

const detailquizz = () => {

   const { i18n } = useAppProvider();

   const { isEdited, setIsEdited, needUpdate, setNeedUpdate } = useQuizProvider();

   // biến cho dialog email
   const [showEmailDialog, setShowEmailDialog] = useState(false);
   // tạo biến để lưu quiz vào bộ sưu tập
   const [addNameToCollection, setAddNameToCollection] = useState("");

   // biến để chọn các collection trong bottomsheet
   const [selectedCollection, setSelectedCollection] = useState("");
   // lưu tất cả các collections
   const [collections, setCollections] = useState([]);

   // dialog xác nhận để xóa
   const [showConfirmDialog, setShowConfirmDialog] = useState(false);

   // Lấy dữ liệu name, description, thumb đưa vào ô thông tin
   const { addQuizToClassroom } = useClassroomProvider();
   const { createRoom } = useRoomProvider();
   const { deleteQuiz, questionFetching, setQuestionFetching, removeQuizShared } =
      useQuizProvider();

   const { id } = useGlobalSearchParams();

   const { userData } = useAuthContext();
   const [quizId, setQuizId] = useState("");
   // Save init state
   const [quizName, setQuizName] = useState("");
   const [quizDescription, setQuizDescription] = useState("");
   const [quizStatus, setQuizStatus] = useState("");
   const [quizSubjects, setQuizSubjects] = useState([]);
   const [quizThumbnail, setQuizThumbnail] = useState("");
   const [quizTurn, setQuizTurn] = useState("");
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
         items.deadline
      );
   };

   const handleCreateRoom = async (items) => {
      await createRoom(
         items.roomCode,
         quizId,
         userData._id,
         items.userMax,
         items.description
      );
   };


   // Lấy thông tin của quiz hiện tại
   const fetchQuiz = async () => {
      setIsEdited(false);
      const response = await fetch(
         `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_DETAIL}`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "x-client-id": userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({ quiz_id: id }),
         }
      );

      const data = await response.json();
      if (data.statusCode === 200) {
         setQuizId(data.metadata._id);
         setQuizThumbnail(data.metadata.quiz_thumb);
         setQuizName(data.metadata.quiz_name);
         setQuizDescription(data.metadata.quiz_description);
         setQuizStatus(data.metadata.quiz_status);
         setQuizSubjects(data.metadata.subject_ids);
         setQuizTurn(data.metadata.quiz_turn);
         setQuizUser(data.metadata.user_id);

         const users = data.metadata.shared_user_ids;

         if (data.metadata.user_id === userData._id) {
            setIsEdited(true);
         } else {
            const check = users.some(
               (user) => user.user_id === userData._id && user.isEdit
            );
            setIsEdited(check);
         }
      }
   };

   // Lấy danh sách các câu hỏi thuộc quiz hiện tại
   const fetchQuestions = async () => {
      setQuestionFetching(true);
      const response = await fetch(
         `${API_URL}${API_VERSION.V1}${END_POINTS.GET_QUIZ_QUESTIONS}`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "x-client-id": userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({ quiz_id: id }),
         }
      );
      const data = await response.json();
      // console.log(data.metadata);
      if (data.statusCode === 200) {
         setCurrentQuizQuestion(data.metadata);
      } else {
         setCurrentQuizQuestion([]);
      }
      setQuestionFetching(false);
   };

   //thêm vào bộ sưu tập
   const addQuizToCollection = async (collection_id) => {
      const collection = collections.find((col) => col.key === collection_id);
      console.log(collection);

      // Kiểm tra xem quiz đã tồn tại trong collection chưa
      if (!collection.quizzes.some((quiz_id) => quiz_id === quizId)) {
         const response = await fetch(
            `${API_URL}${API_VERSION.V1}${END_POINTS.COLLECTION_ADD_QUIZ}`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  "x-client-id": userData._id,
                  authorization: userData.accessToken,
               },
               body: JSON.stringify({
                  user_id: userData._id,
                  collection_id,
                  quiz_id: quizId,
               }),
            }
         );
         const data = await response.json();
         if (data.statusCode === 200) {
            getAllCollections(); // Cập nhật lại danh sách collections sau khi thêm
         }
      }
   };

   // xóa quiz ra khỏi bộ sưu tập
   const deleteQuizInCollection = async (collection_id) => {
      const collection = collections.find((col) => col.key === collection_id);

      // Kiểm tra xem quiz có trong collection không
      if (collection.quizzes.some((quiz_id) => quiz_id === quizId)) {
         const response = await fetch(
            `${API_URL}${API_VERSION.V1}${END_POINTS.COLLECTION_REMOVE_QUIZ}`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  "x-client-id": userData._id,
                  authorization: userData.accessToken,
               },
               body: JSON.stringify({
                  user_id: userData._id,
                  quiz_id: quizId,
                  collection_id: collection_id,
               }),
            }
         );
         const data = await response.json();
         if (data.statusCode === 200) {
            getAllCollections(); // Cập nhật lại danh sách collections sau khi xóa
         }
      }
   };

   const getAllCollections = async () => {
      const response = await fetch(
         `${API_URL}${API_VERSION.V1}${END_POINTS.COLLECTION_GETALL}`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "x-client-id": userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({
               user_id: userData._id,
            }),
         }
      );
      const data = await response.json();
      console.log(data);
      if (data.statusCode === 200) {
         setCollections(collectionData(data.metadata));
         console.log(collectionData(data.metadata));
      }
   };
   useEffect(() => {
      // console.log("COLLECTIONS")
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
         // console.log("LOOOP")
         setNeedUpdate(false);
         fetchQuiz();
         fetchQuestions();
      }
   }, [needUpdate])




   //gọi hàm sao chép lại quiz
   const copyQuiz = async () => {
      const response = await fetch(
         `${API_URL}${API_VERSION.V1}${END_POINTS.COPY_QUIZ}`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "x-client-id": userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({ quiz_id: id, user_id: userData._id }),
         }
      );
      const data = await response.json();
      console.log(data);
      if (data.statusCode === 200) {
         Toast.show({ type: "success", text1: "Sao chép Quiz thành công." });
         router.back("(app)/(home)/library");
      } else {
         Toast.show({ type: "error", text1: "Sao chép thất bại!!!" });
      }
   };


   if (!quizId || questionFetching) {
      return (
         <View className="h-[100%] bg-white items-center justify-center">
            <ActivityIndicator
               style={{ color: '#000' }}
            />
         </View>
      )
   }

   return (
      <Wrapper>
         <EmailDialog
            quiz_id={id}
            onSend={() => {
               console.log("Send email");
            }}
            visible={showEmailDialog}
            onClose={() => setShowEmailDialog(false)}
            onConfirm={() => {
               closeBottomSheet();
               setShowEmailDialog(false);
            }}
            message={"Bạn chắc chắn muốn chia sẻ Quiz này?"}
         />

         <ConfirmDialog
            title={i18n.t("detailQuiz.dialogTitleDelete")}
            visible={showConfirmDialog}
            onCancel={() => setShowConfirmDialog(false)}
            onConfirm={() => {
               // Mình là người tạo quiz mới được xóa
               if (quiz_user === userData._id) {
                  deleteQuiz(id);
               }
               // Người khác chia sẻ cho mình thì xóa chia sẻ
               else {
                  removeQuizShared(id);
               }
               setShowConfirmDialog(false);
               closeBottomSheet();
               router.back("(app)/(home)/library");
            }}
            message={i18n.t("detailQuiz.sureDelete")}
         />

         <Overlay
            onPress={closeBottomSheet}
            visible={
               showBottomSheetMoreOptions ||
               showBottomSheetSaveToLibrary ||
               showEmailDialog
            }
         ></Overlay>

         {/* BottomSheet lưu vào bộ sưu tập */}
         <BottomSheet
            visible={showBottomSheetSaveToLibrary}
            onClose={closeBottomSheet}
         >
            <View className="m-2">
               <Text className="flex text-center text-[18px] text-gray">
                  {i18n.t("detailQuiz.saveToCollection.title")}
               </Text>
               <View className="w-full h-[1px] bg-gray my-2"></View>

               <View className="w-full">
                  <View>
                     {collections.length > 0 &&
                        collections.map((collection) => {
                           return (
                              <View key={collection.key} className="flex-row mb-2">
                                 <Checkbox
                                    isChecked={collection.quizzes.some(
                                       (quiz_id) => quiz_id === id
                                    )}
                                    onToggle={() => {
                                       if (
                                          collection.quizzes.some(
                                             (quiz_id) => quiz_id === id
                                          )
                                       ) {
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
         <BottomSheet
            visible={showBottomSheetMoreOptions}
            onClose={closeBottomSheet}
         >
            <Button
               text={i18n.t("detailQuiz.delete")}
               otherStyles={"m-2 flex-row p-4"}
               icon={<MaterialIcons name="delete" size={16} color="white" />}
               onPress={() => {
                  setShowConfirmDialog(true);
               }}
            />
            {isEdited && quiz_user === userData._id && (
               <Button
                  text={i18n.t("detailQuiz.shareTest")}
                  otherStyles={"m-2 flex-row p-4"}
                  icon={<AntDesign name="sharealt" size={16} color="white" />}
                  onPress={() => {
                     // closeBottomSheet();
                     setShowEmailDialog(true);
                     setShowBottomSheetMoreOptions(false);
                     setShowBottomSheetSaveToLibrary(false);
                  }}
               />
            )}
            {isEdited && quiz_user === userData._id && (
               <Button
                  text={i18n.t("detailQuiz.giveHomework")}
                  otherStyles={"m-2 flex-row p-4"}
                  icon={<Entypo name="home" size={16} color="white" />}
                  onPress={() => {
                     setShowAssignModal(true);
                     closeBottomSheet();
                  }}
               />
            )}
            {isEdited && quiz_user === userData._id && (
               <Button
                  text={i18n.t("detailQuiz.saveToCollection.title")}
                  otherStyles={"m-2 flex-row p-4"}
                  icon={<Entypo name="save" size={16} color="white" />}
                  onPress={() => {
                     closeBottomSheet();
                     openBottomSheetSaveToLibrary();
                  }}
               />
            )}
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

            {quiz_user !== userData._id && (
               <Button
                  text={i18n.t("library.coppyQuiz")}
                  otherStyles={"flex-row p-4 w-[50%] justify-center ml-4"}
                  icon={<MaterialIcons name="file-copy" size={16} color="white" />}
                  onPress={() => {
                     copyQuiz();
                  }}
               />
            )}

            <View>
               <Text className="text-gray text-right p-4">
                  {quizTurn} {i18n.t("detailQuiz.peopleJoined")}
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
                           return (
                              <QuestionOverview
                                 key={index}
                                 question={question}
                                 index={index}
                              />
                           );
                        })}
                  </View>
               )}
            </View>
         </ScrollView>

         <View className="w-full h-[1px] bg-gray"></View>
         <View className="p-2 flex-row justify-between">
            <Button
               text={"Thi thử"}
               otherStyles={"p-4 w-1/2 justify-center"}
               textStyles={"text-center"}
            />
            <Button
               text={"Tạo phòng"}
               otherStyles={"p-4 flex-1 ml-2 justify-center"}
               textStyles={"text-center"}
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

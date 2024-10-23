import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Wrapper from "@/components/customs/Wrapper";
import Entypo from "@expo/vector-icons/Entypo";
import Button from "../../../components/customs/Button.jsx";
import AppProvider, { useAppProvider } from "@/contexts/AppProvider";
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
import { Ionicons } from "@expo/vector-icons";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.jsx";
import { collectionData } from "@/utils/index.js";
import Checkbox from "@/components/customs/Checkbox.jsx";

const detailquizz = () => {
  // tạo biến để lưu quiz vào bộ sưu tập
  const [addNameToCollection, setAddNameToCollection] = useState("");

  // biến để chọn các collection trong bottomsheet
  const [selectedCollection, setSelectedCollection] = useState("");
  // lưu tất cả các collections
  const [collections, setCollections] = useState([]);

  // dialog xác nhận để xóa
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // checkbox của tên bộ sưu tập
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxToggle = () => {
    setIsChecked(!isChecked);
  };

  // Lấy dữ liệu name, description, thumb đưa vào ô thông tin
  const { quizzes, setQuizzes } = useQuizProvider();
  const { deleteQuiz, questionFetching, setQuestionFetching } =
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

  //selectlist
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  // bottom sheet
  const {
    showBottomSheetMoreOptions,
    showBottomSheetSaveToLibrary,
    openBottomSheetSaveToLibrary,
    closeBottomSheet,
  } = useAppProvider();

  // Lấy thông tin của quiz hiện tại
  const fetchQuiz = async () => {
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
    // console.log(data.metadata);
    if (data.statusCode === 200) {
      // Save init state
      setQuizId(data.metadata._id);
      setQuizThumbnail(data.metadata.quiz_thumb);
      setQuizName(data.metadata.quiz_name);
      setQuizDescription(data.metadata.quiz_description);
      setQuizStatus(data.metadata.quiz_status);
      setQuizSubjects(data.metadata.subject_ids);
      setQuizTurn(data.metadata.quiz_turn);
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
    console.log(data);
    if (data.statusCode === 200) {
      setSelectedCollection([]);
    }
  };

  // xóa quiz ra khỏi bộ sưu tập
  const deleteQuizInCollection = async (quiz_id) => {
    console.log("Deleting quiz with ID:", quiz_id);
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
          quiz_id,
          collection_id: id,
        }),
      }
    );
    const data = await response.json();
    if (data.statusCode === 200) {
      // Cập nhật danh sách quiz sau khi xóa thành công
      setQuizzes((prev) => prev.filter((quiz) => quiz._id !== quiz_id));
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
    }
  }, [id]);

  //Dropdown
  const nameSchool = [
    { key: 1, value: "trường Cao Đẳng Công Nghệ Thủ Đức" },
    { key: 2, value: "trường Cao Đẳng Cao Thắng" },
    { key: 3, value: "trường Cao Đẳng Công Nghệ TPHCM" },
    { key: 4, value: "trường Cao Đẳng FPT" },
    { key: 5, value: "trường Cao Đẳng Công Thương" },
    { key: 6, value: "trường Cao Đẳng Du Lịch" },
  ];

  const nameClass = [
    { key: 1, value: "CD15TT05" },
    { key: 2, value: "CD16TT12" },
    { key: 3, value: "CD17TT14" },
    { key: 4, value: "CD18TT02" },
    { key: 5, value: "CD19TT15" },
    { key: 6, value: "CD20TT09" },
    { key: 7, value: "CD21TT01" },
    { key: 8, value: "CD22TT11" },
  ];

  return (
    <Wrapper>
      <ConfirmDialog
        title={"Chờ đã"}
        visible={showConfirmDialog}
        onCancel={() => setShowConfirmDialog(false)}
        onConfirm={() => {
          deleteQuiz(id);
          setShowConfirmDialog(false);
          closeBottomSheet();
          router.back("(app)/(home)/library");
        }}
        message={"Bạn chắc chắn muốn xóa bộ câu hỏi này?"}
      />

      {/* Overlay */}

      <Overlay
        onPress={closeBottomSheet}
        visible={showBottomSheetMoreOptions || showBottomSheetSaveToLibrary}
      ></Overlay>

      {/* Bottom Sheet */}
      <BottomSheet
        visible={showBottomSheetMoreOptions}
        onClose={closeBottomSheet}
      >
        <Button
          text={"Chỉnh sửa"}
          otherStyles={"m-2 flex-row"}
          icon={<Entypo name="edit" size={16} color="white" />}
        ></Button>
        <Button
          text={"Xóa"}
          otherStyles={"m-2 flex-row"}
          icon={<MaterialIcons name="delete" size={16} color="white" />}
          onPress={() => {
            setShowConfirmDialog(true);
          }}
        ></Button>
        <Button
          text={"Chia sẻ bài kiểm tra"}
          otherStyles={"m-2 flex-row"}
          icon={<AntDesign name="sharealt" size={16} color="white" />}
        ></Button>
        <Button
          text={"Lưu vào bộ sưu tập"}
          otherStyles={"m-2 flex-row"}
          icon={<Entypo name="save" size={16} color="white" />}
          onPress={openBottomSheetSaveToLibrary}
        ></Button>
      </BottomSheet>

      {/* BottomSheet lưu vào bộ sưu tập */}
      <BottomSheet
        visible={showBottomSheetSaveToLibrary}
        onClose={closeBottomSheet}
      >
        <View className="m-2">
          <Text className="flex text-center text-[18px] text-gray">
            Lưu vào bộ sưu tập
          </Text>
          <View className="w-full h-[1px] bg-gray my-2"></View>

          {/* Tiếng Nhật với checkbox */}
          <View className="w-full">
            <MultipleSelectList
              setSelected={(val) => setSelectedCollection(val)}
              data={collections}
              save="key"
            />
          </View>
        </View>
      </BottomSheet>
      <View className="flex m-2 ">
        <View className="h-[100px] w-full border rounded-xl mt-4 flex-col">
          <View className="h-[100px] w-full rounded-xl flex-row mb-3">
            <TouchableOpacity
              onPress={() => {
                router.replace({
                  pathname: "/(app)/(quiz)/overview",
                  params: { id: quizId },
                });
              }}
            >
              <View className="flex flex-row m-2">
                <View className="flex justify-center items-center">
                  <Image
                    source={{
                      uri:
                        quizThumbnail ||
                        "https://www.shutterstock.com/image-vector/quiz-time-3d-editable-text-260nw-2482374583.jpg",
                    }}
                    className="w-[80px] h-[80px] rounded-xl"
                  ></Image>
                </View>
                <View className="flex flex-col ml-4 justify-around">
                  <Text className="text-lg font-bold">{quizName}</Text>
                  <Text className="text-gray-500">{quizDescription}</Text>
                  <Text className="text-gray-500">
                    {quizStatus === "unpublished" ? "Riêng tư" : "Công khai"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="w-full h-[1px] bg-gray"></View>

      <View>
        <Text className="text-gray mt-8 text-right right-4">
          {quizTurn} người đã tham gia
        </Text>
      </View>

      <ScrollView>
        <View className="flex m-4 ">
          {/* Quiz Questions */}
          {questionFetching ? (
            <Text>Loading</Text>
          ) : (
            <View className="mt-2 p-4">
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
      <View className="p-2 flex justify-center">
        <Button
          text={"Bắt đầu Quiz"}
          otherStyles={"p-4"}
          textStyles={"text-center"}
        ></Button>
      </View>
    </Wrapper>
  );
};

export default detailquizz;

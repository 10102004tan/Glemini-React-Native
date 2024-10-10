import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Wrapper from "@/components/customs/Wrapper";
import Entypo from "@expo/vector-icons/Entypo";
import Button from "../../../components/customs/Button.jsx";
import { useAppProvider } from "@/contexts/AppProvider";
import BottomSheet from "@/components/customs/BottomSheet";
import Overlay from "@/components/customs/Overlay";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SelectList } from "react-native-dropdown-select-list";
import { AuthContext, useAuthContext } from "@/contexts/AuthContext";
import { useGlobalSearchParams } from "expo-router";
import { useQuizProvider } from "@/contexts/QuizProvider";
import { API_URL, API_VERSION, END_POINTS } from "@/configs/api.config";
import QuestionOverview from "@/components/customs/QuestionOverview";
import { ScrollView } from "react-native-gesture-handler";

const detailquizz = () => {
  const { detail_quiz } = useGlobalSearchParams();
  const { userData } = useAuthContext();
  const {
    selectedQuiz,
    setSelectedQuiz,
    currentQuizQuestion,
    setCurrentQuizQuestion,
    quizFetching,
    questionFetching,
  } = useQuizProvider();

  const [quizInfo, setQuizInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isHiddenNavigationBar, setIsHiddenNavigationBar } = useAppProvider();
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [visibleEditBottomSheet, setVisibleEditBottomSheet] = useState(false);

  //selectlist
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const fetchQuiz = async () => {
    console.log("detail quizz id: " + detail_quiz);
    const response = await fetch(
      `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_DETAIL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": userData._id,
          authorization: userData.accessToken,
        },
        body: JSON.stringify({ quiz_id: detail_quiz }),
      }
    );

    const data = await response.json();
    //  console.log(data);
    //  console.log(detail_quiz);
    if (data.statusCode === 200) {
      setSelectedQuiz(data.metadata);
    }
  };

  useEffect(() => {
    // Lấy dữ liệu của quiz hiện tại
    if (userData && detail_quiz) {
      fetchQuiz();
    }
  }, [detail_quiz, userData]);

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

  // BottomSheet
  const OpenBottomSheet = () => {
    setIsHiddenNavigationBar(true);
    setVisibleBottomSheet(true);
  };
  const openEditBottomSheet = () => {
    setVisibleEditBottomSheet(true);
    setIsHiddenNavigationBar(true);
  };

  const handleCloseBottomSheet = () => {
    setIsHiddenNavigationBar(false);
    setVisibleBottomSheet(false);
    setVisibleEditBottomSheet(false);
  };

  return (
    <Wrapper>
      {/* Overlay */}
      {visibleBottomSheet && <Overlay onPress={handleCloseBottomSheet} />}

      {/* Bottom Sheet */}
      <BottomSheet visible={visibleBottomSheet}>
        <Button
          text={"Chỉnh sửa"}
          otherStyles={"m-2 flex-row"}
          icon={<Entypo name="edit" size={16} color="white" />}
        ></Button>
        <Button
          text={"Xóa"}
          otherStyles={"m-2 flex-row"}
          icon={<MaterialIcons name="delete" size={16} color="white" />}
        ></Button>
        <Button
          text={"Chia sẻ bài kiểm tra"}
          otherStyles={"m-2 flex-row"}
          icon={<AntDesign name="sharealt" size={16} color="white" />}
          onPress={openEditBottomSheet}
        ></Button>
        <Button
          text={"Lưu vào bộ sưu tập"}
          otherStyles={"m-2 flex-row"}
          icon={<Entypo name="save" size={16} color="white" />}
        ></Button>
      </BottomSheet>

      {/* Edit Bottom Sheet */}
      <BottomSheet visible={visibleEditBottomSheet}>
        {/* Selected của trường */}
        <View className="mb-4">
          <Text className="text-lg font-semibold m-2">Chọn trường</Text>
          <SelectList
            setSelected={(val) => setSelectedSchool(val)}
            data={nameSchool}
            save="value"
          />
        </View>

        {/* Selected của lớp */}
        <View className="mb-4">
          <Text className="text-lg font-semibold m-2">Chọn lớp</Text>
          <SelectList
            setSelected={(val) => setSelectedClass(val)}
            data={nameClass}
            save="value"
          />
        </View>

        {/* Button Hủy và Chọn */}
        <View className="flex flex-row justify-between">
          <Button text="Hủy" otherStyles="w-[45%] bg-gray-200 p-2 rounded-xl" />
          <Button
            text="Chọn"
            otherStyles="w-[50%] bg-blue-500 p-2 rounded-xl"
            textStyles="text-white"
          />
        </View>
      </BottomSheet>

      <View className="flex m-2 ">
        <View className="flex-row justify-between">
          {/* nút quay lại */}
          <TouchableOpacity>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>

          {/* nút 3 chấm */}
          <TouchableOpacity onPress={OpenBottomSheet}>
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View className="h-[100px] w-full border rounded-xl mt-4 flex-row">
          {/* <View className="flex justify-center items-center ml-2">
            <Image></Image>
          </View> */}
          <View className="flex-col">
            <Text className="ml-4 mt-2">{selectedQuiz.quiz_name}</Text>
            <Text className="ml-4 mt-2">{selectedQuiz.quiz_description}</Text>
            <Text className="ml-4 mt-2">{selectedQuiz.quiz_status}</Text>
          </View>
        </View>
      </View>

      <View className="w-full h-[1px] bg-gray"></View>

      <View>
        <Text className="text-gray mt-8 text-right right-4">
          100 người đã tham gia
        </Text>
      </View>

      <View className="flex-1 m-4 ">
        <ScrollView>
          {/* Quiz Questions */}
          {questionFetching ? (
            <Text>Loading</Text>
          ) : (
            <View className="p-4">
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
        </ScrollView>
      </View>
      <View className="w-full h-[1px] bg-gray"></View>
      <View className="p-2">
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

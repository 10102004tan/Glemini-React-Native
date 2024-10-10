import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
import React, { useEffect, useState } from "react";
import Wrapper from "@/components/customs/Wrapper";
import { AntDesign } from "@expo/vector-icons";
import Button from "@/components/customs/Button";
import { useAppProvider } from "@/contexts/AppProvider";
import BottomSheet from "@/components/customs/BottomSheet";
import Overlay from "@/components/customs/Overlay";
import { useQuizProvider } from "@/contexts/QuizProvider";
import { useGlobalSearchParams } from "expo-router";
import { useAuthContext } from "@/contexts/AuthContext";
import { API_URL, API_VERSION, END_POINTS } from "@/configs/api.config";

const Library = () => {
  const { isHiddenNavigationBar, setIsHiddenNavigationBar } = useAppProvider();
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState(""); // Tên bộ sưu tập
  const [newCollectionDescription, setNewCollectionDescription] = useState(""); // Mô tả bộ sưu tập
  const [activeTab, setActiveTab] = useState("library"); // Quản lý tab hiện tại: 'library' hoặc 'collection'
  const [translateValue] = useState(new Animated.Value(0)); // Quản lý giá trị di chuyển dòng bôi đen

  // Lấy dữ liệu name, description, thumb đưa vào ô thông tin
  const { lib } = useGlobalSearchParams();
  const { userData } = useAuthContext();
  const { selectedQuiz, setSelectedQuiz } = useQuizProvider();

  // lấy list thông tin của quiz
  const { quizzes } = useQuizProvider();

  // BottomSheet
  const OpenBottomSheet = () => {
    setIsHiddenNavigationBar(true);
    setVisibleBottomSheet(true);
  };

  const handleCloseBottomSheet = () => {
    setIsHiddenNavigationBar(false);
    setVisibleBottomSheet(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    // Di chuyển dòng bôi đen dựa trên tab
    Animated.timing(translateValue, {
      toValue: tab === "library" ? 0 : 200, // Giá trị tương ứng với vị trí của từng tab
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // fetch api
  const fetchQuiz = async () => {
    // console.log("library id: " + library);
    const response = await fetch(
      `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_DETAIL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": userData._id,
          authorization: userData.accessToken,
        },
        body: JSON.stringify({ quiz_id: lib }),
      }
    );

    const data = await response.json();
    // console.log(data);
    // console.log(lib);
    if (data.statusCode === 200) {
      setSelectedQuiz(data.metadata);
    } else {
      console.error("Lỗi khi fetch dữ liệu quiz:", data.message);
    }
  };

  useEffect(() => {
    // Lấy dữ liệu của quiz hiện tại
    if (userData && lib) {
      fetchQuiz();
    }
  }, [lib, userData]);

  return (
    <Wrapper>
      {/* Overlay */}
      {visibleBottomSheet && <Overlay onPress={handleCloseBottomSheet} />}

      {/* Bottom Sheet */}
      <BottomSheet visible={visibleBottomSheet}>
        <View className="m-3">
          <Text className="text-gray mb-2">Tên bộ sưu tập</Text>
          <TextInput
            value={newCollectionName}
            onChangeText={setNewCollectionName}
            placeholder="Nhập tên bộ sưu tập"
            className="border border-gray w-[350px] h-[50px] rounded-xl px-4"
          />
        </View>
        <View className="m-3">
          <Text className="text-gray mb-2">Mô tả</Text>
          <TextInput
            value={newCollectionDescription}
            onChangeText={setNewCollectionDescription}
            placeholder="Nhập mô tả"
            className="border border-gray w-[350px] h-[50px] rounded-xl px-4"
          />
        </View>

        {/* Button Hủy và Chọn */}
        <View className="flex flex-row justify-between m-3">
          <Button
            text="Hủy"
            otherStyles="w-[45%] bg-gray-200 p-2 rounded-xl flex justify-center"
            onPress={handleCloseBottomSheet}
          />
          <Button
            text="Chọn"
            otherStyles="w-[50%] bg-blue-500 p-2 rounded-xl flex justify-center"
            textStyles="text-white text-center"
            onPress={() => {
              console.log("Tên bộ sưu tập:", newCollectionName);
              console.log("Mô tả:", newCollectionDescription);
              // Thêm logic để lưu bộ sưu tập mới
              handleCloseBottomSheet(); // Đóng BottomSheet sau khi lưu
            }}
          />
        </View>
      </BottomSheet>

      <View className="flex-1 mt-[40px]">
        {/* Header */}
        <View className="flex-row justify-between p-4">
          <Text className="font-bold text-[25px]">Thư viện của tôi</Text>
          <View className="border border-gray-300 rounded-xl px-4 w-[120px] flex-row items-center justify-between">
            <AntDesign name="search1" size={18} color="black" />
            <TextInput placeholder="Tìm kiếm" className="ml-2" />
          </View>
        </View>

        {/* Tabs */}
        <View className="flex flex-row justify-around mb-2">
          {/* Tab Thư viện của tôi */}
          <TouchableOpacity onPress={() => handleTabChange("library")}>
            <Text
              className={`font-normal text-[18px] ${
                activeTab === "library"
                  ? "text-black font-bold"
                  : "text-gray-500"
              }`}
            >
              Thư viện của tôi
            </Text>
          </TouchableOpacity>

          {/* Tab Bộ sưu tập */}
          <TouchableOpacity onPress={() => handleTabChange("collection")}>
            <Text
              className={`font-normal text-[18px] ${
                activeTab === "collection"
                  ? "text-black font-bold"
                  : "text-gray-500"
              }`}
            >
              Bộ sưu tập
            </Text>
          </TouchableOpacity>
        </View>

        {/* Đường phân cách dưới tab */}
        <View>
          <Animated.View
            style={{
              transform: [{ translateX: translateValue }],
              width: "50%",
              height: 2,
              backgroundColor: "black",
            }}
          />
          <View className="bg-gray h-[1px]"></View>
        </View>

        {/* Nội dung dựa trên tab được chọn */}
        {activeTab === "library" ? (
          <View className="p-3">
            {/* Nội dung của Thư viện của tôi */}
            <Button
              onPress={OpenBottomSheet}
              text={"Tạo mới"}
              otherStyles={"w-1/4 justify-center mb-12"}
              textStyles={"text-center text-white"}
            />

            <View className="h-[100px] w-[350px] border rounded-xl flex-row mb-3">
              <View className="flex-col p-4">
                {selectedQuiz ? (
                  <>
                    {/* <Image
                      source={{ uri: selectedQuiz.thumb }}
                      style={{ width: 100, height: 100 }}
                    /> */}
                    <Text className="text-lg font-bold">
                      {selectedQuiz.quiz_name}
                    </Text>
                    <Text className="text-gray-500">
                      {selectedQuiz.description}
                    </Text>
                  </>
                ) : (
                  <Text>Không có dữ liệu</Text>
                )}
              </View>
            </View>
          </View>
        ) : (
          <View className="p-3">
            {/* Danh sách các bộ sưu tập */}
            <Button
              onPress={OpenBottomSheet}
              text={"Tạo bộ sưu tập mới"}
              otherStyles={"w-1/2 justify-center mb-4"}
              textStyles={"text-center text-white"}
            />

            {quizzes.length > 0 &&
              quizzes.map((quiz) => (
                <TouchableOpacity
                  key={quiz._id}
                  onPress={() => {
                    router.push({
                      pathname: "",
                      params: { id: quiz._id },
                    });
                  }}
                >
                  <View className="flex flex-row items-center justify-between m-4">
                    <Text>{quiz.quiz_name}</Text>
                    <TouchableOpacity>
                      <AntDesign name="right" size={18} color="black" />
                    </TouchableOpacity>
                  </View>
                  <View className="h-[1px] w-full bg-gray"></View>
                </TouchableOpacity>
              ))}
          </View>
        )}
      </View>
    </Wrapper>
  );
};

export default Library;

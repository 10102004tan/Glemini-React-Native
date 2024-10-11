import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import Wrapper from "@/components/customs/Wrapper";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Button from "@/components/customs/Button";
import { useAppProvider } from "@/contexts/AppProvider";
import BottomSheet from "@/components/customs/BottomSheet";
import Overlay from "@/components/customs/Overlay";
import { useQuizProvider } from "@/contexts/QuizProvider";
import { router, useGlobalSearchParams } from "expo-router";
import { useAuthContext } from "@/contexts/AuthContext";
import { API_URL, API_VERSION, END_POINTS } from "@/configs/api.config";

const Library = () => {
  //biến của bottomsheet
  const { isHiddenNavigationBar, setIsHiddenNavigationBar } = useAppProvider();
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [visibleCreateNewBottomSheet, setVisibleCreateNewBottomSheet] =
    useState(false);

  const [visibleFilterBottomSheet, setVisibleFilterBottomSheet] =
    useState(false);

  // Tên bộ sưu tập
  const [newCollectionName, setNewCollectionName] = useState("");
  // tab hiện tại: 'library' hoặc 'collection'
  const [activeTab, setActiveTab] = useState("library");
  // di chuyển dòng bôi đen
  const [translateValue] = useState(new Animated.Value(0));
  const [listNameCollection, setListNameCollection] = useState([]);

  // lấy list thông tin của quiz, thông tin name, description, status,...
  const { quizzes } = useQuizProvider();

  // BottomSheet
  // Bộ sưu tập
  const OpenBottomSheet = () => {
    setIsHiddenNavigationBar(true);
    setVisibleBottomSheet(true);
  };
  //Thư viện của tôi
  const CreateNewBottomSheet = () => {
    setIsHiddenNavigationBar(true);
    setVisibleCreateNewBottomSheet(true);
  };
  //filter
  const FilterBottomSheet = () => {
    setIsHiddenNavigationBar(true);
    setVisibleFilterBottomSheet(true);
  };

  const handleCloseBottomSheet = () => {
    setIsHiddenNavigationBar(false);
    setVisibleBottomSheet(false);
    setVisibleCreateNewBottomSheet(false);
    setVisibleFilterBottomSheet(false);
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

  return (
    <Wrapper>
      {/* Overlay */}
      {(visibleBottomSheet ||
        visibleCreateNewBottomSheet ||
        visibleFilterBottomSheet) && (
        <Overlay onPress={handleCloseBottomSheet} />
      )}

      {/* Bottom Sheet của Thư viện của tôi */}
      <BottomSheet visible={visibleCreateNewBottomSheet}>
        <View className="flex-col">
          <View className="m-1 w-full flex flex-row items-center justify-start">
            <Button
              text="+"
              otherStyles="w-1/6 flex item-center justify-center "
              onPress={() => {
                router.push("/(app)/(quiz)/create_title");
              }}
            />
            <Text className="flex justify-center items-center ml-2 font-bold text-[17px]">
              Tạo từ đầu
            </Text>
          </View>
          <Text className="text-gray">
            Sử dụng các loại câu hỏi tương tác hoặc chọn câu hỏi hiện có từ Thư
            viện Quizizz{" "}
          </Text>
        </View>
      </BottomSheet>

      {/* Bottom Sheet của Bộ sưu tập */}
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
              // console.log("Tên bộ sưu tập:", newCollectionName);
              setListNameCollection(newCollectionName);
              // Đóng BottomSheet sau khi lưu
              handleCloseBottomSheet();
            }}
          />
        </View>
      </BottomSheet>

      {/* Bottom Sheet của Bộ lọc */}
      <BottomSheet visible={visibleFilterBottomSheet}>
        <View className="flex flex-col">
          <View className="flex flex-row justify-around">
            <View className="flex flex-row border border-gray rounded-lg w-[100px] h-[30px] justify-between items-center">
              <Text className="ml-2 text-gray">Công khai</Text>
              <View className="mr-1">
                <AntDesign name="caretdown" size={12} color="black" />
              </View>
            </View>
            <View className="flex flex-row border border-gray rounded-lg w-[100px] h-[30px] justify-between items-center">
              <Text className="ml-2 text-gray">Lớp</Text>
              <View className="mr-1">
                <AntDesign name="caretdown" size={12} color="black" />
              </View>
            </View>
            <View className="flex flex-row border border-gray rounded-lg w-[100px] h-[30px] justify-between items-center">
              <Text className="ml-2 text-gray">Môn</Text>
              <View className="mr-1">
                <AntDesign name="caretdown" size={12} color="black" />
              </View>
            </View>
          </View>

          <View className="flex flex-row justify-around mt-2">
            <View className="flex flex-row border border-gray rounded-lg w-[150px] h-[30px] justify-between items-center">
              <Text className="ml-2 text-gray">Thời gian bắt đầu</Text>
            </View>
            <View className="flex flex-row border border-gray rounded-lg w-[150px] h-[30px] justify-between items-center">
              <Text className="ml-2 text-gray">Thời gian kết thúc</Text>
            </View>
          </View>
        </View>

        <Button
          text="Lọc"
          otherStyles="w-full bg-gray-200 p-2 rounded-xl flex justify-center mt-4"
          // onPress={handleCloseBottomSheet}
        />
      </BottomSheet>

      <View className="flex-1">
        {/* Header */}
        {/* <View className="flex-row justify-between p-4">
          <View className="border border-gray-300 rounded-xl px-4 w-[120px] flex-row items-center justify-between">
            <AntDesign name="search1" size={18} color="black" />
            <TextInput placeholder="Tìm kiếm" className="ml-2" />
          </View>
        </View> */}

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

            <View className="flex flex-row justify-between">
              <Button
                onPress={CreateNewBottomSheet}
                text={"Tạo mới"}
                otherStyles={"w-1/4 justify-center mb-12"}
                textStyles={"text-center text-white"}
              />

              {/* bộ lọc */}
              <TouchableOpacity
                className="border border-gray w-[75px] h-[30px] justify-between items-center rounded-lg flex-row mr-2"
                onPress={FilterBottomSheet}
              >
                <Text className="ml-2 font-bold">Bộ lọc</Text>
                <View className="mt-[2px] mr-1">
                  <Ionicons name="options-outline" size={16} color="black" />
                </View>
              </TouchableOpacity>
            </View>

            {quizzes.length > 0 &&
              quizzes.map((quiz) => (
                <View className="h-[100px] w-full border rounded-xl flex-row mb-3">
                  <TouchableOpacity
                    key={quiz._id}
                    onPress={() => {
                      router.push({
                        pathname: "/(app)/(quiz)/overview",
                        params: { id: quiz._id },
                      });
                    }}
                  >
                    <View className="flex flex-row m-2">
                      <View className="flex justify-center items-center">
                        <Image
                          source={{ uri: quiz.quiz_thumb }}
                          className="w-[80px] h-[80px] rounded-xl"
                        ></Image>
                      </View>
                      <View className="flex flex-col ml-4 justify-around">
                        <Text className="text-lg font-bold">
                          {quiz.quiz_name}
                        </Text>
                        <Text className="text-gray-500">
                          {quiz.quiz_description}
                        </Text>
                        <Text className="text-gray-500">
                          {quiz.quiz_status}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
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
                      pathname: "/(app)/(collection)/detail_collection",
                      params: { id: quiz._id },
                    });
                  }}
                >
                  <View className="flex flex-row items-center justify-between m-4">
                    <Text>{quiz.quiz_name}</Text>
                    <Text>{listNameCollection}</Text>
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

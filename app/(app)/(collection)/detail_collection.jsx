import { View, Text, Image, FlatList, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Wrapper from "@/components/customs/Wrapper";
import Button from "@/components/customs/Button";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { API_URL, API_VERSION, END_POINTS } from "@/configs/api.config";
import { router, useGlobalSearchParams } from "expo-router";
import { useAuthContext } from "@/contexts/AuthContext";

const detail_collection = () => {
  const [quizzes, setQuizzes] = useState([]);
  // Tạo biến để lưu tên bộ sưu tập
  const [collectionName, setCollectionName] = useState("");
  const { id } = useGlobalSearchParams();
  const { userData } = useAuthContext();

  // Hàm lấy chi tiết bộ sưu tập
  const getCollectionById = async (collection_id) => {
    console.log(collection_id);
    const response = await fetch(
      `${API_URL}${API_VERSION.V1}${END_POINTS.COLLECTION_GET_DETAILS}`,
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
        }),
      }
    );
    const data = await response.json();
    if (data.statusCode === 200) {
      // Lưu tên của collection vào
      setCollectionName(data.metadata.collection_name);

      // Lấy các quiz trong bộ sưu tập
      if (data.metadata.quizzes.length > 0) {
        data.metadata.quizzes.forEach((e) => {
          getQuizById(e);
        });
      }
    }
  };

  const getQuizById = async (quiz_id) => {
    console.log(quiz_id);
    const response = await fetch(
      `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_DETAIL}`,
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
        }),
      }
    );
    const data = await response.json();
    console.log(data);
    if (data.statusCode === 200) {
      setQuizzes((prev) => {
        return [...prev, data.metadata];
      });
    }
  };

  const deleteCollection = async (collection_id) => {
    const response = await fetch(
      `${API_URL}${API_VERSION.V1}${END_POINTS.COLLECTION_DELETE}`,
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
        }),
      }
    );
    const data = await response.json();
    if (data.statusCode === 200) {
      // khi xóa xong thì chuyển lại về trang thư viện
      router.push({
        pathname: "/(app)/(home)/libraly",
      });
    }
  };

  const updateNameCollection = async (quiz_id) => {
    console.log(quiz_id);
    const response = await fetch(
      `${API_URL}${API_VERSION.V1}${END_POINTS.COLLECTION_UPDATE_NAME}`,
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
        }),
      }
    );
    const data = await response.json();
    console.log(data);
    if (data.statusCode === 200) {
    }
  };

  // hiển thị nút xác nhận xóa
  const handleDeletePress = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa bộ sưu tập này không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          onPress: () => deleteCollection(id),
          style: "destructive",
        },
      ]
    );
  };

  useEffect(() => {
    getCollectionById(id);
  }, []);

  return (
    <Wrapper>
      <View className="m-2">
        {/* Hiển thị tên của bộ sưu tập */}
        <Text className="mt-2 font-bold text-[18px] mb-4">
          {collectionName}
        </Text>

        <View className="flex-row">
          <TouchableOpacity>
            <View className="w-[90px] rounded-lg bg-slate-400 flex flex-row justify-between p-1">
              <View className="flex justify-center">
                <FontAwesome name="pencil" size={14} color="black" />
              </View>

              <Text className="mr-1 flex items-center">Chỉnh sửa</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="ml-2">
            <View className="w-[80px] rounded-lg bg-slate-400 flex flex-row justify-between p-1">
              <View className="flex justify-center">
                <FontAwesome name="share" size={14} color="black" />
              </View>

              <Text className="mr-1 flex items-center">Chia sẻ</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="ml-2" onPress={handleDeletePress}>
            <View className="w-[60px] rounded-lg bg-slate-400 flex flex-row justify-between p-1">
              <View className="flex justify-center">
                <MaterialIcons name="delete" size={14} color="black" />
              </View>

              <Text className="mr-2 flex items-center">Xóa</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Danh sách quiz */}
        <FlatList
          key={(name) => name.id}
          style={{ marginBottom: 100, marginTop: 50 }}
          data={quizzes}
          keyExtractor={(name) => name.id}
          renderItem={({ item: name }) => {
            return (
              <View className="h-[100px] w-full border rounded-xl flex-row mt-6">
                <View className="flex flex-row ">
                  <View className="flex justify-center items-center m-2">
                    <Image
                      source={{
                        uri:
                          name.quizThumb ||
                          "https://www.shutterstock.com/image-vector/quiz-time-3d-editable-text-260nw-2482374583.jpg",
                      }}
                      className="w-[80px] h-[80px] rounded-xl"
                    ></Image>
                  </View>
                  <View className="flex flex-col ml-4 justify-around">
                    <Text className="text-lg font-bold">{name.quiz_name}</Text>
                    <Text className="text-gray-500">
                      {name.quiz_description}
                    </Text>
                    <Text className="text-gray-500">
                      {name.quiz_status === "unpublished"
                        ? "Riêng tư"
                        : "Công khai"}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
        ></FlatList>
      </View>
    </Wrapper>
  );
};

export default detail_collection;

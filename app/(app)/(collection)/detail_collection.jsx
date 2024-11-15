import {
  View,
  Text,
  Image,
  FlatList,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import Wrapper from "@/components/customs/Wrapper";
import Button from "@/components/customs/Button";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { API_URL, API_VERSION, END_POINTS } from "@/configs/api.config";
import { router, useGlobalSearchParams } from "expo-router";
import { useAuthContext } from "@/contexts/AuthContext";

const detail_collection = () => {
  // chỉnh sửa tên của collection
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  // Hàm hiển thị modal để nhập tên mới
  const handleEditPress = () => {
    setNewCollectionName(collectionName); // Đặt giá trị hiện tại vào input
    setEditModalVisible(true);
  };

  const [quizzes, setQuizzes] = useState([]);
  // Tạo biến để lưu tên bộ sưu tập
  const [collectionName, setCollectionName] = useState("");
  const { id } = useGlobalSearchParams();
  const { userData } = useAuthContext();

  // lấy tất cả id của quiz
  const getAllQuizById = async (collection_id) => {
    // console.log(collection_id);
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
    console.log(data);
    if (data.statusCode === 200) {
      // khi xóa xong thì chuyển lại về trang thư viện
      router.push({
        pathname: "/(app)/(home)/libraly",
      });
    }
  };

  //fetch api để cập nhật tên mới của collection từ backend server về database của collection
  const updateCollectionName = async (collection_id, collection_name, quiz_ids) => {
    console.log("Updating collection name...");
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
          collection_id,
          collection_name,
          quiz_ids,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
    if (data.statusCode === 200) {
      // Cập nhật lại tên collection sau khi cập nhật thành công
      setCollectionName(collection_name);
      setEditModalVisible(false);
    } else {
      console.log("Error: Could not update collection name");
      Alert.alert("Error", "Không thể cập nhật tên bộ sưu tập.");
    }
  };

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
          quiz_id,
          collection_id: id,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
    if (data.statusCode === 200) {
      // Cập nhật danh sách quiz sau khi xóa thành công
      setQuizzes((prev) => prev.filter((quiz) => quiz._id !== quiz_id));
    } else {
      console.log("Error: Quiz does not exist or could not be deleted");
      Alert.alert("Error", "Quiz không tồn tại hoặc không thể xóa.");
    }
  };

  const handleDeleteQuiz = (quiz_id) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa quiz này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: () => deleteQuizInCollection(quiz_id),
        style: "destructive",
      },
    ]);
  };

  // hiển thị nút xác nhận xóa cho bộ sưu tập
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
  // khi dữ liệu bị thay đổi thì useEffect này sẽ dc gọi
  useEffect(() => {
    getAllQuizById(id);
  }, []);

  return (
    <Wrapper>
      <Modal
        transparent={true}
        visible={isEditModalVisible}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-opacity-50">
          <View className="bg-white rounded-lg p-4 shadow-lg w-11/12 max-w-md border border-black">
            <Text className="text-lg font-semibold mb-2">
              Chỉnh sửa tên bộ sưu tập
            </Text>
            <TextInput
              className="border border-gray-300 rounded-md p-2 mb-2"
              placeholder="Nhập tên mới"
              value={newCollectionName}
              onChangeText={setNewCollectionName}
            />
            <View className="flex-row justify-end">
              <Button
                text="Hủy"
                onPress={() => setEditModalVisible(false)}
                otherStyles="bg-black text-white rounded-md px-4 py-2 mr-2"
              />
              <Button
                text="Lưu"
                onPress={() => updateCollectionName(id, newCollectionName)}
                otherStyles="bg-blue-500 text-white rounded-md px-4 py-2"
              />
            </View>
          </View>
        </View>
      </Modal>

      <View className="m-2">
        {/* Hiển thị tên của bộ sưu tập */}
        <Text className="mt-2 font-bold text-[18px] mb-4">
          {collectionName}
        </Text>

        <View className="flex-row">
          <TouchableOpacity onPress={handleEditPress}>
            <View className="w-[90px] rounded-lg bg-slate-400 flex flex-row justify-between p-1">
              <View className="flex justify-center">
                <FontAwesome name="pencil" size={14} color="black" />
              </View>

              <Text className="mr-1 flex items-center">Chỉnh sửa</Text>
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity className="ml-2">
            <View className="w-[80px] rounded-lg bg-slate-400 flex flex-row justify-between p-1">
              <View className="flex justify-center">
                <FontAwesome name="share" size={14} color="black" />
              </View>

              <Text className="mr-1 flex items-center">Chia sẻ</Text>
            </View>
          </TouchableOpacity> */}

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
          key={(name) => name._id}
          style={{ marginBottom: 100, marginTop: 50 }}
          data={quizzes}
          keyExtractor={(name) => name._id}
          renderItem={({ item: name }) => {
            return (
              <View className="h-[100px] w-full border rounded-xl flex-row mt-6 relative">
                <View className="flex flex-row w-full">
                  <View className="flex justify-center items-center m-2">
                    <Image
                      source={{
                        uri:
                          name.quiz_thumb ||
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
                <TouchableOpacity
                  className=" border rounded-md absolute right-2 bottom-2"
                  onPress={() => handleDeleteQuiz(name._id)}
                >
                  <MaterialIcons name="delete" size={24} color="black" />
                </TouchableOpacity>
              </View>
            );
          }}
        ></FlatList>
      </View>
    </Wrapper>
  );
};

export default detail_collection;

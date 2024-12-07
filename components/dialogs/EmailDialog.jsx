import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Switch,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Button from "@/components/customs/Button";
import { API_URL, API_VERSION, END_POINTS } from "@/configs/api.config";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAppProvider } from "@/contexts/AppProvider";

const EmailDialog = ({ visible, onClose, quiz_id }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const { userData } = useAuthContext();
  const [clicked, setClicked] = useState([]);
  const [loading, setLoading] = useState(false);
  const { i18n } = useAppProvider();

  useEffect(() => {
    getAllUserShared();
    if (visible) {
      setEmail("");
      setError("");
      setIsEdit(false);
      setIsDetailsVisible(false);
    }
  }, [visible]);

  const shareQuizToTeacher = async (user_email) => {
    const response = await fetch(
      `${API_URL}${API_VERSION.V1}${END_POINTS.SHARE_QUIZ}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": userData._id,
          authorization: userData.accessToken,
        },
        body: JSON.stringify({
          user_id: userData._id,
          email: user_email,
          quiz_id,
          isEdit,
        }),
      }
    );
    const data = await response.json();
    if (data.statusCode === 200) {
      alert("Share thành công");
      getAllUserShared();
    } else {
      alert(data.message);
    }
  };
  const getAllUserShared = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}${API_VERSION.V1}${END_POINTS.GET_ALL_USER_SHARED}`,
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
      if (data.statusCode === 200) {
        setClicked(data.metadata);
      }
    } catch (err) {
      console.error("Error fetching shared users:", err);
    } finally {
      setLoading(false);
    }
  };
  const removeSharedUser = async (user_id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}${API_VERSION.V1}${END_POINTS.REVOKE_SHARED_USER}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-client-id": userData._id,
            authorization: userData.accessToken,
          },
          body: JSON.stringify({
            quiz_id,
            user_id,
          }),
        }
      );
      const data = await response.json();
      if (data.statusCode === 200) {
        alert("Xóa thành công");
        getAllUserShared();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error removing shared user:", err);
      alert("Mạng yếu, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      if (!email.includes("@gmail.com")) {
        setError("Email phải có đuôi @gmail.com");
      } else if (email === userData.user_email) {
        setError("Bạn không thể gửi quiz cho chính mình");
      } else {
        setError("");
        await shareQuizToTeacher(email);
      }
    } catch (err) {
      console.error("Error sharing quiz:", err);
    } finally {
      setLoading(false); // Dừng loading
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      animationInTiming={1}
      animationOutTiming={1}
    >
      {loading && (
        <View className="absolute inset-[50px] justify-center items-center bg-opacity-50 ml-[200px] mt-[70px]">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      <View className="flex-1 justify-center items-center bg-opacity-50">
        <View className="bg-white rounded-2xl p-8 shadow-lg w-11/12 max-w-md">
          <Text className="text-lg font-semibold mb-2">
            {i18n.t("detailQuiz.shareQuiz")}
          </Text>
          <Text className="text-gray-700 mb-4">
            {i18n.t("detailQuiz.enterMail")}
          </Text>
          <TextInput
            className="border border-gray rounded-md p-2 mb-2"
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError("");
            }}
            keyboardType="email-address"
          />
          {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}

          {/* Thêm lựa chọn quyền chỉnh sửa */}
          <View className="flex-row items-center">
            <Text className="mr-2">{i18n.t("detailQuiz.allowEdit")}</Text>
            <View className="flex-row items-center my-2 ml-6">
              <Text>{i18n.t("detailQuiz.no")}</Text>
              <Switch
                value={isEdit}
                onValueChange={setIsEdit}
                thumbColor={isEdit ? "#f15454" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
              />
              <Text>{i18n.t("detailQuiz.yes")}</Text>
            </View>
          </View>

          <View className="flex-row mb-1">
            <Text className="font-bold text-[16px]">
              {i18n.t("detailQuiz.informationTeacher")}
            </Text>
            <TouchableOpacity
              onPress={() => setIsDetailsVisible(!isDetailsVisible)}
            >
              <Text className="text-blue-600 text-[16px]">
                {isDetailsVisible
                  ? i18n.t("detailQuiz.hideInformation")
                  : i18n.t("detailQuiz.viewDetails")}
              </Text>
            </TouchableOpacity>
          </View>

          {isDetailsVisible && (
            <ScrollView className="h-[100px]">
              {clicked.map((item, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between my-1"
                >
                  <Text className="text-[14px]">{item.user_id.user_email}</Text>
                  <TouchableOpacity
                    className="bg-red-500 px-2 py-1 rounded"
                    onPress={() =>
                      Alert.alert(
                        i18n.t("detailQuiz.confirm"),
                        i18n.t("detailQuiz.sureDeleteUser"),
                        [
                          {
                            text: i18n.t("detailQuiz.cancel"),
                            style: "cancel",
                          },
                          {
                            text: i18n.t("detailQuiz.delete"),
                            onPress: () => removeSharedUser(item.user_id._id),
                          },
                        ]
                      )
                    }
                  >
                    <Text className="text-white text-[12px]">
                      {i18n.t("detailQuiz.delete")}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          <View className="flex-row justify-end mt-2">
            <Button
              onPress={() => {
                setEmail("");
                onClose();
              }}
              text={i18n.t("detailQuiz.cancel")}
              textStyles="text-black"
              otherStyles="bg-white border border-black text-white rounded-md px-4 py-2 mr-2"
            />
            <Button
              text={i18n.t("detailQuiz.send")}
              otherStyles="bg-pink-500 text-white rounded-md px-4 py-2"
              onPress={handleSend}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EmailDialog;

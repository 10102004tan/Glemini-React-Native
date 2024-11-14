import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Modal, Switch } from "react-native";
import Button from "@/components/customs/Button";
import { API_URL, API_VERSION, END_POINTS } from "@/configs/api.config";
import { useAuthContext } from "@/contexts/AuthContext";

const EmailDialog = ({ visible, onClose, quiz_id }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const { userData } = useAuthContext();

  useEffect(() => {
    if (visible) {
      setEmail("");
      setError("");
      if (setIsEdit) {
        setIsEdit(false);
      }
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
    } else {
      // console.log(data);
      alert(data.message);
    }
  };

  const handleSend = async () => {
    if (!email.includes("@gmail.com")) {
      setError("Email phải có đuôi @gmail.com");
    } else if (email === userData.user_email) {
      setError("Bạn không thể gửi quiz cho chính mình");
    } else {
      setError("");
      await shareQuizToTeacher(email);
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
      <View className="flex-1 justify-center items-center bg-opacity-50">
        <View className="bg-white rounded-2xl p-8 shadow-lg w-11/12 max-w-md">
          <Text className="text-lg font-semibold mb-2">Chia sẻ Quiz</Text>
          <Text className="text-gray-700 mb-4">
            Nhập email của giáo viên bạn muốn gửi:
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
          <View className="flex-row items-center my-2">
            <Text className="mr-2">Cho phép chỉnh sửa:</Text>
            <View className="flex-row items-center my-2 ml-6">
              <Text>Không</Text>
              <Switch
                value={isEdit}
                onValueChange={setIsEdit}
                thumbColor={isEdit ? "#f15454" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
              />
            </View>
            <Text>Có</Text>
          </View>

          <View className="flex-row justify-end mt-2">
            <Button
              onPress={() => {
                setEmail("");
                onClose();
              }}
              text="Hủy"
              textStyles="text-black"
              otherStyles="bg-white border border-black text-white rounded-md px-4 py-2 mr-2"
            />
            <Button
              text="Gửi"
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

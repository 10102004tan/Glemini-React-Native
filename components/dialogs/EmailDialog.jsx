import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Modal } from "react-native";
import Button from "@/components/customs/Button"; // Điều chỉnh theo đường dẫn đúng

const EmailDialog = ({ visible, onClose, onSend }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(""); // Trạng thái lưu thông báo lỗi

  // Khi mở lại dialog, reset email và error
  useEffect(() => {
    if (visible) {
      setEmail(""); // Đặt lại email về chuỗi rỗng khi dialog mở lại
      setError(""); // Xóa thông báo lỗi nếu có
    }
  }, [visible]);

  const handleSend = () => {
    if (!email.includes("@gmail.com")) {
      setError("Email phải có đuôi @gmail.com");
    } else {

      

      setError(""); // Xóa thông báo lỗi nếu email hợp lệ
      onSend(email);
      setEmail(""); // Reset email
      onClose(); // Đóng dialog
    }
  };


  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View className="flex-1 justify-center items-center bg-opacity-50">
        <View className="bg-white rounded-lg p-4 shadow-lg w-11/12 max-w-md">
          <Text className="text-lg font-semibold mb-2">Chia sẻ Quiz</Text>
          <Text className="text-gray-700 mb-4">
            Nhập email của giáo viên bạn muốn gửi quizz:
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2 mb-2"
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError(""); // Xóa lỗi khi người dùng nhập lại
            }}
            keyboardType="email-address"
          />
          {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}
          <View className="flex-row justify-end">
            <Button
              onPress={() => {
                setEmail(""); // Đảm bảo reset khi nhấn Hủy
                onClose();
              }}
              text="Hủy"
              otherStyles="bg-black text-white rounded-md px-4 py-2 mr-2"
            />
            <Button
              text="Gửi"
              otherStyles="bg-blue-500 text-white rounded-md px-4 py-2"
              onPress={handleSend}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EmailDialog;
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Modal } from "react-native";
import Button from "@/components/customs/Button"; // Điều chỉnh theo đường dẫn đúng
import { API_URL, API_VERSION, END_POINTS } from "@/configs/api.config";
import { useAuthContext } from "@/contexts/AuthContext";

const EmailDialog = ({ visible, onClose, onSend }) => {
   const [email, setEmail] = useState("");
   const [error, setError] = useState(""); // Trạng thái lưu thông báo lỗi

   const { userData } = useAuthContext();

   // Khi mở lại dialog, reset email và error
   useEffect(() => {
      if (visible) {
         setEmail(""); // Đặt lại email về chuỗi rỗng khi dialog mở lại
         setError(""); // Xóa thông báo lỗi nếu có
      }
   }, [visible]);

   // Hàm kiểm tra email tồn tại
   const checkEmail = async (user_email) => {
      // console.log(userData);
      const response = await fetch(
         `${API_URL}${API_VERSION.V1}${END_POINTS.CHECK_EMAIL}`,
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
            }),
         }
      );
      const data = await response.json();
      // console.log("Email nhập vào:", email);
      // console.log("Email trong userData:", userData.user_email);
      console.log(data)
      if (data.statusCode === 200 && data.metadata === 'Email is already exists') {
         return true; // Email tồn tại
      } else if (data.statusCode === 400) {
         return false; // Email không tồn tại
      }
   };

   const handleSend = async () => {
      if (!email.includes("@gmail.com")) {
         setError("Email phải có đuôi @gmail.com");
      } else if (email === userData.user_email) {
         setError("Bạn không thể gửi quiz cho chính mình");
      } else {
         setError(""); // Xóa thông báo lỗi nếu email hợp lệ
         const emailExists = await checkEmail(email);

         if (emailExists) {
            // console.log("Email tồn tại");
            onSend(email); // Chỉ gửi quiz nếu email tồn tại
            setEmail(""); // Reset email
            onClose(); // Đóng dialog
         } else {
            setError("Email không tồn tại trong hệ thống");
         }
      }
   };

   return (
      <Modal transparent={true} visible={visible} animationType="fade" animationInTiming={1}
         animationOutTiming={1}>
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
                     setError(""); // Xóa lỗi khi người dùng nhập lại
                  }}
                  keyboardType="email-address"
               />
               {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}
               <View className="flex-row justify-end mt-2">
                  <Button
                     onPress={() => {
                        setEmail(""); // Đảm bảo reset khi nhấn Hủy
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

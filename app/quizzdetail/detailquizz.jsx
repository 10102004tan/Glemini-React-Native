import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Wrapper from "@/components/customs/Wrapper";
import Entypo from "@expo/vector-icons/Entypo";
import { Image } from "react-native";


import icon from "../../assets/images/icon.png";
import Button from "../../components/customs/Button.jsx";

const detailquizz = () => {
  return (
    <Wrapper>
      <View className="flex m-4 ">
        <View className="flex-row justify-between">
          <TouchableOpacity>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View className="h-[100px] w-full border rounded-xl mt-4 flex-row">
          <View className="flex justify-center items-center ml-2">
            <Image
              source={icon}
              className="w-[80px] h-[80px] rounded-xl"
            ></Image>
          </View>
          <View className="flex-col">
            <Text className="ml-4 mt-2">Tên Quizz</Text>
            <Text className="ml-4 mt-2">
              ............................................
            </Text>
            <Text className="ml-4 mt-2">.......................</Text>
          </View>
        </View>
      </View>

      <View className="w-full h-[1px] bg-gray"></View>

      <View>
        <Text className="text-gray mt-8 text-right right-4">
          100 người đã tham gia
        </Text>
      </View>

      <View className="flex m-4 ">
        <View className="w-full border rounded-xl mt-4">
          <View className="flex-row m-2">
            <View className="w-[35px] h-[35px] bg-black flex justify-center items-center rounded-md">
              <Text className="text-white">1</Text>
            </View>
            <Text className="ml-3 mt-2">Loại câu hỏi</Text>
            <Text className="ml-[150px] mt-2 text-gray ">30 giây - 1 điểm</Text>
          </View>
          <Text className="ml-2 font-bold">Đây là nội dung của câu hỏi</Text>

          <View className="flex-col ml-2 mt-8">
            <View className="flex-row">
              <View className="w-[15px] h-[15px] bg-green-500  flex justify-center items-center">
                <AntDesign name="check" size={12} color="white" />
              </View>
              <Text className="ml-2">Đáp án chính xác</Text>
            </View>

            <View className="flex-row mt-1">
              <View className="w-[15px] h-[15px] bg-red-600  flex justify-center items-center rounded-[15px]">
                <AntDesign name="close" size={12} color="white" />
              </View>
              <Text className="ml-2">Đáp án không chính xác</Text>
            </View>

            <View className="flex-row mt-1">
              <View className="w-[15px] h-[15px] bg-red-600  flex justify-center items-center rounded-[15px]">
                <AntDesign name="close" size={12} color="white" />
              </View>
              <Text className="ml-2">Đáp án không chính xác</Text>
            </View>

            <View className="flex-row mt-1">
              <View className="w-[15px] h-[15px] bg-red-600  flex justify-center items-center rounded-[15px]">
                <AntDesign name="close" size={12} color="white" />
              </View>
              <Text className="ml-2">Đáp án không chính xác</Text>
            </View>
          </View>

          <Text className="text-gray flex p-1 text-right mr-1">
            Xem giải thích
          </Text>
        </View>
      </View>
      <View className="w-full h-[1px] bg-gray mt-[320px]"></View>
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

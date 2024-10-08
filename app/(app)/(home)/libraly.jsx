import { View, Text } from "react-native";
import React from "react";
import Wrapper from "@/components/customs/Wrapper";
import { TextInput } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import Button from "@/components/customs/Button";

const libraly = () => {
  return (
    <Wrapper>
      <View className="flex-1 mt-[40px] ">
        {/* hearder */}
        <View className="flex-row flex justify-between p-4">
          <Text className="font-bold text-[25px]">Thư viện của tôi</Text>
          <View className="border border-gray-300 rounded-xl px-4 w-[100px] flex-row items-center justify-center">
            <AntDesign name="search1" size={18} color="black" />
            <TextInput placeholder="Tìm kiếm" />
          </View>
        </View>

        {/*  */}
        <View className="flex flex-row justify-around mb-2">
          <Text className="font-normal text-[18px]">Thư viện của tôi</Text>
          <Text className="font-normal text-[18px]">Bộ sưu tập</Text>
        </View>
        <View>
          <View className="bg-black h-[2px] w-1/2"></View>
          <View className="bg-gray h-[1px]"></View>
        </View>
        <View className="p-3">
          <Button
            text={"Tạo bộ sưu tập mới"}
            otherStyles={"w-1/2 justify-center"}
            textStyles={"text-center"}
          ></Button>
        </View>
      </View>
    </Wrapper>
  );
};

export default libraly;

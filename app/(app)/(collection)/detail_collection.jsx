import { View, Text } from "react-native";
import React from "react";
import Wrapper from "@/components/customs/Wrapper";
import Button from "@/components/customs/Button";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const detail_collection = () => {
  return (
    <Wrapper>
      <View className="m-2">
        <Text className="mt-2 font-bold text-[18px]">Quizz yêu thích</Text>

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

          <TouchableOpacity className="ml-2">
            <View className="w-[60px] rounded-lg bg-slate-400 flex flex-row justify-between p-1">
              <View className="flex justify-center">
                <MaterialIcons name="delete" size={14} color="black" />
              </View>

              <Text className="mr-2 flex items-center">Xóa</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Wrapper>
  );
};

export default detail_collection;

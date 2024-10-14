import { View, Text } from "react-native";
import React from "react";
import Wrapper from "@/components/customs/Wrapper";
import Button from "@/components/customs/Button";
import { FontAwesome } from "@expo/vector-icons";

const detail_collection = () => {
  return (
    <Wrapper>
      <View className="flex flex-col">
        <Text className="mt-2">Quizz yêu thích</Text>

        <View className="flex flex-row mt-4">
          <View className="flex-row">
            <FontAwesome name="pencil" size={24} color="black" />
            <Button
              // onPress={CreateNewBottomSheet}
              text={"Chỉnh sửa tên"}
              otherStyles={" justify-center"}
              textStyles={"text-center text-white"}
            />
          </View>
          <View className="flex-row">
            <FontAwesome name="share" size={24} color="black" />
            <Button
              // onPress={CreateNewBottomSheet}
              text={"Chia sẻ"}
              otherStyles={" justify-center ml-4"}
              textStyles={"text-center text-white"}
            />
          </View>
        </View>
      </View>
    </Wrapper>
  );
};

export default detail_collection;

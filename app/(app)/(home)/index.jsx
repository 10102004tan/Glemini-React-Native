import { Animated, Text, View } from "react-native";
import Wrapper from "../../../components/customs/Wrapper";
import Button from "../../../components/customs/Button";
import Field from "../../../components/customs/Field";
import { useContext, useRef, useState } from "react";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <Wrapper>
      <View className="p-4">
        <Button
          onPress={() => {
            router.replace("/(app)/(home)/teacher_home_screen");
          }}
          text={"Teacher Home"}
          otherStyles={"mt-4 p-4"}
          textStyles={"text-center text-white"}
        />
        <Button
          onPress={() => {
            router.push("/(app)/(quiz)/create_title");
          }}
          text={"Quizz"}
          otherStyles={"mt-4 p-4"}
          textStyles={"text-center text-white"}
        />

        <Button
          onPress={() => {
            router.push("/(app)/(quiz)/list");
          }}
          text={"List quizzes"}
          otherStyles={"mt-4 p-4"}
          textStyles={"text-center text-white"}
        />
        <Button
          onPress={() => {
            router.push("/(app)/(play)/single");
          }}
          text={"Single"}
          otherStyles={"mt-4 p-4"}
          textStyles={"text-center text-white"}
        />
        <Button
          onPress={() => {
            router.push({
              pathname: "(app)/(quiz)/detail_quiz",
              params: { detail_quiz: "66ff90ec69a02759b89ef55c" },
            });
          }}
          text={"Quizz Detail"}
          otherStyles={"mt-4 p-4"}
          textStyles={"text-center"}
        />
        <Button
          onPress={() => {
            router.push({
              pathname: "/(app)/(quiz)/demo_create_quiz_by_template",
            });
          }}
          text={"Template"}
          otherStyles={"mt-4 p-4"}
          textStyles={"text-center"}
        />
      </View>
    </Wrapper>
  );
}

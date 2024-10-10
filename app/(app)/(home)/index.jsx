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
      <Button
        onPress={() => {
          router.replace("/(app)/(quiz)/edit_quiz_question");
        }}
        text={"Create Quizz"}
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
            params: { detail_quiz: "67063f3991c48d80d64c33e8" },
          });
        }}
        text={"Quizz Detail"}
        otherStyles={"mt-4 p-4"}
        textStyles={"text-center"}
      />
    </Wrapper>
  );
}

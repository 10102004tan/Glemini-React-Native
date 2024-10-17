import { Animated, Text, View } from "react-native";
import Wrapper from "../../../components/customs/Wrapper";
import Button from "../../../components/customs/Button";
import Field from "../../../components/customs/Field";
import { useContext, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/contexts/AuthContext";
import StudentHomeScreen from "../student_home_screen";
import CreateQuizzScreen from "../teacher_home_screen";

export default function HomeScreen() {
  const {userData} = useAuthContext()
 
  return (
    userData.user_type === 'student' ? <StudentHomeScreen/> : <CreateQuizzScreen/>
  );
}

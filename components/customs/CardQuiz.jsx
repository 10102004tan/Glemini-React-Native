import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuizProvider } from "@/contexts/QuizProvider";
import { useAppProvider } from "@/contexts/AppProvider";

const CardQuiz = ({
<<<<<<< HEAD
<<<<<<< HEAD
  quiz = {},
  type = "horizontal",
  routerPath = "",
  isDelete = false,
  params = {},
  handleDelete,
}) => {
  const router = useRouter();
  const { isEdited } = useQuizProvider();
  const { i18n } = useAppProvider();
=======
=======
>>>>>>> 0030ee04a640ee6b0ecaeee91816f67909caeada
   quiz = {},
   type = "horizontal",
   routerPath = "",
   isDelete = false,
   params = {},
   handleDelete,
   showCheck = true
}) => {
   const router = useRouter();
   const { isEdited } = useQuizProvider();
   const { i18n } = useAppProvider();
<<<<<<< HEAD
>>>>>>> ab9c30e203bf7adcd8b83f129bddfd14d5b60844

  if (type === "horizontal") {
    const { quiz_thumb, quiz_name, quiz_description, quiz_status } = quiz;
    return (
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: routerPath,
            params: params,
          });
        }}
        className={
          "flex-1 mx-1 mb-3 shadow pb-2 border border-gray-200 rounded-xl overflow-hidden"
        }
      >
<<<<<<< HEAD
        <View>
          <Image
            src={
              quiz_thumb
                ? quiz_thumb
                : "https://elearningindustry.com/wp-content/uploads/2021/10/Shareable-Quizzes-In-Online-Training-7-Reasons.jpg"
=======

   if (type === "horizontal") {
      const { quiz_thumb, quiz_name, quiz_description, quiz_status } = quiz;
      return (
         <TouchableOpacity
            onPress={() => {
               router.push({
                  pathname: routerPath,
                  params: params,
               });
            }}
            className={
               "flex-1 mx-1 mb-3 shadow pb-2 border border-gray-200 rounded-xl overflow-hidden"
>>>>>>> 0030ee04a640ee6b0ecaeee91816f67909caeada
            }
         >
            <View>
               <Image
                  src={
                     quiz_thumb
                        ? quiz_thumb
                        : "https://elearningindustry.com/wp-content/uploads/2021/10/Shareable-Quizzes-In-Online-Training-7-Reasons.jpg"
                  }
                  className={"w-full h-[100px] rounded-b-[10px]"}
                  alt={quiz_name}
               />
            </View>
            <View className={"p-2"}>
               <Text>{quiz_name}</Text>
               <Text>{quiz_description}</Text>
               <Text>
                  {quiz_status === "published"
                     ? i18n.t("library.public")
                     : i18n.t("library.private")}
               </Text>
            </View>
         </TouchableOpacity>
      );
   }

   // vertical
   return (
      <View
         className="min-h-[100px] w-full bg-white rounded-2xl flex-row mb-3"
         style={{
            shadowColor: "#000",
            shadowOffset: {
               width: 0,
               height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
         }}
      >
<<<<<<< HEAD
        <View className="flex flex-col">
          <View className="flex justify-center items-center w-full">
            <Image
              source={{
                uri:
                  quiz.quiz_thumb ||
                  "https://elearningindustry.com/wp-content/uploads/2021/10/Shareable-Quizzes-In-Online-Training-7-Reasons.jpg",
              }}
              className="w-full h-[160px] rounded-tl-2xl rounded-tr-2xl"
            ></Image>
          </View>
          <View className="flex flex-col p-4 w-full">
            <Text className="text-lg font-semibold mt-2">{quiz.quiz_name}</Text>
            <Text className="text-gray mb-2 max-w-[360px] overflow-hidden ">
              {quiz.quiz_description || i18n.t("library.noDescription")}
            </Text>
            <View className="flex-row justify-between">
              <Text className="text-green-600">
                {quiz.quiz_status === "unpublished"
                  ? i18n.t("library.private")
                  : i18n.t("library.public")}
              </Text>
              <Text className="font-bold text-[15px]">
                {isEdited ? "" : i18n.t("library.viewOnly")}
              </Text>
=======
=======
>>>>>>> 0030ee04a640ee6b0ecaeee91816f67909caeada
         <TouchableOpacity
            className="w-full"
            onPress={() => {
               router.push({
                  pathname: routerPath,
                  params: params,
               });
            }}
         >
            <View className="flex flex-col">
               <View className="flex justify-center items-center w-full">
                  <Image
                     source={{
                        uri:
                           quiz.quiz_thumb ||
                           "https://elearningindustry.com/wp-content/uploads/2021/10/Shareable-Quizzes-In-Online-Training-7-Reasons.jpg",
                     }}
                     className="w-full h-[160px] rounded-tl-2xl rounded-tr-2xl"
                  ></Image>
               </View>
               <View className="flex flex-col p-4 w-full">
                  <Text className="text-lg font-semibold mt-2">{quiz.quiz_name}</Text>
                  <Text className="text-gray mb-2 max-w-[360px] overflow-hidden ">
                     {quiz.quiz_description || i18n.t("library.noDescription")}
                  </Text>
                  <View className="flex-row justify-between">
                     <Text className="text-green-600">
                        {quiz.quiz_status === "unpublished"
                           ? i18n.t("library.private")
                           : i18n.t("library.public")}
                     </Text>
                     <Text className="font-bold text-[15px]">
                        {showCheck ? isEdited ? "" : i18n.t('card_quiz.viewOnly') : ""}
                     </Text>
                  </View>
               </View>
<<<<<<< HEAD
>>>>>>> ab9c30e203bf7adcd8b83f129bddfd14d5b60844
=======
>>>>>>> 0030ee04a640ee6b0ecaeee91816f67909caeada
            </View>
         </TouchableOpacity>
      </View>
   );
};

export default CardQuiz;

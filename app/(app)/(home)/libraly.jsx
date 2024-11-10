import {
   View,
   Text,
   TouchableOpacity,
   TextInput,
   Animated,
   Image,
   ScrollView,
   FlatList,
   ActivityIndicator,
   Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Wrapper from "@/components/customs/Wrapper";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Button from "@/components/customs/Button";
import { useAppProvider } from "@/contexts/AppProvider";
import BottomSheet from "@/components/customs/BottomSheet";
import Overlay from "@/components/customs/Overlay";
import { useQuizProvider } from "@/contexts/QuizProvider";
import { router, useGlobalSearchParams } from "expo-router";
import { AuthContext, useAuthContext } from "@/contexts/AuthContext";
import { API_URL, API_VERSION, END_POINTS } from "@/configs/api.config";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSubjectProvider } from "@/contexts/SubjectProvider";
import { convertSubjectData } from "@/utils";
import {
   MultipleSelectList,
   SelectList,
} from "react-native-dropdown-select-list";
import LockFeature from "@/components/customs/LockFeature";
import CardQuiz from "@/components/customs/CardQuiz";
import { Dimensions } from "react-native";
import QuizzesSharedEmpty from "@/components/customs/QuizzesSharedEmpty";

const Library = () => {
   //biến loadmore
   // const [page, setPage] = useState(0);
   // const limit = 5;
   // const [hasMoreQuizzes, setHasMoreQuizzes] = useState(true);
   // const [quizMessageQuizShared, setQuizMessageQuizShared] = useState("");

   //biến name của bộ sưu tập
   const [nameCollection, setNameCollection] = useState("");
   const [collections, setCollections] = useState([]);
   const { userData, processAccessTokenExpired } = useAuthContext();
   const { teacherStatus } = useContext(AuthContext);
   // biến search
   const [search, setSearch] = useState("");
   const screenWidth = Dimensions.get("window").width;

   // biến lưu trạng thái status
   const [status, setStatus] = useState("");
   const data = [
      { key: "published", value: "Công khai", data_selected: "published" },
      {
         key: "unpublished",
         value: "Chỉ mình tôi",
         data_selected: "unpublished",
      },
   ];
   // Lấy dữ liệu môn học
   const { subjects } = useSubjectProvider();
   const subjectsData = convertSubjectData(subjects);
   const [subject, setSubject] = useState([]);

   // biến để set thời gian
   const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
   const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
   const [startDate, setStartDate] = useState(null);
   const [endDate, setEndDate] = useState(null);

   // Hiển thị và ẩn DatePicker
   const showStartDatePicker = () => setStartDatePickerVisible(true);
   const hideStartDatePicker = () => setStartDatePickerVisible(false);

   const showEndDatePicker = () => setEndDatePickerVisible(true);
   const hideEndDatePicker = () => setEndDatePickerVisible(false);

   // Xử lý chọn ngày
   const handleConfirmStartDate = (date) => {
      if (endDate && date > endDate) {
         alert("Ngày bắt đầu không thể lớn hơn ngày kết thúc");
      } else {
         setStartDate(date);
         console.log("Ngày bắt đầu:", date);
      }
      hideStartDatePicker();
   };

   const handleConfirmEndDate = (date) => {
      if (startDate && date < startDate) {
         alert("Ngày kết thúc không thể nhỏ hơn ngày bắt đầu");
      } else {
         setEndDate(date);
         console.log("Ngày kết thúc:", date);
      }
      hideEndDatePicker();
   };

   //biến của bottomsheet
   const { isHiddenNavigationBar, setIsHiddenNavigationBar } = useAppProvider();
   const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
   const [visibleCreateNewBottomSheet, setVisibleCreateNewBottomSheet] =
      useState(false);

   const [visibleFilterBottomSheet, setVisibleFilterBottomSheet] =
      useState(false);

   // Tên bộ sưu tập
   const [newCollectionName, setNewCollectionName] = useState("");
   // tab hiện tại: 'library' hoặc 'collection'
   const [activeTab, setActiveTab] = useState("library");
   // di chuyển dòng bôi đen
   const [translateValue] = useState(new Animated.Value(0));
   const [listNameCollection, setListNameCollection] = useState([]);

   // lấy list thông tin của quiz, thông tin name, description, status,...
   const { quizzes, fetchQuizzes, quizFetching, quizMessage, setQuizzes } =
      useQuizProvider();

   const [sharedQuizzes, setSharedQuizzes] = useState([]);

   //hàm fetch api lấy tất cả các quiz đã được chia sẻ
   const getAllQuizzesShared = async () => {
      const response = await fetch(
         `${API_URL}${API_VERSION.V1}${END_POINTS.GET_ALL_QUIZZES_SHARED}`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "x-client-id": userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({
               user_id: userData._id,
            }),
         }
      );
      const data = await response.json();
      if (data.statusCode === 200) {
         setSharedQuizzes(data.metadata);
      }
   };

   // hàm xóa quiz đã chia sẻ
   const removeQuizShared = async (quiz_id) => {
      const response = await fetch(
         `${API_URL}${API_VERSION.V1}${END_POINTS.REMOVE_QUIZ_SHARED}`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "x-client-id": userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({
               user_id: userData._id,
               quiz_id: quiz_id,
            }),
         }
      );
      const data = await response.json();
      if (data.statusCode === 200) {
         setSharedQuizzes(sharedQuizzes.filter((quiz) => quiz._id !== quiz_id));
      }
   };
   const handleDeleteQuizShared = (quiz_id) => {
      Alert.alert(
         "Xác nhận xóa",
         "Bạn có chắc chắn muốn xóa quiz được chia sẻ này không?",
         [
            { text: "Hủy", style: "cancel" },
            {
               text: "Xóa",
               onPress: () => removeQuizShared(quiz_id),
               style: "destructive",
            },
         ]
      );
   };

   useEffect(() => {
      if (activeTab === "collection") {
         getAllCollections();
      } else if (activeTab === "shared") {
         getAllQuizzesShared();
      }
   }, [activeTab]);

   // Bộ sưu tập
   const OpenBottomSheet = () => {
      setIsHiddenNavigationBar(true);
      setVisibleBottomSheet(true);
   };
   //Thư viện của tôi
   const CreateNewBottomSheet = () => {
      setIsHiddenNavigationBar(true);
      setVisibleCreateNewBottomSheet(true);
   };
   //filter
   const FilterBottomSheet = () => {
      setIsHiddenNavigationBar(true);
      setVisibleFilterBottomSheet(true);
   };

   const handleCloseBottomSheet = () => {
      setIsHiddenNavigationBar(false);
      setVisibleBottomSheet(false);
      setVisibleCreateNewBottomSheet(false);
      setVisibleFilterBottomSheet(false);
   };

   const handleTabChange = (tab) => {
      setActiveTab(tab);

      // Di chuyển dòng bôi đen dựa trên tab
      Animated.timing(translateValue, {
         toValue:
            tab === "library"
               ? 0
               : tab === "collection"
                  ? screenWidth / 3
                  : (2 * screenWidth) / 3,
         duration: 300,
         useNativeDriver: true,
      }).start();
   };

   const filter = async () => {
      const response = await fetch(
         `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_FILTER}`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "x-client-id": userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({
               user_id: userData._id,
               quiz_name: search,
               quiz_status: status,
               quiz_subjects: subject,
               start_filter_date: startDate,
               end_filter_date: endDate,
            }),
         }
      );
      const data = await response.json();
      // console.log(JSON.stringify(data.metadata, null, 2));
      if (data.statusCode === 200) {
         setQuizzes(data.metadata);
      } else {
         if (data.statusCode === 401 && data.message === "expired") {
            processAccessTokenExpired();
         }

         setQuizzes([]);
      }
      handleCloseBottomSheet();
   };

   const resetFilters = async () => {
      const response = await fetch(
         `${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_FILTER}`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "x-client-id": userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({
               user_id: userData._id,
               quiz_name: "",
               quiz_status: "",
               quiz_subjects: [],
               start_filter_date: null,
               end_filter_date: null,
            }),
         }
      );
      const data = await response.json();
      if (data.statusCode === 200) {
         setQuizzes(data.metadata);
      } else {
         if (data.statusCode === 401 && data.message === "expired") {
            processAccessTokenExpired();
         }
         setQuizzes([]);
      }
   };

   // tạo bộ sưu tập
   const createCollection = async () => {
      let check = false;
      if (collections.length > 0) {
         collections.forEach((item) => {
            if (item.collection_name === nameCollection) {
               check = true;
               return;
            }
         });
      }

      if (check === false) {
         const response = await fetch(
            `${API_URL}${API_VERSION.V1}${END_POINTS.COLLECTION_CREATE}`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  "x-client-id": userData._id,
                  authorization: userData.accessToken,
               },
               body: JSON.stringify({
                  collection_name: nameCollection,
                  user_id: userData._id,
               }),
            }
         );
         const data = await response.json();
         console.log(data);
         if (data.statusCode === 200) {
            setCollections([...collections, data.metadata]);
         } else {
            if (data.statusCode === 401 && data.message === "expired") {
               processAccessTokenExpired();
            }
         }
      } else {
         alert("Đã tồn tại tên !!!");
      }
   };

   const getAllCollections = async () => {
      // console.log(userData._id);
      const response = await fetch(
         `${API_URL}${API_VERSION.V1}${END_POINTS.COLLECTION_GETALL}`,
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "x-client-id": userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({
               user_id: userData._id,
            }),
         }
      );
      const data = await response.json();
      // console.log(data);
      if (data.statusCode === 200) {
         setCollections(data.metadata);
      } else {
         if (data.statusCode === 401 && data.message === "expired") {
            processAccessTokenExpired();
         }
      }
   };

   if (teacherStatus === "pedding" || teacherStatus === "rejected") {
      return <LockFeature />;
   }

   return (
      <View className="flex-1">
         <Overlay
            onPress={handleCloseBottomSheet}
            visible={
               visibleBottomSheet ||
               visibleCreateNewBottomSheet ||
               visibleFilterBottomSheet
            }
         ></Overlay>

         {/* Bottom Sheet của Thư viện của tôi */}
         <BottomSheet
            visible={visibleCreateNewBottomSheet}
            onClose={handleCloseBottomSheet}
         >
            <View className="flex-col">
               <View className="m-1 w-full flex flex-row items-center justify-start">
                  <Button
                     text="+"
                     otherStyles="w-1/6 flex item-center justify-center "
                     onPress={() => {
                        handleCloseBottomSheet();
                        router.push("/(app)/(quiz)/create_title");
                     }}
                  />
                  <Text className="flex justify-center items-center ml-2 font-bold text-[17px]">
                     Tạo từ đầu
                  </Text>
               </View>
               <Text className="text-gray">
                  Sử dụng các loại câu hỏi tương tác hoặc chọn câu hỏi hiện có từ Thư
                  viện Quizizz{" "}
               </Text>
            </View>
         </BottomSheet>

         {/* Bottom Sheet của Bộ sưu tập */}
         <BottomSheet
            visible={visibleBottomSheet}
            onClose={handleCloseBottomSheet}
         >
            <View className="m-3">
               <Text className="text-gray mb-2">Tên bộ sưu tập</Text>
               <TextInput
                  value={nameCollection}
                  onChangeText={setNameCollection}
                  placeholder="Nhập tên bộ sưu tập"
                  className="border border-gray w-[350px] h-[50px] rounded-xl px-4"
               />
            </View>
            <View className="flex flex-row justify-between m-3">
               <Button
                  text="Hủy"
                  otherStyles="w-[45%] bg-gray-200 p-2 rounded-xl flex justify-center"
                  onPress={handleCloseBottomSheet}
               />
               <Button
                  text="Tạo"
                  otherStyles="w-[50%] bg-blue-500 p-2 rounded-xl flex justify-center"
                  textStyles="text-white text-center"
                  onPress={() => {
                     createCollection(); // Tạo bộ sưu tập
                     setNameCollection(""); // Đặt lại giá trị ô nhập liệu về chuỗi rỗng
                     handleCloseBottomSheet(); // Đóng BottomSheet
                  }}
               />
            </View>
         </BottomSheet>

         {/* Bottom Sheet của Bộ lọc */}
         <BottomSheet
            visible={visibleFilterBottomSheet}
            onClose={handleCloseBottomSheet}
         >
            <View className="flex flex-col">
               {/* search */}
               <View className="flex-row mb-4">
                  <View className="border border-gray rounded-xl p-2 w-full flex-row items-center">
                     <AntDesign name="search1" size={18} color="black" />
                     <TextInput
                        placeholder="Tìm kiếm"
                        className="ml-2"
                        onChangeText={(e) => {
                           setSearch(e);
                        }}
                        value={search}
                     />
                  </View>
               </View>

               <View className="flex flex-col ">
                  <View className="mb-4">
                     <SelectList setSelected={(val) => setStatus(val)} data={data} />
                  </View>

                  <MultipleSelectList
                     setSelected={(val) => setSubject(val)}
                     data={subjectsData}
                  />
               </View>

               <View className="flex flex-row mt-2 justify-between">
                  <TouchableOpacity
                     onPress={showStartDatePicker}
                     className="flex flex-row border border-gray rounded-lg w-1/2 p-3 items-center justify-between mr-2"
                  >
                     <DateTimePickerModal
                        isVisible={isStartDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirmStartDate}
                        onCancel={hideStartDatePicker}
                     />
                     <Text className="ml-2 text-gray">
                        {startDate
                           ? startDate.toLocaleDateString()
                           : "Thời gian bắt đầu"}
                     </Text>
                     <View className="mr-1">
                        <AntDesign name="caretdown" size={12} color="black" />
                     </View>
                  </TouchableOpacity>

                  {/* Chọn Thời gian kết thúc */}
                  <TouchableOpacity
                     onPress={showEndDatePicker}
                     className="flex flex-row border border-gray rounded-lg ml-2 p-3 justify-between items-center flex-1"
                  >
                     <DateTimePickerModal
                        isVisible={isEndDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirmEndDate}
                        onCancel={hideEndDatePicker}
                     />
                     <Text className="ml-2 text-gray">
                        {endDate ? endDate.toLocaleDateString() : "Thời gian kết thúc"}
                     </Text>
                     <View className="mr-1">
                        <AntDesign name="caretdown" size={12} color="black" />
                     </View>
                  </TouchableOpacity>
               </View>
            </View>

            <Button
               text="Lọc"
               otherStyles="w-full bg-gray-200 p-3 rounded-xl flex justify-center mt-4"
               onPress={filter}
            />
         </BottomSheet>

         <View className="flex-1 bg-white">
            {/* Tabs */}
            <View className="flex flex-row justify-around items-center h-[60px] mt-[40px]">
               {/* Tab Thư viện của tôi */}
               <TouchableOpacity onPress={() => handleTabChange("library")}>
                  <Text
                     className={`font-normal text-[18px] ${activeTab === "library"
                           ? "text-black font-bold"
                           : "text-gray-500"
                        }`}
                  >
                     Thư viện của tôi
                  </Text>
               </TouchableOpacity>

               {/* Tab Bộ sưu tập */}
               <TouchableOpacity onPress={() => handleTabChange("collection")}>
                  <Text
                     className={`font-normal text-[18px] ${activeTab === "collection"
                           ? "text-black font-bold"
                           : "text-gray-500"
                        }`}
                  >
                     Bộ sưu tập
                  </Text>
               </TouchableOpacity>

               <TouchableOpacity onPress={() => handleTabChange("shared")}>
                  <Text
                     className={`font-normal text-[18px] ${activeTab === "shared"
                           ? "text-black font-bold"
                           : "text-gray-500"
                        }`}
                  >
                     Quizzes đã nhận
                  </Text>
               </TouchableOpacity>
            </View>
            {/* Đường phân cách dưới tab */}
            <View>
               <Animated.View
                  style={{
                     transform: [{ translateX: translateValue }],
                     width: "33%",
                     height: 2,
                     backgroundColor: "#1C2833",
                     borderRadius: 10,
                  }}
               />
               <View className="bg-primary h-[1px]"></View>
            </View>
            {/* Nội dung dựa trên tab được chọn */}
            {activeTab === "library" && (
               <View className="">
                  {/* Nội dung của Thư viện của tôi */}

                  <View className="flex flex-row justify-between items-center p-3">
                     <Button
                        onPress={CreateNewBottomSheet}
                        text={"Tạo mới"}
                        icon={<AntDesign name="plus" size={16} color="white" />}
                        otherStyles={"w-1/4 justify-center p-4"}
                        textStyles={"text-center text-white"}
                     />

                     <View className="flex-row items-center justify-center">
                        {/* bộ lọc */}
                        <Button
                           text="Bộ lọc"
                           icon={
                              <Ionicons name="options-outline" size={16} color="white" />
                           }
                           onPress={FilterBottomSheet}
                           otherStyles={"bg-primary p-4 rounded-xl"}
                        />
                        <Button
                           text="Đặt lại"
                           icon={
                              <AntDesign name="closecircleo" size={16} color="white" />
                           }
                           onPress={resetFilters}
                           otherStyles={"bg-primary p-4 rounded-xl ml-2"}
                        />
                     </View>
                  </View>
                  <View className="border-t border-b border-gray mb-[350px]">
                     <FlatList
                        contentContainerStyle={{ padding: 12 }}
                        key={(quiz) => quiz._id}
                        data={quizzes}
                        keyExtractor={(quiz) => quiz._id}
                        renderItem={({ item: quiz }) => {
                           return (
                              <CardQuiz
                                 quiz={quiz}
                                 type="horizontal"
                                 routerPath="(quiz)/detail_quiz"
                                 params={{
                                    id: quiz._id,
                                 }}
                              />
                           );
                        }}
                        onEndReached={() => {
                           if (!quizFetching) {
                              fetchQuizzes();
                           }
                        }}
                        onEndReachedThreshold={1}
                        ListFooterComponent={
                           quizFetching ? (
                              <ActivityIndicator />
                           ) : (
                              <Text className="text-center text-red-700 text-lg font-bold border rounded-lg mt-2 p-2">
                                 {quizMessage}
                              </Text>
                           )
                        }
                     ></FlatList>
                  </View>
               </View>
            )}
            {activeTab === "collection" && (
               <View className="p-3">
                  {/* Danh sách các bộ sưu tập */}
                  <Button
                     onPress={OpenBottomSheet}
                     text={"Tạo bộ sưu tập mới"}
                     otherStyles={"w-1/2 justify-center p-4"}
                     textStyles={"text-center text-white"}
                  />
                  <ScrollView className="mb-[180px]">
                     {collections.length > 0 &&
                        collections.map((name) => (
                           <TouchableOpacity
                              key={name._id}
                              onPress={() => {
                                 router.push({
                                    pathname: "/(app)/(collection)/detail_collection",
                                    params: { id: name._id },
                                 });
                              }}
                           >
                              <View className="flex flex-row items-center justify-between m-4">
                                 <Text>{name.collection_name}</Text>
                                 <TouchableOpacity>
                                    <AntDesign name="right" size={18} color="black" />
                                 </TouchableOpacity>
                              </View>
                              <View className="h-[1px] w-full bg-gray"></View>
                           </TouchableOpacity>
                        ))}
                  </ScrollView>
               </View>
            )}
            {activeTab === "shared" && (
               <View className="p-3">
                  <FlatList
                     contentContainerStyle={{ padding: 12 }}
                     key={(quiz) => quiz._id}
                     style={{ marginBottom: 200 }}
                     data={sharedQuizzes}
                     keyExtractor={(quiz) => quiz._id}
                     renderItem={({ item: quiz }) => {
                        return (
                           <CardQuiz
                              handleDelete={() => handleDeleteQuizShared(quiz._id)}
                              isDelete={true}
                              quiz={quiz}
                              type="horizontal"
                              routerPath="(quiz)/detail_quiz"
                              params={{
                                 id: quiz._id,
                              }}
                           />
                        );
                     }}
                  ></FlatList>
               </View>
            )}
         </View>
      </View>
   );
};

export default Library;

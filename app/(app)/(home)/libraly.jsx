import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  ScrollView,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Button from "@/components/customs/Button";
import { useAppProvider } from "@/contexts/AppProvider";
import BottomSheet from "@/components/customs/BottomSheet";
import Overlay from "@/components/customs/Overlay";
import { useQuizProvider } from "@/contexts/QuizProvider";
import { router } from "expo-router";
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
import AntiFlatList from "@/components/customs/AntiFlatList/AntiFlatList";
import QuizzCreateAction from "@/components/customs/QuizCreateAction";
import QuizEmpty from "@/components/customs/QuizEmpty";
import QuizEmptyLottie from "@/components/customs/QuizEmptyLottie";
const Library = () => {
  const { i18n } = useAppProvider();
  //biến name của bộ sưu tập
  const { setActionQuizType } = useQuizProvider();
  const [nameCollection, setNameCollection] = useState("");
  const [collections, setCollections] = useState([]);
  const { userData, processAccessTokenExpired } = useAuthContext();
  const { teacherStatus } = useContext(AuthContext);
  // biến search
  const [search, setSearch] = useState("");
  const [skip, setSkip] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  const [hasMore, setHasMore] = useState(true);

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
  const { setIsHiddenNavigationBar } = useAppProvider();
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [visibleCreateNewBottomSheet, setVisibleCreateNewBottomSheet] =
    useState(false);

  const [visibleFilterBottomSheet, setVisibleFilterBottomSheet] =
    useState(false);

  // tab hiện tại: 'library' hoặc 'collection'
  const [activeTab, setActiveTab] = useState("library");
  // di chuyển dòng bôi đen
  const [translateValue] = useState(new Animated.Value(0));
  visibleBottomSheet;

  // biến  refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRefreshingShared, setIsRefreshingShared] = useState(false);
  // lấy list thông tin của quiz, thông tin name, description, status,...
  const {
    quizzes,
    fetchQuizzes,
    quizFetching,
    setQuizzes,
    LIMIT,
    sharedQuizzes,
    setSharedQuizzes,
  } = useQuizProvider();
  const [quizLoading, setQuizLoading] = useState(false);

  // Get all quizzes of the user
  useEffect(() => {
    if (userData) {
      // check if have filter
      if (
        search !== "" ||
        status !== "" ||
        subject.length > 0 ||
        startDate !== null ||
        endDate !== null
      ) {
        console.log("FILTER");
        filter();
      } else {
        console.log("FETCH");
        fetchQuizzes({ skip: 0 });
      }
    }
  }, [userData]);

  //hàm fetch api lấy tất cả các quiz đã được chia sẻ
  const getAllQuizzesShared = async () => {
    if (!quizLoading) {
      setQuizLoading(true);
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
            skip,
            limit: LIMIT,
          }),
        }
      );
      const data = await response.json();
      if (data.statusCode === 200) {
        if (skip === 0) {
          setSharedQuizzes(data.metadata);
        } else {
          setSharedQuizzes((prev) => [...prev, ...data.metadata]);
        }
        setQuizLoading(false);
        setIsRefreshingShared(false);
      }
      setQuizLoading(false);
      setIsRefreshingShared(false);
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
    getAllCollections();
  }, [activeTab]);

  // skip useEffect for quizzes shared
  useEffect(() => {
    getAllQuizzesShared();
  }, [skip]);

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
    // console.log(data)
    if (data.statusCode === 200) {
      setQuizzes(data.metadata.quizzes);
    } else {
      if (data.statusCode === 401 && data.message === "expired") {
        processAccessTokenExpired();
      }
      setQuizzes([]);
    }

    handleCloseBottomSheet();
    setSearch("");
    setStatus("");
    setSubject([]);
    setStartDate(null);
    setEndDate(null);
    setSkip(0);
    setHasMore(true);
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

  const filter = async (spSkip = null) => {
    //biến mặc định để ghi đè lên skip
    const skipLoad = spSkip === null ? skip : spSkip;
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
          quiz_name: search === "" ? null : search,
          quiz_status: status === "" ? null : status,
          quiz_subjects: subject.length > 0 ? subject : null,
          start_filter_date: startDate,
          end_filter_date: endDate,
          skip: skipLoad,
          limit: LIMIT,
        }),
      }
    );
    const data = await response.json();
    if (data.statusCode === 200) {
      if (skipLoad === 0) {
        setQuizzes(data.metadata.quizzes);
      } else {
        setQuizzes((prev) => [...prev, ...data.metadata.quizzes]);
      }
      setHasMore(data.metadata.hasMore);
      setSkip((prev) => prev + LIMIT);
    } else {
      if (data.statusCode === 401 && data.message === "expired") {
        processAccessTokenExpired();
      }
      setQuizzes([]);
    }
    handleCloseBottomSheet();
  };

  //
  const ComponentItem = ({ data }) => {
    // console.log("data",data)
    return (
      <CardQuiz
        quiz={data}
        routerPath="(quiz)/detail_quiz"
        params={{
          id: data._id,
        }}
      />
    );
  };

  // Load more và refresh của thư viện của tôi
  const handleLoadMore = () => {
    console.log("loadmore::" + hasMore);

    if (quizFetching) {
      console.log("Đang tải dữ liệu");
      return;
    }

    if (!hasMore) {
      console.log("Hết dữ liệu rồi");
      return;
    }

    if (
      search !== "" ||
      status !== "" ||
      subject.length > 0 ||
      startDate !== null ||
      endDate !== null
    ) {
      console.log("LOADMORE FILTER");
      filter();
    } else {
      console.log("LOADMORE FETCH");
      fetchQuizzes({ skip: skip + LIMIT }).then(() => {
        setSkip((prev) => prev + LIMIT);
      });
    }
  };

  const handleRefresh = () => {
    setQuizzes([]);
    setSkip(0);
    setHasMore(true);
    // Kiểm tra nếu đang lọc thì gọi lại hàm filter
    if (
      search !== "" ||
      status !== "" ||
      subject.length > 0 ||
      startDate !== null ||
      endDate !== null
    ) {
      console.log("REFESH FILTER");
      filter(0);
    } else {
      console.log("REFESH FETCH");
      fetchQuizzes({ skip: 0 });
    }
  };

  // Load more và refresh của quizzes đã nhận
  const handleLoadMoreQuizShared = () => {
    console.log("loadmore::", skip);
    setSkip((prev) => prev + LIMIT);
  };

  const handleRefreshQuizShared = () => {
    console.log("Refreshing data...");
    setIsRefreshingShared(true);
    setSkip(0);
  };

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
        <View className="flex flex-col items-start justify-start">
          <Text className="text-lg">
            {i18n.t("teacher_homepage.createQuizWithAi")}
          </Text>
          <View className="flex items-center justify-start flex-row mt-4">
            <QuizzCreateAction
              handlePress={() => {
                setActionQuizType("ai/prompt");
                handleCloseBottomSheet();
                router.push("/(app)/(quiz)/create_title");
              }}
              otherStyles="ml-2"
              title={i18n.t("teacher_homepage.createFromText")}
              icon={<Ionicons name="text-outline" size={24} color="black" />}
            />
          </View>
          <Text className="text-lg mt-8">
            {i18n.t("teacher_homepage.createWithHand")}
          </Text>
          <View className="flex items-center justify-start flex-row mt-4">
            <QuizzCreateAction
              handlePress={() => {
                setActionQuizType("template");
                handleCloseBottomSheet();
                router.push("/(app)/(quiz)/create_title");
              }}
              title={i18n.t("teacher_homepage.uploadTemplate")}
              icon={
                <Ionicons name="documents-outline" size={24} color="black" />
              }
            />
            <QuizzCreateAction
              handlePress={() => {
                setActionQuizType("create");
                handleCloseBottomSheet();
                router.push("(app)/(quiz)/create_title");
              }}
              otherStyles="ml-2"
              title={i18n.t("teacher_homepage.createWithHand")}
              icon={
                <Ionicons name="hand-left-outline" size={24} color="black" />
              }
            />
          </View>
        </View>
      </BottomSheet>

      {/* Bottom Sheet của Bộ sưu tập */}
      <BottomSheet
        visible={visibleBottomSheet}
        onClose={handleCloseBottomSheet}
      >
        <View className="m-3">
          <Text className="text-gray mb-2">
            {i18n.t("library.collection.collectionName")}
          </Text>
          <TextInput
            value={nameCollection}
            onChangeText={setNameCollection}
            placeholder={i18n.t("library.collection.enterCollectionName")}
            className="border border-gray w-[350px] h-[50px] rounded-xl px-4"
          />
        </View>
        <View className="flex flex-row justify-between m-3">
          <Button
            text={i18n.t("library.collection.btnCancel")}
            otherStyles="w-[45%] bg-gray-200 p-3 rounded-xl flex justify-center"
            onPress={handleCloseBottomSheet}
          />
          <Button
            text={i18n.t("library.collection.btnCreate")}
            otherStyles="w-[50%] bg-blue-500 p-3 rounded-xl flex justify-center"
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
                placeholder={i18n.t("library.search")}
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
                  : i18n.t("library.startTime")}
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
                {endDate
                  ? endDate.toLocaleDateString()
                  : i18n.t("library.endTime")}
              </Text>
              <View className="mr-1">
                <AntDesign name="caretdown" size={12} color="black" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          text={i18n.t("library.filter")}
          otherStyles="w-full bg-gray-200 p-3 rounded-xl flex justify-center mt-4 mb-2"
          onPress={() => {
            // setQuizzes([]); // Xóa danh sách hiện tại
            setSkip(0);
            filter(0);
          }}
        />
        <Button
          text={i18n.t("library.btnFresh")}
          onPress={resetFilters}
          otherStyles={
            "bg-primary p-3 rounded-xl flex items-center justify-center"
          }
        />
      </BottomSheet>

      <View className="flex-1 bg-white">
        {/* Tabs */}
        <View className="flex flex-row justify-around items-center h-[60px] mt-[40px]">
          {/* Tab Thư viện của tôi */}
          <TouchableOpacity onPress={() => handleTabChange("library")}>
            <Text
              className={`font-normal text-[18px] ${
                activeTab === "library"
                  ? "text-black font-bold"
                  : "text-gray-500"
              }`}
            >
              {i18n.t("library.library")}
            </Text>
          </TouchableOpacity>

          {/* Tab Bộ sưu tập */}
          <TouchableOpacity onPress={() => handleTabChange("collection")}>
            <Text
              className={`font-normal text-[18px] ${
                activeTab === "collection"
                  ? "text-black font-bold"
                  : "text-gray-500"
              }`}
            >
              {i18n.t("library.collection.title")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleTabChange("shared")}>
            <Text
              className={`font-normal text-[18px] ${
                activeTab === "shared"
                  ? "text-black font-bold"
                  : "text-gray-500"
              }`}
            >
              {i18n.t("library.quizShared.title")}
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
          <View>
            {/* Nội dung của Thư viện của tôi */}
            <View className="flex flex-row justify-between items-center p-3 ml-2">
              <Button
                onPress={CreateNewBottomSheet}
                text={i18n.t("library.quizCreated")}
                icon={<AntDesign name="plus" size={16} color="white" />}
                otherStyles={"justify-center p-4"}
                textStyles={"text-center text-white"}
              />
              <View className="flex-row items-center justify-center mr-2">
                <Button
                  text={i18n.t("library.filter")}
                  icon={
                    <Ionicons name="options-outline" size={16} color="white" />
                  }
                  onPress={FilterBottomSheet}
                  otherStyles={"bg-primary p-4 rounded-xl"}
                />
              </View>
            </View>
            <View
              style={{
                height: "80%",
                padding: 12,
              }}
            >
              {quizzes.length > 0 ? (
                <AntiFlatList
                  colSpan={2}
                  isRefreshing={isRefreshing}
                  componentItem={ComponentItem}
                  loading={quizFetching}
                  handleLoadMore={handleLoadMore}
                  data={quizzes}
                  handleRefresh={handleRefresh}
                />
              ) : (
                <QuizEmptyLottie />
              )}
            </View>
          </View>
        )}

        {activeTab === "collection" && (
          <View className="p-3">
            <Button
              icon={<AntDesign name="plus" size={16} color="white" />}
              onPress={OpenBottomSheet}
              text={i18n.t("library.collection.createNewCollection")}
              otherStyles={"w-1/2 justify-center p-4"}
              textStyles={"text-center text-white"}
            />
            {collections.length > 0 ? (
              <ScrollView className="mb-[180px]">
                {collections.map((name) => (
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
                      <AntDesign name="right" size={18} color="black" />
                    </View>
                    <View className="h-[1px] w-full bg-gray"></View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <QuizEmptyLottie />
            )}
          </View>
        )}

        {activeTab === "shared" && (
          <View
            style={{
              height: "80%",
              padding: 12,
            }}
          >
            {sharedQuizzes.length > 0 ? (
              <AntiFlatList
                colSpan={2}
                isRefreshing={isRefreshingShared}
                componentItem={ComponentItem}
                loading={quizLoading}
                handleLoadMore={handleLoadMoreQuizShared}
                data={sharedQuizzes}
                handleRefresh={handleRefreshQuizShared}
                handleDelete={(quiz) => handleDeleteQuizShared(quiz._id)}
              />
            ) : (
              <QuizEmptyLottie />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default Library;

import { ActivityIndicator, Text, View, } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Modalize } from "react-native-modalize";
import React, { useCallback, useContext, useEffect, useRef, useState, } from "react";
import { API_URL, API_VERSION, END_POINTS } from "@/configs/api.config";
import { useAppProvider } from "@/contexts/AppProvider";
import { MultipleSelectList, SelectList, } from "@10102004tan/react-native-select-dropdown-v2";
import { useSubjectProvider } from "@/contexts/SubjectProvider";
import QuizCard from "@/components/customs/QuizCard";
import QuizModal from "@/components/modals/QuizModal";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import CustomButton from "@/components/customs/CustomButton";
import AntiFlatList from "@/components/customs/AntiFlatList/AntiFlatList";
import { useResultProvider } from "@/contexts/ResultProvider";
import LockFeature from "@/components/customs/LockFeature";
import { AuthContext } from "@/contexts/AuthContext";
import { teacherStatusCode } from "@/utils/statusCode";
import SearchBar from "react-native-dynamic-search-bar";
import { Keyboard } from 'react-native'
import { convertSubjectToDataKeyValue } from "@/utils";
import QuizListSkeleton from "@/components/customs/QuizListSkeleton";


// col span : 4 => full width, 2 => half width
const COL_SPAN = 2;
export default function SearchScreen() {
  const LIMIT = 10;
  const { subjectId } = useLocalSearchParams();
  const { setIsHiddenNavigationBar,i18n } = useAppProvider();
  const [key,setKey] = useState("");
  const modalizeRef = useRef(null);
  const [quizList, setQuizList] = useState([]);
  const [dataSubject, setDataSubject] = useState([]);
  const { subjects } = useSubjectProvider();
  const { fetchResultData } = useResultProvider();
  const { teacherStatus } = useContext(AuthContext);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [load, setLoad] = useState(false);
  const [filter, setFilter] = useState({
    quiz_on: -1,
    subjectIds: subjectId ? [subjectId] : [],
    key,
    sortStatus: -1,
    skip: 0,
    limit: LIMIT,
  });
  const dataQuizOn = [
    {
      key: -1,
      value: i18n.t("search.all"),
    },
    {
      key: 10,
      value: "10+",
    },
    {
      key: 100,
      value: "100+"
    },
    {
      key: 500,
      value: "500+",
    },
    {
      key: 1000,
      value: "1000+",
    },
  ];
  const dataStatus = [
    {
      key: -1,
      value: i18n.t("search.newest"),
    },
    {
      key: 1,
      value: i18n.t("search.oldest"),
    },
  ];
  const [filterModalize, setFilterModalize] = useState(filter);


  // for subjectId from home page to search page

  useEffect(() => {
    setIsFirstLoad(true);
    if (!isFirstLoad) {
      setSelectedSubject([subjectId]);
      setFilterModalize((prev) => ({
        ...prev,
        subjectIds: [subjectId],
      }));
      setFilter((prev) => ({
        ...prev,
        skip: 0,
        subjectIds: [subjectId],
      }));
    }
  }, [load]);
  // convert subject data to key value in mutiple dropdown
  useEffect(() => {
    const dataConvert = convertSubjectToDataKeyValue(subjects);
    setDataSubject(dataConvert);
  }, []);
  // for multi filter in  subjectIds
  useEffect(() => {
    if (!isFirstLoad) {
      setFilterModalize((prev) => ({
        ...prev,
        subjectIds: selectedSubject,
      }));
    }
  }, [selectedSubject]);
  // optimize for filter v2

  useEffect(() => {
    handleFilterAndSearch(filter);
  }, [filter]);

  // process modal
  const onClose = async () => {
    setIsHiddenNavigationBar(false);
  };
  const onOpenModal = (item) => {
    setSelectedQuiz(item);
    setIsOpenModal(true);
  };
  const handleNavigateToQuiz = async () => {
    setIsOpenModal(false);
    const fetchedResult = await fetchResultData({
      quizId: selectedQuiz._id,
      type: "publish",
    });
    if (fetchedResult) {
      router.push({
        pathname: "/(home)/activity",
      });
    } else {
      router.push({
        pathname: "(play)/single",
        params: { quizId: selectedQuiz._id, type: "publish" },
      });
    }
  };
  /*
  * first loading => call with filter default
  * loadmore => call with filter change skip + 1
  * search => click icon search => get key to search, click icon x => key return empty
  * filter in Modalize
  * */
  const handleFilterAndSearch = (filter) => {

    fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_SEARCH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filter),
    })
      .then((res) => res.json())
      .then((data) => {


        if (data.statusCode !== 200) return;

        // set isFirstLoad
        isFirstLoad && setIsFirstLoad(false);

        isRefreshing && setIsRefreshing(false);

        filter.skip === 0 ? setQuizList(data.metadata) : setQuizList((prevQuizList) => [...prevQuizList, ...data.metadata]);
        })
        .catch((err) => {
          console.error(err);
          setIsRefreshing(false);
        });
  }
  const handleSearchBar = () => {
    if (!loading) {
      setIsFirstLoad(true);
      setFilter((prev) => {
        return {
          ...prev,
          key,
          skip: 0
        };
      });
      // hidden key board
      Keyboard.dismiss();
    }
  }
  const handleClearSearchBar = () => {
    if (key === "") return;
    setFilter((prev) => {
      setIsFirstLoad(true);
      return {
        ...prev,
        key: "",
        skip: 0
      };
    });
  }
  const handleFilter = () => {
    setIsFirstLoad(true);
    setFilter((prev) => {
      return {
        ...prev,
        skip: 0,
        sortStatus: filterModalize.sortStatus,
        subjectIds: filterModalize.subjectIds,
        quiz_on: filterModalize.quiz_on
      }
    });

    // hidden modal
    closeModalize();
  }
  const handleResetFilter = () => {
    setFilter({
      quiz_on: -1,
      subjectIds: [],
      key: "",
      sortStatus: -1,
      skip: 0,
      limit: LIMIT,
    });
    setSelectedSubject([]);
  };
  const handleLoadMore = async () => {
    if (!loading && quizList.length >= LIMIT) {
      setFilter((prev) => {
        return {
          ...prev,
          skip: prev.skip + LIMIT,
        };
      });
    }
  };
  const handleRefresh = () => {
    setIsRefreshing(true);
    setFilter((prev) => {
      return {
        ...prev,
        skip: 0
      }
    });
  };
  // component item for AntiFlatList
  const ComponentItem = ({ data }) => {
    return (
      <QuizCard
        quiz_thumb={data.quiz_thumb}
        quiz_name={data.quiz_name}
        quiz_turn={data.quiz_turn}
        createdAt={data.createdAt}
        question_count={data.question_count}
        user_avatar={data.user_avatar}
        user_fullname={data.user_fullname}
        onPress={() => onOpenModal(data)}
      />
    );
  };
  // end component item for AntiFlatList
  // component item header for Modalize
  const ComponentHeaderModalize = () => {
    return (
        <View className={"py-2 flex-row items-center justify-between"}>
          <View className={"flex-row items-center gap-1 mb-3"}>
            <AntDesign name={"filter"} size={20}/>
            <Text className={"text-xl"}>{i18n.t("search.filter")} </Text>
          </View>
          <AntDesign onPress={closeModalize} name={"closesquareo"} size={24}/>
        </View>
    )
  }
  const closeModalize = () => {
    setIsHiddenNavigationBar(true);
    modalizeRef.current?.close();
  }
  const onOpenModalize = () => {
    setIsHiddenNavigationBar(true);
    modalizeRef.current?.open();
  };

  if (teacherStatus !== teacherStatusCode.ACTIVE && teacherStatus) {
    return <LockFeature />;
  }

  return (
      <View className={"px-3 pt-2 pb-[80px] h-full"}>
        <View className={"flex-row items-center mb-3"}>
          <SearchBar
              placeholder={i18n.t("search.placeholder")}
              onClearPress={handleClearSearchBar}
              onSearchPress={handleSearchBar}
              onBlur={handleSearchBar}
              onChangeText={(text) => setKey(text)}
          />
          <AntDesign onPress={onOpenModalize} name={"filter"} size={30} />
        </View>

      {/* check first load*/}
      {
        isFirstLoad || isRefreshing ? (
          <QuizListSkeleton />
        ) : (
          <AntiFlatList
            colSpan={COL_SPAN}
            handleRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            componentItem={ComponentItem}
            handleLoadMore={handleLoadMore}
            loading={loading}
            data={quizList}
          />)}
      <Modalize
      onClose={onClose}
      panGestureEnabled={false}
      modalStyle={{ zIndex: 1000, elevation: 10, padding: 10 }}
      avoidKeyboardLikeIOS={true}
      withHandle={false}
      HeaderComponent={ComponentHeaderModalize}
      scrollViewProps={{ showsVerticalScrollIndicator: false }}
      ref={modalizeRef}
  >
    <View className={"mb-3"}>
      <Text className={"mb-2 px-1 font-semibold"}>{i18n.t("search.plays")}</Text>
      <SelectList
          defaultOption={dataQuizOn.find(
              (item) => item.key === filterModalize.quiz_on
          )}
          search={false}
          save={"key"}
          setSelected={(val) => {
            setFilterModalize((prev) => {
              return {
                ...prev,
                quiz_on: val,
              };
            });
          }}
          data={dataQuizOn}
          isFixV2={true}
          arrowicon={<AntDesign name="down" size={12} color={"black"} />}
      />
    </View>
    <View className={"mb-3"}>
      {/*data quiz on*/}
      <Text className={"mb-2 px-1 font-semibold"}>{i18n.t("search.status")}</Text>
      <SelectList
          defaultOption={dataStatus.find(
              (item) => item.key === filterModalize.sortStatus
          )}
          search={false}
          save={"key"}
          setSelected={(val) => {
            setFilterModalize((prev) => {
              return {
                ...prev,
                sortStatus: val,
              };
            });
          }}
          data={dataStatus}
          isFixV2={true}
          arrowicon={<AntDesign name="down" size={12} color={"black"} />}
      />
    </View>
    <View className={"mb-3"}>
      <Text className={"mb-2 px-1 font-semibold"}>{i18n.t("search.subject")}</Text>
      <MultipleSelectList
          save="key"
          data={dataSubject}
          defaultOption={dataSubject.filter((item) =>
              filterModalize.subjectIds.includes(item.key)
          )}
          setSelected={(val) => {
            setSelectedSubject(val);
          }}
      />
    </View>

    {/*button*/}
        <View className={"flex-row gap-2"}>
          <CustomButton
              className={"flex-1"}
              title={i18n.t("search.btnFilter")}
              bg={"#fff"}
              color={"#000"}
              onPress={handleFilter}
              />
          <CustomButton
              className={"flex-1"}
              title={i18n.t("search.btnReset")}
              onPress={handleResetFilter}
          />
        </View>

      </Modalize>
      <QuizModal
        visible={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        quiz={selectedQuiz}
        onStartQuiz={handleNavigateToQuiz}
      />
    </View>
  );
}

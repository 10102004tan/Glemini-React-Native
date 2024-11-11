import {
    View,
    Text,
    TextInput,
    FlatList,
    RefreshControl,
    ActivityIndicator
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import {Modalize} from "react-native-modalize";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {API_VERSION,API_URL,END_POINTS} from "@/configs/api.config";
import {useAppProvider} from "@/contexts/AppProvider";
import {SelectList,MultipleSelectList} from "@10102004tan/react-native-select-dropdown-v2";
import {useSubjectProvider} from "@/contexts/SubjectProvider";
import QuizCard from "@/components/customs/QuizCard";
import QuizEmpty from "@/components/customs/QuizEmpty";
import QuizModal from "@/components/modals/QuizModal";
import {router} from "expo-router";
import CustomButton from "@/components/customs/CustomButton";
import useDebounce from "@/hooks/useDebounce";

export default function SearchScreen() {
    const LIMIT = 10;
    const {setIsHiddenNavigationBar} = useAppProvider();
    const modalizeRef = useRef(null);
    const [quizList, setQuizList] = useState([]);
    const [dataSubject, setDataSubject] = useState([]);
    const {subjects} = useSubjectProvider();
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [loading,setLoading] = useState(false);
    const [isRefreshing,setIsRefreshing] = useState(false);
    const [isFirstLoad,setIsFirstLoad] = useState(true);
    const [selectedSubject,setSelectedSubject] = useState([]);
    const defaultFilter = {
        quiz_on:-1,
        subjectIds:[],
        key:"",
        sortStatus:-1,
        skip:0,
        limit:LIMIT
    };

    /*
    * sortStatus: 1: cũ nhất, -1: mới nhất
    *
    *
    * */
    const [filter, setFilter] = useState({
        quiz_on:-1,
        subjectIds:[],
        key:"",
        sortStatus:-1,
        skip:0,
        limit:LIMIT
    });

    const dataQuizOn = [
        {
            key: -1,
            value: "Tất cả"
        },
        {
            key: 10,
            value: "10+"
        },
        {
            key: 100,
            value: "100+"
        },
        {
            key: 500,
            value: "500+"
        },{
            key: 1000,
            value: "1000+"
        }
    ]
    const dataStatus = [
        {
            key: -1,
            value: "Mới nhất"
        },
        {
            key: 1,
            value: "Cũ nhất"
        },
    ];



    useEffect(() => {
        console.log("FETCH");
        fetchQuiz();
        convertSubjectToDataKeyValue();
    }, []);



    useEffect(() => {
        setFilter((prev)=>{
            return {
                ...prev,
                subjectIds:selectedSubject
            }
        });
        if (!isFirstLoad){
            debouncedFetchQuiz();
        }

    }, [filter.quiz_on,filter.sortStatus,selectedSubject,debouncedFetchQuiz]);

    const convertSubjectToDataKeyValue = () => {
        if (subjects.length === 0) return;
        const data = subjects.map((item) => {
            return {
                key: item._id,
                value: item.name
            }
        });
        setDataSubject(data);
    }

    const onOpen = () => {
        setIsHiddenNavigationBar(true);
        modalizeRef.current?.open();
    };

    const onClose = async () => {
        setIsHiddenNavigationBar(false);
    }


    const onOpenModal = (item) => {
        setSelectedQuiz(item);
        setIsOpenModal(true);
    }


   const fetchQuiz = () =>{
       // Call API
       setLoading(true);
       fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_SEARCH}`,{
           method:'POST',
           headers:{
               'Content-Type':'application/json'
           },
           body:JSON.stringify(filter)
       })
           .then(res => res.json())
           .then(data => {
               if (data.statusCode === 200) {
                   setQuizList((prev)=>{
                       return [...prev,...data.metadata]
                   });
               }
               setLoading(false);
               setIsFirstLoad(false);
           })
           .catch(err => {
               console.error(err);
               setLoading(false);
               setIsFirstLoad(false);
           });
   }

   const handleLoadMore = () =>{
        if (!loading && quizList.length >= LIMIT) {
            setFilter((prev)=>{
                return {
                    ...prev,
                    skip:prev.skip + LIMIT
                }
            });
            fetchQuiz();
        }
   }

   const onRefresh = () =>{
        setIsRefreshing(true);
        setFilter((prev)=>{
           const newFilter = {
                ...prev,
                skip:0
           };

            fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_SEARCH}`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(newFilter)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.statusCode === 200) {
                        setQuizList(data.metadata);
                    }
                    setIsRefreshing(false);
                })
                .catch(err => {
                    console.error(err);
                    setIsRefreshing(false);
                });
            return newFilter;
        });

   }

    const renderFooter = () => {
        //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (!loading) return null;
        return (
            <ActivityIndicator
                style={{ color: '#000' }}
            />
        );
    };

    const renderItem  = useCallback(({item}) => {
        return (
            <QuizCard
                quiz_thumb={item.quiz_thumb}
                quiz_name={item.quiz_name}
                quiz_turn={item.quiz_turn}
                createdAt={item.createdAt}
                question_count={item.question_count}
                onPress={() => onOpenModal(item)}/>
        )},[]);

    const onSearch = () => {
        fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.QUIZ_SEARCH}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(filter)
        })
            .then(res => res.json())
            .then(data => {
                if (data.statusCode === 200) {
                    setQuizList(data.metadata);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }

    const handleNavigateToQuiz = () => {
        setIsOpenModal(false);
        router.push({
            pathname: '/(play)/single',
            params:{
                quizId: selectedQuiz._id
            }
        });
    };

    const debouncedFetchQuiz = useDebounce(onRefresh,2000);

    const handleResetFilter = () => {
        setFilter({
            quiz_on:-1,
            subjectIds:[],
            key:"",
            sortStatus:-1,
            skip:0,
            limit:LIMIT
        });
        setSelectedSubject([]);
    }

    if (isFirstLoad) {
        return (
            <View className={"flex-1 justify-center items-center"}>
                <ActivityIndicator/>
            </View>
        )
    }

    return (
        <View  className={"px-3 pt-2 bg-white pb-[80px] h-full"}>
            <View className={"flex-row items-center mb-3"}>
                <TextInput value={filter.key} onBlur={onSearch} onChangeText={(val) => {setFilter((prev)=>{
                    return {
                        ...prev,
                        key:val,
                        skip:0
                    }
                })}}
                           className={"p-2 mr-2 rounded bg-white border flex-1"} placeholder={"Search"}/>
                <AntDesign onPress={onOpen} name={"filter"} size={30}/>
            </View>

            {/*check empty list*/}
            {
                quizList.length === 0 ? <QuizEmpty/> :(
                    <FlatList
                        removeClippedSubviews={true}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={renderFooter}
                        onEndReachedThreshold={0.1}
                        onEndReached={handleLoadMore}
                        maxToRenderPerBatch={10}
                        updateCellsBatchingPeriod={50}
                        initialNumToRender={10}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        numColumns={2} data={quizList} renderItem={renderItem}/>
                )
            }

            <Modalize onClose={onClose} modalStyle={{zIndex:1000,elevation:10,padding:10}} avoidKeyboardLikeIOS={true}  withHandle={false} scrollViewProps={{showsVerticalScrollIndicator: true}} ref={modalizeRef} >
                <View className={"mb-3"}>
                    {/*data quiz on*/}
                    <Text className={"mb-2 px-1 font-semibold"}>Lượt chơi</Text>
                    <SelectList  defaultOption={dataQuizOn.find(item => item.key === filter.quiz_on)} search={false} save={"key"} setSelected={(val)=>{
                        setFilter((prev)=>{
                            return {
                                ...prev,
                                quiz_on:val
                            }
                        })
                    }} data={dataQuizOn} isFixV2={true} arrowicon={<AntDesign name="down" size={12} color={"black"}/>}/>
                </View>
                <View className={"mb-3"}>
                    {/*data quiz on*/}
                    <Text className={"mb-2 px-1 font-semibold"}>Trạng thái</Text>
                    <SelectList defaultOption={dataStatus.find((item=>item.key===filter.sortStatus))} search={false} save={"key"} setSelected={(val)=>{setFilter((prev)=>{
                        return {
                            ...prev,
                            sortStatus: val
                        }
                    })}} data={dataStatus}  isFixV2={true} arrowicon={<AntDesign name="down" size={12} color={"black"}/>}/>
                </View>
                <View className={"mb-3"}>
                    <Text className={"mb-2 px-1 font-semibold"}>Chủ đề</Text>
                    <MultipleSelectList  save="key" data={dataSubject} defaultOption={dataSubject.filter((item)=>filter.subjectIds.includes(item.key))} setSelected={(val)=>{
                       setSelectedSubject(val);
                    }} />
                </View>

            {/*    button*/}
                <CustomButton className={"flex-1"} title={"Đặt lại"} onPress={handleResetFilter}/>
            </Modalize>

            <QuizModal
                visible={isOpenModal}
                onClose={() => setIsOpenModal(false)}
                quiz={selectedQuiz}
                onStartQuiz={handleNavigateToQuiz}
            />
        </View>
    )
}



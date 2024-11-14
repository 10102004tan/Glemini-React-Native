import {
    View,
    Text,
    TextInput,
    FlatList,
    RefreshControl,
    ActivityIndicator, Platform
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import {Modalize} from "react-native-modalize";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {API_VERSION,API_URL,END_POINTS} from "@/configs/api.config";
import {useAppProvider} from "@/contexts/AppProvider";
import {SelectList,MultipleSelectList} from "@10102004tan/react-native-select-dropdown-v2";
import {useSubjectProvider} from "@/contexts/SubjectProvider";
import QuizCard from "@/components/customs/QuizCard";
import QuizModal from "@/components/modals/QuizModal";
import {router, useLocalSearchParams} from "expo-router";
import CustomButton from "@/components/customs/CustomButton";
import useDebounce from "@/hooks/useDebounce";
import AntiFlatList from "@/components/customs/AntiFlatList/AntiFlatList";
import { useResultProvider } from "@/contexts/ResultProvider";

// col span : 4 => full width, 2 => half width
const COL_SPAN = 2;
export default function SearchScreen() {
    const LIMIT = 10;
    const {subjectId} = useLocalSearchParams()
    const {setIsHiddenNavigationBar} = useAppProvider();
    const modalizeRef = useRef(null);
    const [quizList, setQuizList] = useState([]);
    const [dataSubject, setDataSubject] = useState([]);
    const {subjects} = useSubjectProvider();
    const {fetchResultData} = useResultProvider()
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [loading,setLoading] = useState(false);
    const [isRefreshing,setIsRefreshing] = useState(false);
    const [isFirstLoad,setIsFirstLoad] = useState(true);
    const [selectedSubject,setSelectedSubject] = useState([]);
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
        if (subjectId) {
            setSelectedSubject([subjectId]);
            setFilter((prev) => ({
                ...prev,
                subjectIds: [subjectId],
            }));
        }
    }, [subjectId]);

    useEffect(() => {
        fetchQuiz();
        convertSubjectToDataKeyValue();
    }, []);

    useEffect(() => {
        if (!isFirstLoad){
            debouncedFetchQuiz();
        }

    }, [filter.quiz_on,filter.sortStatus,selectedSubject,debouncedFetchQuiz]);

    useEffect(() => {
        if (!isFirstLoad) {
            setFilter((prev) => ({
                ...prev,
                subjectIds: selectedSubject,
            }));
        }
    }, [selectedSubject]);

    useEffect(() => {
        if (!isFirstLoad){
            fetchQuiz();
        }
    }, [filter.skip]);

    // utils
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


    // process modal
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


   //  FETCH QUIZ api
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

   const handleLoadMore = async () =>{
        if (!loading && quizList.length >= LIMIT) {
            setFilter((prev)=>{
                return {
                    ...prev,
                    skip:prev.skip + LIMIT
                }
            });
        }
   }

    const handleSearch = () => {
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

    const handleRefresh = () =>{
        setIsRefreshing(true);
        setFilter((prev)=>{
            const newFilter = {
                ...prev,
                skip:0,
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

    const handleNavigateToQuiz = async () => {
        // setIsOpenModal(false);
        // router.push({
        //     pathname: '/(play)/single',
        //     params:{
        //         quizId: selectedQuiz._id
        //     }
        // });
        setIsOpenModal(false);
		const fetchedResult = await fetchResultData({ quizId: selectedQuiz._id, type: 'publish' });
		if (fetchedResult) {
			router.push({
				pathname: '/(home)/activity',
			});
		} else {
			router.push({
				pathname: '(play)/single',
				params: { quizId: selectedQuiz._id, type: 'publish' }
			});
		}
    };

    // component item for AntiFlatList
    const ComponentItem = ({data}) => {
        return <QuizCard
            quiz_thumb={data.quiz_thumb}
            quiz_name={data.quiz_name}
            quiz_turn={data.quiz_turn}
            createdAt={data.createdAt}
            question_count={data.question_count}
            user_avatar={data.user_avatar}
            user_fullname={data.user_fullname}
            onPress={() => onOpenModal(data)}/>
    }
    // end component item for AntiFlatList





    // debounced fetch quiz
    const debouncedFetchQuiz = useDebounce(handleRefresh,2000);


    // check loading for first load
    if (isFirstLoad) {
        return (
            <View className={"flex-1 justify-center items-center"}>
                <ActivityIndicator/>
            </View>
        )
    }

    return (
        <View  className={"px-3 pt-2 pb-[80px] h-full"}>
            <View className={"flex-row items-center mb-3"}>
                <TextInput value={filter.key} onBlur={handleSearch} onChangeText={(val) => {setFilter((prev)=>{
                    return {
                        ...prev,
                        key:val,
                        skip:0
                    }
                })}}
                           className={"p-2 mr-2 rounded bg-white border flex-1"} placeholder={"Search"}/>
                <AntDesign onPress={onOpen} name={"filter"} size={30}/>
            </View>

            {/*<RecycleTestComponent/>*/}
            <AntiFlatList colSpan={COL_SPAN} handleRefresh={handleRefresh} isRefreshing={isRefreshing} componentItem={ComponentItem} handleLoadMore={handleLoadMore} loading={loading} data={quizList}/>

            <Modalize snapPoint={600} onClose={onClose} modalStyle={{zIndex:1000,elevation:10,padding:10}} avoidKeyboardLikeIOS={true}  withHandle={false} scrollViewProps={{showsVerticalScrollIndicator: true}} ref={modalizeRef} >
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



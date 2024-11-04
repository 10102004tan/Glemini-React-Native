import {View, Text, TextInput, FlatList, Image, Button, TouchableOpacity, Modal} from "react-native";
import CustomInput from "@/components/customs/CustomInput";
import Field from "@/components/customs/Field";
import AntDesign from "@expo/vector-icons/AntDesign";
import {Modalize} from "react-native-modalize";
import React, {useEffect, useRef, useState} from "react";
import {API_VERSION,API_URL,END_POINTS} from "@/configs/api.config";
import {useAppProvider} from "@/contexts/AppProvider";
import {SelectList} from "@10102004tan/react-native-select-dropdown-v2";
import {MultipleSelectList} from "react-native-dropdown-select-list";
import {useSubjectProvider} from "@/contexts/SubjectProvider";
import moment from "moment";
import QuizCard from "@/components/customs/QuizCard";
import QuizEmpty from "@/components/customs/QuizEmpty";
import QuizModal from "@/components/modals/QuizModal";
import SkeletonListQuiz from "@/components/customs/SkeletonListQuiz";
import DropDownMultipleSelect from "@/components/customs/DropDownMultipleSelect";

export default function SearchScreen() {
    const LIMIT = 10;
    const {setIsHiddenNavigationBar} = useAppProvider();
    const modalizeRef = useRef(null);
    const [key, setKey] = useState("");
    const [quizList, setQuizList] = useState([]);
    const [dataSubject, setDataSubject] = useState([]);
    const {subjects} = useSubjectProvider();
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState({
        quiz_on:-1,
        subjectIds:[],
        key:"",
        sortStatus:1,
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
        onSearch();
        convertSubjectToDataKeyValue();
    }, []);

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

    const onSearch = async () => {
        // Call API
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
            })
            .catch(err => console.error(err));
    };

    const onOpen = () => {
        setIsHiddenNavigationBar(true);
        modalizeRef.current?.open();
    };

    const onClose = async () => {
        onSearch();
        setIsHiddenNavigationBar(false);
        // modalizeRef.current?.close();
    }


    const onOpenModal = (item) => {
        setSelectedQuiz(item);
        setIsOpenModal(true);
    }

    const loadMore = async ()=>{
        setFilter((prev)=>{
            return {
                ...prev,
                skip:prev.skip+LIMIT
            }
        })
        await onSearch();
    }

    return (
        <View className={"px-3 pt-2 bg-white pb-[80px] h-full"}>
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
                        onEndReached={loadMore} numColumns={2} data={quizList} renderItem={(item) => {
                        const itemData = item.item;
                        return (
                            <QuizCard createdAt={itemData.createdAt} quiz_turn={itemData.quiz_turn} quiz_name={itemData.quiz_name} quiz_thumb={itemData.quiz_thumb} onPress={()=>{onOpenModal(itemData)}}/>
                        )
                    }}/>
                )
            }

            <Modalize onClose={onClose} modalStyle={{zIndex:1000,elevation:10,padding:10}} avoidKeyboardLikeIOS={true}  withHandle={false} scrollViewProps={{showsVerticalScrollIndicator: true}} ref={modalizeRef} snapPoint={300}>
                <View className={"mb-3"}>
                    {/*data quiz on*/}
                    <Text className={"mb-2 px-1 font-semibold"}>Lượt chơi</Text>
                    <SelectList onEndReached={()=>{console.log("test")}} defaultOption={dataQuizOn.find(item => item.key === filter.quiz_on)} search={false} save={"key"} setSelected={(val)=>{
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
                    <DropDownMultipleSelect data={dataSubject}/>
                </View>
            </Modalize>

            <QuizModal
                visible={isOpenModal}
                onClose={() => setIsOpenModal(false)}
                quiz={selectedQuiz}
            />
        </View>
    )
}



import {View, Text, TextInput, FlatList, Image, Button, TouchableOpacity} from "react-native";
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
import DatePicker from "react-native-date-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function SearchScreen() {

    const {setIsHiddenNavigationBar} = useAppProvider();
    const modalizeRef = useRef(null);
    const [key, setKey] = useState("");
    const [quizList, setQuizList] = useState([]);
    const [dataSubject, setDataSubject] = useState([]);
    const {subjects} = useSubjectProvider();
    const [filter, setFilter] = useState({
        quiz_on:0,
        sort:0,
        subjectIds:[],
        key:""
    });

    const dataQuizOn = [
        {
            key: 0,
            value: "Tất cả"
        },
        {
            key: 1,
            value: "10+"
        },
        {
            key: 2,
            value: "100+"
        },
        {
            key: 3,
            value: "500+"
        },{
            key: 4,
            value: "1000+"
        }
    ]
    const dataStatus = [
        {
            key: 0,
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
                    setQuizList(data.metadata);
                }
            })
            .catch(err => console.error(err));
    };

    const onOpen = () => {
        setIsHiddenNavigationBar(true);
        modalizeRef.current?.open();
    };

    const onClose = () => {
        setIsHiddenNavigationBar(false);
        modalizeRef.current?.close();
    }

    return (
        <View className={"px-3 pt-2 bg-white pb-[150px]"}>
            <View className={"flex-row items-center mb-3"}>
                <TextInput onBlur={onSearch} onChangeText={()=>{
                    setFilter({...filter,key:key})
                }} value={filter.key}
                           className={"p-2 mr-2 rounded bg-white border flex-1"} placeholder={"Search"}/>
                <AntDesign onPress={onOpen} name={"filter"} size={30}/>
            </View>

            <FlatList numColumns={2} data={quizList} renderItem={(item) => {
                const itemData = item.item;
                return (
                    <View className={"flex-1 mx-1 mb-3 shadow"}>
                        <Image src={(itemData.quiz_thumb ? itemData.quiz_thumb : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh6bHzd2uppe-_V6EDiOfPEQa2fmIJDBWY3M80ivU0qJojhVdZJHOCMSvppIZx6w4gAQU&usqp=CAU")} className={"w-full h-[100px] rounded-b-[10px]"} alt={itemData.quiz_name}/>
                        <View className={"p-2"}>
                            <Text>{itemData.quiz_name}</Text>
                            <Text>Lượt chơi : {itemData.quiz_turn}</Text>
                        </View>
                    </View>
                )
            }}/>

            <Modalize onClose={()=>{
                setIsHiddenNavigationBar(false)
            }} modalStyle={{zIndex:1000,elevation:10,padding:10}} avoidKeyboardLikeIOS={true}  withHandle={false} scrollViewProps={{showsVerticalScrollIndicator: false}} ref={modalizeRef} snapPoint={300}>

                <View className={"mb-3"}>
                    {/*data quiz on*/}
                    <Text className={"mb-2 px-1 font-semibold"}>Lượt chơi</Text>
                    <SelectList search={false}  setSelected={()=>{}} data={dataQuizOn} defaultOption={dataQuizOn[0]} isFixV2={true} arrowicon={<AntDesign name="down" size={12} color={"black"}/>}/>
                </View>

                <View className={"mb-3"}>
                    {/*data quiz on*/}
                    <Text className={"mb-2 px-1 font-semibold"}>Trạng thái</Text>
                    <SelectList search={false}  setSelected={()=>{}} data={dataStatus} defaultOption={dataStatus[0]} isFixV2={true} arrowicon={<AntDesign name="down" size={12} color={"black"}/>}/>
                </View>
                <View className={"mb-3"}>
                    <Text className={"mb-2 px-1 font-semibold"}>Chủ đề</Text>
                    <MultipleSelectList setSelected={()=>{}} data={dataSubject}/>
                </View>
            </Modalize>
        </View>
    )
}

function DatePickerCustom({setTime,title}){
    const [isVisible, setIsVisible] = useState(false);
    return (
        <TouchableOpacity
            onPress={()=>{setIsVisible(true)}}
            className="flex-row border border-gray rounded-lg p-3 items-center justify-between mr-2"
        >
            <DateTimePickerModal
                isVisible={isVisible}
                mode="date"
                onConfirm={()=>{
                    setIsVisible(false);
                }}
                onCancel={()=>{setIsVisible(false)}}
            />
            <Text className="text-[12px] text-gray">
                Thời gian bắt đầu
            </Text>
            <View className="mr-1">
                <AntDesign name="caretdown" size={12} color="black" />
            </View>
        </TouchableOpacity>
    )
}
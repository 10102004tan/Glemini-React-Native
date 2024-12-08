import {ActivityIndicator, Alert, FlatList, Keyboard, Text, TouchableOpacity, View} from "react-native";
import { useLocalSearchParams, useGlobalSearchParams } from "expo-router";
import CustomInput from "@/components/customs/CustomInput";
import React, {useContext, useEffect, useRef, useState} from "react";
import CustomButton from "@/components/customs/CustomButton";
import { AuthContext } from "@/contexts/AuthContext";
import { API_URL, API_VERSION, END_POINTS } from "@/configs/api.config";
import Toast from "react-native-toast-message-custom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAppProvider} from "@/contexts/AppProvider";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import {Modalize} from "react-native-modalize";
import {useClassroomProvider} from "@/contexts/ClassroomProvider";
import DropdownSchoolSelected from "@/components/customs/DropdownSchoolSelected";

export default function ProfileEditScreen() {
    const {i18n} = useAppProvider();
    const {fetchDetailUser,userData:{accessToken,_id},userData,setUserData} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const modalizeRef = useRef(null);
    const [selectedSchool, setSelectedSchool] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [isOpenDropdownSchool, setIsOpenDropdownSchool] = useState(false);
    const [schools, setSchools] = useState([]);

    const {
        fetchFilterSchool
    } = useClassroomProvider();

    const [data, setData] = useState({
        email: "",
        fullname: "",
        schools: [],
    });

    useEffect(()=>{
        setIsLoading(true);
        fetchDetailUser().then(data=>{
            setData({
                email: data.user_email,
                fullname: data.user_fullname,
            });

            // set selected school
            setSelectedSchool(data.schools);
            setIsLoading(false);
        }).catch(err=>{
            console.log(err);
        });
    },[]);
    useEffect(() => {
        console.log('isOpenDropDownSchool::',isOpenDropdownSchool);
        if (isOpenDropdownSchool){
            fetchFilterSchool({keyword}).then((data)=>{
                setSchools(data);
            }).catch(e => {console.log(e);});
        }
    }, [isOpenDropdownSchool]);

    const handleSave = async() => {
        Keyboard.dismiss();
        //validate
        if (!data.email) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Email is required'
            })
            return;
        }

        if (!data.fullname) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Fullname is required'
            })
            return;
        }
        setIsLoading(true);
        fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.PROFILE_EDIT}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: `${accessToken}`,
                'x-client-id': _id,
            },
            body: JSON.stringify({
                email: data.email,
                fullname: data.fullname,
                schoolIds: selectedSchool.map(school=>school._id),
            })
        })
            .then((response) => response.json())
            .then(async (rs) => {
                if(rs.statusCode === 200){
                    // update name in context
                    const dataStore = { ...userData, user_fullname:data.fullname, user_email: data.email };
                    await AsyncStorage.setItem("userData", JSON.stringify(dataStore));
                    setUserData(dataStore);
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: 'Update profile successfully'
                    })
                }
                else {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: rs.message
                    })
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
            });
    };

    const SchoolItem = ({item,index}) => {
        return (
            <View className={"flex-row w-full gap-2 items-center mb-2"}>
                <FontAwesome5 name="school" size={16} color="black" />
                <View>
                    <Text className={"max-h-[40px] text-[10px] px-2 bg-gray rounded-[10px] text-white"}>{item.school_name.replace("- ","").trim()}</Text>
                </View>
                <AntDesign name={"delete"} onPress={()=>handleDeleteSchool(index)} size={16} color={"black"} />
            </View>
        )
    }

    const handleDeleteSchool = (index) => {
        Alert.alert(i18n.t("modal.titleDeleteSchool"), i18n.t("modal.textDeleteSchool"), [
            {
                text: i18n.t("modal.btnCancel"),
                onPress: () => {},
                style: "cancel"
            },
            {
                text: i18n.t("modal.ok"),
                onPress: () => {
                    setSelectedSchool(selectedSchool.filter((_, i) => i !== index));
                }
            }
        ], {cancelable: true});
    };
    const handleInputChange = (key, value) => {
        setData((prevData) => {
            return {
                ...prevData,
                [key]: value
            }
        });
    };
    const openAddSchoolModal = () => { modalizeRef.current?.open();};
    const handleSaveSchool = () => {
        modalizeRef.current?.close();
        setIsOpenDropdownSchool(false);
    };
    const handlerSearchSchool = async () => {
        await fetchFilterSchool({keyword}).then((data)=>{
            setSchools(data);
        }).catch(e => {
            console.log(e);
        });
    };
    const handlerSelectSchool = (item) => {
        // check if selectedSchool has item => remove
        let index = selectedSchool.findIndex((school) => school._id === item._id);
        if (index !== -1) {
            setSelectedSchool(selectedSchool.filter((school) => school._id !== item._id));
        } else {
            if (selectedSchool.length >= 2){
                Toast.show({
                    type: 'error',
                    text1: i18n.t('error.title'),
                    text2: i18n.t('error.maxSchool'),
                    visibilityTime: 2000,
                    autoHide: true,
                });
                return;
            }
            setSelectedSchool([...selectedSchool, item]);
        }
    };

    if (isLoading) {
        // loading icon
        return (
            <View className="h-[100%] bg-white items-center justify-center">
                <ActivityIndicator
                    style={{ color: '#000' }}
                />
            </View>
        );
    }

    return (
        <View>
            <View className="mx-3 mt-3">
                <CustomInput label={i18n.t("profile.email")} onChangeText={(value)=>handleInputChange('email',value)} value={data.email.trim()} />
                <CustomInput label={i18n.t("profile.fullname")} onChangeText={(value)=>handleInputChange('fullname',value)} value={data.fullname} />
                <View className="mb-3">
                    <View className={"flex-row gap-2 items-center mb-3"}>
                        <Text>{i18n.t("profile.titleSchool")}</Text>
                        <TouchableOpacity onPress={openAddSchoolModal}>
                            <Ionicons name={"add"} size={16} color={"black"} />
                        </TouchableOpacity>
                    </View>
                    <View className={"bg-white p-3 rounded"}>
                        <FlatList data={selectedSchool} renderItem={SchoolItem}/>
                    </View>
                </View>
                <CustomButton title={i18n.t("profile.save")} onPress={() => {handleSave()}} />
            </View>
            <Modalize
                panGestureEnabled={false}
                ref={modalizeRef}
                scrollViewProps={{ showsVerticalScrollIndicator: false,
                nestedScrollEnabled: true,
                scrollEventThrottle: 16
                }}
                avoidKeyboardLikeIOS={true}
                withHandle={false}
                modalStyle={{
                    backgroundColor: '#fff',
                    padding: 20,
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                    elevation: 5,
                    marginTop: 20,
                }}
            >
                <View className={"h-full bg-white"}>
                    <Text className="text-center text-xl font-bold">{i18n.t("profile.titleSchool")}</Text>
                    <DropdownSchoolSelected handlerSelectSchool={handlerSelectSchool} selectedSchool={selectedSchool} schools={schools} handlerSearchSchool={handlerSearchSchool} setKeyword={setKeyword} keyword={keyword} setIsOpenDropdownSchool={setIsOpenDropdownSchool} isOpenDropdownSchool={isOpenDropdownSchool}/>
                    <CustomButton title={i18n.t("profile.save")} onPress={handleSaveSchool} />
                </View>
            </Modalize>
        </View>
    )
}

